import { Component } from '../Actions/Component.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function TableToolbar(param) {
    const {
        action, parent, options, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='btn-toolbar' role='toolbar'>
                <div class='btn-group' role='group'>
                    ${buildFilters()}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                align-items: center;
                justify-content: end;
                margin-bottom: 20px;
            }

            #id .btn {
                font-size: 13px;
            }

            #id .btn:focus,
            #id .btn:active {
                box-shadow: none ;
            }

            #id .ask-a-question {
                background: #e9ecef;
                color: ${App.get('primaryColor')};
                font-weight: 500;
            }
            
            #id .search-questions {
                background: #e9ecef !important;
                border-color: transparent;
                border-radius: 8px;
                min-width: 250px;
                min-height: 35px;
            }

            #id .btn-robi-primary {
                color: white;
                background: ${App.get('primaryColor')};
            }

            #id .btn-outline-robi-primary {
                color: ${App.get('primaryColor')};
                background-color: initial;
                border-color: ${App.get('primaryColor')};
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .filter',
                event: 'click',
                listener(event) {
                    // Deselect all options
                    const currentSelected = component.find('.filter.btn-robi-primary');
                    currentSelected.classList.remove('btn-robi-primary');
                    currentSelected.classList.add('btn-outline-robi-primary');

                    // Select clicked button
                    this.classList.remove('btn-outline-robi-primary');
                    this.classList.add('btn-robi-primary');

                    action(this.innerText);
                }
            }
        ]
    });

    function buildFilters() {
        return options.map((option, index) => {
            const { label } = option;
            return /*html*/ `
                <button type='button' class='btn ${index === 0 ? 'btn-robi-primary' : 'btn-outline-robi-primary'} filter'>${label}</button>
            `;
        }).join('\n');
    }

    return component;
}
// @END-File
