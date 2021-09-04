/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_PieChart(param) {
    const {
        title,
        data,
        margin,
        action,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
        <div class='dashboard'>
            <!-- Chart -->
            <div class='dashboard-container'>
                <div class='dashboard-chart-title'></div>
                <div class='dashboard-chart-container'>
                    <!-- <canvas class="myChart" width="900" height="400"></canvas> -->
                    <canvas class="myChart" width="800" height="400"></canvas>
                </div>
            </div>
        </div>
    `,
        style: /*css*/ `
            #id {
                margin: ${margin || '20px'};
                padding: 10px 10px 30px 10px;
                background: white;
                border-radius: 4px;
                border: ${Setting_App.defaultBorder};
                display: flex;
            }

            /** Left/Right Containers */
            #id .dashboard-container {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }

            /** Text */
            #id .dashboard-info-group {
                cursor: pointer;
                margin: 5px 0px;
            }

            #id .dashboard-info {
                display: flex;
                justify-content: space-between;
                font-size: 1.1em;
            }

            #id .dashboard-info.smaller {
                font-size: .8em;
            }

            #id .dashboard-info-label {
                font-weight: 500;
                /* margin-right: 30px; */
                border-radius: 4px;
                padding: 5px 10px;
            }

            #id .dashboard-info-label.selected {
                background: ${Setting_App.primaryColor};
                color: white;
            }

            /** Chart */
            #id .dashboard-chart-container {
                margin-left: 30px;
                margin-right: 5px;
            }

            #id .dashboard-chart-title {
                color: ${Setting_App.primaryColor};
                font-size: 2em;
                font-weight: 400;
                text-align: center;
                margin-bottom: 20px;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .dashboard-info-group',
                event: 'click',
                listener(event) {
                    if (action) {
                        action(this.dataset.label);
                    }
                }
            }
        ],
        onAdd() {
            component.setChart({
                title,
                data,
            });
        }
    });

    component.clearChart = () => {
        const chartContainer = component.find('.dashboard-chart-container');
        
        chartContainer.innerHTML = /*html*/ `<canvas class="myChart" width="900" height="400"></canvas>`;
    }

    component.getChart = () => {
        return component.find('.myChart').getContext('2d');
    }

    component.setChart = (param) => {
        const {
            title,
            data,
        } = param;

        const chartTitle = component.find('.dashboard-chart-title');

        chartTitle.innerText = title || '';

        const chart = component.getChart();

        return new Chart(chart, {
            type: 'doughnut',
            data,
            options: {
                responsive: true,
                legend: {
                    position: 'left',
                },
                title: {
                    display: false,
                    text: ''
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                onResize: function(){
                    // console.log(this)
                    // window.myDoughnut.update();
                }
            }
        });
    }

    return component;
}