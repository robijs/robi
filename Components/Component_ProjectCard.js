/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_ProjectCard(param) {
    const {
        title,
        subTitle,
        body,
        parent,
        position,
        action,
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='card'>
                ${title ? /*html*/ `<div class='card-title'>${title}</div>`: ''}
                ${title ? /*html*/ `<div class='card-sub-title'>${subTitle}</div>`: ''}
                ${title ? /*html*/ `<div class='card-body'>${body}</div>`: ''}
            </div>
        `,
        style: /*css*/ `
            #id {
                cursor: pointer;
                margin: 20px;
                padding: 10px;
                background: white;
                border-radius: 4px;
                border: ${Setting_App.defaultBorder};
                height: 200px;
                width: 150px;
            }

            .card-title {
                font-size: 1.5em;
                font-weight: 500;
                color: ${Setting_App.primaryColor};
                margin-bottom: 5px;
            }

            .card-sub-title {
                font-size: 1.2em;
                font-weight: 500;
                color: ${Setting_App.defaultColor};
                margin-bottom: 15px;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '#id',
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