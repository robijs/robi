/** Actions */
import Action_Store from '../Actions/Action_Store.js'

/** Components */
import { DataTable } from '../Core/Components.js'
import Component_Modal from '../Components/Component_Modal.js'
import Component_Heading from '../Components/Component_Heading.js'
import { App } from '../Core/Settings.js'

export default function ViewPart_Table(param) {
    const {
        addButton,
        addButtonValue,
        createdRow,
        defaultButtons,
        heading,
        headingColor,
        headingSize,
        headingMargin,
        titleDisplayName,
        showId,
        formTitleField,
        formFooter,
        fields,
        checkboxes,
        striped,
        order,
        border,
        items,
        newForm,
        editForm,
        editFormTitle,
        displayForm,
        onUpdate,
        parent
    } = param;

    let {
        buttons
    } = param;

    /** Heading */
    if (heading) {
        const legendHeading = Component_Heading({
            text: heading,
            size: headingSize,
            color: headingColor,
            margin: headingMargin || '20px 0px 15px 0px',
            parent
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
    const idProperty = App.get('mode') === 'prod' ? 'Id' : 'Id';

    /** typeof fields === 'object' */
    (Array.isArray(fields) ? fields : fields.split(','))
    .forEach(field => {
        const internalFieldName = typeof field === 'object' ? field.internalFieldName : field;
        const displayName = typeof field === 'object' ? field.displayName : field;
        const type = typeof field === 'object' ? field.type || 'slot' : 'slot';

        headers.push(displayName);

        const columnOptions = {
            data: internalFieldName === titleDisplayName ? 'Title' : internalFieldName,
            type: internalFieldName === idProperty ? 'number' : 'string',
            visible: internalFieldName === idProperty && !showId ? false : true
        }

        /** Classes */
        if (internalFieldName === idProperty) {
            columnOptions.className = 'do-not-export bold';
            columnOptions.render = (data, type, row) => {
                return data;
            }
        }

        /** Render */
        if (internalFieldName.includes('Percent')) {
            columnOptions.render = (data, type, row) => {
                return `${Math.round(parseFloat(data) * 100)}%`;
            }
        } 

        else if (type === 'mlot') {
            columnOptions.render = (data, type, row) => {
                return /*html*/ `
                    <div class='dt-mlot'>${data || ''}</data>
                `;
            }
        }

        else if (internalFieldName === 'Author') {
            columnOptions.render = (data, type, row) => {
                return data?.Title || '(Local Developer)';
            }
        }

        else if (internalFieldName.includes('Created') || internalFieldName.includes('Date')) {
            columnOptions.render = (data, type, row) => {
                return new Date(data).toLocaleString();
            }
        }

        else if (internalFieldName !== idProperty) {
            columnOptions.render = (data, type, row) => {
                return typeof data === 'number' ? parseFloat(data).toLocaleString('en-US') : data;
            }
        }

        columns.push(columnOptions);
    });

    // console.log(headers, columns);

    /** Table Buttons */
    if (defaultButtons !== false) {
        if (!Array.isArray(buttons)) {
            buttons = [];
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
            action: function (e, dt, node, config) {
                /** Add new item */
                let itemForm;

                const userModal = Component_Modal({
                    title: `New Item`,
                    async addContent(modalBody) {
                        selectedForm = newForm({
                            table,
                            modal: userModal,
                            parent: modalBody,
                            event: e
                        });

                        userModal.showFooter();
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
                                value: 'Create',
                                classes: 'btn-primary',
                                async onClick(event) {
                                    // /** Disable button - Prevent user from clicking this item more than once */
                                    // $(event.target).attr('disabled', '');

                                    // /** Get field values from userForm View Part */
                                    // const data = itemForm.getFieldValues();

                                    // /** Check required values */
                                    // if (!data) {
                                    //     if (messageValid) {
                                    //         messageValid.remove();
                                    //     }

                                    //     messageValid = Component_Alert({
                                    //         type: 'danger',
                                    //         text: `Missing requried information. Please check that all fields are valid.`,
                                    //         close: true,
                                    //         parent: userModal.getModalBody(),
                                    //         position: 'beforeend'
                                    //     });

                                    //     messageValid.add();

                                    //     /** Enable button */
                                    //     $(event.target).removeAttr('disabled');

                                    //     return;
                                    // }

                                    // // Enable button;
                                    // $(event.target)
                                    //     .removeAttr('disabled')
                                    //     .text('Complete!')
    
                                    // /** Hide modal */
                                    // userModal.getModal().modal('hide');
                                }
                            }
                        ]
                    },
                    parent
                });
    
                userModal.add();
            }
        });
    }

    /** Selected form */
    let selectedItem;
    let selectedRow;
    let selectedForm;

    /** Table */
    const table = DataTable({
        headers,
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
        order: order || [[ 0, 'asc' ]],
        buttons,
        createdRow,
        onRowClick(param) { // Note: This is where the click event is handled for datatables;
            const {
                row,
                item
            } = param;

            /** Set row */
            selectedRow = row;

            /** Set user */
            selectedItem = item;

            /** Show User */
            const rowModal = Component_Modal({
                // if editFormTitle else heading...
                title: `${
                    editFormTitle || heading ? // Add heading and heading color (has to be passed in as a param property); 
                                        `<span style='color: ${headingColor}'>${ 
                                        // not sure about this part, wouldn't this editFormTitle always be false since it was false when we ended up here??
                                            editFormTitle || heading}</span> — ` : 
                                        ''}${selectedItem[formTitleField] || 'Edit Item'}`,
                async addContent(modalBody) {
                    selectedForm = displayForm ? // if displayForm is selected;
                    displayForm({ item, parent: modalBody }) : 
                    editForm ? // if editForm is selected;
                        editForm({ item, table, row, modal: rowModal, parent: modalBody }) : undefined;

                    if (formFooter !== false && Action_Store.user().Role === 'Developer') {
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
                               

                                /** Get form data */
                                const formValues = selectedForm.getFieldValues();

                                if (!formValues) {
                                    return;
                                }
                                
                                /** Disable button - Prevent user from clicking this item more than once */
                                $(event.target)
                                    .attr('disabled', '')
                                    .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating');

                                const response = await onUpdate({
                                    item: selectedItem,
                                    row: selectedRow,
                                    table,
                                    formValues
                                });

                                if (response === 'unchanged') {
                                    console.log('No changes were made.');
                                    
                                    $(event.target)
                                        .removeAttr('disabled')
                                        .text('Update');

                                    return;   
                                }

                                /** Enable button */
                                $(event.target)
                                    .removeAttr('disabled')
                                    .text('Updated!');

                                /** Hide modal */
                                rowModal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });

            rowModal.add();
        },
        onSelect(param) {
            const selected = table.selected();

            console.log('select', selected);
        },
        onDeselect(param) {
            const selected = table.selected();

            console.log('deselect', selected);
        },
        onDraw(param) {
            const {
                jqevent,
                table
            } = param;

            // const data = table.rows({ search: 'applied' }).data().toArray();
            
            // console.log(param);
        },
        parent
    });

    table.add();

    return table;
}
