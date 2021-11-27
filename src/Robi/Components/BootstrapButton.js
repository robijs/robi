import { Component } from '../Actions.js';
import { App } from '../Core/Settings.js';

/**
 * {@link https://getbootstrap.com/docs/4.5/components/buttons/}
 *
 * @example btn-robi-primary
 * @example btn-secondary
 * @example btn-success
 * @example btn-danger
 * @example btn-warning
 * @example btn-info
 * @example btn-light
 * @example btn-dark
 *
 * @example btn-outline-robi-primary
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

export function BootstrapButton(param) {
    const {
        action, disabled, parent, position, classes, style, type, value
    } = param;

    const component = Component({
        html: /*html*/ `
            <button type="button" class="btn btn-${type} ${classes?.join(' ')}" ${disabled ? 'disabled' : ''} ${style ? `style='${style}'` : ''}>${value}</button>
        `,
        style: /*css*/ `
            #id.btn-robi {
                background: #e9ecef !important;
                /* color: ${App.get('primaryColor')}; */
                color: seagreen;
                font-weight: 500;
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
    };

    component.disable = () => {
        component.get().disabled = false;
    };

    return component;
}
