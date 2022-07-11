import { Component } from '../Actions/Component.js'
import { CreateFileForm } from '../Actions/CreateFileForm.js'
import { EditLayout } from '../Actions/EditLayout.js'
import { ModifyFile } from '../Actions/ModifyFile.js'
import { Store } from '../Core/Store.js'
import { GenerateUUID } from '../Robi.js'
import { ComponentTemplate } from '../Templates/ComponentTemplate.js'
import { ActionTemplate } from '../Templates/ActionTemplate.js'
import { GetLocal } from '../Actions/GetLocal.js'
import { SetLocal } from '../Actions/SetLocal.js'
import { HTML } from '../Actions/HTML.js'
import { classes } from '../Utilities/classes.js'
import { SingleLineTextField } from './SingleLineTextField.js'
import { Table } from './Table.js'
import { Button } from './Button.js'
import { ChoiceField } from './ChoiceField.js'
import { Style } from '../Actions/Style.js'

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

    const width = 275;

    // FIXME: Remove layout section. Add rows and cells diretly from the page.
    const componentLibrary = [
        {
            title: 'Widgets',
            items: [
                {
                    name: 'Table',
                    icon: 'bs-table'
                },
                {
                    name: 'Chart',
                    icon: 'bs-bar-chart'
                },
                {
                    name: 'Form',
                    icon: 'bs-stop-btn'
                },
                {
                    name: 'Modal',
                    icon: 'bs-stop-btn'
                }
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
                    icon: 'bs-textarea'
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
                }
            ]
        }
    ];

    let selectedTool = GetLocal('selectedTool') || 'Layout';
    const toolCategories = [
        {
            name: 'Widgets',
            icon: 'bs-window-sidebar'
        },
        {
            name: 'Controls',
            icon: 'bs-toggles'
        },
        {
            name: 'Fields',
            icon: 'bs-input-cursor'
        },
        {
            name: 'Custom',
            icon: 'bs-tools'
        }
    ];

    // TODO: Store filter btn choice in session or local storage?
    const component = Component({
        html: /*html*/ `
            <div class='palette'>
                <div class='search-container'>
                    <input class='form-control mr-sm-2' type='search' placeholder='Search' aria-label='Search'>
                </div>
                <div class='title'>Component Library</div>
                <div class='filter-btn-group'>
                    ${
                        HTML({
                            items: toolCategories,
                            each({ name, icon }) {
                                return /*html*/ `
                                    <div class='${classes('filter-btn', { selected: selectedTool === name})}' data-name='${name}'>
                                        <svg class='icon'>
                                            <use href='#icon-${icon}'></use>
                                        </svg>   
                                    </div>
                                `
                            }
                        })
                    }
                    <div class='selected-indicator'></div>
                </div>
                ${componentLibrary.map(group).join('\n')}
            </div>
        `,
        style: /*css*/ `
            #id {
                user-select: none;
                position: relative;
                overflow-x: hidden;
                overflow-y: overlay;
                height: 100vh;
                background: var(--background);
                border-left: solid 1px var(--border-color);
                animation: palette-enter 300ms ease-in-out forwards;
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

            /* Search */
            #id .form-inline {
                flex-flow: initial;
            }

            #id .search-container {
                width: 100%;
                padding: 15px 15px 0px 15px;
            }

            #id input[type='search'] {
                width: 100%;
                border-radius: .25rem;
                font-size: 13px;
                border: none;
                background: var(--button-background);
            }

            #id input[type='search']::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 20px;
                width: 20px;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill=''><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
            }

            /** Override Bootstrap input element active/focus style */
            #id input:active,
            #id input:focus {
                outline: none;
                border: none;
                box-shadow: none;
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

            /* Filter Buttons */
            #id .filter-btn-group {
                display: flex;
                position: relative;
                background: var(--secondary);
                border-radius: 8px;
                margin: 0px 15px;
            }

            #id .filter-btn {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                position: relative;
                flex: 1;
                background: transparent;
                z-index: 1;
                padding: 8px 16px;
                border-radius: 8px;
                transition: background-color 150ms ease-in-out;
            }

            #id .filter-btn .icon {
                fill: var(--color);
            }

            #id .selected-indicator {
                opacity: 0;
                position: absolute;
                top: 3px;
                left: 3px;
                border-radius: 8px;
                width: calc(${100 / toolCategories.length}% - 6px);
                height: calc(100% - 6px);
                background: var(--button-background);
                transition: left 200ms ease-in-out, opacity 100ms ease-in-out 100ms;
            }

            /* Groups */
            #id .group[data-group='New'] .item {
                background: var(--background-HSL-3);
                color: var(--primary);
                border: solid 1px var(--background-HSL-10);
            }

            #id .group[data-group='New'] .item .icon {
                fill: var(--primary);
            }

            #id .group {
                padding: 15px;
                white-space: nowrap;
            }

            #id .group > .title {
                display: flex;
                justify-content: space-between;
                font-weight: 600;
                font-size: 16px;
                margin-bottom: 5px;
                height: 26px;
            }

            #id .group > .title .square {
                display: flex;
                background: var(--button-background);
                border-radius: 6px;
                padding: 2px;
            }

            #id .group > .title .square .icon {
                fill: var(--primary);
            }

            #id .group-btn .name {
                font-weight: 500;
                color: var(--primary);
                font-size: 14px;
            }

            #id .item {
                display: flex;
                align-items: center;
                padding: 8px 12px;
                border-radius: 8px;
                background: var(--background);
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
                fill: var(--color);
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

            /* Drag */
            #id .draggable {
                cursor: grab;
            }
        `,
        parent: Store.get('appcontainer'),
        position,
        events: [
            {
                selector: '#id .filter-btn',
                event: 'click',
                listener(event) {
                    selectedTool = this.dataset.name;

                    SetLocal('selectedTool', selectedTool);

                    component.find('.selected-indicator').style.left = `${this.offsetLeft + 3}px`;
                }
            },
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
            setSelectedTool();
            enableDrag();
            addCustom();
            enableEdit();
        }
    });

    function setSelectedTool() {
        setTimeout(() => {
            const indicator = component.find('.selected-indicator');

            indicator.style.left = `${component.find(`.filter-btn[data-name="${selectedTool}"]`).offsetLeft + 3}px`;
            indicator.style.opacity = '1';
        }, 300);
    }

    function enableDrag() {
        // TODO: Remove clone if not dragged into a droppable container
        // TODO: Cancel drop and remove clone if only clicked

        // NOTE: equal to grabbed element's margin
        let offset = 0;
        let offsetY = 0;
        let draggedElement;
        let componentName;

        function mousedown(event) {
            // Clone element
            draggedElement = this.cloneNode(true);

            // Set name
            componentName = draggedElement.dataset.name;

            // Set offsets
            offsetY = component.get().scrollTop;
            
            // Insert cloned element
            this.insertAdjacentElement('beforebegin', draggedElement);

            // Style entire document
            document.body.classList.add('grabbing');

            // Style dragged element
            draggedElement.style.pointerEvents = "none";
            draggedElement.style.maxWidth = `${draggedElement.offsetWidth}px`;
            draggedElement.style.userSelect = 'none';
            draggedElement.style.position = 'fixed';
            draggedElement.style.zIndex = '1000';
            draggedElement.style.top = `${draggedElement.getBoundingClientRect().top - offset - offsetY}px`;
            draggedElement.style.left = `${draggedElement.getBoundingClientRect().left - offset}px`;
            // DEV:
            draggedElement.style.boxShadow = 'var(--box-shadow)';

            // Add event listeners
            document.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);

            // Enable Drop
            Store
                .getRows()
                .forEach(row => {
                    row.enableDrop();
                    row.on('mouseup', rowEnableDrop);
                });
        }

        function mousemove(event) {
            draggedElement.style.top = `${draggedElement.getBoundingClientRect().top + event.movementY - offset}px`;
            draggedElement.style.left = `${draggedElement.getBoundingClientRect().left + event.movementX - offset}px`;
        }

        function mouseup(event) {
            // Remove event listeners
            document.removeEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);

            // Remove element
            draggedElement.remove();

            // Remove enable drop
            Store
                .getRows()
                .forEach(row => {
                    row.disableDrop();
                    row.off('mouseup', rowEnableDrop);
                });

            // Add component to DOM
            
        }

        async function rowEnableDrop(event) {
            let component;

            // TODO: Keep track of components added to DOM
            // TODO: Add code generated to file in the right Row and Cell
            // TODO: Enable editable components
            //       [ ] Label
            //       [ ] Callbacks (onChange, onKeyup, action, etc.)
            //       [ ] Drag and drop to a differnt Row, Cell, or order within
            switch(componentName) {
                case 'Button':
                    component = Button({
                        value: 'Button',
                        type: 'robi',
                        parent: this
                    }).add();
                    break;
                case 'Choice':
                    component = ChoiceField({
                        label: 'Choice',
                        options: [
                            {
                                label: 'Option 1'
                            },
                            {
                                label: 'Option 2'
                            },
                            {
                                label: 'Option 3'
                            }
                        ],
                        parent: this
                    }).add();
                    break;
                case 'Table':
                    component = await Table({
                        list: 'AllTypes',
                        parent: this
                    });
                    break;
            }

            // Add editable component event listeners and styles
            console.log(component);

            // Remove styles
            document.body.classList.remove('grabbing');
        }

        // Get all component library draggable items
        let items = component.findAll('.draggable');
        items.forEach(function(item) {
            // Add event listeners
            item.addEventListener('mousedown', mousedown,);
            item.addEventListener('mouseup', mouseup);
        });
    }

    async function addCustom() {
        const req = await fetch('http://127.0.0.1:2035/src/Routes/Robi/Components');
        const data = await req.json();

        // console.log(data);

        component.append(group({
            title: 'Custom',
            button: /*html*/ `
                <div class="icon-container">
                    <div class="square d-flex">
                        <svg class="icon" style="font-size: 22px;">
                            <use href="#icon-bs-plus"></use>
                        </svg>
                    </div>
                </div>
            `,
            items: data.map(item => {
                return {
                    name: item,
                    icon: 'bs-code-slash'
                }
            })
        }))
    }

    function group({ title, button, items, cursor, draggable }) {
        return /*html*/ `
            <div class='group' data-group='${title}'>
                <div class='title'>
                    ${title}
                    ${button || ''}
                </div>
                <div class='items'>
                    ${
                        items.map(({ name, icon, html }) => {
                            return /*html*/ `
                                <div class='item${cursor ? ` ${cursor}` : ''}${draggable !== false ? ' draggable' : ''}' data-name='${name}'>
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
    }

    // NOTE: Show that row is editable, or components, or both?
    function enableEdit() {
        Store
            .getRows()
            .forEach(row => {
                row.enableEdit();
            });

        // TODO: Should there be a special store for all editable components?
        Store.get('title').enableEdit();
    }

    function disableEdit() {
        Store
            .getRows()
            .forEach(row => {
                console.log('here');
                row.disableEdit();
            });
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

    component.close = () => {
        component.on('animationend', event => {
            console.log('free to remove');

            // Delete store
            Store.remove('palette');
        });

        component.get().classList.add('close-palette');
        disableEdit();
    }

    return component;
}
// @END-File
