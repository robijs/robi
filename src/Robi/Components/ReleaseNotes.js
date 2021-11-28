import { Component } from '../Actions/Component.js'

/**
 *
 * @param {*} param
 * @returns
 */
export function ReleaseNotes(param) {
    const {
        version, notes, parent, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='release-notes'>
                <div class='release-notes-version'>Version <strong>${version}</strong></div>
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

            #id .release-notes-version strong {
                color: mediumpurple;
            }
        `,
        parent: parent,
        position,
        events: []
    });

    function buildNotes(notes) {
        let html = /*html*/ `
            <ul>
        `;

        notes.forEach(note => {
            const {
                Summary, Description
            } = note;

            html += /*html*/ `
                <li>
                    <strong>${Summary}</strong>
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

    return component;
}
