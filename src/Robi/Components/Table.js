import { DeleteItem } from '../Actions/DeleteItem.js'
import { Get } from '../Actions/Get.js'
import { Route } from '../Actions/Route.js'
import { Container } from './Container.js'
import { DataTable } from './DataTable.js'
import { Heading } from './Heading.js'
import { LoadingSpinner } from './LoadingSpinner.js'
import { Modal } from './Modal.js'
import { EditForm } from './EditForm.js'
import { NewForm } from './NewForm.js'
import { Lists } from '../Models/Lists.js'
import lists from '../../lists.js'

/**
 *
 * @param {*} param
 * @returns
 */
export async function Table(param) {
    const {
        addButton, addButtonValue, border, buttonColor, checkboxes, createdRow, defaultButtons, displayForm, editForm, editFormTitle, filter, formFooter, formTitleField, headerFilter, heading, headingColor, headingMargin, headingSize, list, margin, newForm, onUpdate, openInModal, order, padding, parent, showId, striped, titleDisplayName, view
    } = param;

    let {
        buttons, fields, items
    } = param;

    const tableContainer = Container({
        display: 'block',
        margin,
        padding,
        parent
    });

    tableContainer.add();

    /** Heading */
    if (heading || list) {
        const legendHeading = Heading({
            text: heading || (heading === '' ? '' : list),
            size: headingSize,
            color: headingColor,
            margin: headingMargin || '20px 0px 15px 0px',
            parent: tableContainer
        });

        legendHeading.add();
    }

    /** Columns */
    const headers = [];
    const columns = [];

    if (checkboxes !== false) {
        headers.push('');
        columns.push({
            data: null,
        });
    }

    /** Item Id */
    const idProperty = 'Id';
    let formFields = [];

    if (list) {
        // Show loading spinner
        const loadingSpinner = LoadingSpinner({
            type: 'robi', 
            message: `Loading ${list}`,
            parent: tableContainer
        });

        loadingSpinner.add();

        items = await Get({
            list,
            filter
        });

        // Get fields in view
        if (view) {
            const schema = lists
                .concat(Lists())
                .find(item => item.list === list);

            fields = schema?.views
                .find(item => item.name === view)
                ?.fields
                .map(name => {
                    return schema.fields.find(field => field.name === name);
                });
        } else {
            // If no view, get all fields
            fields = lists.concat(Lists()).find(item => item.list === list)?.fields;
        }

        if (!fields) {
            console.log('Missing fields');
            return;
        }

        formFields = lists.concat(Lists()).find(item => item.list === list)?.fields;

        // Remove loading
        // FIXME: Shouldn't have to use optional chaining
        loadingSpinner.remove();

        [{ name: 'Id', display: 'Id', type: 'number' }]
            .concat(fields)
            .forEach(field => {
                const {
                    name, display, type, render
                } = field;

                headers.push(display || name);

                const columnOptions = {
                    data: name === titleDisplayName ? 'Title' : name,
                    type: name === 'Id' ? 'number' : 'string',
                    visible: name === 'Id' && !showId ? false : true
                };

                /** Classes */
                if (name === 'Id') {
                    columnOptions.className = 'do-not-export bold';
                    columnOptions.render = (data, type, row) => {
                        return data;
                    };
                }

                /** Render */
                if (render) {
                    columnOptions.render = render;
                }

                else if (name.includes('Percent')) {
                    columnOptions.render = (data, type, row) => {
                        return `${Math.round(parseFloat(data || 0) * 100)}%`;
                    };
                }

                else if (type === 'mlot') {
                    columnOptions.render = (data, type, row) => {
                        return /*html*/ `
                        <div class='dt-mlot'>${data || ''}</data>
                    `;
                    };
                }

                else if (name === 'Author') {
                    columnOptions.render = (data, type, row) => {
                        return data.Title;
                    };
                }

                else if (name.includes('Created') || name.includes('Date')) {
                    columnOptions.render = (data, type, row) => {
                        return new Date(data).toLocaleString();
                    };
                }

                else if (name !== 'Id') {
                    columnOptions.render = (data, type, row) => {
                        return typeof data === 'number' ? parseFloat(data).toLocaleString('en-US') : data;
                    };
                }

                columns.push(columnOptions);
            });
    } else {
        /** typeof fields === 'object' */
        (Array.isArray(fields) ? fields : fields.split(','))
            .forEach(field => {
                const {
                    render
                } = field;

                const internalFieldName = typeof field === 'object' ? field.internalFieldName : field;
                const displayName = typeof field === 'object' ? field.displayName : field;
                const type = typeof field === 'object' ? field.type || 'slot' : 'slot';

                headers.push(displayName);

                const columnOptions = {
                    data: internalFieldName === titleDisplayName ? 'Title' : internalFieldName,
                    type: internalFieldName === 'Id' ? 'number' : 'string',
                    visible: internalFieldName === 'Id' && !showId ? false : true
                };

                /** Classes */
                if (internalFieldName === 'Id') {
                    columnOptions.className = 'do-not-export bold';
                    columnOptions.render = (data, type, row) => {
                        return data;
                    };
                }

                /** Render */
                if (render) {
                    columnOptions.render = render;
                }

                else if (internalFieldName.includes('Percent')) {
                    columnOptions.render = (data, type, row) => {
                        return `${Math.round(parseFloat(data || 0) * 100)}%`;
                    };
                }

                else if (type === 'mlot') {
                    columnOptions.render = (data, type, row) => {
                        return /*html*/ `
                        <div class='dt-mlot'>${data || ''}</data>
                    `;
                    };
                }

                else if (internalFieldName === 'Author') {
                    columnOptions.render = (data, type, row) => {
                        return data.Title;
                    };
                }

                else if (internalFieldName.includes('Created') || internalFieldName.includes('Date')) {
                    columnOptions.render = (data, type, row) => {
                        return new Date(data).toLocaleString();
                    };
                }

                else if (internalFieldName !== 'Id') {
                    columnOptions.render = (data, type, row) => {
                        return typeof data === 'number' ? parseFloat(data).toLocaleString('en-US') : data;
                    };
                }

                columns.push(columnOptions);
            });
    }

    /** Table Buttons */
    if (defaultButtons !== false) {
        if (!Array.isArray(buttons)) {
            buttons = [];
        }

        if (checkboxes !== false) {
            buttons = buttons.concat([
                {
                    text: /*html*/ `
                        <svg class='icon'>
                            <use href='#icon-bs-trash'></use>
                        </svg>
                    `,
                    className: 'delete-item',
                    name: 'delete',
                    enabled: false,
                    action: async function (e, dt, node, config) {
                        const selected = table.selected();

                        console.log('Delete selected:', selected);

                        const button = tableContainer.find('.delete-item');
                        console.log(button);
                        button.disabled = true;
                        button.innerHTML = /*html*/ `<span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span>`;

                        // Delete items
                        for (let row in selected) {
                            console.log(selected[row]);

                            // Delete item
                            await DeleteItem({
                                list,
                                itemId: selected[row].Id
                            });

                            // Delete Row
                            table.removeRow(selected[row].Id);
                        }

                        button.innerHTML = /*html*/ `
                            <span>
                                <svg class="icon">
                                    <use href="#icon-bs-trash"></use>
                                </svg>
                            </span>
                        `;
                    }
                }
            ]);
        }

        buttons = buttons.concat([
            {
                extend: 'excelHtml5',
                // className: 'ml-50',
                exportOptions: {
                    header: false,
                    footer: false,
                    columns: ':not(.do-not-export):not(.select-checkbox)'
                }
            },
            {
                extend: 'csvHtml5',
                exportOptions: {
                    header: false,
                    footer: false,
                    columns: ':not(.do-not-export):not(.select-checkbox)'
                }
            },
            {
                extend: 'pdfHtml5',
                orientation: 'landscape',
                exportOptions: {
                    columns: ':not(.do-not-export):not(.select-checkbox)'
                }
            }
            // {
            //     extend: 'copyHtml5',
            //     exportOptions: {
            //         columns: [3,4,5,6,7,8,9,10,11]
            //     }
            // },
        ]);
    }

    if (addButton !== false) {
        buttons.unshift({
            text: /*html*/ `
                <svg class='icon'>
                    <use href='#icon-bs-plus'></use>
                </svg>
                <span>${addButtonValue || 'Add item'}</span>
            `,
            className: 'add-item',
            name: 'add',
            action: function (e, dt, node, config) {
                if (openInModal) {
                    Route(`${list}/New`);
                } else {
                    const newModal = Modal({
                        contentPadding: '30px',
                        title: `New Item`,
                        async addContent(modalBody) {
                            const formParam = {
                                event: e,
                                fields: formFields,
                                list,
                                modal: newModal,
                                parent: modalBody,
                                table
                            };

                            selectedForm = newForm ? await newForm(formParam) : await NewForm(formParam);

                            newModal.showFooter();
                        },
                        buttons: {
                            footer: [
                                {
                                    value: 'Cancel',
                                    classes: 'btn-secondary',
                                    data: [
                                        {
                                            name: 'dismiss',
                                            value: 'modal'
                                        }
                                    ]
                                },
                                // TODO: send modal prop to form
                                {
                                    value: 'Create',
                                    classes: 'btn-success',
                                    async onClick(event) {
                                        // Disable button - Prevent user from clicking this item more than once
                                        $(event.target)
                                            .attr('disabled', '')
                                            .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating');

                                        // Call newForm.onCreate() and wait for it to complete
                                        const newItem = await selectedForm?.onCreate(event);

                                        if (newItem) {
                                            table.addRow({
                                                data: newItem
                                            });
                                        }

                                        // Enable button
                                        $(event.target)
                                            .removeAttr('disabled')
                                            .text('Created');

                                        // Close modal (DOM node will be removed on hidden.bs.modal event)
                                        newModal.close();
                                    }
                                }
                            ]
                        },
                        parent: tableContainer
                    });

                    newModal.add();
                }
            }
        });
    }

    /** Selected form */
    let selectedItem;
    let selectedRow;
    let selectedForm;

    // console.log('Table headers', headers);
    // console.log('Table columns', columns);
    /** Table */
    const table = DataTable({
        headers,
        headerFilter,
        buttonColor,
        checkboxes: checkboxes !== false ? true : false,
        striped: striped || false,
        border: border || false,
        width: '100%',
        columns,
        data: items,
        rowId: idProperty,
        /**
         * Sort by Status then Last Name
         * {@link https://datatables.net/reference/api/order()}
         */
        order: order || [[1, 'asc']],
        buttons,
        createdRow,
        onRowClick(param) {
            const {
                row, item
            } = param;

            selectedRow = row;
            selectedItem = item;

            // Open edit form full screen
            if (openInModal) {
                Route(`${list}/${selectedItem.Id}`);
            } else {
                // Open edit form in modal
                const rowModal = Modal({
                    title: 'Edit item',
                    contentPadding: '30px',
                    async addContent(modalBody) {
                        const formParam = { item, table, row, fields: formFields, list, modal: rowModal, parent: modalBody };

                        selectedForm = editForm ? await editForm(formParam) : await EditForm(formParam);

                        if (formFooter !== false) {
                            rowModal.showFooter();
                        }
                    },
                    buttons: {
                        footer: [
                            {
                                value: 'Cancel',
                                classes: 'btn-secondary',
                                data: [
                                    {
                                        name: 'dismiss',
                                        value: 'modal'
                                    }
                                ]
                            },
                            {
                                value: 'Update',
                                // disabled: true,
                                classes: 'btn-primary',
                                async onClick(event) {
                                    /** Disable button - Prevent user from clicking this item more than once */
                                    $(event.target)
                                        .attr('disabled', '')
                                        .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating');

                                    // Call newForm.onUpdate() and wait for it to complete
                                    const updatedItem = await selectedForm?.onUpdate(event);

                                    if (updatedItem) {
                                        table.updateRow({
                                            row: selectedRow,
                                            data: updatedItem
                                        });
                                    }

                                    /** Enable button */
                                    $(event.target)
                                        .removeAttr('disabled')
                                        .text('Updated');

                                    /** Hide modal */
                                    rowModal.getModal().modal('hide');
                                }
                            },
                            {
                                value: 'Delete',
                                // disabled: true,
                                classes: 'btn-danger',
                                async onClick(event) {
                                    /** Disable button - Prevent user from clicking this item more than once */
                                    $(event.target)
                                        .attr('disabled', '')
                                        .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleteing');

                                    // Call newForm.onDelete() and wait for it to complete
                                    await selectedForm?.onDelete(event);

                                    table.removeRow(selectedItem.Id);

                                    /** Enable button */
                                    $(event.target)
                                        .removeAttr('disabled')
                                        .text('Deleted');

                                    /** Hide modal */
                                    rowModal.getModal().modal('hide');
                                }
                            }
                        ]
                    },
                    parent: tableContainer
                });

                rowModal.add();
            }


        },
        onSelect(param) {
            const selected = table.selected();

            console.log('select', selected);

            if (selected.length > 0) {
                table.DataTable().buttons('delete:name').enable();
            }
        },
        onDeselect(param) {
            const selected = table.selected();

            console.log('deselect', selected);

            if (selected.length === 0) {
                table.DataTable().buttons('delete:name').disable();
            }
        },
        onDraw(param) {
            const {
                jqevent, table
            } = param;

            // const data = table.rows({ search: 'applied' }).data().toArray();
            // console.log(param);
        },
        parent: tableContainer
    });

    table.add();

    return table;
}
