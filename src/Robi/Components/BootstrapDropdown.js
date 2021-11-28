import { Component } from '../Actions/Component.js'

/**
 *
 * @param {*} param
 * @returns
 */
export function BootstrapDropdown(param) {
    const {
        action, label, description, parent, position, options, value, fieldMargin, padding, setWidthDelay
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='form-field'>
                <label>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class='dropdown'>
                    <button class='btn dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                        ${value || `<span style='opacity: 0;'>Choose</span>`}
                    </button>
                    <div class='dropdown-menu hidden' aria-labelledby='dropdownMenuButton'>
                        ${buildDropdown(options)}
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                padding: ${padding || '0px'};
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .dropdown-toggle {
                min-height: 33px;
                font-size: 13px;
                border-radius: 0.25rem;
                border: 1px solid #ced4da;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #id .dropdown-item {
                font-size: 13px;
                cursor: pointer;
            }

            #id .hidden {
                display: block;
                visibility: hidden;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .dropdown-item`,
                event: 'click',
                listener(event) {
                    component.find('.dropdown-toggle').innerText = event.target.innerText;

                    if (action) {
                        action(event);
                    }
                }
            }
        ],
        onAdd() {
            // FIXME: Why does adding a timeout work?
            setTimeout(() => {
                component.find('.dropdown-toggle').style.width = `${component.find('.dropdown-menu').offsetWidth}px`;
                component.find('.dropdown-menu').classList.remove('hidden');
            }, setWidthDelay || 0);
        }
    });

    function buildDropdown(items) {
        return items
            .map(dropdown => dropdownTemplate(dropdown))
            .join('\n');
    }

    function dropdownTemplate(dropdown) {
        const {
            label, path
        } = dropdown;

        return /*html*/ `
            <div class='dropdown-item' data-path='${path || ''}'>${label}</div>
        `;
    }

    component.setDropdownMenu = (list) => {
        component.find('.dropdown-menu').innerHTML = buildDropdown(list);

        component.findAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', action);
        });
    };

    component.value = (param) => {
        const field = component.find('.dropdown-toggle');

        if (param !== undefined) {
            field.innerText = param;
        } else {
            return field.innerText;
        }
    };

    return component;
}
