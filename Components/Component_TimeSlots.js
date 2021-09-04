/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Components */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_TimeSlots(param) {
    const {
        startTime,
        endTime,
        parent,
        position,
        onRemove
    } = param;

    let times = [];

    /** Get hour prefix as number */
    const start = parseInt(startTime.split(':')[0]);
    const end = parseInt(endTime.split(':')[0]);

    const component = Action_Component({
        html: /*html*/ `
            <div class='time-slots'>
                <div class='time-slots-times'>
                    ${buildTimes()}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id .time-slots-times {
                margin: 10px 0px;
            }

            #id .time-slots-time {
                padding: 5px 0px;
            }

            #id .time-slots-time-line {
                margin-right: 5px;
            }

            #id .time-slots-time:not(:last-child) {
                border-bottom: solid 1px lightgray;
            }

            /** Badge*/
            #id .badge {
                cursor: pointer;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .remove-time-slot`,
                event: 'click',
                listener(event) {
                    /** Remove row from DOM */
                    event.target.closest('.time-slots-time').remove();

                    /** Update Times array */
                    const timeSlot = times.find(item => item.line === event.target.dataset.line);
                    const index = times.indexOf(timeSlot);
                    
                    times.splice(index, 1);

                    /** Callback */
                    if (onRemove) {
                        onRemove(event);
                    }
                }
            }
        ]
    });

    function buildTimes() {
        let html = '';
        let line = 1;

        for (let i = start; i < end; i++) { // TODO: Hour values are handled here and not dates;
            // Should the user be notified if the date/time has passed?
            const j = i + 1;
            const startHour = `${i < 10 ? '0' : ''}${i}:00`;
            const endHour = `${j < 10 ? '0' : ''}${j}:00`;

            times.push({
                line,
                startHour,
                endHour
            });

            html += /*html*/ `
                <div class='time-slots-time'>
                    <span class='time-slots-time-line'><strong>${line}</strong></span>
                    <span>${startHour} - ${endHour}</span>
                    <span class='badge badge-danger ml-2 remove-time-slot' data-line='${line}'>Remove</span>
                </div>
            `;

            line++;
        }

        return html;
    }

    component.getTimes = () => {
        return times;
    }

    return component;
}