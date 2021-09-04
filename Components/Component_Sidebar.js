/** Actions */
import Action_Component from '../Actions/Action_Component.js'
import Action_Store from '../Actions/Action_Store.js'
import Action_Route from '../Actions/Action_Route.js'

/** Components */
import Component_Tree from './Component_Tree.js'

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
            <div class='sidebar'>
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
                    <!-- Everyone can see Settings -->
                    <span class='nav ${(path === 'Settings') ? 'nav-selected' : ''} settings' data-path='Settings'>
                        <svg class='icon'><use href='#icon-cog'></use></svg>
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
                overflow: overlay;
                background: ${Setting_App.gradientColor ? `linear-gradient(${Setting_App.gradientColor})` : Setting_App.sidebarBackgroundColor};
                ${Setting_App.sidebarBorderColor ? `border-right: solid 1px ${Setting_App.sidebarBorderColor}` : ''}
            }

            /* Nav Container */
            .nav-container {
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: center;
            }

            .sidebar .nav {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                cursor: pointer;
                text-align: left;
                font-size: 1em;
                font-weight: 400;
                padding: 15px 14px;
                color: ${Setting_App.secondaryColor};
                border-left: solid 3px transparent;
                border-right: solid 3px transparent;
            }

            .sidebar .nav .icon {
                fill: ${Setting_App.sidebarTextColor};
                stroke: ${Setting_App.sidebarTextColor};
                font-size: 1.5em;
            }

            .sidebar .nav .text {
                color: ${Setting_App.sidebarTextColor};
                font-size: 1em;
                padding-left: 10px;
            }

            .sidebar .nav .icon:hover,
            .sidebar .nav-selected .icon {
                fill: ${Setting_App.sidebarTextColor};
                stroke: ${Setting_App.sidebarTextColor};
            }

            /* .sidebar .nav .icon {
                fill: white;
                stroke: white;
            }

            .sidebar .nav .text {
                color: white;
                font-size: .7em;
                padding-left: 10px;
            }

            .sidebar .nav .icon:hover,
            .sidebar .nav-selected .icon {
                fill: white;
                stroke: white;
            } *

            .sidebar .nav-selected {
                border-left: solid 3px ${Setting_App.secondaryColor};
            }

            /* Settings */
            .settings-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: start;
                justify-content: flex-end;
            }

            /* Logo */
            #id .logo {
                cursor: pointer;
                margin-top: 15px;
            }

            /* #id .logo {
                cursor: pointer;
                margin-top: 15px;
                background: url(${logo}) center;
                background-repeat: no-repeat;
                width: 100%;
                height: 120px;
                min-height: 120px;
                background-size: 120px;
            } */

            /* Drop down */
            #id .dropdown-container {
                padding: 15px 14px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            #id .dropdown-label {
                color: ${Setting_App.sidebarTextColor};
                font-size: 1.5em;
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
            
            /* @media (max-height: 780px) {
                #id * {
                    font-size: 11pt;
                }

                #id .logo {
                    width: 100%;
                    height: 100px;
                    min-height: 100px;
                    background-size: 100px;
                }
            } */
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
            }
        ]
    });

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

    component.addTree = (data) => {
        const tree = Component_Tree({
            data,
            parent
        });

        tree.add();
    }

    return component;
}
