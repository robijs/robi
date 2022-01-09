import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function DateField(param) {
    const {
        label, description, parent, position, margin, value
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <input class='form-field-date form-control' type='date' ${value ? `value=${new Date(value).toISOString().split('T')[0]}` : ''}>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin: ${margin || '0px 0px 20px 0px'};
            }

            /* Labels */
            #id label {
                font-weight: 500;
            }

            #id .form-field-date {
                width: auto;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }
        `,
        parent: parent,
        position,
        events: []
    });

    component.value = (param) => {
        const field = component.find('.form-field-date');

        if (param) {
            field.value = new Date(param).toISOString().split('T')[0];
        } else {
            return field.value;
        }
    };

    return component;
}
// @END-File
