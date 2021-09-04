/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_DashboardChart(param) {
    const {
        action,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='dashboard'>
                <!-- Text -->
                <div class='dashboard-container'>
                    <!-- This Week -->
                    <div class='dashboard-info-group' data-label='week'>
                        <div class='dashboard-info'>
                            <div class='dashboard-info-label'>Week</div>
                        </div>
                    </div>
                    <!-- This Month -->
                    <div class='dashboard-info-group' data-label='month'>
                        <div class='dashboard-info'>
                            <div class='dashboard-info-label'>Month</div>
                        </div>
                    </div>
                    <!-- Year -->
                    <div class='dashboard-info-group' data-label='year'>
                        <div class='dashboard-info'>
                            <div class='dashboard-info-label'>Year</div>
                        </div>
                    </div>
                </div>
                <!-- Chart -->
                <div class='dashboard-container'>
                    <div class='dashboard-chart-title'></div>
                    <div class='dashboard-chart-container'>
                        <canvas class="myChart" width="900" height="400"></canvas>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: 20px;
                padding: 10px;
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
        ]
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
            max,
            data,
            type,
            labels,
            stepSize
        } = param;


        /** Deselect labels */
        const chartLabels = component.findAll('.dashboard-info-label');

        chartLabels.forEach(label => {
            label.classList.remove('selected');
        });

        /** Select label */
        const selected = component.find(`.dashboard-info-group[data-label='${type}'] .dashboard-info-label`);

        selected.classList.add('selected');

        const chartTitle = component.find('.dashboard-chart-title');

        chartTitle.innerText = title || '';

        const chart = component.getChart();

        return new Chart(chart, {
            type: 'line',
            data: {
                labels,
                datasets: data.map(set => {
                    const {
                        data,
                        label,
                        color
                    } = set;

                    return {
                        data: data.map(item => item.toFixed(1)),
                        label: label,
                        borderColor: color,
                        borderWidth: 3,
                        borderJoinStyle: 'round',
                        fill: false
                    }
                })
            },
            options: {
                legend: {
                    labels: {
                        fontColor: Setting_App.defaultColor, 
                        fontSize: 14
                    }
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            display: true
                        },
                        ticks: {
                            fontColor: Setting_App.defaultColor, 
                            fontSize: 14,
                            max,
                            min: 0,
                            stepSize
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: true
                        },
                        ticks: {
                            fontColor: Setting_App.defaultColor, 
                            fontSize: 14,
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    return component;
}