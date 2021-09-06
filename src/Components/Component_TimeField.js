/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_TimeField(param) {
    const {
        label,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label class='form-field-label'>${label}</label>
                <input class='form-field-time' type='time' step='3600'>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin-bottom: 20px;
            }

            /* Labels */
            #id .form-field-label {
                font-size: 1.1em;
                font-weight: bold;
            }

            #id .form-field-time {
                font-weight: 500;
                margin-top: 2px;
                margin-bottom: 4px;
                padding: 5px;
                background: white;
                border-radius: 4px;
                border: ${Setting_App.defaultBorder};
            }

            #id .form-field-time:active,
            #id .form-field-time:focus {
                outline: none;
                border: solid 1px transparent;
                box-shadow: 0px 0px 0px 2px ${Setting_App.primaryColor};
            }
        `,
        parent: parent,
        position,
        events: [

        ]
    });

    component.value = (param) => {
        const field = component.find('.form-field-time');

        if (param) {
            // field.value = new Date(param).toISOString().split('T')[1];
        } else {
            return field.value;
        }
    }

    return component
}