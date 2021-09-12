/** Settings */
import { App } from '../Core/Settings.js'

import Component from '../Actions/Action_Component.js'

export default function Component_MainContainer(param) {
    const {
        parent
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='maincontainer'></div>
        `,
        style: /*css*/ `
            .maincontainer {
                position: relative;
                padding: 15px 30px;
                flex: 1;
                height: 100vh;
                overflow: overlay;
            }

            .maincontainer.dim {
                filter: blur(25px);
                user-select: none;
                overflow: hidden,
            }
        `,
        parent,
        position: 'beforeend',
        events: []
    });

    component.dim = (toggle) => {
        const maincontainer = component.get();
        
        if (toggle) {
            maincontainer.classList.add('dim');
        } else {
            maincontainer.classList.remove('dim');
        }
    }

    component.paddingOff = () => {
        component.get().style.padding = '0px';
    }

    component.paddingOn = () => {
        component.get().style.padding = '15px 30px';
    }

    component.eventsOff = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'none';
        });
    }

    component.eventsOn = () => {
        [...component.get().children].forEach(child => {
            child.style.pointerEvents = 'initial';
        });
    }
    return component;
}