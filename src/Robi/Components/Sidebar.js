import { Component, GenerateUUID } from '../Actions.js';
import { Route } from "./Route";
import { App } from '../Core.js';
import Store from '../Store.js';
import { BootstrapButton } from './BootstrapButton';
import { BootstrapTextarea } from './BootstrapTextarea';
import { Modal } from './Modal';
import { SingleLineTextField } from "./SingleLineTextField";

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
                    ${Store.user().Role === 'Developer' ?
                (() => {
                    const id = GenerateUUID();

                    return /*html*/ `
                                <div class='w-100 d-flex justify-content-end dev-buttons-container'>
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
                })() : ''}
                </div>
                <h3 class='w-100'>${App.get('title')}</h3>
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
                align-items: center;
                background: ${App.gradientColor ? `linear-gradient(${App.get('gradientColor')})` : App.get('backgroundColor')};
                border-right: solid 1px #d6d8db80;
                height: 100vh;
                min-width: 250px;
                transition: width, min-width 300ms
            }

            #id.sidebar.closed {
                min-width: 0vw;
            }

            /* Title */
            #id h3 {
                padding: 0px 23px 10px 23px; /* -2px on the sides */
                margin: 0px;
                font-weight: 700;
            }

            /* Nav Container */
            .nav-container {
                overflow: overlay;
                width: 100%;
                padding: 0px 17px; /* +2px on the sides */
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
            }

            .sidebar .icon-container {
                display: flex;
                padding: 10px;
            }

            .sidebar .icon-container-wide {
                display: flex;
                padding: 10px;
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
                padding: 10px 5px;
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

            /* Open/Close */ 
            .sidebar .open-close {
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                width: 100%;
                text-align: left;
                font-size: 1em;
                font-weight: 400;
                padding: 15px 0px;
                color: ${App.get('secondaryColor')};
            }

            .sidebar .open-close .icon {
                fill: ${App.get('sidebarTextColor')};
                stroke: ${App.get('sidebarTextColor')};
                font-size: 1em;
            }

            /* Logo */
            #id .logo {
                cursor: pointer;
                margin: 15px 0px;
                transition: all 150ms;
                height: 31px;
                object-fit: scale-down;
            }
            
            /* Collapse */
            #id.sidebar .text.closed {
                display: none;
            }

            #id.sidebar .logo.closed {
                width: 40px;
            }

            #id.sidebar .open-close.closed {
                justify-content: center;
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

            /* Add route */
            #id .collapse-container {
                padding: 10px 15px 5px 15px;
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
            /** Window resize event */
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
                    <h3 class='mb-2'>Create route</h3>
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
                    type: 'success',
                    value: 'Create route'
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

    function toggleSidebarMode(event) {
        const mode = component.get().dataset.mode;

        console.log(mode);

        if (mode === 'open') {
            closeSidebar(mode, this);
        } else if (mode === 'closed') {
            openSidebar(mode, this);
        }
    }

    function closeSidebar(mode) {
        if (mode !== 'closed') {
            // FIXME: Experimental
            // TODO: Instead, trigger on close sidebar animationend?
            setTimeout(() => {
                component.find('h3').innerText = App.get('title')[0];
            }, 100);

            /** Add classes */
            component.get().classList.add('closed');
            component.find('.dev-buttons-container')?.classList.add('closed');
            component.findAll('.text').forEach(item => item.classList.add('closed'));

            /** Set mode */
            component.get().dataset.mode = 'closed';

            /** Log close action */
            console.log(`Close sidebar.`);
        }
    }

    function openSidebar(mode) {
        if (mode !== 'open') {
            /** Remove Classes */
            component.get().classList.remove('closed');

            // FIXME: Experimental
            // TODO: Instead, trigger on close sidebar animationend?
            setTimeout(() => {
                component.find('h3').innerText = App.get('title');
                component.find('.dev-buttons-container')?.classList.remove('closed');
                component.findAll('.text').forEach(item => item.classList.remove('closed'));
            }, 100);

            /** Set mode */
            component.get().dataset.mode = 'open';

            /** Log open action */
            console.log(`Open sidebar.`);
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
