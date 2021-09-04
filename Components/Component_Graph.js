/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_Graph(param) {
    const {
        title,
        data,
        parent
    } = param;

    function createProgressBars() {
        let html = '';
        // Loop through each slice of pie
        data.forEach(item => {
            const {
                label,
                count,
                total,
                color
            } = item;

            const percent = percentage(count, total);

            html += /*html*/ `
                <div class='progress-container'>
                    <div class='progress-title'>${label}</div>
                    <div class='progress-bar' style='border: solid 2px ${color};' style='text-align: center;'>
                        <div class='progress-bar-status' style='width: ${percent}%; background: ${color};'></div>
                    </div>
                    <div class='percentage' style='text-align: center;'>
                        <span>${percent}<span>
                        <span>%</span>
                    </div>
                    <div class='progress-graph-number' style='text-align: left;'>
                        <span class='progress-count'>${count}</span>
                        <span>/</span>
                        <span class='total-count'>${total}</span>
                    </div>
                </div>
            `;
        });

        return html;
    }

    function percentage(numerator, denominator) {
        return  Math.round((numerator / denominator || 0) * 100);
    }

    return Component({
        html: /*html*/ `
            <div id='report-graph' class='report-graph'>
                <div class='report-graph-title'>${title}</div>
                ${createProgressBars()}
            <div>
        `,
        style: /*css*/ `
            .report-graph {
                width: 600px;
                display: inline-flex;
                flex-direction: column;
                justify-content: center;
                align-content: center;
                margin-left: 40px;
                padding: 20px;
                background: white;
                border-radius: 4px;
                border:  ${Setting_App.defaultBorder};
            }

            .report-graph-title {
                font-size: 1.5em;
                font-weight: 500;
                margin-bottom: 20px;
            }

            /* Big Progress Bar */
            .progress-container,
            .report-graph-header {
                display: flex;
                flex-direction: row;
                justify-content: space-evenly;
                align-items: center;
                margin-right: 20px;
            }

            .progress-container > *,
            .report-graph-header > * {
                flex: 1 1 0px;
                margin: 0px 10px;
            }

            .progress-title {
                font-size: 1em;
            }
            
            .progress-bar {
                margin: 5px;
                height: 15px;
                border-radius: 4px;
            }

            .progress-bar-status {
                margin: -2px 0px;
                height: 15px;
                border-radius: 4px;
            }
        `,
        parent,
        position: 'beforeend',
        events: [

        ]
    });
}
