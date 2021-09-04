/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_Stats(param) {
    const {
        title,
        color,
        count,
        total,
        parent,
        action
    } = param;

    let percent = Math.floor((count / total || 0) * 100);
    let text = '';
    let marginLeft;

    if (percent === 0 && count > 0) { 
        percent = 1;
        marginLeft = '-20%';
        text = '<'
    } else if (percent <= 0) {
        percent = 0;
        marginLeft = '-12%';
    } else if (percent >= 100) { 
        percent = 100;
        marginLeft = '-23%';
    } else {
        marginLeft = '-15%';
    }

    text += `${percent}%`;

    const radius = 90;
    const circumference = Math.PI * (radius * 2);
    const offset = ((100 - percent) / 100) * circumference;
    
    const component = Component({
        html: /*html*/ `
            <div class='report-circle-card'>
                <!-- Title -->    
                <div class='report-circle-title'>${title}</div>
                <div class='report-circle-container'>
                    <!-- Progress Circle -->
                    <div class='report-circle'>
                        <svg width="200" height="200" viewPort="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <circle r="90" cx="100" cy="100" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset="0"></circle>
                            <circle class="bar" r="${radius}" cx="100" cy="100" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset='${offset}'></circle>
                        </svg>
                    </div>
                    <!-- Count -->
                    <div class='report-circle-side-container'>
                        <div class='report-circle-count-row'>
                            <span class='report-circle-count'>${count}</span>
                            <span>/</span>
                            <span class='report-circle-total'>${total}</span>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            .report-circle-card {
                cursor: pointer;
                width: 417px;
                display: inline-flex;
                flex-direction: column;
                justify-content: center;
                align-content: center;
                /* margin: 0px 10px 10px 0px; */
                padding: 10px 20px;
                background: white;
                border-radius: 4px;
                border:  ${Setting_App.defaultBorder};
            }

            .report-circle-title {
                font-size: 2em;
                font-weight: 500;
                margin-bottom: 10px;
            }

            .report-circle-container {
                display: flex;
                flex-direction: row;
            }

            .report-circle {
                position: relative;
                margin-right: 20px;
            }

            #id .report-circle:after {
                position: absolute;
                display: block;
                /* height: 100%;
                width: 100%; */
                left: 50%;
                top: 50%;
                margin-top: -15%;
                margin-left: ${marginLeft};
                color: ${Setting_App.defaultColor};
                content: '${text}';
                border-radius: 100%;
                font-size: 2.5em;
            }

            .report-circle svg circle {
                stroke: ${Setting_App.secondaryColor};
                stroke-width: 1em;
            }

            .report-circle svg .bar {
                stroke: ${color || 'mediumseagreen'};
            }

            .report-circle-side-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .report-circle-count-row {
                white-space: nowrap;
            }

            .report-circle-count-row span {
                font-size: 3em;
            }

            .report-circle-count-text {
                font-size: 1.5em;
            }
        `,
        parent,
        position: 'beforeend',
        events: [
            {
                selector: '#id.report-circle-card',
                event: 'click',
                listener(event) {
                    if (action) {
                        action(event);
                    }
                }
            }
        ]
    });

    return component;
}
