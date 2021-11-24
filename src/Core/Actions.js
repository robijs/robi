import { 
    Toast,
    LoadingBar,
    SvgDefs,
    Sidebar,
    AppContainer,
    MainContainer,
    FixedToast,
    Modal,
    BootstrapButton,
    ProgressBar,
    InstallConsole,
    Container,
    LoadingSpinner,
    ViewContainer
} from './Components.js'
import { Lists } from './Models.js'
import { App, Routes } from './Settings.js';
import Store from './Store.js'
import { ReleaseNotes } from './ViewParts.js'
import lists from '../lists.js';

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
export async function AddColumnToView(param) {
    const {
        list,
        view,
        name
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    const postOptions = {
        url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Views/GetByTitle('${view || 'All Items'}')/ViewFields/addViewField('${name}')`,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    const newField = await Post(postOptions);

    // Console success
    console.log(`Added to ${view || 'All Items'}: ${name}.`);

    // Append to install-console
    const installConsole = Store.get('install-console');

    if (installConsole) {
        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Added '${name}' to '${view || 'All Items'}' view</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
    }

    const progressBar = Store.get('install-progress-bar');

    if (progressBar) {
        progressBar.update();
    }

    return newField.d;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function AddLinks(param) {
    const {
        links,
    } = param;

    const head = document.querySelector('head');

    if (!links) {
        return;
    }

    links.forEach(link => head.append(createLinkElement(link)));

    function createLinkElement(link) {
        const {
            rel,
            as,
            href,
            path
        } = link;

        const linkElement = document.createElement('link');

        linkElement.setAttribute('rel', rel || 'stylesheet');

        if (as) {
            linkElement.setAttribute('as', as);
        }

        const relativePath = App.get('mode') === 'prod' ? `${App.get('site')}/${App.get('library')}/src` : `/src/`;

        // TODO: default relative path might not be right, test locally and on SP
        linkElement.setAttribute('href', `${path || relativePath}${href}`);

        return linkElement;
    }
}

/**
 * 
 * @param {*} param 
 */
export function AddStyle(param) {
    const {
        name,
        style
    } = param;

    const node = document.querySelector(`style[data-name='${name}']`);

    if (node) {
        node.remove();
    }

    const css = /*html*/ `
        <style type='text/css' data-name='${name || id}'>
            ${style}
        </style>
    `;
    const head = document.querySelector('head');

    head.insertAdjacentHTML('beforeend', css);
}

/**
 * 
 * @param {Object} param - Single function argument.
 * @param {String} param.string - Name of the SharePoint list.
 * @param {Number} param.id - SharePoint list item id.
 * @param {Files} param.files - Type FileList. From <input type='files'>. {@link https://developer.mozilla.org/en-US/docs/Web/API/FileList}
 * 
 * @returns {Object} SharePoint list item.
 */
export async function AttachFiles(param) {
    /** Destructure Interface */
    const {
        list,
        itemId,
        files
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // Upload responses
    const responses = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = file.name;
        const fileBuffer = await getFileBuffer(file);

        const upload = await fetch(`${App.get('site')}/_api/web/lists/getbytitle('${list}')/items(${itemId})/AttachmentFiles/add(FileName='${name}')`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json; odata=verbose',
                'content-type': 'application/json; odata=verbose',
                'X-RequestDigest': requestDigest,
            },
            body: fileBuffer
        });

        responses.push(upload);
    }

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            fileReader.onload = event => resolve(event.target.result);
            fileReader.readAsArrayBuffer(file);
        });
    }

    await Promise.all(responses);

    const getUpdatedItem = await Get({
        list,
        filter: `Id eq ${itemId}`,
        select: `Attachments,AttachmentFiles${list === ',References' ? 'Description' : ''}`,
        expand: 'AttachmentFiles',
    });

    return getUpdatedItem[0];
}

/**
 * Determines if role (defaults to current user's role from store.user().Role)
 * is authorized to access passed in view as string or objection property param.view
 * @param {(String|Object)} param most likely a View name as a string
 * @param {string} param.view if param is a object, view is a required property
 * @param {string} param.role if param is a object, role is an optional propety
 * @returns {(undefied|false|true)}
 */
export function Authorize(param) {
    let role, view;

    if (typeof param === 'string') {
        role = Store.user().Role;
        view = param;
    } else if (typeof param === 'object') {
        role = param.role || Store.user().Role;
        view = param.view;
    }

    /** Find route */
    const route = Store.routes().find(item => item.path === view);

    /** If route not found, return undefined */
    if (!route) {
        return;
    }

    const {
        roles
    } = route;

    /** If roles property not defined on route object, return undefined */
    if (roles) {
        if (roles.includes(role)) {
            /** Authorized if role is included in roles array */
            console.log(`Role ${role} authorized to access View ${view}.`)
            return true;
        } else {
            /** Unauthroized if role is not included in roles array */
            if (param.route !== false) {
                /** If param.route isn't set to false, route to View 403 */
                Route('403');
            }

            return false;
        }
    } else {
        return undefined;
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function CheckLists(param) {
    // Check lists
    const listsToIgnore =  ['App', 'Composed Looks', 'Documents', 'Master Page Gallery', 'MicroFeed', 'Site Assets', 'Site Pages'];
    const coreLists = Lists();
    const appLists = lists;
    const allLists = coreLists.concat(appLists);
    const webLists = await GetWebLists();
    const installedLists = webLists.map(item => item.Title).filter(x => allLists.map(item => item.list).includes(x));
    const diffToCreate = allLists.map(item => item.list).filter(x => !webLists.map(item => item.Title).includes(x));
    const diffToDelete = webLists.map(item => item.Title).filter(x => !allLists.map(item => item.list).includes(x) && !listsToIgnore.includes(x));
    
    console.log('All Lists:', allLists);
    console.log('Web Lists:', webLists);
    console.log('Installed Lists:', installedLists);
    console.log('Create:', diffToCreate);
    console.log('Delete:', diffToDelete);

    // News lists that need to be created
    const toCreate = diffToCreate.map(list => allLists.find(item => item.list === list));

    // Existing lists that need to be deleted
    const toDelete = diffToDelete.map(list => webLists.find(item => item.Title === list));

    // Has the schema changed on any lists?
    const fieldsToIgnore = ['ContentTypeId', 'Title', '_ModerationComments', 'File_x0020_Type', 'ID', 'Id', 'ContentType', 'Modified', 'Created', 'Author', 'Editor', '_HasCopyDestinations', '_CopySource', 'owshiddenversion', 'WorkflowVersion', '_UIVersion', '_UIVersionString', 'Attachments', '_ModerationStatus', 'Edit', 'LinkTitleNoMenu', 'LinkTitle', 'LinkTitle2', 'SelectTitle', 'InstanceID', 'Order', 'GUID', 'WorkflowInstanceID', 'FileRef', 'FileDirRef', 'Last_x0020_Modified', 'Created_x0020_Date', 'FSObjType', 'SortBehavior', 'PermMask', 'FileLeafRef', 'UniqueId', 'SyncClientId', 'ProgId', 'ScopeId', 'HTML_x0020_File_x0020_Type', '_EditMenuTableStart', '_EditMenuTableStart2', '_EditMenuTableEnd', 'LinkFilenameNoMenu', 'LinkFilename', 'LinkFilename2', 'DocIcon', 'ServerUrl', 'EncodedAbsUrl', 'BaseName', 'MetaInfo', '_Level', '_IsCurrentVersion', 'ItemChildCount', 'FolderChildCount', 'AppAuthor', 'AppEditor'];
    const schemaAdd = [];
    const schemaDelete = [];

    installedLists
    .map(listName => {
        const { list, fields } = allLists.find(item => item.list === listName);

        return { list, fields, web: webLists.find(item => item.Title === listName) };
    })
    .forEach(item => {
        const { list, fields, web } = item;

        const webFields = web.Fields.results.map(webField => {
            const { StaticName, TypeDisplayName } = webField;

            return { name: StaticName, type: TypeDisplayName }
        });

        const fieldsToCreate = fields.map(item => item.name).filter(x => !webFields.map(item => item.name).includes(x));
        const fieldsToDelete = webFields.map(item => item.name).filter(x => !fields.map(item => item.name).includes(x) && !fieldsToIgnore.includes(x));

        if (fieldsToCreate.length) {
            schemaAdd.push({
                list,
                fields: fieldsToCreate
            });
        }

        if (fieldsToDelete.length) {
            schemaDelete.push({
                list,
                fields: fieldsToDelete
            });
        }

        // console.log('List:', list);
        // console.log('--------------------');
        // console.log('List Fields:', fields);
        // console.log('Web Fields:', webFields);
        // console.log('Create fields:', fieldsToCreate);
        // console.log('Remove fields:', fieldsToDelete);
        // console.log(' ');
    });

    console.log('Fields to add:', schemaAdd);
    console.log('Fields to delete:', schemaDelete);

    return { toCreate, toDelete, schemaAdd, schemaDelete };
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Component(param) {
    const {
        name,
        store,
        toggle,
        html,
        inlineStyle,
        style,
        parent,
        position,
        onAdd
    } = param;

    let {
        events
    } = param;

    const id = Store.getNextId();

    /** @private */
    function addStyle() {
        const styleNodeWithSameName = document.querySelector(`style[data-name='${name}']`);

        if (name && styleNodeWithSameName) {
            return;
        }

        const css = /*html*/ `
            <style type='text/css' data-name='${name || id}'>
                ${style.replace(/#id/g, `#${id}`)}
            </style>
        `;
        const head = document.querySelector('head');

        head.insertAdjacentHTML('beforeend', css);
    }

    function insertElement(localParent) {
        localParent = localParent || parent;

        const parser = new DOMParser();
        const parsedHTML = parser.parseFromString(html, 'text/html');
        const newElement = parsedHTML.body.firstElementChild;

        if (inlineStyle) {
            newElement.style = inlineStyle
                .split('\n')
                .map(style => style.trim())
                .join(' ')
                .trim();
        }

        newElement.id = id;

        try {
            let parentElement;

            if (!localParent) {
                parentElement = document.querySelector('#app');
            } else if (localParent instanceof Element) {
                parentElement = localParent;
            } else if (localParent instanceof Object) {
                parentElement = localParent.get();
            }

            parentElement.insertAdjacentElement(position || 'beforeend', newElement);
        } catch (error) {
            console.log('Parent element removed from DOM. No need to render component.');
        }
    }

    function addEventListeners() {
        if (!events) {
            return;
        }

        events.forEach(item => {
            const eventTypes = item.event.split(' ');

            eventTypes.forEach(event => {
                if (typeof item.selector === 'string') {
                    const replaceIdPlaceholder = item.selector.replace(/#id/g, `#${id}`);

                    document.querySelectorAll(replaceIdPlaceholder).forEach((node) => {
                        node.addEventListener(event, item.listener);
                    });
                } else {
                    item.selector.addEventListener(event, item.listener);
                }
            });
        });
    }

    return {
        addEvent(param) {
            /** Register event */
            events.push(param);

            /** Add event listner */
            const {
                event,
                listener
            } = param;

            this.get().addEventListener(event, listener);
        },
        /** @todo remove this method */
        removeEvent(param) {
            const {
                selector,
                event,
                listener
            } = param;

            /** Find event */
            const eventItem = events.find(item => item.selector === selector && item.event === event && item.listener === listener);

            /** Deregister event */
            const index = events.indexOf(eventItem);

            console.log(index);

            /** Remove event element from events array */
            events.splice(index, 1);

            /** Remove event listner */
            selector.addEventListener(event, listener);
        },
        removeEvents() {
            events.forEach(item => {
                const eventTypes = item.event.split(' ');

                eventTypes.forEach(event => {
                    if (typeof item.selector === 'string') {
                        const replaceIdPlaceholder = item.selector.replace(/#id/g, `#${id}`);

                        document.querySelectorAll(replaceIdPlaceholder).forEach((node) => {
                            node.removeEventListener(event, item.listener);
                        });
                    } else {
                        item.selector.removeEventListener(event, item.listener);
                    }
                });
            });
        },
        getParam() {
            return param;
        },
        get() {
            return document?.querySelector(`#${id}`);
        },
        find(selector) {
            return this.get()?.querySelector(selector);
        },
        findAll(selector) {
            return this.get()?.querySelectorAll(selector);
        },
        closest(selector) {
            return this.get()?.closest(selector);
        },
        // element() {
        //     const parser = new DOMParser();
        //     const parsedHTML = parser.parseFromString(html, 'text/html');

        //     return parsedHTML.body.firstElementChild;
        // },
        hide() {
            this.get().style.display = 'none';
        },
        show(display) {
            this.get().style.display = display || 'revert';
        },
        refresh() {
            this.remove();

            /** @todo This does not reset local variables (e.g. files array in Component_AttachFilesField) */
            this.add();
        },
        remove(delay = 0) {
            const node = this.get();

            if (delay) {
                setTimeout(findAndRemoveStyleAndNode, delay);
            } else {
                findAndRemoveStyleAndNode();
            }

            function findAndRemoveStyleAndNode() {
                const styleNode = document.querySelector(`style[data-name='${id}']`);

                if (styleNode) {
                    styleNode.remove();
                }

                if (node) {
                    node.remove();
                }
            }
        },
        empty() {
            this.get().innerHTML = '';
        },
        append(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('beforeend', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('beforeend', param);
            }
        },
        before(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('beforebegin', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('beforebegin', param);
            }
        },
        add(localParent) {
            const storedComponent = Store.get(name);

            if (storedComponent && toggle) {
                Store.remove(name);

                return;
            }

            if (store) {
                Store.add({
                    name,
                    component: this
                });
            }

            addStyle();
            insertElement(localParent);
            addEventListeners();

            if (onAdd) {
                onAdd();
            }
        }
    };
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function CopyItem(param) {
    const {
        file,
        newName,
        from,
        to,
        notify,
        message
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // data.__metadata = {
    //     'type': `SP.Data.${type || list}ListItem`
    // }

    const postOptions = {
        url: `https://rhcc.amedd.army.mil/mtf/DHCC/cmdandstaffslides/_api/web/folders/GetByUrl('/mtf/DHCC/cmdandstaffslides/${from}')/Files/getbyurl('${file}')/copyTo(strNewUrl='/mtf/DHCC/cmdandstaffslides/${to}/${newName || file}',bOverWrite=true)`,
        // url: `https://rhcc.amedd.army.mil/mtf/DHCC/_api/web/GetFileByServerRelativeUrl('/mtf/DHCC/cmdandstaffslides/Slides/${file}')/copyTo('/mtf/DHCC/cmdandstaffslides/ArchivedSlides/${file}')`,
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    const copyItem = await Post(postOptions);

    if (!copyItem) {
        return;
    }

    if (notify !== false) {
        const notification = Toast({
            text: message || `Success!`
        });

        notification.add();
        notification.remove(6000);
    }

    return copyItem.d;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function CopyRecurse(param) {
    const { path, filter, targetWeb, appName, appTitle } = param;

    // 1. Look for files at top level of source site
    const url = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files`;
    
    console.log(url);

    const requestDigest = await GetRequestDigest();
    const options = {
        method: 'GET',
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-type": "application/json; odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    };
    const query = await fetch(url, options);
    const response = await query.json();

    if (response.d.results.length) {
        console.log(`Top level files in '${path}'`)
        
        for (let item in response.d.results) {
            const file = response.d.results[item];
            const { Name } = file;

            await CopyFile({
                source: App.get('site'),
                target: `${App.get('site')}/${targetWeb}`,
                path,
                file: Name,
                appName,
                appTitle
            });

            console.log(`File '${Name}' copied.`);
        }
    } else {
        console.log(`No files in '${path}'`);
    }

    // 2. Look for directories
    const dirs = await GetFolders({ path, filter });

    for (let item in dirs) {
        const file = dirs[item];
        const { Name } = file;
        
        console.log(`- ${Name}`);
        // 3 Create dirs
        await CreateFolder({
            web: targetWeb,
            path: `${path}/${Name}`
        });

        console.log(`Folder '${Name}' copied.`);

        // Recurse into dir
        await CopyRecurse({
            path: `${path}/${Name}`,
            targetWeb,
            appName,
            appTitle
        });
    }

    return true;
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
export async function CreateColumn(param) {
    const {
        list,
        field
    } = param;

    const {
        name,
        type,
        choices,
        fillIn,
        title,
        lookupList,
        lookupField,
        value
    } = field;

    // Get new request digest
    const requestDigest = await GetRequestDigest();
    const getField = await fetch(`${App.get('site')}/_api/web/lists/getByTitle('${list}')/fields`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': requestDigest
        }
    });
    const response = await getField.json();

    // Existing list columns 
    const fields = response?.d?.results.map(item => item.Title);

    // Don't create columns with reserved SharePoint names or already exist
    if (fields.includes(name)) {
        await exists();
        return;
    }

    // Robi reserves some column names as well
    const robiFields = [ 'Files' ];

    if (robiFields.includes(name)) {
        await reserved();
        return;
    }

    async function exists() {
        // Console 
        console.log(`Column '${name}' already exists or is a reserved SharePoint name.`);

        // Add to Install Console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code style='color: orange'>Column '${name}' already exists or is a reserved SharePoint name.</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        // Update column instead
        await UpdateColumn(param);

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            // +1 since not adding to column to view
            progressBar.update();
        }

        // TODO: Update progress bar or error out if update fails
        return;
    }

    async function reserved() {
        // Console 
        console.log(`Column '${name}' is reserved for Robi. A list column with this name can't be created.`);

        // Add to Install Console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code style='color: orange'>Column '${name}' is reserved for Robi. A list column with this name can't be created.</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        // Update column instead
        await UpdateColumn(param);

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            // +1 since not adding to column to view
            progressBar.update();
        }

        // TODO: Update progress bar or error out if update fails
        return;
    }

    let data = {};

    if (type === 'choice') {
        data = { 
            __metadata: { 
                "type": "SP.FieldChoice" 
            },
            FieldTypeKind: 6,
            Title: name,
            DefaultValue: value,
            Choices: { 
                // __metadata: { 
                //     "type": "Collection(Edm.String)" 
                // }, 
                results: choices 
            }
        };
    } else if (type === 'multichoice') {
        data = { 
            __metadata: { 
                "type": "SP.FieldChoice" 
            },
            FieldTypeKind: 15,
            Title: name,
            FillInChoice: fillIn,
            DefaultValue: value,
            Choices: { 
                results: choices 
            }
        };
    } else if (type === 'lookup') {
        const listGuid = await GetListGuid(lookupList);

        data = { 
            __metadata: { 
                "type": "SP.FieldCreationInformation" 
            }, 
            FieldTypeKind: 7,
            Title: title, 
            LookupListId: listGuid,
            LookupFieldName: lookupField
        };
    } else {
        data = {
            __metadata: {
                'type': `SP.Field`,
            },
            Title: name,
            FieldTypeKind: fieldType(type),
            DefaultValue: value
        }
    }

    const postOptions = {
        url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields`,
        data,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    /**
     * @desc FieldTypeKind for SharePoint
     *  
     * @type {FieldTypeKind} - 2 (Single Line of Text)
     * @type {FieldTypeKind} - 3 (Mulitiple Lines of Text)
     * @type {FieldTypeKind} - 4 (Date)
     * @type {FieldTypeKind} - 6 (Choice)
     * @type {FieldTypeKind} - 7 (Lookup)
     * @type {FieldTypeKind} - 9 (Number)
     * @type {FieldTypeKind} - 20 (Person or Group)
     * 
     */
    function fieldType(type) {
        switch (type.toLowerCase()) {
            case 'slot':
                return 2;
            case 'mlot':
                return 3;
            case 'date':
                return 4;
            case 'choice':
                return 6;
            case 'lookup':
                return 7;
            case 'number':
                return 9;
            case 'multichoice':
                return 15;
            case 'pp':
                return 20;
            default:
                break;
        }
    }

    const newField = await Post(postOptions);

    // Console success
    console.log(`Created column '${name}'`);

    // Append to install-console
    const installConsole = Store.get('install-console');

    if (installConsole) {
        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Created column '${name}'</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
    }

    const progressBar = Store.get('install-progress-bar');

    if (progressBar) {
        progressBar.update();
    }

    /** Add column to All Items view */
    await AddColumnToView({
        list,
        name
    });

    return newField.d;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function CopyFile(param) {
    const { source, target, path, file, appName, appTitle } = param;

    const sourceSiteUrl = source + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files('" + file + "')/$value";
    const targetSiteUrl = target + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files/Add(url='" + file + "',overwrite=true)";
    const srcRequestDigest = await GetRequestDigest({ site: source });
    const getFileValue = await fetch(sourceSiteUrl, {
        method: 'GET',
        headers: {
            'binaryStringRequestBody': 'true',
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': srcRequestDigest
        }
    });

    let contents = file === 'app.js' ? await getFileValue.text() : await getFileValue.arrayBuffer() ;

    // TODO: Add check for App/src path so other paths that you might want to copy from aren't affected
    if (file === 'app.js') {
        // FIXME: Potentially super brittle. Use well-formed regex instead.
        contents = contents.replace(`name: '@App',`, `name: '${appName}',`);
        contents = contents.replace(`title: '@Title',`, `title: '${appTitle}',`);
    }

    const newFile = await fetch(targetSiteUrl, {
        method: 'POST',
        body: contents, 
        headers: {
            'binaryStringRequestBody': 'true',
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': srcRequestDigest
        }
    });

    // Get install console and progress bar robi components
    const installConsole = Store.get('install-console');
    const progressBar = Store.get('install-progress-bar');

    if (newFile) {
        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Created file '${file}'</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        if (progressBar) {
            progressBar.update();
        }
    }

    return newFile;
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function CreateFolder(param) {
    const {
        site,
        web,
        path
    } = param;

    // TODO: check if folder already exists

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    const postOptions = {
        url: `${site || App.get('site')}/${web}/_api/web/folders`,
        data: {
            "__metadata":{
                "type":"SP.Folder"
            },
            "ServerRelativeUrl": `${path}`
        },
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    const copyItem = await Post(postOptions);

    // Get install console and progress bar robi components
    const installConsole = Store.get('install-console');
    const progressBar = Store.get('install-progress-bar');

    if (copyItem) {
        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code style='opacity: 0;'>Spacer</code>
                </div>
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Created folder '${path}'</code>
                </div>
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>----------------------------------------</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        if (progressBar) {
            progressBar.update();
        }
    }

    return copyItem;
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.type     SharePoint list item type.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function CreateItem(param) {
    const {
        type,
        list,
        select,
        expand,
        data,
        notify,
        message
    } = param;

    if (App.get('mode') === 'prod') {
        const requestDigest = await GetRequestDigest();

        data.__metadata = {
            'type': `SP.Data.${type || list}ListItem`
        }

        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/items`,
            data,
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        }

        let newItem = await Post(postOptions);

        if (!newItem) {
            return;
        }

        const refetechedNewItem = await Get({
            list,
            select,
            expand,
            filter: `Id eq ${newItem.d.Id}`
        });

        if (notify) {
            const notification = Toast({
                text: message || `Item created`
            });

            notification.add();
            notification.remove(6000);
        }

        return refetechedNewItem[0];
    } else if (App.get('mode') === 'dev') {
        const body = data;

        // DataTables and other components requied null fields.
        // SharePoint returns them by default, but lists created with json-server don't
        // have schemas.
        // Append fields from lists.js with value null.
        const { fields } = Lists().concat(lists).find(item => item.list === list);

        for (let field in fields) {
            const { name } = fields[field];

            if (name in body === false) {
                body[name] = null;
            }
        }

        body.Author = {
            Title: App.get('dev').user.Title
        };

        body.Editor = {
            Title: App.get('dev').user.Title
        };

        const date = new Date().toUTCString();
        body.Created = date;
        body.Modified = date;

        const options = {
            method: `POST`,
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        const response = await fetch(`http://localhost:3000/${list}`, options);
        const newItem = await response.json();
        
        if (list !== 'Log' && list !== 'Errors') {
            console.log('Adding 1s delay to CreateItem');
            await wait(1000);
        }

        function wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        return newItem;
    }
}

/**
 * Create SharePoint list item.
 * @param {Object} param        Interface to UpdateItem() module.   
 * @param {String} param.list   SharePoint list name.
 * @param {Array}  param.fields SharePoint fields.
 */
export async function CreateLibrary(param) {
    const {
        name,
        web,
        fields
    } = param;

    const newLibrary = await CreateList({
        list: name,
        web,
        fields,
        template: 101
    });

    if (newLibrary) {        
        return newLibrary;
    }
}

/**
 * Create SharePoint list item.
 * @param {Object} param        Interface to UpdateItem() module.   
 * @param {String} param.list   SharePoint list name.
 * @param {Array}  param.fields SharePoint fields.
 */
export async function CreateList(param) {
    const {
        list,
        options,
        web,
        fields,
        template
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest({web});

    // Check if list exists
    const listResponse = await fetch(`${App.get('site')}${web ? `/${web}` : ''}/_api/web/lists/GetByTitle('${list}')`, {
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
        }
    });
    
    const getList = await listResponse.json();

    // Get install console and progress bar robi components
    const installConsole = Store.get('install-console');
    const progressBar = Store.get('install-progress-bar');

    const listType = template && template === 101 ? 'library' : 'list';

    if (getList.d) {
        console.log(`${listType} ${list} already created.`);

        // Append to install-console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>${listType} '${list}' already created</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            // +1 for the list
            progressBar.update();

            // +2 for each field
            if (fields.length) {
                for (let i = 0; i < fields.length; i++) {
                    progressBar.update();
                    progressBar.update();
                }
            }
        }
        return;
    } else {
        // console.log(getList);
    }

    const postOptions = {
        url: `${App.get('site')}${web ? `/${web}` : ''}/_api/web/lists`,
        data: {
            __metadata: {
                'type': `SP.List`,
            },
            'BaseTemplate': template || 100,
            'Title': list
        },
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    /** Create list */
    const newList = await Post(postOptions);

    if (newList) {
        // Console success
        console.log(`Created ${listType} '${list}'`);

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Created ${listType} '${list}'</code>
                </div>
                ${
                    template !== 101 ?
                    /*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>----------------------------------------</code>
                        </div>
                    ` :
                    ''
                }
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        if (progressBar) {
            progressBar.update();
        }

        // If Files option enabled, create doc library
        if (options?.files) {
            console.log(`Files enabled. Create '${list}Files' doc lib.`);
            const filesLib = await CreateLibrary({
                name: `${list}Files`
            });
            
            console.log(`${list}Files:`, filesLib);
        }

        // Create fields
        for (let field in fields) {
            await CreateColumn({
                list,
                field: fields[field]
            });
        }

        return newList.d;
    }
}

/**
 * Create SharePoint site.
 * @param {Object} param Interface to UpdateItem() module.   
 * @param {String} param.name SharePoint site name.
 * @param {String} param.url SharePoint site url.
 */
export async function CreateSite(param) {
    const {
        url,
        title,
        name,
        description
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // Check if site exists
    const siteResponse = await fetch(`${App.get('site')}/${url}`, {
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
        }
    });

    // Get install console and progress bar robi components
    const installConsole = Store.get('install-console');
    const progressBar = Store.get('install-progress-bar');

    if (installConsole) {
        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Creating site '${title}', please don't leave the page...</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
    }

    if (siteResponse.status !== 404) {
        console.log(`Site '${title}' already created.`);

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Site '${title}' already created</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            // +1 for the list
            progressBar.update();

            // +? litsts, plus all their fields?
        }

        return;
    }

    const postOptions = {
        url: `${App.get('site')}/_api/web/webinfos/add`,
        data: {
            'parameters': {
                '__metadata':  {
                    'type': 'SP.WebInfoCreationInformation'
                },
                'Url': url,
                'Title': title,
                'Description': description || 'This site was created with Robi.',
                'Language': 1033,
                'WebTemplate': 'sts',
                'UseUniquePermissions': false
            }
        },
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    /** Create site */
    const newSite = await Post(postOptions);

    console.log('New site:', newSite);

    if (newSite) {
        // Console success
        console.log(`Created site '${title}'`);

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Created site '${title}'</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        // Deactivate MDS
        const getNewRD = await Post({
            url: `${App.get('site')}/${url}/_api/contextinfo`,
            headers: {
                "Accept": "application/json; odata=verbose",
            }
        });
        const newRD = getNewRD.d.GetContextWebInformation.FormDigestValue;
        await fetch(`${App.get('site')}/${url}/_api/web`, {
            method: 'POST',
            body: JSON.stringify({ 
                '__metadata': { 'type': 'SP.Web' },
                'EnableMinimalDownload': false
            }),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                'X-HTTP-Method': 'MERGE',
                "X-RequestDigest": newRD
            }
        });
        console.log('MDS deactivated');

        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Minimal Download Strategy (MDS) deactivated</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
        
        if (progressBar) {
            progressBar.update();
        }

        return newSite;
    }
}

/**
 * 
 * @param {*} lists 
 * @returns 
 */
export async function Data(lists) {
    let responses;

    if (lists) {
        responses = await Promise.all(lists.map(param => {
            const {
                list,
                label,
                select,
                expand,
                filter,
                orderby
            } = param;

            return Get({
                list,
                select,
                expand,
                filter,
                orderby,
                action() {
                    Store.get('app-loading-bar').update({
                        newDisplayText: label
                    });
                }
            });
        }));
    }

    await Store.get('app-loading-bar')?.end();

    return responses
}

/**
 * 
 * @param {*} event 
 */
export function DeleteApp() {
    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            // Core lists
            const coreLists = Lists();
            console.log(coreLists);

            // App lists
            const appLists = lists;
            console.log(coreLists);

            // All Lists
            const allLists = Lists().concat(lists);
            console.log(allLists);

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h4 class='mb-3'>All <strong>${App.get('name')}</strong> lists and items will be deleted</h4>
                <ul>
                    ${
                        appLists
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            return /*html*/ `
                                <li>${item.list}</li>
                            `
                        }).join('\n')
                    }
                </ul>
                <h4 class='mt-3 mb-3'>All <strong>Core</strong> lists and items will be deleted</h4>
                <ul>
                    ${
                        coreLists
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            return /*html*/ `
                                <li>${item.list}</li>
                            `
                        }).join('\n')
                    }
                </ul>
                <div class='alert alert-danger mt-5' style='border: none; border-radius: 10px;'>
                    This can't be undone. Proceed with caution.
                </div>
            `);

            const deleteBtn = BootstrapButton({
                async action(event) {
                    console.log('Delete');

                    modal.find('.modal-content').style.width = 'unset';

                    modalBody.style.height = `${modalBody.offsetHeight}px`;
                    modalBody.style.width = `${modalBody.offsetWidth}px`;
                    modalBody.style.overflowY = 'unset';
                    modalBody.style.display = 'flex';
                    modalBody.style.flexDirection = 'column',
                        modalBody.style.transition = 'all 300ms ease-in-out';
                    modalBody.innerHTML = '';
                    modalBody.style.height = '80vh';
                    modalBody.style.width = '80vw';

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <h3 class='console-title mb-0'>Deleting <strong>${App.get('name')}</strong></h3>
                    `);

                    let progressCount = allLists.length;

                    const progressBar = ProgressBar({
                        parent: modalBody,
                        totalCount: progressCount
                    });

                    Store.add({
                        name: 'install-progress-bar',
                        component: progressBar
                    });

                    progressBar.add();

                    const deleteContainer = Container({
                        padding: '10px',
                        parent: modalBody,
                        overflow: 'hidden',
                        width: '100%',
                        height: '100%',
                        radius: '10px',
                        background: '#1E1E1E'
                    });

                    deleteContainer.add();

                    const deleteConsole = InstallConsole({
                        type: 'secondary',
                        text: '',
                        margin: '0px',
                        parent: deleteContainer
                    });

                    Store.add({
                        name: 'install-console',
                        component: deleteConsole
                    });

                    deleteConsole.add();
                    deleteConsole.get().classList.add('console');

                    // 1. CORE: Add core lists to install-console
                    deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Delete core lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    coreLists.forEach(item => {
                        const { list } = item;

                        deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in coreLists) {
                        // Create lists
                        await DeleteList(coreLists[list]);
                    }

                    // Add spacer to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    // 2. USER DEFINED: Add user defined lists to install-console
                    deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Delete '${App.get('name')}' lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    lists.forEach(item => {
                        const { list } = item;

                        deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in lists) {
                        // Create lists
                        await DeleteList(lists[list]);

                        // Add spacer to console
                        deleteConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='opacity: 0;'>Spacer</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                    }

                    console.log('App deleted');


                    let spacers = '==============';

                    for (let i = 0; i < App.get('name').length; i++) {
                        spacers = spacers + '=';
                    }
                    
                    // 3. Add to console
                    deleteConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: crimson !important;'>${spacers}</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: crimson !important;'>| '${App.get('name')}' deleted |</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: crimson !important;'>${spacers}</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div class='mt-4 mb-2'>All lists and data for <strong>${App.get('name')}</strong> have been successfully deleted.</div>
                        <div class='mb-4'>You can install it again at <strong>Site Contents > App > src > pages > app.aspx</strong></div>
                    `);

                    // Show return button
                    const returnBtn = BootstrapButton({
                        type: 'primary',
                        value: 'Site Contents',
                        classes: ['w-100'],
                        action(event) {
                            // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                            $(modal.get()).on('hidden.bs.modal', event => {
                                console.log('Modal close animiation end');
                                console.log('Launch');

                                // Go to SharePoint site home page
                                location = `${App.get('site')}/_layouts/15/viewlsts.aspx`;
                            });

                            modal.close();
                        },
                        parent: modalBody
                    });

                    returnBtn.add();

                    // Scroll console to bottom (after launch button pushes it up);
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
                },
                classes: ['w-100'],
                width: '100%',
                parent: modalBody,
                type: 'danger',
                value: 'Delete all lists and data'
            });

            deleteBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel delete');

                    modal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: 'light',
                value: 'Cancel'
            });

            cancelBtn.add();
        },
        centered: true,
        showFooter: false,
    });

    modal.add();
}

/**
 * 
 * @param {*} param 
 */
export async function DeleteAttachments(param) {
    const {
        list,
        itemId,
        fileNames
    } = param;

    /** Get new request digest */
    const requestDigest = await GetRequestDigest();

    /** Upload responses */
    /** @todo Refactor with map? */
    const responses = [];

    for (let i = 0; i < fileNames.length; i++) {
        const upload = await fetch(`${App.get('site')}/_api/web/lists/getbytitle('${list}')/items(${itemId})/AttachmentFiles/getByFileName('${fileNames[i]}')`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json; odata=verbose',
                'content-type': 'application/json; odata=verbose',
                'X-HTTP-Method': 'DELETE',
                'X-RequestDigest': requestDigest,
            },
        });

        responses.push(upload);
    }

    await Promise.all(responses);
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
export async function DeleteColumn(param) {
    const {
        list,
        name
    } = param;

    // Don't create columns with reserved SharePoint names
    if (name === 'Title' || name === 'Id') {
        // Console 
        console.log(`Column '${name}'can't be deleted`);

        // Add to Install Console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Column '${name}'can't be deleted</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            progressBar.update();
        }

        return;
    }
    
    // Get new request digest
    const requestDigest = await GetRequestDigest();
    
    const postOptions = {
        url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields/GetByTitle('${name}')`,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
            "IF-MATCH": "*",
            "X-HTTP-Method": "DELETE",
        }
    }

    const deletedField = await Post(postOptions);

    // Console success
    console.log(`Deleted column '${name}'`);

    // Append to install-console
    const installConsole = Store.get('install-console');

    if (installConsole) {
        installConsole.append(/*html*/ `
            <div class='console-line'>
                <!-- <code class='line-number'>0</code> -->
                <code>Deleted column '${name}' from list '${list}'</code>
            </div>
        `);

        installConsole.get().scrollTop = installConsole.get().scrollHeight;
    }

    const progressBar = Store.get('install-progress-bar');

    if (progressBar) {
        progressBar.update();
    }

    return deletedField;
}

/**
 * Update SharePoint list item.
 * @param {Object}  param          - Interface to UpdateItem() module.
 * @param {string}  param.list     - SharePoint List Name.
 * @param {number}  param.itemId   - Item Id of item in param.list.
 * @param {boolean} [param.notify] - If false, don't display notification.
 */
export async function DeleteItem(param) {
    const {
        list,
        itemId,
        filter,
    } = param;

    if (App.get('mode') === 'prod') {
        /** Get item by id */
        const getItems = await Get({
            list,
            filter: itemId ? `Id eq ${itemId}` : filter
        });

        // const item = getItems[0];

        /** Get new request digest */
        const requestDigest = await GetRequestDigest();

        await Promise.all(getItems.map(item => {
            const postOptions = {
                url: item.__metadata.uri,
                headers: {
                    "Content-Type": "application/json;odata=verbose",
                    "Accept": "application/json;odata=verbose",
                    "X-HTTP-Method": "DELETE",
                    "X-RequestDigest": requestDigest,
                    "If-Match": item.__metadata.etag
                }
            }

            return Post(postOptions);
        }));
    } else if (App.get('mode') === 'dev') {
        const options = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        const response = await fetch(`http://localhost:3000/${list}/${itemId}`, options);
        const deletedItem = await response.json();

        return deletedItem;
    }
}

/**
 * Update SharePoint list item.
 * @param {Object}  param          - Interface to UpdateItem() module.
 * @param {string}  param.list     - SharePoint List Name.
 * @param {number}  param.itemId   - Item Id of item in param.list.
 * @param {boolean} [param.notify] - If false, don't display notification.
 */
export async function DeleteList(param) {
    const {
        list,
    } = param;

    if (App.get('mode') === 'prod') {
        // TODO: Check if list exists first

        /** Get new request digest */
        const requestDigest = await GetRequestDigest();

        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')`,
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-HTTP-Method": "DELETE",
                "X-RequestDigest": requestDigest,
                "If-Match": "*" // dangerous, check etag
            }
        }

        await Post(postOptions);

        // Console success
        console.log(`Deleted list '${list}'`);

        // Append to install-console
        const deleteConsole = Store.get('install-console');

        if (deleteConsole) {
            deleteConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Deleted list '${list}'</code>
                </div>
            `);

            deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            progressBar.update();
        }
    } else if (App.get('mode') === 'dev') {
        const options = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        const response = await fetch(`http://localhost:3000/${list}`, options);
        const deletedItem = await response.json();

        return deletedItem;
    }
}

/**
 * 
 * @param {*} param 
 */
export function Download(param) {
    const {
        fileName,
        csv
    } = param;

    const csvFile = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');

    // File name
    const today = new Date();
    downloadLink.download = `${`${fileName || App.get('name')}_${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`}.csv`;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = 'none';

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}

/**
 * {@link https://stackoverflow.com/a/2117523}
 */
export function GenerateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function Get(param) {
    const {
        list,
        filter,
        select,
        expand,
        orderby,
        top,
        skip,
        paged,
        startId,
        api,
        path,
        action,
        mode
    } = param;

    /** Add abort signal */
    const abortController = new AbortController();

    Store.addAbortController(abortController);

    const url = `${path || App.get('site')}/_api/web/lists/GetByTitle`;

    const options = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        },
        signal: abortController.signal
    };

    if (App.get('mode') === 'prod' || mode === 'prod') {
        const itemCount = await GetItemCount({
            apiPath: path,
            list
        });

        if (!itemCount) {
            // Always return at least an empty array if query fails for any reason
            return [];
        }

        const queryFilterString = [
            insertIf(filter, 'filter'),
            insertIf(select, 'select'),
            insertIf(expand, 'expand'),
            insertIf(orderby, 'orderby'),
            insertIf(skip, 'skip'),
            paged ? `$skiptoken=Paged=TRUE${startId ? `&P_ID=${startId}` : ''}` : undefined,
            // paged ? `$skiptoken=Paged=TRUE&P_ID=${startId ? startId : itemCount}`: undefined,
        ]
            .filter(x => x)
            .join('&');

        function insertIf(value, parameter) {
            return value ? `$${parameter}=${value}` : undefined;
        }

        try {
            const response = await fetch(api || `${`${url}('${list}')/items?$top=${top || itemCount || ''}`}&${queryFilterString || ''}`, options);
            const data = await response.json();

            if (action) {
                action(data);
            }

            if (paged || skip) {
                return data.d;
            } else if (Array.isArray(data)) {
                return data
            } else {
                return data.d.results;
            }
        } catch (error) {
            console.log('Fetch request aborted.');
        }
    } else if (App.get('mode') === 'dev' || mode === 'dev') {
        const queryFilterString = [
            formatFilter(filter),
            formatOrder(orderby)
        ]
            .filter(x => x)
            .join('&');

        function formatFilter(value) {
            if (value) {
                return value
                    .split(' and ')
                    .map(group => {
                        const [field, operator, value] = group.split(' ');

                        return `${field}${operator === 'eq' ? '=' : ''}${value.replace(/["']/g, "")}`;
                    })
                    .join('&');
            }
        }

        /** GET /posts?_sort=views&_order=asc */
        function formatOrder(value) {
            if (value) {
                const [field, order] = value.split(' ');

                return `_sort=${field}&_order=${order}`;
            }
        }

        const response = await fetch(`http://localhost:3000/${list}${queryFilterString ? `?${queryFilterString}` : ''}`, options);
        // const response = await fetch(`http://localhost:3000/${list}`, options);

        return await response.json();
    }
}

/**
 * 
 */
export async function GetAppSetting(prop) {
    const getItem = await Get({
        list: 'Settings',
        filter: `Key eq '${prop}'`
    });

    return getItem ? getItem[0] : undefined;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function GetADUsers(param) {
    const {
        query
    } = param;

    const abortController = new AbortController();
    // const url = window.location.href.split('/SiteAssets')[0] + '/_vti_bin/client.svc/ProcessQuery';
    const url = `${App.get('site')}/_vti_bin/client.svc/ProcessQuery`

    function getPostRequestHeaders(requestDigest) {
        if (!requestDigest) {
            throw new Error('Request Digest is required to send your request.');
        }

        return {
            'Accept': 'application/json; odata=verbose',
            'Content-Type': 'application/json; odata=verbose',
            'X-RequestDigest': requestDigest,
        };
    }

    function createSearchPayload(queryString, options) {
        options = {
            AllowEmailAddresses: false,
            AllowMultipleEntities: true,
            AllUrlZones: false,
            ForceClaims: false,
            MaximumEntitySuggestions: 30,
            PrincipalSource: 15,
            PrincipalType: 5,
            Required: true,
            SharePointGroupID: 0,
            UrlZone: 0,
            UrlZoneSpecified: false,
            WebApplicationID: '{00000000-0000-0000-0000-000000000000}',
        }

        return '<Request xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009" SchemaVersion="15.0.0.0" LibraryVersion="15.0.0.0" ApplicationName="Javascript Library">' +
            '<Actions>' +
            '<StaticMethod TypeId="{de2db963-8bab-4fb4-8a58-611aebc5254b}" Name="ClientPeoplePickerSearchUser" Id="0">' +
            '<Parameters>' +
            '<Parameter TypeId="{ac9358c6-e9b1-4514-bf6e-106acbfb19ce}">' +
            '<Property Name="AllowEmailAddresses" Type="Boolean">' + options.AllowEmailAddresses + '</Property>' +
            '<Property Name="AllowMultipleEntities" Type="Boolean">' + options.AllowMultipleEntities + '</Property>' +
            '<Property Name="AllUrlZones" Type="Boolean">' + options.AllUrlZones + '</Property>' +
            '<Property Name="EnabledClaimProviders" Type="Null" />' +
            '<Property Name="ForceClaims" Type="Boolean">' + options.ForceClaims + '</Property>' +
            '<Property Name="MaximumEntitySuggestions" Type="Number">' + options.MaximumEntitySuggestions + '</Property>' +
            '<Property Name="PrincipalSource" Type="Number">' + options.PrincipalSource + '</Property>' +
            '<Property Name="PrincipalType" Type="Number">' + options.PrincipalType + '</Property>' +
            '<Property Name="QueryString" Type="String">' + queryString + '</Property>' +
            '<Property Name="Required" Type="Boolean">' + options.Required + '</Property>' +
            '<Property Name="SharePointGroupID" Type="Number">' + options.SharePointGroupID + '</Property>' +
            '<Property Name="UrlZone" Type="Number">' + options.UrlZone + '</Property>' +
            '<Property Name="UrlZoneSpecified" Type="Boolean">' + options.UrlZoneSpecified + '</Property>' +
            '<Property Name="Web" Type="Null" />' +
            '<Property Name="WebApplicationID" Type="String">' + options.WebApplicationID + '</Property>' +
            '</Parameter>' +
            '</Parameters>' +
            '</StaticMethod>' +
            '</Actions>' +
            '<ObjectPaths />' +
            '</Request>';
    }

    function createPostRequest(data, requestDigest) {
        data = typeof (data) === 'string' ? data : JSON.stringify(data)

        return {
            method: 'POST',
            body: data,
            headers: getPostRequestHeaders(requestDigest),
        };
    }

    return {
        abortController,
        response: GetRequestDigest()
            .then(reqDigest => {
                // Create Active Directory Search Payload
                const reqData = createSearchPayload(query)
                const reqOptions = Object.assign(createPostRequest(reqData, reqDigest), {
                    signal: abortController.signal
                });

                return fetch(url, reqOptions)
                    .then(async response => {
                        console.log(response);

                        const data = await response.json();

                        return data;

                        let result = JSON.parse(data[2]);

                        result.forEach(acct => {
                            acct.Title = acct.DisplayText
                            acct.LoginName = acct.Key
                        });

                        return result;
                    })
            })
            // response: GetRequestDigest().then(requestDigest => {
            //     const init = {
            //         method: 'POST',
            //         body: JSON.stringify(createSearchPayload(query)),
            //         headers : { 
            //             'Content-Type': 'application/json; charset=UTF-8',
            //             'Accept': 'application/json; odata=verbose',
            //             'X-RequestDigest': requestDigest,
            //         },
            //         signal: abortController.signal 
            //     };

            //     return fetch(url, init).then(async response => {
            //         const data = await response.json();

            //         console.log(data);

            //         let result = JSON.parse(data[2]);

            //         result.forEach(acct => {
            //             acct.Title = acct.DisplayText;
            //             acct.LoginName = acct.Key;
            //         });

            //         return result;
            //     })
            // })
            .catch(error => {
                // console.log(error);
            })
    };
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetAttachments(param) {
    const {
        list,
        itemId
    } = param;

    const item = await Get({
        list,
        select: 'Attachments,AttachmentFiles',
        expand: 'AttachmentFiles',
        filter: `Id eq ${itemId}`
    });

    try {
        return item[0].AttachmentFiles.results;
    } catch (error) {
        console.log(error);
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetByUri(param) {
    const {
        uri,
        select,
        expand
    } = param;

    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    let queryFilterString = '';

    if (select) {
        queryFilterString += `${queryFilterString ? '&' : ''}$select=${select}`;
    }

    if (expand) {
        queryFilterString += `${queryFilterString ? '&' : ''}$expand=${expand}`;
    }

    const response = await fetch(`${uri}?${queryFilterString}`, headers);
    const data = await response.json();

    if (data && data.d) {
        return data.d;
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetCurrentUser(param) {
    const {
        list
    } = param;

    const url = App.get('mode') === 'prod' ? `${App.get('site')}/_api/web/CurrentUser` : `http://localhost:3000/users?LoginName=${App.get('dev').user.LoginName}`;
    const fetchOptions = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        }
    };

    if (App.get('mode') === 'prod') {
        const url = `${App.get('site')}/../_api/web/CurrentUser`;
        const currentUser = await fetch(url, fetchOptions);
        const response = await currentUser.json();
        const email = response.d.Email;
        const appUser = await Get({
            list: list || 'Users',
            // TODO: Replace with call to Model().Lists() map => internal field names + Id field
            // select: fields.map(field => field.name),
            filter: `Email eq '${email}'`
        });

        if (appUser && appUser[0]) {
            console.log(`%cUser: ${appUser[0].Title}.`, 'background: seagreen; color: white');
            return appUser[0];
        } else {
            console.log(response.d);

            const {
                Title,
                Email,
                LoginName
            } = response.d;

            console.log(`%cMissing user account.`, 'color: red');
            console.log(`Creating user account for ${Title}....`);

            /** Create user */
            const newUser = await CreateItem({
                list: 'Users',
                data: {
                    Title,
                    Email,
                    LoginName: LoginName.split('|')[2],
                    Role: App.get('userDefaultRole') /** Default, can be changed later */,
                    Settings: App.get('userSettings')
                }
            });

            if (newUser) {
                console.log(`%cUser account for ${Title} created!`, 'color: mediumseagreen');
            } else {
                console.log(`%cFailed to create a user account for ${Title}. Check POST data.`, 'background: firebrick; color: white');
            }

            return newUser;
        }
    } else if (App.get('mode') === 'dev') {
        const currentUser = await fetch(url, fetchOptions);
        const response = await currentUser.json();

        const {
            Title,
            Email,
            LoginName,
            Role
        } = App.get('dev').user;

        if (response[0]) {
            console.log(`%cFound user account for '${response[0].Title}'.`, 'color: mediumseagreen');
            return response[0];
        } else {
            console.log(`%cMissing user account.`, 'color: red');
            console.log(`Creating user account for ${Title}....`);

            /** Create user */
            const newUser = await CreateItem({
                list: 'Users',
                data: {
                    Title,
                    Email,
                    LoginName,
                    Role,
                    Settings: App.get('userSettings')
                }
            });

            if (newUser) {
                console.log(`%cCreated user account for ${Title}!`, 'color: mediumseagreen');
                return newUser;
            } else {
                console.log(`%cFailed to create a user account for ${Title}. Check POST data.`, 'color: firebrick');
            }
        }
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetFolders(param) {
    const { path, filter } = param;
    
    // 2. Look for directories
    const url = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/folders${filter ? `?$select=Name&$filter=${filter}` : ''}`;
    const requestDigest = await GetRequestDigest();
    const options = {
        method: 'GET',
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-type": "application/json; odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    };
    const query = await fetch(url, options);
    const response = await query.json();

    return response?.d?.results;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetItemCount(param) {
    const {
        list,
        path,
        type
    } = param;

    let {
        apiPath
    } = param;

    apiPath = apiPath || App.get('site');
    const url = type === 'lib' ? `${apiPath}/_api/web/GetFolderByServerRelativeUrl('${path}')/ItemCount` : `${apiPath}/_api/web/lists/GetByTitle('${list}')/ItemCount`;

    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        }
    };

    try {
        const response = await fetch(url, headers);

        if (!response.ok) {
            // await Error({
            //     Message: response.status.toString(),
            //     Source: import.meta.url,
            //     Line: 0,
            //     ColumnNumber: 0,
            //     Error: JSON.stringify(new Error().stack.replace('Error\n    at ', ''))
            // });
        }

        const data = await response.json();

        return data.d.ItemCount;
    } catch (error) {
        // console.log(error);
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetLib(param) {
    const {
        path,
        type,
        filter,
        select,
        expand,
        orderby
    } = param;

    const url = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/${type || 'Files'}`;
    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const itemCount = await GetItemCount({
        path,
        type: 'lib'
    });

    let queryFilterString = `$filter=${filter}`;

    if (select) {
        queryFilterString += `${queryFilterString ? '&' : ''}$select=${select}`;
    }

    if (expand) {
        queryFilterString += `${queryFilterString ? '&' : ''}$expand=${expand}`;
    }

    if (orderby) {
        queryFilterString += `${queryFilterString ? '&' : ''}$orderby=${orderby}`;
    }

    try {
        const response = await fetch(`${`${url}?$top=${itemCount}`}&${queryFilterString || ''}`, headers);

        const data = await response.json();

        if (Array.isArray(data)) {
            return data
        } else {
            return data.d.results;
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetWebLists() {
    const url = `${App.get('site')}/_api/web/lists/?$select=*,Fields&$expand=Fields`;
    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const response = await fetch(url, headers);

    if (response) {
        const data = await response.json();

        if (data && data.d && data.d.results) {
            return data.d.results;
        }
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetList(param) {
    const {
        listName
    } = param;

    const url = `${App.get('site')}/_api/web/lists/GetByTitle('${listName}')`;
    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const response = await fetch(url, headers);

    if (response) {
        const data = await response.json();

        if (data && data.d) {
            return data.d;
        }
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetListGuid(param) {
    const {
        listName: list
    } = param;

    const url = `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Id`;
    const headers = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const response = await fetch(url, headers);

    if (response) {
        const data = await response.json();

        if (data && data.d) {
            return data.d;
        }
    }
}

/**
 * 
 * @returns 
 */
export async function GetRequestDigest(param = {}) {
    const { web, site } = param;

    const getRequestDigest = await Post({
        url: `${site || App.get('site')}${web ? `/${web}` : ''}/_api/contextinfo`,
        headers: {
            "Accept": "application/json; odata=verbose",
        }
    });

    return getRequestDigest.d.GetContextWebInformation.FormDigestValue;
}

/**
 * 
 * @returns 
 */
export async function GetRootRequestDigest() {
    const getRequestDigest = await Post({
        url: `/_api/contextinfo`,
        headers: {
            "Accept": "application/json; odata=verbose",
        }
    });

    return getRequestDigest.d.GetContextWebInformation.FormDigestValue;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function GetSiteUsers(param) {
    const {
        query
    } = param;

    const abortController = new AbortController();

    // const url = `${App.get('domain')}/_api/web/siteusers?$filter=substringof('${query.toLowerCase()}',LoginName) eq true and substringof('i%3A0%23.w',LoginName) eq true`;
    // const url = [
    //     `${App.get('domain')}`,
    //     `/_api/web/SiteUserInfoList/items`,
    //     `?$top=200`,
    //     `&$select=Id,Title,FirstName,LastName,Name,EMail`,
    //     `&$filter=substringof('i:0e.t|dod_adfs_provider|', Name) and (substringof('${query}', Title) or substringof('${query}', EMail) or substringof('${query}', FirstName) or substringof('${query}', LastName))&$orderby=Name`
    // ].join('');
    const url = [
        `${App.get('site')}`,
        `/_vti_bin/listdata.svc/UserInformationList`,
        `?$top=200`,
        `&$select=Name,Account,WorkEmail`,
        `&$filter=substringof('i:0e.t|dod_adfs_provider|', Account) and (substringof('${query}', Name) or substringof('${query}', WorkEmail))&$orderby=Name`
    ].join('');
    const init = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        },
        signal: abortController.signal
    };

    return {
        abortController,
        response: fetch(url, init).then(async response => {
            const data = await response.json();

            // return data.d.results;
            return data.d;
        })
            .catch(error => {
                // console.log(error);
            })
    };
}

/**
 * 
 * @param {*} param 
 */
export function History(param) {
    const {
        url,
        title
    } = param;

    if (!history.state || history.state.url != url) {
        history.pushState({
            url: url,
            title: title
        }, title, url);
    }

    document.title = title;
}

/**
 * 
 * @param {*} param 
 */
export function InitializeApp(param) {
    const { settings, routes } = param;
    const { preLoadLists } = settings;

    if (App.get('mode') === 'prod') {
        console.log('Mode: prod');

        // Start loading bar animation
        const loadingBar = LoadingBar({
            displayLogo: App.get('logoLarge'),
            displayTitle: App.get('title'),
            totalCount: preLoadLists?.length || 0,
            loadingBar: 'hidden',
            async onReady() {
                // Check if app is already installed
                const isInstalled = await GetAppSetting('Installed');

                if (!isInstalled || isInstalled.Value === 'No') {
                    InstallApp({
                        isInstalled,
                        settings,
                        loadingBar,
                        routes
                    });

                    return;
                } else {
                    if (preLoadLists?.length) {
                        loadingBar.showLoadingBar();
                    }

                    LaunchApp(param);
                }
            }
        });

        loadingBar.add();

        Store.add({
            name: 'app-loading-bar',
            component: loadingBar
        });
    } else {
        console.log('Mode: dev');

        if (App.get('dev').testInstall) {
            TestInstall({
                settings,
                loadingBar
            });
        } else {
            LaunchApp(param);
        }
    }
}

// TODO: Remove mode and install check from InstallApp
// TODO: Move to InitializeApp or Start
/**
 * 
 * @param {*} param 
 */
export function InstallApp(param) {
    const { settings, loadingBar, isInstalled } = param;
    const { lists, questionTypes } = settings;
    const coreLists = Lists();

    console.log('Installing app...');

    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <div>
                    <strong>${App.get('name')}</strong> isn't installed on <a href='${App.get('site')}' target='_blank'>${App.get('site')}</a>. 
                    Would you like to install it now? You can uninstall it later.
                </div>
            `);

            const installBtn = BootstrapButton({
                action: installApp,
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'primary',
                value: 'Install'
            });

            installBtn.add();

            modal.get().addEventListener('keypress', event => {
                if (event.key === 'Enter') {
                    installApp(event);
                }
            })

            async function installApp(event) {
                console.log('Install');

                modal.find('.modal-content').style.width = 'unset';

                modalBody.style.height = `${modalBody.offsetHeight}px`;
                modalBody.style.width = `${modalBody.offsetWidth}px`;
                modalBody.style.overflowY = 'unset';
                modalBody.style.display = 'flex';
                modalBody.style.flexDirection = 'column',
                modalBody.style.transition = 'all 300ms ease-in-out';
                modalBody.innerHTML = '';
                modalBody.style.height = '80vh';
                modalBody.style.width = '80vw';

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='console-title mb-0'>Installing <strong>${App.get('name')}</strong></h3>
                `);

                // TODO: Start at 2
                // 0 - Create key 'QuestionTypes' in list 'Settings'
                // 1 - Create init note in list 'ReleaseNotes'
                // 2 - Create/update key 'Installed' in list 'Settings'
                let progressCount = 0;

                coreLists.forEach(item => {
                    const { fields } = item;

                    // List + 1
                    progressCount = progressCount + 1;

                    fields.forEach(field => {
                        // Field +2 (add column to list and view)
                        progressCount = progressCount + 2;
                    });
                });

                lists.forEach(item => {
                    const { fields, options } = item;

                    if (options?.files) {
                        // Files list + 1
                        progressCount = progressCount + 1;
                    }

                    // List + 1
                    progressCount = progressCount + 1;

                    fields.forEach(field => {
                        // Field +2 (add column to list and view)
                        progressCount = progressCount + 2;
                    });
                });

                const progressBar = ProgressBar({
                    parent: modalBody,
                    totalCount: progressCount
                });

                Store.add({
                    name: 'install-progress-bar',
                    component: progressBar
                });

                progressBar.add();

                const installContainer = Container({
                    padding: '10px',
                    parent: modalBody,
                    overflow: 'hidden',
                    width: '100%',
                    height: '100%',
                    radius: '10px',
                    background: '#1E1E1E'
                });

                installContainer.add();

                const installConsole = InstallConsole({
                    type: 'secondary',
                    text: '',
                    margin: '0px',
                    parent: installContainer
                });

                Store.add({
                    name: 'install-console',
                    component: installConsole
                });

                installConsole.add();
                installConsole.get().classList.add('console');

                // 1. CORE: Add core lists to install-console
                installConsole.append(/*html*/ `
                        <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code>Create core lists:</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                coreLists.forEach(item => {
                    const { list } = item;

                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>- ${list}</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                });

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Add default lists first
                for (let list in coreLists) {
                    // Create lists
                    await CreateList(coreLists[list]);

                    // Add spacer to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }

                // 2. USER DEFINED: Add user defined lists to install-console
                installConsole.append(/*html*/ `
                        <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code>Create '${App.get('name')}' lists:</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                lists.forEach(item => {
                    const { list } = item;

                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>- ${list}</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                });

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Add default lists first
                for (let list in lists) {
                    // Create lists
                    await CreateList(lists[list]);

                    // Add spacer to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }

                // Set Question Types key
                const questionTypesKeyExists = await Get({
                    list: 'Settings',
                    filter: `Key eq 'QuestionTypes'`
                });

                if (questionTypesKeyExists[0]) {
                    console.log(`Key 'Question Types' in Settings already exists.`);

                    // 1. Add to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Key 'Question Types' in Settings already exists.</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                } else {
                    // Add question types
                    await CreateItem({
                        list: 'Settings',
                        data: {
                            Key: 'QuestionTypes',
                            Value: JSON.stringify(questionTypes)
                        }
                    });

                    console.log(`Added Question Types: ${JSON.stringify(questionTypes)}`);

                    // 1. Add to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Question Types ${JSON.stringify(questionTypes)} added to 'Settings'</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Add Release Notes
                const releaseNoteExists = await Get({
                    list: 'ReleaseNotes',
                    filter: `Summary eq 'App installed'`
                });

                if (releaseNoteExists[0]) {
                    // Add to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>'App installed' release note already exists.'</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                } else {
                    await CreateItem({
                        list: 'ReleaseNotes',
                        data: {
                            Summary: 'App installed',
                            Description: 'Initial lists and items created.',
                            Status: 'Published',
                            MajorVersion: '0',
                            MinorVersion: '1',
                            PatchVersion: '0',
                            ReleaseType: 'Current'
                        }
                    });

                    console.log(`Added Release Note: App installed. Initial lists and items created.`);

                    // Add to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>'App installed - Core lists and items created.' added to 'releaseNotes'</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }

                if (lists.length) {
                    // Add Release Notes
                    const releaseNoteExists = await Get({
                        list: 'ReleaseNotes',
                        filter: `Summary eq '${App.get('name')} lists created'`
                    });

                    if (releaseNoteExists[0]) {
                        // Add to console
                        installConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>${App.get('name')} lists created' release note already exists.'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        installConsole.get().scrollTop = installConsole.get().scrollHeight;
                    } else {
                        // Add Release Notes
                        await CreateItem({
                            list: 'ReleaseNotes',
                            data: {
                                Summary: `${App.get('name')} lists created`,
                                Description: lists.map(item => item.list).join(', ') + '.',
                                Status: 'Published',
                                MajorVersion: '0',
                                MinorVersion: '1',
                                PatchVersion: '0',
                                ReleaseType: 'Current'
                            }
                        });

                        console.log(`Added Release Note: ${App.get('name')} lists created - ${lists.map(item => item.list).join(', ')}.`);

                        // Add to console
                        installConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>''${App.get('name')}' lists created - ${lists.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        installConsole.get().scrollTop = installConsole.get().scrollHeight;
                    }
                }

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Create developer account
                const url = `${App.get('site')}/../_api/web/CurrentUser`;
                const fetchOptions = {
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json; odata=verbose'
                    }
                };
                const currentUser = await fetch(url, fetchOptions);
                const response = await currentUser.json();
                
                const appUser = await Get({
                    list: App.get('usersList') || 'Users',
                    select: coreLists.find(item => item.list === App.get('usersList') || item.list === 'Users').fields.map(field => field.name),
                    filter: `Email eq '${response.d.Email}'`
                });
        
                // User already exists
                if (appUser && appUser[0]) {
                    console.log(`User account for '${response.d.Title}' already exists.`);

                    // Add to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>User account for '${response.d.Title}' already exists.</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                } else {
                    /** Create user */
                    await CreateItem({
                        list: 'Users',
                        data: {
                            Title: response.d.Title,
                            Email: response.d.Email,
                            LoginName: response.d.LoginName.split('|')[2],
                            Role: 'Developer',
                            Settings: App.get('userSettings')
                        }
                    });

                    console.log(`Created user account for '${response.d.Title}' with role 'Developer'`);

                    // Add to console
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>User account for '${response.d.Title}' created with role 'Developer'</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }
    
                if (!isInstalled) {
                    // Create key 'Installed'
                    await CreateItem({
                        list: 'Settings',
                        data: {
                            Key: 'Installed',
                            Value: 'Yes'
                        }
                    });

                    // Create key 'Installed'
                    await CreateItem({
                        list: 'Settings',
                        data: {
                            Key: 'Version',
                            Value: '0.1.0'
                        }
                    });

                    // Create key 'Installed'
                    await CreateItem({
                        list: 'Settings',
                        data: {
                            Key: 'Build',
                            Value: '1.0.0'
                        }
                    });
                } else if (isInstalled.Value === 'No') {
                    // Update key 'Installed'
                    await UpdateItem({
                        list: 'Settings',
                        itemId: isInstalled.Id,
                        data: {
                            Value: 'Yes'
                        }
                    });

                    // TODO: Update keys Version and Build
                }

                console.log('App installed');

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                let spacers = '==============================================';

                for (let i = 0; i < App.get('name').length; i++) {
                    spacers = spacers + '=';
                }
                
                // 3. Add to console
                //TODO: REMOVE hard coded version and build numbers
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: mediumseagreen !important;'>${spacers}</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: mediumseagreen !important;'>| '${App.get('name')}' installed | Build 1.0.0 | Version 1.0.0 |</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: mediumseagreen !important;'>${spacers}</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Show launch button
                const launchBtn = BootstrapButton({
                    type: 'primary',
                    value: 'Launch app',
                    classes: ['mt-3', 'w-100'],
                    action(event) {
                        // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                        $(modal.get()).on('hidden.bs.modal', event => {
                            console.log('Modal close animiation end');
                            console.log('Launch');

                            LaunchApp(param);
                        });

                        modal.close();
                        loadingBar.showLoadingBar();
                    },
                    parent: modalBody
                });

                launchBtn.add();

                // Scroll console to bottom (after launch button pushes it up);
                installConsole.get().scrollTop = installConsole.get().scrollHeight;
            }

            const modifyBtn = BootstrapButton({
                action(event) {
                    window.open(`${App.get('site')}/${App.get('library') || 'App'}/src`);
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: 'outline-primary',
                value: 'Modify source'
            });

            modifyBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel install');

                    // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                    $(modal.get()).on('hidden.bs.modal', event => {
                        console.log('modal close animiation end');

                        // Show alert
                        appContainer.get().insertAdjacentHTML('afterend', /*html*/ `
                            <div class='position-absolute install-alert mb-0'>
                                Installation cancelled. You can safely close this page. Reload page to resume install.
                            </div>
                        `);
                    });

                    modal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: 'light',
                value: 'Cancel'
            });

            cancelBtn.add();
        },
        centered: true,
        showFooter: false,
    });

    modal.add();
}

/**
 * 
 * @param {*} param 
 */
export async function LaunchApp(param) {
    const {
        routes,
        sidebar,
        settings
    } = param;

    const {
        title,
        logo,
        usersList,
        beforeLoad,
        preLoadLists,
        svgSymbols,
        sessionStorageData,
        sidebarDropdown
    } = settings;

    /** Set sessions storage */
    SetSessionStorage({
        sessionStorageData
    });

    /** Get list items */
    const data = await Data(preLoadLists);

    if (data) {
        /** Add list items to store */
        preLoadLists.forEach((param, index) => {
            const {
                list
            } = param;

            Store.add({
                type: 'list',
                list,
                items: data[index]
            });
        });
    }

    /** Load svg definitions */
    const svgDefs = SvgDefs({
        svgSymbols
    });

    svgDefs.add();

    /** Get AD user and Users list item properties */
    Store.user(await GetCurrentUser({
        list: usersList
    }));

    /** Get current route */
    const path = location.href.split('#')[1];

    /** Attach Router to browser back/forward event */
    window.addEventListener('popstate', (event) => {
        if (event.state) {
            Route(event.state.url.split('#')[1], {
                scrollTop: Store.viewScrollTop()
            });
        }
    });

    /** Store routes */
    Store.setRoutes(routes.concat(Routes));

    // Get app container
    const appContainer = Store.get('appcontainer');

    /** Sidebar Component */
    const sidebarParam = {
        logo,
        parent: appContainer,
        path,
        sidebarDropdown
    };
    
    const sidebarComponent = sidebar ? sidebar(sidebarParam) : Sidebar(sidebarParam);

    Store.add({
        name: 'sidebar',
        component: sidebarComponent
    });

    sidebarComponent.add();

    /** Main Container */
    const mainContainer = MainContainer({
        parent: appContainer
    });

    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });

    mainContainer.add();

    /** Run callback defined in settings Before first view loads */
    if (beforeLoad) {
        await beforeLoad();
    }

    /** Show App Container */
    appContainer.show('flex');

    /** Generate Session Id */
    const sessionId = GenerateUUID();

    /** Format Title for Sessin/Local Storage keys */
    const storageKeyPrefix = settings.title.split(' ').join('-');

    /** Set Session Id */
    sessionStorage.setItem(`${storageKeyPrefix}-sessionId`, sessionId)

    /** Log in*/
    try {
        Log({
            Title:  `${Store.user().Title || 'User'} logged in`,
            Message: `${Store.user().Email || 'User'} successfully loaded ${title}`,
            StackTrace: new Error().stack,
            Module: import.meta.url
        });
    } catch (error) {
        console.error(error);
    }

    /** Run current route on page load */
    Route(path, {
        log: false
    });

    /** Check Local Storage for release notes */
    const isReleaseNotesDismissed = localStorage.getItem(`${storageKeyPrefix}-releaseNotesDismissed`);

    if (!isReleaseNotesDismissed) {
        // console.log('Show release notes message.');

        /** Release Notes */
        const releaseNotes = FixedToast({
            type: 'success',
            title: `New version ${'0.1.0'}`, // TODO: Get current version number
            message: `View release notes`,
            bottom: '20px',
            right: '10px',
            action(event) {
                const modal = Modal({
                    fade: true,
                    background: settings.secondaryColor,
                    centered: true,
                    addContent(modalBody) {
                        ReleaseNotes({
                            margin: '0px',
                            parent: modalBody,
                        });
                    },
                    parent: appContainer
                });

                modal.add();
            },
            onClose(event) {
                /** Set Local Storage */
                localStorage.setItem(`${storageKeyPrefix}-releaseNotesDismissed`, 'true');
            },
            parent: appContainer
        });

        releaseNotes.add();
    }
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.type     SharePoint list item type.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function Log(param) {
    const {
        Title,
        Message,
        StackTrace,
        Module
    } = param;

    if (App.get('mode') === 'prod') {
        /** Get new request digest */
        const requestDigest = await GetRequestDigest();

        /** @todo Check if Log exists, create if not */

        /**
         * SharePoint Ceate List REST API
         * @interface
         * @property {string} url - SharePoint 2013 API
         *
         */
        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('Log')/items`,
            data: {
                Title,
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message: JSON.stringify({
                    body: Message,
                    location: location.href,
                    role: Store.user().Role
                }),
                StackTrace: JSON.stringify(StackTrace.replace('Error\n    at ', '')),
                Module,
                __metadata: {
                    'type': `SP.Data.LogListItem`
                }
            },
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        }

        const newItem = await Post(postOptions);

        console.log(`%cLog: ${Title}`, 'background: #1e1e1e; color: #fff');

        return newItem.d;
    } else if (App.get('mode') === 'dev') {
        const newLog = await CreateItem({
            list: 'Log',
            data: {
                Title,
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message: JSON.stringify({
                    body: Message,
                    location: location.href,
                    role: Store.user().Role
                }),
                StackTrace: JSON.stringify(StackTrace.replace('Error\n    at ', '')),
                UserAgent: navigator.userAgent,
                Module
            }
        });

        console.log(`%cLog: ${Title}`, 'background: #1e1e1e; color: #fff');

        return newLog;
    }
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.type     SharePoint list item type.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function LogError(param) {
    const {
        Message,
        Error,
        Source,
        Line,
        ColumnNumber
    } = param;

    if (App.get('mode') === 'prod') {
        /** Get new request digest */

        /** 
         * @author Wil Pacheco & John Westhuis
         * Added temporary alert to prevent infinite error loop when reporting error, & reload page for user.
         * 
         * @author Stephen Matheis
         * @to Wilfredo Pacheo, John Westhuis
         * Catching the request digest promise was a great idea. Jealous I didn't think of it >_<;
         */
        const requestDigest = await GetRequestDigest().catch(e => {
            alert('Your session has expired, your page will now reload.')
            location.reload()
        });

        /** @todo check if Errors list exits, create if not */
        /**
         * Pass this object to fetch
         * 
         * @interface
         * @property {string} url - SharePoint 2013 API
         *
         */
        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('Errors')/items`,
            data: {
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message,
                Error,
                Source,
                UserAgent: navigator.userAgent,
                __metadata: {
                    'type': `SP.Data.ErrorsListItem`
                }
            },
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            }
        }

        const newItem = await Post(postOptions);

        console.log(`%cError: ${Message}`, 'background: crimson; color: #fff');

        return newItem.d;
    } else if (App.get('mode') === 'dev') {
        const newLog = await CreateItem({
            list: 'Errors',
            data: {
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message,
                Error,
                Source,
            }
        });

        console.log(`%cError: ${Message}`, 'background: crimson; color: #fff');

        return newLog;
    }
}

/**
 * 
 * @param {*} param 
 */
export async function ModifyFile(param) {
    const { path, file } = param;

    const modal = Modal({
        title: /*html*/ `
            <div class='file-title'>
                <span class='file-title-text d-flex'>
                    <span class='file-icon-container'>
                        <svg class='icon file-icon file-icon-js'>
                            <use href='#icon-javascript'></use>
                        </svg>
                    </span>
                    <span style='font-weight: 300;'>
                        ${path}/${file}
                    </span>
                </span>
            </div>
        `,
        titleStyle: 'width: 100%;',
        headerStyle: 'border-bottom: solid 1px #676E95; padding-bottom: 0px;',
        footerStyle: 'border-top: solid 1px #676E95;',
        close: false,
        scrollable: true,
        background: '#292D3E',
        centered: true,
        showFooter: false,
        async addContent(modalBody) {
            modalBody.style.height = '100vh';

            const loading = LoadingSpinner({
                message: `Loading <span style='font-weight: 300;'>${path}/${file}</span>`,
                classes: ['h-100', 'loading-file'],
                parent: modalBody
            });

            loading.add();

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <!-- <div class='file-title d-none'>
                    <span class='file-title-text d-flex'>
                        <span class='file-icon-container'>
                            <svg class='icon file-icon file-icon-js'>
                                <use href='#icon-javascript'></use>
                            </svg>
                        </span>
                        <span>
                            ${path}/${file}
                        </span>
                    </span>
                </div> -->
                <textarea class='code-mirror-container robi-code-background h-100'></textarea>
            `);

            let shouldReload = false;

            const editor = CodeMirror.fromTextArea(modal.find('.code-mirror-container'), {
                mode: 'javascript',
                lineNumbers: true,
                extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
            });
            editor.foldCode(CodeMirror.Pos(0, 0));
            editor.setSize(0, 0);
            editor.setOption('extraKeys', {
                'Ctrl-/'(cm) {
                    editor.toggleComment({
                        // this prop makes sure comments retain indented code
                        // https://github.com/codemirror/CodeMirror/issues/3765#issuecomment-171819763
                        indent: true
                    });
                },
                async 'Ctrl-S'(cm) {
                    // TODO: only save file if changed
                    console.log('save file');
                    // Save file
                    await saveFile();

            
                    // Add changed message
                    const changedMessaage = modal.find('.changed-message');

                    if (!changedMessaage) {
                        modal.find('.file-title-text').insertAdjacentHTML('beforeend', /*html*/ `
                            <div class='changed-message' style='margin-left: 10px; color: seagreen'>CHANGED (will reload on close)</div>
                        `);
                    }

                    // Set reload flag
                    shouldReload = true;

                },
                'Alt-W'(cm) {
                    console.log('close');
                    modal.close();
                },
                'Ctrl-Q'(cm) {
                    console.log('close file, check if saved');
                }
            });

            let fileValueRequest;
            let requestDigest;

            if (App.get('mode') === 'prod') {
                const sourceSiteUrl = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files('${file}')/$value`;

                requestDigest = await GetRequestDigest();

                fileValueRequest = await fetch(sourceSiteUrl, {
                    method: 'GET',
                    headers: {
                        'binaryStringRequestBody': 'true',
                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                        'X-RequestDigest': requestDigest
                    }
                });

            } else {
                const devPath = path.replace('App/', '');
                fileValueRequest = await fetch(`http://127.0.0.1:8080/${devPath}/${file}`);
                await Wait(1000);
            }

            // Overriden on save
            // FIXME: Doesn't work with app.js.
            let value = await fileValueRequest.text();

            // Always wait an extra 100ms for CodeMirror to settle.
            // For some reason, gutter width's won't apply 
            // correctly if the editor is modified too quickly.
            setTimeout(() => {
                // Remove loading message
                loading.remove();

                // Set codemirror
                setEditor();
            }, 100);

            // FIXME: Remember initial codemirorr doc value
            // compare this with current doc value
            let docValue;

            function setEditor() {
                editor.setSize('auto', 'auto');
                editor.setOption('viewportMargin', Infinity);
                editor.setOption('theme', 'material-palenight');
                editor.getDoc().setValue(value);
                editor.focus();

                docValue = editor.doc.getValue();

                // Watch for changes
                editor.on('change', event => {
                    // if (value === editor.doc.getValue()) {
                    if (docValue === editor.doc.getValue()) {
                        console.log('unchanged');

                        const dot = modal.find('.changed-dot');

                        if (dot) {
                            dot.remove();
                        }

                        saveAndCloseBtn.get().disabled = true;
                    } else {
                        console.log('changed');

                        const dot = modal.find('.changed-dot');

                        if (!dot) {
                            modal.find('.file-title').insertAdjacentHTML('beforeend', /*html*/ `
                                <div class='changed-dot' style='margin-left: 15px; width: 8px; height: 8px; background: white; border-radius: 50%;'></div>
                            `);
                        }

                        saveAndCloseBtn.get().disabled = false;
                    }
                });

                // Remove .modal-body top padding
                modalBody.style.paddingTop = '0px';

                // Save and close button
                const saveAndCloseBtn = BootstrapButton({
                    async action(event) {
                        // TODO: only save file if changed
                        await saveFile(event);
    
                        $(modal.get()).on('hidden.bs.modal', event => {
                            location.reload(true);
                        });
                        
                        setTimeout(() => {
                            // Enable button
                            $(event.target)
                                .removeAttr('disabled')
                                .text('Saved');
    
                            // Close modal (DOM node will be removed on hidden.bs.modal event)
                            modal.close();
                        }, 1000);
                    },
                    classes: ['w-100'],
                    disabled: true, // enable if changed
                    width: '100%',
                    parent: modal.find('.modal-footer'),
                    type: 'light',
                    value: 'Save and close'
                });
    
                saveAndCloseBtn.add();

                const cancelBtn = BootstrapButton({
                    action(event) {
                        modal.close();
                    },
                    classes: ['w-100 mt-2'],
                    width: '100%',
                    parent: modal.find('.modal-footer'),
                    style: 'color: white;',
                    value: 'Close'
                });

                cancelBtn.add();

                modal.showFooter();
            }

            $(modal.get()).on('hide.bs.modal', checkIfSaved);

            function checkIfSaved(event) {
                console.log('check if saved');
                console.log('param:', param);
                console.log('value:', value);
                console.log('editor:', editor.doc.getValue());

                // if (value === editor.doc.getValue()) {
                if (docValue === editor.doc.getValue()) {
                    console.log('unchanged');

                    if (shouldReload) {
                        // Dialog box
                        Store.get('appcontainer').append(/*html*/ `
                            <div class='dialog-container' style="position: fixed; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 10000">
                                <div class='dialog-box d-flex' style='min-width: 300px; min-height: 150px; padding: 30px; background: white; border-radius: 20px;'>
                                    <!-- Append loading spinner -->
                                </div>
                            </div>
                        `);

                        const loading = LoadingSpinner({
                            message: `Reloading`,
                            parent: Store.get('appcontainer').find('.dialog-box')
                        });
            
                        loading.add();

                        // Wait a second to make sure changes to list.js are committed
                        setTimeout(() => {
                            // Remove checkIfSaved before closing
                            $(modal.get()).off('hide.bs.modal', checkIfSaved);

                            // Remove dialog box
                            $(modal.get()).on('hide.bs.modal', event => {
                                Store.get('appcontainer').find('.dialog-container').remove();
                            });

                            // Reload
                            $(modal.get()).on('hidden.bs.modal', event => {
                                location.reload(true);
                            });

                            // Close modal (DOM node will be destroyed)
                            modal.close();
                        }, 1000);
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    console.log('changed');

                    Store.get('appcontainer').append(/*html*/ `
                        <div class='dialog-container' style="position: fixed; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; z-index: 10000">
                            <div class='dialog-box' style='padding: 30px; background: white; border-radius: 20px;'>
                                <div class='mb-2' style=''>
                                    Do you want to save the changes you made to list.js?
                                </div>
                                <div class='mb-4' style='font-size: 13px;'>
                                    Your changes will be lost if you don't save them.
                                </div>
                                <div class='button-container' style='display: flex; justify-content: space-between;'>
                                    <div style='display: flex; justify-content: flex-start;'>
                                        <button class='btn btn-secondary btn-sm dont-save'>Don't Save</button>
                                        <button class='btn btn-light btn-sm ml-2 cancel'>Cancel</button>
                                    </div>
                                    <div style='display: flex; justify-content: flex-end;'>
                                        <button class='btn btn-success save'>Save</button>
                                    <div>
                                </div>
                            </div>
                        </div>
                    `);

                    // Don't save
                    Store.get('appcontainer').find('.dialog-box .dont-save').addEventListener('click', event => {
                        // Remove save diaglog box
                        Store.get('appcontainer').find('.dialog-container').remove();
                        
                        // Remove checkIfSaved before closing
                        $(modal.get()).off('hide.bs.modal', checkIfSaved);

                        // Close modal (DOM node will be destroyed)
                        modal.close();
                    });

                    // Cancel
                    Store.get('appcontainer').find('.dialog-box .cancel').addEventListener('click', event => {
                        // Remove save dialog
                        Store.get('appcontainer').find('.dialog-container').remove();
                    });

                    // Save
                    Store.get('appcontainer').find('.dialog-box .save').addEventListener('click', async event => {
                        // Save file
                        await saveFile(event);

                        // Remove save dialog
                        Store.get('appcontainer').find('.dialog-container').remove();

                        // Remove checkIfSaved before closing
                        $(modal.get()).off('hide.bs.modal', checkIfSaved);

                        // Listen for modal has closed event, reload page since file changed
                        $(modal.get()).on('hidden.bs.modal', event => {
                            location.reload(true);
                        });
                        
                        // Close modal
                        setTimeout(() => {
                            // Enable button
                            $(event.target)
                                .removeAttr('disabled')
                                .text('Saved');

                            // Close modal (DOM node will be removed on hidden.bs.modal event)
                            modal.close();
                        }, 1000);
                    });

                    return false;
                }
            }

            async function saveFile(event) {
                if (event) {
                    // Disable button - Prevent user from clicking this item more than once
                    $(event.target)
                        .attr('disabled', '')
                        .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving');
                }

                let currentValue = editor.getDoc().getValue();

                // console.log(currentValue);

                // TODO: Move to SetFile action
                let setFile;

                if (App.get('mode') === 'prod') {
                    setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/Add(url='${file}',overwrite=true)`, {
                        method: 'POST',
                        body: currentValue, 
                        headers: {
                            'binaryStringRequestBody': 'true',
                            'Accept': 'application/json;odata=verbose;charset=utf-8',
                            'X-RequestDigest': requestDigest
                        }
                    });
                } else {
                    const devPath = path.replace('App/', '');
                    setFile = await fetch(`http://127.0.0.1:2035/?path=${devPath}&file=${file}`, {
                        method: 'POST',
                        body: currentValue
                    });
                    await Wait(1000);
                }

                if (setFile) {
                    const dot = modal.find('.changed-dot');

                    if (dot) {
                        dot.remove();
                    }

                    docValue = currentValue;
                    
                    return setFile;
                }
            }
        }
    });

    modal.add(); 
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function Post(param) {
    const {
        url,
        headers,
        data
    } = param;

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
    });

    try {
        return await response.json();
    } catch (error) {
        // console.log(error);
    }
}

/**
 * 
 * @param {*} event 
 */
export function ReinstallApp() {
    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            // Core lists
            const coreLists = Lists();
            console.log(coreLists);

            // App lists
            const appLists = lists;
            console.log(coreLists);

            // All Lists
            const allLists = Lists().concat(lists);
            console.log(allLists);

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h4 class='mb-3'>All <strong>${App.get('name')}</strong> lists will be reinstalled</h4>
                <ul>
                    ${
                        appLists
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            return /*html*/ `
                                <li>${item.list}</li>
                            `
                        }).join('\n')
                    }
                </ul>
                <h4 class='mb3 mt-4'>All <strong>Core</strong> lists will be reinstalled</h4>
                <ul>
                    ${
                        coreLists
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            return /*html*/ `
                                <li>${item.list}</li>
                            `
                        }).join('\n')
                    }
                </ul>
                <div class='alert alert-danger mt-5' style='border: none; border-radius: 10px;'>
                    All items will be deleted. This can't be undone. Proceed with caution.
                </div>
            `);

            const deleteBtn = BootstrapButton({
                async action(event) {
                    console.log('Reinstall');

                    modal.find('.modal-content').style.width = 'unset';

                    modalBody.style.height = `${modalBody.offsetHeight}px`;
                    modalBody.style.width = `${modalBody.offsetWidth}px`;
                    modalBody.style.overflowY = 'unset';
                    modalBody.style.display = 'flex';
                    modalBody.style.flexDirection = 'column',
                    modalBody.style.transition = 'all 300ms ease-in-out';
                    modalBody.innerHTML = '';
                    modalBody.style.height = '80vh';
                    modalBody.style.width = '80vw';

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <h3 class='console-title mb-0'>Reinstalling <strong>${App.get('name')}</strong></h3>
                    `);

                    let progressCount = 0;

                    coreLists.forEach(item => {
                        const { fields } = item;

                        // List + 1 for delete
                        // List + 1 for reinstall
                        progressCount = progressCount + 2;

                        fields.forEach(field => {
                            // Field +2 (add column to list and view)
                            progressCount = progressCount + 2;
                        });
                    });

                    lists.forEach(item => {
                        const { fields } = item;

                        // List + 1 for delete
                        // List + 1 for reinstall
                        progressCount = progressCount + 2;

                        fields.forEach(field => {
                            // Field +2 (add column to list and view)
                            progressCount = progressCount + 2;
                        });
                    });

                    const progressBar = ProgressBar({
                        parent: modalBody,
                        totalCount: progressCount
                    });

                    Store.add({
                        name: 'install-progress-bar',
                        component: progressBar
                    });

                    progressBar.add();

                    const deleteContainer = Container({
                        padding: '10px',
                        parent: modalBody,
                        overflow: 'hidden',
                        width: '100%',
                        height: '100%',
                        radius: '10px',
                        background: '#1E1E1E'
                    });

                    deleteContainer.add();

                    const reinstallConsole = InstallConsole({
                        type: 'secondary',
                        text: '',
                        margin: '0px',
                        parent: deleteContainer
                    });

                    Store.add({
                        name: 'install-console',
                        component: reinstallConsole
                    });

                    reinstallConsole.add();
                    reinstallConsole.get().classList.add('console');

                    // 1. CORE: Add core lists to install-console
                    reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Delete core lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    coreLists.forEach(item => {
                        const { list } = item;

                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in coreLists) {
                        // Create lists
                        await DeleteList(coreLists[list]);
                    }

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // 2. USER DEFINED: Add user defined lists to install-console
                    reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Delete '${App.get('name')}' lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    lists.forEach(item => {
                        const { list } = item;

                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in lists) {
                        // Create lists
                        await DeleteList(lists[list]);

                        // Add spacer to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='opacity: 0;'>Spacer</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    // REINSTALL ----------------------------------------------------------------------------------------

                    // 1. CORE: Add core lists to install-console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Create core lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    coreLists.forEach(item => {
                        const { list } = item;

                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in coreLists) {
                        // Create lists
                        await CreateList(coreLists[list]);

                        // Add spacer to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='opacity: 0;'>Spacer</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    // 2. USER DEFINED: Add user defined lists to install-console
                    reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Create '${App.get('name')}' lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    lists.forEach(item => {
                        const { list } = item;

                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in lists) {
                        // Create lists
                        await CreateList(lists[list]);

                        // Add spacer to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='opacity: 0;'>Spacer</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    const questionTypesKeyExists = await Get({
                        list: 'Settings',
                        filter: `Key eq 'QuestionTypes'`
                    });

                    if (questionTypesKeyExists[0]) {
                        console.log(`Key 'Question Types' in Settings already exists.`);

                        // 1. Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>Key 'Question Types' in Settings already exists.</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    } else {
                        const questionTypes = App.get('questionTypes');
                        // Add question types
                        await CreateItem({
                            list: 'Settings',
                            data: {
                                Key: 'QuestionTypes',
                                Value: JSON.stringify(questionTypes)
                            }
                        });

                        console.log(`Added Question Types: ${JSON.stringify(questionTypes)}`);

                        // 1. Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>Question Types ${JSON.stringify(questionTypes)} added to 'Settings'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add Release Notes
                    const releaseNoteExists = await Get({
                        list: 'ReleaseNotes',
                        filter: `Summary eq 'App installed'`
                    });

                    if (releaseNoteExists[0]) {
                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>'App installed' release note already exists.'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    } else {
                        await CreateItem({
                            list: 'ReleaseNotes',
                            data: {
                                Summary: 'App installed',
                                Description: 'Initial lists and items created.',
                                Status: 'Published',
                                MajorVersion: '0',
                                MinorVersion: '1',
                                PatchVersion: '0',
                                ReleaseType: 'Current'
                            }
                        });

                        console.log(`Added Release Note: App installed. Initial lists and items created.`);

                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>'App installed - Core lists and items created.' added to 'releaseNotes'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                   if (lists.length) {
                        // Add Release Notes
                        const releaseNoteExists = await Get({
                            list: 'ReleaseNotes',
                            filter: `Summary eq '${App.get('name')} lists created'`
                        });

                        if (releaseNoteExists[0]) {
                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'${App.get('name')} lists created' release note already exists.'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        } else {
                            // Add Release Notes
                            await CreateItem({
                                list: 'ReleaseNotes',
                                data: {
                                    Summary: `${App.get('name')} lists created`,
                                    Description: lists.map(item => item.list).join(', ') + '.',
                                    Status: 'Published',
                                    MajorVersion: '0',
                                    MinorVersion: '1',
                                    PatchVersion: '0',
                                    ReleaseType: 'Current'
                                }
                            });

                            console.log(`Added Release Note: ${App.get('name')} lists created - ${lists.map(item => item.list).join(', ')}.`);

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'${App.get('name')} lists created - ${lists.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }
                    }

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Create developer account
                    const url = `${App.get('site')}/../_api/web/CurrentUser`;
                    const fetchOptions = {
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Accept': 'application/json; odata=verbose'
                        }
                    };
                    const currentUser = await fetch(url, fetchOptions);
                    const response = await currentUser.json();
                    
                    const appUser = await Get({
                        list: App.get('usersList') || 'Users',
                        select: coreLists.find(item => item.list === App.get('usersList') || item.list === 'Users').fields.map(field => field.name),
                        filter: `Email eq '${response.d.Email}'`
                    });
            
                    // User already exists
                    if (appUser && appUser[0]) {
                        console.log(`User account for '${response.d.Title}' already exists.`);

                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>User account for '${response.d.Title}' already exists.</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    } else {
                        /** Create user */
                        await CreateItem({
                            list: 'Users',
                            data: {
                                Title: response.d.Title,
                                Email: response.d.Email,
                                LoginName: response.d.LoginName.split('|')[2],
                                Role: 'Developer',
                                Settings: App.get('userSettings')
                            }
                        });

                        console.log(`Created user account for '${response.d.Title}' with role 'Developer'`);

                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>User account for '${response.d.Title}' created with role 'Developer'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    // Check if app is already installed
                    const isInstalled = await GetAppSetting('Installed');
        
                    if (!isInstalled) {
                        // Create key 'Installed'
                        await CreateItem({
                            list: 'Settings',
                            data: {
                                Key: 'Installed',
                                Value: 'Yes'
                            }
                        });
                    } else if (isInstalled.Value === 'No') {
                        // Update key 'Installed'
                        await UpdateItem({
                            list: 'Settings',
                            itemId: isInstalled.Id,
                            data: {
                                Value: 'Yes'
                            }
                        });
                    }

                    console.log('App installed');

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    let spacers = '==================';

                    for (let i = 0; i < App.get('name').length; i++) {
                        spacers = spacers + '=';
                    }
                    
                    // 3. Add to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: mediumseagreen !important;'>${spacers}</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: mediumseagreen !important;'>| '${App.get('name')}' reinstalled |</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: mediumseagreen !important;'>${spacers}</code>
                        </div>
                    `);

                    // END REINSTALL ------------------------------------------------------------------------------------

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div class='mt-4 mb-2'>All lists have been successfully reinstall.</div>
                    `);

                    // Show return button
                    const returnBtn = BootstrapButton({
                        type: 'primary',
                        value: 'Reload',
                        classes: ['w-100'],
                        action(event) {
                            // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                            $(modal.get()).on('hidden.bs.modal', event => {
                                console.log('Modal close animiation end');
                                console.log('Reload');

                                location.reload();
                            });

                            modal.close();
                        },
                        parent: modalBody
                    });

                    returnBtn.add();

                    // Scroll console to bottom (after launch button pushes it up);
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                },
                classes: ['w-100'],
                width: '100%',
                parent: modalBody,
                type: 'danger',
                value: `Reinstall ${App.get('name')}`
            });

            deleteBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel delete');

                    modal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: 'light',
                value: 'Cancel'
            });

            cancelBtn.add();
        },
        centered: true,
        showFooter: false,
    });

    modal.add();
}

/**
 * 
 * @param {*} event 
 */
export function ResetApp() {
    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            // Core lists
            const coreLists = Lists();
            console.log(coreLists);

            // App lists
            const appLists = lists;
            console.log(coreLists);

            // All Lists
            const allLists = Lists().concat(appLists);
            console.log(allLists);

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h4 class='mb-3'>Select <strong>${App.get('name')}</strong> lists to reset</span></h4>
                ${
                    appLists
                    .sort((a, b) => a.list - b.list)
                    .map(item => {
                        return /*html*/ `
                            <div class="form-check ml-2">
                                <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}'>
                                <label class="form-check-label" for="checkbox-${item.list.split(' ').join('-')}">
                                    ${item.list}
                                </label>
                            </div>
                        `
                    }).join('\n')
                }
                <h4 class='mt-4 mb-3'>Select <strong>Core</strong> lists to reset</h4>
                ${
                    coreLists
                    .filter(item => item.list !== 'Settings')
                    .sort((a, b) => a.list - b.list)
                    .map(item => {
                        return /*html*/ `
                            <div class="form-check ml-2">
                            <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}'>
                                <label class="form-check-label" for="checkbox-${item.list.split(' ').join('-')}">
                                    ${item.list}
                                </label>
                            </div>
                        `
                    }).join('\n')
                }
                <div class='alert alert-danger mt-5' style='border: none; border-radius: 10px;'>
                    All items in selected lists will be deleted. This can't be undone. Proceed with caution.
                </div>
            `);

            const deleteBtn = BootstrapButton({
                async action(event) {
                    console.log('Reinstall');

                    // Get checked lists
                    const checkedLists = [...modal.findAll('.form-check-input:checked')].map(node => allLists.find(item => item.list === node.dataset.list));

                    console.log(checkedLists);

                    if (!checkedLists.length) {
                        alert('Select at least one list to reset.');
                        return;
                    }

                    modal.find('.modal-content').style.width = 'unset';

                    modalBody.style.height = `${modalBody.offsetHeight}px`;
                    modalBody.style.width = `${modalBody.offsetWidth}px`;
                    modalBody.style.overflowY = 'unset';
                    modalBody.style.display = 'flex';
                    modalBody.style.flexDirection = 'column',
                    modalBody.style.transition = 'all 300ms ease-in-out';
                    modalBody.innerHTML = '';
                    modalBody.style.height = '80vh';
                    modalBody.style.width = '80vw';

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <h3 class='console-title mb-0'>Reseting <strong>lists</strong></h3>
                    `);

                    let progressCount = 0;

                    checkedLists.forEach(item => {
                        const { fields } = item;

                        // List + 1 for delete
                        // List + 1 for reinstall
                        progressCount = progressCount + 2;

                        fields.forEach(field => {
                            // Field +2 (add column to list and view)
                            progressCount = progressCount + 2;
                        });
                    });

                    const progressBar = ProgressBar({
                        parent: modalBody,
                        totalCount: progressCount
                    });

                    Store.add({
                        name: 'install-progress-bar',
                        component: progressBar
                    });

                    progressBar.add();

                    const deleteContainer = Container({
                        padding: '10px',
                        parent: modalBody,
                        overflow: 'hidden',
                        width: '100%',
                        height: '100%',
                        radius: '10px',
                        background: '#1E1E1E'
                    });

                    deleteContainer.add();

                    const reinstallConsole = InstallConsole({
                        type: 'secondary',
                        text: '',
                        margin: '0px',
                        parent: deleteContainer
                    });

                    Store.add({
                        name: 'install-console',
                        component: reinstallConsole
                    });

                    reinstallConsole.add();
                    reinstallConsole.get().classList.add('console');

                    // 1. CORE: Add core lists to install-console
                    reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Delete lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    checkedLists.forEach(item => {
                        const { list } = item;

                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in checkedLists) {
                        // Create lists
                        await DeleteList(checkedLists[list]);
                    }

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // RESET ----------------------------------------------------------------------------------------

                    // 1. CORE: Add core lists to install-console
                    reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Create lists:</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    checkedLists.forEach(item => {
                        const { list } = item;

                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>- ${list}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    });

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Add default lists first
                    for (let list in checkedLists) {
                        // Create lists
                        await CreateList(checkedLists[list]);

                        // Add spacer to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='opacity: 0;'>Spacer</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    // Add Release Notes
                    const releaseNoteExists = await Get({
                        list: 'ReleaseNotes',
                        filter: `Summary eq 'App installed'`
                    });

                    if (releaseNoteExists[0]) {
                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>'App installed' release note already exists.'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    } else {
                        await CreateItem({
                            list: 'ReleaseNotes',
                            data: {
                                Summary: 'App installed',
                                Description: 'Initial lists and items created.',
                                Status: 'Published',
                                MajorVersion: '0',
                                MinorVersion: '1',
                                PatchVersion: '0',
                                ReleaseType: 'Current'
                            }
                        });

                        console.log(`Added Release Note: App installed. Initial lists and items created.`);

                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>'App installed - Core lists and items created.' added to 'releaseNotes'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                   if (lists.length) {
                        // Add Release Notes
                        const releaseNoteExists = await Get({
                            list: 'ReleaseNotes',
                            filter: `Summary eq '${App.get('name')} lists created'`
                        });

                        if (releaseNoteExists[0]) {
                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'${App.get('name')} lists created' release note already exists.'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        } else {
                            // Add Release Notes
                            await CreateItem({
                                list: 'ReleaseNotes',
                                data: {
                                    Summary: `${App.get('name')} lists created`,
                                    Description: lists.map(item => item.list).join(', ') + '.',
                                    Status: 'Published',
                                    MajorVersion: '0',
                                    MinorVersion: '1',
                                    PatchVersion: '0',
                                    ReleaseType: 'Current'
                                }
                            });

                            console.log(`Added Release Note: ${App.get('name')} lists created - ${lists.map(item => item.list).join(', ')}.`);

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'${App.get('name')} lists created - ${lists.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }
                    }

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    // Create developer account
                    const url = `${App.get('site')}/../_api/web/CurrentUser`;
                    const fetchOptions = {
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Accept': 'application/json; odata=verbose'
                        }
                    };
                    const currentUser = await fetch(url, fetchOptions);
                    const response = await currentUser.json();
                    
                    const appUser = await Get({
                        list: App.get('usersList') || 'Users',
                        select: coreLists.find(item => item.list === App.get('usersList') || item.list === 'Users').fields.map(field => field.name),
                        filter: `Email eq '${response.d.Email}'`
                    });
            
                    // User already exists
                    if (appUser && appUser[0]) {
                        console.log(`User account for '${response.d.Title}' already exists.`);

                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>User account for '${response.d.Title}' already exists.</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    } else {
                        /** Create user */
                        await CreateItem({
                            list: 'Users',
                            data: {
                                Title: response.d.Title,
                                Email: response.d.Email,
                                LoginName: response.d.LoginName.split('|')[2],
                                Role: 'Developer',
                                Settings: App.get('userSettings')
                            }
                        });

                        console.log(`Created user account for '${response.d.Title}' with role 'Developer'`);

                        // Add to console
                        reinstallConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>User account for '${response.d.Title}' created with role 'Developer'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    }

                    // Add spacer to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='opacity: 0;'>Spacer</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                    let spacers = '===============';

                    // for (let i = 0; i < App.get('name').length; i++) {
                    //     spacers = spacers + '=';
                    // }
                    
                    // 3. Add to console
                    reinstallConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: mediumseagreen !important;'>${spacers}</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: mediumseagreen !important;'>| Lists reset |</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: mediumseagreen !important;'>${spacers}</code>
                        </div>
                    `);

                    // END RESET ------------------------------------------------------------------------------------

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div class='mt-4 mb-4'>All selected lists have been successfully reset. You can safely close this modal.</div>
                    `);

                    // Show return button
                    const returnBtn = BootstrapButton({
                        type: 'primary',
                        value: 'Close',
                        classes: ['w-100'],
                        action(event) {
                            // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                            $(modal.get()).on('hidden.bs.modal', event => {
                                console.log('Modal close animiation end');
                                console.log('Reload');

                                Route(location.href.split('#')[1] || '');
                            });

                            modal.close();
                        },
                        parent: modalBody
                    });

                    returnBtn.add();

                    // Scroll console to bottom (after launch button pushes it up);
                    reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                },
                classes: ['w-100'],
                width: '100%',
                parent: modalBody,
                type: 'danger',
                value: `Reset lists`
            });

            deleteBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel delete');

                    modal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: 'light',
                value: 'Cancel'
            });

            cancelBtn.add();
        },
        centered: true,
        showFooter: false,
    });

    modal.add();
}

/**
 * 
 * @param {*} path 
 * @param {*} options 
 * @returns 
 */
export function Route(path = App.get('defaultRoute'), options = {}) {
    const {
        scrollTop
    } = options;

    /** Remove modal overlay */
    const overlay = document.querySelector('.modal-backdrop');

    if (overlay) {
        overlay.remove();
    }

    /** Abort all pending fetch requests */
    Store.abortAll();

    /** Terminate all running workers */
    Store.terminateWorkers();

    /** Get references to core app components */
    const appContainer = Store.get('appcontainer');
    const sidebar = Store.get('sidebar');
    const mainContainer = Store.get('maincontainer');

    /** Set scroll top */
    Store.viewScrollTop(mainContainer.get().scrollTop);

    // Turn padding back on
    // mainContainer.paddingOn();

    /** Remove all events attached to the maincontainer */
    mainContainer.removeEvents();

    /** Empty mainconatainer DOM element */
    mainContainer.empty();

    /** Empty store */
    Store.empty();

    /** Re-add core app component references to store */
    Store.add({
        name: 'appcontainer',
        component: appContainer
    });
    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });
    Store.add({
        name: 'sidebar',
        component: sidebar
    });

    // FIXME: Experimental.
    // Trying to solve the problem where components are
    // added to the current view after the user routes away from 
    // the view the component is added from.
    // 
    // This only happens when a fetch request begins when 
    // a view is first routed to but is aborted if the user
    // routes away before the request can finish.
    // Components created and added later are still 'running'
    // in the background.
    // 
    // Most views use Store.get('maincontainer') as their parent.
    // This means components will still be added because they're
    // finding the new maincontainer for that view.
    const viewContainer = ViewContainer({
        parent: mainContainer,
    });

    viewContainer.add();

    /** Check route path */
    const pathAndQuery = path.split('?');
    const pathParts = pathAndQuery[0].split('/');
    
    /** Only select first path, remove any ? that might be passed in */
    const route = Store.routes().find(item => item.path === pathParts[0]);

    if (!route) {
        /** TODO: Reset history state? */
        Route('404');

        return;
    }

    /** Set browswer history state */
    History({
        url: `${location.href.split('#')[0]}${(path) ? `#${path}` : ''}`,
        title: `${App.get('title')}${(path) ? ` - ${pathAndQuery[0]}` : ''}`
        // title: `${App.title}${(path) ? ` - ${path}` : ''}`
    });

    sidebar.selectNav(route.path);

    /** Log route*/
    if (options.log !== false) {
        try {
            Log({
                Title: 'Route',
                Message: `${Store.user().Email || 'User'} routed to ${route.path}`,
                StackTrace: new Error().stack,
                // SessionId: '', // randomly generated UUID
                Module: import.meta.url
            });
        } catch (error) {
            console.error(error);
        }
    }

    /** Call .go() method */
    route.go({
        parent: viewContainer,
        pathParts,
        props: queryStringToObject(path.split('?')[1])
    });

    /** 
     * Modified from {@link https://stackoverflow.com/a/61948784} 
     */
    function queryStringToObject(queryString) {
        if (!queryString) {
            return {}
        };

        const pairs = queryString.split('&');
        // → ["foo=bar", "baz=buzz"]

        const array = pairs.map(el => {
            const parts = el.split('=');
            return parts;
        });
        // → [["foo", "bar"], ["baz", "buzz"]]

        return Object.fromEntries(array);
        // → { "foo": "bar", "baz": "buzz" }
    }

    /** Set Scroll Top */
    /** @todo this needs to run only after all async calls have completed */
    /** @note maybe Views should always return a promise? */
    /** @note or could just use a callback passed to the view */
    if (scrollTop) {
        console.log(scrollTop);

        Store.get('maincontainer').get().scrollTo({
            top: scrollTop
        });
    }
}

/** 
 * @example
 *  await SendEmail({
 *      From: 'i:0e.t|dod_adfs_provider|1098035555@mil',
 *      To:['i:0e.t|dod_adfs_provider|1098035555@mil'],
 *      CC: [
 *          'i:0e.t|dod_adfs_provider|1098035555@mil'
 *      ],
 *      Subject: `QPP - Test`,
 *      Body: `
 *          <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
 *              <p>Test</p>
 *          </div>
 *      `
 *  });
 *
 */
export async function SendEmail(param) {
    const {
        From,
        To,
        CC,
        Subject,
        Body
    } = param;

    const requestDigest = await GetRequestDigest();
    const headers = {
        "Accept": "application/json;odata=verbose",
        "Content-type": "application/json; odata=verbose",
        "X-RequestDigest": requestDigest,
    }

    /** {@link https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-csom/jj171404(v=office.15)} */
    const properties = {
        'properties': {
            __metadata: {
                type: 'SP.Utilities.EmailProperties'
            },
            From: From,
            To: {
                results: [To]
            },
            CC: {
                results: CC || []
            },
            Body,
            Subject: Subject
        }
    };

    console.log(JSON.stringify(properties));

    const response = await fetch(`${App.get('site')}/_api/SP.Utilities.Utility.SendEmail`, {
        method: 'POST',
        headers,
        body: JSON.stringify(properties)
    });

    return response;
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function SetHomePage(param = {}) {
    const { file, web, site } = param;

    const requestDigest = await GetRequestDigest({web});
    const headers = {
        "Accept": "application/json;odata=verbose",
        "Content-type": "application/json; odata=verbose",
        "IF-MATCH": "*",
        "X-HTTP-Method": "PATCH",
        "X-RequestDigest": requestDigest,
    }

    const properties = {
        '__metadata': {
            'type': 'SP.Folder'
        },
        'WelcomePage': file || 'App/src/pages/app.aspx'
    };

    const response = await fetch(`${site || App.get('site')}${web ? `/${web}` : ''}/_api/web/rootfolder`, {
        method: 'POST',
        headers,
        body: JSON.stringify(properties)
    });

    return response;
}

/**
 * Set session storage key value pairs.
 * @param {Object}   param          Interface to module.   
 */
export async function SetSessionStorage(param) {
    const {
        sessionStorageData
    } = param;

    if (!sessionStorageData) {
        return;
    }

    sessionStorageData.forEach(item => {
        const {
            key,
            value
        } = item;

        sessionStorage.setItem(key, value);
    });
}

/**
 * 
 * @param {*} param 
 */
export function Start(param) {
    const {
        settings
    } = param;

    const {
        links,
    } = settings;

    // Set app settings
    App.set(settings);

    // toTitleCase string method polyfil
    String.prototype.toTitleCase = function () {
        return this
            .toLowerCase()
            .split(' ')
            .map(word => word.replace(word[0], word[0]?.toUpperCase()))
            .join(' ');
    }

    if (App.get('errorLogging') === 'on') {
        /** Format error objects for JSON.stringify() to work properly */
        function replaceErrors(key, value) {
            if (value instanceof Error) {
                var error = {};

                Object.getOwnPropertyNames(value).forEach(function (key) {
                    error[key] = value[key];
                });

                return error;
            }

            return value;
        }

        /** Log errors to SharePoint list */
        window.onerror = async (message, source, lineno, colno, error) => {
            LogError({
                Message: message,
                Source: source,
                Error: JSON.stringify(error, replaceErrors)
            });
        }

        /** Log errors from Promises to SharePoint list */
        window.addEventListener("unhandledrejection", event => {
            LogError({
                Message: event.reason.message,
                Source: import.meta.url,
                Error: event.reason.stack
            });
        });
    }

    /** Start app on page load */
    window.onload = async () => {
        // Add links to head
        AddLinks({
            links
        });
        
        // Add appcontainer
        const appContainer = AppContainer();

        Store.add({
            name: 'appcontainer',
            component: appContainer
        });

        appContainer.add();

        // Pass start param to InstallApp
        InitializeApp(param);
    }
}

/**
 * 
 * @param {*} param 
 */
export function TestInstall(param) {
    // Start loading bar animation
    const loadingBar = LoadingBar({
        displayLogo: App.get('logoLarge'),
        displayTitle: App.get('name'),
        totalCount: preLoadLists?.length || 0,
        loadingBar: 'hidden',
        onReady(event) {
            const modal = Modal({
                title: false,
                disableBackdropClose: true,
                scrollable: true,
                async addContent(modalBody) {
                    modalBody.classList.add('install-modal');

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div><strong>${App.get('name')}</strong> isn't installed on this <a href='${App.get('site')}' target='_blank'>${App.get('site')}</a>. Would you like to install it now? You can uninstall it later.</div>
                    `);

                    const installBtn = BootstrapButton({
                        action(event) {
                            console.log('Install');

                            modal.find('.modal-content').style.width = 'unset';

                            modalBody.style.height = `${modalBody.offsetHeight}px`;
                            modalBody.style.width = `${modalBody.offsetWidth}px`;
                            modalBody.style.overflowY = 'unset';
                            modalBody.style.display = 'flex';
                            modalBody.style.flexDirection = 'column',
                                modalBody.style.transition = 'all 300ms ease-in-out';
                            modalBody.innerHTML = '';
                            modalBody.style.height = '80vh';
                            modalBody.style.width = '80vw';

                            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                <h3 class='console-title mb-0'>Installing <strong>${App.get('name')}</strong></h3>
                            `);

                            const logs = [];

                            logs.push('Core lists:');
                            coreLists.forEach(item => {
                                const { list } = item;

                                logs.push(`- ${list}`);
                            });
                            logs.push(' ');

                            coreLists.forEach(item => {
                                const { list, fields } = item;

                                logs.push(`Created core list '${list}'`);

                                fields.forEach(field => {
                                    const { name } = field;

                                    logs.push(`Created column '${name}'`);
                                    logs.push(`Added column '${name}' to View 'All Items'`);
                                });

                                logs.push(' ');
                            });

                            logs.push(`${App.get('name')} lists:`);
                            lists.forEach(item => {
                                const { list } = item;

                                logs.push(`- ${list}`);
                            });
                            logs.push(' ');

                            lists.forEach(item => {
                                const { list, fields } = item;

                                logs.push(`Created ${App.get('name')} list '${list}'`);

                                fields.forEach(field => {
                                    const { name } = field;

                                    logs.push(`Created column '${name}'`);
                                    logs.push(`Added column '${name}' to View 'All Items'`);
                                });

                                logs.push(' ');
                            });

                            const progressBar = ProgressBar({
                                parent: modalBody,
                                totalCount: logs.length
                            });

                            progressBar.add();

                            const installContainer = Container({
                                padding: '10px',
                                parent: modalBody,
                                overflow: 'hidden',
                                width: '100%',
                                height: '100%',
                                radius: '10px',
                                background: '#1E1E1E'
                            });

                            installContainer.add();

                            const installConsole = InstallConsole({
                                type: 'secondary',
                                text: '',
                                margin: '0px',
                                parent: installContainer
                            });

                            installConsole.add();
                            installConsole.get().classList.add('console');

                            let line = 0;
                            let timeout = 50;

                            for (let i = 0; i < logs.length; i++) {
                                setTimeout(() => {
                                    line++;

                                    progressBar.update();

                                    installConsole.append(/*html*/ `
                                        <div class='console-line'>
                                            <code class='line-number'>${line}</code>
                                            <code>${logs[i]}</code>
                                        </div>
                                    `);

                                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                                }, (i + 1) * timeout);
                            }

                            setTimeout(() => {
                                line++;

                                installConsole.append(/*html*/ `
                                    <div class='console-line'>
                                        <code class='line-number'>${line}</code>
                                        <code>'${App.get('name')}' installed</code>
                                    </div>
                                `);

                                // Show launch button
                                const launchBtn = BootstrapButton({
                                    type: 'primary',
                                    value: 'Launch app',
                                    classes: ['mt-3', 'w-100'],
                                    action(event) {
                                        console.log('Launch');

                                        modal.close();
                                        loadingBar.showLoadingBar();

                                        // TODO: Launch after animation end, not timeout
                                        setTimeout(() => {
                                            LaunchApp(param);
                                        }, 150);
                                    },
                                    parent: modalBody
                                });

                                launchBtn.add();

                                installConsole.get().scrollTop = installConsole.get().scrollHeight;
                            }, (logs.length + 1) * timeout);
                        },
                        classes: ['w-100 mt-5'],
                        width: '100%',
                        parent: modalBody,
                        type: 'primary',
                        value: 'Install'
                    });

                    installBtn.add();

                    const modifyBtn = BootstrapButton({
                        action(event) {
                            window.open(`${App.get('site')}/${library || 'App'}/src`);
                        },
                        classes: ['w-100 mt-2'],
                        width: '100%',
                        parent: modalBody,
                        type: 'outline-primary',
                        value: 'Modify source'
                    });

                    modifyBtn.add();

                    const cancelBtn = BootstrapButton({
                        action(event) {
                            console.log('Cancel install');

                            // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                            $(modal.get()).on('hidden.bs.modal', event => {
                                console.log('modal close animiation end');

                                // Show alert
                                appContainer.get().insertAdjacentHTML('afterend', /*html*/ `
                                    <div class='position-absolute install-alert mb-0'>
                                        Installation cancelled. You can safely close this page. Reload page to resume install.
                                    </div>
                                `);
                            });

                            modal.close();
                        },
                        classes: ['w-100 mt-2'],
                        width: '100%',
                        parent: modalBody,
                        type: 'light',
                        value: 'Cancel'
                    });

                    cancelBtn.add();
                },
                centered: true,
                showFooter: false,
            });

            modal.add();
        }
    });

    loadingBar.add();

    Store.add({
        name: 'app-loading-bar',
        component: loadingBar
    });
}

/**
 * 
 * @param {*} param
 */
export function UpdateApp() {
    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            // Show loading
            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <div class='loading-spinner w-100 d-flex flex-column justify-content-center align-items-center'>
                    <div class="mb-2" style='font-weight: 600; color: darkgray'>Loading lists</div>
                    <div class="spinner-grow" style='color: darkgray' role="status"></div>
                </div>
            `);

            // Check lists
            const listsToIgnore =  ['App', 'Composed Looks', 'Documents', 'Master Page Gallery', 'MicroFeed', 'Site Assets', 'Site Pages'];
            const coreLists = Lists();
            const appLists = lists;
            const allLists = coreLists.concat(appLists);
            const webLists = await GetWebLists();
            const installedLists = webLists.map(item => item.Title).filter(x => allLists.map(item => item.list).includes(x));
            const diffToCreate = allLists.map(item => item.list).filter(x => !webLists.map(item => item.Title).includes(x));
            const diffToDelete = webLists.map(item => item.Title).filter(x => !allLists.map(item => item.list).includes(x) && !listsToIgnore.includes(x));
            console.log('All Lists:', allLists);
            console.log('Web Lists:', webLists);
            console.log('Installed Lists:', installedLists);
            console.log('Create:', diffToCreate);
            console.log('Delete:', diffToDelete);

            // News lists that need to be created
            const toCreate = diffToCreate.map(list => allLists.find(item => item.list === list));

            // Existing lists that need to be deleted
            // TODO: Show checklist of lists that could be deleted, default to DO NOT Delete
            const toDelete = diffToDelete.map(list => webLists.find(item => item.Title === list));

            // Has the schema changed on any lists?
            const fieldsToIgnore = ['ContentTypeId', 'Title', '_ModerationComments', 'File_x0020_Type', 'ID', 'Id', 'ContentType', 'Modified', 'Created', 'Author', 'Editor', '_HasCopyDestinations', '_CopySource', 'owshiddenversion', 'WorkflowVersion', '_UIVersion', '_UIVersionString', 'Attachments', '_ModerationStatus', 'Edit', 'LinkTitleNoMenu', 'LinkTitle', 'LinkTitle2', 'SelectTitle', 'InstanceID', 'Order', 'GUID', 'WorkflowInstanceID', 'FileRef', 'FileDirRef', 'Last_x0020_Modified', 'Created_x0020_Date', 'FSObjType', 'SortBehavior', 'PermMask', 'FileLeafRef', 'UniqueId', 'SyncClientId', 'ProgId', 'ScopeId', 'HTML_x0020_File_x0020_Type', '_EditMenuTableStart', '_EditMenuTableStart2', '_EditMenuTableEnd', 'LinkFilenameNoMenu', 'LinkFilename', 'LinkFilename2', 'DocIcon', 'ServerUrl', 'EncodedAbsUrl', 'BaseName', 'MetaInfo', '_Level', '_IsCurrentVersion', 'ItemChildCount', 'FolderChildCount', 'AppAuthor', 'AppEditor'];
            const schemaAdd = [];
            const schemaDelete = [];

            installedLists
            .map(listName => {
                const { list, fields } = allLists.find(item => item.list === listName);

                return { list, fields, web: webLists.find(item => item.Title === listName) };
            })
            .forEach(item => {
                const { list, fields, web } = item;

                const webFields = web.Fields.results.map(webField => {
                    const { StaticName, TypeDisplayName } = webField

                    return { name: StaticName, type: TypeDisplayName }
                });

                const fieldsToCreate = fields.map(item => item.name).filter(x => !webFields.map(item => item.name).includes(x));
                const fieldsToDelete = webFields.map(item => item.name).filter(x => !fields.map(item => item.name).includes(x) && !fieldsToIgnore.includes(x));

                console.log()

                if (fieldsToCreate.length) {
                    schemaAdd.push({
                        list,
                        fields: fieldsToCreate
                    });
                }

                if (fieldsToDelete.length) {
                    schemaDelete.push({
                        list,
                        fields: fieldsToDelete
                    });
                }

                console.log('List:', list);
                console.log('--------------------');
                // console.log('List Fields:', fields);
                // console.log('Web Fields:', webFields);
                console.log('Create fields:', fieldsToCreate);
                console.log('Remove fields:', fieldsToDelete);
                console.log(' ');
            });

            console.log('Fields to add:', schemaAdd);
            console.log('Fields to delete:', schemaDelete);

            // const { toCreate, toDelete, schemaAdd, schemaDelete } = await CheckLists();
            
            // Remove loading
            modal.find('.loading-spinner').remove();

            // Are there new lists in lists.js that need to be created?
            if (toCreate.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-success mb-4'>
                        <h4 class='mb-4'>Create lists</h4>
                        <div class='create-lists alert alert-light'>
                            ${
                                toCreate
                                .sort((a, b) => a.list - b.list)
                                .map(item => {
                                    return /*html*/ `
                                        <div class="form-check ml-2">
                                            <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}' checked>
                                            <label class="form-check-label" for="checkbox-${item.list.split(' ').join('-')}">
                                                ${item.list}
                                            </label>
                                        </div>
                                    `
                                }).join('\n')
                            }
                        </div>
                    </div>
                `);
            }

            // Choose columns to add
            if (schemaAdd.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-success mb-4'>    
                        <h4 class='mb-4'>Add new fields to installed lists</h4>
                        <div class='schema-add'>
                            ${
                                schemaAdd
                                .sort((a, b) => a.list - b.list)
                                .map(item => {
                                    const { list, fields } = item;
                                    return /*html*/ `
                                        <div class='alert alert-light'>
                                            <h5 data-list='${list}'>${list}</h5>
                                            ${
                                                fields.map(field => {
                                                    return /*html*/ `
                                                        <div class="form-check ml-2">
                                                            <input class="form-check-input" type="checkbox" value="${field}" id="checkbox-${field}" data-list='${list}' checked>
                                                            <label class="form-check-label" for="checkbox-${field}">
                                                                ${field}
                                                            </label>
                                                        </div>
                                                    `
                                                }).join('\n')
                                            }
                                        </div>
                                    `;
                                }).join('\n')
                            }
                        </div>
                    </div>
                `);
            }

            // Have lists been removed from list.js that need to be removed?
            if (toDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-danger mb-4'>
                        <h4 class='mb-4'>Delete lists</h4>
                        <div class='delete-lists alert alert-light'>
                            ${
                                diffToDelete
                                // .sort((a, b) => a.list - b.list)
                                .sort((a, b) => a - b)
                                .map(item => {
                                    return /*html*/ `
                                        <div class="form-check ml-2">
                                            <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.split(' ').join('-')}" data-list='${item}'>
                                            <label class="form-check-label" for="checkbox-${item.split(' ').join('-')}">
                                                ${item}
                                            </label>
                                        </div>
                                    `
                                }).join('\n')
                            }
                        </div>
                    </div>
                `);
            }


            // Choose columns to delete (DESTRUCTIVE)
            if (schemaDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-danger mb-4'>
                        <h4 class='mb-4'>Delete fields from installed lists</h4>
                        <div class='schema-delete'>
                            ${
                                schemaDelete
                                .sort((a, b) => a.list - b.list)
                                .map(item => {
                                    const { list, fields } = item;
                                    return /*html*/ `
                                        <div class='alert alert-light'>
                                            <h5 data-list='${list}'>${list}</h5>
                                            ${
                                                fields.map(field => {
                                                    return /*html*/ `
                                                        <div class="form-check ml-2">
                                                            <input class="form-check-input" type="checkbox" value="${field}" id="checkbox-${field}" data-list='${list}'>
                                                            <label class="form-check-label" for="checkbox-${field}">
                                                                ${field}
                                                            </label>
                                                        </div>
                                                    `
                                                }).join('\n')
                                            }
                                        </div>
                                    `;
                                }).join('\n')
                            }
                        </div>
                    </div>
                `);
            }

            if (toCreate.length || toDelete.length || schemaAdd.length || schemaDelete.length) {
                const installBtn = BootstrapButton({
                    async action(event) {
                        // Get checked lists
                        const checkedCreate = [...modal.findAll('.create-lists .form-check-input:checked')].map(node => allLists.find(item => item.list === node.dataset.list));
                        const checkedDelete = [...modal.findAll('.delete-lists .form-check-input:checked')].map(node => webLists.find(item => item.Title === node.dataset.list));
                        const checkedSchemaAdd = [...modal.findAll('.schema-add .form-check-input:checked')].map(node => {
                            const list = node.dataset.list;
                            const name = node.value;
                            const field = allLists.find(item => item.list === list).fields.find(item => item.name == name);

                            return { 
                                list, 
                                field 
                            };
                        });
                        const checkedSchemaDelete = [...modal.findAll('.schema-delete .form-check-input:checked')].map(node => {
                            return { list: node.dataset.list, name: node.value };
                        });

                        console.log('Checked Add', checkedSchemaAdd);
                        console.log('Checked Delete', checkedSchemaDelete);

                        // if (!checkedCreate.concat(checkedDelete).length) {
                        //     alert('Select at least one list');
                        //     return;
                        // }

                        modal.find('.modal-content').style.width = 'unset';

                        modalBody.style.height = `${modalBody.offsetHeight}px`;
                        modalBody.style.width = `${modalBody.offsetWidth}px`;
                        modalBody.style.overflowY = 'unset';
                        modalBody.style.display = 'flex';
                        modalBody.style.flexDirection = 'column',
                        modalBody.style.transition = 'all 300ms ease-in-out';
                        modalBody.innerHTML = '';
                        modalBody.style.height = '80vh';
                        modalBody.style.width = '80vw';

                        modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                            <h3 class='console-title mb-0'>Updating <strong>lists</strong></h3>
                        `);

                        // List delete and schema delete only increment progressbar once for each pass
                        let progressCount = checkedDelete.length + + checkedSchemaDelete.length;

                        // Add progress count for lists to create
                        // TODO: Refactor to MAP => REDUCE
                        checkedCreate.forEach(item => {
                            const { fields } = item;

                            // List + 1 for install
                            progressCount = progressCount + 1;

                            fields.forEach(field => {
                                // Field +2 (add column to list and view)
                                progressCount = progressCount + 2;
                            });
                        });

                        // TODO: Refactor to MAP => REDUCE
                        checkedSchemaAdd.forEach(item => {
                            // +2 Create/Add to view
                            progressCount = progressCount + 2;
                        });

                        const progressBar = ProgressBar({
                            parent: modalBody,
                            totalCount: progressCount
                        });

                        Store.add({
                            name: 'install-progress-bar',
                            component: progressBar
                        });

                        progressBar.add();

                        const deleteContainer = Container({
                            padding: '10px',
                            parent: modalBody,
                            overflow: 'hidden',
                            width: '100%',
                            height: '100%',
                            radius: '10px',
                            background: '#1E1E1E'
                        });

                        deleteContainer.add();

                        const reinstallConsole = InstallConsole({
                            type: 'secondary',
                            text: '',
                            margin: '0px',
                            parent: deleteContainer
                        });

                        Store.add({
                            name: 'install-console',
                            component: reinstallConsole
                        });

                        reinstallConsole.add();
                        reinstallConsole.get().classList.add('console');

                        // CREATE LISTS ---------------------------------------------------------------------------------

                        if (checkedCreate.length) {
                            // 1. CORE: Add core lists to install-console
                            reinstallConsole.append(/*html*/ `
                                    <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>Create lists:</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            checkedCreate.forEach(item => {
                                const { list } = item;

                                reinstallConsole.append(/*html*/ `
                                    <div class='console-line'>
                                        <!-- <code class='line-number'>0</code> -->
                                        <code>- ${list}</code>
                                    </div>
                                `);

                                // Scroll console to bottom
                                reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                            });

                            // Add spacer to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            // Add default lists first
                            for (let list in checkedCreate) {
                                // Create lists
                                await CreateList(checkedCreate[list]);

                                // Add spacer to console
                                reinstallConsole.append(/*html*/ `
                                    <div class='console-line'>
                                        <!-- <code class='line-number'>0</code> -->
                                        <code style='opacity: 0;'>Spacer</code>
                                    </div>
                                `);

                                // Scroll console to bottom
                                reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                            }

                            // Add Release Notes
                            await CreateItem({
                                list: 'ReleaseNotes',
                                data: {
                                    Summary: `New app lists created`,
                                    Description: checkedCreate.map(item => item.list).join(', ') + '.',
                                    Status: 'Published',
                                    MajorVersion: '0',
                                    MinorVersion: '1',
                                    PatchVersion: '0',
                                    ReleaseType: 'Current'
                                }
                            });

                            console.log(`Added Release Note: ${App.get('name')} lists created - ${checkedCreate.map(item => item.list).join(', ')}.`);

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'New ${App.get('name')} lists created - ${checkedCreate.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            // Add spacer to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            let spacers = '===================';
                            
                            // 3. Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>${spacers}</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>| Lists installed |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>${spacers}</code>
                                </div>
                                ${
                                    checkedSchemaAdd.length || checkedDelete || checkedSchemaDelete.length ?
                                    /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''
                                }
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END CREATE -----------------------------------------------------------------------------------

                        // ADD COLUMNS ----------------------------------------------------------------------------------

                        if (checkedSchemaAdd.length) {
                            for (let item in checkedSchemaAdd) {
                                const { list, field } = checkedSchemaAdd[item];

                                await CreateColumn({
                                    list,
                                    field
                                });
                            }

                            let spacers = '===================';
                            
                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>${spacers}</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>| Columns created |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: mediumseagreen !important;'>${spacers}</code>
                                </div>
                                ${
                                    checkedDelete.length || checkedSchemaDelete.length ?
                                    /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''
                                }
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END ADD COLUMNS ------------------------------------------------------------------------------

                        // DELETE LISTS ---------------------------------------------------------------------------------

                        if (checkedDelete.length) {
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>Delete lists:</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            checkedDelete.forEach(item => {
                                const { Title} = item;

                                reinstallConsole.append(/*html*/ `
                                    <div class='console-line'>
                                        <!-- <code class='line-number'>0</code> -->
                                        <code>- ${Title}</code>
                                    </div>
                                `);

                                // Scroll console to bottom
                                reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                            });

                            // Add spacer to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            // Add default lists first
                            for (let list in checkedDelete) {
                                // Create lists
                                await DeleteList({
                                    list: checkedDelete[list].Title
                                });
                            }

                            // Add spacer to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;

                            // Add Release Notes
                            await CreateItem({
                                list: 'ReleaseNotes',
                                data: {
                                    Summary: `App Lists deleted`,
                                    Description: checkedDelete.map(item => item.Title).join(', ') + '.',
                                    Status: 'Published',
                                    MajorVersion: '0',
                                    MinorVersion: '1',
                                    PatchVersion: '0',
                                    ReleaseType: 'Current'
                                }
                            });

                            console.log(`Added Release Note: App lists deleted - ${checkedDelete.map(item => item.Title).join(', ')}.`);
                            
                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'${App.get('name')} lists deleted - ${checkedDelete.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                            
                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>=================</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>| Lists deleted |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>=================</code>
                                </div>
                                ${
                                    checkedSchemaDelete.length ?
                                    /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''
                                }
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END DELETE -----------------------------------------------------------------------------------

                        // DELETE COLUMNS -------------------------------------------------------------------------------

                        if (checkedSchemaDelete.length) {
                            for (let item in checkedSchemaDelete) {
                                const { list, name } = checkedSchemaDelete[item];

                                await DeleteColumn({
                                    list,
                                    name
                                });
                            }

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='opacity: 0;'>Spacer</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>===================</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>| Columns deleted |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: crimson !important;'>===================</code>
                                </div>
                            `);

                            // Scroll console to bottom
                            reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                        }

                        // END DELETE COLUMNS ---------------------------------------------------------------------------

                        modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                            <div class='mt-4 mb-4'><strong>${App.get('name')}</strong> updated.</div>
                        `);

                        // Close modal button
                        const returnBtn = BootstrapButton({
                            type: 'primary',
                            value: 'Close',
                            classes: ['w-100'],
                            action(event) {
                                // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                                $(modal.get()).on('hidden.bs.modal', event => {
                                    console.log('Modal close animiation end');
                                    console.log('Reload');

                                    Route(location.href.split('#')[1] || '');
                                });

                                modal.close();
                            },
                            parent: modalBody
                        });

                        returnBtn.add();

                        // Scroll console to bottom (after launch button pushes it up);
                        reinstallConsole.get().scrollTop = reinstallConsole.get().scrollHeight;
                    },
                    classes: ['w-100', 'mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: 'primary',
                    value: `Update ${App.get('name')}`
                });

                installBtn.add();
            }

            if (!toCreate.length && !toDelete.length && !schemaAdd.length && !schemaDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-success'><strong>${App.get('name')}</strong> is up-to-date</div>
                `);
            }

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel install');

                    modal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: 'light',
                value: 'Cancel'
            });

            cancelBtn.add();
        },
        centered: true,
        showFooter: false,
    });

    modal.add();
}

/**
 * Update SharePoint list field.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
export async function UpdateColumn(param) {
    const {
        list,
        field
    } = param;

    const {
        name,
        description,
        type,
        choices,
        fillIn,
        title,
        required,
        lookupList,
        lookupField,
        value
    } = field;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // TODO: Check if field exists first
    const getField = await fetch(`${App.get('site')}/_api/web/lists/getByTitle('${list}')/fields/getbytitle('${name}')`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json;odata=verbose;charset=utf-8',
            'X-RequestDigest': requestDigest
        }
    });
    const response = await getField.json();

    if (!response?.d) {
        // FIXME: update progress bar or error out?
        console.log(`Field ${name} not found in list ${list}.`);
        return;
    }

    let data = { 
        "__metadata": { 
            "type": response.d.__metadata.type
        }
    };

    // if (choices !== undefined) {
    //     // data. = '';
    // }

    // if (fillIn !== undefined) {
    //     // data. = '';
    // }

    // if (title !== undefined) {
    //     // data. = '';
    // }


    // if (lookupList !== undefined) {
    //     // data. = '';
    // }

    // if (lookupField !== undefined) {
    //     // data. = '';
    // }

    if (required !== undefined) {
        data.Required = required;
    }

    if (description !== undefined) {
        data.Description = description;
    }

    if (value !== undefined) {
        data.DefaultValue = value;
    }

    const postOptions = {
        url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields/GetByTitle('${name}')`,
        data,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "IF-MATCH":  "*",
            "X-HTTP-Method": "MERGE",
            "X-RequestDigest": requestDigest,
        }
    }

    await Post(postOptions);

    try {
        // Console success
        console.log(`Updated column '${name}'`);

        // Append to install-console
        const installConsole = Store.get('install-console');

        if (installConsole) {
            installConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Updated column '${name}'</code>
                </div>
            `);

            installConsole.get().scrollTop = installConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            progressBar.update();
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Update SharePoint list item.
 * @param {Object}  param          - Interface to UpdateItem() module.
 * @param {string}  param.list     - SharePoint List Name.
 * @param {number}  param.itemId   - Item Id of item in param.list.
 * @param {boolean} [param.notify] - If false, don't display notification.
 */
export async function UpdateItem(param) {
    const {
        list,
        itemId,
        select,
        expand,
        data
    } = param;

    // Exit if no data passed in
    if (Object.getOwnPropertyNames(data).length === 0) {
        return;
    }

    if (App.get('mode') === 'prod') {
        // Get item by id
        const getItem = await Get({
            list,
            filter: `Id eq ${itemId}`
        });

        const item = getItem[0];

        // Get new request digest
        const requestDigest = await GetRequestDigest();

        // Add SharePoint List Item Type metadata property to passed in data object
        data.__metadata = {
            'type': item.__metadata.type
        }

        // Define Post interface
        const postOptions = {
            url: item.__metadata.uri,
            data: data,
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-HTTP-Method": "MERGE",
                "X-RequestDigest": requestDigest,
                "If-Match": item.__metadata.etag
            }
        }

        // Post update
        await Post(postOptions);

        // Get updated item
        const getUpdatedItem = await Get({
            list,
            select,
            expand,
            filter: `Id eq ${itemId}`
        });

        const updatedItem = getUpdatedItem[0];

        return updatedItem;
    } else {
        const body = data;

        body.Editor = {
            Title: App.get('dev').user.Title
        };

        const date = new Date().toUTCString();
        body.Modified = date;

        const options = {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        const response = await fetch(`http://localhost:3000/${list}/${itemId}`, options);
        
        if (response) {
            // Get updated item
            const getUpdatedItem = await Get({
                list,
                select,
                expand,
                filter: `Id eq ${itemId}`
            });

            const updatedItem = getUpdatedItem[0];

            return updatedItem;
        }
    }
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function UploadFile(param) {
    const {
        file,
        data,
        library
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    console.log(file);

    const [first, ...rest]  = file.name.split('.');
    const ext = rest.pop();

    let fileName = ext === 'pptx' || ext === 'txt' || ext === 'exe' ? [first].concat(rest).join('_dot_') : `${[first].concat(rest).join('_dot_')}.${ext}`;

    const fileBuffer = await getFileBuffer(file);
    const upload = await fetch(`${App.get('site')}/_api/web/folders/GetByUrl('${library}')/Files/add(overwrite=true,url='${fileName}')`, {
        method: 'POST',
        headers: {
            "Accept": "application/json;odata=verbose",
            'content-type': 'application/json; odata=verbose',
            "X-RequestDigest": requestDigest,
            "content-length": fileBuffer.byteLength
        },
        body: fileBuffer
    });

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            
            fileReader.onload = event => resolve(event.target.result);
            fileReader.readAsArrayBuffer(file);
        });
    }

    const response = await upload.json();

    let item = await GetByUri({
        uri: response.d.ListItemAllFields.__deferred.uri
    });

    let itemToReturn;

    if (data) {
        const updateItemParam = {
            list: library,
            itemId: item.Id,
            data
        }
      
        itemToReturn = await UpdateItem(updateItemParam); 
    } else {
        itemToReturn = item;
    }

    return itemToReturn;
}

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function UploadFiles(param) {
    const {
        files,
        path
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // Upload responses
    const uploads = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = file.name;
        const fileBuffer = await getFileBuffer(file);

        // const upload = await fetch(`${App.get('site')}/_api/web/folders/GetByUrl('/${site}/${list}')/Files/add(url='${name}',overwrite=true)`, {
        // const upload = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/add(url='${name}',overwrite=true)`, {
        // const upload = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/add`, {
        const upload = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/add(url='${name}')`, {
            method: 'POST',
            headers: {
                "Accept": "application/json;odata=verbose",
                'content-type': 'application/json; odata=verbose',
                "X-RequestDigest": requestDigest,
            },
            body: fileBuffer
        });

        uploads.push(upload);
    }

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            fileReader.onload = event => resolve(event.target.result);
            fileReader.readAsArrayBuffer(file);
        });
    }

    const responses = await Promise.all(uploads);
    const updatedItems = await Promise.all(responses.map(async response => {
        const data = await response.json();

        return GetByUri({
            uri: data.d.ListItemAllFields.__deferred.uri
        });
    }));

    return updatedItems;
}

export function Wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}