/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Components */
import Component from '../Actions/Action_Component.js'

export default function Component_TimeSlots(param) {
    const {
        action,
        data,
        parent,
        position
    } = param;

    const component = Component({
        type: 'card',
        html: /*html*/ `
            <div class='time-slots'>
                ${createHTML()}
            </div>
        `,
        style: /*css*/ `
            #id {
                user-select: none;
                display: flex;
            }

            #id .time-slots-container {
                width: 350px;                
            }

            #id .time-slots-container:not(:last-child) {
                padding-right: 20px;
                border-right: solid 4px ${Setting_App.primaryColor};
            }

            #id .time-slots-container:not(:first-child) {
                padding-left: 20px;
            }

            #id .time-slots-title {
                display: flex;
                justify-content: space-between;
            }

            #id .time-slots-title-text {
                font-size: 1.5em;
                margin-right: 20px;
                color: ${Setting_App.primaryColor};
            }

            #id .time-slots-title-number {
                font-size: 1.5em;
                padding: 5px 10px;
                border-radius: 4px;
                background: ${Setting_App.primaryColor};
            }

            #id .time-slots-title-number > * {
                color: white;
            }
         
            /** Event */
            #id .event {
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                background: white;
                width: 100%;
                margin: 10px 0px;
                padding: 10px;
                border-radius: 4px;
                border: ${Setting_App.defaultBorder};
            }

            #id .event.none {
                background: lightpink;
                border: solid 1px transparent;
                border-left: solid 5px crimson;
            }

            #id .event.accepted {
                background: palegreen;
                border: solid 1px transparent;
                border-left: solid 5px seagreen;
            }

            #id .event-day {
                font-weight: 500;
            }

            /*
            #id .event span:not(:last-child) {
                margin-right: 15px;
            }
            */
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id .event:not(.none)',
                event: 'click',
                listener(event) {
                    if (action) {
                        action(this);
                    }
                }
            }
        ]
    });

    function createHTML() {
        let html = '';

        data.forEach(group => {
            const {
                label,
                times,
                type,
                limit
            } = group;

            html += /*html*/ `
                <div class='time-slots-container'>
                    <div class='time-slots-title'>
                        <span class='time-slots-title-text'>${label}</span>
                        <!-- <span class='time-slots-title-number'>
                            <span class='time-slots-title-number-count'>${times.length}</span>
                            <span>/</span>
                            <span class='time-slots-title-number-total'>${limit}</span>
                        </span> -->
                    </div>
            `;

            if (times.length > 0) {
                times.forEach(item => {
                    const {
                        Id,
                        Day,
                        Start,
                        End,
                    } = item;
    
                    html += /*html*/ `
                        <div class='event ${type ? type : ''}' data-itemid='${Id}'>
                            <span class='event-day'>${Day}</span>    
                            <span class='event-time'>${Start} - ${End}</span>
                        </div>
                    `;
                });
            } else {
                html += /*html*/ `
                    <div class='event none'>
                        <span class='event-day'>None</span>    
                    </div>
                `;
            }

            html += /*html*/ `
                </div>
            `
        });

        return html;
    }

    return component;
}