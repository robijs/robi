/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_MultiSelectCheckbox(param) {
    const {
        label,
        description,
        options,
        onCheck,
        direction,
        wrap,
        parent,
        width,
        position,
        margin,
        padding,
        fieldMargin
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/ `<div class='form-field-label'>${label}</div>` : ''}
                ${description ? /*html*/`<div class='form-field-description'>${description}</div>` : ''}
                ${createChoiceGroups()}
            </div>   
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .form-field-description {
                padding: 5px 0px;
            }

            #id .form-field-multi-select-container {
                display: flex;
                flex-direction: ${direction || 'column'};
                flex-wrap: ${wrap || 'wrap'};
                user-select: none;
                /*margin: 2px 20px;*/
                padding: ${padding || '0px 0px 20px 0px'};
                margin: ${margin || '0px'};
            }

            #id .form-field-multi-select-container:last-child {
                padding: 0px;
            }

            #id .form-field-multi-select-row {
                width: ${width || '120px'};
                /* margin-left: 20px; */
                display: flex;
                flex-direction: row;
                align-items: center;
            }

            #id .form-field-multi-select-row.flex-start {
                width: ${width || '120px'};
                margin-left: 20px;
                display: flex;
                flex-direction: row;
                align-items: flex-start;
            }

            #id .form-field-multi-select-row.flex-start .form-field-multi-select-value,
            #id .form-field-multi-select-row.flex-start .select-all-title {
                margin-top: 2px;
            }

            ${direction === 'row' ?
                /*css*/`
                    #id .form-field-multi-select-row {
                        margin-left: 20px;
                        margin-bottom: 10px;
                    }
                ` :
                ''
            }

            #id .form-field-multi-select-value,
            #id .select-all-title {
                margin-left: 5px;
            }

            #id .select-all-title {
                color: ${Setting_App.get('primaryColor')};
                font-weight: 500;
                padding: 5px 0px;
            }

            #id input[type='checkbox'] {
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            #id input[type='checkbox'] ~ .toggle {
                width: 20px;
                height: 20px;
                position: relative;
                display: inline-block;
                vertical-align: middle;
                background: white;
                border: solid 2px lightgray;
                border-radius: 4px;
                cursor: pointer;
            }

            #id input[type='checkbox']:hover ~ .toggle {
                border-color: mediumseagreen;
            }
            

            #id input[type='checkbox']:checked ~ .toggle {
                border: solid 2px mediumseagreen;
                background: mediumseagreen url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
            }

            /** List Styles */
            #id ul {
                margin: 0px;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id  input.select-all',
                event: 'change',
                listener: selectAll
            },
            {
                selector: '#id input:not(.select-all)',
                event: 'change',
                listener: toggleSelectALL
            }
        ]
    });

    function createChoiceGroups() {
        let html = ''

        options.forEach(group => {
            const {
                title,
                items,
                align
            } = group;

            html += /*html*/ `
                <div class='form-field-multi-select-container' data-group='${title}'>
            `;

            if (title !== '') {
                html += /*html*/ `
                    <div class='form-field-multi-select-row ${align}'>
                        <label>
                            <input type='checkbox' class='select-all' data-group='${title}'>
                            <span class='toggle'></span>
                        </label>
                        <span class='select-all-title'>${title}<span>
                    </div>
                `;
            }

            items.forEach(item => {
                html += rowTemplate(item, title, align);
            });

            html += /*html*/ `
                </div>
            `
        });

        return html;
    }

    function rowTemplate(item, group, align) {
        const {
            id,
            value,
            checked
        } = item;

        return /*html*/ `
            <div class='form-field-multi-select-row ${align}'>
                <label>
                    <input type='checkbox' data-group='${group}' data-value='${value}' data-itemid='${id}'${checked ? ' checked' : ''}>
                    <span class='toggle'></span>
                </label>
                <span class='form-field-multi-select-value'>${value}<span>
            </div>
        `;
    }

    /** Select all Radio buttons in group */
    function selectAll(event) {
        const group = this.dataset.group;
        const state = this.checked;
        const radioButtons = component.findAll(`input[data-group='${group}']`);

        radioButtons.forEach(button => {
            button.checked = state;
        });
    }

    /** Auto toggle Group Title Radio button */
    function toggleSelectALL(event) {
        const group = this.dataset.group;
        const all = component.findAll(`input[data-group='${group}']:not(.select-all)`).length;
        const checked = component.findAll(`input[data-group='${group}']:not(.select-all):checked`).length;
        const state = all === checked ? true : false;

        const selectAll = component.find(`input.select-all[data-group='${group}']`);

        if (selectAll) {
            selectAll.checked = state;
        }

        if (onCheck) {
            onCheck(event);
        }
    }

    component.setValue = (itemId, value) => {
        const checkbox = component.find(`input[data-itemid='${itemId}']`);

        if (checkbox) {
            checkbox.checked = value;
        }
    }

    component.addOption = (param) => {
        const {
            option,
            group
        } = param;

        const container = component.find(`.form-field-multi-select-container[data-group='${group}']`);

        container.insertAdjacentHTML('beforeend', rowTemplate(option, group, true));
    }

    component.value = (type) => {
        const rows = component.findAll('.form-field-multi-select-row input:checked');

        return [...rows].map(item => {
            if (type === 'id') {
                return parseInt(item.dataset.itemid);
            }

            const value = item.closest('.form-field-multi-select-row').querySelector('.form-field-multi-select-value')

            return value.innerText;
        });
    }

    component.checked = () => {
        const rows = component.findAll('.form-field-multi-select-row input:checked');

        return [...rows].map(item => {
            const id = parseInt(item.dataset.itemid);
            const value = item.closest('.form-field-multi-select-row').querySelector('.form-field-multi-select-value').innerText;

            return {
                id,
                value
            };
        });
    }

    return component
}