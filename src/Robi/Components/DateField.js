import { Component } from '../Actions/Component.js'
import { App } from '../Core.js';

/**
 *
 * @param {*} param
 * @returns
 */

export function DateField(param) {
    const {
        label, date, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <div class='form-field-label'>${label}</div>
                <input class='form-field-date' type='date' ${date ? `value=${date.toISOString().split('T')[0]}` : ''}>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin-bottom: 10px;
            }

            /* Labels */
            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px;
            }

            #id .form-field-date {
                font-size: .9em;
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
                padding: 10px;
                background: white;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
            }

            #id .form-field-date:active,
            #id .form-field-date:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px ${App.get('primaryColor')};
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
