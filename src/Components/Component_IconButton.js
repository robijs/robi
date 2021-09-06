/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_Button(options) {
    const {
        color,
        disabled,
        icon,
        root,
        parent,
        position,
        action
    } = options;


    const component = Component({
        html: /*html*/ `
            <span class='button ${color || ''} ${disabled ? 'disabled' : ''}' >
                ${icon}
            </span>
        `,
        style: /*css*/ `
            /* Default style */
            .button {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: 1.5em;
                margin: 0px 10px;
                padding: 10px;
            }

            .button .icon {
                stroke: ${Setting_App.primaryColor};
                fill: ${Setting_App.primaryColor};
            }

            /* Colors */
            .button.green .icon {
                stroke: mediumseagreen;
                fill: mediumseagreen;
            }

            /* Disabled */
            .button.disabled {
                pointer-events: none;
            }
            
            .button.disabled .icon {
                pointer-events: none;
                stroke: lightgray;
                fill: lightgray;
            }
        `,
        parent: parent,
        root: root,
        position: position || 'beforeend',
        events: [
            {
                selector: `#id`,
                event: 'click',
                listener: runAction
            }
        ]
    });

    function runAction(event) {
        if (action) {
            action(event);
        }
    }

    component.enable = () => {
        const button = component.get();

        button.classList.remove('disabled');
    }

    component.disable = () => {
        const button = component.get();

        button.classList.add('disabled');
    }

    return component;
}