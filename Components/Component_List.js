/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_List(param) {
    const {
        parent,
        fields
    } = param;

    function createListHTML() {
        let html = '';

        fields.forEach(field => {
            html += /*html*/ `
                <div class="list-row">
                    <div class='list-row-label'>${field.label}</div>
                    <div class='list-row-field'>${field.field}</div>
                </div>
            `;
        })

        return html;
    }

    return Component({
        type: 'list',
        html: /*html*/ `
            <div class='list'>
                ${createListHTML()}
            </div>
        `,
        style: /*css*/ `
            /* Container */
            .list {
                display: flex;
                flex-direction: column;
                overflow: overlay;
            }

            /* Rows */
            .list-row:not(:last-child) {
                margin-bottom: 20px;
            }

            /* Labels */
            .list-row-label {
                font-size: 1.1em;
                font-weight: bold;
            }
        `,
        parent: parent,
        position: 'beforeend',
        events: [

        ]
    });
}