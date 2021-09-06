/** Settings */
import Setting_App from '../Settings/Setting_App.js'

import Component from '../Actions/Action_Component.js'

export default function Component_Form(param) {
    const {
        fields,
        position,
        parent
    } = param;
    
    const component = Component({
        html: /*html*/ `
            <form class='form'>
                ${buildFields()}
            </form>
        `,
        style: /*css*/ `
 
        `,
        parent,
        position,
        events: [

        ]
    });

    function buildFields() {
        let html = '';

        fields.forEach(field => {
            const {
                value,
                type
            } = field;

            html += /*html*/ `
                <input type='${type}' value='${value}'>
            `;
        })
    }

    component.value = () => {
        return [...component.get().elements]
    }

    return component;
}