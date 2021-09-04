/* Global Actions */
import Action_Component from '../Actions/Action_Component.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default function Component_DashboardLongCard(param) {
    const {
        border,
        margin,
        data,
        parent,
        position,
        onClick
    } = param;

    const {
        visits,
    } = data;

    const component = Action_Component({
        html: /*html*/ `
            <div class='dashboard-long-card'>
                <!-- Text -->
                <div class='dashboard-long-card-container'>
                    ${createInfoGroup('Today', 'today')}
                    ${createInfoGroup('This Week', 'week')}
                    ${createInfoGroup('This Month', 'month')}
                    ${createInfoGroup('This Year', 'year')}
                </div>
                <!-- Chart -->
                <div class='dashboard-long-card-container'>
                    <div class='dashboard-long-card-chart-title'></div>
                    <div class='dashboard-long-card-chart-container'>
                        <canvas class="myChart" width="700" height="350"></canvas>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '20px'};
                padding: 10px;
                background: white;
                border-radius: 4px;
                border: ${border || Setting_App.defaultBorder};
                display: flex;
                flex: 1;
            }

            /** Left/Right Containers */
            #id .dashboard-long-card-container {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
            }

            /** Text */
            #id .dashboard-long-card-info-group {
                cursor: pointer;
                margin: 5px 0px;
            }

            #id .dashboard-long-card-info {
                display: flex;
                justify-content: space-between;
                font-size: 1.1em;
            }

            #id .dashboard-long-card-info.smaller {
                font-size: .8em;
            }

            #id .dashboard-long-card-info-label {
                font-weight: 500;
                margin-right: 30px;             
            }

            /** Chart */
            #id .dashboard-long-card-chart-container {
                margin-left: 30px;
                margin-right: 5px;
            }

            #id .dashboard-long-card-chart-title {
                color: ${Setting_App.primaryColor};
                font-size: 1.5em;
                font-weight: 500;
                text-align: center;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .dashboard-long-card-info-group',
                event: 'click',
                listener(event) {
                    const label = this.dataset.label;

                    if (label) {
                        onClick(label);
                    }
                }
            }
        ]
    });

    function createInfoGroup(label, property) {
        return /*html*/ `
            <div class='dashboard-long-card-info-group' data-label='${property === 'today' ? 'week' : property}'>
                <div class='dashboard-long-card-info'>
                    <div class='dashboard-long-card-info-label'>${label}</div>
                    <div>${visits[property].length}</div>
                </div>
                <div class='dashboard-long-card-info smaller'>
                    <div class='dashboard-long-card-info-label'>Visits</div>
                    <div>${visits[property].length}</div>
                </div>
            </div>
        `;
    }

    component.setTitle = (text) => {
        const title = component.find('.dashboard-long-card-chart-title');

        title.innerText = text;
    }

    component.clearChart = () => {
        const chartContainer = component.find('.dashboard-long-card-chart-container');
        
        chartContainer.innerHTML = /*html*/ `<canvas class="myChart" width="700" height="350"></canvas>`;
    }

    component.getChart = () => {
        return component.find('.myChart').getContext('2d');
    }

    return component;
}