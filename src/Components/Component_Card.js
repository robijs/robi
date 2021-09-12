/** Actions */
import Action_Component from '../Actions/Action_Component.js'

/** Settings */
import { App } from '../Core/Settings.js'

export default function Component_Card(param) {
    const {
        title,
        description,
        titleColor,
        titleWeight,
        background,
        padding,
        margin,
        minWidth,
        parent,
        width,
        position
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
                border-radius: 10px;
                border: ${App.get('defaultBorder')};
            }

            #id .round-card-title {
                font-size: 1em;
                margin: -20px -20px 10px -20px; /** FIXME: will break with passed in padding  */
                padding: 10px 20px; /** FIXME: will break with passed in padding  */
                font-weight: ${titleWeight || '700'};
                background: ${App.get('secondaryColor')};
                border-radius: 10px 10px 0px 0px;
                color: ${titleColor || App.get('defaultColor')};
                border-bottom: ${App.get('defaultBorder')};
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