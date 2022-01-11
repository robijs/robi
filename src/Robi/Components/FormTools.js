import { Component } from '../Actions/Component.js'
import { EditLayout } from '../Actions/EditLayout.js'
import { ModifyFile } from '../Actions/ModifyFile.js'
import { Store } from '../Robi.js';

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export function FormTools(param) {
    const {
        form,
        list,
        parent,
        container,
        position
    } = param;

    let isOpen = false;

    const component = Component({
        html: /*html*/ `
            <div class='viewtools'>
                <button class='btn tools' type='button'>•••</button>
                <div class='grow-in-center'>
                    <!-- Add Field -->
                    <button class='dropdown-item add-table' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 48px;'>
                                <use href='#icon-bs-table'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px;'>Table</div>
                    </button>
                    <!-- Divider -->
                    <div class='dropdown-divider'></div>
                    <!-- Edit Layout -->
                    <button class='dropdown-item edit-layout' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 40px; fill: var(--color);'>
                                <use href='#icon-bs-grid-1x2'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px; color: var(--color);'>Edit Layout</div>
                    </button>
                    <!-- Edit Source -->
                    <button class='dropdown-item edit-source' type='button'>
                        <div class='icon-container'>
                            <svg class='icon' style='font-size: 40px; fill: var(--color);'>
                                <use href='#icon-bs-code'></use>
                            </svg>
                        </div>
                        <div style='font-weight: 700; margin-top: 10px; color: var(--color);'>Edit Source</div>
                    </button>
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

            #id .menu {

            }

            #id .grow-in-center {
                z-index: 10000;
                top: 5px;
                position: absolute;
                transform: scale(0);
                transform-origin: top;
                opacity: 0;
                transition: transform 150ms ease, opacity 150ms ease;
            }

            #id .grow-in-center.open {
                transform: scale(1);
                transform-origin: top;
                opacity: 1;
            }

            #id .dropdown-divider {
                height: unset;
                margin: .5rem;
                overflow: hidden;
                border-left: 2px solid var(--buttonBackground);
                border-top: none;
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

            #id .dropdown-item .icon {
                fill: var(--primary);
            }

            /* Border */
            #id .border {
                border: solid 2px var(--primary);
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

            .save-edit-layout,
            .cancel-edit-layout {
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

            .save-edit-layout {
                left: 0px;
            }

            .cancel-edit-layout {
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
                    this.classList.add('scale-up');

                    if (!isOpen) {
                        isOpen = true;

                        component.find('.grow-in-center').classList.add('open');
                        setTimeout(() => {
                            container.on('click', close);
                        }, 0);
                    } else {
                        close();
                    }
                }
            },
            {
                selector: '#id .edit-layout',
                event: 'click',
                listener(event) {
                    // Hide tools
                    component.find('.tools').classList.add('d-none');

                    // Add Save and Cancel buttons
                    component.append(/*html*/ `
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
                    component.find('.save-edit-layout').on('click', () => {
                        // Edit file
                        EditLayout({
                            order: [...container.findAll('.robi-row')].map(row => parseInt(row.dataset.row.split('-')[1])),
                            path: `App/src/Forms/${list}`,
                            file: `${form}.js`
                        });
                    });

                    // Cancel
                    component.find('.cancel-edit-layout').on('click', turnOfSortable);

                    // Turn off sortable
                    function turnOfSortable() {
                        // Reset order
                        [...container.findAll('.robi-row')]
                        .sort((a, b) => parseInt(a.dataset.row.split('row-')[1]) - parseInt(b.dataset.row.split('row-')[1]))
                        .forEach(row => row.parentElement.append(row));

                        setTimeout(() => {
                            $(`#${container.get().id}`).sortable('destroy');
                            $(`#${container.get().id} .robi-row > *`).css({'pointer-events': 'auto', 'user-select': 'auto'});
                        }, 0);

                        // Remove buttons
                        component.find('.edit-layout-buttons').remove();

                        // Show tools
                        component.find('.tools').classList.remove('d-none');
                    }

                    // Turn on sortable
                    $(`#${container.get().id}`).sortable({ items: '.robi-row' });
                    $(`#${container.get().id} .robi-row > *`).css({'pointer-events': 'none', 'user-select': 'none'});
                }
            },
            {
                selector: '#id .edit-source',
                event: 'click',
                listener(event) {
                    ModifyFile({
                        path: `App/src/Forms/${list}`,
                        file: `${form}.js`
                    });
                }
            }
        ],
        onAdd() {

        }
    });

    function close(event) {
        isOpen = false;

        component.find('.grow-in-center').classList.remove('open');
        component.find('.tools').classList.remove('scale-up');

        container.off('click', close);
    }

    return component;
}
// @END-File
