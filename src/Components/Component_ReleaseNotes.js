/** Settings */
import { App } from '../Core/Settings.js'

/* Actions */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_ReleaseNotes(param) {
    const {
        version,
        notes,
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='release-notes'>
                <div class='release-notes-version'>v${version}</div>
                ${buildNotes(notes)}
            </div>
        `,
        style: /*css*/ `
            #id {
                margin-top: 10px;
            }

            #id .release-notes-version {
                font-size: 1.4em;
                color: mediumpurple;
                margin-bottom: 10px;
            }
        `,
        parent: parent,
        position,
        events: [

        ]
    });

    function buildNotes(notes) {
        let html = /*html*/ `
            <ul>
        `;

        notes.forEach(note => {
            const {
                Title,
                Description
            } = note;

            html += /*html*/ `
                <li>
                    <strong>${Title}</strong>
                    &mdash;
                    ${Description}
                </li>
            `;
        });

        html += /*html*/ `
            </ul>
        `;

        return html;
    }

    return component
}