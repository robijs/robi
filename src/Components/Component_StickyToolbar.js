/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_StickyToolbar(param) {
    const {
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='sticky-toolbar'></div>
        `,
        style: /*css*/ `
            .sticky-toolbar {
                position: sticky;
                bottom: 0;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 10px;
                background: ${Setting_App.secondarColor};
                border-bottom: solid 2px ${Setting_App.primaryColor};
            }
        `,
        parent,
        position,
        events: [

        ]
    });

    return component
}