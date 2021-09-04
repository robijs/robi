/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_DashboardChart(param) {
    const {
        parent,
        position
    } = param;

    /*
        ${createInfoGroup('Today', 'today')}
        ${createInfoGroup('This Week', 'week')}
        ${createInfoGroup('This Month', 'month')}
        ${createInfoGroup('This Year', 'year')}
    */
    const component = Component({
        html: /*html*/ `
            <div class='dashboard'>
                <!-- Text -->
                <div class='dashboard-container'>
                    <!-- Today -->
                    <div class='dashboard-info-group' data-label='Today'>
                        <div class='dashboard-info'>
                            <div class='dashboard-info-label'>Today</div>
                        </div>
                    </div>
                    <!-- This Week -->
                    <div class='dashboard-info-group' data-label='Week'>
                        <div class='dashboard-info'>
                            <div class='dashboard-info-label'>Week</div>
                        </div>
                    </div>
                    <!-- This Month -->
                    <div class='dashboard-info-group' data-label='Month'>
                        <div class='dashboard-info'>
                            <div class='dashboard-info-label'>Month</div>
                        </div>
                    </div>
                    <!-- Year -->
                    <div class='dashboard-info-group' data-label='Year'>
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
                padding: 20px;
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
                margin-right: 30px;             
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

        ]
    });

    function createInfoGroup(label, property) {
        return /*html*/ `
            <div class='dashboard-info-group' data-label='${property === 'today' ? 'week' : property}'>
                <div class='dashboard-info'>
                    <div class='dashboard-info-label'>${label}</div>
                    <div>${breaches[property].length + complaints[property].length}</div>
                </div>
                <div class='dashboard-info smaller'>
                    <div class='dashboard-info-label'>New Breaches</div>
                    <div>${breaches[property].length}</div>
                </div>
                <div class='dashboard-info smaller'>
                    <div class='dashboard-info-label'>New Complaints</div>
                    <div>${complaints[property].length}</div>
                </div>
            </div>
        `;
    }

    component.clearChart = () => {
        const chartContainer = component.find('.dashboard-chart-container');
        
        chartContainer.innerHTML = /*html*/ `<canvas class="myChart" width="700" height="350"></canvas>`;
    }

    component.getChart = () => {
        return component.find('.myChart').getContext('2d');
    }

    component.setChart = (param) => {
        const {
            title,
            max,
            data,
            labels,
            stepSize
        } = param;

        const chartTitle = component.find('.dashboard-chart-title');

        chartTitle.innerText = title || '';

        const chart = component.getChart();

        return new Chart(chart, {
            type: 'bar',
            data: {
                labels,
                datasets: data.map((set, index) => {
                    /** set[0] is mediumslateblue, set[1] is teal */
                    return {
                        data: set.data.map(item => item.toFixed(1)),
                        label: set.label,
                        backgroundColor: index === 0 ? 'rgb(123, 104, 238, 0.5)' : 'rgb(0, 128, 128, 0.5)',
                        hoverBackgroundColor: index === 0 ? 'rgb(123, 104, 238, 0.5)' : 'rgb(0, 128, 128, 0.5)'
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
                            display: false
                        },
                        stacked: true,
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
                            display: false
                        },
                        stacked: true,
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