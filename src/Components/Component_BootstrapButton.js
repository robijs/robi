/** Settings */
import { App } from '../Core/Settings.js'

/* Actions */
import Action_Component from '../Actions/Action_Component.js'

/**
 * {@link https://getbootstrap.com/docs/4.5/components/buttons/}
 * 
 * @example btn-primary
 * @example btn-secondary
 * @example btn-success
 * @example btn-danger
 * @example btn-warning
 * @example btn-info
 * @example btn-light
 * @example btn-dark
 * 
 * @example btn-outline-primary
 * @example btn-outline-secondary
 * @example btn-outline-success
 * @example btn-outline-danger
 * @example btn-outline-warning
 * @example btn-outline-info
 * @example btn-outline-light
 * @example btn-outline-dark
 * 
 * @param {Object} param 
 * @returns 
 */
export default function Component_Button(param) {
    const {
        action,
        parent,
        position,
        margin,
        type,
        value
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <button type="button" class="btn ${type}">${value}</button>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || ''};
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id`,
                event: 'click',
                listener: action
            }
        ]
    });

    component.enable = () => {
        component.get().disabled = true;
    }

    component.disable = () => {
        component.get().disabled = false;
    }

    return component;
}