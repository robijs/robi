import { Component } from '../Actions/Component.js'

/**
 *
 * @param {*} param
 * @returns
 */
export function LinksField(param) {
    const {
        label, description, fieldMargin, maxWidth, links, parent, position, onChange
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <label class='form-label'>${label}</label>
                ${description ? /*html*/ `<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class="d-flex align-items-center">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Display</div>
                        </div>
                        <input type="text" class="form-control display" placeholder="My Dashboard">
                    </div>
                    <div class="input-group ml-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text">Address</div>
                        </div>
                        <input type="text" class="form-control url" placeholder="https://site.domain">
                    </div>
                    <button class="btn btn-robi-primary ml-2">Add link</button>
                </div>
                <div class='links-container mt-3'>
                    <!-- Formatted links go here -->
                    ${links ?
                JSON.parse(links).map(link => {
                    const { url, display } = link;
                    return /*html*/ `
                                <div class='link' data-display='${display}' data-url='${url}'>
                                    <a href='${url}' target='_blank'>${display}</a>
                                    <span class="remove-link" type="button" data-display='${display}'>&times;</span>
                                </div>
                            `;
                }).join('\n') :
                ''}
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${fieldMargin || '0px 0px 20px 0px'};
                max-width: ${maxWidth || 'unset'};
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            #id label {
                font-weight: 500;
            }

            #id .form-field-description {
                font-size: 14px;
                margin-bottom:  0.5rem;
            }

            #id .links-container {
                position: relative;
                min-height: 56px;
                width: 100%;
                border-radius: 4px;
                border: 1px solid #ced4da;
                padding: 10px;
            }
            
            #id .input-group {
                flex: 4
            }

            #id .btn {
                flex: 1;
                padding: 5.25px 12px;
            }

            #id .link {
                display: inline-flex;
                border-radius: 10px;
                padding: 5px 20px;
                background: #007bff;
                color: white;
            }

            #id .link:not(:last-child) {
                margin-right: 10px;
            }

            #id .link .remove-link {
                display: inline-block;
                margin-left: 20px;
            }
            
            #id .link *,
            #id .link *:active,
            #id .link *:focus {
                color: white;
                text-decoration: none;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .btn',
                event: 'click',
                listener(event) {
                    addLink(event);
                }
            },
            {
                selector: '#id .url',
                event: 'keyup',
                listener(event) {
                    if (event.key == 'Enter') {
                        event.preventDefault();
                        event.stopPropagation();

                        addLink(event);
                    }
                }
            },
            {
                selector: '#id .remove-link',
                event: 'click',
                listener: removeLink
            }
        ],
        onAdd() {
        }
    });

    function addLink(event) {
        const display = component.find('.display');
        const url = component.find('.url');

        if (display.value && url.value) {
            component.find('.links-container').insertAdjacentHTML('beforeend', /*html*/ `
                <div class='link' data-display='${display.value}' data-url='${url.value}'>
                    <a href='${url.value}' target='_blank'>${display.value}</a>
                    <span class="remove-link" type="button" data-display='${display.value}'>&times;</span>
                </div>
            `);

            component.find(`.remove-link[data-display='${display.value}']`).addEventListener('click', removeLink);

            display.value = '';
            url.value = '';

            display.focus();

            if (onChange) {
                onChange(event);
            }
        } else {
            // TODO: change to dialog box
            alert('Please enter both display text and a valid address.');
        }
    }

    function removeLink(event) {
        this.closest('.link').remove();

        if (onChange) {
            onChange(event);
        }
    }

    component.value = () => {
        // TODO: return formatted links to store in mlot field
        const links = component.findAll('.link');

        console.log(links);

        return [...links].map(link => {
            return {
                url: link.dataset.url,
                display: link.dataset.display
            };
        });
    };

    return component;
}