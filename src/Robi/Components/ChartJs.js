import { Component } from '../Actions/Component.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function ChartJs(param) {
    const {
        margin, padding, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='chart'>
                <div class='chart-title'></div>
                <div class='chart-container'>
                    <canvas class="chart-canvas" height='300'></canvas>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '20px'};
                padding: ${padding || '10px'};
                border-radius: 10px;
                width: 100%;
            }

            /** Chart */
            #id .chart-container {
                position: relative;
                margin-top: 10px;
            }

            #id .chart-title {
                min-height: 27px;
                color: var(--color);
                font-size: 18px;
                font-weight: 700;
                text-align: center;
            }
        `,
        parent,
        position,
        events: [

        ]
    });

    component.setTitle = (text) => {
        const title = component.find('.chart-title');

        title.innerText = text;
    };

    component.clearChart = () => {
        const chartContainer = component.find('.chart-container');

        chartContainer.innerHTML = /*html*/ `<canvas class="chart-canvas" height='300'></canvas>`;
    };

    component.getChart = () => {
        return component.find('.chart-canvas').getContext('2d');
    };

    return component;
}
// @END-File
