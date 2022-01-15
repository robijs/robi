import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function NumberField(param) {
    const {
        label, description, value, parent, position, fieldMargin, onChange, onKeydown, onKeyup, onFocusout
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <label>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <input type="number" class="form-control" value="${value !== undefined ? parseFloat(value) : ''}">
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id input',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id input',
                event: 'keyup',
                listener: onKeyup
            },
            {
                selector: '#id input',
                event: 'focusout',
                listener: onFocusout
            },
            {
                selector: '#id input',
                event: 'change',
                listener: onChange
            }
        ]
    });

    component.focus = () => {
        const field = component.find('.form-field-single-line-text');

        field.focus();
    };

    component.isValid = (state) => {
        if (state) {
            component.find('.form-control').classList.remove('invalid');
            component.find('.form-control').classList.add('valid');
        } else {
            component.find('.form-control').classList.remove('valid');
            component.find('.form-control').classList.add('invalid');
        }
    };

    component.value = (param) => {
        const field = component.find('input');

        if (param !== undefined) {
            console.log(param);
            field.value = parseFloat(param);
        } else {
            return parseFloat(field.value);
        }
    };

    return component;
}
// @END-File
