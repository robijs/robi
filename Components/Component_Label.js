/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_Label(param) {
    const {
        label,
        description,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <div class='form-field-label'>${label}</div>
                ${description ? /*html*/`<div class='form-field-description'>${description}</div>` : ''}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.form-field {
                margin-bottom: 20px;
            }

            #id .form-field-label {
                font-size: 1.1em;
                font-weight: 500;
                padding: 5px 0px;
            }

            #id .form-field-description {
                padding: 5px 0px;
            }
        `,
        parent: parent,
        position,
        events: [
           
        ]
    });

    return component
}