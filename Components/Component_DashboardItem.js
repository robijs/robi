/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_DashboardLongCard(param) {
    const {
        title,
        subTitle,
        text,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='dashboard-item'>
                <div class='dashboard-item label'>${title}</div>
                <div class='dashboard-item bold'>${subTitle}</div>
                <div class='dashboard-item normal'>${text}</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                /* margin: 20px; */
                padding: 10px;
                background: white;
                border-radius: 4px;
                border: ${Setting_App.defaultBorder};
                display: flex;
                align-items: center;
                /* flex: 1; */
            }

            #id .dashboard-item:not(:last-child) {
                margin-right: 20px;
            }

            #id .dashboard-item.label {
                font-size: 1.2em;
                color: ${Setting_App.primaryColor};
                font-weight: 500;
            }

            #id .dashboard-item.bold {
                font-weight: 500;
            }

            #id .dashboard-item.normal {
                font-weight: 400;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [

        ]
    });

    return component;
}