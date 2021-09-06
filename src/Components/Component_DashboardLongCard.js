/* Global Actions */
import Action_Component from '../Actions/Action_Component.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default function Component_DashboardLongCard(param) {
    const {
        border,
        margin,
        padding,
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
                <!-- Chart -->
                <div class='dashboard-long-card-container'>
                    <div class='dashboard-long-card-chart-title'></div>
                    <div class='dashboard-long-card-chart-container'>
                        <canvas class="myChart" width="900" height="275"></canvas>
                    </div>
                </div>
                <!-- Text -->
                <div class='dashboard-long-card-container'>
                    ${createInfoGroup('Today', 'today')}
                    ${createInfoGroup('This Week', 'week')}
                    ${createInfoGroup('This Month', 'month')}
                    ${createInfoGroup('This Year', 'year')}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '20px'};
                padding: ${padding || '10px'};
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
                justify-content: center;
                width: 100%;
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
                margin-right: 30px;
            }

            #id .dashboard-long-card-chart-title {
                color: ${Setting_App.primaryColor};
                font-size: 1.1em;
                font-weight: 500;
                text-align: center;
            }

            /** Label - mimic bootstrap input */
            .input-group > .text-field:not(:last-child) {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }

            .input-group > .text-field{
                position: relative;
                -ms-flex: 1 1 auto;
                flex: 1 1 auto;
                width: 1%;
                min-width: 0;
                margin-bottom: 0;
            }

            .text-field {
                display: block;
                width: 100%;
                padding: .375rem .75rem;
                font-size: .9rem;
                font-weight: 400;
                line-height: 1.5;
                color: #495057;
                background-color: #fff;
                background-clip: padding-box;
                border: 1px solid #ced4da;
                border-radius: .25rem;
                transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
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
            <div class="input-group dashboard-long-card-info-group" data-label='${property}'>
                <div class='text-field'>${label}</div>
                <div class="input-group-append">
                    <div class="input-group-text" id="btnGroupAddon2">${visits[property].length}</div>
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
        
        chartContainer.innerHTML = /*html*/ `<canvas class="myChart" width="900" height="275"></canvas>`;
    }

    component.getChart = () => {
        return component.find('.myChart').getContext('2d');
    }

    return component;
}