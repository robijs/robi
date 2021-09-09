/** Actions */
import Action_Component from '../Actions/Action_Component.js'
import Action_Store from '../Actions/Action_Store.js'
import Action_Route from '../Actions/Action_Route.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'
import Setting_Routes from '../Settings/Setting_Routes.js'

export default function Component_Sidebar(param) {
    const {
        parent,
        logo,
        path,
        sidebarDropdown
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='sidebar' data-mode='open'>
                <!-- <div class='logo' data-path='${Setting_App.defaultRoute}'></div> -->
                <img src ='${logo}' class='logo' data-path='${Setting_App.defaultRoute}'>
                ${
                    sidebarDropdown ?
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
                    <!-- Open / Close -->
                    <span class='open-close'>
                        <svg class='icon'><use href='#icon-caret-left'></use></svg>
                    </span>
                    <!-- Settings -->
                    <span class='nav ${(path === 'Settings') ? 'nav-selected' : ''} settings' data-path='Settings'>
                        <svg class='icon'><use href='#icon-bs-gear'></use></svg>
                        <span class='text'>Settings</span>
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
                height: 100vh;
                background: ${Setting_App.gradientColor ? `linear-gradient(${Setting_App.gradientColor})` : Setting_App.sidebarBackgroundColor};
                ${Setting_App.sidebarBorderColor ? `border-right: solid 1px ${Setting_App.sidebarBorderColor}` : ''}
            }

            /* Nav Container */
            .nav-container {
                border-top: solid 1px ${Setting_App.sidebarBorderColor};
                overflow: overlay;
            }

            .sidebar .nav {
                display: flex;
                align-items: center;
                width: 100%;
                min-height: 32px;
                cursor: pointer;
                text-align: left;
                font-size: 1em;
                font-weight: 400;
                padding: 4px 10px;
                color: ${Setting_App.secondaryColor};
                border-left: solid 3px transparent;
                border-right: solid 3px transparent;
            }

            .sidebar .nav:not(.nav-selected):hover {
                background: #2d3d5013;
            }

            .sidebar .nav-selected {
                border-left: solid 3px #444;
                background: #2d3d5026;
            }

            .sidebar .nav .icon {
                fill: ${Setting_App.sidebarTextColor};
                stroke: ${Setting_App.sidebarTextColor};
                font-size: 20px;
            }

            .sidebar .nav .text {
                color: ${Setting_App.sidebarTextColor};
                font-size: 14px;
                font-weight: 500;
                padding-left: 15px;
            }

            .sidebar .nav .icon:hover,
            .sidebar .nav-selected .icon {
                fill: ${Setting_App.sidebarTextColor};
                stroke: ${Setting_App.sidebarTextColor};
            }

            /* Settings */
            .settings-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-end;
                width: 100%;
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
                padding: 7.5px 10px;
                color: ${Setting_App.secondaryColor};
                border-bottom: solid 1px ${Setting_App.sidebarBorderColor};
            }

            .sidebar .open-close .icon {
                cursor: pointer;
                fill: ${Setting_App.sidebarTextColor};
                stroke: ${Setting_App.sidebarTextColor};
                font-size: 1em;
            }

            /* Logo */
            #id .logo {
                cursor: pointer;
                margin: 10px 0px;
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
                color: ${Setting_App.sidebarTextColor};
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
                    Action_Route(this.dataset.path);
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
        
        if (mode === 'open') {
            closeSidebar(mode, this);
        } else if (mode === 'closed') {
            openSidebar(mode, this);
        }
    }

    function closeSidebar(mode, icon) {
        if (mode !== 'closed') {
            /** Add classes */
            component.find('.logo').src = Setting_App.logoSmall;
            component.find('.logo').classList.add('closed');
            component.find('.dropdown-container').classList.add('closed');
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
            component.find('.logo').src = Setting_App.logo;
            component.find('.logo').classList.remove('closed');
            component.find('.dropdown-container').classList.remove('closed');
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

        Action_Route(path);
    }

    function buildNav() {
        return Setting_Routes
            .filter(route => route.path !== 'Settings' && !route.hide)
            .map(route => {
                const {
                    path,
                    icon,
                    roles
                } = route;

                if (roles) {
                    if (roles.includes(Action_Store.user().Role)) {
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
            <span class='nav ${(firstPath === routeName || firstPath === undefined && routeName === Setting_App.defaultRoute) ? 'nav-selected' : ''}' data-path='${routeName}'>
                <svg class='icon'><use href='#icon-${icon}'></use></svg>
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
            if ( isSelected ){ active = 'active' }

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

        Action_Route(this.dataset.path);
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
