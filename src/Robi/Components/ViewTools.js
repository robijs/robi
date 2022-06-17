import { Component } from '../Actions/Component.js'
import { CreateFileForm } from '../Actions/CreateFileForm.js'
import { EditLayout } from '../Actions/EditLayout.js'
import { ModifyFile } from '../Actions/ModifyFile.js'
import { Store } from '../Core/Store.js'
import { GenerateUUID } from '../Robi.js'
import { ComponentTemplate } from '../Templates/ComponentTemplate.js'
import { ActionTemplate } from '../Templates/ActionTemplate.js'
import { Palette } from './Palette.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export function ViewTools(param) {
    const {
        route,
        parent,
        position
    } = param;

    let palette;

    const component = Component({
        html: /*html*/ `
            <div class='viewtools'>
                <div class='open-palette'>
                    <div class='bar'></div>
                    <div class='bar vertical'></div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                position: absolute;
                right: 0px;
                top: 0px;
                height: 62px;
                width: 62px;
                padding: 0px ;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            /* Button */
            #id .open-palette {
                position: relative;
                background-color: var(--secondary);
                display: flex;
                border-radius: 6px;
                transition: background-color 200ms ease-in-out;
                width: 36px;
                height: 36px;
            }

            #id .open-palette:hover {
                background-color: var(--button-background);
            }

            #id .bar {
                padding: 0;
                width: 16px;
                height: 2px;
                background-color: var(--primary);
                border-radius: 4px;
                transition: all 0.4s ease-in-out;
                position: absolute;
                top: calc(50% - 1px);
                left: calc(50% - 8px);
                transition: all 300ms ease-in-out;
            }

            #id .bar.vertical {
                transform: rotate(90deg);
            }

            #id .bar.arrow-bottom {
                transform: rotate(-45deg);
            }

            #id .bar.arrow-top {
                transform: rotate(45deg);
            }
        `,
        parent: Store.get('maincontainer'),
        position,
        events: [
            {
                selector: '#id .open-palette',
                event: 'click',
                listener(event) {
                    toggle();
                }
            },
            {
                selector: '#id .dropdown-item',
                event: 'click',
                listener(event) {
                    switch(this.dataset.tool) {
                        case 'component':
                            newFile({
                                template: ComponentTemplate,
                                dir: 'Components'
                            });
                            break;
                        case 'action':
                            newFile({
                                template: ActionTemplate,
                                dir: 'Actions'
                            });
                            break;
                        case 'table':
                            break;
                        case 'chart':
                            break;
                        case 'text':
                            break;
                        case 'btn-light':
                            break;
                        case 'btn-dark':
                            break;
                        case 'layout':
                            editLayout();
                            break;
                        case 'source':
                            editSource();
                            break;
                    }
                }
            }
        ],
        onAdd() {
            // FIXME: Remove before shipping
            open();
        }
    });

    function toggle() {
        // TODO: How do I abstract this into something like React's useRef or useState?
        if (palette) {
            close();
        } else {
            open();
        }
    }

    function open() {
        // Initialize
        palette = Palette({});
        palette.add();

        // Set store
        Store.add({
            name: 'palette',
            component: palette
        });

        // Animate bars
        component.find('.bar').classList.add('arrow-bottom');
        component.find('.bar.vertical').classList.add('arrow-top');
    }

    function close() {
        // Remove
        palette.close();
        palette = undefined;

        // Animate bars
        component.find('.bar').classList.remove('arrow-bottom');
        component.find('.bar.vertical').classList.remove('arrow-top');
    }

    function newFile({ template, dir}) {
        CreateFileForm({
            template,
            path: `src/Routes/${route.path}`,
            dir,
            addImportTo: route.path,
            parent
        });
    }

    function editLayout() {
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
        });

        // Cancel
        parent.find('.cancel-edit-layout').on('click', turnOfSortable);

        // Turn off sortable
        function turnOfSortable() {
            $(`#${parent.get().id} .robi-row`).removeClass('robi-row-transition');

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

            // TODO: Finish feature
            parent.find(`.add-row-${id}`).remove();
        }

        // Turn on sortable
        $(`#${parent.get().id} .robi-row`).addClass('robi-row-transition');
        $(`#${parent.get().id}`).sortable({ items: '.robi-row' });
        $(`#${parent.get().id} .robi-row > *`).css({'pointer-events': 'none', 'user-select': 'none'});

        // Add row button
        // TODO: Finish feature
        const id = GenerateUUID();
        parent.append(/*html*/ `
            <button class='btn btn-robi add-row-${id}'>
                Add row
            </button>
        `)
    }

    function editSource() {
        ModifyFile({
            path: `App/src/Routes/${route.path}`,
            file: `${route.path}.js`
        });
    }

    return component;
}
// @END-File
