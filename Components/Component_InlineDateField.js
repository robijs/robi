/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_DateField(param) {
    const {
        before,
        after,
        margin,
        date,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <div>${before}</div>
                <input class='form-field-date' type='date' value=${date.toISOString().split('T')[0]}>
                <div>${after}</div>
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            #id.form-field {
                margin: ${margin || '0px 0px 20px 0px'};
                display: flex;
                align-items: center;
            }

            #id .form-field-date {
                font-size: .9em;
                font-weight: 500;
                margin: 2px 5px 4px 5px;
                padding: 10px;
                background: white;
                border-radius: 4px;
                border: ${Setting_App.defaultBorder};
            }

            #id .form-field-date:active,
            #id .form-field-date:focus {
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
        const field = component.find('.form-field-date');

        if (param !== undefined) {
            if (param === '') {
                field.value = '';
            } else {
                field.value = new Date(param).toISOString().split('T')[0];
            }
        } else {
            return field.value;
        }
    }

    return component
}