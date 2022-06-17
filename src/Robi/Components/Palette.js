import { Component } from '../Actions/Component.js'
import { CreateFileForm } from '../Actions/CreateFileForm.js'
import { EditLayout } from '../Actions/EditLayout.js'
import { ModifyFile } from '../Actions/ModifyFile.js'
import { Store } from '../Core/Store.js'
import { GenerateUUID } from '../Robi.js'
import { ComponentTemplate } from '../Templates/ComponentTemplate.js'
import { ActionTemplate } from '../Templates/ActionTemplate.js'

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export function Palette(param) {
    const {
        route,
        parent,
        position
    } = param;

    const width = 250;
    /*
        Layout
        Robi
        Controls
        Fields
        New
    */
    const componentLibrary = [
        {
            title: 'Layout',
            items: [
                {
                    name: 'Cell',
                    icon: 'bs-square'
                },
                {
                    name: 'Grid',
                    icon: 'bs-grid'
                },
            ]
        },
        {
            title: 'Robi',
            items: [
                {
                    name: 'Table',
                    icon: 'bs-table'
                },
                {
                    name: 'Chart',
                    icon: 'bs-bar-chart'
                },
                // {
                //     name: 'Modal',
                //     icon: 'bs-stop-btn'
                // }
            ]
        },
        {
            title: 'Controls',
            items: [
                {
                    name: 'Button',
                    html: /*html*/ `
                        <div class='btn btn-robi'>B</div>
                    `
                },
                {
                    name: 'Checkbox',
                    // icon: 'bs-check2-square'
                    html: /*html*/ `
                        <div class='custom-control custom-checkbox'>
                            <input type='checkbox' class='custom-control-input' id='palette-example' checked>
                            <label class='custom-control-label' for='palette-example'></label>
                        </div>
                    `
                },
                {
                    name: 'Switch',
                    // icon: 'toggles'
                    html: /*html*/ `
                        <div class='custom-control custom-switch'>
                            <input type='checkbox' class='custom-control-input' id='customSwitch1' checked>
                            <label class='custom-control-label' for='customSwitch1'></label>
                        </div>
                    `
                },
            ]
        },
        {
            title: 'Fields',
            items: [
                {
                    name: 'Text',
                    icon: 'bs-input-cursor'
                },
                {
                    name: 'Number',
                    icon: 'bs-input-cursor'
                },
                {
                    name: 'Multi Line Text',
                    icon: 'bs-textarea-resize'
                },
                {
                    name: 'Choice',
                    icon: 'bs-menu-button-wide'
                },
                {
                    name: 'Multi Choice',
                    icon: 'bs-checks'
                },
                {
                    name: 'Date',
                    icon: 'bs-calendar3-event'
                },
            ]
        },
        {
            title: 'New',
            cursor: 'pointer',
            items: [
                {
                    name: 'Component',
                    icon: 'bs-file-code'
                },
                {
                    name: 'Action',
                    icon: 'bs-file-code'
                }
            ]
        }
    ]

    const component = Component({
        html: /*html*/ `
            <div class='palette'>
                <div class='title'>Component Library</div>
                ${
                    componentLibrary.map(({ title, cursor, items }) => {
                        return /*html*/ `
                            <div class='group'>
                                <div class='title'>${title}</div>
                                <div class='items'>
                                    ${
                                        items.map(({ name, icon, html }) => {
                                            return /*html*/ `
                                                <div class='item ${cursor || ''}' draggable='true'>
                                                    ${
                                                        icon ? 
                                                        /*html*/ `
                                                            <svg class='icon'>
                                                                <use href='#icon-${icon}'></use>
                                                            </svg>
                                                        ` : 
                                                        html
                                                    }
                                                    <div class='name'>${name}</div>
                                                </div>
                                            `
                                        }).join('\n')
                                    }
                                </div>
                            </div>
                        `
                    }).join('\n')
                }
            </div>
        `,
        style: /*css*/ `
            #id {
                position: relative;
                overflow-x: hidden;
                overflow-y: overlay;
                height: 100vh;
                background: var(--background);
                animation: palette-enter 300ms ease-in-out forwards;
                border-left: solid 1px var(--border-color);
            }

            @keyframes palette-enter {
                from {
                    width: 0px;
                }

                to {
                    width: ${width}px;
                }
            }

            #id.close-palette {
                animation: palette-close 300ms ease-in-out forwards;
            }

            @keyframes palette-close {
                from {
                    width: ${width}px;
                }

                to {
                    width: 0px;
                }
            }

            /* Drag */
            [draggable] {
                user-select: none;
            }

            /* Title */
            #id > .title {
                height: 62px;
                display: flex;
                align-items: center;
                width: 100%;
                padding: 0px 15px;
                font-weight: 700;
                font-size: 22px;
                white-space: nowrap;
            }

            /* Groups */
            #id .group {
                padding: 15px;
                white-space: nowrap;
            }

            #id .group > .title {
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 5px;
            }

            #id .item {
                cursor: grab;
                display: flex;
                align-items: center;
                padding: 8px 12px;
                border-radius: 8px;
                background: var(--secondary);
                border: solid 1px var(--border-color);
                width: 100%;
            }

            #id .item.pointer {
                cursor: pointer;
            }

            #id .item:not(:last-child) {
                margin-bottom: 4px;
            }

            #id .item > .name {
                font-size: 16px;
                margin-left: 10px;
            }

            #id .item > .icon {
                flex-shrink: 0;
                font-size: 22px;
            }

            #id .item .btn {
                padding: 0px;
                font-size: 12px;
                width: 22px;
                height: 22px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
            }

            #id .item .custom-checkbox {
                transform: translateY(-2.5px);
            }

            #id .item .custom-checkbox .custom-control-label::before,
            #id .item .custom-checkbox .custom-control-label::after {
                width: 22px;
                height: 22px;
            }

            #id .item .custom-switch .custom-control-label::before {
                width: 22px;
            }

            #id .item .custom-switch .custom-control-label::after {
                left: calc(-2.25rem + -4px);
            }

        `,
        parent: Store.get('appcontainer'),
        position,
        events: [
            {
                selector: '#id .item',
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
            var dragSrcEl = null;
  
            function handleDragStart(e) {
                this.style.opacity = '0.4';
                
                dragSrcEl = this;

                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', this.innerHTML);
            }

            function handleDragOver(e) {
                if (e.preventDefault) {
                    e.preventDefault();
                }

                e.dataTransfer.dropEffect = 'move';
                
                return false;
            }

            function handleDragEnter(e) {
                this.classList.add('over');
            }

            function handleDragLeave(e) {
                this.classList.remove('over');
            }

            function handleDrop(e) {
                if (e.stopPropagation) {
                    e.stopPropagation(); // stops the browser from redirecting.
                }

                console.log(dragSrcEl, this);
                
                if (dragSrcEl != this) {
                    dragSrcEl.innerHTML = this.innerHTML;
                    this.innerHTML = e.dataTransfer.getData('text/html');
                }
                
                return false;
            }

            function handleDragEnd(e) {
                this.style.opacity = '1';
                
                items.forEach(function (item) {
                    item.classList.remove('over');
                });
            }
            
            let items = component.findAll('.item');
            items.forEach(function(item) {
                item.addEventListener('dragstart', handleDragStart, false);
                item.addEventListener('dragenter', handleDragEnter, false);
                item.addEventListener('dragover', handleDragOver, false);
                item.addEventListener('dragleave', handleDragLeave, false);
                item.addEventListener('drop', handleDrop, false);
                item.addEventListener('dragend', handleDragEnd, false);
            });

            // NOTE: Experimental
            Store.get('viewcontainer').on('drop', handleDrop);
            Store.get('viewcontainer').on('dragover', handleDragOver);
        }
    });

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

    component.close = () => {
        component.on('animationend', event => {
            console.log('free to remove');

            // Delete store
            Store.remove('palette');
        });

        component.get().classList.add('close-palette');
    }

    return component;
}
// @END-File
