// Copyright 2022 Stephen Matheis

// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
// SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER
// RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
// CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
// CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

import {
    Alert,
    AppContainer,
    BootstrapButton,
    BootstrapTextarea,
    ChoiceField,
    Container,
    DateField,
    EditForm,
    FixedToast,
    FormTools,
    IconField,
    InstallConsole,
    LoadingBar,
    LoadingSpinner,
    MainContainer,
    Missing,
    Modal,
    MultiChoiceField,
    MultiLineTextField,
    NewForm,
    NumberField,
    ProgressBar,
    QuestionAndReplies,
    QuestionBoard,
    QuestionTypes,
    ReleaseNotesContainer,
    Row,
    Settings,
    Sidebar,
    SingleLineTextField,
    SvgDefs,
    ThemeField,
    Title,
    Toast,
    Unauthorized,
    ViewContainer,
    ViewTools
} from './RobiUI.js'

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
// Hello world!
export async function AddColumnToView(param) {
    const {
        list,
        view,
        name,
        updateProgressCount
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    const postOptions = {
        url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Views/GetByTitle('${view || 'All Items'}')/ViewFields/addViewField('${name}')`,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest
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

    if (progressBar && updateProgressCount !== false) {
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

        const relativePath = App.isProd() ? `${App.get('site')}/${App.get('library')}/src` : `/src/`;

        // TODO: default relative path might not be right, test locally and on SP
        linkElement.setAttribute('href', `${path || relativePath}${href}`);

        return linkElement;
    }
}

/**
 *
 * @param {*} param
 */
export async function AddRoute(event) {
    // Show modal
    console.log('add route');

    const addRouteModal = Modal({
        title: false,
        scrollable: true,
        close: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            addRouteModal.find('.modal-dialog').style.maxWidth = 'fit-content';
            addRouteModal.find('.modal-dialog').style.minWidth = '800px';

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-3'>Add route</h3>
            `);

            const paths = Store.routes().filter(route => route.type !== 'system').map(route => route.path.toLowerCase());
            let pathExists;

            // Route title
            const routeTitle = SingleLineTextField({
                label: 'Title',
                parent: modalBody,
                onKeyup(event) {
                    canEnable();
                    // FIXME: Handle spaces (e.g. Test vs Test 2)
                    // TODO: Can't start with a number
                },
                onFocusout(event) {
                    const path = routeTitle.value().toTitleCase().split(' ').join('');
                    routePath.value(path);

                    showMessage(path);

                    canEnable();
                }
            });

            routeTitle.add();

            // Route path
            // TODO: Prevent creating paths that already exist
            const routePath = SingleLineTextField({
                label: 'Path',
                addon: App.get('site') + '/App/src/pages/app.aspx#',
                parent: modalBody,
                onKeydown(event) {
                    if (event.code === 'Space' || event.code === 'Tab') {
                        return false;
                    }
                },
                onKeyup(event) {
                    canEnable();

                    showMessage(routePath.value());
                }
            });

            routePath.add();

            // Route icon
            const routeIcon = IconField({
                parent: modalBody,
                icons: Store.get('svgdefs').getIcons()
            });

            routeIcon.add();

            const addRouteBtn = BootstrapButton({
                async action() {
                    // TODO: Generalize show save modal and blur background
                    // Update app.js first or live-server will reload when
                    // Route/Path/Path.js is created
                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        scrollable: true,
                        shadow: true,
                        async addContent(modalBody) {
                            modal.find('.modal-content').style.width = 'unset';

                            const loading = LoadingSpinner({
                                message: `<span style='color: var(--primary);'>Adding Route<span>`,
                                type: 'robi',
                                classes: ['p-4'],
                                parent: modalBody
                            });
                
                            loading.add();
                        },
                        centered: true,
                        showFooter: false,
                        position: 'afterend'
                    });

                    modal.add();

                    // Blur entire app
                    document.querySelector('#app').style.transition = 'filter 150ms';
                    document.querySelector('#app').style.filter = 'blur(5px)';

                    await updateApp();
                    await createRoute();

                    if (App.isProd()) {
                        await Wait(5000);
                        location.reload();
                    }

                    modal.close();

                    async function updateApp() {
                        // Update app.js
                        let digest;
                        let request;

                        if (App.isProd()) {
                            digest = await GetRequestDigest();
                            request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('app.js')/$value`, {
                                method: 'GET',
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            request = await fetch(`http://127.0.0.1:8080/src/app.js`);
                            await Wait(1000);
                        }

                        let content = await request.text();
                        let updatedContent;

                        // Set import
                        const imports = content.match(/\/\/ @START-Imports:Routes([\s\S]*?)\/\/ @END-Imports:Routes/);
                        const newImports = imports[1] + `import Route_${routePath.value()} from './Routes/${routePath.value()}/${routePath.value()}.js'\n`
                        updatedContent = content.replace(/\/\/ @START-Imports:Routes([\s\S]*?)\/\/ @END-Imports:Routes/, `// @START-Imports:Routes${newImports}// @END-Imports:Routes`);

                        // Set routes
                        const routes = content.match(/\/\/ @START-Routes([\s\S]*?)\/\/ @END-Routes/);
                        const ordered = routes[1].split(', // @Route');
                        // FIXME: replace hard coded spaces (4 === 1 tab) with variable that includes 4 space characters
                        // TODO: Extract to template
                        const newRoute = [
                            ``,
                            `        // @START-${routePath.value()}`,
                            `        {`,
                            `            path: '${routePath.value()}',`,
                            `            title: '${routeTitle.value()}',`,
                            `            icon: '${routeIcon.value()}',`,
                            `            go: Route_${routePath.value()}`,
                            `        }`,
                            `        // @END-${routePath.value()}`,
                            ``
                        ].join('\n');

                        ordered.push(newRoute);

                        console.log('New:', ordered);

                        const newRoutes = ordered.join(', // @Route');

                        console.log(newRoutes);

                        // TODO: Will you always need to add 8 spaces before // @END-ROUTES?
                        updatedContent = updatedContent.replace(/\/\/ @START-Routes([\s\S]*?)\/\/ @END-Routes/, `// @START-Routes${newRoutes}        // @END-Routes`);

                        console.log('OLD\n----------------------------------------\n', content);
                        console.log('\n****************************************');
                        console.log('NEW\n----------------------------------------\n', updatedContent);
                        console.log('\n****************************************');

                        let setFile;

                        if (App.isProd()) {
                            // TODO: Make a copy of app.js first
                            // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                            setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='app.js',overwrite=true)`, {
                                method: 'POST',
                                body: updatedContent, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
                                method: 'POST',
                                body: updatedContent
                            });
                            await Wait(1000);
                        }

                        console.log('Saved:', setFile);
                    }

                    async function createRoute() {
                        const contents = RouteTemplate({
                            name: routePath.value()
                        });
                    
                        let newFile;

                        if (App.isProd()) {
                            // Create Route dir
                            await CreateFolder({
                                path: `App/src/Routes/${routePath.value()}`
                            });

                            // Create Route file
                            // TODO: Create Route dir and file
                            const path = `${App.get('library')}/src/Routes/${routePath.value()}`
                            const targetSiteUrl = App.get('site') + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files/Add(url='" + `${routePath.value()}.js` + "',overwrite=true)";
                            const srcRequestDigest = await GetRequestDigest();
                            
                            // TODO: Add check for App/src path so other paths that you might want to copy from aren't affected
                            newFile = await fetch(targetSiteUrl, {
                                method: 'POST',
                                body: contents, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': srcRequestDigest
                                }
                            });
                        } else {
                            console.log('create route dir and file');
                            // Create file (missing dirs will be created recursively)
                            newFile = await fetch(`http://127.0.0.1:2035/?path=src/Routes/${routePath.value()}&file=${routePath.value()}.js`, {
                                method: 'POST',
                                body: contents
                            });
                            await Wait(1000);
                        }
                    }
                },
                disabled: true,
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Add route'
            });

            addRouteBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel add route');

                    addRouteModal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
                value: 'Cancel'
            });

            cancelBtn.add();

            // Show message if path already exists
            function showMessage(value) {
                if (paths.includes(value.toLowerCase())) {
                    // Show message
                    if (!pathExists) {
                        pathExists = Alert({
                            type: 'danger',
                            text: `A route with path <strong>${value}</strong> already exists`,
                            classes: ['alert-in', 'w-100'],
                            top: routePath.get().offsetHeight + 5,
                            parent: routePath
                        });

                        pathExists.add();
                    }
                } else {
                    // Remove message
                    if (pathExists) {
                        pathExists.remove();
                        pathExists = null;
                    }
                }
            }

            // Check if all fields are filled out and path doesn't already exist
            function canEnable() {
                if (routeTitle.value() && routePath.value() && !paths.includes(routePath.value().toLowerCase())) {
                    addRouteBtn.enable();
                } else {
                    addRouteBtn.disable();
                }
            }

            // FIXME: Experimental. Not sure if this will work everytime.
            setTimeout(() => {
                routeTitle.focus();
            }, 500);
        },
        centered: true,
        showFooter: false,
    });

    addRouteModal.add();
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
        // if (roles.includes(role)) {
        // TODO: Use .Roles.results instead
        // https://stackoverflow.com/a/39893636
        if (roles.some(r => Store.user().Roles.results.includes(r))) {
            /** Authorized if role is included in roles array */
            console.log(`${Store.user().Title} authorized to access '${view}' as a '${role}'`)
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
 * @param {*} param0 
 */
export function BlurOnSave({ message }) {
    // Update app.js first or live-server will reload when
    // Route/Path/Path.js is created
    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        shadow: true,
        async addContent(modalBody) {
            modal.find('.modal-content').style.width = 'unset';

            const loading = LoadingSpinner({
                message: `<span style='color: var(--primary);'>${message}<span>`,
                type: 'robi',
                classes: ['p-4'],
                parent: modalBody
            });

            loading.add();
        },
        centered: true,
        showFooter: false,
        position: 'afterend'
    });

    modal.add();

    // Blur entire app
    document.querySelector('#app').style.transition = 'filter 150ms';
    document.querySelector('#app').style.filter = 'blur(5px)';

    return {
        async off(onClose) {
            await Wait(1500);

            document.querySelector('#app').style.transition = 'unset';
            document.querySelector('#app').style.filter = 'unset';

            modal.close(onClose);
        }
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function CheckLists() {
    const listsToIgnore = ['App', 'Composed Looks', 'Documents', 'Master Page Gallery', 'MicroFeed', 'Site Assets', 'Site Pages'];
    const coreLists = Lists();
    const appLists = App.lists();
    const allLists = coreLists.concat(appLists);
    const filesLists = allLists.filter(item => item.options?.files).map(item => { return { list: `${item.list}Files` } }); // Don't include ListNameFiles if options.files is true
    const webLists = await GetWebLists();
    const installedLists = webLists.map(item => item.Title).filter(x => allLists.map(item => item.list).includes(x));
    const diffToCreate = allLists.map(item => item.list).filter(x => !webLists.map(item => item.Title).includes(x));
    const diffToDelete = webLists.map(item => item.Title).filter(x => !allLists.concat(filesLists).map(item => item.list).includes(x) && !listsToIgnore.includes(x));
    console.log('All Lists:', allLists);
    console.log('Files Lists:', filesLists);
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
    const libraryFieldsToIgnore = [
        'Modified_x0020_By',
        'Created_x0020_By',
        '_SourceUrl',
        '_SharedFileIndex',
        'TemplateUrl',
        'xd_ProgID',
        'xd_Signature',
        'i3e7b0477ad24f0693a0b6cb17b27bf1',
        'TaxCatchAll',
        'TaxCatchAllLabel',
        'Document_x0020_Type',
        '_dlc_DocId',
        '_dlc_DocIdUrl',
        '_dlc_DocIdPersistId',
        'mb7b7c6cb3b94febb95b36ae1f78ffc5',
        'Organization',
        'ba60022a341749df97d7a0ab674012b7',
        'Document_x0020_Status',
        'File_x0020_Size',
        'CheckedOutUserId',
        'IsCheckedoutToLocal',
        'CheckoutUser',
        'VirusStatus',
        'CheckedOutTitle',
        '_CheckinComment',
        'LinkCheckedOutTitle',
        'FileSizeDisplay',
        'SelectFilename',
        'ParentVersionString',
        'ParentLeafName',
        'DocConcurrencyNumber',
        'Combine',
        'RepairDocument'
    ];
    const schemaAdd = [];
    const schemaDelete = [];

    installedLists
        .map(listName => {
            const { list, fields, template } = allLists.find(item => item.list === listName);

            return { list, fields, template, web: webLists.find(item => item.Title === listName) };
        })
        .forEach(item => {
            const { list, fields, template, web } = item;

            const webFields = web.Fields.results.map(webField => {
                const { StaticName, TypeDisplayName } = webField;

                return { name: StaticName, type: TypeDisplayName };
            });

            console.log(list, template);

            const fieldsToCreate = fields.map(item => item.name).filter(x => !webFields.map(item => item.name).includes(x));
            const fieldsToDelete = webFields.map(item => item.name).filter(x => !fields.map(item => item.name).includes(x) && !fieldsToIgnore.includes(x) && (template === 101 ? !libraryFieldsToIgnore.includes(x) : true));

            console.log();

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

    return { 
        coreLists,
        appLists,
        allLists,
        filesLists,
        webLists,
        installedLists,
        diffToCreate,
        diffToDelete,
        toCreate,
        toDelete,
        schemaAdd,
        schemaDelete
    };
}

/** {@link https://css-tricks.com/converting-color-spaces-in-javascript/} */
const Colors = {
    "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
    "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
    "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
    "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
    "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
    "honeydew": "#f0fff0", "hotpink": "#ff69b4",
    "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
    "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
    "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
    "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead", "navy": "#000080",
    "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
    "rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
    "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
    "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00", "yellowgreen": "#9acd32"
};

export { Colors }

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Component(param) {
    const {
        name,
        locked,
        html,
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
            <style type='text/css' data-name='${name || id}' data-type='component' data-locked='${name || locked ? 'yes' : 'no'}' >
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
            const { selector, event, listener } = item;
            const eventTypes = event.split(' ');

            eventTypes.forEach(event => {
                if (typeof selector === 'string') {
                    const replaceIdPlaceholder = selector.replace(/#id/g, `#${id}`);

                    document.querySelectorAll(replaceIdPlaceholder).forEach((node) => {
                        node.addEventListener(event, listener);
                    });
                } else {
                    selector.addEventListener(event, listener);
                }
            });
        });
    }

    return {
        addClass(name) {
            this.get().classList.add(name);
        },
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
            const node = this.get()?.querySelector(selector);
            
            if (node) {
                node.on = (event, listener) => {
                    node.addEventListener(event, listener);
                }

                return node;
            }
        },
        findAll(selector) {
            return this.get()?.querySelectorAll(selector);
        },
        closest(selector) {
            return this.get()?.closest(selector);
        },
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
                setTimeout(removeStyleAndNode, delay);
            } else {
                removeStyleAndNode();
            }

            function removeStyleAndNode() {
                const styleNode = document.querySelector(`style[data-name='${id}']`);

                if (styleNode) {
                    styleNode.remove();
                }

                if (node) {
                    node.remove();
                }
            }
        },
        removeClass(name) {
            this.get().classList.remove(name);
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

            return this;
        },
        prepend(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('afterbegin', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('afterbegin', param);
            }

            return this;
        },
        before(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('beforebegin', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('beforebegin', param);
            }

            return this;
        },
        after(param) {
            if (param instanceof Element) {
                this.get()?.insertAdjacentElement('afterend', param);
            } else if (typeof param === 'string') {
                this.get()?.insertAdjacentHTML('afterend', param);
            }

            return this;
        },
        on(event, listener) {
            this.get().addEventListener(event, listener);
        },
        off(event, listener) {
            this.get().removeEventListener(event, listener);
        },
        add(localParent) {
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
 * 
 * @param {*} param 
 * @returns 
 */
export async function CopyFile(param) {
    const {
        source,
        target,
        path,
        file,
        appName,
        appTitle,
        theme
    } = param;

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

    let contents = file === 'app.js' ? await getFileValue.text() : await getFileValue.arrayBuffer();

    // TODO: Add check for App/src path so other paths that you might want to copy an app.js file from aren't affected
    if (file === 'app.js') {
        console.log('CopyFile.js', {
            source,
            target,
            path,
            file,
            appName,
            appTitle,
            theme
        });

        // Name
        contents = contents.replace(/\/\* @START-name \*\/([\s\S]*?)\/\* @END-name \*\//, `/* @START-name */'${appName}'/* @END-name */`);

        // Title
        contents = contents.replace(/\/\* @START-title \*\/([\s\S]*?)\/\* @END-title \*\//, `/* @START-title */'${appTitle}'/* @END-title */`);

        // Theme
        contents = contents.replace(/\/\* @START-theme \*\/([\s\S]*?)\/\* @END-theme \*\//, `/* @START-theme */'${theme}'/* @END-theme */`);
    }

    console.log(contents);

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
 * 
 * @param {*} param 
 * @returns 
 */
export async function CopyRecurse(param) {
    const { 
        path,
        filter,
        targetWeb,
        appName,
        appTitle,
        theme,
    } = param;
    
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
                appTitle,
                theme
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
            appTitle,
            theme
        });
    }

    return true;
}

/**
 *
 * @param {*} param
 */
export async function CreateApp() {
    console.log('Creating app...');

    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-4'>Create app</h3>
            `);

            // Site title
            const siteTitle = SingleLineTextField({
                label: 'Site title',
                parent: modalBody,
                onFocusout(event) {
                    siteUrl.value(siteTitle.value().toLowerCase().split(' ').join('-'));
                    appName.value(siteTitle.value().toTitleCase().split(' ').join(''));
                }
            });

            siteTitle.add();

            const siteDesc = BootstrapTextarea({
                label: 'Site description',
                parent: modalBody
            });

            siteDesc.add();

            // Site Url
            const siteUrl = SingleLineTextField({
                label: 'Site url',
                addon: App.get('site') + '/',
                parent: modalBody
            });

            siteUrl.add();

            // App name
            const appName = SingleLineTextField({
                label: 'App name',
                parent: modalBody
            });

            appName.add();

            // Theme
            const themeField = ThemeField({
                parent: modalBody
            });

            themeField.add();

            // Install
            const installBtn = BootstrapButton({
                action: createNewSite,
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Create app'
            });

            installBtn.add();

            // Kick off new site creation
            async function createNewSite(event) {
                // Alert user if canceled
                addEventListener(
                    'beforeunload', 
                    (event) => {
                        console.log('confirm close');
                    }, 
                    {capture: true}
                );

                const title = siteTitle.value();
                const url = siteUrl.value();
                const name = appName.value();
                const description = siteDesc.value();
                const theme = themeField.value();

                console.log(title);
                console.log(url);
                console.log(name);
                console.log(description);
                console.log(theme);

                console.log('Create site');

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
                    <h3 class='console-title mb-0'>Creating <strong>${title}</strong></h3>
                `);

                // Get robi source code file count
                const fileCount = await GetItemCount({
                    list: 'App'
                });

                // const coreLists = Lists();

                // TODO: Start at 2
                // 1 - Create site
                // 2 - Create App doc lib
                let progressCount = 2 + parseInt(fileCount);

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
                    radius: '20px',
                    background: 'var(--background)'
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

                // 1. Create site
                await CreateSite({
                    title,
                    description,
                    url,
                    name
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

                // 2. Create App doc lib
                await CreateLibrary({
                    name: 'App',
                    web: url
                });

                // 3. Copy files
                await CopyRecurse({
                    path: 'App',
                    library: 'App',
                    targetWeb: url,
                    filter: `Name ne 'Forms'`,
                    appName: name,
                    appTitle: title,
                    theme
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

                // 4. Set home page to app.aspx
                await SetHomePage({
                    web: url
                });

                // TODO: move to SetHomePage()
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code>Home page set to 'App/src/pages/app.aspx'</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Add spacer to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='opacity: 0;'>Spacer</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                let spacers = '==============';

                for (let i = 0; i < title.length; i++) {
                    spacers = spacers + '=';
                }
                
                // 3. Add to console
                installConsole.append(/*html*/ `
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: var(--primary) !important;'>${spacers}</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: var(--primary) !important;'>| '${title}' created |</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: var(--primary) !important;'>${spacers}</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // 5. Init app
                // TODO: init app automatically
                // TODO: set home page after app copied
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='mt-4'>New app <strong>${title}</strong> created at <a href='${App.get('site')}/${url}' target='_blank'>${App.get('site')}/${url}</a></div>
                `);

                // Update title
                modal.find('.console-title').innerHTML = `${modal.find('.console-title').innerHTML.replace('Creating', 'Created')}`

                // Show launch button
                const installAppBtn = BootstrapButton({
                    type: 'robi',
                    value: 'Install app',
                    classes: ['mt-3', 'w-100'],
                    action(event) {
                        // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                        $(modal.get()).on('hidden.bs.modal', event => {
                            window.open(`${App.get('site')}/${url}`);
                        });

                        modal.close();
                    },
                    parent: modalBody
                });

                installAppBtn.add();

                const modifyBtn = BootstrapButton({
                    action(event) {
                        window.open(`${App.get('site')}/${url}/${App.get('library') || 'App'}/src`);
                    },
                    classes: ['w-100 mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: 'robi-light',
                    value: 'Modify source'
                });

                modifyBtn.add();

                const cancelBtn = BootstrapButton({
                    action(event) {
                        console.log('Cancel install');

                        $(modal.get()).on('hidden.bs.modal', event => {
                            console.log('modal close animiation end');
                        });

                        modal.close();
                    },
                    classes: ['w-100 mt-2'],
                    width: '100%',
                    parent: modalBody,
                    type: '',
                    value: 'Close'
                });

                cancelBtn.add();

                // Scroll console to bottom (after launch button pushes it up);
                installConsole.get().scrollTop = installConsole.get().scrollHeight;
            }

            // Close modal
            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel create site');

                    modal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
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
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
export async function CreateColumn(param) {
    const {
        list,
        field,
        view,
        updateProgressCount
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
    const robiFields = ['Files'];

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

        if (progressBar && updateProgressCount !== false) {
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

        if (progressBar && updateProgressCount !== false) {
            // +1 since not adding to column to view
            progressBar.update();
        }

        // TODO: Update progress bar or error out if update fails
        return;
    }

    let data = {};
    let url;

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
        const listGuid = await GetListGuid({
            listName: lookupList
        });

        url = `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields/addfield`;

        data = {
            parameters: {
                __metadata: { 
                    'type': 'SP.FieldCreationInformation' 
                },
                FieldTypeKind: 7,
                Title: name, 
                LookupListId: listGuid,
                LookupFieldName: lookupField
            }
        }
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
        url: url || `${App.get('site')}/_api/web/lists/GetByTitle('${list}')/Fields`,
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

    if (progressBar && updateProgressCount !== false) {
        progressBar.update();
    }

    /** Add column to All Items view */
    await AddColumnToView({
        list,
        name,
        view,
        updateProgressCount
    });

    return newField.d;
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
        url: `${site || App.get('site')}${web ? `/${web}` : ''}/_api/web/folders`,
        // url: `${web ? `${site}/${web}` : App.get('site')}/_api/web/folders`,
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
        message,
        wait
    } = param;

    if (App.isProd()) {
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
    } else if (App.isDev()) {
        const body = data;

        // DataTables and other components requied null fields.
        // SharePoint returns them by default, but lists created with json-server don't
        // have schemas.
        // Append fields from lists.js with value null.
        const lists = App.lists();
        const { fields } = Lists().concat(lists).find(item => item.list === list);

        for (let field in fields) {
            const { name } = fields[field];

            if (name in body === false) {
                body[name] = null;
            }
        }

        body.AuthorId = body.AuthorId || App.get('dev').user.SiteId;
        body.Author = body.Author || { Title: App.get('dev').user.Title, LoginName: App.get('dev').user.LoginName };
        body.EditorId = body.EditorId || App.get('dev').user.SiteId;
        body.Editor = body.Editor || { Title: App.get('dev').user.Title, LoginName: App.get('dev').user.LoginName };

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
            if (wait !== false) {
                await Wait(500);
            }
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
        template,
        items,
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
            if (fields?.length) {
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

            await CreateColumn({
                list: `${list}Files`,
                field: {
                    name: 'ParentId',
                    type: 'number'
                },
                view: 'All Documents',
                updateProgressCount: false
            });
            
            console.log(`${list}Files:`, filesLib);
        }

        // Create fields
        for (let field in fields) {
            await CreateColumn({
                list,
                field: fields[field],
                view: template === 101 ? 'All Documents' : 'All Items'
            });
        }

        // Create items
        if (items) {
            for (let item in items) {
                const newItem = await CreateItem({
                    list: list,
                    data: items[item]
                });
    
                if (installConsole) {
                    installConsole.append(/*html*/ `
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code>Created item in list '${list}' with Id ${newItem.Id}</code>
                        </div>
                    `);
        
                    installConsole.get().scrollTop = installConsole.get().scrollHeight;
                }
        
                if (progressBar) {
                    progressBar.update();
                }
            }
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
 * @param {*} param
 */
export async function CustomEditForm({ list, display, fields }) {
    const addRouteModal = Modal({
        title: false,
        scrollable: true,
        close: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            addRouteModal.find('.modal-dialog').style.maxWidth = 'fit-content';
            addRouteModal.find('.modal-dialog').style.minWidth = '800px';

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-4'>Custom edit form</h3>
                <div>
                    <strong>${display || list}</strong> doesn't have a custom edit form yet. Would you like to create one?
                </div>
            `);

            const addRouteBtn = BootstrapButton({
                async action() {
                    // TODO: Generalize show save modal and blur background
                    // Update app.js first or live-server will reload when
                    // Route/Path/Path.js is created
                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        scrollable: true,
                        shadow: true,
                        async addContent(modalBody) {
                            modal.find('.modal-content').style.width = 'unset';

                            const loading = LoadingSpinner({
                                message: `<span style='color: var(--primary);'>Creating custom Edit Form<span>`,
                                type: 'robi',
                                classes: ['p-4'],
                                parent: modalBody
                            });
                
                            loading.add();
                        },
                        centered: true,
                        showFooter: false,
                        position: 'afterend'
                    });

                    modal.add();

                    // Blur entire app
                    document.querySelector('#app').style.transition = 'filter 150ms';
                    document.querySelector('#app').style.filter = 'blur(5px)';

                    await updateSchema();
                    await createForm();

                    if (App.isProd()) {
                        await Wait(5000);
                    }

                    location.reload();

                    modal.close();

                    async function updateSchema() {
                        // Update app.js
                        let digest;
                        let request;

                        if (App.isProd()) {
                            // digest = await GetRequestDigest();
                            // request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('lists.js')/$value`, {
                            //     method: 'GET',
                            //     headers: {
                            //         'binaryStringRequestBody': 'true',
                            //         'Accept': 'application/json;odata=verbose;charset=utf-8',
                            //         'X-RequestDigest': digest
                            //     }
                            // });
                        } else {
                            request = await fetch(`http://127.0.0.1:8080/src/Lists/${list}/Schema.js`);
                            await Wait(1000);
                        }

                        let content = await request.text();
                        let updatedContent = content.trim().replace(/[\s]*?(export default {[\s\S]*?})$/, `\nimport EditForm from './EditForm.js'\n\n$1`).trim();
                        updatedContent = updatedContent.replace(/(\s\S*?})$/, `,\n    editForm: EditForm$1`);

                        console.log(updatedContent);

                        let setFile;

                        if (App.isProd()) {
                            setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='lists.js',overwrite=true)`, {
                                method: 'POST',
                                body: updatedContent, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            setFile = await fetch(`http://127.0.0.1:2035/?path=src/Lists/${list}&file=Schema.js`, {
                                method: 'POST',
                                body: updatedContent
                            });
                            await Wait(1000);
                        }

                        console.log('Saved:', setFile);
                    }

                    async function createForm() {
                        const contents = EditFormTemplate({
                            list,
                            display,
                            fields: fields
                        });

                        console.log(contents);
                    
                        let newFile;

                        // TODO: Create Forms sub directory if it doesn't exist
                        if (App.isProd()) {
                            // // Create Route dir
                            // await CreateFolder({
                            //     path: `App/src/Routes/${routePath.value()}`
                            // });

                            // // Create Route file
                            // // TODO: Create Route dir and file
                            // const path = `${App.get('library')}/src/Routes/${routePath.value()}`
                            // const targetSiteUrl = App.get('site') + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files/Add(url='" + `${routePath.value()}.js` + "',overwrite=true)";
                            // const srcRequestDigest = await GetRequestDigest();
                            
                            // // TODO: Add check for App/src path so other paths that you might want to copy from aren't affected
                            // newFile = await fetch(targetSiteUrl, {
                            //     method: 'POST',
                            //     body: contents, 
                            //     headers: {
                            //         'binaryStringRequestBody': 'true',
                            //         'Accept': 'application/json;odata=verbose;charset=utf-8',
                            //         'X-RequestDigest': srcRequestDigest
                            //     }
                            // });
                        } else {
                            console.log('create route dir and file');
                            // Create file (missing dirs will be created recursively)
                            newFile = await fetch(`http://127.0.0.1:2035/?path=editform&file=${list}`, {
                                method: 'POST',
                                body: contents
                            });
                            await Wait(1000);
                        }
                    }
                },
                classes: ['w-100 mt-4'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Create'
            });

            addRouteBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel add route');

                    addRouteModal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
                value: 'Cancel'
            });

            cancelBtn.add();
        },
        centered: true,
        showFooter: false,
    });

    addRouteModal.add();
}

/**
 *
 * @param {*} param
 */
export async function CustomNewForm({ list, display, fields }) {
    const addRouteModal = Modal({
        title: false,
        scrollable: true,
        close: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            addRouteModal.find('.modal-dialog').style.maxWidth = 'fit-content';
            addRouteModal.find('.modal-dialog').style.minWidth = '800px';

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-4'>Custom new form</h3>
                <div>
                    <strong>${display || list }</strong> doesn't have a custom new form yet. Would you like to create one?
                </div>
            `);

            const addRouteBtn = BootstrapButton({
                async action() {
                    // TODO: Generalize show save modal and blur background
                    // Update app.js first or live-server will reload when
                    // Route/Path/Path.js is created
                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        scrollable: true,
                        shadow: true,
                        async addContent(modalBody) {
                            modal.find('.modal-content').style.width = 'unset';

                            const loading = LoadingSpinner({
                                message: `<span style='color: var(--primary);'>Creating custom New Form<span>`,
                                type: 'robi',
                                classes: ['p-4'],
                                parent: modalBody
                            });
                
                            loading.add();
                        },
                        centered: true,
                        showFooter: false,
                        position: 'afterend'
                    });

                    modal.add();

                    // Blur entire app
                    document.querySelector('#app').style.transition = 'filter 150ms';
                    document.querySelector('#app').style.filter = 'blur(5px)';

                    await updateSchema();
                    await createForm();

                    if (App.isProd()) {
                        await Wait(5000);
                    }

                    location.reload();

                    modal.close();

                    async function updateSchema() {
                        let digest;
                        let request;

                        if (App.isProd()) {
                            // digest = await GetRequestDigest();
                            // request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('lists.js')/$value`, {
                            //     method: 'GET',
                            //     headers: {
                            //         'binaryStringRequestBody': 'true',
                            //         'Accept': 'application/json;odata=verbose;charset=utf-8',
                            //         'X-RequestDigest': digest
                            //     }
                            // });
                        } else {
                            request = await fetch(`http://127.0.0.1:8080/src/Lists/${list}/Schema.js`);
                            await Wait(1000);
                        }

                        let content = await request.text();
                        let updatedContent = content.trim().replace(/[\s]*?(export default {[\s\S]*?})$/, `\nimport NewForm from './NewForm.js'\n\n$1`).trim();
                        updatedContent = updatedContent.replace(/(\s\S*?})$/, `,\n    newForm: NewForm$1`);

                        console.log(updatedContent);

                        let setFile;

                        if (App.isProd()) {
                            setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='lists.js',overwrite=true)`, {
                                method: 'POST',
                                body: updatedContent, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            setFile = await fetch(`http://127.0.0.1:2035/?path=src/Lists/${list}&file=Schema.js`, {
                                method: 'POST',
                                body: updatedContent
                            });
                            await Wait(1000);
                        }

                        console.log('Saved:', setFile);
                    }

                    async function createForm() {
                        const contents = NewFormTemplate({
                            list,
                            display,
                            fields: fields
                        });

                        console.log(contents);

                        let newFile;

                        // TODO: Create Forms sub directory if it doesn't exist
                        if (App.isProd()) {
                            // // Create Route dir
                            // await CreateFolder({
                            //     path: `App/src/Routes/${routePath.value()}`
                            // });

                            // // Create Route file
                            // // TODO: Create Route dir and file
                            // const path = `${App.get('library')}/src/Routes/${routePath.value()}`
                            // const targetSiteUrl = App.get('site') + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files/Add(url='" + `${routePath.value()}.js` + "',overwrite=true)";
                            // const srcRequestDigest = await GetRequestDigest();
                            
                            // // TODO: Add check for App/src path so other paths that you might want to copy from aren't affected
                            // newFile = await fetch(targetSiteUrl, {
                            //     method: 'POST',
                            //     body: contents, 
                            //     headers: {
                            //         'binaryStringRequestBody': 'true',
                            //         'Accept': 'application/json;odata=verbose;charset=utf-8',
                            //         'X-RequestDigest': srcRequestDigest
                            //     }
                            // });
                        } else {
                            newFile = await fetch(`http://127.0.0.1:2035/?path=newform&file=${list}`, {
                                method: 'POST',
                                body: contents
                            });
                            await Wait(1000);
                        }
                    }
                },
                classes: ['w-100 mt-4'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Create'
            });

            addRouteBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel add route');

                    addRouteModal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
                value: 'Cancel'
            });

            cancelBtn.add();
        },
        centered: true,
        showFooter: false,
    });

    addRouteModal.add();
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
    if (App.isDev()) {
        const modal = Modal({
            title: false,
            centered: true,
            showFooter: false,
            close: true,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');
                
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h4 class='mb-3'>Dev mode instructions</h4>
                `);
        
                const info = Alert({
                    type: 'robi-secondary',
                    text: /*html*/`
                        <code>npm run reset</code>
                    `,
                    parent: modalBody
                });
        
                info.add();
            }
        });

        modal.add();

        return;
    }

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
            // const appLists = lists;
            const appLists = App.lists();
            console.log(coreLists);

            // All Lists
            const lists = App.lists();
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
                        background: 'var(--background)'
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
                            <code style='color: var(--primary) !important;'>${spacers}</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: var(--primary) !important;'>| '${App.get('name')}' deleted |</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: var(--primary) !important;'>${spacers}</code>
                        </div>
                    `);

                    // Scroll console to bottom
                    deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;

                    // TODO: Convert path below to Install button with href to ${App.get('library)}/src/pages/app.aspx
                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div class='mt-4 mb-2'>All lists and data for <strong>${App.get('name')}</strong> were successfully deleted.</div>
                        <div class='mb-4'>Go to <a href='${App.get('site')}/${App.get('library')}/src/pages/app.aspx'>Site Contents > App > src > pages > app.aspx</a> to reinstall.</div>
                    `);

                    // Show return button
                    const returnBtn = BootstrapButton({
                        type: 'robi',
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
                type: 'robi-reverse',
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
                type: '',
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

    if (App.isProd()) {
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
    } else if (App.isDev()) {
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
        options,
        updateProgressCount
    } = param;

    if (App.isProd()) {
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

        if (progressBar && updateProgressCount !== false) {
            progressBar.update();
        }

        // Delete files
        if (options?.files) {
            await DeleteList({
                list: `${list}Files`,
                updateProgressCount: false
            });
        }
    } else if (App.isDev()) {
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
export async function DeleteRoutes({ routes }) {
    console.log(routes);

    let digest;
    let request;

    if (App.isProd()) {
        digest = await GetRequestDigest();
        request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files('app.js')/$value`, {
            method: 'GET',
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });
    } else {
        request = await fetch(`http://127.0.0.1:8080/src/app.js`);
        await Wait(1000);
    }
    let content = await request.text();
    let updated = '';

    // Remove Imports
    const imports = content.match(/\/\/ @START-IMPORTS([\s\S]*?)\/\/ @END-IMPORTS/);
    const importObjects = imports[1].split('\n');
    const remainingImports= importObjects.filter(route => {
        const name = route.split(' ')[1];

        if (!routes.includes(name)) {
            return route;
        }

    }).join('\n');

    updated = content.replace(/\/\/ @START-IMPORTS([\s\S]*?)\/\/ @END-IMPORTS/, `// @START-IMPORTS\n${remainingImports || '\n'}\n// @END-IMPORTS`);

    const allRoutes = content.match(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/);
    const routeObjects = allRoutes[1].split(', // @ROUTE');

    // Remove routes
    const remainingRoutes = routeObjects.filter(route => {
        const [ query, path ] = route.match(/path: '([\s\S]*?)',/);

        console.log(routes, path);

        if (!routes.includes(path)) {
            return route;
        }

    }).join(', // @ROUTE');

    updated = updated.replace(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/, `// @START-ROUTES${remainingRoutes || '\n        '}// @END-ROUTES`);

    console.log('OLD\n----------------------------------------\n', content);
    console.log('\n****************************************');
    console.log('NEW\n----------------------------------------\n', updated);
    console.log('\n****************************************');

    let setFile;

    if (App.isProd()) {
        // TODO: Make a copy of app.js first
        // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
        setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files/Add(url='app.js',overwrite=true)`, {
            method: 'POST',
            body: updated, 
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });

        // TODO: Add _ARCHIVED to Route dir name in App/src/Routes
    } else {
        try {
            setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
                method: 'POST',
                body: updated
            });
    
            console.log('Archive route');
            
            for (let route of routes) {
                await fetch(`http://127.0.0.1:2035/?path=src/Routes/${route}`, {
                    method: 'DELETE'
                });
            }
    
            await Wait(1000);
        } catch(err) {
            LogError({
                Message: 'Problem archiving route',
                Source: import.meta.url,
                Error: err
            });
            
            console.log(err);
        }
    }

    console.log('Saved:', setFile);
}

/**
 *
 * @param {*} param
 */
export async function EditLayout({ order, path, file }) {
    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        shadow: true,
        async addContent(modalBody) {
            modal.find('.modal-content').style.width = 'unset';

            const loading = LoadingSpinner({
                message: `<span style='color: var(--primary);'>Saving layout<span>`,
                type: 'robi',
                classes: ['p-4'],
                parent: modalBody
            });

            loading.add();
        },
        centered: true,
        showFooter: false,
        position: 'afterend'
    });

    modal.add();

    // Blur entire app
    document.querySelector('#app').style.transition = 'filter 150ms';
    document.querySelector('#app').style.filter = 'blur(5px)';

    await updateApp();

    async function updateApp() {
        let fileValueRequest;
        let digest;

        if (App.isProd()) {
            const sourceSiteUrl = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files('${file}')/$value`;

            digest = await GetRequestDigest();

            fileValueRequest = await fetch(sourceSiteUrl, {
                method: 'GET',
                headers: {
                    'binaryStringRequestBody': 'true',
                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                    'X-RequestDigest': digest
                }
            });

        } else {
            const devPath = path.replace('App/', '');
            fileValueRequest = await fetch(`http://127.0.0.1:8080/${devPath}/${file}`);
            await Wait(1000);
        }

        let content = await fileValueRequest.text();
        let updatedContent = content;

        const sourceRows = content.match(/\/\/ @START-Rows([\s\S]*?)\/\/ @END-Rows/);
        const currentOrder = sourceRows[1].split('// @Row');
        const newOrder = order.map(index => currentOrder[index]).join('// @Row');

        console.log(sourceRows[1]);
        console.log(order);
        console.log(newOrder);

        updatedContent = updatedContent.replace(/\/\/ @START-Rows([\s\S]*?)\/\/ @END-Rows/, `// @START-Rows${newOrder}// @END-Rows`);

        console.log('OLD\n----------------------------------------\n', content);
        console.log('\n****************************************');
        console.log('NEW\n----------------------------------------\n', updatedContent);
        console.log('\n****************************************');

        let setFile;

        if (App.isProd()) {
            // TODO: Toby's version control idea
            // TODO: Make a copy of app.js first
            // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
            setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/Add(url='${file}',overwrite=true)`, {
                method: 'POST',
                body: updatedContent, 
                headers: {
                    'binaryStringRequestBody': 'true',
                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                    'X-RequestDigest': digest
                }
            });
        } else {
            const devPath = path.replace('App/', '');
            setFile = await fetch(`http://127.0.0.1:2035/?path=${devPath}&file=${file}`, {
                method: 'POST',
                body: updatedContent
            });
            await Wait(1000);
        }
    }

    if (App.isProd()) {
        await Wait(5000);
    }

    location.reload();

    modal.close();
}

/**
 *
 * @param {*} param
 */
export async function Editor({ path, file, parent }) {
    parent.append(/*html*/ `
        <div class='rs-box code-box alert w-100 mb-0 p-0' style='background: #1e1e1e; color: #d4d4d4;'>
            <!-- CodeMirror injected here -->
        </div>
    `);

    const loading = LoadingSpinner({
        message: `Loading <span style='font-weight: 300;'>${path}/${file}</span>`,
        type: 'white',
        classes: ['h-100', 'loading-file'],
        parent:  parent.find('.code-box')
    });

    loading.add();

    document.querySelector('.code-box').insertAdjacentHTML('beforeend', /*html*/ `
        <textarea class='code-mirror-container robi-code-background h-100'></textarea>
    `);

    let shouldReload = false;

    const editor = CodeMirror.fromTextArea(parent.find('.code-mirror-container'), {
        mode: 'javascript',
        indentUnit: 4,
        lineNumbers: true,
        autoCloseBrackets: true,
        styleActiveLine: true,
        foldGutter: true,
        matchBrackets: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        keyword: {
            "import": "special",
            "export": "special",
            "default": "special",
            "await": "special",
        }
    });
    editor.setSize(0, 0);
    editor.setOption('extraKeys', {
        // "Ctrl-Space": "autocomplete",
        'Tab': 'indentMore',
        'Shift-Tab': 'indentLess',
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
            const changedMessaage = parent.find('.changed-message');

            if (!changedMessaage) {
                parent.find('.file-title-text').insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='changed-message' style='margin-left: 10px; color: seagreen'>CHANGED (will reload on close)</div>
                `);
            }

            // Set reload flag
            shouldReload = true;

        }
    });

    // Autocomplete
    const ExcludedIntelliSenseTriggerKeys = {
        "8": "backspace",
        "9": "tab",
        "13": "enter",
        "16": "shift",
        "17": "ctrl",
        "18": "alt",
        "19": "pause",
        "20": "capslock",
        "27": "escape",
        "32": "space",
        "33": "pageup",
        "34": "pagedown",
        "35": "end",
        "36": "home",
        "37": "left",
        "38": "up",
        "39": "right",
        "40": "down",
        "45": "insert",
        "46": "delete",
        "91": "left window key",
        "92": "right window key",
        "93": "select",
        "107": "add",
        "109": "subtract",
        "110": "decimal point",
        "111": "divide",
        "112": "f1",
        "113": "f2",
        "114": "f3",
        "115": "f4",
        "116": "f5",
        "117": "f6",
        "118": "f7",
        "119": "f8",
        "120": "f9",
        "121": "f10",
        "122": "f11",
        "123": "f12",
        "144": "numlock",
        "145": "scrolllock",
        "186": "semicolon",
        "187": "equalsign",
        "188": "comma",
        "189": "dash",
        "190": "period",
        "191": "slash",
        "192": "graveaccent",
        "220": "backslash",
        "222": "quote"
    }
      
    // editor.on("keyup", function (cm, event) {
    //     if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
    //         !ExcludedIntelliSenseTriggerKeys[(event.keyCode || event.which).toString()]) {        /*Enter - do not open autocomplete list just after item has been selected in it*/ 
    //       CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
    //     }
    // });

    // END 

    let fileValueRequest;
    let requestDigest;

    if (App.isProd()) {
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
        editor.setSize('100%', '100%');
        editor.setOption('viewportMargin', Infinity);
        editor.setOption('theme', 'vscode-dark');
        editor.getDoc().setValue(value);
        editor.focus();

        docValue = editor.doc.getValue();

        // Watch for changes
        editor.on('change', event => {
            if (docValue === editor.doc.getValue()) {
                console.log('unchanged');

                const dot = parent.find('.changed-dot');

                if (dot) {
                    dot.remove();
                }
            } else {
                console.log('changed');

                const dot = parent.find('.changed-dot');

                if (!dot) {
                    // parent.find('.file-title').insertAdjacentHTML('beforeend', /*html*/ `
                    //     <div class='changed-dot' style='margin-left: 15px; width: 8px; height: 8px; background: white; border-radius: 50%;'></div>
                    // `);
                }
            }
        });

        // // Scrollbar
        // editor.on()
    }
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

    if (App.isProd() || mode === 'prod') {
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
    } else if (App.isDev() || mode === 'dev') {
        const queries = filter ? filter.split(' or ') : [ '' ];

        const fetchAll = await Promise.all(queries.map( async query => {
            const queryFilterString = [
                formatFilter(query),
                formatOrder(orderby)
            ]
            .filter(x => x)
            .join('&');

    
            return await fetch(`http://localhost:3000/${list}${queryFilterString ? `?${queryFilterString}` : ''}`, options);
        }));
        
        function formatFilter(value) {
            if (value) {
                return value
                    // .replaceAll(' or ', ' and ')
                    .split(' and ')
                    .map(group => {
                        if (group.includes('(substringof(')) {
                            const [value, column] = group.replace(`(substringof('`, '').replace(`',`, '').replace(') eq true', '').split(' ');

                            return `${column}_like=${value}`;
                        } else {
                            const [field, operator, value] = group.match(/(?:[^\s"']+|['"][^'"]*["'])+/g); /** {@link https://stackoverflow.com/a/16261693} see jobrad's comment Mar 24 '17 at 17:16 */

                            return `${field}${operator === 'eq' ? '=' : operator === 'ne' ? '_ne=' : ''}${value.replace(/["']/g, "")}`;
                        }
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

        // await Wait(500);
        const all = (await Promise.all(fetchAll.map(async response => await response.json()))).flat();
        // https://stackoverflow.com/a/58429784
        const unique = [...new Map(all.map(item => [ item.Id, item ])).values()];

        return unique;
    }
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
 * @param {*} prop 
 * @returns 
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

    const fetchOptions = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        }
    };

    if (App.isProd()) {
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
            console.log(`User: ${appUser[0].Title}`);

            // Add SiteId prop to Users list item
            appUser[0].SiteId = response.d.Id;

            // Return Users list item
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

            // Create new user
            const newUser = await CreateItem({
                list: 'Users',
                data: {
                    Title,
                    Email,
                    LoginName: LoginName.split('|')[2],
                    // Role: App.get('userDefaultRole'),
                    Roles: {
                        results: [
                            'Developer'
                        ]
                    },
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
    } else if (App.isDev()) {
        const currentUser = await fetch(`http://localhost:3000/users?LoginName=${App.get('dev').user.LoginName}`, fetchOptions);
        const response = await currentUser.json();

        const {
            Title,
            Email,
            LoginName,
            Roles,
            SiteId,
            Settings
        } = App.get('dev').user;

        if (response[0]) {
            console.log(`User: ${response[0].Title}`);
            return response[0];
        } else {
            console.log(`%cMissing user account.`, 'color: red');
            console.log(`Creating user account for ${Title}....`);

            // Create new user
            const newUser = await CreateItem({
                list: 'Users',
                data: {
                    Title,
                    Email,
                    LoginName,
                    // Role,
                    Roles,
                    SiteId,
                    Settings: Settings || App.get('userSettings')
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

        if (data && data.d && data.d.Id) {
            return data.d.Id;
        }
    }
}

/**
 *
 * @param {*} param
 */
export function GetLocal(key) {
    return localStorage.getItem(`${App.get('name') ? `${App.get('name')}-` : '' }${key}`);
}

/**
 * 
 * @param {*} param 
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
    const init = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        },
        signal: abortController.signal
    };

    let url;

    if (App.isProd()) {
        // const url = `${App.get('domain')}/_api/web/siteusers?$filter=substringof('${query.toLowerCase()}',LoginName) eq true and substringof('i%3A0%23.w',LoginName) eq true`;
        // const url = [
        //     `${App.get('site')}`,
        //     `/_api/web/SiteUserInfoList/items`,
        //     // `?$top=200`,
        //     `&$select=Id,Title,FirstName,LastName,Name,EMail`,
        //     `&$filter=substringof('${query}', Name) or (substringof('${query}', Title) or substringof('${query}', EMail) or substringof('${query}', FirstName) or substringof('${query}', LastName))&$orderby=Name`
        // ].join('');
        // const url = [
        //     `${App.get('site')}`,
        //     `/_api/web/SiteUserInfoList/items`,
        //     // `?$top=200`,
        //     `&$filter=(substringof('${query}', Name) or (substringof('${query}', Title) or substringof('${query}', EMail))&$orderby=Name`
        // ].join('');
        url = [
            `${App.get('site')}`,
            `/_vti_bin/listdata.svc/UserInformationList`,
            // `?$top=200`,
            `&$select=Id,Name,Account,WorkEmail`,
            // `&$filter=substringof('i:0e.t|dod_adfs_provider|', Account) and (substringof('${query}', Name) or substringof('${query}', WorkEmail))&$orderby=Name`
            `&$filter=substringof('${query}', Account) or (substringof('${query}', Name) or substringof('${query}', WorkEmail))&$orderby=Name`
        ].join('');
    } else if (App.isDev()) {
        url = `http://localhost:3000/users`;
    }

    return {
        abortController,
        response: fetch(url, init).then(async (response) => {
            const data = await response.json();

            // return data.d.results;
            return data?.d;
        })
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
 * @param {*} H 
 * @returns 
 */
function HexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;

    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }

    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;

    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
  
    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;
  
    h = Math.round(h * 60);
  
    if (h < 0)
        h += 360;
  
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
  
    return h + "," + s + "%," + l + "%";
}

export { HexToHSL }

/**
 * 
 * @param {*} hex 
 * @returns 
 */
function HexToRGB(hex) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `${r},${g},${b}`;
}

export { HexToRGB }

/**
 *
 * @param {*} param
 */
export async function HideRoutes({ paths }) {
    // console.log(paths);

    let digest;
    let request;

    if (App.isProd()) {
        digest = await GetRequestDigest();
        request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files('app.js')/$value`, {
            method: 'GET',
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });
    } else {
        request = await fetch(`http://127.0.0.1:8080/src/app.js`);
        await Wait(1000);
    }

    const value = await request.text();

    const newRoutes = paths.map(item => {
        const { path, hide } = item;
        const route = Store.routes().filter(r => !r.ignore).find(r => r.path === path);

        if (route) {
            const { title, icon } = route;

            return [
                // `        `,
                `        // @START-${path}`,
                `        {`,
                ... hide ? [`            hide: true,`] : [],
                `            path: '${path}',`,
                `            title: '${title}',`,
                `            icon: '${icon}',`,
                `            go: ${ "Route_" + path}`,
                `        }`,
                `        // @END-${path}`,
                // `        `
            ].join('\n');
        }
    }).join('\n        , // @Route\n');

    // console.log(newRoutes);

    const updated = value.replace(/\/\/ @START-Routes([\s\S]*?)\/\/ @END-Routes/, `// @START-Routes\n${newRoutes}\n// @END-Routes`);

    // console.log('OLD\n----------------------------------------\n', value);
    // console.log('\n****************************************');
    // console.log('NEW\n----------------------------------------\n', updated);
    // console.log('\n****************************************');

    let setFile;

    if (App.isProd()) {
        // TODO: Make a copy of app.js first
        // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
        setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files/Add(url='app.js',overwrite=true)`, {
            method: 'POST',
            body: updated, 
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });
    } else {
        setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
            method: 'POST',
            body: updated
        });
        await Wait(1000);
    }

    // console.log('Saved:', setFile);
}

/**
 *
 * @param {*} param
 */
export function History(param) {
    const {
        url, title
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
 * @param {*} hsl
 * @param {*} reduceBy
 * @returns
 */
function HSLDarker(hsl, reduceBy = 0) {
    let [h, s, l] = hsl.split(',');
    
    const num = parseInt(l.replace('%,', ''));
    
    l = `${num - reduceBy}%`;
    
    return [h, s, l].join(',');
}

export { HSLDarker }

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function HTML({items, each}) {
    return items.map(each).join('\n');
}

/**
 *
 * @param {*} param
 */
export async function InitializeApp(param) {
    const { settings, routes } = param;
    const { preLoadLists } = settings;

    if (App.isProd()) {
        console.log('Mode: prod');

        // Check if app is already installed
        const isInstalled = await GetAppSetting('Installed');

        if (!isInstalled || isInstalled.Value === 'No') {
            // Start loading bar animation
            const loadingBar = LoadingBar({
                displayLogo: App.get('logoLarge'),
                displayTitle: App.get('title'),
                totalCount: preLoadLists?.length || 0,
                loadingBar: 'hidden',
                async onReady() {
                    InstallApp({
                        isInstalled,
                        settings,
                        loadingBar,
                        routes
                    });
                }
            });

            loadingBar.add();

            Store.add({
                name: 'app-loading-bar',
                component: loadingBar
            });
            return;
        } else {
            LaunchApp(param);
        }

    } else {
        console.log('Mode: dev');

        if (App.get('dev').testInstall) {
            console.log('TODO: Mirror prod install process');
        } else {
            LaunchApp(param);
        }
    }
}

/**
 *
 * @param {*} param
 */
export function InstallApp(param) {
    const { settings, loadingBar, isInstalled } = param;
    const { questionTypes } = settings;
    const coreLists = Lists();
    const lists = App.lists();

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
                type: 'robi-reverse',
                value: 'Install'
            });

            installBtn.add();

            modal.get().addEventListener('keypress', event => {
                if (event.key === 'Enter') {
                    installApp(event);
                }
            });

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
                    const { fields, items } = item;

                    // + 1 for each list
                    progressCount = progressCount + 1;

                    // +2 for each field
                    progressCount = progressCount + ((fields.length * 2) || 0);

                    // +1 for each item
                    progressCount = progressCount + (items?.length || 0);
                });

                lists.forEach(item => {
                    const { fields, options, items } = item;

                    if (options?.files) {
                        // + 1 for files library 
                        progressCount = progressCount + 1;
                    }

                    // +1 for each list
                    progressCount = progressCount + 1;

                    // +2 for each field
                    progressCount = progressCount + ((fields.length * 2) || 0);

                    // +1 for each item
                    progressCount = progressCount + (items?.length || 0);
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
                    radius: '20px',
                    background: 'var(--background)'
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
                        filter: `Summary eq '${App.get('title')} lists created'`
                    });

                    if (releaseNoteExists[0]) {
                        // Add to console
                        installConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>${App.get('title')} lists created' release note already exists.'</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        installConsole.get().scrollTop = installConsole.get().scrollHeight;
                    } else {
                        // Add Release Notes
                        await CreateItem({
                            list: 'ReleaseNotes',
                            data: {
                                Summary: `${App.get('title')} lists created`,
                                Description: lists.map(item => item.list).join(', ') + '.',
                                Status: 'Published',
                                MajorVersion: '0',
                                MinorVersion: '1',
                                PatchVersion: '0',
                                ReleaseType: 'Current'
                            }
                        });

                        console.log(`Added Release Note: ${App.get('title')} lists created - ${lists.map(item => item.list).join(', ')}.`);

                        // Add to console
                        installConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code>''${App.get('title')}' lists created - ${lists.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
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
                            Roles: {results : ['Developer']},
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

                    // TODO: Pull from settings if installing a pre-existing app from a backup with a version number different from the default 0.1.0
                    // Create key 'Version'
                    await CreateItem({
                        list: 'Settings',
                        data: {
                            Key: 'Version',
                            Value: '0.1.0'
                        }
                    });

                    // TODO: Pull actual Robi build # from source of truth (where to put that?)
                    // Create key 'Build'
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
                        <code style='color: var(--primary) !important;'>${spacers}</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: var(--primary) !important;'>| '${App.get('name')}' installed | Build 1.0.0 | Version 1.0.0 |</code>
                    </div>
                    <div class='console-line'>
                        <!-- <code class='line-number'>0</code> -->
                        <code style='color: var(--primary) !important;'>${spacers}</code>
                    </div>
                `);

                // Scroll console to bottom
                installConsole.get().scrollTop = installConsole.get().scrollHeight;

                // Show launch button
                const launchBtn = BootstrapButton({
                    type: 'robi',
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
                type: 'robi-light',
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
                                Installation cancelled. Reload to resume install.
                            </div>
                        `);
                    });

                    modal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
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
        releaseNotes, routes, settings
    } = param;

    const {
        title, usersList, svgSymbols, sessionStorageData, sidebar, maincontainer
    } = settings;

    /** Set sessions storage */
    SetSessionStorage({
        sessionStorageData
    });

    /** Load svg definitions */
    const svgDefs = SvgDefs({
        svgSymbols
    });

    svgDefs.add();

    Store.add({
        name: 'svgdefs',
        component: svgDefs
    });

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

    /** Sidebar */
    const sidebarParam = {
        parent: appContainer,
        path
    };

    const sidebarComponent = sidebar ? sidebar(sidebarParam) : Sidebar(sidebarParam);

    Store.add({
        name: 'sidebar',
        component: sidebarComponent
    });

    sidebarComponent.add();

    /** Main Container */
    const mainContainerParam = {
        parent: appContainer
    };

    const mainContainer = maincontainer ? maincontainer(mainContainerParam) : MainContainer(mainContainerParam);

    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });

    mainContainer.add();

    /** Show App Container */
    appContainer.show('flex');

    /** Generate Session Id */
    const sessionId = GenerateUUID();

    // TODO: Use GetLocal();
    /** Format Title for Sessin/Local Storage keys */
    const storageKeyPrefix = settings.title.split(' ').join('-');

    /** Set Session Id */
    sessionStorage.setItem(`${storageKeyPrefix}-sessionId`, sessionId);

    /** Log in*/
    try {
        // TODO: Standarize LOG and ERROR format
        Log({
            Title: `Log in`,
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

    if (releaseNotes) {
        const { show, version, title, message } = releaseNotes;

        const isDismissed = localStorage.getItem(`${storageKeyPrefix}-releaseNotesDismissed-${version}`);

        if (show && !isDismissed) {
            const toast = FixedToast({
                type: 'robi',
                title,
                message,
                bottom: '20px',
                right: '10px',
                action(event) {
                    const modal = Modal({
                        fade: true,
                        background: settings.secondaryColor,
                        centered: true,
                        close: true,
                        addContent(modalBody) {
                            ReleaseNotesContainer({
                                margin: '0px',
                                parent: modalBody,
                            });
                        },
                        parent: appContainer
                    });
    
                    modal.add();
                },
                onClose(event) {
                    localStorage.setItem(`${storageKeyPrefix}-releaseNotesDismissed-${version}`, 'true');
                },
                parent: appContainer
            });
    
            toast.add();
        }
    }

    // /** Check Local Storage for release notes */
    // const isReleaseNotesDismissed = localStorage.getItem(`${storageKeyPrefix}-releaseNotesDismissed`);

    // if (!isReleaseNotesDismissed) {
    //     /** Release Notes */
    //     const releaseNotes = FixedToast({
    //         type: 'robi',
    //         title: `New version ${'0.1.0'}`,
    //         message: `View release notes`,
    //         bottom: '20px',
    //         right: '10px',
    //         action(event) {
    //             const modal = Modal({
    //                 fade: true,
    //                 background: settings.secondaryColor,
    //                 centered: true,
    //                 close: true,
    //                 addContent(modalBody) {
    //                     ReleaseNotesContainer({
    //                         margin: '0px',
    //                         parent: modalBody,
    //                     });
    //                 },
    //                 parent: appContainer
    //             });

    //             modal.add();
    //         },
    //         onClose(event) {
    //             /** Set Local Storage */
    //             localStorage.setItem(`${storageKeyPrefix}-releaseNotesDismissed`, 'true');
    //         },
    //         parent: appContainer
    //     });

    //     releaseNotes.add();
    // }
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
        Title, Message, StackTrace, Module
    } = param;

    if (App.isProd()) {
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
                    // FIXME: what should this property be instead, since users can have multiple roles?
                    role: Store.user().Roles.results.join(', ')
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
        };

        const newItem = await Post(postOptions);

        console.log(`Log: ${Title}`);

        return newItem.d;
    } else if (App.isDev()) {
        const newLog = await CreateItem({
            list: 'Log',
            data: {
                Title,
                SessionId: sessionStorage.getItem(`${App.get('name').split(' ').join('_')}-sessionId`),
                Message: JSON.stringify({
                    body: Message,
                    location: location.href,
                    role: Store.user().Roles.results.join(', ')
                }),
                StackTrace: JSON.stringify(StackTrace.replace('Error\n    at ', '')),
                UserAgent: navigator.userAgent,
                Module
            }
        });

        console.log(`Log: ${Title}`);

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
        Message, Error, Source
    } = param;

    if (App.isProd()) {
        /** Get new request digest */
        /**
         * @author Wil Pacheco & John Westhuis
         * Added temporary alert to prevent infinite error loop when reporting error, & reload page for user.
         *
         * @author Stephen Matheis
         * @to Wilfredo Pacheo, John Westhuis
         * Catching the request digest promise was a great idea. Jealous I didn't think of it >_<!
         */
        const requestDigest = await GetRequestDigest().catch(() => {
            alert('Your session has expired, your page will now reload.');
            location.reload();
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
        };

        const newItem = await Post(postOptions);

        console.log(`%cError: ${Message}`, 'background: crimson; color: #fff');

        return newItem.d;
    } else if (App.isDev()) {
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
            <div class='file-title' style='user-select: none;'>
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
        classes: ['scrollbar-wide'],
        titleStyle: 'width: 100%;',
        headerStyle: 'padding-bottom: 0px;',
        footerStyle: 'border-top: solid 1px #676E95;',
        closeStyle: 'padding: 16px;',
        scrollable: true,
        // background: '#292D3E',
        background: '#1e1e1e',
        centered: true,
        showFooter: false,
        async addContent(modalBody) {
            // Change modal default styles
            modal.find('.modal-dialog').style.maxWidth = '100%';
            modal.find('.modal-dialog').style.margin = '1.75rem';
            modalBody.style.height = '100vh';

            const loading = LoadingSpinner({
                message: `Loading <span style='font-weight: 300;'>${path}/${file}</span>`,
                type: 'white',
                classes: ['h-100', 'loading-file'],
                parent: modalBody
            });

            loading.add();

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <textarea class='code-mirror-container robi-code-background h-100'></textarea>
            `);

            let shouldReload = false;

            const editor = CodeMirror.fromTextArea(modal.find('.code-mirror-container'), {
                mode: 'javascript',
                indentUnit: 4,
                lineNumbers: true,
                autoCloseBrackets: true,
                styleActiveLine: true,
                foldGutter: true,
                matchBrackets: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                keyword: {
                    "import": "special",
                    "export": "special",
                    "default": "special",
                    "await": "special",
                }
            });
            editor.foldCode(CodeMirror.Pos(0, 0));
            editor.setSize(0, 0);
            editor.setOption('extraKeys', {
                'Tab': 'indentMore',
                'Shift-Tab': 'indentLess',
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
                }
            });

            let fileValueRequest;
            let requestDigest;

            if (App.isProd()) {
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
            let docValue = '';

            function setEditor() {
                editor.setSize('100%', '100%');
                editor.setOption('viewportMargin', Infinity);
                editor.setOption('theme', 'vscode-dark');
                editor.getDoc().setValue(value);
                editor.focus();

                docValue = editor.doc.getValue();

                // Watch for changes
                editor.on('change', event => {
                    if (docValue === editor.doc.getValue()) {
                        console.log('unchanged');

                        const dot = modal.find('.changed-dot');

                        if (dot) {
                            dot.remove();
                        }
                    } else {
                        console.log('changed');

                        const dot = modal.find('.changed-dot');

                        if (!dot) {
                            modal.find('.file-title').insertAdjacentHTML('beforeend', /*html*/ `
                                <div class='changed-dot' style='margin-left: 15px; width: 8px; height: 8px; background: white; border-radius: 50%;'></div>
                            `);
                        }
                    }
                });

                // Remove .modal-body top padding
                modalBody.style.paddingTop = '0px';
            }

            $(modal.get()).on('hide.bs.modal', checkIfSaved);

            async function checkIfSaved(event) {
                // Don't close just yet
                event.preventDefault();

                console.log('check if saved');
                console.log('param:', param);
                console.log('value:', value);
                console.log('editor:', editor.doc.getValue());

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

                        // Wait 5 seconds to make sure changes are committed
                        if (App.isProd()) {
                            await Wait(5000);
                        }

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
                        return false;
                    } else {
                        // FIXME: Why doesn't reuturn false/true work?
                        // Remove checkIfSaved before closing
                        $(modal.get()).off('hide.bs.modal', checkIfSaved);
                        modal.close();
                        
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
                                        <button class='btn btn-robi-light btn-sm dont-save'>Don't Save</button>
                                        <button class='btn btn-sm ml-2 cancel'>Cancel</button>
                                    </div>
                                    <div style='display: flex; justify-content: flex-end;'>
                                        <button class='btn btn-robi save'>Save</button>
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
                    Store.get('appcontainer').find('.dialog-box .save').addEventListener('click', async (event) => {
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

                // TODO: Move to SetFile action
                let setFile;

                if (App.isProd()) {
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
 */
export async function ModifyForm({ list, fields, form, type }) {
    const modal = Modal({
        contentPadding: '30px',
        title: `Modify ${type} Item Form`,
        async addContent(modalBody) {
            const formComponent = await form({
                item: {},
                fields,
                list,
                modal: modal,
                parent: modalBody
            });

            if (formComponent.label) {
                modal.getButton('Create').innerText = form.label;
            }

            if (formComponent) {
                modal.showFooter();
            }
        },
        buttons: {
            footer: [
                {
                    value: 'Cancel',
                    classes: '',
                    data: [
                        {
                            name: 'dismiss',
                            value: 'modal'
                        }
                    ]
                },
                // TODO: send modal prop to form
                {
                    value: 'Create',
                    classes: 'btn-robi',
                    async onClick(event) {
                        console.log('for demonstration purposes only');
                    }
                }
            ]
        }
    });

    modal.add();

    const tools = FormTools({
        type,
        list,
        container: modal,
        parent: modal.getHeader(),
        container: modal,
    });

    tools.add();

    
}

/**
 *
 * @param {*} param
 */
export async function ModifyRoute({ route }) {
    const routes = Store.routes().filter(item => item.type !== 'system');

    const addRouteModal = Modal({
        title: false,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            addRouteModal.find('.modal-dialog').style.maxWidth = 'fit-content';
            addRouteModal.find('.modal-dialog').style.minWidth = '800px';

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-3'>Modify routes</h3>
            `);

            const fields = routes.map(route => {
                const { path, title, icon, hide } = route;

                const row = Container({
                    classes: ['w-100', 'position-relative', path],
                    padding: '10px',
                    radius: '10px',
                    parent: modalBody
                });

                row.add();
                row.get().style.transition = 'background-color 300ms';
                // TODO: Highlight hidden routes
                row.append(/*html*/ `
                    <div style='position: absolute; top: 0px; left: -42px; height: 100%; padding: 10px; transition: opacity 300ms; opacity: 0;' class='d-flex justify-content-center align-items-center modified'>
                        <svg class="icon" style='fill: var(--primary); font-size: 22px;'>
                            <use href="#icon-bs-check-circle"></use>
                        </svg>
                    </div>
                `);

                const routeTitle = SingleLineTextField({
                    addon: 'Title',
                    classes: ['mb-0', 'mr-3', 'flex-grow-1'],
                    label: '',
                    value: title,
                    parent: row,
                    onKeyup(event) {
                        if (routeTitle.value() !== title) {
                            row.get().style.background = 'var(--primary20)';
                            row.find('.modified').style.opacity = '1';
                            // Use current path as key
                            
                        } else {
                            row.get().style.background = 'inherit';
                            row.find('.modified').style.opacity = '0';
                        }
                    }
                });

                routeTitle.add();

                const routePath = SingleLineTextField({
                    addon: `${App.get('site')}#`,
                    classes: ['mb-0', 'mr-3', 'flex-grow-1'],
                    label: '',
                    value: path,
                    parent: row,
                    onKeydown(event) {
                        if (event.code === 'Space' || event.code === 'Tab') {
                            return false;
                        }
                    },
                    onKeyup(event) {
                        if (routeTitle.value() !== title) {
                            row.get().style.background = 'var(--primary20)';
                            row.find('.modified').style.opacity = '1';
                        } else {
                            row.get().style.background = 'inherit';
                            row.find('.modified').style.opacity = '0';
                        }
                    }
                });

                routePath.add();

                // Route icon
                const routeIcon = ChoiceField({
                    classes: ['mb-0', 'mr-0'],
                    label: '',
                    parent: row, 
                    maxHeight: '150px',
                    valueType: 'html',
                    value: /*html*/ `
                        <div class='d-flex justify-content-center w-100' data-target='true'>
                            <svg class='icon' style='font-size: 18px; fill: var(--primary);'>
                                <use href='#icon-${icon}'></use>
                            </svg>
                        </div>
                    `,
                    options: Store.get('svgdefs').getIcons().map(icon => {
                        const { id } = icon;

                        return {
                            label: /*html*/ `
                                <div class='d-flex justify-content-center w-100' data-target='true'>
                                    <svg class='icon' style='font-size: 18px; fill: var(--primary);'>
                                        <use href='#${id}'></use>
                                    </svg>
                                </div>
                            `
                        }
                    }),
                    action(event) {
                        // canEnable();
                    }
                });

                routeIcon.add();

                return {
                    values() {
                        const pathValue = routePath.value();
                        const titleValue = routeTitle.value()
                        const iconValue = routeIcon.value().querySelector('use').href.baseVal.replace('#icon-', '');

                        // TODO: split into old. and new.
                        return {
                            name: path,
                            current: {
                                title,
                                icon
                            },
                            path: pathValue !== path ? pathValue : null,
                            title: titleValue !== title ? titleValue : null,
                            icon: iconValue !== icon ? iconValue : null
                        }   
                    }
                }
            });

            const addRouteBtn = BootstrapButton({
                async action() {
                    // TODO: Generalize show save modal and blur background
                    // Update app.js first or live-server will reload when
                    // Route/Path/Path.js is created
                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        scrollable: true,
                        shadow: true,
                        async addContent(modalBody) {
                            modal.find('.modal-content').style.width = 'unset';

                            const loading = LoadingSpinner({
                                message: `<span style='color: var(--primary);'>Saving<span>`,
                                type: 'robi',
                                classes: ['p-4'],
                                parent: modalBody
                            });
                
                            loading.add();
                        },
                        centered: true,
                        showFooter: false,
                        position: 'afterend'
                    });

                    modal.add();

                    // Blur entire app
                    document.querySelector('#app').style.transition = 'filter 150ms';
                    document.querySelector('#app').style.filter = 'blur(5px)';

                    // Flag. True if any path, title, or icon has changed.
                    let changed = false;

                    // 1. Update Route files first.
                    for (let field of fields) {
                        const { name, path, title, icon } = field.values();

                        // console.log(path, title, icon);

                        if (path || title || icon) {
                            // Set app.js flag
                            changed = true;

                            // If current route changed, updated URL
                            let route = location.href.split('#')[1].split('/');

                            if (route[0] === name); {
                                route[0] = path || name;
                                location.href = location.href.split('#')[0] + '#' + route.join('/');
                            }
                            
                            if (App.isProd()) {
                                await updateRoute({ name, path });
                            }
                        } else {
                            console.log(`${name} not changed`);
                        }
                    }

                    // 2. If title, path, or icon has changed, update app.js.
                    if (changed) {
                        await updateApp();
                    }

                    if (App.isProd()) {
                        
                        await Wait(3000);
                        location.reload();
                    } else {
                        // NOTE: Can't update files in /src first, will trigger hot reload
                        for (let field of fields) {
                            const { name, path, title, icon } = field.values();
    
                            if (path || title || icon) {
                                await updateRoute({ name, path });
                            } else {
                                console.log(`${name} not changed`);
                            }
                        }

                        await Wait(1000);
                        location.reload();
                    }

                    modal.close();

                    async function updateApp() {
                        // Update app.js
                        let digest;
                        let request;

                        if (App.isProd()) {
                            digest = await GetRequestDigest();
                            request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('app.js')/$value`, {
                                method: 'GET',
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            request = await fetch(`http://127.0.0.1:8080/src/app.js`);
                            await Wait(1000);
                        }

                        let content = await request.text();
                        let updated = '';

                        // Set Imports
                        const newImports = fields.map(field => {
                            const { name, path } = field.values();
                            const route = path || name;

                            return `import ${route} from './Routes/${route}/${route}.js'`;
                        }).join('\n');
                    
                        updated = content.replace(/\/\/ @START-IMPORTS([\s\S]*?)\/\/ @END-IMPORTS/, `// @START-IMPORTS\n${newImports || '\n'}\n// @END-IMPORTS`);
                    
                        // FIXME: Doesn't retain hide: true
                        // Set routes
                        const allRoutes = updated.match(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/);
                        const oldRoutes = allRoutes[1].split(', // @ROUTE');

                        // console.log(oldRoutes);

                        const newRoutes = fields.map((field, index) => {
                            const { name, path, title, icon, current } = field.values();
                            const route = path || name;
                            const old = oldRoutes[index];
                            const hidden = old.match(/hide: true,/);

                            // console.log(name);
                            // console.log(old);
                            // console.log(hidden);

                            return [
                                `        `,
                                `        // @START-${route}`,
                                `        {`,
                                ... hidden ? [`            hide: true,`] : [],
                                `            path: '${route}',`,
                                `            title: '${title || current.title}',`,
                                `            icon: '${icon || current.icon}',`,
                                `            go: ${route}`,
                                `        }`,
                                `        // @END-${route}`,
                                `        `
                            ].join('\n');
                        }).join(', // @ROUTE');

                        // console.log(newRoutes);
                    
                        updated = updated.replace(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/, `// @START-ROUTES${newRoutes || '\n        '}// @END-ROUTES`);
                    
                        // console.log('OLD\n----------------------------------------\n', content);
                        // console.log('\n****************************************');
                        // console.log('NEW\n----------------------------------------\n', updated);
                        // console.log('\n****************************************');

                        let setFile;

                        if (App.isProd()) {
                            // TODO: Make a copy of app.js first
                            // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                            setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='app.js',overwrite=true)`, {
                                method: 'POST',
                                body: updatedContent, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
                                method: 'POST',
                                body: updated
                            });
                            await Wait(1000);
                        }

                        // console.log('Saved:', setFile);
                    }

                    async function updateRoute({ name, path }) {
                        // Prod
                        if (App.isProd()) {
                            let digest;
                            let request;
    
                            if (path) {
                                // 1. Rename function
                                digest = await GetRequestDigest();
                                request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/Files('${name}.js')/$value`, {
                                    method: 'GET',
                                    headers: {
                                        'binaryStringRequestBody': 'true',
                                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                                        'X-RequestDigest': digest
                                    }
                                });
                    
                                const value = await request.text();
                                const updated = value;

                                // Rename function
                                if (path) {
                                    updated = updated.replace(`function ${name}`, `function ${path}`);
                                }
                                // console.log('OLD\n----------------------------------------\n', value);
                                // console.log('\n****************************************');
                                // console.log('NEW\n----------------------------------------\n', updated);
                                // console.log('\n****************************************');
                    
                                // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                                await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/Files/Add(url='${name}.js',overwrite=true)`, {
                                    method: 'POST',
                                    body: updated, 
                                    headers: {
                                        'binaryStringRequestBody': 'true',
                                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                                        'X-RequestDigest': digest
                                    }
                                });

                                // TODO: Extract to new Action
                                // 2. Rename file
                                await fetch(`${App.get('site')}/_api/web/GetFileByServerRelativeUrl('App/src/Routes/${name}/${name}.js')/moveto(newurl='App/src/Routes/${name}/${path}.js',flags=1)`, {
                                    method: 'MERGE',
                                    body: {
                                        "__metadata": {
                                            "type": getType.__metadata.type
                                        },
                                        "Title": "New name",
                                        "FileLeafRef": "New name"
                                    }, 
                                    headers: {
                                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                                        'X-RequestDigest': digest
                                    }
                                });

                                // TODO: Extract to new Action
                                // 3. Rename dir
                                const getType = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/ListItemAllFields`, {
                                    method: 'GET',
                                    headers: {
                                        'Accept': 'application/json;odata=verbose;charset=utf-8'
                                    }
                                });

                                console.log(getType);

                                return;

                                await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/ListItemAllFields`, {
                                    method: 'MERGE',
                                    body: {
                                        "__metadata": {
                                            "type": getType.__metadata.type
                                        },
                                        "Title": path,
                                        "FileLeafRef": path
                                    }, 
                                    headers: {
                                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                                        'X-RequestDigest': digest
                                    }
                                });
                            } else {
                                console.log('Path not changed');
                            }

                            return;
                        } 
                        
                        // Dev
                        if (App.isDev()) {
                            const request = await fetch(`http://127.0.0.1:8080/src/Routes/${name}/${name}.js`);
                            await Wait(1000);
                
                            const value = await request.text();

                            // Hold changes
                            let updated = value;

                            // Rename function
                            if (path) {
                                updated = updated.replace(`function ${name}`, `function ${path}`);
                            }

                            // console.log('OLD\n----------------------------------------\n', value);
                            // console.log('\n****************************************');
                            // console.log('NEW\n----------------------------------------\n', updated);
                            // console.log('\n****************************************');

                            await fetch(`http://127.0.0.1:2035/?${name || path}&${path || name}`, {
                                method: 'PUT',
                                body: updated
                            });

                            await Wait(1000);

                            return;
                        }
                    }
                },
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Save'
            });

            addRouteBtn.add();

            const cancelBtn = BootstrapButton({
                action() {
                    console.log('Cancel modify routes');

                    addRouteModal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
                value: 'Cancel'
            });

            cancelBtn.add();

            // Show message if path already exists
            function showMessage(value) {
                if (paths.includes(value.toLowerCase())) {
                    // Show message
                    if (!pathExists) {
                        pathExists = Alert({
                            type: 'danger',
                            text: `A route with path <strong>${value}</strong> already exists`,
                            classes: ['alert-in', 'w-100'],
                            top: routePath.get().offsetHeight + 5,
                            parent: routePath
                        });

                        pathExists.add();
                    }
                } else {
                    // Remove message
                    if (pathExists) {
                        pathExists.remove();
                        pathExists = null;
                    }
                }
            }

            // Check if all fields are filled out and path doesn't already exist
            function canEnable() {
                if (routeTitle.value() && routePath.value() && !paths.includes(routePath.value().toLowerCase())) {
                    addRouteBtn.enable();
                } else {
                    addRouteBtn.disable();
                }
            }
        },
        centered: true,
        showFooter: false,
    });

    addRouteModal.add();
}

/**
 *
 * @param {*} param
 */
export async function ModifyRoutes(event) {
    // return;
    const routes = Store.routes().filter(item => item.type !== 'system');

    const addRouteModal = Modal({
        title: false,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            addRouteModal.find('.modal-dialog').style.maxWidth = 'fit-content';
            addRouteModal.find('.modal-dialog').style.minWidth = '800px';

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-3'>Modify routes</h3>
            `);

            const fields = routes.map(route => {
                const { path, title, icon, hide } = route;

                const row = Container({
                    classes: ['w-100', 'position-relative', path],
                    padding: '10px',
                    radius: '10px',
                    parent: modalBody
                });

                row.add();
                row.get().style.transition = 'background-color 300ms';
                // TODO: Highlight hidden routes
                row.append(/*html*/ `
                    <div style='position: absolute; top: 0px; left: -42px; height: 100%; padding: 10px; transition: opacity 300ms; opacity: 0;' class='d-flex justify-content-center align-items-center modified'>
                        <svg class="icon" style='fill: var(--primary); font-size: 22px;'>
                            <use href="#icon-bs-check-circle"></use>
                        </svg>
                    </div>
                `);

                const routeTitle = SingleLineTextField({
                    addon: 'Title',
                    classes: ['mb-0', 'mr-3', 'flex-grow-1'],
                    label: '',
                    value: title,
                    parent: row,
                    onKeyup(event) {
                        if (routeTitle.value() !== title) {
                            row.get().style.background = 'var(--primary20)';
                            row.find('.modified').style.opacity = '1';
                            // Use current path as key
                            
                        } else {
                            row.get().style.background = 'inherit';
                            row.find('.modified').style.opacity = '0';
                        }
                    }
                });

                routeTitle.add();

                const routePath = SingleLineTextField({
                    addon: `${App.get('site')}#`,
                    classes: ['mb-0', 'mr-3', 'flex-grow-1'],
                    label: '',
                    value: path,
                    parent: row,
                    onKeydown(event) {
                        if (event.code === 'Space' || event.code === 'Tab') {
                            return false;
                        }
                    },
                    onKeyup(event) {
                        if (routeTitle.value() !== title) {
                            row.get().style.background = 'var(--primary20)';
                            row.find('.modified').style.opacity = '1';
                        } else {
                            row.get().style.background = 'inherit';
                            row.find('.modified').style.opacity = '0';
                        }
                    }
                });

                routePath.add();

                // Route icon
                const routeIcon = ChoiceField({
                    classes: ['mb-0', 'mr-0'],
                    label: '',
                    parent: row, 
                    maxHeight: '150px',
                    valueType: 'html',
                    value: /*html*/ `
                        <div class='d-flex justify-content-center w-100' data-target='true'>
                            <svg class='icon' style='font-size: 18px; fill: var(--primary);'>
                                <use href='#icon-${icon}'></use>
                            </svg>
                        </div>
                    `,
                    options: Store.get('svgdefs').getIcons().map(icon => {
                        const { id } = icon;

                        return {
                            label: /*html*/ `
                                <div class='d-flex justify-content-center w-100' data-target='true'>
                                    <svg class='icon' style='font-size: 18px; fill: var(--primary);'>
                                        <use href='#${id}'></use>
                                    </svg>
                                </div>
                            `
                        }
                    }),
                    action(event) {
                        // canEnable();
                    }
                });

                routeIcon.add();

                return {
                    values() {
                        const pathValue = routePath.value();
                        const titleValue = routeTitle.value()
                        const iconValue = routeIcon.value().querySelector('use').href.baseVal.replace('#icon-', '');

                        // TODO: split into old. and new.
                        return {
                            name: path,
                            current: {
                                title,
                                icon
                            },
                            path: pathValue !== path ? pathValue : null,
                            title: titleValue !== title ? titleValue : null,
                            icon: iconValue !== icon ? iconValue : null
                        }   
                    }
                }
            });

            const addRouteBtn = BootstrapButton({
                async action() {
                    // TODO: Generalize show save modal and blur background
                    // Update app.js first or live-server will reload when
                    // Route/Path/Path.js is created
                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        scrollable: true,
                        shadow: true,
                        async addContent(modalBody) {
                            modal.find('.modal-content').style.width = 'unset';

                            const loading = LoadingSpinner({
                                message: `<span style='color: var(--primary);'>Saving<span>`,
                                type: 'robi',
                                classes: ['p-4'],
                                parent: modalBody
                            });
                
                            loading.add();
                        },
                        centered: true,
                        showFooter: false,
                        position: 'afterend'
                    });

                    modal.add();

                    // Blur entire app
                    document.querySelector('#app').style.transition = 'filter 150ms';
                    document.querySelector('#app').style.filter = 'blur(5px)';

                    // Flag. True if any path, title, or icon has changed.
                    let changed = false;

                    // 1. Update Route files first.
                    for (let field of fields) {
                        const { name, path, title, icon } = field.values();

                        // console.log(path, title, icon);

                        if (path || title || icon) {
                            // Set app.js flag
                            changed = true;

                            // If current route changed, updated URL
                            let route = location.href.split('#')[1].split('/');

                            if (route[0] === name); {
                                route[0] = path || name;
                                location.href = location.href.split('#')[0] + '#' + route.join('/');
                            }
                            
                            if (App.isProd()) {
                                await updateRoute({ name, path, title, icon });
                            }
                        } else {
                            console.log(`${name} not changed`);
                        }
                    }

                    // 2. If title, path, or icon has changed, update app.js.
                    if (changed) {
                        await updateApp();
                    }

                    if (App.isProd()) {
                        
                        await Wait(3000);
                        location.reload();
                    } else {
                        // NOTE: Can't update files in /src first, will trigger hot reload
                        for (let field of fields) {
                            const { name, path, title, icon } = field.values();
    
                            if (path || title || icon) {
                                await updateRoute({ name, path, title, icon });
                            } else {
                                console.log(`${name} not changed`);
                            }
                        }

                        await Wait(1000);
                        location.reload();
                    }

                    modal.close();

                    async function updateApp() {
                        // Update app.js
                        let digest;
                        let request;

                        if (App.isProd()) {
                            digest = await GetRequestDigest();
                            request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('app.js')/$value`, {
                                method: 'GET',
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            request = await fetch(`http://127.0.0.1:8080/src/app.js`);
                            await Wait(1000);
                        }

                        let content = await request.text();
                        let updated = '';

                        // Set Imports
                        const newImports = fields.map(field => {
                            const { name, path } = field.values();
                            const route = path || name;

                            return `import ${route} from './Routes/${route}/${route}.js'`;
                        }).join('\n');
                    
                        updated = content.replace(/\/\/ @START-IMPORTS([\s\S]*?)\/\/ @END-IMPORTS/, `// @START-IMPORTS\n${newImports || '\n'}\n// @END-IMPORTS`);
                    
                        // FIXME: Doesn't retain hide: true
                        // Set routes
                        const allRoutes = updated.match(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/);
                        const oldRoutes = allRoutes[1].split(', // @ROUTE');

                        // console.log(oldRoutes);

                        const newRoutes = fields.map((field, index) => {
                            const { name, path, title, icon, current } = field.values();
                            const route = path || name;
                            const old = oldRoutes[index];
                            const hidden = old.match(/hide: true,/);

                            // console.log(name);
                            // console.log(old);
                            // console.log(hidden);

                            return [
                                `        `,
                                `        // @START-${route}`,
                                `        {`,
                                ... hidden ? [`            hide: true,`] : [],
                                `            path: '${route}',`,
                                `            title: '${title || current.title}',`,
                                `            icon: '${icon || current.icon}',`,
                                `            go: ${route}`,
                                `        }`,
                                `        // @END-${route}`,
                                `        `
                            ].join('\n');
                        }).join(', // @ROUTE');

                        // console.log(newRoutes);
                    
                        updated = updated.replace(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/, `// @START-ROUTES${newRoutes || '\n        '}// @END-ROUTES`);
                    
                        // console.log('OLD\n----------------------------------------\n', content);
                        // console.log('\n****************************************');
                        // console.log('NEW\n----------------------------------------\n', updated);
                        // console.log('\n****************************************');

                        let setFile;

                        if (App.isProd()) {
                            // TODO: Make a copy of app.js first
                            // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                            setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='app.js',overwrite=true)`, {
                                method: 'POST',
                                body: updatedContent, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': digest
                                }
                            });
                        } else {
                            setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
                                method: 'POST',
                                body: updated
                            });
                            await Wait(1000);
                        }

                        // console.log('Saved:', setFile);
                    }

                    async function updateRoute({ name, title, path }) {
                        // Prod
                        if (App.isProd()) {
                            let digest;
                            let request;
                
                            // 1. If title has changed, update file.
                            if (title) {
                                digest = await GetRequestDigest();
                                request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/Files('${name}.js')/$value`, {
                                    method: 'GET',
                                    headers: {
                                        'binaryStringRequestBody': 'true',
                                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                                        'X-RequestDigest': digest
                                    }
                                });
                    
                                const value = await request.text();
                                const updated = value.replace(/\/\* @START-Title \*\/([\s\S]*?)\/\* @END-Title \*\//, `/* @START-Title */'${title}'/* @END-Title */`);
                    
                                // console.log('OLD\n----------------------------------------\n', value);
                                // console.log('\n****************************************');
                                // console.log('NEW\n----------------------------------------\n', updated);
                                // console.log('\n****************************************');
                    
                                if (App.isProd()) {
                                    // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                                    await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/Files/Add(url='${name}.js',overwrite=true)`, {
                                        method: 'POST',
                                        body: updated, 
                                        headers: {
                                            'binaryStringRequestBody': 'true',
                                            'Accept': 'application/json;odata=verbose;charset=utf-8',
                                            'X-RequestDigest': digest
                                        }
                                    });
                                } else {
                                    await fetch(`http://127.0.0.1:2035/?path=src/Routes/${name}&file=${name}.js`, {
                                        method: 'POST',
                                        body: updated
                                    });
                                    await Wait(1000);
                                }
                            } else {
                                console.log('Title not changed');
                            }
    
                            // 2. If path has changed, change file and dir name
                            if (path) {
                                // TODO: Extract to new Action
                                // b. Rename file
                                await fetch(`${App.get('site')}/_api/web/GetFileByServerRelativeUrl('App/src/Routes/${name}/${name}.js')/moveto(newurl='App/src/Routes/${name}/${path}.js',flags=1)`, {
                                    method: 'MERGE',
                                    body: {
                                        "__metadata": {
                                            "type": getType.__metadata.type
                                        },
                                        "Title": "New name",
                                        "FileLeafRef": "New name"
                                    }, 
                                    headers: {
                                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                                        'X-RequestDigest': digest
                                    }
                                });

                                // TODO: Extract to new Action
                                // a. Rename dir
                                const getType = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/ListItemAllFields`, {
                                    method: 'GET',
                                    headers: {
                                        'Accept': 'application/json;odata=verbose;charset=utf-8'
                                    }
                                });

                                console.log(getType);

                                return;

                                await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src/Routes/${name}')/ListItemAllFields`, {
                                    method: 'MERGE',
                                    body: {
                                        "__metadata": {
                                            "type": getType.__metadata.type
                                        },
                                        "Title": path,
                                        "FileLeafRef": path
                                    }, 
                                    headers: {
                                        'Accept': 'application/json;odata=verbose;charset=utf-8',
                                        'X-RequestDigest': digest
                                    }
                                });
                            } else {
                                console.log('Path not changed');
                            }

                            return;
                        } 
                        
                        // Dev
                        if (App.isDev()) {
                            // 1. If title has changed, update file.
                            const request = await fetch(`http://127.0.0.1:8080/src/Routes/${name}/${name}.js`);
                            await Wait(1000);
                
                            const value = await request.text();

                            // Hold changes;
                            let updated = value;
                            
                            // Set new title
                            if (title) {
                                value.replace(/\/\* @START-Title \*\/([\s\S]*?)\/\* @END-Title \*\//, `/* @START-Title */'${title}'/* @END-Title */`);
                            }

                            // Rename function
                            if (path) {
                                updated = updated.replace(`function ${name}`, `function ${path}`);
                            }

                            // console.log('OLD\n----------------------------------------\n', value);
                            // console.log('\n****************************************');
                            // console.log('NEW\n----------------------------------------\n', updated);
                            // console.log('\n****************************************');

                            await fetch(`http://127.0.0.1:2035/?${name || path}&${path || name}`, {
                                method: 'PUT',
                                body: updated
                            });

                            await Wait(1000);

                            return;
                        }
                    }
                },
                // disabled: true,
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Save'
            });

            addRouteBtn.add();

            const cancelBtn = BootstrapButton({
                action(event) {
                    console.log('Cancel modify routes');

                    addRouteModal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
                value: 'Cancel'
            });

            cancelBtn.add();

            // Show message if path already exists
            function showMessage(value) {
                if (paths.includes(value.toLowerCase())) {
                    // Show message
                    if (!pathExists) {
                        pathExists = Alert({
                            type: 'danger',
                            text: `A route with path <strong>${value}</strong> already exists`,
                            classes: ['alert-in', 'w-100'],
                            top: routePath.get().offsetHeight + 5,
                            parent: routePath
                        });

                        pathExists.add();
                    }
                } else {
                    // Remove message
                    if (pathExists) {
                        pathExists.remove();
                        pathExists = null;
                    }
                }
            }

            // Check if all fields are filled out and path doesn't already exist
            function canEnable() {
                if (routeTitle.value() && routePath.value() && !paths.includes(routePath.value().toLowerCase())) {
                    addRouteBtn.enable();
                } else {
                    addRouteBtn.disable();
                }
            }
        },
        centered: true,
        showFooter: false,
    });

    addRouteModal.add();
}

/**
 * 
 * @param {*} color 
 * @returns 
 */
function NameToHex(color) {
    return Colors[color.toLowerCase()] || color;
}

export { NameToHex }

/**
 *
 * @param {*} param
 */
export async function OrderRoutes({ routes }) {
    console.log(routes);

    let digest;
    let request;

    if (App.isProd()) {
        digest = await GetRequestDigest();
        request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files('app.js')/$value`, {
            method: 'GET',
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });
    } else {
        request = await fetch(`http://127.0.0.1:8080/src/app.js`);
        await Wait(1000);
    }
    let value = await request.text();

    const allRoutes = value.match(/\/\/ @START-Routes([\s\S]*?)\/\/ @END-Routes/);
    const routeObjects = allRoutes[1].split(', // @Route');

    // console.log('App.js:', value);
    // console.log('Routes:', routes[0]);

    const newRoutes = routes.map(path => {
        // FIXME: change to regex, will find routes that are similar
        const route = routeObjects.find(item => item.includes(`// @START-${path}`));
        // console.log(`Path: // @START-${path} -> Route: ${route}`);

        return route;
    }).join(', // @Route');

    console.log(newRoutes);

    const updated = value.replace(/\/\/ @START-Routes([\s\S]*?)\/\/ @END-Routes/, `// @START-Routes${newRoutes}// @END-Routes`);

    console.log('OLD\n----------------------------------------\n', value);
    console.log('\n****************************************');
    console.log('NEW\n----------------------------------------\n', updated);
    console.log('\n****************************************');

    let setFile;

    if (App.isProd()) {
        // TODO: Make a copy of app.js first
        // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
        setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${App.get('library')}/src')/Files/Add(url='app.js',overwrite=true)`, {
            method: 'POST',
            body: updated, 
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });
        // await Wait (1500);
    } else {
        setFile = await fetch(`http://127.0.0.1:2035/?path=src&file=app.js`, {
            method: 'POST',
            body: updated
        });
        await Wait(1000);
    }

    console.log('Saved:', setFile);
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function Post(param) {
    const {
        url, headers, data
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
    if (App.isDev()) {
        const modal = Modal({
            title: false,
            centered: true,
            showFooter: false,
            close: true,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');
                
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h4 class='mb-3'>Dev mode instructions</h4>
                `);
        
                const info = Alert({
                    type: 'robi-secondary',
                    text: /*html*/`
                        <code>npm run reset</code>
                    `,
                    parent: modalBody
                });
        
                info.add();
            }
        });

        modal.add();

        return;
    }
    
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
            const appLists = App.lists();
            console.log(appLists);

            // All Lists
            const lists = App.lists();
            const allLists = Lists().concat(appLists);
            console.log(allLists);

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h4 class='mb-3'>All <strong>${App.get('name')}</strong> lists will be reinstalled</h4>
                <ul>
                    ${appLists
                    .sort((a, b) => a.list - b.list)
                    .map(item => {
                        return /*html*/ `
                                <li>${item.list}</li>
                            `;
                    }).join('\n')}
                </ul>
                <h4 class='mb3 mt-4'>All <strong>Core</strong> lists will be reinstalled</h4>
                <ul>
                    ${coreLists
                    .sort((a, b) => a.list - b.list)
                    .map(item => {
                        return /*html*/ `
                                <li>${item.list}</li>
                            `;
                    }).join('\n')}
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
                        background: 'var(--background)'
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
 * @param {*} param
 */
export function RemoveLocal(key, value) {
    localStorage.removeItem(`${App.get('name')}-${key}`);
}

/**
 *
 * @param {*} event
 */
export function ResetApp() {
    if (App.isDev()) {
        const modal = Modal({
            title: false,
            centered: true,
            showFooter: false,
            close: true,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');
                
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h4 class='mb-3'>Dev mode instructions</h4>
                `);
        
                const info = Alert({
                    type: 'robi-secondary',
                    text: /*html*/`
                        <code>npm run reset</code>
                    `,
                    parent: modalBody
                });
        
                info.add();
            }
        });

        modal.add();

        return;
    }

    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            if (App.isDev()) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h4 class='mb-3'>Dev mode instructions</h4>
                `);

                const info = Alert({
                    type: 'robi-secondary',
                    text: /*html*/`
                        <code>npm run reset</code>
                    `,
                    parent: modalBody
                });

                info.add();

                return;
            }

            // Core lists
            const coreLists = Lists();
            console.log(coreLists);

            // App lists
            // const appLists = lists;
            const appLists = App.lists();
            console.log(lists);

            // All Lists
            const allLists = Lists().concat(appLists);
            console.log(allLists);

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h4 class='mb-3'>Select <strong>${App.get('name')}</strong> lists to reset</span></h4>
                ${appLists
                    .sort((a, b) => a.list - b.list)
                    .map(item => {
                        return /*html*/ `
                            <div class="form-check ml-2">
                                <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}'>
                                <label class="form-check-label" for="checkbox-${item.list.split(' ').join('-')}">
                                    ${item.list}
                                </label>
                            </div>
                        `;
                    }).join('\n')}
                <h4 class='mt-4 mb-3'>Select <strong>Core</strong> lists to reset</h4>
                ${coreLists
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
                        `;
                    }).join('\n')}
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
                        background: 'var(--background)'
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
                            <code style='color: var(--primary) !important;'>${spacers}</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: var(--primary) !important;'>| Lists reset |</code>
                        </div>
                        <div class='console-line'>
                            <!-- <code class='line-number'>0</code> -->
                            <code style='color: var(--primary) !important;'>${spacers}</code>
                        </div>
                    `);

                    // END RESET ------------------------------------------------------------------------------------
                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div class='mt-4 mb-4'>All selected lists have been successfully reset. You can safely close this modal.</div>
                    `);

                    // Show return button
                    const returnBtn = BootstrapButton({
                        type: 'robi-light',
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
                type: 'robi-reverse',
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
                type: '',
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
    const { scrollTop, title } = options;

    // Get references to core app components
    const appContainer = Store.get('appcontainer');
    const svgDefs = Store.get('svgdefs');
    const sidebar = Store.get('sidebar');
    const mainContainer = Store.get('maincontainer');

    // Store viewcontainer scrollTop
    Store.viewScrollTop(mainContainer.find('.viewcontainer')?.scrollTop || 0);

    // Remove all events attached to the maincontainer
    mainContainer.removeEvents();

    // Remove all child elements from maincontainer
    mainContainer.empty();

    // Remove all style elements added to head that aren't locked
    document.querySelectorAll(`head style[data-locked='no']`).forEach(node => node.remove());

    // Remove modal overlay
    const overlay = document.querySelector('.modal-backdrop');

    if (overlay) {
        overlay.remove();
    }

    // Abort all pending fetch requests
    Store.abortAll();

    // Terminate all running workers
    Store.terminateWorkers();

    // Empty store
    Store.empty();

    // TODO: store core components in props (Ex: Store.maincontainer), no need to re-add
    // Re-add core app component references to store
    Store.add({
        name: 'appcontainer',
        component: appContainer
    });
    Store.add({
        name: 'svgdefs',
        component: svgDefs
    });
    Store.add({
        name: 'maincontainer',
        component: mainContainer
    });
    Store.add({
        name: 'sidebar',
        component: sidebar
    });

    // View container
    const viewContainer = ViewContainer({
        parent: mainContainer,
    });

    viewContainer.add();

    Store.add({
        name: 'viewcontainer',
        component: viewContainer
    });

    // Check route path
    const pathAndQuery = path.split('?');
    const pathParts = pathAndQuery[0].split('/');

    // Only select first path, remove any ? that might be passed in
    const route = Store.routes().find(item => item.path === pathParts[0]);

    if (!route) {
        // TODO: Reset history state?
        Route('404');

        return;
    }

    // Add tools
    if (route.type !== 'system' && Store.user().Roles.results.includes('Developer')) {
        const viewTools = ViewTools({
            route,
            parent: viewContainer
        });

        viewTools.add();

        Store.add({
            name: 'viewtools',
            component: viewTools
        });
    }

    // Route title
    let viewTitle;

    if (title !== false) {
        viewTitle = Title({
            title: route.title,
            parent: viewContainer,
            margin: '0px 0px 30px 0px'
        });

        viewTitle.add();
    }

    // Set browswer history state and window title
    History({
        url: `${location.href.split('#')[0]}${(path) ? `#${path}` : ''}`,
        title: `${App.get('title')}${(path) ? ` > ${route.title || pathParts.join(' > ')}` : ''}`
    });

    sidebar.selectNav(route.path);

    // Log route
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

    // Render selected route's go method
    route.go({
        title: viewTitle,
        route,
        parent: viewContainer,
        pathParts,
        props: queryStringToObject(path.split('?')[1]),
        scrollTop
    });

    /** Modified from {@link https://stackoverflow.com/a/61948784} */
    function queryStringToObject(queryString) {
        if (!queryString) {
            return {};
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

    // Set viewContainer Scroll Top
    // - maybe Views should always return a promise?
    // - or could just use a callback passed to the view
    if (scrollTop) {
        console.log(scrollTop);

        viewContainer.get().scrollTo({
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
        From, To, CC, Subject, Body
    } = param;

    if (!To.length) {
        console.log('No recipients');

        return;
    }

    if (App.isDev()) {
        return;
    }

    const requestDigest = await GetRequestDigest();
    const headers = {
        "Accept": "application/json;odata=verbose",
        "Content-type": "application/json; odata=verbose",
        "X-RequestDigest": requestDigest,
    };

    /** {@link https://docs.microsoft.com/en-us/previous-versions/office/sharepoint-csom/jj171404(v=office.15)} */
    const properties = {
        'properties': {
            __metadata: {
                type: 'SP.Utilities.EmailProperties'
            },
            From: From,
            To: {
                results: To
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

    const requestDigest = await GetRequestDigest({ web });
    const headers = {
        "Accept": "application/json;odata=verbose",
        "Content-type": "application/json; odata=verbose",
        "IF-MATCH": "*",
        "X-HTTP-Method": "PATCH",
        "X-RequestDigest": requestDigest,
    };

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
 *
 * @param {*} param
 */
export function SetLocal(key, value) {
    localStorage.setItem(`${App.get('name')}-${key}`, value);
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
            key, value
        } = item;

        sessionStorage.setItem(key, value);
    });
}

/**
 *
 * @param {*} param
 */
export function SetTheme() {
    const theme = App.get('theme');
    const userPreference = GetLocal('prefersColorScheme');

    // 1. Set user preference
    if (userPreference) {
        App.set('prefersColorScheme', userPreference);
    } 
    
    // 2. If user hasn't set a preference, set to OS preference
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        App.set('prefersColorScheme', 'light');
    } 
    
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        App.set('prefersColorScheme', 'dark');
    } 
    
    // 3. Default to light
    else {
        App.set('prefersColorScheme', 'light');
    }
    
    const colors = Themes.find(item => item.name === theme);
    const { primary, secondary, background, color, selectedRowOpacity, buttonBackgroundColor, borderColor } = colors[App.get('prefersColorScheme')];
    const hex = NameToHex(primary);
    const rgb = HexToRGB(hex);
    const hsl = HexToHSL(hex);
    const hsl5 = HSLDarker(hsl, 5);
    const hsl10 = HSLDarker(hsl, 10);
    const background_HSL = HexToHSL(background);
    const background_HSL_3 = HSLDarker(background_HSL, 3);
    const background_HSL_5 = HSLDarker(background_HSL, 5);
    const background_HSL_10 = HSLDarker(background_HSL, 10);

    // All Colors
    App.set('colors', colors);

    // Primary
    App.set('primaryColor', hex);
    App.set('primaryColorRGB', rgb);
    App.set('primaryColorHSL', hsl);

    // Secondary
    App.set('secondaryColor', secondary);

    // Backgrounds
    App.set('backgroundColor', background);
    App.set('buttonBackgroundColor', buttonBackgroundColor);

    // Border
    App.set('borderColor', borderColor);

    // Default color
    App.set('defaultColor', color);

    // Selected row opacity
    App.set('selectedRowOpacity', selectedRowOpacity);

    // Add new root style
    Style({
        name: 'root',
        locked: true,
        style: /*css*/ `
            /* Theme Colors */
            :root {
                --background: ${background};
                --background-HSL: hsl(${background_HSL});
                --background-HSL-3: hsl(${background_HSL_3});
                --background-HSL-5: hsl(${background_HSL_5});
                --background-HSL-10: hsl(${background_HSL_10});
                --borderColor: ${borderColor};
                --box-shadow: rgb(0 0 0 / ${App.get('prefersColorScheme') === 'dark' ? 40 : 10}%) 0px 0px 16px -2px;
                --buttonBackground: ${buttonBackgroundColor};
                --color: ${color};
                --inputBackground: ${App.get('prefersColorScheme') === 'dark' ? background : secondary};
                --primary: ${primary};
                --primaryHex: ${hex};
                --primaryHSL: hsl(${hsl});
                --primaryHSL-5: hsl(${hsl5});
                --primaryHSL-10: hsl(${hsl10});
                --primaryRGB: ${rgb};
                --primary6b: ${primary + '6b'};
                --primary19: ${primary + '19'}; 
                --primary20: ${primary + '20'};
                --scrollbar: ${App.get('prefersColorScheme') === 'dark' ? 'dimgray' : 'lightgray'};
                --secondary: ${secondary};
                --selectedRow: ${primary + (selectedRowOpacity || '10')};
                --sortShadow: rgb(0 0 0 / ${App.get('prefersColorScheme') === 'dark' ? 40 : 10}%) 0px 0px 32px 0px;
            }
        `
    });
}

/**
 *
 * @param {*} param
 * @returns
 */
export function Shimmer(component, options = {}) {
    const { backgroundColor } = options;
    const id = component.get().id;

    // TODO: Set animation time on viewport width
    // TODO: Set linear-gradient on viewport width
    Style({
        name: `shimmer-animation-${id}`,
        style: /*css*/ `
            #${id}.shimmer-${id} {
                position: relative;
                border-radius: 20px;
                ${backgroundColor ? `background-color: ${backgroundColor};` : ''}
            }

            #${id}.shimmer-${id}::after {
                border-radius: 0px;
                position: absolute;
                width: 100%;
                height: 100%;
                content: ' ';
                top: 0px;
                left: 0px;
                background: linear-gradient(to right, transparent 0%, var(--secondary) 20%, transparent 40%, transparent 100%);
                background-repeat: no-repeat;
                background-size: var(--shimmer-size-${id}) 100%;
                animation: shimmer 1200ms infinite linear;
            }
                
            @-webkit-keyframes shimmer {
                0% {
                    background-position: calc(var(--shimmer-size-${id}) * -1) 0;
                }
            
                100% {
                    background-position: var(--shimmer-size-${id}) 0;
                }
            }
        `
    });

    Style({
        name: `shimmer-variables-${id}`,
        style: /*css*/ `
            :root {
                --shimmer-size-${id}: ${component.get().offsetWidth}px;
            }
        `
    });

    // TODO: Keep track of all event listeners added to the window, remove on route changes
    // Window resize event
    window.addEventListener('resize', setShimmerSize);

    function setShimmerSize() {
        Style({
            name: `shimmer-variables-${id}`,
            style: /*css*/ `
                :root {
                    --shimmer-size-${id}: ${component.get().offsetWidth}px;
                }
            `
        });
    }

    component.get().classList.add(`shimmer-${id}`);

    return {
        off() {
            document.querySelector(`style[data-name='shimmer-animation-${id}']`)?.remove();
            document.querySelector(`style[data-name='shimmer-variables-${id}']`)?.remove();

            component.get()?.classList.remove(`shimmer-${id}`);

            window.removeEventListener('resize', setShimmerSize);
        }
    }
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
        name,
        theme,
    } = settings;

    // Set app settings
    App.settings(param);

    // Set theme
    SetTheme({ name, theme });

    // toTitleCase string method polyfil
    String.prototype.toTitleCase = function () {
        return this
            .toLowerCase()
            .split(' ')
            .map(word => word.replace(word[0], word[0]?.toUpperCase()))
            .join(' ');
    };

    // Split Camel Case
    String.prototype.splitCamelCase = function () {
        return this.split(/(?=[A-Z])/).join(' ');
    }

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
    };

    /** Log errors from Promises to SharePoint list */
    window.addEventListener("unhandledrejection", event => {
        LogError({
            Message: event.reason.message,
            Source: import.meta.url,
            Error: event.reason.stack
        });
    });

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
    };
}

/**
 * 
 * @param {*} param 
 */
export function Style(param) {
    const {
        name,
        locked,
        position,
        style
    } = param;

    const node = document.querySelector(`style[data-name='${name}']`);

    if (node) {
        const css = /*html*/ `
            <style type='text/css' data-name='${name || id}' data-type='style' data-locked='${locked ? 'yes' : 'no'}'>
                ${style}
            </style>
        `;

        node.insertAdjacentHTML('beforebegin', css);
        node.remove();
    } else {
        const css = /*html*/ `
            <style type='text/css' data-name='${name || id}' data-type='style' data-locked='${locked ? 'yes' : 'no'}'>
                ${style}
            </style>
        `;
        const head = document.querySelector('head');

        head.insertAdjacentHTML(position || 'beforeend', css);
    }
}

/**
 *
 * @param {*} param
 */
export function UpdateApp() {
    if (App.isDev()) {
        const modal = Modal({
            title: false,
            centered: true,
            showFooter: false,
            close: true,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');
                
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h4 class='mb-3'>Dev mode instructions</h4>
                `);
        
                const info = Alert({
                    type: 'robi-secondary',
                    text: /*html*/`
                        <code>npm run reset</code>
                    `,
                    parent: modalBody
                });
        
                info.add();
            }
        });

        modal.add();

        return;
    }

    const modal = Modal({
        title: false,
        disableBackdropClose: true,
        scrollable: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');

            Style({
                name: 'update-app',
                style: /*css*/ `
                    #${modal.get().id} .alert {
                        border-radius: 20px;
                    } 
                `
            });

            // Show loading
            const loadingSpinner = LoadingSpinner({
                type: 'robi',
                parent: modalBody
            });

            loadingSpinner.add();

            const {
                allLists,
                webLists,
                diffToDelete,
                toCreate,
                toDelete,
                schemaAdd,
                schemaDelete
            } = await CheckLists();

            // Remove loading
            loadingSpinner.remove();

            // Are there new lists in lists.js that need to be created?
            if (toCreate.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-robi-primary-high-contrast mb-4'>
                        <h4 class='mb-2'>Create lists</h4>
                        <div class='create-lists alert'>
                            ${toCreate
                            .sort((a, b) => a.list - b.list)
                            .map(item => {
                                return /*html*/ `
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}' checked>
                                        <label class="custom-control-label" for="checkbox-${item.list.split(' ').join('-')}">
                                            ${item.list}
                                        </label>
                                    </div>

                                    <!-- <div class="form-check ml-2">
                                        <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.list.split(' ').join('-')}" data-list='${item.list}' checked>
                                        <label class="form-check-label" for="checkbox-${item.list.split(' ').join('-')}">
                                            ${item.list}
                                        </label>
                                    </div> -->
                                `;
                            }).join('\n')}
                        </div>
                    </div>
                `);
            }

            // Choose columns to add
            if (schemaAdd.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-robi-primary-high-contrast mb-4'>    
                        <h4 class='mb-2'>Add new fields to installed lists</h4>
                        <div class='schema-add'>
                            ${schemaAdd
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            const { list, fields } = item;
                            return /*html*/ `
                                <div class='alert'>
                                    <h5 data-list='${list}'>${list}</h5>
                                    ${fields.map(field => {
                                        return /*html*/ `
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input" value="${field}" id="checkbox-${field}" data-list='${list}' checked>
                                                <label class="custom-control-label" for="checkbox-${field}">
                                                    ${field}
                                                </label>
                                            </div>

                                            <!-- <div class="form-check ml-2">
                                                <input class="form-check-input" type="checkbox" value="${field}" id="checkbox-${field}" data-list='${list}' checked>
                                                <label class="form-check-label" for="checkbox-${field}">
                                                    ${field}
                                                </label>
                                            </div> -->
                                        `;
                                    }).join('\n')}
                                </div>
                            `;
                        }).join('\n')}
                        </div>
                    </div>
                `);
            }

            // Have lists been removed from list.js that need to be removed?
            if (toDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-robi-secondary mb-4'>
                        <h4 class='mb-2'>Delete lists</h4>
                        <div class='delete-lists alert'>
                            ${diffToDelete
                            // .sort((a, b) => a.list - b.list)
                            .sort((a, b) => a - b)
                            .map(item => {
                                return /*html*/ `
                                    <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input" id="checkbox-${item.split(' ').join('-')}" data-list='${item}'>
                                        <label class="custom-control-label" for="checkbox-${item.split(' ').join('-')}">
                                            ${item}
                                        </label>
                                    </div>

                                    <!-- <div class="form-check ml-2">
                                        <input class="form-check-input" type="checkbox" value="" id="checkbox-${item.split(' ').join('-')}" data-list='${item}'>
                                        <label class="form-check-label" for="checkbox-${item.split(' ').join('-')}">
                                            ${item}
                                        </label>
                                    </div> -->
                                `;
                            }).join('\n')}
                        </div>
                    </div>
                `);
            }


            // Choose columns to delete (DESTRUCTIVE)
            if (schemaDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-robi-secondary mb-4'>
                        <h4 class='mb-2'>Delete fields from installed lists</h4>
                        <div class='schema-delete'>
                            ${schemaDelete
                        .sort((a, b) => a.list - b.list)
                        .map(item => {
                            const { list, fields } = item;
                            return /*html*/ `
                                <div class='alert'>
                                    <h5 data-list='${list}'>${list}</h5>
                                    ${fields.map(field => {
                                        return /*html*/ `
                                            <div class="custom-control custom-switch">
                                                <input type="checkbox" class="custom-control-input" value="${field}" id="checkbox-${field}" data-list='${list}'>
                                                <label class="custom-control-label" for="checkbox-${field}">
                                                    ${field}
                                                </label>
                                            </div>

                                            <!-- <div class="form-check ml-2">
                                                <input class="form-check-input" type="checkbox" value="${field}" id="checkbox-${field}" data-list='${list}'>
                                                <label class="form-check-label" for="checkbox-${field}">
                                                    ${field}
                                                </label>
                                            </div> -->
                                        `;
                                    }).join('\n')}
                                </div>
                            `;
                        }).join('\n')}
                        </div>
                    </div>
                `);
            }

            if (toCreate.length || toDelete.length || schemaAdd.length || schemaDelete.length) {
                const installBtn = BootstrapButton({
                    async action(event) {
                        // Get checked lists
                        const checkedCreate = [...modal.findAll('.create-lists input:checked')].map(node => allLists.find(item => item.list === node.dataset.list));
                        const checkedDelete = [...modal.findAll('.delete-lists input:checked')].map(node => webLists.find(item => item.Title === node.dataset.list));
                        const checkedSchemaAdd = [...modal.findAll('.schema-add input:checked')].map(node => {
                            const list = node.dataset.list;
                            const name = node.value;
                            const field = allLists.find(item => item.list === list).fields.find(item => item.name == name);

                            return {
                                list,
                                field
                            };
                        });
                        const checkedSchemaDelete = [...modal.findAll('.schema-delete input:checked')].map(node => {
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
                        let progressCount = checkedDelete.length + +checkedSchemaDelete.length;

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
                            background: 'var(--background)'
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

                            console.log(`Added Release Note: ${App.get('title')} lists created - ${checkedCreate.map(item => item.list).join(', ')}.`);

                            // Add to console
                            reinstallConsole.append(/*html*/ `
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code>'New ${App.get('title')} lists created - ${checkedCreate.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
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
                                ${checkedSchemaAdd.length || checkedDelete || checkedSchemaDelete.length ?
                                    /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''}
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
                                    <code style='color: var(--primary) !important;'>${spacers}</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: var(--primary) !important;'>| Columns created |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: var(--primary) !important;'>${spacers}</code>
                                </div>
                                ${checkedDelete.length || checkedSchemaDelete.length ?
                                    /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''}
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
                                const { Title } = item;

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
                                    <code>'${App.get('title')} lists deleted - ${checkedDelete.map(item => item.list).join(', ')}.' added to 'releaseNotes'</code>
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
                                    <code style='color: var(--primary) !important;'>=================</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: var(--primary) !important;'>| Lists deleted |</code>
                                </div>
                                <div class='console-line'>
                                    <!-- <code class='line-number'>0</code> -->
                                    <code style='color: var(--primary) !important;'>=================</code>
                                </div>
                                ${checkedSchemaDelete.length ?
                                /*html*/ `
                                        <div class='console-line'>
                                            <!-- <code class='line-number'>0</code> -->
                                            <code style='opacity: 0;'>Spacer</code>
                                        </div>
                                    ` :
                                    ''}
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

                        modal.find('.console-title').innerHTML = `${App.get('title')} <strong>updated</strong>`;

                        // Close modal button
                        const returnBtn = BootstrapButton({
                            type: 'robi',
                            value: 'Close',
                            classes: ['w-100', 'mt-2'],
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
                    type: 'robi-reverse',
                    value: `Update ${App.get('title')}`
                });

                installBtn.add();
            }

            if (!toCreate.length && !toDelete.length && !schemaAdd.length && !schemaDelete.length) {
                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <div class='alert alert-robi-primary-high-contrast'><strong>${App.get('title')}</strong> is up-to-date</div>
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
        list, field
    } = param;

    const {
        name, description, type, choices, fillIn, title, required, lookupList, lookupField, value
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
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
            "X-RequestDigest": requestDigest,
        }
    };

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
        list, itemId, select, expand, data, wait
    } = param;

    console.log(`List: ${list}, Item: ${itemId}, Data:`, data);

    // Exit if no data passed in
    if (Object.getOwnPropertyNames(data).length === 0) {
        return;
    }

    if (App.isProd()) {
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
        };

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
        };

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

        body.EditorId = body.EditorId || App.get('dev').user.SiteId;
        body.Editor = body.Editor || { Title: App.get('dev').user.Title, LoginName: App.get('dev').user.LoginName };

        const date = new Date().toUTCString();
        body.Modified = date;

        const options = {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        };

        const response = await fetch(`http://localhost:3000/${list}/${itemId}`, options);
        if (wait !== false) {
            await Wait(500);
        }

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
        file, name, data, library
    } = param;

    if (App.isProd()) {
        // Get new request digest
        const requestDigest = await GetRequestDigest();
        const fileBuffer = await getFileBuffer(file);
        const upload = await fetch(`${App.get('site')}/_api/web/folders/GetByUrl('${library}')/Files/add(overwrite=true,url='${name || file.name}')`, {
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
                select: `*,Author/Title,Editor/Title`,
                expand: `File,Author,Editor`,
                data
            };

            itemToReturn = await UpdateItem(updateItemParam);
        } else {
            itemToReturn = item;
        }

        return itemToReturn;
    } else if (App.isDev()) {
        let fakeFile = {
            File: {
                Name: file.name,
                Length: 0,
            },
            Name: file.name,
            OData__dlc_DocIdUrl: {
                Url: '#'
            }
        };

        const upload = {
            ...data,
            ...fakeFile
        };

        const newItem = await CreateItem({
            list: library,
            data: upload
        });

        return newItem;
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
export async function UploadFiles(param) {
    const {
        files, path
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
    const updatedItems = await Promise.all(responses.map(async (response) => {
        const data = await response.json();

        return GetByUri({
            uri: data.d.ListItemAllFields.__deferred.uri
        });
    }));

    return updatedItems;
}

/**
 * 
 * @param {*} ms 
 * @returns 
 */
export function Wait(ms) {
    console.log(`Waiting ${ms}ms`);
    
    return new Promise(resolve => setTimeout(resolve, ms));
}

let appSettings = {};
let appLists;

const App = {
    list(name) {
        return appLists.find(item => item.list === name);
    },
    lists() {
        return appLists;
    },
    settings(param) {
        const { lists, routes, settings } = param;
        const { library, defaultRoute } = settings;

        // Set lists
        appLists = lists;

        // Set mode
        if (location.href.includes('localhost') || location.href.includes('127.0.0.1')) {
            settings.mode = 'dev';
        } else {
            settings.mode = 'prod';
        }

        // Set library
        if (!library) {
            settings.library = 'App';
        }

        // Set site
        if (settings.mode === 'prod') {
            console.log('Site:', location.href.split(library || '/App/')[0]);
            console.log('App library:', settings.library);

            settings.site = location.href.split(library || '/App/')[0];
        } else {
            settings.site = 'http://localhost:8080/dev/app.html';
        }

        // Set default route
        if (!defaultRoute) {
            settings.defaultRoute = routes.filter(r => !r.hide).map(route => route.path)[0];
        }

        // Set all
        appSettings = settings;
    },
    get(prop) {
        return appSettings[prop];
    },
    isDev() {
        if (App.get('mode') === 'dev') {
            return true;
        } else {
            return false;
        }
    },
    isProd() {
        if (App.get('mode') == 'prod') {
            return true;
        } else {
            return false;
        }
    },
    set(prop, value) {
        appSettings[prop] = value;
        return appSettings[prop];
    }
}

Object.freeze(App);

export { App }

/**
 * 
 */
// TODO: Export function instead of array?
const Routes = [
    {
        path: '403',
        title: '403',
        type: 'system',
        hide: true,
        ignore: true,
        go(param) {
            Unauthorized(param);
        }
    },
    {
        path: '404',
        title: '404',
        type: 'system',
        hide: true,
        ignore: true,
        go(param) {
            Missing(param);
        }
    },
    {
        path: 'Questions',
        title: 'Questions',
        type: 'system',
        icon: 'bs-chat-right-text',
        go(param) {
            const {
                parent,
                pathParts,
                title,
            } = param;

            if (pathParts.length === 1) {
                QuestionTypes(param);
            } else if (pathParts.length === 2) {
                QuestionBoard({
                    parent,
                    path: pathParts[1],
                    title
                });
            } else if (pathParts.length === 3) {
                QuestionAndReplies({
                    parent,
                    path: pathParts[1],
                    itemId: parseInt(pathParts[2]),
                    title
                });
            }
        }
    },
    {
        path: 'Settings',
        title: 'Settings',
        type: 'system',
        icon: 'bs-gear',
        ignore: true,
        go(param) {
            Settings(param);
        }
    }
];

export { Routes }

const store = {
    elementIdCounter: 0,
    rowIdCounter: 0,
    cellIdCounter: 0,
    viewScrollTop: 0,
    data: {},
    abortControllers: [],
    workers: [],
    components: {},
    rows: {},
    models: {},
    lists: {},
    user: {},
    routes: []
};

const Store = {
    add(param) {
        const {
            type,
        } = param;

        switch (type) {
            case 'list':
                {
                    const {
                        list,
                        items
                    } = param;
        
                    store.lists[list] = items;
                    break;
                }
            case 'model':
                {
                    const {
                        name,
                        model
                    } = param;
        
                    store.models[name] = model;
                    break;
                }
            default:
                {
                    const {
                        name
                    } = param;
        
                    store.components[name] = param;
                    break;
                }
        }
    },
    addWorker(worker) {
        store.workers.push(worker);
    },
    terminateWorkers() {
        store.workers.forEach(worker => {
            worker.terminate();
        });
    },
    addAbortController(controller) {
        store.abortControllers.push(controller);
    },
    getAbortControllers() {
        return store.abortControllers;
    },
    abortAll() {
        store.abortControllers.forEach(controller => {
            controller.abort();
        });
    },
    get(name) {
        if (store.components[name]) {
            return store.components[name].component;
        } else if (store.lists[name]) {
            return store.lists[name];
        } else if(store.models[name]) {
            return store.models[name];
        } else {
            return undefined;
        }
    },
    getNextId() {
        return `component-${store.elementIdCounter++}`; 
    },
    getNextRow() {
        return `row-${store.rowIdCounter++}`;
    },
    getNextCell() {
        return `cell-${store.cellIdCounter++}`;
    },
    remove(name) {
        store.components[name].component.remove();
        
        delete store.components[name];
    },
    // register(actionData) {
    //     store.data.push(actionData);
    // },
    // deregister(actionData) {
    //     const index = store.data.indexOf(actionData);

    //     store.data.splice(index, 1);
    // },
    // recall() {
    //     return store.data;
    // },
    empty() {
        store.components = {};
        store.rows = {};
        // TODO: Do we want to persist data when routing?
        // store.data = [];
    },
    user(userInfo) {
        if (typeof userInfo === 'object') {
            store.user = userInfo;
        } else {
            return store.user;
        }
    },
    viewScrollTop(param) {
        if (param == 0) {
            store.viewScrollTop = 0;
        } else if (param) {
            if (typeof param === 'number') {
                store.viewScrollTop = param;
            } else {
                console.log(`${param} is not a number`);
            }
        } else {
            return store.viewScrollTop;
        }
    },
    removeData(name) {
        delete store.data[name];
    },
    setData(name, data) {
        store.data[name] = data;
    },
    getData(name) {
        return store.data[name];
    },
    setRoutes(routes) {
        store.routes = routes;
    },
    routes() {
        return store.routes;
    },
    // addRow({ id, component }) {
    //     store.rows[id] = component;
    // },
    // addCell({ rowId, id, component }) {
    //     store.rows[rowId][id] = component;
    // },
    // removeCell({ rowId, id }) {
    //     delete store.rows[rowId][id];
    // },
    // removeRow({ id }) {
    //     delete store.rows[id];
    // },
    // resetRows() {
    //     store.rows = {};
    // },
    // getRow(id) {
    //     return store.rows[id];
    // },
    // getCell({ rowId, id }) {
    //     return store.rows[rowId][id];
    // },
    // getRows() {
    //     return store.rows
    // }
}

Object.freeze(Store);

export { Store }

// TODO: Export array instead of function?
/**
 * @param {*} param
 * @returns
 */
export function Lists() {
    return [
        {
            list: 'Settings',
            fields: [
                {
                    name: "Key",
                    type: 'slot'
                },
                {
                    name: "Value",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'Searches',
            fields: [
                {
                    name: "List",
                    type: 'slot'
                },
                {
                    name: "Searches",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'Actions',
            fields: [
                {
                    name: "Action",
                    type: 'slot'
                },
                {
                    name: "FileNames",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'Comments',
            fields: [
                {
                    name: "FK_ParentId",
                    type: 'number'
                },
                {
                    name: "Comment",
                    type: 'mlot'
                },
                {
                    name: "SubmitedBy",
                    type: 'slot'
                },
                {
                    name: "LoginName",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Errors',
            fields: [
                {
                    name: "SessionId",
                    type: 'slot'
                },
                {
                    name: "Message",
                    type: 'mlot'
                },
                {
                    name: "Error",
                    type: 'mlot'
                },
                {
                    name: "Source",
                    type: 'mlot'
                },
                {
                    name: "UserAgent",
                    type: 'mlot'
                },
                {
                    name: "Status",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Log',
            fields: [
                {
                    name: "SessionId",
                    type: 'slot'
                },
                {
                    name: "Message",
                    type: 'mlot'
                },
                {
                    name: "StackTrace",
                    type: 'mlot'
                },
                {
                    name: "Module",
                    type: 'mlot'
                }
            ]
        },
        {
            list: 'ReleaseNotes',
            fields: [
                {
                    name: "Summary",
                    type: 'slot'
                },
                {
                    name: "Description",
                    type: 'mlot'
                },
                {
                    name: "Status",
                    type: 'slot'
                },
                {
                    name: "MajorVersion",
                    type: 'slot'
                },
                {
                    name: "MinorVersion",
                    type: 'slot'
                },
                {
                    name: "PatchVersion",
                    type: 'slot'
                },
                {
                    name: "ReleaseType",
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Roles',
            fields: [
                {
                    name: 'Title',
                    required: false,
                    value: 'View',
                    type: 'slot'
                },
                {
                    name: 'Role',
                    type: 'slot'
                }
            ],
            items: [
                {
                    Role: 'Administrator'
                },
                {
                    Role: 'Developer'
                },
                {
                    Role: 'User'
                }
            ]
        },
        {
            list: 'Questions',
            fields: [
                {
                    name: 'Body',
                    type: 'mlot'
                },
                {
                    name: 'ParentId',
                    type: 'number'
                },
                {
                    name: 'QuestionId',
                    type: 'number'
                },
                {
                    name: 'QuestionType',
                    type: 'slot'
                },
                {
                    name: 'Featured',
                    type: 'slot'
                }
            ]
        },
        {
            list: 'Users',
            fields: [
                {
                    name: 'Title',
                    display: 'Name',
                    required: false,
                    type: 'slot'
                },
                {
                    name: 'Email',
                    type: 'slot'
                },
                {
                    name: "LoginName",
                    display: 'Login Name',
                    type: 'slot'
                },
                {
                    name: "Roles",
                    type: 'multichoice',
                    choices: [
                        'Administrator',
                        'Developer',
                        'User'
                    ].concat(App.get('roles') || [])
                },
                {
                    name: "Settings",
                    type: 'mlot'
                }
            ],
            views: [
                {
                    name: 'Users',
                    fields: [
                        'Title',
                        'Email',
                        'LoginName',
                        'Roles'
                    ]
                }
            ]
        }
    ];
}

/**
 *
 * @param {*} param
 * @returns
 */

export function QuestionModel(param) {
    const {
        question, replies
    } = param;

    question.replies = replies || [];

    question.addReply = (reply) => {
        question.replies.push(reply);
    };

    return question;
}

/**
 *
 * @param {*} param
 * @returns
 */
export async function QuestionsModel(param) {
    const {
        filter
    } = param;

    /** Get Questions */
    const messages = await Get({
        list: 'Questions',
        filter,
        select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
        orderby: 'Id desc',
        expand: `Author/Id,Editor/Id`
    });

    /** Questions */
    const questions = messages.filter(question => question.ParentId === 0);

    /** Replies */
    const replies = messages.filter(question => question.ParentId !== 0);

    /** Model */
    const Model_Questions = questions.map(question => {
        // question.replies = replies.filter(reply => reply.QuestionId === question.Id);
        // return question;
        return QuestionModel({
            question,
            replies: replies.filter(reply => reply.QuestionId === question.Id)
        });
    });

    Store.add({
        type: 'model',
        name: 'Model_Questions',
        model: Model_Questions
    });

    return Model_Questions;
}

/**
 *
 * @param {*} param
 * @returns
 */
export function SiteUsageModel({ items, type, date }) {
    // console.log(type, date);

    switch (type) {
        case 'today':
            return buildToday();
        case 'week':
            return buildWeek();
        case 'month':
            return buildMonth();
        case 'year':
            return buildYear();
    }

    /** Chart - Today */
    function buildToday() {
        const itemsCreatedToday = items.filter(createdToday);

        function createdToday(item) {
            const created = new Date(item.Created);
            created.setHours(0, 0, 0, 0);
    
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            if (created.toDateString() == today.toDateString()) {
                return item;
            }
        }

        const today = [
            {
                label: 'Visits',
                data: []
            }
        ];
    
        for (let i = 0; i < 24; i++) {
            today[0].data.push(itemsCreatedToday.filter(byHour, i));
        }
    
        function byHour(item) {
            const created = new Date(item.Created);
    
            const hourBegin = new Date();
            hourBegin.setHours(this, 0, 0, 0);
    
            const hourEnd = new Date();
            hourEnd.setHours(this + 1, 0, 0, 0);
    
            if (created >= hourBegin && created < hourEnd) {
                return item;
            }
        }
        
        return today;
    }
   
    /** Chart - Week */
    function buildWeek() {
        const itemsCreatedThisWeek = items.filter(createdThisWeek);

        function createdThisWeek(item) {
            const created = new Date(item.Created);
            created.setHours(0, 0, 0, 0);
    
            // if (created >= monday) {
            if (created >= StartAndEndOfWeek().sunday) {
                return item;
            }
        }

        const week = [
            {
                label: 'Visits',
                data: [
                    itemsCreatedThisWeek.filter(byDayOfWeek, 0),
                    itemsCreatedThisWeek.filter(byDayOfWeek, 1),
                    itemsCreatedThisWeek.filter(byDayOfWeek, 2),
                    itemsCreatedThisWeek.filter(byDayOfWeek, 3),
                    itemsCreatedThisWeek.filter(byDayOfWeek, 4),
                    itemsCreatedThisWeek.filter(byDayOfWeek, 5),
                    itemsCreatedThisWeek.filter(byDayOfWeek, 6) /** Saturday */
                ]
            }
        ];
    
        function byDayOfWeek(item) {
            const created = new Date(item.Created);
            created.setHours(0, 0, 0, 0);
    
            const day = StartAndEndOfWeek().sunday;
            day.setDate(day.getDate() + this);
            day.setHours(0, 0, 0, 0);
    
            if (created.toDateString() === day.toDateString()) {
                return item;
            }
        }

        return week;
    }

    /** Chart - Month */
    function buildMonth() {
        const firstOfMonth = startOfMonth();

        function startOfMonth(date) {
            const now = date ? new Date(date) : new Date();
    
            now.setHours(0, 0, 0, 0);
            now.setDate(1);
    
            return now;
        }
    
        const itemsCreatedThisMonth = items.filter(createdThisMonth);
    
        function createdThisMonth(item) {
            const created = new Date(item.Created);
            created.setHours(0, 0, 0, 0);
    
            if (created >= firstOfMonth) {
                return item;
            }
        }
    
        const days = daysInMonth(new Date().getMonth() + 1); /** passed in month starts at 1 for Jan, not 0 */

        function daysInMonth(month) {
            const date = new Date();
    
            date.setMonth(month);
            date.setDate(0);
    
            return date.getDate();
        }
    
        const month = [
            {
                label: 'Visits',
                data: []
            }
        ];
    
        for (let i = 1; i <= days; i++) {
            month[0].data.push(itemsCreatedThisMonth.filter(byDate, i));
        }
    
        function byDate(item) {
            const created = new Date(item.Created);
            created.setHours(0, 0, 0, 0);
    
            const day = new Date();
            day.setDate(this);
            day.setHours(0, 0, 0, 0);
    
            if (created.toDateString() === day.toDateString()) {
                return item;
            }
        }

        return month;
    }

    /** Chart - Year */
    function buildYear() {
        const year = [
            {
                label: 'Visits',
                data: []
            }
        ];
    
        for (let i = 0; i <= 11; i++) {
            const date = new Date();
            const yyyy = date.getFullYear();
    
            const firstOfMonth = new Date(yyyy, i, 1);
            const lastOfMonth = new Date(yyyy, i + 1, 0);
    
            // console.log('Index:', i);
            // console.log('First:', firstOfMonth);
            // console.log('Last:', lastOfMonth);
            // console.log('------------------');
            year[0].data.push(items.filter(createdThisMonth));
    
            function createdThisMonth(item) {
                const created = new Date(item.Created);
                created.setHours(0, 0, 0, 0);
    
                if (created >= firstOfMonth && created <= lastOfMonth) {
                    return item;
                }
            }
        }
        
        return year();
    }
}

/**
 * @link https://stackoverflow.com/a/12793705
 *
 * Modified By
 * @author Stephen Matheis
 * @email stephen.a.matheis.ctr@mail.mil
 * @date 2020.11.16
 *
 * - Replaced 'var' with 'const'
 * - Changed return value to @Object from @Array
 */

export function StartAndEndOfWeek(date) {
    // set local variable
    const now = date ? new Date(date) : new Date();

    // set time to some convenient value
    now.setHours(0, 0, 0, 0);

    // // Get Monday
    // const monday = new Date(now);
    // // monday.setDate(monday.getDate() - monday.getDay() + 1);
    // monday.setDate(monday.getDate() - (6 - monday.getDay()));
    // // Get Sunday
    // const sunday = new Date(now);
    // // sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    // sunday.setDate(sunday.getDate() + monday.getDay());
    // Get Sunday
    const sunday = new Date(now);
    // monday.setDate(monday.getDate() - monday.getDay() + 1);
    sunday.setDate(sunday.getDate() - sunday.getDay());

    // Get Sunday
    const saturday = new Date(now);
    // sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    saturday.setDate(saturday.getDate() + (6 + saturday.getDay()));

    // Return object of date objects
    return {
        sunday,
        saturday
    };
}

const Themes = [
    { 
        name: 'Blue',
        light: {
            primary: '#167EFB',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#167EFB',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Brown',
        light: {
            primary: '#A52A2A',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#A52A2A',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Gray',
        light: {
            primary: '#708090',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#708090',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Green',
        light: {
            primary: '#2E8B57',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#2E8B57',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Gold',
        light: {
            primary: '#B8860B',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#B8860B',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Magenta',
        light: {
            primary: '#8B008B',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#8B008B',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Orange',
        light: {
            primary: '#FF8C00',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#FF8C00',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Pink',
        light: {
            primary: '#C71585',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#C71585',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Purple',
        light: {
            primary: '#6A5ACD',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 20,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#a580f5',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 20,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Red',
        light: {
            primary: '#e63e44',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#fd4a50',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Slate',
        light: {
            primary: '#2F4F4F',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#2F4F4F',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Teal',
        light: {
            primary: '#008080',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#008080',
            secondary: '#151515',
            background: '#1e1e1e',
            color: '#d4d4d4',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#242628',
            borderColor: '#343a4080'
        }
    },
    { 
        name: 'Navy',
        light: {
            primary: '#051D49',
            secondary: '#fff',
            background: '#F8F8FC',
            color: '#24292f',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#e9ecef',
            borderColor: '#d6d8db80'
        },
        dark: {
            primary: '#ffffff',
            secondary: '#0e1b34',
            background: '#051d49',
            color: '#ffffff',
            selectedRowOpacity: 10,
            buttonBackgroundColor: '#2d357d',
            borderColor: '#00000080'
        }
    }
]

export { Themes };

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function ActionTemplate({ name }) {
    return [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        `// Otherwise, changes made with GUI tools will not render properly.`,
        ``,
        `// @START-${name}`
        `/**`,
        ` * `,
        ` * @param {*} param `,
        ` * @returns `,
        ` */`,
        `export function ${name}(param) {`,
        `    `,
        `}`,
        `// @END-${name}`,
        ``
    ].join('\n');
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function ComponentTemplate({ name }) {
    return [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        `// Otherwise, changes made with GUI tools will not render properly.`,
        ``,
        `import { Component } from '../Robi.js'`,
        ``,
        `// @START-${name}`,
        `/**`,
        ` * `,
        ` * @param {Object} param - Object passed in as only argument to a Robi component`,
        ` * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. `,
        ` * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.`,
        ` * @returns {Object} - Robi component.`,
        ` */`,
        `export function ${name}(param) {`,
        `    const {`,
        `        parent,`,
        `        position`,
        `    } = param;`,
        ``,
        `    const component = Component({`,
        `        html: /*html*/ \``,
        `            <div class=''>`,
        ``,
        `            </div>`,
        `        \`,`,
        `        style: /*css*/ \``,
        `            #id {`,
        ``,
        `            }`,
        `        \`,`,
        `        parent,`,
        `        position,`,
        `        events: [`,
        `            {`,
        `                selector: '#id',`,
        `                event: 'click',`,
        `                listener(event) {`,
        `                    console.log(\`\${component.get().id} clicked\`);`,
        `                }`,
        `            }`,
        `        ],`,
        `        onAdd() {`,
        ``,
        `        }`,
        `    });`,
        ``,
        `    return component;`,
        `}`,
        `// @END-${name}`,
        ``
    ].join('\n');
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function EditFormTemplate({ list, fields }) {
    if (!list && !fields) {
        return;
    }

    console.log(fields);

    const fieldsToCreate = fields.filter(field => field.name !== 'Id');

    let template = [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.`,
        `// Otherwise, changes made from CLI and GUI tools won't work properly.`,
        ``,
        `import { UpdateItem, DeleteItem } from '../../Robi/Robi.js'`,
        `import { ${modules()} } from '../../Robi/RobiUI.js'`,
        ``,
        `// @START-${list}`,
        `export default async function EditForm({ item, fields, list, modal, parent }) {`,
        `    console.log(list, 'custom edit form');`,
        ``,
        `    // @START-Title`,
        `    modal.setTitle('Edit Item');`,
        `    // @END-Title`,
        ``,
        `    // @Start-Props`,
        `    const [`
    ];

    function modules() {
        return [... new Set([ 'Row' ].concat(fieldsToCreate.map(field => {
            const {type } = field;

            switch (type) {
                case 'slot':
                    return 'SingleLineTextField';
                case 'mlot':
                    return 'MultiLineTextField';
                case 'number':
                    return 'NumberField';
                case 'choice':
                    return 'ChoiceField';
                case 'multichoice':
                    return 'MultiChoiceField';
                case 'date':
                    return 'DateField';
            }
        })).sort())].join(', ');
    }

    template = template.concat(fieldsToCreate.map(field => `        ${field.name}_props,`));

    template = template.concat([
        `    ] = fields;`,
        `    // @END-Props`,
        ``,
        `    // @START-Fields`
    ]);

    template = template.concat(fieldsToCreate.map(field => `    let ${field.name}_field;`));

    template = template.concat([
        `    // @END-Fields`,
        ``,
        `    // @START-Rows`
    ]);

    fieldsToCreate.forEach((field, index) => {
        const { name, type } = field;

        let row = [
            `    Row(async (parent) => {`
        ];
        let component = [];

        switch (type) {
            case 'slot':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = SingleLineTextField({`,
                    `            label: display || name,`,
                    `            value: item[name],`,
                    `            fieldMargin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onFocusout() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'mlot':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = MultiLineTextField({`,
                    `            label: display || name,`,
                    `            value: item[name],`,
                    `            fieldMargin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onFocusout() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'number':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = NumberField({`,
                    `            label: display || name,`,
                    `            value: item[name],`,
                    `            fieldMargin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onFocusout() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'choice':
                component = [
                    `        const { name, display, value, choices, validate } = ${name}_props;`,
                    ``,
                    `        ${name}_field = ChoiceField({`,
                    `            label: display || name,`,
                    `            fieldMargin: '0px',`,
                    `            value: item[name],`,
                    `            options: choices.map(choice => {`,
                    `                return {`,
                    `                    label: choice`,
                    `                };`,
                    `            }),`,
                    `            parent,`,
                    `            action`,
                    `        });`,
                    ``,
                    `        function action() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'multichoice':
                component = [
                    `        const { name, display, choices, fillIn, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = MultiChoiceField({`,
                    `            label: display || name,`,
                    `            value: item[name]?.results,`,
                    `            fieldMargin: '0px',`,
                    `            choices,`,
                    `            fillIn,`,
                    `            parent,`,
                    `            validate: onValidate`,
                    `        });`,
                    ``,
                    `        function onValidate() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ]
                break;
            case 'date':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = DateField({`,
                    `            label: display || name,`,
                    `            value: item[name],`,
                    `            margin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onValidate() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
        }

        row = row.concat(component);
        row = row.concat([
            `    }, { parent });`,
        ]);

        if (index !== fieldsToCreate.length - 1) {
            row.push(`    // @Row`);
        }

        template = template.concat(row);
    });

    template = template.concat([
        `    // @END-Rows`,
        ``,
        `    // @START-Return`,
        `    return {`,
        `        async onUpdate(event) {`,
        `            let isValid = true;`,
        ``,
        `            const data = {};`,
        ``
    ]);

    fieldsToCreate?.forEach(field => {
        template = template.concat([
            setFieldValue(field),
            ``
        ]);
    });

    function setFieldValue(field) {
        const { type, name } = field;

        switch (type) {
            case 'slot':
            case 'mlot':
            case 'choice':
            case 'date':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = ${name}_props.validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = ${name}_field.value();`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = ${name}_field.value();`,
                    `            }`,
                ].join('\n');
            case 'multichoice':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = ${name}_props.validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = {`,
                    `                        results: ${name}_field.value()`,
                    `                    }`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = {`,
                    `                    results: ${name}_field.value()`,
                    `                }`,
                    `            }`,
                ].join('\n');
            case 'number':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = ${name}_props.validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = ${name}_field.value();`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = parseInt(${name}_field.value());`,
                    `            }`,
                ].join('\n');
        }
    }

    template = template.concat([
        `            console.log(isValid, data);`,
        ``,
        `            if (!isValid) {`,
        `                return false;`,
        `            }`,
        ``,
        `            const updatedItem = await UpdateItem({`,
        `                list,`,
        `                itemId: item.Id,`,
        `                data`,
        `            });`,
        ``,
        `            return updatedItem;`,
        `        },`,
        `        async onDelete(event) {`,
        `            const deletedItem = await DeleteItem({`,
        `                list,`,
        `                itemId: item.Id`,
        `            });`,
        ``,
        `            return deletedItem;`,
        `        },`,
        `        label: 'Update'`,
        `    };`,
        `    // @END-Return`,
        `}`,
        `// @END-${list}`,
        ``
    ]).join('\n');

    return template;

    // if (!list && !fields) {
    //     return;
    // }

    // console.log(fields);

    // const fieldsToCreate = fields.filter(field => field.name !== 'Id');

    // let template = [
    //     `// This file can be edited programmatically.`,
    //     `// If you know the API, feel free to make changes by hand.`,
    //     `// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.`,
    //     `// Otherwise, changes made from CLI and GUI tools won't work properly.`,
    //     ``,
    //     `import { UpdateItem, DeleteItem } from '../../Robi/Robi.js'`,
    //     `import { ${modules()} } from '../../Robi/RobiUI.js'`,
    //     ``,
    //     `// @START-${list}`,
    //     `export default async function EditForm({ event, fields, item, list, modal, parent, table }) {`,
    //     `    console.log(list, 'custom edit form');`,
    //     ``,
    //     `    // @START-Title`,
    //     `    modal.setTitle('Edit Item');`,
    //     `    // @END-Title`,
    //     ``,
    //     `    // @Start-Props`,
    //     `    const [`
    // ];

    // function modules() {
    //     return [ 'Row' ].concat(fieldsToCreate.map(field => {
    //         const {type } = field;

    //         switch (type) {
    //             case 'slot':
    //                 return 'SingleLineTextField';
    //             case 'mlot':
    //                 return 'MultiLineTextField';
    //             case 'number':
    //                 return 'NumberField';
    //             case 'choice':
    //                 return 'ChoiceField';
    //             case 'multichoice':
    //                 return 'MultiChoiceField';
    //             case 'date':
    //                 return 'DateField';
    //         }
    //     })).sort().join(', ');
    // }

    // template = template.concat(fieldsToCreate.map(field => `        ${field.name}_props,`));

    // template = template.concat([
    //     `    ] = fields;`,
    //     `    // @END-Props`,
    //     ``,
    //     `    // @START-Fields`
    // ]);

    // template = template.concat(fieldsToCreate.map(field => `    let ${field.name}_field;`));

    // template = template.concat([
    //     `    // @END-Fields`,
    //     ``,
    //     `    // @START-Rows`
    // ]);

    // fieldsToCreate?.forEach((field, index) => {
    //     const { name, display, type, choices, action, value } = field;

    //     let row = [
    //         `    Row(async (parent) => {`
    //     ];
    //     let component = [];

    //     switch (type) {
    //         case 'slot':
    //             component = [
    //                 `        const { name, display } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = SingleLineTextField({`,
    //                 `            label: display || name,`,
    //                 `            fieldMargin: '0px',`,
    //                 `            value: item[name],`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ];
    //             break;
    //         case 'mlot':
    //             component = [
    //                 `        const { name, display } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = MultiLineTextField({`,
    //                 `            label: display || name,`,
    //                 `            fieldMargin: '0px',`,
    //                 `            value: item[name],`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ];
    //             break;
    //         case 'number':
    //             component = [
    //                 `        const { name, display } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = NumberField({`,
    //                 `            label: display || name,`,
    //                 `            fieldMargin: '0px',`,
    //                 `            value: item[name],`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ];
    //             break;
    //         case 'choice':
    //             component = [
    //                 `        const { name, display, value, choices } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = ChoiceField({`,
    //                 `            label: display || name,`,
    //                 `            fieldMargin: '0px',`,
    //                 `            value: item[name],`,
    //                 `            options: choices.map(choice => {`,
    //                 `                return {`,
    //                 `                    label: choice`,
    //                 `                };`,
    //                 `            }),`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ];
    //             break;
    //         case 'multichoice':
    //             component = [
    //                 `        const { name, display, choices, fillIn } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = MultiChoiceField({`,
    //                 `            label: display || name,`,
    //                 `            fieldMargin: '0px',`,
    //                 `            choices,`,
    //                 `            fillIn,`,
    //                 `            value: item[name],`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ]
    //             break;
    //         case 'date':
    //             component = [
    //                 `        const { name, display } = ${name}_props`,
    //                 ``,
    //                 `        ${name}_field = DateField({`,
    //                 `            label: display || name,`,
    //                 `            margin: '0px',`,
    //                 `            value: item[name]`,
    //                 `            parent`,
    //                 `        });`,
    //                 ``,
    //                 `        ${name}_field.add();`
    //             ];
    //             break;
    //     }

    //     row = row.concat(component);
    //     row = row.concat([
    //         `    }, { parent });`,
    //     ]);

    //     if (index !== fieldsToCreate.length - 1) {
    //         row.push(`    // @Row`);
    //     }

    //     template = template.concat(row);
    // });

    // template = template.concat([
    //     `    // @END-Rows`,
    //     ``,
    //     `    // @START-Return`,
    //     `    return {`,
    //     `        async onUpdate(event) {`,
    //     `            const data = {};`,
    //     ``
    // ]);

    // fieldsToCreate?.forEach(field => {
    //     const { name } = field;
    //     template = template.concat([
    //         `            if (${name}_field.value()) {`,
    //         `                data.${name} = ${name}_field.value();`,
    //         `            }`,
    //         ``,
    //     ])
    // });

    // template = template.concat([
    //     `            console.log(data);`,
    //     ``,
    //     `            const updatedItem = await UpdateItem({`,
    //     `                list,`,
    //     `                itemId: item.Id,`,
    //     `                data`,
    //     `            });`,
    //     ``,
    //     `            return updatedItem;`,
    //     `        },`,
    //     `        async onDelete(event) {`,
    //     `            const deletedItem = await DeleteItem({`,
    //     `                list,`,
    //     `                itemId: item.Id`,
    //     `            });`,
    //     ``,
    //     `            return deletedItem;`,
    //     `        },`,
    //     `        label: 'Update'`,
    //     `    };`,
    //     `    // @END-Return`,
    //     `}`,
    //     `// @END-${list}`,
    //     ``
    // ]).join('\n');

    // return template;
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function ModelTemplate({ name }) {
    return [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START and @END sigils in the right places.`,
        `// Otherwise, changes made with GUI tools will not render properly.`,
        ``,
        `// @START-${name}`
        `/**`,
        ` * `,
        ` * @param {*} param `,
        ` * @returns `,
        ` */`,
        `export function ${name}(param) {`,
        `    `,
        `}`,
        `// @END-${name}`,
        ``
    ].join('\n');
}

/**
 * 
 * @param {*} param
 * @returns 
 */
export function NewFormTemplate({ list, fields }) {
    if (!list && !fields) {
        return;
    }

    console.log(fields);

    const fieldsToCreate = fields.filter(field => field.name !== 'Id');

    let template = [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.`,
        `// Otherwise, changes made from CLI and GUI tools won't work properly.`,
        ``,
        `import { CreateItem } from '../../Robi/Robi.js'`,
        `import { ${modules()} } from '../../Robi/RobiUI.js'`,
        ``,
        `// @START-${list}`,
        `export default async function NewForm({ fields, list, modal, parent }) {`,
        `    console.log(list, 'custom new form');`,
        ``,
        `    // @START-Title`,
        `    modal.setTitle('New Item');`,
        `    // @END-Title`,
        ``,
        `    // @Start-Props`,
        `    const [`
    ];

    function modules() {
        return [... new Set([ 'Row' ].concat(fieldsToCreate.map(field => {
            const {type } = field;

            switch (type) {
                case 'slot':
                    return 'SingleLineTextField';
                case 'mlot':
                    return 'MultiLineTextField';
                case 'number':
                    return 'NumberField';
                case 'choice':
                    return 'ChoiceField';
                case 'multichoice':
                    return 'MultiChoiceField';
                case 'date':
                    return 'DateField';
            }
        })).sort())].join(', ');
    }

    template = template.concat(fieldsToCreate.map(field => `        ${field.name}_props,`));

    template = template.concat([
        `    ] = fields;`,
        `    // @END-Props`,
        ``,
        `    // @START-Fields`
    ]);

    template = template.concat(fieldsToCreate.map(field => `    let ${field.name}_field;`));

    template = template.concat([
        `    // @END-Fields`,
        ``,
        `    // @START-Rows`
    ]);

    fieldsToCreate.forEach((field, index) => {
        const { name, type } = field;

        let row = [
            `    Row(async (parent) => {`
        ];
        let component = [];

        switch (type) {
            case 'slot':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = SingleLineTextField({`,
                    `            label: display || name,`,
                    `            value,`,
                    `            fieldMargin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onFocusout() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'mlot':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = MultiLineTextField({`,
                    `            label: display || name,`,
                    `            value,`,
                    `            fieldMargin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onFocusout() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'number':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = NumberField({`,
                    `            label: display || name,`,
                    `            value,`,
                    `            fieldMargin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onFocusout() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'choice':
                component = [
                    `        const { name, display, value, choices, validate } = ${name}_props;`,
                    ``,
                    `        ${name}_field = ChoiceField({`,
                    `            label: display || name,`,
                    `            fieldMargin: '0px',`,
                    `            value,`,
                    `            options: choices.map(choice => {`,
                    `                return {`,
                    `                    label: choice`,
                    `                };`,
                    `            }),`,
                    `            parent,`,
                    `            action`,
                    `        });`,
                    ``,
                    `        function action() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
            case 'multichoice':
                component = [
                    `        const { name, display, choices, fillIn, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = MultiChoiceField({`,
                    `            label: display || name,`,
                    `            value,`,
                    `            fieldMargin: '0px',`,
                    `            choices,`,
                    `            fillIn,`,
                    `            parent,`,
                    `            validate: onValidate`,
                    `        });`,
                    ``,
                    `        function onValidate() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ]
                break;
            case 'date':
                component = [
                    `        const { name, display, validate, value } = ${name}_props;`,
                    ``,
                    `        ${name}_field = DateField({`,
                    `            label: display || name,`,
                    `            value,`,
                    `            margin: '0px',`,
                    `            parent,`,
                    `            onFocusout`,
                    `        });`,
                    ``,
                    `        function onValidate() {`,
                    `            return !validate ? undefined : (() => {`,
                    `                const value = ${name}_field.value();`,
                    ``,
                    `                console.log('validate');`,
                    ``,
                    `                if (validate(value)) {`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            })();`,
                    `        }`,
                    ``,
                    `        ${name}_field.add();`
                ];
                break;
        }

        row = row.concat(component);
        row = row.concat([
            `    }, { parent });`,
        ]);

        if (index !== fieldsToCreate.length - 1) {
            row.push(`    // @Row`);
        }

        template = template.concat(row);
    });

    template = template.concat([
        `    // @END-Rows`,
        ``,
        `    // @START-Return`,
        `    return {`,
        `        async onCreate(event) {`,
        `            let isValid = true;`,
        ``,
        `            const data = {};`,
        ``
    ]);

    fieldsToCreate?.forEach(field => {
        template = template.concat([
            setFieldValue(field),
            ``
        ]);
    });

    function setFieldValue(field) {
        const { type, name } = field;

        switch (type) {
            case 'slot':
            case 'mlot':
            case 'choice':
            case 'date':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = ${name}_props.validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = ${name}_field.value();`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = ${name}_field.value();`,
                    `            }`,
                ].join('\n');
            case 'multichoice':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = ${name}_props.validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = {`,
                    `                        results: ${name}_field.value()`,
                    `                    }`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = {`,
                    `                    results: ${name}_field.value()`,
                    `                }`,
                    `            }`,
                ].join('\n');
            case 'number':
                return [
                    `            if (${name}_props.validate) {`,
                    `                const isValidated = ${name}_props.validate(${name}_field.value());`,
                    `            `,
                    `                if (isValidated) {`,
                    `                    data.${name} = ${name}_field.value();`,
                    `                    ${name}_field.isValid(true);`,
                    `                } else {`,
                    `                    isValid = false;`,
                    `                    ${name}_field.isValid(false);`,
                    `                }`,
                    `            } else if (value) {`,
                    `                data.${name} = parseInt(${name}_field.value());`,
                    `            }`,
                ].join('\n');
        }
    }

    template = template.concat([
        `            console.log(isValid, data);`,
        ``,
        `            if (!isValid) {`,
        `                return false;`,
        `            }`,
        ``,
        `            const newItem = await CreateItem({`,
        `                list,`,
        `                data`,
        `            });`,
        ``,
        `            return newItem;`,
        `        },`,
        `        label: 'Create'`,
        `    };`,
        `    // @END-Return`,
        `}`,
        `// @END-${list}`,
        ``
    ]).join('\n');

    return template;
}

/**
 * 
 * @param {*} param0 
 * @returns 
 */
export function RouteTemplate({ name }) {
    return [
        `// This file can be edited programmatically.`,
        `// If you know the API, feel free to make changes by hand.`,
        `// Just be sure to put @START, @END, and @[Spacer Name] sigils in the right places.`,
        `// Otherwise, changes made from CLI and GUI tools won't work properly.`,
        ``,
        `import { } from '../../Robi/Robi.js'`,
        `import { Row } from '../../Robi/RobiUI.js'`,
        ``,
        `// @START-${name}`,
        `export default async function ${name}({ parent }) {`,
        `    // @START-Rows`,
        `    Row((parent) => {`,
        `    `,
        `    });`,
        `    // @END-Rows`,
        `}`,
        `// @END-${name}`,
        ``
    ].join('\n');
}
