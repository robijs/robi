import { Component,Route } from '../Core/Actions.js'
import { App } from '../Core/Settings.js'
import Store from '../Core/Store.js'

/**
 * 
 * @param {*} param 
 * @returns 
 */
 export default function Sidebar(param) {
    const {
        parent,
        logo,
        path,
        sidebarDropdown
    } = param;

    const logoPath = App.get('mode') === 'prod' ? '../Images' : `/src/Images`;

    const component = Component({
        html: /*html*/ `
            <div class='sidebar' data-mode='open'>
                <!-- <div class='logo' data-path='${App.get('defaultRoute')}'></div> -->
                <img src ='${logoPath}/${logo}' class='logo' data-path='${App.get('defaultRoute')}'>
                ${sidebarDropdown ?
                    /*html*/ `
                        <div class='dropdown-container'>
                            <div class='dropdown-label mb-2'>${sidebarDropdown.label}</div>
                            <div class="dropdown">
                                <button class="btn btn-dark dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${sidebarDropdown.getSelected()}</button>
                                <div class="dropdown-menu mt-1" aria-labelledby="dropdownMenuButton">
                                    ${buildDropdown(sidebarDropdown.items)}
                                </div>
                            </div>
                        </div>
                    ` :
                ''
            }
                <div class='nav-container'>
                    ${buildNav()}
                </div>
                <div class='settings-container'>
                    <!-- Settings -->
                    <span class='nav ${(path === 'Settings') ? 'nav-selected' : ''} settings' data-path='Settings'>
                        <span class='icon-container-wide'>
                            <svg class='icon'><use href='#icon-bs-gear'></use></svg>
                        </span>
                        <span class='text'>Settings</span>
                    </span>
                    <!-- Open / Close -->
                    <span class='open-close'>
                        <svg class='icon'><use href='#icon-caret-left'></use></svg>
                    </span>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.sidebar {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                background: ${App.gradientColor ? `linear-gradient(${App.gradientColor})` : App.get('sidebarBackgroundColor')};
                ${App.get('sidebarBorderColor') ? `border-right: solid 1px ${App.get('sidebarBorderColor')}` : ''}
                height: 100vh;
            }

            /* Nav Container */
            .nav-container {
                background: white;
                margin: 0px 15px;
                border-radius: 10px;
                /* border-top: solid 1px ${App.get('sidebarBorderColor')}; */
                overflow: overlay;
            }

            /* Settings */
            .settings-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                width: calc(100% - 30px);
            }

            .settings {
                border-radius: 10px;
                background: white;
                margin: 0px 15px;
            }

            .sidebar .nav {
                display: flex;
                align-items: center;
                width: 100%;
                min-height: 42px; /** TODO: Variable. Set manually */
                cursor: pointer;
                text-align: left;
                font-size: 1em;
                font-weight: 400;
                /* padding: 10px; */
                color: ${App.get('secondaryColor')};
                /* border-left: solid 3px transparent;
                border-right: solid 3px transparent; */
            }

            /* .sidebar .nav:not(.nav-selected):hover {
                background: #2d3d5013;
            } */

            .sidebar .nav-selected {
                /* border-left: solid 3px #444; */
                box-shadow: 0px -1px 0px 0px #e4e4e6;
                background: #e4e4e6;
            }

            .sidebar .nav .icon-container {
                display: flex;
                padding: 10px 15px;
            }

            
            .sidebar .nav .icon-container-wide {
                display: flex;
                padding: 10px 15px;
            }

            .sidebar .nav .icon {
                fill: ${App.get('sidebarTextColor')};
                stroke: ${App.get('sidebarTextColor')};
                font-size: 22px;
            }

            .sidebar .nav .text {
                flex: 1;
                color: ${App.get('sidebarTextColor')};
                font-size: 15px;
                font-weight: 500;
                padding: 10px 15px 9px 15px;
            }

            .sidebar .nav:not(:last-child):not(.settings) .text {
                border-bottom: solid 1px #e4e4e6;
            }

            .sidebar .nav .icon:hover,
            .sidebar .nav-selected .icon {
                fill: ${App.get('sidebarTextColor')};
                stroke: ${App.get('sidebarTextColor')};
            }

            /* Open/Close */ 
            .sidebar .open-close {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                width: 100%;
                text-align: left;
                font-size: 1em;
                font-weight: 400;
                padding: 15px 0px;
                color: ${App.get('secondaryColor')};
                /* border-bottom: solid 1px ${App.get('sidebarBorderColor')}; */
            }

            .sidebar .open-close .icon {
                cursor: pointer;
                fill: ${App.get('sidebarTextColor')};
                stroke: ${App.get('sidebarTextColor')};
                font-size: 1em;
            }

            /* Logo */
            #id .logo {
                cursor: pointer;
                margin: 15px 0px;
                transition: all 150ms;
                min-height: 31px;
                object-fit: scale-down;
            }

            /* Drop down */
            #id .dropdown-container {
                margin-bottom: 10px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            #id .dropdown-container.closed {
                display: none;
            }
            
            #id .dropdown-label {
                color: ${App.get('sidebarTextColor')};
                font-size: 1.1em;
                font-weight: 500;
            }

            #id .dropdown-toggle {
                font-size: 14px;
            }

            #id .btn:focus,
            #id .btn:active {
                box-shadow: none;
            }

            #id .dropdown-menu {
                min-width: initial;
            }

            #id .dropdown-item {
                /* padding: 6px 19px; */
                font-size: 14px;
                padding: 6px 12px;
                cursor: pointer;
            }

            #id .dropdown-item::after {
                display: inline-block;
                margin-left: .255em;
                vertical-align: .255em;
                content: "";
                border-top: .3em solid transparent;
                border-right: .3em solid transparent;
                border-bottom: 0;
                border-left: .3em solid transparent;
                box-sizing: border-box;
            }
            
            /* Collapse */
            #id.sidebar .nav .text.closed {
                display: none;
            }

            #id.sidebar .logo.closed {
                max-width: 40px;
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
                    max-width: 40px;
                }
    
                #id.sidebar .open-close.closed {
                    justify-content: center;
                }
            }
        `,
        parent: parent,
        position: 'afterbegin',
        permanent: true,
        events: [
            {
                selector: '.nav',
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
                selector: '#id .dropdown-item',
                event: 'click',
                listener: onDropdown
            },
            {
                selector: '#id .open-close',
                event: 'click',
                listener: toggleSidebarMode
            }
        ],
        onAdd() {
            /** Window resize event */
            window.addEventListener('resize', event => {
                const mode = component.get().dataset.mode;
                const icon = component.find('.open-close');

                if (window.innerWidth <= 1250) {
                    closeSidebar(mode, icon);
                } else {
                    openSidebar(mode, icon);
                }
            });
        }
    });

    function toggleSidebarMode(event) {
        const mode = component.get().dataset.mode;

        console.log(mode);

        if (mode === 'open') {
            closeSidebar(mode, this);
        } else if (mode === 'closed') {
            openSidebar(mode, this);
        }
    }

    function closeSidebar(mode, icon) {
        if (mode !== 'closed') {
            /** Add classes */
            component.find('.logo').src = `${logoPath}/${App.get('logoSmall')}`;
            component.find('.logo').classList.add('closed');
            component.find('.dropdown-container')?.classList.add('closed');
            component.findAll('.text').forEach(item => item.classList.add('closed'));
            icon.classList.add('closed');

            /** Update icon */
            icon.querySelector('.icon use').setAttribute('href', '#icon-caret-right');

            /** Set mode */
            component.get().dataset.mode = 'closed';

            /** Log close action */
            console.log(`Close sidebar.`);
        }
    }

    function openSidebar(mode, icon) {
        if (mode !== 'open') {
            /** Remove Classes */
            component.find('.logo').src = `${logoPath}/${App.get('logo')}`;
            component.find('.logo').classList.remove('closed');
            // component.find('.dropdown-container').classList.remove('closed');
            component.findAll('.text').forEach(item => item.classList.remove('closed'));
            icon.classList.remove('closed');

            /** Update icon */
            icon.querySelector('.icon use').setAttribute('href', '#icon-caret-left');

            /** Set mode */
            component.get().dataset.mode = 'open';

            /** Log open action */
            console.log(`Open sidebar.`);
        }
    }

    function onDropdown(event) {
        const key = event.target.dataset.key;
        const value = event.target.dataset.value;
        // console.info(event)

        /** Update session storage */
        sessionStorage.setItem(key, value);

        /** Update label */
        component.find('.dropdown-toggle').innerText = event.target.innerText;

        /** Update dropdown menu */
        component.find('.dropdown-menu').innerHTML = buildDropdown(sidebarDropdown.items);

        /** Add events */
        component.findAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', onDropdown);
        });

        if (sidebarDropdown.action) {
            sidebarDropdown.action(event);
        }

        /** Route */
        const path = location.href.split('#')[1];

        Route(path);
    }

    function buildNav() {
        return Store.routes()
            .filter(route => route.path !== 'Settings' && !route.hide)
            .map(route => {
                const {
                    path,
                    icon,
                    roles
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

    function buildDropdown(items) {
        // console.info(items)
        return items
            //.filter(item => item.label !== sidebarDropdown.getSelected()) /** filter out current selection */
            .map(item => {
                const {
                    label,
                    key,
                    value
                } = item;

                /** Highlights selected Fiscal Year @author Wilfredo Pacheco 20210810 */
                var active = '';
                const isSelected = sessionStorage.getItem(key) === value
                if (isSelected) { active = 'active' }

                return /*html*/ ` 
                <span class='dropdown-item ${active}' data-key='${key}' data-value='${value}'>${label}</span>
            `
            }).join('\n');
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
    }

    return component;
}