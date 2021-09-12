/* Actions */
import Action_Component from '../Actions/Action_Component.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default function Component_SingleLineTextField(param) {
    const {
        label,
        description,
        value,
        readOnly,
        parent,
        position,
        width,
        margin,
        padding,
        background,
        borderRadius,
        flex,
        maxWidth,
        fieldMargin,
        optional,
        onKeydown,
        fontSize,
        onFocusout
    } = param;

    let events = [];

    if (onKeydown) {
        events.push({
            selector: '#id .form-field-single-line-text',
            event: 'keydown',
            listener: onKeydown
        });
    }

    if (onFocusout) {
        events.push({
            selector: '#id .form-field-single-line-text',
            event: 'focusout',
            listener: onFocusout
        });
    }

    const component = Action_Component({
        html: /*html*/ `
            <div class='form-field'>
                ${label ? /*html*/`<div class='form-field-label'>${label}${optional ? /*html*/ `<span class='optional'><i>Optional</i></span>` : ''}</div>` : ''}
                ${description ? /*html*/`<div class='form-field-description'>${description}</div>` : ''}
                ${readOnly ? /*html*/ `<div class='form-field-single-line-text readonly'>${value || ''}</div>` : /*html*/ `<div class='form-field-single-line-text editable' contenteditable='true'>${value || ''}</div>`}
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                ${flex ? `flex: ${flex};` : ''}
                ${padding ? `padding: ${padding};` : ''}
                ${borderRadius ? `border-radius: ${borderRadius};` : ''}
                ${background ? `background: ${background};` : ''}
            }

            #id .form-field-label {
                font-size: .95em;
                font-weight: bold;
                padding: 3px 0px;
            }

            #id .form-field-description {
                padding: 5px 0px;
            }

            #id .form-field-single-line-text {
                width: ${width || 'unset'};
                min-height: 36px;
                font-size: ${fontSize || '.85em'};
                font-weight: 500;
                margin: ${margin || '2px 0px 4px 0px'};
                padding: 5px 10px;
                border-radius: 4px;
                background: white;
                border: ${Setting_App.get('defaultBorder')};
                transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
            }

            #id .form-field-single-line-text.readonly {
                background: transparent;
                border: solid 1px transparent;
                margin: 0px;
                /* padding: 0px; */
                padding: 0px;
            }

            #id .form-field-single-line-text.editable:active,
            #id .form-field-single-line-text.editable:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px ${Setting_App.get('primaryColor')};
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
        events
    });

    component.focus = () => {
        const field = component.find('.form-field-single-line-text');

        field.focus();
    }

    component.addError = (param) => {
        component.removeError();
        
        let text = typeof param === 'object' ? param.text : param;

        const html = /*html*/ `
            <div class='alert alert-danger' role='alert'>
                ${text}
                ${param.button ? 
                    /*html*/ ` 
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    ` 
                    : ''
                }
            </div>
        `;

        component.find('.form-field-single-line-text').insertAdjacentHTML('beforebegin', html);
    }

    component.removeError = () => {
        const message = component.find('.alert');

        if (message) {
            message.remove();
        }
    }

    component.value = (param) => {
        const field = component.find('.form-field-single-line-text');

        if (param !== undefined) {
            field.innerText = param;
        } else {
            return field.innerText;
        }
    }

    return component
}