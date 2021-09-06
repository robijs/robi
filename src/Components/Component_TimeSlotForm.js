/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Components */
import Component from '../Actions/Action_Component.js'

export default function Component_TimeSlotForm(param) {
    const {
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='time-slot-form'>
                <div>Add open time slots</div>
                <div>
            </div>
        `,
        style: /*css*/ `
            #id {

            }
        `,
        parent,
        position,
        events: [

        ]
    });

    return component;
}