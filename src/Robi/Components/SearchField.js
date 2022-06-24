import { App } from '../Core/App.js';

// @START-File
/**
 * 
 * @param {*} param 
 * @returns 
 */
export function SearchField(param) {
    const {
        parent, onSearch, onClear, onSelect, position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div>
                <div class='toggle-search-list' data-toggle='dropdown' aria-haspopup="true" aria-expanded="false">
                    <input class='form-control mr-sm-2' type='search' placeholder='${placeholder || ''}' aria-label='Search'>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                width: 100%;
            }

            #id .form-inline {
                flex-flow: initial;
            }

            #id input[type='search'] {
                width: 100%;
                border-radius: .25rem;
                font-size: 13px;
                border: none;
                background: var(--button-background);
            }

            #id input[type='search']::-webkit-search-cancel-button {
                -webkit-appearance: none;
                cursor: pointer;
                height: 20px;
                width: 20px;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill=''><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/></svg>");
            }

            /** Override Bootstrap input element active/focus style */
            #id input:active,
            #id input:focus {
                outline: none;
                border: none;
                box-shadow: none;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id input[type='search']`,
                event: 'keyup',
                listener(event) {
                    if (onSearch) {
                        onSearch(event.target.value.toLowerCase());
                    }
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'click',
                listener(event) {
                    event.stopPropagation();
                }
            },
            {
                selector: `#id input[type='search']`,
                event: 'search',
                listener: onClear
            }
        ]
    });

    return component;
}
// @END-File
