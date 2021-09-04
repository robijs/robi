/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_Button(param) {
    const {
        text,
        type,
        color,
        background,
        disabled,
        icon,
        size,
        parent,
        position,
        width,
        margin,
        action
    } = param;


    const component = Component({
        html: /*html*/ `
            <div class='square-button ${color || ''} ${disabled ? 'disabled' : ''} ${type}' >
                <svg class="icon">
                    <use href="#icon-${icon}"></use>
                </svg>
                <div class='square-button-text'>${text}</div>
            </div>
        `,
        style: /*css*/ `
            /* Default style */
            .square-button {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                cursor: pointer;
                font-size: ${size || '1.5em'};
                background: ${background || Setting_App.primaryColor};
                margin: ${margin || '5px'};
                padding: 10px;
                border-radius: 4px;
                border: solid 2px ${Setting_App.primaryColor};
                width: ${width || 'unset'};
            }

            /* Text */
            .square-button-text {
                color: white;
                font-size: ${size || '1.5em'};
                padding-left: 10px;
            }

            /* Types */
            .square-button.fixed {
                position: fixed;
                bottom: 20px;
                right: 20px;
            }

            .square-button .icon {
                stroke: ${color || 'white'};
                fill: ${color || 'white'};
            }

            /* Disabled */
            .square-button.disabled {
                pointer-events: none;
            }
            
            .square-button.disabled .icon {
                pointer-events: none;
                stroke: lightgray;
                fill: lightgray;
            }
        `,
        parent: parent,
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