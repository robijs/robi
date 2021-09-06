/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_Text(param) {
    const {
        text,
        parent,
        position,
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='text'>
                ${text}
            </div>
        `,
        style: /*css*/ `
            #id * {
                font-size: 1.2em;
            }

            #id a {
                color: ${Setting_App.defaultColor};
                border-bottom: solid 2px ${Setting_App.defaultColor};
            }

            #id a:focus,
            #id a:active,
            #id a:hover {
                color: ${Setting_App.defaultColor};
                text-decoration: none;
            }

            #id a:hover {
                border-bottom: solid 2px ${Setting_App.primaryColor};
            }
        `,
        parent: parent,
        position,
        events: [

        ]
    });

    return component
}