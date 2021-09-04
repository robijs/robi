/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_HorizontalRule(param) {
    const {
        parent,
        position,
        margin,
        height,
        color,
        width,
        padding
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='horizontal-rule-container'>
                <div class='horizontal-rule'></div>
            </div>
        `,
        style: /*css*/ `
            #id.horizontal-rule-container {
                margin: ${margin || '20px 40px'};
                padding: ${padding || '0px'};
                width: ${width || '100%'};
                display: flex;
                align-items: center;
                justify-content: center;
            }
        
            #id .horizontal-rule {
                height: ${height || '3px'};
                width: 90%;
                background: ${color || Setting_App.primaryColor};
            }
        `,
        parent: parent,
        position,
        events: [

        ]
    });

    return component
}