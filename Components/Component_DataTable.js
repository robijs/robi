/** Actions */
import Action_Component from '../Actions/Action_Component.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** {@link https://datatables.net/plug-ins/api/row().show()} */
/**
 *  This plugin permits to show the right page of DataTable to show the selected row
 *
 *  @version 1.0
 *  @name row().show()
 *  @summary See the row in datable by display the right pagination page
 *  @author [Edouard Labre](http://www.edouardlabre.com)
 *
 *  @param {void} a row must be selected
 *  @returns {DataTables.Api.Rows} DataTables Rows API instance
 *
 *  @example
 *    // Add an element to a huge table and go to the right pagination page
 *    var table = $('#example').DataTable();
 *    var new_row = {
 *      DT_RowId: 'row_example',
 *      name: 'example',
 *      value: 'an example row'
 *    };
 *
 *    table.row.add( new_row ).draw().show().draw(false);
 */
$.fn.dataTable.Api.register('row().show()', function() {
	var page_info = this.table().page.info();
	// Get row index
	var new_row_index = this.index();
	// Row position
	var row_position = this.table()
		.rows({ search: 'applied' })[0]
		.indexOf(new_row_index);
	// Already on right page ?
	if ((row_position >= page_info.start && row_position < page_info.end) || row_position < 0) {
		// Return row object
		return this;
	}
	// Find page number
	var page_to_display = Math.floor(row_position / this.table().page.len());
	// Go to that page
	this.table().page(page_to_display);
	// Return row object
	return this;
});

export default function Component_DataTable(param) {
    const {
        headers,
        columns,
        buttons,
        cursor,
        checkboxes,
        striped,
        border,
        paging,
        search,
        info,
        ordering,
        order,
        rowId,
        addCSS,
        data,
        onRowClick,
        onSearch,
        onDraw,
        onSelect, // How do you turn select on?  i see the event but no option to enable it;
        onDeselect,
        rowCallback,
        createdRow,
        width,
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <table class=
                'table table-sm 
                hover
                w-100 
                ${striped !== false ? 'table-striped' : 'table-not-striped'} 
                ${border !== false ? 'table-bordered' : 'table-not-bordered'} 
                animated 
                fadeIn
                nowrap'
            >
                <thead>
                    ${buildHeader()}
                </thead>    
            </table>
        `,
        style: /*css*/ `
            /** Horizontal scroll */
            #id_wrapper .row-2 {
                width: inherit;
            }

            #id_wrapper .row-2 .col-md-12 {
                overflow-x: overlay;
                padding-right: 0px;
                padding-left: 0px;
                padding-bottom: 10px;
                margin-right: 15px;
                margin-left: 15px;
            }

            /** Table */
            #id_wrapper {
                width: ${width || 'initial'};
                /* overflow-x: overlay; */
            }

            #id tr {
                cursor: ${cursor || 'pointer'};
            }

            /** Toolbar */
            #id_wrapper .datatable-toolbar {
                font-size: .9em;
                padding: 0px 15px;
                margin: 0px 0px 15px 0px;
                width: 100%;
                display: flex;
                justify-content: space-between;
            }

            #id_wrapper .datatable-toolbar .cell {
                display: flex;
                align-items: center;
            }

            #id_wrapper .datatable-toolbar .dataTables_length label,
            #id_wrapper .datatable-toolbar .dataTables_filter label {
                margin: 0px;
            }

            /** Buttons */
            #id_wrapper .btn-group {
                margin: 0px 10px 0px 0px;
            }

            #id_wrapper .btn {
                font-size: .9em;
                padding: 4px 8px;
            }

            #id_wrapper .datatable-toolbar .btn-secondary {
                background: ${Setting_App.primaryColor};
                border-color: ${Setting_App.primaryColor};
                margin-right: 10px;
                border-radius: .25rem;
            }

            #id_wrapper .datatable-toolbar .btn-secondary:focus {
                box-shadow: none;
            }

            #id_wrapper .datatable-toolbar .btn-secondary span {
                color: white;
            }

            /* #id_wrapper .datatable-toolbar .btn:first-child {
                margin-right: 60px;
            } */

            /** Add Item Button */
            #id_wrapper .datatable-toolbar .add-item {
                background: white;
                border: solid 1px darkgreen;
                margin-right: 60px;
            }

            #id_wrapper .datatable-toolbar .add-item span {
                display: flex;
                justify-content: center;
                align-items: center;
                color: darkgreen;
            }

            #id_wrapper .datatable-toolbar .add-item .icon {
                margin-right: 5px;
                stroke: darkgreen;
                fill: darkgreen;
            }

            /** Disabled Button */
            #id_wrapper .datatable-toolbar .disabled {
                background: white;
                border: solid 1px gray !important;
            }

            #id_wrapper .datatable-toolbar .disabled span {
                display: flex;
                justify-content: center;
                align-items: center;
                color: gray !important;
            }

            #id_wrapper .datatable-toolbar .disabled .icon {
                margin-right: 5px;
                stroke: gray !important;
                fill: gray !important;
            }

            /** Delete Item Button */
            #id_wrapper .datatable-toolbar .delete-item {
                background: white;
                border: solid 1px firebrick
            }

            #id_wrapper .datatable-toolbar .delete-item span {
                display: flex;
                justify-content: center;
                align-items: center;
                color: firebrick;
            }

            #id_wrapper .datatable-toolbar .delete-item .icon {
                margin-right: 5px;
                stroke: firebrick;
                fill: firebrick;
            }

            /** HTML5 Buttons */
            #id_wrapper .buttons-html5.ml-50 {
                margin-left: 50px;
            }

            #id_wrapper .buttons-html5 {
                background: white !important;
                border: 1px solid rgb(102, 51, 153, .30);
            }

            #id_wrapper .buttons-html5 span{
                color: ${Setting_App.primaryColor} !important;
            }

            @media (max-width: 1366px) {
                #id_wrapper .datatable-toolbar .add-item {
                    margin-right: 30px;
                }

                #id_wrapper .buttons-html5.ml-50 {
                    margin-left: 25px;
                }
            }

            /** Select and Search */
            #id_wrapper .custom-select {
                border: 1px solid rgb(${Setting_App.primaryColorRGB}, .30);
            }

            #id_wrapper .form-control {
                border: 1px solid rgb(${Setting_App.primaryColorRGB}, .30);
            }

            /** Footer */
            #id_wrapper .datatable-footer {
                padding: 0px 15px;
                margin: 15px 0px 0px 0px;
                width: 100%;
                font-size: .85em;
                display: flex;
                justify-content: space-between;
            }

            #id_wrapper .datatable-footer .cell.left {
                display: flex;
                align-items: center;
            }

            /** Info */
            #id_wrapper .dataTables_info {
                padding: 0px;
            }

            /** Pagination */
            #id_wrapper .page-item .page-link {
                color: unset;
                border: solid 1px rgb(${Setting_App.primaryColorRGB}, .30);
            }

            #id_wrapper .page-item .page-link:focus {
                box-shadow: none;
            }

            #id_wrapper .page-item.active .page-link {
                color: white;
                background: ${Setting_App.primaryColor};;
                border: solid 1px ${Setting_App.primaryColor};
            }

            #id_wrapper .page-link:hover {
                background: rgb(${Setting_App.primaryColorRGB}, .15);
            }

            /** Form control */
            #id_wrapper .form-control:focus {
                box-shadow: none;
                outline: none;
                border-color: ${Setting_App.primaryColor};
            }

            /** Table */
            #id_wrapper .dataTable {
                border-collapse: collapse !important;
                font-size: .9em;
            }

            /** Bordered */
            /* #id_wrapper .table-bordered {
                border: 1px solid rgb(${Setting_App.primaryColorRGB}, .3);
            }
            
            #id_wrapper .table-bordered.dataTable {
                border-right-width: 1px;
            } */

            /** Not Bordered*/
            #id_wrapper .table-not-bordered {
                border: none;
            }
            
            #id_wrapper .table-not-bordered thead td,
            #id_wrapper .table-not-bordered thead th {
                border-top: none;
            }
            
            /** Headers */
            #id_wrapper .table-border thead th {
                border-bottom: solid 1px rgb(${Setting_App.primaryColorRGB}, .3);
                background: rgb(${Setting_App.primaryColorRGB}, .2);
                color: ${Setting_App.primaryColor};
            }

            /** Cells */
            #id_wrapper td,
            #id_wrapper th {
                border-top: none;
            }
            
            #id_wrapper td:focus {
                outline: none;
            }

            #id_wrapper td.bold {
                font-weight: 500;
            }

            /** Sorting */
            #id_wrapper .sorting_asc::before,
            #id_wrapper .sorting_asc::after,
            #id_wrapper .sorting_desc::before,
            #id_wrapper .sorting_desc::after {
                color: ${Setting_App.primaryColor}
            }

            /** Select Checkbox */
            #id_wrapper tbody td.select-checkbox {
                vertical-align: middle;
            }

            #id_wrapper tbody td.select-checkbox:before, 
            #id_wrapper tbody th.select-checkbox:before {
                content: ' ';
                margin: 0 auto;
                border: solid 2px lightgray;
                border-radius: 4px;
                position: initial;
                display: block;
                width: 16px;
                height: 16px;
                box-sizing: border-box;
            }

            #id_wrapper tbody td.select-checkbox:after, 
            #id_wrapper tbody th.select-checkbox:after {
                /* margin-top: -19px; */
                /* color: ${Setting_App.primaryColor}; */
                margin-top: -10px;
                text-shadow: none;
                color: white;
                font-weight: bolder;
                font-size: 10pt;
            }

            /** Selected Row */
            #id_wrapper tbody > tr.selected {
                background-color: rgb(${Setting_App.primaryColorRGB});
            }

            #id_wrapper tbody > tr.selected td {
                color: white;
            }

            /** Overflow MLOT field */
            #id_wrapper tbody td .dt-mlot {
                max-width: 200px;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            ${addCSS || ''}
        `,
        parent,
        position,
        events: [
            {
                selector: `#id`,
                event: 'click',
                listener(event) {
                    
                }
            }
        ],
        onAdd() {
            setData({
                columns,
                data,
                onRowClick,
            });
        }
    });

    function buildHeader() {
        let html = /*html*/ `
            <tr>
        `;

        headers.forEach(item => {
            html += /*html*/ `
                <th>${item}</th>
            `;
        });

        html += /*html*/ `
            </tr>
        `
        return html;
    }

    function setData(param) {
        const {
            columns,
            data,
            onRowClick,
        } = param;

        if (!component.get()) {
            return;
        }
        
        const tableId = `#${component.get().id}`;

        const options = {
            dom: `
                <'row'
                    <'datatable-toolbar'
                        <'cell left'
                            Bl
                        >
                        <'cell right'
                            ${search !== false ? 'f' : ''}
                        >
                    >
                >
                <'row row-2'
                    <'col-md-12'
                        t
                    >
                >
                <'row'
                    <'datatable-footer'
                        <'cell left'
                            ${info !== false ? 'i' : ''}
                        >
                        <'cell right'
                            p
                        >
                    >
                >
            `,
            rowId,
            processing: true,
            // responsive: true,
            /**
             * Testing
             * 
             * https://datatables.net/reference/option/deferRender
             */
            deferRender: true,
            order: order || [[1, 'asc']],
            columns,
            buttons: buttons || []
        };

        if (paging === false) {
            options.paging = false;
        } else {
            options.pageLength = 25;
        }

        if (ordering === false) {
            options.ordering = false;
        }

        if (checkboxes) {
            options.columnDefs = [
                {
                    targets: 0,
                    defaultContent: '',
                    orderable: false,
                    className: 'select-checkbox'
                }
            ];

            options.select = {
                style: 'multi',
                selector: 'td:first-child'
            };
        }

        if (rowCallback) {
            options.rowCallback = rowCallback;
        }

        if (createdRow) {
            options.createdRow = createdRow;
        }

        /** Create table. */
        const table = $(tableId).DataTable(options)
        .on('click', 'tr', function(rowData) {
            /** DO NOT Change this to an arrow function! this reference required */
            if (rowData.target.classList.contains('select-checkbox')) {
                return;
            }
            rowData = $(tableId).DataTable().row(this).data();

            if (rowData && onRowClick) {
                onRowClick({
                    row: this,
                    item: rowData
                });
            }
        });

        /** Search event callback */
        if (onSearch) {
            table.on('search.dt', function(e, settings) {
                // console.log('Column search', table.columns().search().toArray());
                // console.log('Global search', table.search());

                onSearch({
                    jqevent: e,
                    table: table
                });
            });
        }

        /** Draw event callback */
        if (onDraw) {
            table.on('draw', function(e, settings) {
                // console.log('Column search', table.columns().search().toArray());
                // console.log('Global search', table.search());

                onDraw({
                    jQEvent: e,
                    table: table
                });
            });
        }

        /** Select callback */
        if (onSelect) {
            table.on('select', function(e, dt, type, indexes) {
                onSelect({
                    e,
                    dt,
                    type,
                    indexes
                });
            });
        }

        /** Deselect callback */
        if (onDeselect) {
            table.on('deselect', function(e, dt, type, indexes) {
                onDeselect({
                    e,
                    dt,
                    type,
                    indexes
                });
            });
        }

        /** Load and draw data. */
        table.rows.add(data).draw();

        /** Adjust columns */
        table.columns.adjust().draw();
    }

    component.DataTable = () => {
        return $(`#${component.get().id}`).DataTable();
    }

    component.search = (term, column) => {
        $(`#${component.get().id}`).DataTable().columns(column).search(term).draw();
    }

    component.findRowById = (id) => {
        return $(`#${component.get().id}`).DataTable().row(`#${id}`);
    }
    
    component.updateRow = (param) => {
        const {
            row,
            data
        } = param;

        $(`#${component.get().id}`).DataTable().row(row).data(data).draw();
    }

    component.selected = () => {
        return $(`#${component.get().id}`).DataTable().rows({selected: true}).data().toArray();
    }

    component.addRow = (param) => {
        const {
            data
        } = param;

        $(`#${component.get().id}`).DataTable().row.add(data).draw();
    }

    component.removeRow = (row) => {
        $(`#${component.get().id}`).DataTable().row(row).remove().draw();
    }

    component.getButton = (className) => {
        return component.get().closest('.dataTables_wrapper').querySelector(`button.${className}`);
    }

    return component;
}