/** Actions */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_UploadButton(param) {
    const {
        action,
        parent,
        position,
        margin,
        type,
        value
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div>
                <button type="button" class="btn ${type}">${value}</button>
                <!-- Hidden file input -->
                <input type='file' multiple style='display: none;' id='drop-zone-files'>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || ''};
                display: inline-block;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .btn',
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
                        action(files);
                    }
                }
            }
        ]
    });

    return component;
}