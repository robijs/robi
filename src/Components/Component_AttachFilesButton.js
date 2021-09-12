/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** Actions */
import Action_Component from '../Actions/Action_Component.js'
import Action_AttachFiles from '../Actions/Action_AttachFiles.js'

export default function Component_AttachFilesButton(param) {
    const {
        value,
        list,
        id,
        margin,
        onAdd,
        parent,
        action
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='attach-files'>
                <div class='attach-files-button'>${value}</div>
                <!-- Hidden file input -->
                <input type='file' multiple style='display: none;' id='drop-zone-files'>
            </div>
        `,
        style: /*css*/ `
            #id .attach-files-button {
                cursor: pointer;
                margin: ${margin || '0px 20px 0px 0px'};
                padding: 5px 10px;
                font-weight: bold;
                text-align: center;
                border-radius: 4px;
                color: ${Setting_App.get('secondaryColor')};
                background: mediumseagreen;
                border: solid 2px seagreen;
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [
            {
                selector: '#id .attach-files-button',
                event: 'click',
                listener(event) {
                    const fileInput = component.find(`input[type='file']`);

                    if (fileInput) {
                        fileInput.click();
                    }
                }
            },
            {
                selector: `#id input[type='file']`,
                event: 'change',
                async listener(event) {
                    const files = event.target.files;
                    if (files.length > 0) {
                        const attachedFiles = await Action_AttachFiles({
                            list,
                            id,
                            files
                        });
            
                        if (onAdd) {
                            onAdd(attachedFiles);
                        }
                    }
                }
            }
        ]
    });

    return component;
}