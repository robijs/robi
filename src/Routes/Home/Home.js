import { AddStyle, CreateSite, CopyFile, CreateLibrary, CreateFolder, GetRequestDigest, GetItemCount, CopyRecurse, SetHomePage, DeleteColumn } from '../../Core/Actions.js'
import { Title, Modal, BootstrapButton, SingleLineTextField, BootstrapTextarea, ProgressBar, InstallConsole, Container, LoadingSpinner } from '../../Core/Components.js'
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
                        message: 'Loading /App/src/Lists.js',
                        classes: ['mt-3', 'mb-3', 'loading-file'],
                        parent: modalBody
                    });

                    loading.add();

                    modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                        <textarea class='code-mirror-container robi-code-background'></textarea>
                    `);

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
                        'Ctrl-S'(cm) {
                            console.log('save file');
                        },
                        'Ctrl-W'(cm) {
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
                
                    let value = await getFileValue.text();

                    editor.setSize('auto', 'auto');
                    editor.setOption('viewportMargin', Infinity);
                    editor.setOption('theme', 'material-palenight');
                    editor.getDoc().setValue(value);

                    // Intellisense
                    var ExcludedIntelliSenseTriggerKeys = {
                        "8": "backspace",
                        "9": "tab",
                        "13": "enter",
                        "16": "shift",
                        "17": "ctrl",
                        "18": "alt",
                        "19": "pause",
                        "20": "capslock",
                        "27": "escape",
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

                    editor.on('keyup', (editor, event) => {
                        var __Cursor = editor.getDoc().getCursor();
                        var __Token = editor.getTokenAt(__Cursor);

                        if (!editor.state.completionActive &&
                            !ExcludedIntelliSenseTriggerKeys[(event.keyCode || event.which).toString()] &&
                            (__Token.type == "tag" || __Token.string == " " || __Token.string == "<" || __Token.string == "/"))
                        {
                            CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
                        }
                    });

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

                            if (!dot) {
                                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                                    <div class='changed-dot' style='width: 10px; height: 10px; background: #dee2e6; border-radius: 50%; position: absolute; top: 1rem; right: 1rem;'></div>
                                `);
                            }

                            modifyBtn.get().disabled = false;
                        }
                    });

                    loading.remove();

                    const modifyBtn = BootstrapButton({
                        async action(event) {
                            // Disable button - Prevent user from clicking this item more than once
                            $(event.target)
                                .attr('disabled', '')
                                .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving');

                            const value = editor.getDoc().getValue();

                            console.log(value);

                            // TODO: Move to SetFile action
                            const setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='lists.js',overwrite=true)`, {
                                method: 'POST',
                                body: value, 
                                headers: {
                                    'binaryStringRequestBody': 'true',
                                    'Accept': 'application/json;odata=verbose;charset=utf-8',
                                    'X-RequestDigest': srcRequestDigest
                                }
                            });

                            console.log(setFile);

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
                        classes: ['w-100 mt-4'],
                        disabled: true, // enable if changed
                        width: '100%',
                        parent: modalBody,
                        type: 'success',
                        value: 'Save and close'
                    });

                    modifyBtn.add();

                    const cancelBtn = BootstrapButton({
                        action(event) {
                            // $(modal.get()).on('hidden.bs.modal', event => {
                            //     console.log('modal close animiation end');
                            // });

                            modal.close();
                        },
                        classes: ['w-100 mt-2'],
                        width: '100%',
                        parent: modalBody,
                        type: 'light',
                        value: 'Close'
                    });

                    cancelBtn.add();
                },
                centered: true,
                showFooter: false,
            });

            modal.add();

            $(modal.get()).on('hide.bs.modal', event => {
                console.log('check if saved');

                // return true;
            });
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
            })
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
            })
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