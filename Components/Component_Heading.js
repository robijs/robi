/** Actions */
import Action_Component from '../Actions/Action_Component.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

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
                font-size: ${size || '2em'};
                font-weight: ${weight || '400'};
                color: ${color || Setting_App.primaryColor};
                margin: 0px;
                text-align: ${align || 'left'};
            }

            #id .text * {
                color: ${color || Setting_App.primaryColor};
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