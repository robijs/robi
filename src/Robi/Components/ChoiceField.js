import { Component } from '../Actions/Component.js'
import { GenerateUUID } from '../Robi.js';

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function ChoiceField(param) {
    const {
        action,
        buttonStyle,
        classes,
        description,
        fieldMargin,
        label,
        maxHeight,
        maxWidth,
        onFocusout,
        options,
        padding,
        parent,
        position,
        value,
        valueType
    } = param;

    const id = GenerateUUID();

    const component = Component({
        html: /*html*/ `
            <div class='form-field${classes ? ` ${classes.join(' ')}` : ''}'>
                ${label ? /*html*/ `<label class='field-label'>${label}</label>` : ''}
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class='dropdown'>
                    <button class='btn dropdown-toggle' ${buttonStyle ? `style='${buttonStyle}'` : ''} type='button' id='${id}' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                        ${value || `<span style='opacity: 0;'>Choose</span>`}
                    </button>
                    <div class='dropdown-menu' aria-labelledby='${id}'>
                        <div class='scroll-container'>
                            ${buildDropdown(options)}
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                position: relative;
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
                min-height: 33.5px;
                min-width: 160px;
                font-size: 13px;
                border-radius: 0.125rem 0px;
                border: 1px solid var(--borderColor);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            #id .dropdown-item {
                font-size: 13px;
                cursor: pointer;
            }

            #id .dropdown-menu {
                margin: 5px 0px 0px 0px;
                padding: .125rem;
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
                ${maxWidth ? `min-width: ${maxWidth};` : ''}
            }

            #id .dropdown-item {
                border-radius: 8px;
            }

            #id .dropdown-item:hover {
                background: var(--primary20);
            }

            #id .scroll-container {
                overflow: overlay;
                ${maxHeight ? `max-height: ${maxHeight};` : ''}
                ${maxWidth ? `max-width: ${maxWidth};` : ''}
            }

            #id .scroll-container::-webkit-scrollbar-thumb {
                min-height: 20px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .dropdown-item`,
                event: 'click',
                listener(event) {
                    if (valueType === 'html') {
                        // component.find('.dropdown-toggle').innerHTML = this.querySelector('[data-target="true"').innerHTML;
                        component.find('.dropdown-toggle').innerHTML = this.innerHTML;
                    } else {
                        component.find('.dropdown-toggle').innerText = event.target.innerText;
                    }

                    if (action) {
                        action(event);
                    }
                }
            },
            {
                selector: `#id .dropdown-toggle`,
                event: 'focusout',
                listener: onFocusout
            }
        ]
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
            <button type='button' class='dropdown-item' data-path='${path || ''}'>${label}</button>
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
            if (valueType === 'html') {
                field.innerHTML = param;
            } else {
                field.innerText = param;
            }
        } else {
            if (valueType === 'html') {
                return component.find('.dropdown-toggle');
            } else {
                return field.innerText === 'Choose' ? '' : field.innerText;
            }
        }
    };

    component.isValid = (state) => {
        const node = component.find('.is-valid-container');

        if (node) {
            node.remove();
        }

        if (state) {
            component.find('.field-label').style.color = 'seagreen';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: seagreen; font-size: 22px;'>
                        <use href='#icon-bs-check-circle-fill'></use>
                    </svg>
                </div>
            `);
        } else {
            component.find('.field-label').style.color = 'crimson';
            component.append(/*html*/ `
                <div class='is-valid-container d-flex justify-content-center align-items-center' style='height: 33.5px; width: 46px; position: absolute; bottom: 0px; right: -46px;'>
                    <svg class='icon' style='fill: crimson; font-size: 22px;'>
                        <use href='#icon-bs-exclamation-circle-fill'></use>
                    </svg>
                </div>
            `);
        }
    };

    component.selected = () => {
        const field = component.find('.dropdown-toggle');

        return options.find(item => item.label === field.innerText)?.path
    };

    return component;
}
// @END-File
