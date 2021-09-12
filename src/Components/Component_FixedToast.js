/** Actions */
import Action_Store from '../Actions/Action_Store.js'
import Action_Component from '../Actions/Action_Component.js'

/** Settings */
import { App } from '../Core/Settings.js'

export default function Component_FixedToast(param) {
    const {
        top,
        bottom,
        left,
        right,
        title,
        message,
        action,
        onClose,
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='fixed-toast slide-in inverse-colors'>
                <div class='fixed-toast-title'>
                    <strong class='mr-auto'>${title}</strong>
                    <button type='button' class='ml-4 mb-1 close'>
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </div>
                <div class='fixed-toast-message'>
                    ${message}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id.fixed-toast {
                position: fixed;
                z-index: 1000;
                font-size: 1em;
                max-width: 385px;
                padding: 20px;
                box-shadow: 0 0.25rem 0.75rem rgb(0 0 0 / 10%);
                border-radius: 4px;
                ${
                    top ? 
                    `top: ${top};` :
                    ''
                }
                ${
                    bottom ? 
                    `bottom: ${bottom};` :
                    ''
                }
                ${
                    left ? 
                    `left: ${left};` :
                    ''
                }
                ${
                    right ? 
                    `right: ${right};` :
                    ''
                }
            }

            #id.inverse-colors {
                background: ${App.get('primaryColor')};
            }

            #id.inverse-colors * {
                color: white;
            }

            /** Slide In */
            .slide-in {
                animation: slidein 500ms ease-in-out forwards;
            }

            /** Slide Out */
            .slide-out {
                animation: slideout 500ms ease-in-out forwards;
            }

            /* Close */
            #id .close {
                outline: none;
            }

            /* Title */
            #id .fixed-toast-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            /** Message */
            #id .fixed-toast-message {
                cursor: pointer;
            }

            @keyframes slidein {
                from {
                    /* opacity: 0; */
                    transform: translate(400px);
                }

                to {
                    /* opacity: 1; */
                    transform: translate(-10px);
                }
            }

            @keyframes slideout {
                from {
                    /* opacity: 0; */
                    transform: translate(-10px);
                }

                to {
                    /* opacity: 1; */
                    transform: translate(400px);
                }
            }
        `,
        position,
        parent,
        events: [
            {
                selector: '#id .fixed-toast-message',
                event: 'click',
                listener: action
            },
            {
                selector: '#id .close',
                event: 'click',
                listener(event) {
                    /** Run close callback */
                    if (onClose) {
                        onClose(event);
                    }

                    /** Animate and remove component */
                    component.get().addEventListener('animationend', event => {
                        console.log('end slide out');

                        component.remove();
                    });

                    component.get().classList.remove('slide-in');
                    component.get().classList.add('slide-out');
                }
            }
        ]
    });

    return component;
}