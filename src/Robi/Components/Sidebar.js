import { Component } from '../Actions/Component.js'
import { GenerateUUID } from '../Actions/GenerateUUID.js'
import { Route } from '../Actions/Route.js'
import { BootstrapButton } from './BootstrapButton.js'
import { BootstrapTextarea } from './BootstrapTextarea.js'
import { Modal } from './Modal.js'
import { SingleLineTextField } from './SingleLineTextField.js'
import { App, Store} from '../Core.js'

/**
 *
 * @param {*} param
 * @returns
 */
export function Sidebar(param) {
    const {
        parent, path
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='sidebar' data-mode='open'>
                <div class='w-100 d-flex justify-content-between align-items-center collapse-container'>
                    <span class='icon-container collapse'>
                        <svg class='icon'>
                            <use href='#icon-bs-layout-sidebar-nested'></use>
                        </svg>
                    </span>
                    <!-- Developer options --> 
                    ${
                        Store.user().Role === 'Developer' ?
                        (() => {
                            const id = GenerateUUID();

                            return /*html*/ `
                                <div class='dev-buttons-container'>
                                    <div class="dropdown">
                                        <button class="btn w-100 open-dev-menu" type="button" id="${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            Edit
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="${id}">
                                            <button class="dropdown-item add-route" type="button">Add route</button>
                                            <button class="dropdown-item modify-route" type="button">Modify route</button>
                                            <button class="dropdown-item modify-route" type="button">Reorder routes</button>
                                            <button class="dropdown-item hide-routes" type="button">Hide routes</button>
                                            <div class="dropdown-divider"></div>
                                            <button class="dropdown-item delete-routes" type="button">Delete routes</button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        })() : ''
                    }
                </div>
                <div class='title-container'>
                    <h3 class='title'>${App.get('title')}</h3>
                </div>
                <div class='nav-container'>
                    ${buildNav()}
                </div>
                <!-- Settings -->
                <div class='settings-container'>
                    <span class='nav ${(path === 'Settings') ? 'nav-selected' : ''} settings' data-path='Settings'>
                        <span class='icon-container-wide'>
                            <svg class='icon'><use href='#icon-bs-gear'></use></svg>
                        </span>
                        <!-- <span class='text'>Settings</span> -->
                    </span>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.sidebar {
                user-select: none;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                background: ${App.gradientColor ? `linear-gradient(${App.get('gradientColor')})` : App.get('backgroundColor')};
                border-right: solid 1px #d6d8db80;
                height: 100vh;
                transition: width 300ms, min-width 300ms
            }

            #id.sidebar.closed {
                min-width: 0vw;
            }

            /* Title */
            #id h3 {
                padding: 0px 23px 10px 23px; /* -2px on the sides */
                margin: 0px;
                font-weight: 700;
                width: 100%;
            }

            /* Nav Container */
            .nav-container {
                overflow: overlay;
                width: 100%;
                padding: 0px 17px; /* +2px on the sides */
                overflow-x: hidden;
            }

            /* Settings */
            .settings-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                width: calc(100% - 30px);
                margin: 20px 15px;
            }

            .sidebar .nav {
                display: flex;
                align-items: center;
                width: 100%;
                height: 42.5px;
                cursor: pointer;
                text-align: left;
                font-size: 1em;
                font-weight: 400;
                border-radius: 10px;
                /* transition: background-color 100ms ease; */
            }

            /* .sidebar .nav:not(.nav-selected):hover {
                background-color: ${App.get('primaryColor') + '20'};
            } */

            .sidebar .icon-container {
                display: flex;
                padding: 10px 15px;
            }

            .sidebar .icon-container-wide {
                display: flex;
                padding: 10px 15px;
            }

            .sidebar .nav .icon {
                fill: ${App.get('primaryColor')};
                stroke: ${App.get('primaryColor')};
                font-size: 22px;
            }

            .sidebar .text {
                flex: 1;
                color: ${App.get('sidebarTextColor')};
                font-size: 15px;
                font-weight: 500;
                padding: 10px 0px;
                min-width: 200px;
                transition: width 300ms, min-width 300ms;
            }

            .sidebar .text.collapsed {
                min-width: 0px;
                overflow: hidden;
                flex: 0;
            }

            /* Selected */
            .sidebar .nav-selected {
                background: ${App.get('primaryColor')};
            }

            .sidebar .nav.nav-selected  .icon {
                fill: white;
                stroke: white;
            }

            .sidebar .nav.nav-selected .text {
                color: white;
            }

            @media (max-width: 1300px) {
                #id.sidebar .nav .text.closed {
                    display: none;
                }
    
                #id.sidebar .logo.closed {
                    image-rendering: pixelated;
                    width: 40px;
                }
    
                #id.sidebar .open-close.closed {
                    justify-content: center;
                }
            }

            /* Edit menu */
            #id .collapse-container {
                padding: 10px 5px 5px 5px;
            }

            #id .collapse-container .btn {
                color: ${App.get('primaryColor')};
                font-weight: 500;
            }

            #id .collapse-container .icon {
                fill: ${App.get('primaryColor')};
            }
            
            #id .collapse-container .icon-container {
                cursor: pointer;
            }

            #id .dropdown-menu {
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                border-radius: 10px;
                border: none;
            }

            #id .dev-buttons-container {
                width: 50.41px;
                transition: width 150ms ease, opacity 150ms ease;
            }

            #id .dev-buttons-container.closed {
                display: none !important;
            }

            #id .dev-buttons-container .open-dev-menu {
                font-weight: 500;
            }

            #id .dev-buttons-container .dropdown-toggle:focus {
                box-shadow: none !important;
            }

            #id .dev-buttons-container .dropdown-item {
                outline: none;
            }

            #id .dev-buttons-container .delete-routes {
                color: firebrick;
            }

            @keyframes fade-out-left {
                from {
                    transform: translateX(0px);
                    opacity: 1;
                    width: 0px;
                }
                to {
                    transform: translateX(-${App.get('title').length + 20}px);
                    opacity: 0;
                    width: 0px;
                }
            }

            @keyframes fade-out {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @keyframes fade-in-right {
                from {
                    transform: translateX(-${App.get('title').length + 20}px);
                    opacity: 0;
                    width: 0px;
                }
                to {
                    transform: translateX(0px);
                    opacity: 1;
                    width: 0px;
                }
            }
            
            .fade-in {
                animation: 150ms ease-in-out fade-in;
            }

            
            .fade-out-left {
                animation: 300ms ease-in-out fade-out-left;
            }


            .fade-in-right {
                animation: 300ms ease-in-out fade-in-right;
            }
        `,
        parent: parent,
        position: 'afterbegin',
        permanent: true,
        events: [
            {
                selector: '.nav:not(.control)',
                event: 'click',
                listener: routeToView
            },
            {
                selector: '.logo',
                event: 'click',
                listener(event) {
                    Route(this.dataset.path);
                }
            },
            {
                selector: '#id .collapse',
                event: 'click',
                listener: toggleSidebarMode
            },
            {
                selector: '#id .add-route',
                event: 'click',
                listener: addRoute
            },
            {
                selector: '#id .modify-route',
                event: 'click',
                listener: modifyRoute
            },
            {
                selector: '#id .hide-routes',
                event: 'click',
                listener: hideRoutes
            },
            {
                selector: '#id .delete-routes',
                event: 'click',
                listener: removeRoutes
            }
        ],
        onAdd() {
            setTimeout(() => {
                // Set nav width
                component.findAll('.text').forEach(node => {
                    console.log(node.offsetWidth);
                    node.style.width = `${node.offsetWidth}px`;
                    node.dataset.width = `${node.offsetWidth}px`;
                });
            }, 0); // FIXME: Will this always work, even on CarePoint/LaunchPad?

            // Window resize event
            window.addEventListener('resize', event => {
                const mode = component.get().dataset.mode;

                if (window.innerWidth <= 1250) {
                    closeSidebar(mode);
                } else {
                    openSidebar(mode);
                }
            });
        }
    });

    function addRoute(event) {
        // Show modal
        console.log('add route');

        const modal = Modal({
            title: false,
            disableBackdropClose: true,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='mb-2'>Add route</h3>
                `);

                // Route title
                const routeTitle = SingleLineTextField({
                    label: 'Title',
                    parent: modalBody,
                    onFocusout(event) {
                        routepath.value(routeTitle.value().toLowerCase().split(' ').join('-'));
                        appName.value(routeTitle.value().toTitleCase().split(' ').join(''));
                    }
                });

                routeTitle.add();

                // Route path
                const routepath = SingleLineTextField({
                    label: 'Path',
                    addon: App.get('site') + '/App/src/pages/app.aspx#',
                    parent: modalBody
                });

                routepath.add();

                const installBtn = BootstrapButton({
                    action() {
                        console.log('Add route');

                        //Update routes
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
                    },
                    classes: ['w-100 mt-5'],
                    width: '100%',
                    parent: modalBody,
                    type: 'robi',
                    value: 'Add route'
                });

                installBtn.add();

                const cancelBtn = BootstrapButton({
                    action(event) {
                        console.log('Cancel add route');

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

    function modifyRoute(event) {
        // Show modal
        console.log('modify route');

        const modal = Modal({
            title: false,
            disableBackdropClose: true,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='mb-2'>Modify route</h3>
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
                    action() {
                        console.log('Create route');
                    },
                    classes: ['w-100 mt-5'],
                    width: '100%',
                    parent: modalBody,
                    type: 'primary',
                    value: 'Modify route'
                });

                installBtn.add();

                const cancelBtn = BootstrapButton({
                    action(event) {
                        console.log('Cancel modify route');

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

    function hideRoutes(event) {
        // Show modal
        console.log('hide routes');

        const modal = Modal({
            title: false,
            disableBackdropClose: true,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='mb-2'>Hide routes</h3>
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
                    action() {
                        console.log('Create route');
                    },
                    classes: ['w-100 mt-5'],
                    width: '100%',
                    parent: modalBody,
                    type: 'dark',
                    value: 'Hide routes'
                });

                installBtn.add();

                const cancelBtn = BootstrapButton({
                    action(event) {
                        console.log('Cancel remove route');

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

    function removeRoutes(event) {
        // Show modal
        console.log('remove route');

        const modal = Modal({
            title: false,
            disableBackdropClose: true,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='mb-2'>Remove route</h3>
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
                    action() {
                        console.log('Create route');
                    },
                    classes: ['w-100 mt-5'],
                    width: '100%',
                    parent: modalBody,
                    type: 'danger',
                    value: 'Remove routes'
                });

                installBtn.add();

                const cancelBtn = BootstrapButton({
                    action(event) {
                        console.log('Cancel remove route');

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

    // FIXME: Disable close/open button until animationend
    function toggleSidebarMode(event) {
        const mode = component.get().dataset.mode;

        if (mode === 'open') {
            closeSidebar(mode, this);
        } else if (mode === 'closed') {
            openSidebar(mode, this);
        }
    }
    
    function closeSidebar(mode) {
        if (mode !== 'closed') {
            // Collapse nav text nodes
            component.findAll('.text').forEach(item => {
                item.classList.add('collapsed');
                item.style.width = '0px';
            });

            // Fade out long title to the left
            component.find('.title').addEventListener('animationend', event => {
                console.log(event.target);
                event.target.remove();
                // Set short title
                component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='fade-in title' style='text-align: center;'>${App.get('title')[0]}</h3>                
                `);
            });
            component.find('.title').classList.add('fade-out-left');

            // Set fade up
            component.find('.dev-buttons-container').style.opacity = '0';
            component.find('.dev-buttons-container').style.width = '0px';

            // Set mode
            component.get().dataset.mode = 'closed';
        }
    }

    function openSidebar(mode) {
        if (mode !== 'open') {
            // Reset nav text node width
            component.findAll('.text').forEach(item => {
                item.classList.remove('collapsed');
                item.style.width = item.dataset.width;
            });

            // Fade in long title from the left
            component.find('.title').remove();
            component.find('.title-container').insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='title fade-in-right'>${App.get('title')}</h3>
            `);
            component.find('.title').addEventListener('animationend', event => {
                console.log(event.target);
                event.target.classList.remove('fade-in-right');
            });

            // Set fade up
            component.find('.dev-buttons-container').style.opacity = '1';
            component.find('.dev-buttons-container').style.width = '50.41px';

            // Set mode
            component.get().dataset.mode = 'open';
        }
    }

    function buildNav() {
        return Store.routes()
            .filter(route => route.path !== 'Settings' && !route.hide)
            .map(route => {
                const {
                    path, icon, roles
                } = route;

                if (roles) {
                    if (roles.includes(Store.user().Role)) {
                        return navTemplate(path, icon);
                    } else {
                        return '';
                    }
                } else {
                    return navTemplate(path, icon);
                }

            }).join('\n');
    }

    function navTemplate(routeName, icon) {
        const firstPath = path ? path.split('/')[0] : undefined;

        return /*html*/ `
            <span class='nav ${(firstPath === routeName || firstPath === undefined && routeName === App.get('defaultRoute')) ? 'nav-selected' : ''}' data-path='${routeName}'>
                <span class='icon-container'>
                    <svg class='icon'><use href='#icon-${icon}'></use></svg>
                </span>
                <span class='text'>${routeName.split(/(?=[A-Z])/).join(' ')}</span>
            </span>
        `;
    }

    function routeToView() {
        component.findAll('.nav').forEach((nav) => {
            nav.classList.remove('nav-selected');
        });

        this.classList.add('nav-selected');

        Route(this.dataset.path);
    }

    component.selectNav = (path) => {
        component.findAll('.nav').forEach((nav) => {
            nav.classList.remove('nav-selected');
        });

        const nav = component.find(`.nav[data-path='${path}']`);

        if (nav) {
            nav.classList.add('nav-selected');
        }
    };

    return component;
}
