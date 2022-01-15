import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function SingleLineTextField(param) {
    const {
        addon, classes, label, description, value, readOnly, parent, position, width, margin, padding, placeholder, background, borderRadius, flex, maxWidth, fieldMargin, optional, onKeydown, onKeyup, onKeypress, fontSize, onFocusout,
    } = param;

    let events = [];

    if (onKeydown) {

    }

    const component = Component({
        html: /*html*/ `
            
            <div class='form-field${classes ? ` ${classes.join(' ')}` : ''}'>
                ${label ? /*html*/ `<label class='form-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                ${
                    addon ?
                    /*html*/ `
                        <div class='input-group'>
                            <div class='input-group-prepend'>
                                <div class='input-group-text'>${addon}</div>
                            </div>
                            ${Field()}
                        </div>    
                    ` :
                    /*html*/ `
                        ${Field()}
                    `
                }
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                position: relative;
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                ${flex ? `flex: ${flex};` : ''}
                ${padding ? `padding: ${padding};` : ''}
                ${borderRadius ? `border-radius: ${borderRadius};` : ''}
                ${background ? `background: ${background};` : ''}
            }

            ${
                readOnly ?
                /*css*/ `
                    #id label {
                        margin-bottom: 0px;
                        font-weight: 500;
                    }
                ` :
                /*css*/ `
                    #id label {
                        font-weight: 500;
                    }
                `
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .slot-field {
                width: ${width || 'unset'};
                font-size: ${fontSize || '13px'};
                font-weight: 500;
                margin: ${margin || '2px 0px 4px 0px'};
                padding: 5px 10px;
                border-radius: 4px;
                transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }

            #id .slot-field.readonly {
                font-size: 13px;
                font-weight: 400;
                color: var(--color); 
                background: transparent;
                border: solid 1px transparent;
                margin: 0px;
                padding: 0px;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .form-control',
                event: 'keydown',
                listener: onKeydown
            },
            {
                selector: '#id .form-control',
                event: 'keyup',
                listener: onKeyup
            },
            {
                selector: '#id .form-control',
                event: 'keypress',
                listener: onKeypress
            },
            {
                selector: '#id .form-control',
                event: 'focusout',
                listener: onFocusout
            }
        ]
    });

    // NOTE: Edge won't respect autocomplete='off', but autocomplete='new-password' seems to work
    function Field() {
        return readOnly ?
        /*html*/ `
            <div type='text' class='slot-field readonly'>${value || ''}</div>
        ` :
        /*html*/ `
            <input type='text' class='form-control' value='${value || ''}' list='autocompleteOff' autocomplete='new-password' placeholder='${placeholder || ''}'>
        `;
    }

    component.focus = () => {
        const field = component.find('.form-control');

        field?.focus();
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
        const field = component.find('.form-control');

        if (param !== undefined) {
            field.value = param;
        } else {
            return field.value;
        }
    };

    return component;
}
// @END-File
