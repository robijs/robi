/* RHC-C SharePoint Team | RHC-C Accountability Roster */

/** Actions */
import Action_Component from '../Actions/Action_Component.js'
import Action_Route from '../Actions/Action_Route.js'

/** Components */
import Component_Tree from './Component_Tree.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'
import Setting_Routes from '../Settings/Setting_Routes.js'

export default function Component_QPPSideBar(param) {
    const {
        parent,
        logo,
        path,
        dropdownItems
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='sidebar'>
                <div class='logo' data-path='${Setting_App.defaultRoute}'></div>
                <div>
                    <div>Fiscal Year</div>
                        <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            ${buildDropdown(dropdownItems)}
                        </div>
                    </div>
                </div>
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
            .sidebar {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                height: 100vh;
                background: ${Setting_App.gradientColor ? `linear-gradient(${Setting_App.gradientColor})` : Setting_App.primaryColor};
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
                align-items: center;
                width: 100%;
                cursor: pointer;
                text-align: left;
                font-size: 1.7em;
                font-weight: 400;
                padding: 15px 14px;
                color: ${Setting_App.secondaryColor};
                border-left: solid 3px transparent;
                border-right: solid 3px transparent;
            }

            .sidebar .nav .icon {
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
            }

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
                background: url(${logo}) center;
                background-repeat: no-repeat;
                width: 100%;
                height: 120px;
                background-size: 120px;
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
            }
        ]
    });

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
                    if (roles.includes(Setting_App.user.Role)) {
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
        items.map(item => {
            const {
                label,
                path
            } =  item;

            return /*html*/ ` 
                <a class="dropdown-item" target="_blank" href="${location.href.split('?')[0]}${path}">${label}</a>
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
