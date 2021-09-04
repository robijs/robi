/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_Chart(param) {
    const {
        parent
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='chart-container'>
                <canvas id="myChart"></canvas>
            <div>
        `,
        style: /*css*/ `
            .chart-container {
                width: 1320px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-content: center;
                padding: 20px;
                margin: 20px 0px;
                background: white;
                border-radius: 4px;
                border:  ${Setting_App.defaultBorder};
            }
        `,
        parent,
        position: 'beforeend',
        events: [

        ]
    });

    return component;
}
