/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_NewForm(options) {
    const id = `${options.id}-new-form`;

    return Component({
        type: 'newform',
        html: /*html*/ `
            <div id=${id} data-list=${options.list}>
                ${createFormHTML()}
            </div>
        `,
        style: /*css*/ `
            /* Rows */
            .new-form-row {
                new: flex;
                flex-direction: column;
                margin-bottom: 10px;
            }

            /* Labels */
            .new-form-label {
                font-size: 1em;
                font-weight: bold;
                padding-left: 5px;
            }

            /* Fields */
            .new-form-field {
                margin-top: 2px;
                margin-bottom: 8px;
                padding: 8px;
                background: white;
                border: solid 2px lightgray;
                border-radius: 4px;
                font-weight: 500;
            }

            .new-form-field:active,
            .new-form-field:focus {
                outline: none;
                border: solid 2px ${window.Setting_App.primaryColor};
            }
        `,
        parent: options.parent,
        position: 'beforeend',
        events: [
  
        ]
    });

    function createFormHTML() {
        let html = '';

        /*** TEST VALUES ***/
        const testValues = [

        ];
        /*** TEST VALUES ***/

        options.labels.forEach((label, index) => {
            html += /*html*/ `
                <div class='new-form-row'>
                    <div class='new-form-label'>${label}</div>
                    <div class='new-form-field' contenteditable="true" data-internalfieldname=${options.fields[index]}><!-- testValues[index] --></div>
                </div>
            `;
        });

        return html;
    }
}