import { AddStyle, CreateSite, CreateFile, CreateLibrary, CreateFolder, GetRequestDigest, GetItemCount, CopyRecurse, SetHomePage } from '../../Core/Actions.js'
import { Title, Modal, BootstrapButton, SingleLineTextField, BootstrapTextarea, ProgressBar, InstallConsole, Container } from '../../Core/Components.js'
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

    const createLib = BootstrapButton({
        value: 'Copy',
        classes: ['mt-3'],
        type: 'primary',
        parent,
        async action(event) {
            const fileCount = await GetItemCount({
                list: 'App'
            });

            console.log(fileCount);

            return;

            // Get new request digest
            const requestDigest = await GetRequestDigest();

            // Check if site exists
            const siteResponse = await fetch(`${App.get('site')}/_api/web/lists/getbytitle('App')/items`, {
                headers: {
                    "Content-Type": "application/json;odata=verbose",
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": requestDigest,
                }
            });
            const data = await siteResponse.json();
            
            console.log(data);

            copyDir({
                path: 'App',
                library: 'App',
                filter: `Name ne 'Forms'`
            });

            // const response = await CreateLibrary({
            //     name: 'App',
            //     web: 'mds-9'
            // });

            // const folder = await CreateFolder({
            //     web: 'mds-9',
            //     library: 'App',
            //     name: 'src'
            // })

            // console.log(folder);
        }
    });

    createLib.add();

    // async function copyDir(param) {
    //     const { path, filter } = param;

    //     // 1. Look for files at top level of source site
    //     const url = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files`;
        
    //     console.log(url);

    //     const requestDigest = await GetRequestDigest();
    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             "Accept": "application/json;odata=verbose",
    //             "Content-type": "application/json; odata=verbose",
    //             "X-RequestDigest": requestDigest,
    //         }
    //     };
    //     const query = await fetch(url, options);
    //     const response = await query.json();

    //     if (response.d.results.length) {
    //         console.log(`Top level files in '${path}'`)
            
    //         for (let item in response.d.results) {
    //             const file = response.d.results[item];
    //             const { Name } = file;

    //             await createFile({
    //                 source: App.get('site'),
    //                 target: `${App.get('site')}/mds-9`,
    //                 path,
    //                 file: Name
    //             });

    //             console.log(`File '${Name}' copied.`);
    //         }
    //     } else {
    //         console.log(`No files in '${path}'`);
    //     }

    //     // 2. Look for directories
    //     const dirs = await findDirs({ path, filter });

    //     for (let item in dirs) {
    //         const file = dirs[item];
    //         const { Name } = file;
            
    //         console.log(`- ${Name}`);
    //         // 3 Create dirs
    //         await CreateFolder({
    //             web: 'mds-9', // target
    //             path: `${path}/${Name}`
    //         });

    //         console.log(`Folder '${Name}' copied.`);

    //         // Recurse into dir
    //         await copyDir({
    //             path: `${path}/${Name}`
    //         });
    //     }

    //     return true;
    // }

    // async function findDirs(param) {
    //     const { path, filter } = param;
        
    //     // 2. Look for directories
    //     const url = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/folders${filter ? `?$select=Name&$filter=${filter}` : ''}`;
    //     const requestDigest = await GetRequestDigest();
    //     const options = {
    //         method: 'GET',
    //         headers: {
    //             "Accept": "application/json;odata=verbose",
    //             "Content-type": "application/json; odata=verbose",
    //             "X-RequestDigest": requestDigest,
    //         }
    //     };
    //     const query = await fetch(url, options);
    //     const response = await query.json();

    //     return response?.d?.results;
    // }

    // async function createFile(param) {
    //     const { source, target, path, file } = param;

    //     console.log(param);

    //     const sourceSiteUrl = source + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files('" + file + "')/$value";
    //     const targetSiteUrl = target + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files/Add(url='" + file + "',overwrite=true)";
    //     const srcRequestDigest = await GetRequestDigest({ site: source });
    //     const getFileValue = await fetch(sourceSiteUrl, {
    //         method: 'GET',
    //         headers: {
    //             'binaryStringRequestBody': 'true',
    //             'Accept': 'application/json;odata=verbose;charset=utf-8',
    //             'X-RequestDigest': srcRequestDigest
    //         }
    //     });

    //     const arrayBuffer = await getFileValue.arrayBuffer();

    //     const newFile = await fetch(targetSiteUrl, {
    //         method: 'POST',
    //         body: arrayBuffer, 
    //         headers: {
    //             'binaryStringRequestBody': 'true',
    //             'Accept': 'application/json;odata=verbose;charset=utf-8',
    //             'X-RequestDigest': srcRequestDigest
    //         }
    //     });

    //     return newFile;
    // }

    const createSiteBtn = BootstrapButton({
        value: 'Create site',
        classes: ['ml-3', 'mt-3'],
        type: 'primary',
        parent,
        async action(event) {
             // Test Create Site modal
            AddStyle({
                name: 'console-box',
                style: /*css*/ `
                    .console {
                        height: 100%;
                        width: 100%;
                        overflow: overlay;
                        background: #1E1E1E;
                    }

                    .console * {
                        color: #CCCCCC !important;
                    }

                    .console-title {
                        font-family: 'M PLUS Rounded 1c', sans-serif;
                    }

                    .line-number {
                        display: inline-block;
                        font-weight: 600;
                        width: 30px;
                    }

                    .install-modal {
                        padding: 60px;
                    }

                    .install-alert {
                        left: 10px;
                        right: 10px;
                        bottom: 10px;
                        border-radius: 10px;
                        padding: 10px 15px;
                        border: none;
                        background: #1E1E1E;
                        color: white !important;
                        animation: fade-in-bottom 200ms ease-in-out forwards;
                    };

                    .install-alert * {
                        color: white !important;
                    };

                    @keyframes fade-alert {
                        0% {
                            bottom: -10px;
                            transform: scale(.5);
                            opacity: 0;
                        }
                    
                        100% {
                            bottom: 10px;
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                `
            });

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

                        // TODO: Show loading indicator

                        // Get robi source code file count
                        const fileCount = await GetItemCount({
                            list: 'App'
                        });

                        // const coreLists = Lists();

                        // TODO: Start at 2
                        // 0 - Create site
                        // 1 - Create App doc lib
                        let progressCount = 2 + parseInt(fileCount);

                        // coreLists.forEach(item => {
                        //     const { fields } = item;

                        //     // List +1
                        //     progressCount = progressCount + 1;

                        //     fields.forEach(field => {
                        //         // Field +2 (add column to list and view)
                        //         progressCount = progressCount + 2;
                        //     });
                        // });

                        // lists.forEach(item => {
                        //     const { fields } = item;

                        //     // List +1
                        //     progressCount = progressCount + 1;

                        //     fields.forEach(field => {
                        //         // Field +2 (add column to list and view)
                        //         progressCount = progressCount + 2;
                        //     });
                        // });

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
                            url
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
                            filter: `Name ne 'Forms'`
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
                                <code style='color: mediumseagreen !important;'>| '${title}' created |</code>
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
                            <div class='mt-4 mb-4'>New site <strong>${title}</strong> created at <a href='${App.get('site')}/${url}'>${App.get('site')}/${url}</a>. Select <span style='color: royalblue; font-weight: 500;'>Launch site</span> to install app.</div>
                        `);

                        // Show launch button
                        const launchBtn = BootstrapButton({
                            type: 'primary',
                            value: 'Launch site',
                            classes: ['mt-3', 'w-100'],
                            action(event) {
                                // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                                $(modal.get()).on('hidden.bs.modal', event => {
                                    console.log('Modal close animiation end');
                                    console.log('Launch');

                                    window.open(`${App.get('site')}/${url}`);
                                });

                                modal.close();
                            },
                            parent: modalBody
                        });

                        launchBtn.add();

                        // Scroll console to bottom (after launch button pushes it up);
                        installConsole.get().scrollTop = installConsole.get().scrollHeight;
                    }

                    const cancelBtn = BootstrapButton({
                        action(event) {
                            console.log('Cancel create site');

                            // Bootstrap uses jQuery .trigger, won't work with .addEventListener
                            $(modal.get()).on('hidden.bs.modal', event => {
                                console.log('modal close animiation end');

                                // Show alert
                                // appContainer.get().insertAdjacentHTML('afterend', /*html*/ `
                                //     <div class='position-absolute install-alert mb-0'>
                                //         Installation cancelled. You can safely close this page. Reload page to resume install.
                                //     </div>
                                // `);
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

    createSiteBtn.add();
}