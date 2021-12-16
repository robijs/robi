import { Component } from '../Actions/Component.js'
import { UpdateItem } from '../Actions/UpdateItem.js'
import { Alert } from './Alert.js'
import { BootstrapButton } from './BootstrapButton.js'
import { Modal } from './Modal.js'
import { SingleLineTextField } from './SingleLineTextField.js'
import { App } from '../Core/App.js'
import { Store } from '../Core/Store.js'
import { GenerateUUID } from '../Robi.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function TableToolbar(param) {
    const {
        advancedSearch,
        action,
        list,
        options,
        parent,
        position,
        search
    } = param;

    const listInfo = App.lists().find(item => item.list === list);
    const userSettings = JSON.parse(Store.user().Settings);
    let savedSearches = userSettings.savedSearches.find(search => search.list === list)?.searches || [];
    // console.log(savedSearches);
    
    let open = false;
    let loaded;

    const component = Component({
        html: /*html*/ `
            <div class='btn-toolbar' role='toolbar'>
                ${
                    advancedSearch ? 
                    /*html*/ `
                        <button type='button' class='btn btn-robi-light mr-2 advanced-search'>Advanced search</button>
                    `                    
                    : ''   
                }
                <div class='btn-group' role='group'>
                    ${buildFilters()}
                </div>
                ${
                    advancedSearch ?
                    (() => {
                        const id = GenerateUUID();

                        return /*html*/ `
                            <div class='search-container search-container-grow height-0 opacity-0 pt-0 pb-0'>
                                ${searchRow(GenerateUUID())}
                                <!-- Buttons -->
                                <div class='d-flex justify-content-end run-search-container pt-2'>
                                    <div class='d-flex justify-content-start load-search-container' style='flex: 2;'>
                                        <button type='button' class='btn btn-robi-light' id="${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Load</button>
                                        <div class="dropdown-menu" aria-labelledby="${id}">
                                            <div class="grown-in-top-left saved-search-menu">
                                                ${
                                                    savedSearches.map(search => {
                                                        const { name } = search;

                                                        return /*html*/ `<button class="dropdown-item load-search" type="button">${name}</button>`;
                                                    }).join('\n')
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class='d-flex justify-content-end'>
                                        <button type='button' class='btn btn-robi-light save-search'>Save</button>
                                        <button type='button' class='btn btn-robi-reverse run-search'>Search</button>
                                    </div>
                                </div>
                            </div>
                        `;
                    })() : ''   
                }
            </div>
        `,
        style: /*css*/ `
            #id {
                align-items: center;
                justify-content: end;
                margin-bottom: 10px;
            }

            #id .btn-group {
                margin-bottom: 10px;
            }

            #id .btn {
                font-size: 13px;
            }

            #id .btn:focus,
            #id .btn:active {
                box-shadow: none ;
            }

            #id .ask-a-question {
                background: #e9ecef;
                color: ${App.get('primaryColor')};
                font-weight: 500;
            }
            
            #id .search-questions {
                background: #e9ecef !important;
                border-color: transparent;
                border-radius: 8px;
                min-width: 250px;
                min-height: 35px;
            }

            #id .btn-robi-primary {
                color: white;
                background: ${App.get('primaryColor')};
            }

            #id .btn-outline-robi-primary {
                color: ${App.get('primaryColor')};
                background-color: initial;
                border-color: ${App.get('primaryColor')};
            }

            /* Search */
            #id .advanced-search {
                transition: 300ms opacity ease;
                margin-bottom: 10px;
            }

            #id .search-container {
                border-radius: 20px;
                width: 100%;
                padding: 20px;
                background: ${App.get('backgroundColor')};
                transition: opacity 300ms ease, padding 300ms ease, height 300ms ease;
                height: 123px;
                overflow: hidden;
            }

            #id .input-group * {
                font-size: 13px;
            }

            #id .opacity-0 {
                opacity: 0 !important;
            }

            #id .height-0 {
                height: 0px !important;
            }

            /* Load menu */
            #id .dropdown-menu {
                background: transparent;
                border-radius: 10px;
                border: none;
                padding: none;
            }

            @keyframes grown-in-top-left {
                from {
                    transform: scale(0);
                    transform-origin: top left;
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    transform-origin: top left;
                    opacity: 1;
                }
            }

            .grown-in-top-left {
                animation: 150ms ease-in-out forwards grown-in-top-left;
                background: white;
                border-radius: 10px;
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                padding: .5rem;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .filter',
                event: 'click',
                listener(event) {
                    // Deselect all options
                    const currentSelected = component.find('.filter.btn-robi-primary');
                    currentSelected.classList.remove('btn-robi-primary');
                    currentSelected.classList.add('btn-outline-robi-primary');

                    // Select clicked button
                    this.classList.remove('btn-outline-robi-primary');
                    this.classList.add('btn-robi-primary');

                    action(this.innerText);
                }
            },
            {
                selector: '#id .advanced-search',
                event: 'click',
                listener(event) {
                    if (open) {
                        open = false;
                        event.target.innerText = 'Advanced search';
                        setTimeout(() => {
                            component.find('.search-container').classList.add('height-0', 'opacity-0', 'pt-0', 'pb-0');
                        }, 0);
                    } else {
                        open = true;
                        event.target.innerText = 'Close search'
                        setTimeout(() => {
                            component.find('.search-container').classList.remove('height-0', 'opacity-0', 'pt-0', 'pb-0');
                        }, 0);
                    }
                }
            },
            {
                selector: '#id .add-row',
                event: 'click',
                listener: addRow
            },
            {
                selector: '#id .load-search',
                event: 'click',
                listener: loadSearch
            },
            {
                selector: '#id .save-search',
                event: 'click',
                listener: saveSearch
            },
            {
                selector: '#id .run-search',
                event: 'click',
                listener: runSearch
            }
        ]
    });

    function runSearch(event) {
        const filters = [...component.findAll('.search-container .search-row')].map(row => {
            // Column
            const column = row.querySelector('[data-field="column"]').value;

            // Condition
            const condition = row.querySelector('[data-field="condition"]').value;

            // Value
            const value = row.querySelector('[data-field="value"]').value;

            // Operator
            const operator = row.querySelector('[data-field="operator"]')?.value || null;

            // Type
            const type = listInfo.fields.find(field => field.name === column)?.type

            return {
                column,
                condition,
                value,
                operator,
                type
            }
        });

        search({
            button: this,
            event,
            filters
        });
    }

    function saveSearch(event) {
        console.log('Save search');

        const modal = Modal({
            title: false,
            scrollable: true,
            async addContent(modalBody) {
                modalBody.classList.add('install-modal');
                // modal.find('.modal-dialog').style.maxWidth = 'fit-content';

                modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                    <h3 class='mb-3'>Save search</h3>
                `);

                // Search name
                const searchName = SingleLineTextField({
                    label: 'Name',
                    value: loaded,
                    parent: modalBody,
                    onKeyup(event) {
                        // canEnable();

                        // const name = searchName.value();
                        // showMessage(name);
                    },
                    onFocusout(event) {
                        // const name = searchName.value();
                        // showMessage(name);
                    }
                });

                searchName.add();

                const saveSearchBtn = BootstrapButton({
                    async action() {

                        //TODO: Show message if name empty
                        if (!searchName.value()) {
                            console.log('missing search name');
                            return;
                        }

                        console.log('Update Store.user().Settings.savedSearches');
                        
                        // Disable button
                        saveSearchBtn.get().disabled = true;
                        saveSearchBtn.get().innerHTML = /*html*/ `
                            <span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span> Saving search
                        `;

                        // Get rows
                        const rows = [...component.findAll('.search-container .search-row')].map(row => {
                            // Column
                            const column = row.querySelector('[data-field="column"]').value;

                            // Condition
                            const condition = row.querySelector('[data-field="condition"]').value;

                            // Value
                            const value = row.querySelector('[data-field="value"]').value;

                            // Operator
                            const operator = row.querySelector('[data-field="operator"]')?.value || null;

                            return {
                                column,
                                condition,
                                value,
                                operator
                            }
                        });

                        if (savedSearches.map(search => search.name).includes(searchName.value())) {
                            console.log('update existing search')
                            // Update existing search
                            savedSearches.find(item => item.name === searchName.value()).filters = filters;

                            console.log(savedSearches);
                        } else {
                            console.log('add new search')
                            // Add search
                            savedSearches.push({
                                name: searchName.value(),
                                filters: rows
                            });

                            console.log(savedSearches);
                        }

                        // Replace user Settings[list].savedSearches
                        userSettings.savedSearches[list] = savedSearches;

                        await UpdateItem({
                            itemId: Store.user().Id,
                            list: 'Users',
                            data: {
                                Settings: JSON.stringify(userSettings)
                            }
                        });

                        // Update saved search menu
                        component.find('.saved-search-menu').innerHTML = savedSearches.map(search => {
                            const { name } = search;

                            return /*html*/ `<button class="dropdown-item load-search" type="button">${name}</button>`;
                        }).join('\n');

                        // Add event listeners
                        component.findAll('.saved-search-menu .load-search').forEach(btn => btn.addEventListener('click', loadSearch));
     
                        modal.close();
                    },
                    classes: ['w-100 mt-3'],
                    width: '100%',
                    parent: modalBody,
                    type: 'robi',
                    value: 'Save'
                });

                saveSearchBtn.add();

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

                let pathExists;

                // Show message if path already exists
                function showMessage(value) {
                    if (savedSearches.map(search => search.name).includes(value)) {
                        // Show message
                        if (!pathExists) {
                            pathExists = Alert({
                                type: 'danger',
                                text: `Saved search with name <strong>${value}</strong> already exists`,
                                classes: ['alert-in', 'w-100'],
                                top: searchName.get().offsetHeight + 5,
                                parent: searchName
                            });

                            pathExists.add();
                        }
                    } else {
                        // Remove message
                        if (pathExists) {
                            pathExists.remove();
                            pathExists = null;
                        }
                    }
                }

                // Check if all fields are filled out and path doesn't already exist
                function canEnable() {
                    if ( searchName.value() !== '' && !savedSearches.map(search => search.name).includes(searchName.value()) ) {
                        saveSearchBtn.enable();
                    } else {
                        saveSearchBtn.disable();
                    }
                }

                // FIXME: Experimental. Not sure if this will work everytime.
                setTimeout(() => {
                    searchName.focus();
                }, 500);
            },
            centered: true,
            showFooter: false,
        });

        modal.add();
    }

    function loadSearch(event) {
        const searchName = event.target.innerText;
        const filters = savedSearches.find(search => search.name == searchName)?.filters;

        // Set loaded
        loaded = searchName;

        // Set height
        // base height + (row height * number of rows ) 
        const height = 81.5 + (41.5 * filters.length);
        component.find('.search-container').style.height = `${height}px`;

        // Empty search
        component.findAll('.search-row').forEach(row => row.remove());

        // Add buttons
        const editSearchContainer = component.find('.edit-search-container');

        if (!editSearchContainer) {
            // component.find('.search-container').insertAdjacentHTML('afterbegin', /*html*/ `
            //     <!-- Buttons -->
            //     <div class='d-flex justify-content-end mb-4 edit-search-container'>
            //         <div class='d-flex justify-content-start' style='flex: 2;'>
            //             <!-- <button type='button' class='btn btn-robi-light delete-search'>Delete</button> -->
            //             <button type='button' class='btn btn-robi delete-search'>
            //                 <svg class="icon" style="font-size: 16px; fill: ${App.get('primaryColor')};">
            //                     <use href="#icon-bs-trash"></use>
            //                 </svg>
            //             </button>
            //         </div>
            //         <div class='d-flex justify-content-end'>
            //             <button type='button' class='btn btn-robi new-search'>New search</button>
            //         </div>
            //     </div>
            // `);
            component.find('.load-search-container').insertAdjacentHTML('beforeend', /*html*/ `
                <!-- Buttons -->
                <div class='d-flex justify-content-end edit-search-container'>
                    <button type='button' class='btn btn-robi mr-2 delete-search'>
                        <!--<svg class="icon" style="font-size: 16px; fill: ${App.get('primaryColor')};">
                            <use href="#icon-bs-trash"></use>
                        </svg> -->
                        Delete
                    </button>
                    <div class='d-flex justify-content-end'>
                        <button type='button' class='btn btn-robi new-search'>New</button>
                    </div>
                </div>
            `);

            // Add event listerners
            component.find('.edit-search-container .delete-search').addEventListener('click', deleteSearch)
            component.find('.edit-search-container .new-search').addEventListener('click', newSearch)
        }

        // Add rows
        filters.forEach(row => {
            const { column, condition, value, operator } = row;
            const id = GenerateUUID();

            const html = /*html*/ `
                <!-- Row -->
                <div class='d-flex mb-2 search-row' data-rowid='${id}'>
                    <!-- Column -->
                    <div class="input-group mr-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Column</div>
                        </div>
                        <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='column'>
                            ${
                                listInfo.fields
                                .sort((a, b) => a.display - b.display)
                                .map(field => {
                                    const { display, name } = field;
                                    return /*html*/ `<option value='${name}'${name === column ? ' selected' : ''}>${display || name}</option>`;
                                }).join('\n')
                            }
                        </select>
                    </div>
                    <!-- Condition -->
                    <div class="input-group mr-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Condition</div>
                        </div>
                        <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='condition'>
                            <option value='contains'${'contains' === condition ? ' selected' : ''}>contains</option>
                            <option value='equals'${'equals' === condition ? ' selected' : ''}>equals</option>
                            <option value='not equal to'${'not equal to' === condition ? ' selected' : ''}>not equal to</option>
                        </select>
                    </div>
                    <!-- Value -->
                    <input type="text" class="form-control w-auto" style='flex: 2;' placeholder="value" value='${value}' data-field='value'>
                    <!-- Operator -->
                    ${
                        operator ?
                        /*html*/ `
                            <select class="custom-select ml-2 w-auto" style='border-radius: 10px; font-size: 13px;' data-field='operator'>
                                <option value='AND'${'AND' === operator ? ' selected' : ''}>AND</option>
                                <option value='OR'${'OR' === operator ? ' selected' : ''}>OR</option>
                            </select>
                        ` : ''
                    }
                    <!-- Add row -->
                    <button type='button' class='btn btn-robi p-1 ml-2 ${operator ? 'remove-row' : 'add-row'}'>
                        <svg class="icon" style="font-size: 22px; fill: ${App.get('primaryColor')};"><use href="#icon-${operator ? 'bs-dash-circle-fill' : 'bs-plus'}"></use></svg>
                    </button>
                </div>
            `
            component.find('.run-search-container').insertAdjacentHTML('beforebegin', html);

            // Add event listener
            if (operator) {
                component.find(`.search-row[data-rowid='${id}'] .remove-row`).addEventListener('click', () => removeRow(id));
            } else {
                component.find(`.search-row[data-rowid='${id}'] .add-row`).addEventListener('click', addRow);
            }
        });
    }

    function deleteSearch(event) {
        console.log('delete search');
    }

    function newSearch(event) {
        console.log('new search');
    }

    function addRow(event) {
        // Id
        const id = event.target.closest('.search-row').dataset.rowid;

        // Button clicked
        const button = component.find(`.search-row[data-rowid='${id}'] .add-row`);

        // Add ADD/OR select
        button.insertAdjacentHTML('beforebegin', /*html*/ `
            <select class="custom-select ml-2 w-auto" style='border-radius: 10px; font-size: 13px;' data-field='operator'>
                <option value='AND'>AND</option>
                <option value='OR'>OR</option>
            </select>
        `);

        // Modify button icon
        button.removeEventListener('click', addRow);
        button.addEventListener('click', () => removeRow(id));
        button.classList.remove('add-row');
        button.classList.add('remove-row');
        button.innerHTML = /*html*/ `
            <svg class="icon" style="font-size: 22px; fill: ${App.get('primaryColor')};"><use href="#icon-bs-dash-circle-fill"></use></svg>
        `;

        // Add row
        const newId = GenerateUUID();

        component.find('.search-container').style.height = `${component.find('.search-container').getBoundingClientRect().height + 41.5}px`;
        component.find('.run-search-container').insertAdjacentHTML('beforebegin', searchRow(newId));
        component.find(`.search-row[data-rowid='${newId}'] .add-row`).addEventListener('click', addRow);
    }
    
    function removeRow(id) {
        // console.log(id);

        // Adjust height
        component.find('.search-container').style.height = `${component.find('.search-container').getBoundingClientRect().height - 41.5}px`;
        
        // Remove row
        component.find(`.search-row[data-rowid='${id}']`).remove();
    }

    function searchRow(id) {
        return /*html*/ `
            <!-- Row -->
            <div class='d-flex mb-2 search-row' data-rowid='${id}'>
                <!-- Column -->
                <div class="input-group mr-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">Column</div>
                    </div>
                    <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='column'>
                        ${
                            listInfo.fields
                            .sort((a, b) => a.display - b.display)
                            .map(field => {
                                const { display, name } = field;
                                return /*html*/ `<option value='${name}'>${display || name}</option>`;
                            }).join('\n')
                        }
                    </select>
                </div>
                <!-- Condition -->
                <div class="input-group mr-2">
                    <div class="input-group-prepend">
                        <div class="input-group-text">Condition</div>
                    </div>
                    <select class="custom-select" style='border-top-right-radius: 10px; border-bottom-right-radius: 10px;' data-field='condition'>
                        <option value='contains'>contains</option>
                        <option value='equals'>equals</option>
                        <option value='not equal to'>not equal to</option>
                    </select>
                </div>
                <!-- Value -->
                <input type="text" class="form-control w-auto" style='flex: 2;' placeholder="value" data-field='value'>
                <!-- Add row -->
                <button type='button' class='btn btn-robi p-1 ml-2 add-row'>
                    <svg class="icon" style="font-size: 22px; fill: ${App.get('primaryColor')};"><use href="#icon-bs-plus"></use></svg>
                </button>
            </div>
        `;
    }

    function buildFilters() {
        return options.map((option, index) => {
            const { label } = option;
            return /*html*/ `
                <button type='button' class='btn ${index === 0 ? 'btn-robi-primary' : 'btn-outline-robi-primary'} filter'>${label}</button>
            `;
        }).join('\n');
    }

    return component;
}
// @END-File
