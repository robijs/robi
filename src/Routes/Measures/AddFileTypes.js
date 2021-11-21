import { Component, GenerateUUID } from '../../Core/Actions.js'

/**
 * 
 * @param {*} param 
 * @returns 
 */
export default function AddFileTypes(param) {
    const {
        label,
        description,
        fieldMargin,
        maxWidth,
        types,
        parent,
        position,
        onChange
    } = param;

    const id = GenerateUUID();

    const component = Component({
        html: /*html*/ `
            <div>
                <label class='form-label'>${label}</label>
                ${description ? /*html*/`<div class='form-field-description text-muted'>${description}</div>` : ''}
                <div class="file-type d-flex align-items-center">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text">File Name</div>
                        </div>
                        <input type="text" class="form-control display" placeholder="">
                    </div>
                    <div class="form-field">
                        <label>File Type</label>
                        <div class="dropdown show">
                            <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton-${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width: 160px;">
                                <span style="opacity: 0;">Choose</span>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton-${id}">
                                <div class="dropdown-item" data-path="">Excel</div>
                                <div class="dropdown-item" data-path="">Text</div>
                                <div class="dropdown-item" data-path="">CSV</div>
                                <div class="dropdown-item" data-path="">MIP Table Link</div>
                                <div class="dropdown-item" data-path="">Other</div>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary ml-2">Add file</button>
                </div>
                <div class='types-container mt-3'>
                    <!-- Formatted links go here -->
                    ${
                        types ? 
                        JSON.parse(links).map(file => {
                            const { name, type } = file;
                            return /*html*/ `
                                <div class="file-type d-flex align-items-center">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">File Name</div>
                                        </div>
                                        <input type="text" class="form-control display" value='${name}' placeholder="">
                                    </div>
                                    <div class="form-field">
                                        <label>File Type</label>
                                        <div class="dropdown show">
                                            <button class="btn dropdown-toggle" type="button" id="dropdownMenuButton-${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width: 160px;">
                                                <span>${type}</span>
                                            </button>
                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton-${id}">
                                                <div class="dropdown-item" data-path="">Excel</div>
                                                <div class="dropdown-item" data-path="">Text</div>
                                                <div class="dropdown-item" data-path="">CSV</div>
                                                <div class="dropdown-item" data-path="">MIP Table Link</div>
                                                <div class="dropdown-item" data-path="">Other</div>
                                            </div>
                                        </div>
                                    </div>
                                    <button class="btn btn-primary ml-2">Remove file</button>
                                </div>
                            `;
                        }).join('\n') : 
                        ''
                    }
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

            #id .types-container {
                position: relative;
                min-height: 50px;
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

        `,
        parent,
        position,
        events: [
            // {
            //     selector: '#id .btn',
            //     event: 'click',
            //     listener(event) {
            //         addLink(event);
            //     }
            // },
            // {
            //     selector: '#id .url',
            //     event: 'keyup',
            //     listener(event) {
            //         if (event.key == 'Enter') {
            //             event.preventDefault();
            //             event.stopPropagation();

            //             addLink(event);
            //         }
            //     }
            // },
            // {
            //     selector: '#id .remove-link',
            //     event: 'click',
            //     listener: removeLink
            // }
        ],
        onAdd() {

        }
    });

    component.value = () => {
        // TODO: return formatted links to store in mlot field
        const fileTypes = component.findAll('.file-type');

        console.log(fileTypse);
        const data = [];

        fileTypes.forEach(node => {
            // const name = 
        });

        return [...fileTypse].map(link => {
            return {
                url: link.dataset.url,
                display: link.dataset.display
            }
        });
    }

    return component;
}