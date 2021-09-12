/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_NumberField(param) {
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
        onChange,
        onKeydown,
        onKeyup,
        onFocusout
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div>
                <label>${label}</label>
                <input type="number" class="form-control" value="${value !== undefined ? parseFloat(value) : ''}">
            </div>
        `,
        style: /*css*/ `
            #id {
                ${margin ? `margin: ${margin};` : ''}
            }

            #id label {
                font-size: 1.1em;
                font-weight: bold;
                padding: 5px 0px;
                margin-bottom: 0px;
            }

            #id input:active,
            #id input:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 1px ${Setting_App.get('primaryColor')};
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
        const field = component.find('input');

        if (param !== undefined) {
            field.value = parseFloat(param);
        } else {
            return field.value;
        }
    }

    return component
}