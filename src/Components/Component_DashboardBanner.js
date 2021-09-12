/** Settings */
import { App } from '../Core/Settings.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_DashboardBanner(param) {
    const {
        margin,
        padding,
        border,
        parent,
        data,
        action,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='dashboard-banner'>
                ${buildDashboard()}
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '20px'};
                padding: ${padding || '10px'};
                background: white;
                border-radius: 4px;
                border: ${border || App.get('defaultBorder')};
                /* display: flex; */
                display: flex;
                justify-content: space-between;
                overflow: overlay;
            }

            #id .dashboard-banner-group {
                flex: 1;
                padding: 10px;
                border-radius: 4px;
            }

            #id .dashboard-banner-group:not(:last-child) {
                margin-right: 10px;
            }

            #id .dashboard-banner-group[data-action='true'] {
                cursor: pointer;
            }

            #id .dashboard-banner-label,
            #id .dashboard-banner-description {
                white-space: nowrap;
                font-size: .9em;
            }

            #id .dashboard-banner-value {
                font-size: 1.5em;
                font-weight: 500;
            }

            @media screen and (max-width: 1120px) {
                #id .dashboard-banner-group {
                    padding: 8px;
                }

                #id .dashboard-banner-value {
                    font-size: 1em;
                    font-weight: 500;
                }
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
           {
                selector: `#id .dashboard-banner-group[data-action='true']`,
                event: 'click',
                listener: action
           }
        ]
    });

    function buildDashboard() {
        let html = '';

        data.forEach(item => {
            const {
                label,
                value,
                description,
                action,
                color,
                background
            } = item;

            html += /*html*/ `
                <div class='dashboard-banner-group' style='background: ${background || 'transparent'}' data-label='${label}' data-action='${action ? 'true' : 'false'}'>
                    <div class='dashboard-banner-label' style='color: ${color || App.get('defaultColor')}'>${label}</div>
                    <div class='dashboard-banner-value' style='color: ${color || App.get('defaultColor')}'>${value}</div>
                    <div class='dashboard-banner-description' style='color: ${color || App.get('defaultColor')}'>${description || ''}</div>
                </div>
            `;
        });
        
        return html;
    }

    component.group = (label) => {
        const group = component.find(`.dashboard-banner-group[data-label='${label}']`);

        if (group) {
            return {
                group,
                data: {
                    label: group.querySelector('.dashboard-banner-label').innerHTML,
                    value: group.querySelector('.dashboard-banner-value').innerHTML,
                    description: group.querySelector('.dashboard-banner-description').innerHTML
                }
            }
        }
    }

    component.update = (groups) => {
        groups.forEach(item => {
            const {
                label,
                value,
                description,
            } = item;

            const valueField = component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-value`);

            if (valueField && value !== undefined) {
                valueField.innerText = value;
            }

            const descriptionField = component.find(`.dashboard-banner-group[data-label='${label}'] .dashboard-banner-description`);

            if (descriptionField && description !== undefined) {
                descriptionField.innerText = description;
            }
        });
    }

    return component;
}