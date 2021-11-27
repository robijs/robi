import { Component } from '../Actions.js';
import { Route } from "./Route";
import { App } from '../Core/Settings.js';

/**
 *
 * @param {*} param
 * @returns
 */

export function QuestionType(param) {
    const {
        title, path, questions, parent, position
    } = param;

    const lastEntry = questions[questions.length - 1];

    const { Editor, Modified } = lastEntry || { Editor: '', Modified: '' };

    const component = Component({
        html: /*html*/ `
            <div class='question-type mb-3'>
                <div class='question-type-title mb-1'>${title}</div>
                <div class='question-count mb-1'>${questions.length} questions</div>
                <div class='question-date'>${Modified ? `Last updated: ${Editor.Title} ${formatDate(Modified)}` : ''}</div>
            </div>
        `,
        style: /*css*/ `
            #id {
                border-radius: 20px;
                padding: 20px;
                background: ${App.get('backgroundColor')};
                cursor: pointer;
            }

            #id .question-type-title {
                font-weight: 600;
            }

            #id .question-count {
                font-size: 14px;
            }

            #id .question-date {
                font-size: 14px;
                color: gray;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener(event) {
                    Route(`Questions/${path}`);
                }
            }
        ]
    });

    function formatDate(date) {
        return `
            ${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString('default', {
            hour: 'numeric',
            minute: 'numeric'
        })}
        `;
    }

    return component;
}
