/** Actions */
import Action_Component from '../Actions/Action_Component.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default function Component_Card(param) {
    const {
        title,
        description,
        titleColor,
        titleWeight,
        border,
        background,
        padding,
        margin,
        minWidth,
        parent,
        width,
        position,
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='round-card'>
                ${title ? /*html*/ `<div class='round-card-title'>${title}</div>` : ''}
                ${description ? /*html*/ `<div class='mt-2 round-card-description'>${description}</div>` : ''}
            </div>
        `,
        style: /*css*/ `
            #id.round-card {
                display: inline-flex;
                flex-direction: column;
                background: ${background || 'white'};
                padding: ${padding || '20px'};
                margin: ${margin || '0px'};
                min-width: ${minWidth || 'initial'};
                width: ${width || 'initial'};
                border-radius: 4px;
                /* border: ${Setting_App.defaultBorder}; */
                border: ${border || 'solid 1px rgba(0, 0, 0, .125)'};
            }

            #id .round-card-title {
                font-size: 1.5em;
                font-weight: ${titleWeight || '700'};
                color: ${titleColor || Setting_App.defaultColor};
            }

            #id .round-card-description {
                
            }
        `,
        parent,
        position,
        events: [
            
        ]
    });

    return component;
}