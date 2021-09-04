/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_DashboardCard(param) {
    const {
        title,
        data,
        parent,
        position,
        onClick
    } = param;

    // ${createInfoGroup('All Items', breaches.concat(complaints))}
    // ${createInfoGroup('Breaches', breaches)}
    // ${createInfoGroup('Complaints', complaints)}
    
    const component = Component({
        html: /*html*/ `
            <div class='dashboard-card'>
                <div class='dashboard-card-title'>${title}</div>
                <div class='dashboard-card-info-container'>
                    ${createInfoGroups()}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                cursor: ${onClick !== false ? 'pointer' : 'default'};
                /* margin: 20px; */
                padding: 10px;
                background: white;
                border-radius: 4px;
                border: ${Setting_App.defaultBorder};
                /* width: 400px; */
                width: 528px; /* 528 = 1060/2 - 2 pixels (1 left + 1 right border) */
                display: flex;
                flex-direction: column;
            }

            #id .dashboard-card-title {
                font-size: 1.8em;
                font-weight: 500;
                color: ${Setting_App.primaryColor};
                margin-bottom: 10px;
            }

            #id .dashboard-card-info-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }
            
            #id .dashboard-card-info-group {
                margin: 5px 0px;
            }

            #id .dashboard-card-info {
                display: flex;
                justify-content: space-between;
                font-size: 1.4em;
            }

            #id .dashboard-card-info.smaller {
                font-size: 1em;
            }

            #id .dashboard-card-info-label {
                font-weight: 500;                
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id',
                event: 'click',
                listener(event) {
                    if (onClick !== false) {
                        Setting_App.route(`Command?command=${title}`);
                    }
                }
            }
        ]
    });

    function createInfoGroups() {
        let html = '';

        data.forEach(group => {
            const {
                groupLabel,
                value,
                subGroups
            } = group;

            html += /*html*/ `
                <div class='dashboard-card-info-group'>
                    <div class='dashboard-card-info'>
                        <div class='dashboard-card-info-label'>${groupLabel}</div>
                        <div>${value}</div>
                    </div>
            `;

            subGroups.forEach(subGroup => {
                const {
                    label,
                    value
                } = subGroup;

                html += /*html*/ `
                    <div class='dashboard-card-info smaller'>
                        <div class='dashboard-card-info-label'>${label}</div>
                        <div>${value}</div>
                    </div>
                `;
            });

            html += /*html*/ `
                </div>
            `;
        });

        return html;
    }

    return component;
}