/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_Button(param) {
    const {
        type,
        value,
        display,
        margin,
        parent,
        action,
        disabled,
        width
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class="form-button ${type}-button ${disabled ? 'disabled' : ''}">${value}</div>
        `,
        style: /*css*/ `
            #id.form-button {
                cursor: pointer;
                display: ${display || 'inline-block'};
                margin: ${margin || '0px 20px 0px 0px'};
                padding: 5px 10px;
                font-size: .9em;
                font-weight: 400;
                text-align: center;
                white-space: nowrap;
                border-radius: 4px;
                width: ${width || 'fit-content'};
            }

            #id.disabled {
                pointer-events: none;
                filter: opacity(0.75);
            }

            #id.normal-button {
                color: white;
                background: rgba(${Setting_App.primaryColorRGB}, .9);
                border: solid 1px transparent;
            }

            #id.back-button,
            #id.hollow-button,
            #id.cancel-button {
                color: rgba(${Setting_App.primaryColorRGB}, .9);
                background: transparent;
                border: solid 1px rgba(${Setting_App.primaryColorRGB}, .9);
            }

            #id.create-button,
            #id.update-button {
                color: white;
                background: mediumseagreen;
                border: solid 2px seagreen;
            }

            #id.create-button *,
            #id.update-button * {
                color: white;
            }

            #id.stop-button {
                color: white;
                background: crimson;
                border: solid 2px firebrick;
            }

            #id.delete-button {
                color: firebrick;
                text-decoration: underline;
                font-size: .9em;
            }

            /* .delete-button {
                color: white;
                background: firebrick;
                border: solid 2px firebrick;
                box-shadow: 0 1px 6px 0 rgba(32, 33, 36, .28);
            } */
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '#id.form-button',
                event: 'click',
                listener(event) {
                    if (!event.target.classList.contains('disabled')) {
                        action(event);
                    } else {
                        console.log(event.target, '\tis disbaled');
                    }
                }
            }
        ]
    });

    component.setValue = (html) => {
        component.get().innerHTML = html;

        return component
    }

    component.disable = () => {
        component.get().classList.add('disabled');

        return component
    }

    component.enable = () => {
        component.get().classList.remove('disabled');

        return component
    }

    return component;
}