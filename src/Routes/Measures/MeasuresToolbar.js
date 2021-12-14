import { Component } from '../../Robi/Actions/Component.js'
import { App } from '../../Robi/Core/App.js'

/**
 *
 * @param {*} param
 * @returns
 */
export function MeasuresToolbar(param) {
    const {
        selected, parent, onFilter, position, options
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
                font-size: 14px;
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
                    // // Deselect all options
                    // component.findAll('.filter').forEach(button => {
                    //     button.classList.remove('btn-robi-primary');
                    //     button.classList.add('btn-outline-robi-primary');
                    // });

                    // // Select clicked button
                    // this.classList.remove('btn-outline-robi-primary');
                    // this.classList.add('btn-robi-primary');

                    onFilter(event.target.innerText);
                }
            }
        ]
    });

    function buildFilters() {
        return options.map(option => {
            console.log(option, selected);
            return /*html*/ `
                <button type='button' class='btn ${selected === option ? 'btn-robi-primary' : 'btn-outline-robi-primary'} filter'>${option}</button>
            `;
        }).join('\n');
    }

    return component;
}
