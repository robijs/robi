/** Actions */
import Action_Component from '../Actions/Action_Component.js'
import Action_Route from '../Actions/Action_Route.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/**
 * 
 * @param {object} param 
 * 
 * @example Component_Title({
 *     title: 'Test',
 *     parent: someOtherComponent
 * });
 * 
 * @returns {Object} Component.
 */
export default function Component_Title(param) {
    const {
        title,
        subTitle,
        breadcrumb,
        dropdownGroups,
        maxTextWidth,
        route,
        margin,
        parent,
        position,
        date,
        type
    } = param;

    /**
     * @todo show ticking time
     */
    const component = Action_Component({
        html: /*html*/ `
            <div class='title ${type || ''}'>
                <div class='title-subtitle'>
                    <h1 class='app-title'>${title}</h1>
                    ${subTitle !== undefined ? `<h2>${subTitle}</h2>` : ''}
                    ${
                        breadcrumb !== undefined ? 
                        /*html*/ `
                            <h2 ${dropdownGroups && dropdownGroups.length ? `style='margin-right: 0px;'` : '' }>
                                ${buildBreadcrumb(breadcrumb)}
                                ${dropdownGroups && dropdownGroups.length ? `<span class='_breadcrumb-spacer'>/</span>` : '' }
                                ${
                                    dropdownGroups && dropdownGroups.length ?
                                    /*html*/ `
                                        ${buildDropdown(dropdownGroups)}
                                    ` :
                                    ''
                                }
                            </h2>
                        ` :
                        ''
                    }
                </div>
                ${date !== undefined ? `<div class='title-date'>${date}</div>` : ''}
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px'};
            }

            #id .app-title {
                cursor: pointer;
            }

            #id .title-subtitle {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: baseline;
            }

            #id.title h1 {
                font-size: 1.7em;
                font-weight: 500;
                color: ${Setting_App.primaryColor};
                margin-top: 0px;
                margin-bottom: 10px;
            }

            #id.title h2 {
                font-size: 1.2em;
                font-weight: 400;
                color: ${Setting_App.primaryColor};
                margin: 0px;
            }

            #id.title .title-date {
                font-size: 13px;
                font-weight: 400;
                color: ${Setting_App.primaryColor};
                margin: 0px;
            }

            #id.title .title-date * {
                color: ${Setting_App.primaryColor};
            }

            #id.across {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: baseline;
                flex-wrap: wrap;
                white-space: nowrap;
            }

            #id.across h2 {
                margin: 0px 50px;
            }

            /** Breadcrumb */
            #id ._breadcrumb {
                color: darkslategray;
            }

            #id .route {
                cursor: pointer;
                color: #007bff;
            }

            #id .route:hover {
                color: #0056b3;
            }

            #id .current-page {
                color: darkslategray;
            }

            /** Dropdown */
            #id .dropdown-menu {
                margin-top: 5px;
                max-height: 75vh;
                overflow-y: auto;
            }

            #id .dropdown-item {
                cursor: pointer;
            }

            #id .nav {
                display: inline-flex;
            }

            #id .nav-link {
                padding: 0px;
                overflow: hidden;
                text-overflow: ellipsis;
                /** max-width: ${maxTextWidth || '455px'}; **/
                line-height: normal;
            }

            #id .nav-pills .show > .nav-link {
                color: #007bff;
                background-color: initial;
            }

            #id .no-menu [role=button] {
                cursor: initial;
            }

            #id .no-menu .dropdown-toggle,
            #id .no-menu .nav-pills .show > .nav-link {
                color: ${Setting_App.primaryColor};
            }

            #id .no-menu .dropdown-toggle::after {
                display: none;
            }

            #id .no-menu .dropdown-menu {
                display: none;
            }

            @media (max-width: 1366px) {
                #id.title h2 {
                    font-size: 1.3em;
                }
            }

            @media (max-width: 1024px) {
                #id.title h1 {
                    font-size: 2em;
                }
    
                #id.title h2 {
                    font-size: 1.1em;
                }
    
                #id.title .title-date {
                    font-size: 1em;
                }

                #id.across h2 {
                    margin: 0px 45px;
                }

                #id .nav-link {
                    max-width: 200px;
                }
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .app-title',
                event: 'click',
                listener(event) {
                    Action_Route('Home');
                }
            },
            {
                selector: '#id .route',
                event: 'click',
                listener: goToRoute
            }
        ]
    });

    function buildBreadcrumb(breadcrumb) {
        if (!Array.isArray(breadcrumb)) {
            return '';
        }

        return breadcrumb.map(part => {
            const {
                label,
                path,
                currentPage
            } = part;

            return /*html*/ `
                <span class='_breadcrumb ${currentPage ? 'current-page': 'route'}' data-path='${path}'>${label}</span>
            `;
        }).join(/*html*/ `
            <span class='_breadcrumb-spacer'>/</span>
        `);
    }

    function buildDropdown(dropdownGroups) {
        return dropdownGroups
        .map(dropdown => dropdownTemplate(dropdown))
        .join(/*html*/ `
            <span class='_breadcrumb-spacer'>/</span>
        `);
    }

    function dropdownTemplate(dropdown) {
        const {
            name,
            dataName,
            items
        } = dropdown;

        let html = /*html*/ `
            <span data-name='${dataName || name}' class='${items.length === 0 ? 'no-menu' : ''}'>
                <ul class='nav nav-pills'>
                    <li class='nav-item dropdown'>
                        <a class='nav-link dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false'>${name}</a>
                        <div class='dropdown-menu'>
        `;
        
        items.forEach(part => {
            const {
                label,
                path
            } = part;

            html += /*html*/ `
                <span class='dropdown-item route' data-path='${path}'>${label}</span>
            `;
        });

        html += /*html*/ `
                        </div>
                    </li>
                </ul>
            </span>
        `;

        return html;
    }

    function goToRoute(event) {
        if (route) {
            console.log(event.target.dataset.path);
         
            route(event.target.dataset.path);
        }
    }

    /** Only works if dropdown already exists */
    component.updateDropdown = (param) => {
        const {
            name,
            replaceWith
        } = param;

        const node = component.find(`span[data-name='${name}']`);

        if (node) {
            node.insertAdjacentHTML('afterend', dropdownTemplate(replaceWith));

            component.findAll(`span[data-name='${replaceWith.dataName || replaceWith.name}'] .route`).forEach(route => {
                route.addEventListener('click', goToRoute);
            });

            node.remove();
        }
    }

    component.setDisplayText = (text) => {
        const title = component.find('h1');

        title.innerHTML = text;
    }

    component.setSubtitle = (text) => {
        const title = component.find('h2');

        title.innerHTML = text;
    }

    component.setDate = (text) => {
        const title = component.find('.title-date');

        title.innerHTML = text;
    }

    return component;
}