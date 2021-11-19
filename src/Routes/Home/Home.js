import { AddStyle, CreateSite, CopyFile, CreateLibrary, CreateFolder, GetRequestDigest, GetItemCount, CopyRecurse, SetHomePage, DeleteColumn } from '../../Core/Actions.js'
import { Title, Modal, BootstrapButton, SingleLineTextField, BootstrapTextarea, ProgressBar, InstallConsole, Container, LoadingSpinner, MainContainer } from '../../Core/Components.js'
import { Lists } from '../../Core/Models.js'
import { App } from '../../Core/Settings.js'
import Store from '../../Core/Store.js'
import { Table } from '../../Core/ViewParts.js'
import lists from '../../lists.js'

export default async function Home() {
    // View parent
    const parent = Store.get('maincontainer');

    // View title
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Home`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const testTable = await Table({
        list: 'Test',
        parent
    });

    const codeMirrorBtn = BootstrapButton({
        value: 'Code Mirror',
        classes: ['mt-3', 'mr-3'],
        type: 'primary',
        parent,
        async action(event) {
            const modal = Modal({
                title: false,
                // disableBackdropClose: true,
                background: '#292D3E',
                async addContent(modalBody) {
                    const loading = LoadingSpinner({
                        message: `Loading <span style='font-weight: 300;'>/App/src/Lists.js</span>`,
                        classes: ['mt-3', 'mb-3', 'loading-file'],
                        parent: modalBody
                    });

                    loading.add();

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <div class='file-title d-none'>
                            <span class='file-title-text d-flex'>
                                <span class='file-icon-container'>
                                    <svg class='icon file-icon file-icon-js'>
                                        <use href='#icon-javascript'></use>
                                    </svg>
                                </span>
                                <span>
                                    /App/src/Lists.js
                                </span>
                            </span>
                        </div>
                        <textarea class='code-mirror-container robi-code-background'></textarea>
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
                            console.log('save file');
                            // Save file
                            await saveFile();

                            // Add changed
                            modalBody.querySelector('.file-title-text').insertAdjacentHTML('beforeend', /*html*/ `
                                <div style='margin-left: 10px; color: seagreen'>CHANGED (will reload on close)</div>
                            `);

                            // Set flag
                            shouldReload = true;

                        },
                        'Ctrl-Q'(cm) {
                            console.log('close file, check if saved');
                        }
                    });

                    const sourceSiteUrl = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('lists.js')/$value`;
                    const srcRequestDigest = await GetRequestDigest();
                    const getFileValue = await fetch(sourceSiteUrl, {
                        method: 'GET',
                        headers: {
                            'binaryStringRequestBody': 'true',
                            'Accept': 'application/json;odata=verbose;charset=utf-8',
                            'X-RequestDigest': srcRequestDigest
                        }
                    });
                
                    // This will be overridden on save
                    let value = await getFileValue.text();

                    editor.setSize('auto', 'auto');
                    editor.setOption('viewportMargin', Infinity);
                    editor.setOption('theme', 'material-palenight');
                    editor.getDoc().setValue(value);

                    // Watch for changes
                    editor.on('change', event => {
                        if (value === editor.doc.getValue()) {
                            console.log('unchanged');

                            const dot = modal.find('.changed-dot');

                            if (dot) {
                                dot.remove();
                            }

                            modifyBtn.get().disabled = true;
                        } else {
                            console.log('changed');

                            const dot = modal.find('.changed-dot');

                            // #dee2e6

                            if (!dot) {
                                modalBody.querySelector('.file-title').insertAdjacentHTML('beforeend', /*html*/ `
                                    <div class='changed-dot' style='width: 10px; height: 10px; background: white; border-radius: 50%; margin-right: .75rem;'></div>
                                `);
                            }

                            modifyBtn.get().disabled = false;
                        }
                    });

                    // Remove loading message
                    loading.remove();

                    // Remove .modal-body top padding
                    modalBody.style.paddingTop = '0px';

                    // Show title
                    modal.find('.file-title').classList.remove('d-none');

                    const modifyBtn = BootstrapButton({
                        async action(event) {
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
                        classes: ['w-100', 'mt-4'],
                        disabled: true, // enable if changed
                        width: '100%',
                        parent: modalBody,
                        type: 'success',
                        value: 'Save and close'
                    });

                    modifyBtn.add();

                    async function saveFile(event) {
                        if (event) {
                            // Disable button - Prevent user from clicking this item more than once
                            $(event.target)
                                .attr('disabled', '')
                                .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving');
                        }

                        const currentValue = editor.getDoc().getValue();

                        console.log(currentValue);

                        // TODO: Move to SetFile action
                        const setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='lists.js',overwrite=true)`, {
                            method: 'POST',
                            body: currentValue, 
                            headers: {
                                'binaryStringRequestBody': 'true',
                                'Accept': 'application/json;odata=verbose;charset=utf-8',
                                'X-RequestDigest': srcRequestDigest
                            }
                        });

                        if (setFile) {
                            const dot = modal.find('.changed-dot');

                            if (dot) {
                                dot.remove();
                            }

                            value = currentValue;
                            
                            return setFile;
                        }
                    }

                    const cancelBtn = BootstrapButton({
                        action(event) {
                            modal.close();
                        },
                        classes: ['w-100 mt-2'],
                        width: '100%',
                        parent: modalBody,
                        type: 'light',
                        value: 'Close'
                    });

                    cancelBtn.add();

                    $(modal.get()).on('hide.bs.modal', checkIfSaved);

                    function checkIfSaved(event) {
                        console.log('check if saved');
        
                        if (value === editor.doc.getValue()) {
                            console.log('unchanged');

                            if (shouldReload) {
                                $(modal.get()).on('hidden.bs.modal', event => {
                                    location.reload(true);
                                });
                            }
        
                            return true;
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
                },
                centered: true,
                showFooter: false
            });

            modal.add();            
        }
    });

    codeMirrorBtn.add();

    const copyFileBtn = BootstrapButton({
        value: 'Copy file',
        classes: ['mt-3', 'mr-3'],
        type: 'success',
        parent,
        async action(event) {
            CopyFile({
               source: `${App.get('site')}`, 
               target: `${App.get('site')}/test-with-alec`,
               path: 'App/src',
               file: 'app.js',
               appName: 'TestWithAlec'
            });
        }
    });

    copyFileBtn.add();

    const deleteColumnBtn = BootstrapButton({
        value: 'Delete Column',
        classes: ['mt-3', 'mr-3'],
        type: 'danger',
        parent,
        async action(event) {
            DeleteColumn({
                list: 'Test',
                name: 'Number'
            });
        }
    });

    deleteColumnBtn.add();

    const createSiteBtn = BootstrapButton({
        value: 'Create app',
        classes: ['mt-3'],
        type: 'primary',
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
                        if (event.key === 'Enter') {
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

                        let spacers = '==============';

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

                        // Show launch button
                        const installAppBtn = BootstrapButton({
                            type: 'primary',
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
                            type: 'outline-primary',
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
                            type: 'light',
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

    createSiteBtn.add();
}