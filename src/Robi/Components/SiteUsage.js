import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function SiteUsage(param) {
    const {
        border, margin, padding, data, parent, position, onClick
    } = param;

    const {
        visits,
    } = data;

    const component = Component({
        html: /*html*/ `
            <div class='dashboard-long-card'>
                <!-- Chart -->
                <div class='dashboard-long-card-container' style='flex: 4;'>
                    <div class='dashboard-long-card-chart-title'></div>
                    <div class='dashboard-long-card-chart-container'>
                        <canvas class="myChart" height='300'></canvas>
                    </div>
                </div>
                <!-- Text -->
                <div class='dashboard-long-card-container' style='flex: 1'>
                    <div class='visits-label'>Visits</div>
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
                background: ${App.get('secondary')};
                border-radius: 4px;
                border: ${border || App.get('defaultBorder')};
                display: flex;
                overflow: auto;
            }

            /** Left/Right Containers */
            #id .dashboard-long-card-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: 100%;
            }

            /** Text */
            #id .visits-label {
                text-align: center;
                font-weight: 700;
                font-size: 18px;
                margin-bottom: 12px;
            }

            #id .info-group {
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
                position: relative;
                margin-right: 15px;
                margin-bottom: 15px;
            }

            #id .dashboard-long-card-chart-title {
                margin-top: 15px;
                color: ${App.get('defaultColor')};
                font-size: 1.1em;
                font-weight: 700;
                text-align: center;
            }

            /** Label */
            #id .info-group {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }

            #id .info-group button {
                flex: 1;
                white-space: nowrap;
            }

            #id .info-count {
                border-radius: 8px;
                padding: 5px;
                border: none;
                width: 70px;
                text-align: center;
                font-weight: 700;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .info-group',
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
            <div class="info-group" data-label='${property}'>
                <div class="info-count">${visits[property].length}</div>
                <button type='button' class='btn btn-robi'>${label}</button>
            </div>
        `;
    }

    component.setTitle = (text) => {
        const title = component.find('.dashboard-long-card-chart-title');

        title.innerText = text;
    };

    component.clearChart = () => {
        const chartContainer = component.find('.dashboard-long-card-chart-container');

        chartContainer.innerHTML = /*html*/ `<canvas class="myChart" height='300'></canvas>`;
    };

    component.getChart = () => {
        return component.find('.myChart').getContext('2d');
    };

    return component;
}
// @END-File
