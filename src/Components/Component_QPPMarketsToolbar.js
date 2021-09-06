/** Actions */
import Action_Component from '../Actions/Action_Component.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default function Component_QPPMarketsToolbar(param) {
    const {
        margin,
        parent,
        onFilter,
        onSearch,
        onClear,
        onSelect,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='btn-toolbar mb-3' role='toolbar' aria-label='Toolbar with button groups'>
                <div class='input-group'>
                    <!-- <input class='form-control mr-sm-2' type='search' data-toggle='dropdown' placeholder='Search markets and facilites' aria-label='Search'> -->
                    <div class='toggle-search-list' data-toggle='dropdown' aria-haspopup="true" aria-expanded="false">
                        <input class='form-control mr-sm-2' type='search' placeholder='Search markets and facilites' aria-label='Search'>
                    </div>
                    <div class='dropdown-menu'>
                    </div>
                </div>    
                <!-- <div class='toolbar-title'>Filter by</div> -->
                <div class='btn-group mr-2' role='group' aria-label='First group'>
                    <button type='button' class='btn btn-primary filter'>All</button>
                    <button type='button' class='btn btn-success filter'>Approved</button>
                    <button type='button' class='btn btn-warning filter'>In Progress</button>
                    <button type='button' class='btn btn-danger filter'>Not Started</button>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px'};
                align-items: center;
                width: 100%;
            }

            #id .form-inline {
                flex-flow: initial;
            }

            #id .toggle-search-list {
                margin-right: .5rem;
            }

            #id input[type='search'] {
                min-width: 250px;
                border-radius: .25rem;
            }

            /** Override Bootstrap input element active/focus style */
            #id input:active,
            #id input:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 1px ${Setting_App.primaryColor};
            }

            /** Dropdown */
            #id .dropdown-header {
                color: ${Setting_App.primaryColor}
            }

            #id .dropdown-menu {
                margin-top: 5px;
                max-height: 50vh;
                overflow-y: overlay;
            }

            #id .dropdown-menu::-webkit-scrollbar-track {
                background: white;
            }
            
            #id .dropdown-item {
                cursor: pointer;
            }

            #id .dropdown-item:focus,
            #id .dropdown-item:hover {
                color: #16181b;
                text-decoration: none;
                background-color: rgba(${Setting_App.primaryColorRGB}, .1);
            }

            #id .toolbar-title {
                font-size: 1rem;
                font-weight: 500;
                margin-right: 10px;
            }

            #id.btn-toolbar {
                flex-wrap: nowrap;
                justify-content: space-between;
            }

            #id .btn {
                white-space: nowrap;
            }

            /** Override btn-outline-warning */
            .btn-outline-warning {
                color: #856404;
                border-color: #856404;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .filter',
                event: 'click',
                listener(event) {
                    onFilter(event.target.innerText);
                }
            },
            {
                selector: `#id .toggle-search-list`,
                event: 'keydown',
                listener(event) {
                    console.log(event.key);

                    if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') &&  !component.find('.dropdown-menu').classList.contains('show')) {
                        event.preventDefault();
                        event.stopPropagation();

                        return false;
                    }
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'keyup',
                listener(event) {
                    if (!event.target.value) {
                        if (component.find('.dropdown-menu').classList.contains('show')) {
                            component.find('.toggle-search-list').click();
                        }

                        return;
                    }
                    
                    onSearch(event.target.value.toLowerCase());
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'click',
                listener(event) {
                    event.stopPropagation();
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'search',
                listener: onClear
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'keydown',
                listener(event) {
                    if (event.key === 'Escape' || event.key === 'Backspace') {
                        component.find('.toggle-search-list').click();
                        component.find(`input[type='search']`).focus();

                        event.preventDefault();

                        return false;
                    }

                    if (event.key === 'Enter') {
                        onSelect(event);
                    }
                }
            },
            {
                selector: `#id .dropdown-menu`,
                event: 'click',
                listener(event) {
                    onSelect(event);
                }
            },
            // {
            //     selector: `#id .dropdown-menu`,
            //     event: 'keypress',
            //     listener(event) {
            //         if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            //             event.preventDefault();

            //             const items = [...component.findAll('.dropdown-item')];
            //             const index = items.indexOf(event.target);

            //             console.log(index, items);
            //         }
            //     }
            // }
        ]
    });

    function dropdownItemTemplate(item) {
        const {
            label,
            path
        } = item;

        return /*html*/ `
            <a href='javascript:void(0)' class='dropdown-item' data-path='${path}'>${label}</a>
        `;
    }

    component.showSearchList = (param) => {
        const {
            items
        } = param;

        const {
            markets,
            facilities
        } = items;

        // console.log(items);

        /** Check if items exist*/
        if (markets.length > 0 || facilities.length > 0) {
            /** Show if not open  */
            if (!component.find('.dropdown-menu').classList.contains('show')) {
                component.find('.toggle-search-list').click();
            }

            let html = /*html*/ `
                <h6 class='dropdown-header'>Markets</h6>
            `;

            if (markets.length > 0) {
                html += markets.map(market => dropdownItemTemplate(market)).join('\n')
            }

            if (facilities.length > 0) {
                html += /*html*/ `
                    <div class="dropdown-divider"></div>
                    <h6 class='dropdown-header'>Facilities</h6>
                `;
                
                html += facilities.map(facility => dropdownItemTemplate(facility)).join('\n')
            }

            // console.log(html);

            component.find('.dropdown-menu').innerHTML = html;
        } else {
            if (component.find('.dropdown-menu').classList.contains('show')) {
                component.find('.toggle-search-list').click();
            }
        }
    }

    return component;
}