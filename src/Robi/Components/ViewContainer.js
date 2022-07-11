import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function ViewContainer(param) {
    const {
        parent
    } = param;

    // Collapse container height
    const padding = '62px';

    const component = Component({
        html: /*html*/ `
            <div class='viewcontainer'></div>
        `,
        style: /*css*/ `
            .viewcontainer {
                position: relative;
                padding: ${padding};
                height: 100vh;
                overflow: overlay;
            }

            .viewcontainer.dim {
                filter: blur(25px);
                user-select: none;
                overflow: hidden,
            }

            /* Editable */
            #id .editable-transition::before {
                transition: box-shadow 200ms ease-in-out,
                            background-color 150ms ease-in-out;
                content: '';
                position: absolute;
                width: calc(100% + 20px);
                height: calc(100% + 20px);
                top: -10px;
                left: -10px;
                border-radius: 6px;
            }

            #id .editable {
                position: relative;
                cursor: pointer;
            }

            #id .editable::before {
                box-shadow: 0px 0px 0px 1px var(--border-color);
            }

            #id .editable:hover::before {
                box-shadow: 0px 0px 0px 2px var(--primary);
            }

            /* Drop target */
            #id .drop-target::before {
                box-shadow: 0px 0px 0px 1px var(--input-border-color);
            }

            #id .drop-target:hover::before {
                box-shadow: 0px 0px 0px 2px var(--primary);
            }
        `,
        parent,
        events: []
    });

    component.dim = (toggle) => {
        const viewContainer = component.get();

        if (toggle) {
            viewContainer.classList.add('dim');
        } else {
            viewContainer.classList.remove('dim');
        }
    };

    component.paddingOff = () => {
        component.get().style.padding = '0px';
    };

    component.paddingOn = () => {
        component.get().style.padding = padding;
    };

    component.eventsOff = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'none';
        });
    };

    component.eventsOn = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'initial';
        });
    };
    return component;
}
// @END-File
