import { Title, Modal, ModalSlideUp, BootstrapButton, SingleLineTextField, BootstrapTextarea, ProgressBar, InstallConsole, Container, LoadingSpinner, MainContainer, Alert } from '../../Robi/RobiUI.js'
import { App, Store, CreateSite, CreateLibrary, GetRequestDigest, GetItemCount, CopyRecurse, SetHomePage, Wait } from '../../Robi/Robi.js'

/**
 * 
 * @param {*} param 
 */
export default async function Test(param) {
    const { parent } = param;

    // View title
    const viewTitle = Title({
        title: `Test`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    // TODO: Get user role
    // TODO: Add My Measures, based on role
    
    const info = Alert({
        margin: '20px 0px',
        type: 'robi-primary',
        text: '<strong>My Dashboard</strong> coming soon. Please stay tuned!',
        parent
    });

    info.add();

    const shrinkApp = BootstrapButton({
        value: 'Shrink app',
        classes: ['mr-3'],
        type: 'robi',
        parent,
        async action(event) {
            ModifyFileSlideUp({
                path: 'App/src',
                file: 'lists.js'
            });

            setTimeout(() => {
                document.querySelector('#app').style.background = 'black';
                Store.get('sidebar').get().style.borderRadius = '20px 0px 0px 20px';
                Store.get('maincontainer').get().style.borderRadius = '0px 20px 0px 0px';
                Store.get('appcontainer').get().style.borderRadius = '20px';
                Store.get('appcontainer').get().classList.add('shrink-app');
            }, 0);
        }
    });

    shrinkApp.add();

    function ModifyFileSlideUp(param) {
        const { path, file } = param;
    
        const modal = ModalSlideUp({
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
            scrollable: false,
            background: '#292D3E',
            centered: true,
            showFooter: false,
            async addContent(modalBody) {
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
                    extraKeys: { "Ctrl-Q": function (cm) { cm.foldCode(cm.getCursor()); } },
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
                        disabled: true,
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

                // FIXME: pass in close callback behavior
                // TODO: Reverse animation on close
                $(modal.get()).on('hide.bs.modal', event => {
                    document.querySelector('#app').style.background = 'white';
                    Store.get('sidebar').get().style.borderRadius = '0px';
                    Store.get('maincontainer').get().style.borderRadius = '0px';
                    Store.get('appcontainer').get().style.borderRadius = '00px';
                    Store.get('appcontainer').get().classList.remove('shrink-app');
                });
    
                $(modal.get()).on('hide.bs.modal', checkIfSaved);
    
                function checkIfSaved(event) {
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

    const parseRoutes = BootstrapButton({
        value: 'Parse routes',
        classes: ['mr-3'],
        type: 'robi',
        parent,
        async action(event) {
            // const routes = app.match(/routes:([\s\S]*?)settings:/);

            // console.log(routes);

            // console.log('One: ', routes[0]);
            // console.log('Two: ', routes[1]);

            // console.log(looseJsonParse(
            //     routes[1]
            // ));

            // REPLACE
            // routes = routes.replace(/routes:([\s\S]*?)settings:/, `routes:['test'],settings`);
            // console.log(routes);
            let digest;
            let request;

            if (App.get('mode') === 'prod') {
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
            let value = await request.text();

            const routes = value.match(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/);
            const ordered = routes[1].split(', // @ROUTE');

            // console.log('App.js:', value);
            // console.log('Routes:', routes[0]);

            const newOrder = [
                'Measures',
                'Test',
                'Home'
            ];

            const newRoutes = newOrder.map(path => {
                const route = ordered.find(item => item.includes(`// @START-${path}`));
                // console.log(`Path: // @START-${path} -> Route: ${route}`);

                return route;
            }).join(', // @ROUTE');

            console.log(newRoutes);

            const updated = value.replace(/\/\/ @START-ROUTES([\s\S]*?)\/\/ @END-ROUTES/, `// @START-ROUTES${newRoutes}// @END-ROUTES`);

            console.log('OLD\n----------------------------------------\n', value);
            console.log('\n****************************************');
            console.log('NEW\n----------------------------------------\n', updated);
            console.log('\n****************************************');

            let setFile;

            if (App.get('mode') === 'prod') {
                // TODO: Make a copy of app.js first
                // TODO: If error occurs on load, copy ${file}-backup.js to ${file}.js
                setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='app.js',overwrite=true)`, {
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

            console.log('Saved:', setFile);
        }
    });

    parseRoutes.add();

    const openVSCodeBtn = BootstrapButton({
        value: 'VS Code',
        classes: [''],
        type: 'robi',
        parent,
        async action(event) {
            open(`vscode:${App.get('site')}/${App.get('library')}/src`);
        }
    });

    openVSCodeBtn.add();

    const createSiteBtn = BootstrapButton({
        value: 'Create app',
        classes: ['ml-3'],
        type: 'robi-success',
        parent,
        async action(event) {
            const modal = Modal({
                title: false,
                disableBackdropClose: true,
                scrollable: true,
                async addContent(modalBody) {
                    modalBody.classList.add('install-modal');

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <h3 class='mb-2'>Create app</h3>
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

                    const installBtn = BootstrapButton({
                        action: createNewSite,
                        classes: ['w-100 mt-5'],
                        width: '100%',
                        parent: modalBody,
                        type: 'primary',
                        value: 'Create app'
                    });

                    installBtn.add();

                    modal.get().addEventListener('keypress', event => {
                        if (event.ctrlKey && event.code === 'Enter') {
                            event.preventDefault();

                            createNewSite(event);
                        }
                    });

                    async function createNewSite(event) {
                        const title = siteTitle.value();
                        const url = siteUrl.value();
                        const name = appName.value();
                        const description = siteDesc.value();

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
                            <h3 class='console-title mb-0'>Creating app <strong>${name}</strong></h3>
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
                            appTitle: title
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

                        let spacers = '===========';

                        for (let i = 0; i < title.length; i++) {
                            spacers = spacers + '=';
                        }
                        
                        // 3. Add to console
                        installConsole.append(/*html*/ `
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='color: mediumseagreen !important;'>${spacers}</code>
                            </div>
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='color: mediumseagreen !important;'>| '${name}' created |</code>
                            </div>
                            <div class='console-line'>
                                <!-- <code class='line-number'>0</code> -->
                                <code style='color: mediumseagreen !important;'>${spacers}</code>
                            </div>
                        `);

                        // Scroll console to bottom
                        installConsole.get().scrollTop = installConsole.get().scrollHeight;

                        // 5. Init app
                        // TODO: init app automatically
                        // TODO: set home page after app copied
                        modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                            <div class='mt-4'>New site <strong>${title}</strong> created at <a href='${App.get('site')}/${url}' target='_blank'>${App.get('site')}/${url}</a>.</div>
                            <div class='mb-4'>
                                <!-- Select <span style='padding: 2px 4px; border-raidus: 6px; background: royalblue; color: white;'>Install App</span> to create a new starter Robi app at the site above. You can <span style='padding: 2px 4px; border-raidus: 6px; border: solid 1px royalblue; color: royalblue;'>modify the source</span> before installing, or close and install later. -->
                                Select <span style='color: royalblue: font-weight: 500'>Install App</span> to create a new Robi project at the site above. You can <span style='color: royalblue: font-weight: 500'>Modify Source</span> before installing, or <span  style='font-weight: 500'>Close</span> and install later.
                            </div>
                        `);

                        // Update title
                        modal.find('.console-title').innerHTML = `${modal.find('.console-title').innerHTML.replace('Creating', 'Created')}`

                        // Show launch button
                        const installAppBtn = BootstrapButton({
                            type: 'robi-reverse',
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
                            type: 'robi',
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
    });

    createSiteBtn.add();
}