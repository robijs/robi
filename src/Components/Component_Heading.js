/** Actions */
import Action_Component from '../Actions/Action_Component.js'

/** Settings */
import { App } from '../Core/Settings.js'

export default function Component_Heading(param) {
    const {
        text,
        size,
        color,
        height,
        weight,
        margin,
        padding,
        parent,
        width,
        align
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='heading'>
                <div class='text'>${text}</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                height: ${height || 'unset'};
                display: flex;
                align-items: center;
                margin: ${margin || '50px 0px 20px 0px'};
                padding: ${padding || '0px'};
                width: ${width || 'initial'};
            }    

            #id .text {
                font-size: ${size || '1.25em'};
                font-weight: ${weight || '500'};
                color: ${color || App.get('primaryColor')};
                margin: 0px;
                text-align: ${align || 'left'};
            }

            #id .text * {
                color: ${color || App.get('primaryColor')};
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            
        ]
    });

    component.setHeading = (newTitle) => {
        component.find('.text').innerText = newTitle;
    }

    return component;
}