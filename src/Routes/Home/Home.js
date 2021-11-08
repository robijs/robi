import { AddStyle, CreateSite, CreateFile, CreateLibrary, CreateFolder, GetRequestDigest } from '../../Core/Actions.js'
import { Title, Modal, BootstrapButton, SingleLineTextField } from '../../Core/Components.js'
import { App } from '../../Core/Settings.js'
import Store from '../../Core/Store.js'
import { Table } from '../../Core/ViewParts.js'

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
        value: 'Create library',
        classes: ['mt-3'],
        type: 'primary',
        parent,
        async action(event) {
            const response = await CreateLibrary({
                name: 'App',
                web: 'mds-9'
            });

            const folder = await CreateFolder({
                web: 'mds-9',
                library: 'App',
                name: 'src'
            })

            console.log(folder);
        }
    });

    createLib.add();

    const createFile = BootstrapButton({
        value: 'Create file',
        classes: ['ml-3', 'mt-3'],
        type: 'primary',
        parent,
        async action(event) {
            var sourceSiteUrl = App.get('site') + "/_api/web/GetFolderByServerRelativeUrl('" + 'App/src/Images' + "')/Files('" + 'favicon.ico' + "')/$value";
            var targetSiteUrl = App.get('site') + "/mds-9/_api/web/GetFolderByServerRelativeUrl('" + 'App/src' + "')/Files/Add(url='" + 'favicon.ico' + "',overwrite=true)";

            var xhr = new XMLHttpRequest();
            xhr.open('GET', sourceSiteUrl, true);
            xhr.setRequestHeader('binaryStringResponseBody', true);
            xhr.responseType = 'arraybuffer';
            const requestDigest = await GetRequestDigest({ web: 'mds-9' });
            xhr.onload = function (e) {
                if (this.status == 200) {
                    var arrayBuffer = this.response;
                    $.ajax({
                        url: targetSiteUrl,
                        method: 'POST',
                        data: arrayBuffer,
                        processData: false,
                        headers: { 'binaryStringRequestBody': 'true', 'Accept': 'application/json;odata=verbose;charset=utf-8', 'X-RequestDigest': requestDigest }
                    })
                    .done(function (postData) {
                    console.log('we did it!');
                    })
                    .fail(function (jqXHR, errorText) {
                    console.log('dadgummit');
                });
                }
            }
            xhr.send();

            return;
            // const getFile = await fetch('https://info.health.mil/staff/analytics/cp/ModernDev/create-app/App/src/Images/favicon.ico');
            const getFile = await fetch(`https://info.health.mil/staff/analytics/cp/ModernDev/create-app/_api/web/GetFolderByServerRelativeUrl('App/src/Images')/Files('favicon.ico')/$value?binaryStringResponseBody=true`);
            const contents = await getFile.arrayBuffer();

            console.log(getFile, contents);

            const newFile = await CreateFile({
                file: 'favicon.ico',
                contents: contents,
                folder: 'App/src',
                web: 'mds-9'
            });

            console.log(newFile);
        }
    });

    createFile.add();

    const getFile = BootstrapButton({
        value: 'Get file',
        classes: ['ml-3', 'mt-3'],
        type: 'primary',
        parent,
        async action(event) {
            const getFile = await fetch('https://info.health.mil/staff/analytics/cp/ModernDev/create-app/App/src/Images/favicon.ico');
            const buffer = getFile
            console.log(buffer);
        }
    });

    getFile.add();

    return;

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
                font-family: 'M PLUS Rounded 1c', sans-serif; /* FIXME: experimental */
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
                <h3>Create app</h3>
            `);

            // Site title
            const siteTitle = SingleLineTextField({
                label: 'Site title',
                parent: modalBody,
                onFocusout(event) {
                    console.log(event);
                    siteUrl.value(siteTitle.value().toLowerCase().split(' ').join('-'));
                    appName.value(siteTitle.value().toTitleCase().split(' ').join(''));
                }
            });

            siteTitle.add();

            // Site Url
            const siteUrl = SingleLineTextField({
                label: 'Site url',
                addon: App.get('site') + '/',
                parent: modalBody
            });

            siteUrl.add();

            // Site Url
            const appName = SingleLineTextField({
                label: 'App name',
                parent: modalBody
            });

            appName.add();

            const installBtn = BootstrapButton({
                action: installApp,
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'primary',
                value: 'Create app'
            });

            installBtn.add();

            modal.get().addEventListener('keypress', event => {
                if (event.key === 'Enter') {
                    installApp(event);
                }
            })

            async function installApp(event) {
                const title = siteTitle.value();
                const url = siteUrl.value();
                const name = appName.value();

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

                // Create site
                const newSite = await CreateSite({
                    title,
                    url
                });

                console.log('New site:', newSite);

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

                            window.open(`${App.get('site')}/${url}`);
                        });

                        modal.close();
                        loadingBar.showLoadingBar();
                    },
                    parent: modalBody
                });

                launchBtn.add();

                // Scroll console to bottom (after launch button pushes it up);
                // installConsole.get().scrollTop = installConsole.get().scrollHeight;
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