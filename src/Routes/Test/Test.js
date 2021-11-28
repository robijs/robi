import { Title, Modal, BootstrapButton, SingleLineTextField, BootstrapTextarea, ProgressBar, InstallConsole, Container, LoadingSpinner, MainContainer, Alert } from '../../Robi/RobiUI.js'
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

    const parseRoutes = BootstrapButton({
        value: 'Parse routes',
        classes: ['mr-3'],
        type: 'primary',
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
        type: 'dark',
        parent,
        async action(event) {
            open(`vscode:${App.get('site')}/${App.get('library')}/src`);
        }
    });

    openVSCodeBtn.add();

    const createSiteBtn = BootstrapButton({
        value: 'Create app',
        classes: ['ml-3'],
        type: 'success',
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