/** Settings */
import { App } from '../Core/Settings.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_MultiLineTextField(param) {
    const {
        label,
        labelSize,
        description,
        optional,
        value,
        readOnly,
        placeHolder,
        parent,
        position,
        minHeight,
        width,
        fieldMargin,
        fontWeight,
        padding,
        onKeydown,
        onFocusout
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <!-- ${label ? /*html*/`<div class='form-field-label'>${label}</div>` : ''} -->
                ${label ? /*html*/`<div class='form-field-label'>${label}${optional ? /*html*/ `<span class='optional'><i>Optional</i></span>` : ''}</div>` : ''}
                ${description ? /*html*/`<div class='form-field-description'>${description}</div>` : ''}
                ${readOnly ? /*html*/ `<div class='form-field-multi-line-text readonly'>${value || placeHolder}</div>` : /*html*/ `<div class='form-field-multi-line-text editable' contenteditable='true'>${value || ''}</div>`}
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                width: inherit;
            }

            #id .form-field-label {
                font-size: ${labelSize || '1.1em'};
                font-weight: bold;
                padding: 5px 0px;
            }

            #id .form-field-description {
                font-size: .95em;
                font-weight: 400;
                padding-left: 5px;
                padding-top: 5px;
                margin-bottom: 15px;
            }

            #id .form-field-multi-line-text {
                font-size: 1em;
                font-weight: ${fontWeight || '500'};
                font-size: ${fontSize || '.85em'};
                margin-top: 2px;
                margin-bottom: 4px;
                padding: ${padding || '10px'};
            }

            #id .form-field-multi-line-text.editable {
                min-height: ${minHeight || `300px`};
                width: ${width || 'unset'};
                background: white;
                border-radius: 4px;
                border: ${App.get('defaultBorder')};
            }

            #id .form-field-multi-line-text.editable:active,
            #id .form-field-multi-line-text.editable:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px ${App.get('primaryColor')};
            }

            /** Readonly */
            #id .form-field-multi-line-text.readonly {
                user-select: none;
                background: transparent;
                border: solid 1px rgba(0, 0, 0, .05);
                background: white;
                border-radius: 4px;
            }

            /* Optional */
            #id .optional {
                margin: 0px 5px;
                font-size: .8em;
                color: gray;
                font-weight: 400;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'focusout',
                listener: onFocusout
            },
            {
                selector: '#id .form-field-multi-line-text.editable',
                event: 'keydown',
                listener: onKeydown
            }
        ]
    });

    component.focus = () => {
        const field = component.find('.form-field-multi-line-text');

        field.focus();
    }

    component.value = (param, options = {}) => {
        const field = component.find('.form-field-multi-line-text');

        if (param !== undefined) {
            field.innerHTML = param;
        } else {
            if (options.plainText === true) {
                return field.innerText;
            } else {
                return field.innerHTML;
            }
        }
    }

    return component
}