import { Component } from '../Actions/Component.js'
import { GenerateUUID } from '../Actions/GenerateUUID.js'
import { EditLayout } from '../Actions/EditLayout.js'
import { ModifyFile } from '../Actions/ModifyFile.js'
import { Store } from '../Robi.js';

// @START-File
/**
 * 
 * @param {Object} param - Object passed in as only argument to a Robi component
 * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. 
 * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.
 * @returns {Object} - Robi component.
 */
export function ViewTools(param) {
    const {
        route,
        parent,
        position
    } = param;

    const id = GenerateUUID();

    const component = Component({
        html: /*html*/ `
            <div class=''>
                <!-- data-offset = -758px (dropdown-menu width / 2) + 25px (button width / 2) -->
                <button class='btn tools' type='button' id='${id}' data-toggle='dropdown' data-offset='-404px + 25px, -1px' aria-haspopup='true' aria-expanded='false'>
                    •••
                </button>
                <div class='dropdown-menu' aria-labelledby='${id}'>
                    <div class='grown-in-center'>
                        <!-- Add Table -->
                        <button class='dropdown-item add-table' type='button'>
                            <div class='table-icon'>
                                <div class='filter d-flex justify-content-end'>
                                    <div class='btn-group ml-1' role='group'>
                                        <div type='button' class='btn btn-robi-reverse'></div>
                                        <div type='button' class='btn btn-outline-robi'></div>
                                        <div type='button' class='btn btn-outline-robi'></div>
                                    </div>
                                </div>
                                <div class='rows'>
                                    <div class='table-icon-row'></div>
                                    <div class='table-icon-row'></div>
                                    <div class='table-icon-row'></div>
                                </div>
                            </div>
                            <div style='font-weight: 700; margin-top: 10px;'>Table</div>
                        </button>
                        <!-- Add Chart -->
                        <button class='dropdown-item add-chart' type='button'>
                            <div class='icon-container'>
                                <svg class='icon' style='font-size: 48px;'>
                                    <use href='#icon-bs-bar-chart'></use>
                                </svg>
                            </div>
                            <div style='font-weight: 700; margin-top: 10px;'>Chart</div>
                        </button>
                        <!-- Add Text Block -->
                        <button class='dropdown-item add-text-block' type='button'>
                            <div class='icon-container'>
                                <span style='font-size: 28; font-weight: 600; color: var(--primary);'>Aa</span>
                            </div>
                            <div style='font-weight: 700; margin-top: 10px;'>Text block</div>
                        </button>
                        <!-- Add Light Button -->
                        <button class='dropdown-item add-button-light' type='button'>
                            <div class='icon-container '>
                                <div class='btn btn-robi'>Button</div>
                            </div>
                            <div style='font-weight: 700; margin-top: 10px;'>Light</div>
                        </button>
                        <!-- Add Dark Button -->
                        <button class='dropdown-item add-button-dark' type='button'>
                            <div class='icon-container'>
                                <div class='btn btn-robi-reverse'>Button</div>
                            </div>
                            <div style='font-weight: 700; margin-top: 10px;'>Dark</div>
                        </button>
                        <!-- Divider -->
                        <div class='dropdown-divider'></div>
                        <!-- Edit Layout -->
                        <button class='dropdown-item edit-layout' type='button'>
                            <div class='icon-container'>
                                <svg class='icon' style='font-size: 40px;'>
                                    <use href='#icon-bs-grid-1x2'></use>
                                </svg>
                            </div>
                            <div style='font-weight: 700; margin-top: 10px;'>Edit Layout</div>
                        </button>
                        <!-- Edit Source -->
                        <button class='dropdown-item edit-source' type='button'>
                            <div class='icon-container'>
                                <svg class='icon' style='font-size: 40px;'>
                                    <use href='#icon-bs-code'></use>
                                </svg>
                            </div>
                            <div style='font-weight: 700; margin-top: 10px;'>Edit Source</div>
                        </button>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0px;
                right: 0px;
                height: 62px;
                width: 100%;
                color: var(--primary);
            }

            #id .tools {
                cursor: pointer;
                color: var(--primary);
                font-size: 20px;
                transition: transform 300ms ease, background-color 250ms ease;
                padding: 6px 11.82px; /* sets button width to an even 50px */
            }

            #id .scale-up {
                transform: scale(2);
            }

            #id .dropdown-menu {
                background: transparent;
                border-radius: 10px;
                border: none;
                padding: 0px;
                min-width: 0px;
            }

            #id .dropdown-divider {
                height: unset;
                margin: .5rem;
                overflow: hidden;
                border-left: 2px solid var(--buttonBackground);
            }

            #id .dropdown-item {
                position: relative;
                display: flex;
                flex-direction: column;
                color: var(--primary);
                align-items: center;
                justify-content: center;
                padding: 10px;
                border-radius: 20px;
                transition: filter 300ms ease, background-color 150ms ease;
            }

            #id .dropdown-menu .dropdown-item .icon {
                fill: var(--primary);
            }

            /* Border */
            #id .border {
                border: solid 2px var(--primary);
            }

            /* Add table */
            #id .table-icon {
                border-radius: 20px;
                padding: 10px 15px;
                width: 90px;
            }

            #id .table-icon .filter .btn {
                padding: 0px;
                height: 9px;
                width: 15px;
            }
            
            #id .table-icon .filter .btn:first-child {
                border-radius: 3px 0px 0px 3px;
            }

            #id .table-icon .filter .btn:last-child {
                border-radius: 0px 3px 3px 0px;
            }

            #id .table-icon .filter .btn-outline-robi {
                border-width: 3px;
            }

            #id .rows {
                margin-top: 3px;
                border-radius: 4px;
                border: solid 3px var(--primary);
            }

            #id .rows .table-icon-row:last-child {
                height: 7px;
            }

            #id .rows .table-icon-row:not(:last-child) {
                height: 10px;
                border-bottom: solid 3px var(--primary);
            }

            #id .columns {
                padding: 2px 4px 0px 4px;
            }

            #id .columns .column {
                flex: 1;
                height: 2px;
                border-radius: 2px;
                margin: 2px 0px;
                background: var(--primary);
            }

            #id .columns .column:not(:last-child) {
                margin-right: 5px;
            }

            #id .icon-container {
                border-radius: 20px;
                padding: 10px;
                width: 90px;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }

            #${parent.get().id} .save-edit-layout,
            #${parent.get().id} .cancel-edit-layout {
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0px;
                height: 62px;
                padding: 0px 15px;
                border-radius: 10px;
            }

            #${parent.get().id} .save-edit-layout {
                left: 0px;
            }

            #${parent.get().id} .cancel-edit-layout {
                right: 0px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .tools',
                event: 'click',
                listener(event) {
                    event.target.classList.add('scale-up');
                }
            },
            {
                selector: '#id .edit-layout',
                event: 'click',
                listener(event) {
                    // Disable sidebar
                    Store.get('sidebar').get().style.pointerEvents = 'none';

                    // Hide tools
                    component.find('.tools').classList.add('d-none');

                    // Add Save and Cancel buttons
                    parent.append(/*html*/ `
                        <div class='edit-layout-buttons'>
                            <div class='save-edit-layout'>
                                <button type='button' class='btn'>
                                    <span style='color: var(--primary); font-size: 15px; font-weight: 500;'>Save</span>
                                </button>
                            </div>
                            <div class='cancel-edit-layout'>
                                <button type='button' class='btn'>
                                    <span style='color: var(--primary); font-size: 15px; font-weight: 500;'>Cancel</span>
                                </button>
                            </div>
                        </div>
                    `);

                    // Save
                    parent.find('.save-edit-layout').on('click', () => {
                        // Edit file
                        EditLayout({
                            order: [...parent.findAll('.robi-row')].map(row => parseInt(row.dataset.row.split('-')[1])),
                            path: `App/src/Routes/${route.path}`,
                            file: `${route.path}.js`
                        });

                        turnOfSortable();
                    });

                    // Cancel
                    // parent.find('.cancel-edit-layout').addEventListener('click', turnOfSortable);
                    parent.find('.cancel-edit-layout').on('click', turnOfSortable);

                    // Turn off sortable
                    function turnOfSortable() {
                        // Reset order
                        [...parent.findAll('.robi-row')]
                        .sort((a, b) => parseInt(a.dataset.row.split('row-')[1]) - parseInt(b.dataset.row.split('row-')[1]))
                        .forEach(row => parent.get().append(row));

                        setTimeout(() => {
                            $(`#${parent.get().id}`).sortable('destroy');
                            $(`#${parent.get().id} .robi-row > *`).css({'pointer-events': 'auto', 'user-select': 'auto'});
                        }, 0);

                        // Remove buttons
                        parent.find('.edit-layout-buttons').remove();

                        // Show tools
                        component.find('.tools').classList.remove('d-none');

                        // Enable sidebar
                        Store.get('sidebar').get().style.pointerEvents = 'all';
                    }

                    // Turn on sortable
                    $(`#${parent.get().id}`).sortable({ items: '.robi-row' });
                    $(`#${parent.get().id} .robi-row > *`).css({'pointer-events': 'none', 'user-select': 'none'});
                }
            },
            {
                selector: '#id .edit-source',
                event: 'click',
                listener(event) {
                    ModifyFile({
                        path: `App/src/Routes/${route.path}`,
                        file: `${route.path}.js`
                    });
                }
            }
        ],
        onAdd() {
            $(`#${component.get().id}`).on('hidden.bs.dropdown', function () {
                component.find('.tools').classList.remove('scale-up');
            });
        }
    });

    return component;
}
// @END-File
