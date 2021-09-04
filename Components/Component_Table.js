/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_Table(options) {
    const {
        heading,
        toolbar,
        checkboxes,
        headers,
        rows,
        tables,
        maxlines,
        maxWidth,
        nowrap
    } = options;
    
    let viewTables = tables;

    const component = Component({
        html: /*html*/ `
            <div class="table-container">
                <table class="table">
                    ${createTableHTML()}
                </table>
            </div>
        `,
        style: /*css*/ `
            /* Container */
            #id.table-container {
                user-select: none;
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
                display: flex;
                flex-direction: column;
                overflow: overlay;
                background: white;
                overflow: auto;
                border-radius: 4px;
                padding: 8px;
                border:  ${Setting_App.defaultBorder};
            }

            /* Table */
            .table {
                flex: 1;
                width: 100%;
                /* table-layout: fixed; */
                /* margin: 0px 10px 10px 10px; */
                border-collapse: separate;
                border-spacing: 0px;
                font-size: .9em;
            }

            /* Columns */
            .table .checkbox-col {
                width: 50px;
            }

            /* Rows */
            .table tbody tr:not(:last-child) td,
            .table tbody tr:not(:last-child) th {
                border-bottom: solid 1px lightgray;
            } 

            .table tbody tr:hover {
                background: ${Setting_App.secondaryColor};
            }

            .table tr:hover td:first-child {
                border-radius: 4px 0px 0px 4px;
            }

            .table tr:hover td:last-child {
                border-radius: 0px 4px 4px 0px;
            }

            /* Head */
            .table thead tr th {
                font-weight: 500;
            }

            /* Cells */
            .table th, 
            .table td {
                width: auto;
                padding: 10px;
                vertical-align: top;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .table thead th,
            .table tbody th {
                text-align: left;
            }

            .table thead th {
                border-bottom: solid 2px ${Setting_App.primaryColor};
                white-space: nowrap;
            }

            .table tbody td:not(:first-child),
            .table tbody th {
                cursor: pointer;
            }

            .table tbody td {
                font-weight: 500;
            }

            /* Inner cell content */
            .table tbody tr td div,
            .table tbody tr th div {
                display: -webkit-box;
                -webkit-line-clamp: ${maxlines || 2};
                -webkit-box-orient: vertical;
                max-height: 50px;
                max-width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .no-wrap {
                white-space: nowrap;
            }

            /* Checkboxes */
            label {
                display: flex;
            }

            input[type='checkbox'] {
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            input[type='checkbox'] ~ .toggle {
                width: 20px;
                height: 20px;
                position: relative;
                display: inline-block;
                vertical-align: middle;
                /* border: solid 2px seagreen; */
                border: solid 2px lightgray;
                border-radius: 4px;
                cursor: pointer;
            }

            input[type='checkbox']:hover ~ .toggle {
                border-color: mediumseagreen;
            }
            

            input[type='checkbox']:checked ~ .toggle {
                border: solid 2px mediumseagreen;
                background: mediumseagreen url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
            }
        `,
        parent: options.parent,
        position: options.position || 'beforeend',
        events: [
            {
                selector: `#id thead tr th input[type="checkbox"]`,
                event: 'change',
                listener: selectAllBodyCheckboxes
            },
            {
                selector: `#id tbody tr td input[type="checkbox"]`,
                event: 'change',
                listener: toggleActionData
            },
            {
                selector: `#id tbody tr td:not(:first-child)`,
                event: 'click',
                listener: runAction
            },
            {
                selector: `#id tbody tr th`,
                event: 'click',
                listener: runAction
            }
        ]
    });

    function createTableHTML() {
        return (checkboxes !== false ? createCheckboxColumn() : '') + (headers !== false ? createHeaders() : '') + (rows !== false ? createRows() : '');
    }

    function createCheckboxColumn() {
        return /*html*/ `
            <colgroup>
                <col class="checkbox-col">
            </colgroup>
        `
    }

    function createHeaders() {
        let headers = /*html*/ `
            <thead>
                <tr>
        `;

        // Add Checkboxes
        if (checkboxes !== false) {
            headers += /*html*/ `
                <th>
                    <label>
                        <input type="checkbox"  />
                        <span class="toggle"></span>
                    </label>
                </th>
            `
        }

        options.table.columns.forEach((column) => {
            headers += /*html*/ `
                <th>${column}</th>
            `;
        });

        headers += /*html*/ `
                </tr>
            </thead>
        `

        return headers;
    }

    function createRows() {
        let rows = /*html*/ `
            <tbody>
        `;
       
        options.data.forEach((item) => {

            /**
             * @date 2020.12.01
             * 
             * 
             */
            if (!item) {
                return
            }

            // console.log(item);

            rows += /*html*/ `
                <tr data-itemid=${item.Id} href="${item.__metadata.uri}">
            `

            // Add Checkboxes
            if (checkboxes !== false) {
                rows += /*html*/ `
                    <td data-itemid=${item.Id}>
                        <label>
                            <input type="checkbox" data-itemid=${item.Id} />
                            <span class="toggle"></span>
                        </label>
                    </td>
                `
            }

            // First column th not td
            const firstField = options.table.fields[0];
            const type = firstField.includes('Date'); // Hack.
            const value = type ? new Date(item[firstField]).toLocaleDateString() : item[firstField];

            // data-itemid -- is used eveywhere, but i can't tell what item the id is referencing,
            // still from the data set passed? is the item id needed all the way down to the node?
            rows += /*html*/ `
                <th data-itemid=${item.Id} data-column='${options.table.columns[0]}'>
                    <div ${nowrap ? `class='no-wrap'` : ''}>
                        ${value}
                    </div>
                </th>
            `;

            options.table.fields
            .slice(1)
            .forEach((field, index) => {
                const type = field.includes('Date') || field === 'Created' || field === 'Modified'; // Hack.
                const value = type ? new Date(item[field]).toLocaleDateString() : item[field];

                rows += /*html*/ `
                    <td data-itemid=${item.Id} data-column='${options.table.columns[index + 1]}'>
                        <div>
                            ${value}
                        </div>
                    </td>
                `;
            });

            rows += /*html*/ `
                </tr>
            `;
        });

        rows += /*html*/ `
            </tbody>
        `;

        return rows;
    }

    /** On row click, fire passed in [options.action] callback */
    function runAction(event) {
        const href = Array.from(event.path).find(el => el.nodeName === 'TR').getAttribute('href')
        if (options.action) {
            options.action(href);
        }
    }

    function selectAllBodyCheckboxes(event) {
        toggleButtonState();

        const rows = component.findAll(`tbody tr td input[type="checkbox"]`); // Just this table's checkboxes
        // const rows = document.querySelectorAll(`.table tbody tr td input[type="checkbox"]`); // Default to all rows in current view

        if (this.checked) {
            rows.forEach(row => {
                toggleChecked(row, true);
            });
        } else {
            rows.forEach(row => {
                toggleChecked(row, false);
            });   
        }
    }

    function toggleChecked(checkbox, checked) {
        const changeEvent = new Event("change", {'bubbles': true, 'cancelable' :false});

        checkbox.checked = checked;
        checkbox.dispatchEvent(changeEvent);
    }

    function toggleButtonState() {
        let checked;

        if (viewTables) {
            // All tables in curren view
            checked = viewTables
                .map(table => [...table.getChecked()])
                .flat()
                .length;
        } else {
            // Just this table's checkboxes
            checked = component.findAll(`tbody tr td input[type="checkbox"]:checked`).length;
        }

        if (checked) {
            setButtonState(enableButton);
        } else {
            setButtonState(disableButton);
        }
    }

    function setButtonState(state) {
        if (toolbar.buttons) {
            Object.entries(toolbar.buttons).forEach(state);
        }
    }
    
    function enableButton([key, value]) {
        value.enable();
    }

    function disableButton([key, value]) {
        value.disable();
    }

    function toggleActionData(event) {
        toggleHeaderCheckbox();
        toggleButtonState();

        const rowCount = component.findAll(`tbody tr td input[type="checkbox"]`).length;

        const actionData = {
            list: options.list,
            node: this.closest('tr'),
            table: component,
            heading,
            itemId: this.dataset.itemid,
            rowCount
        }

        if (this.checked) {
            Setting_App.store.register(actionData);
        } else {
            Setting_App.store.deregister(actionData);
        }
    }

    function toggleHeaderCheckbox() {
        const rows = component.findAll(`tbody tr td input[type="checkbox"]`).length; // Just this table's checkboxes
        const checked = component.findAll(`tbody tr td input[type="checkbox"]:checked`).length; // Just this table's checkboxes

        // If all unchecked, uncheck header checkbox 
        if (checked === 0) {
            const selectAll = component.find(`thead tr th input[type="checkbox"]`);

            selectAll.checked = false;
        } 

        // If all checked, check header checkbox 
        else if (checked === rows) {
            const selectAll = component.find(`thead tr th input[type="checkbox"]`);

            selectAll.checked = true;
        }
    }

    function registerActionData(item) {
        Setting_App.store.registerActionData(item);
    }

    function removeActionData(item) {
        Setting_App.store.removeActionData(item);
    }

    component.setTables = (newTables) => {
        viewTables = newTables;
    }

    component.getChecked = () => {
        return component.findAll(`tbody tr td input[type="checkbox"]:checked`);
    }

    component.selectAll = (checked) => {
        const selectAllCheckbox = component.find(`thead tr th input[type="checkbox"]`);

        if (!selectAllCheckbox) {
            return;
        }

        if (checked && selectAllCheckbox) {
            toggleChecked(selectAllCheckbox, true);
        } else {
            toggleChecked(selectAllCheckbox, false);
        }
    }
    
    component.updateCell = (param) => {
        const {
            itemId,
            column,
            value
        } = param;

        const cell = component.find(`tr[data-itemid='${itemId}'] td[data-column='${column}'] div`);

        if (cell) {
            cell.innerText = value;
        }
    }

    return component;
}