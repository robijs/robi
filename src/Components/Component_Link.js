/** Settings */
import Setting_App from '../Settings/Setting_App.js'

import Action_Component from '../Actions/Action_Component.js'

/**
 * @param {Object} param 
 */
export default function Component_Link(param) {
    const {
        displayText,
        href,
        target,
        action,
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <a class='link'${href ? `href='${href}'`: ''}${target ? ` target='${target}'`: ''}>${displayText}</a>
        `,
        style: /*css*/ `
            #id {
                color: darkslategray;
                cursor: pointer;
            }

            #id:hover,
            #id:active,
            #id:focus {
                color: darkslategray;
                text-decoration: none;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener: action
            }
        ]
    });

    return component;
}