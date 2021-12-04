import { Component, GenerateUUID, App } from '../../Robi/Robi.js'
import { Alert } from '../../Robi/RobiUI.js'

/**
 * 
 * @param {*} param 
 * @returns 
 */
export function AddFileTypes(param) {
    const {
        fieldMargin,
        maxWidth,
        files,
        parent,
        position,
        onChange
    } = param;

    const id = GenerateUUID();
    const filesAsArray = JSON.parse(files);

    const component = Component({
        html: /*html*/ `
            <div>
                <label>What files will be delivered during each reporting period?</label>
                <div class='form-field-description text-muted'>Enter all files separately. No bulk entries.</div>
                <div class="d-flex align-items-center justify-content-between">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text">File Name</div>
                        </div>
                        <input type="text" class="form-control display file-name" placeholder="">
                    </div>
                    <div class="ml-2 mr-2">
                        <div class="dropdown show">
                            <button class="btn dropdown-toggle file-type" type="button" id="dropdownMenuButton-${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width: 160px;">
                                File Type
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
                    <button class="btn btn-robi add-file" disabled>Add file type</button>
                </div>
                <div class='mt-3' style='font-size: 14px; font-weight: 500; padding-left: 12px;'>
                    <span class='file-count'>${filesAsArray?.length || '0'}</span>
                    <span class='file-count-text'>${filesAsArray?.length === 1 ? 'file' : 'files'}</span>
                </div>
                <div class='types-container mt-3'>
                    <!-- Formatted links go here -->
                    ${
                        files ? 
                        filesAsArray.map(file => fileTemplate(file)).join('\n') : ''
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
                display: inline-flex;
                flex-direction: column;
            }
            
            #id .input-group {
                position: relative;
                flex: 4
            }

            #id .dropdown-toggle {
                border: 1px solid #ced4da;
                min-height: 33.5px;
                font-size: 13px;
                border-radius: 0.125rem 0px;
                border: 1px solid #ced4da;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            /** Close */
            #id .close {
                font-weight: 500;
                text-shadow: unset;
                opacity: 1;
            }

            #id .close .icon-container {
                position: relative;
                display: flex;
            }

            #id .close .circle-fill {
                position: absolute;
                fill: darkgray;
                top: 2px;
                left: 2px;
                transition: all 300ms ease;
                height: 14px;
                width: 14px;
            }

            #id .close .icon-container:hover > .circle-fill {
                fill: ${App.get('primaryColor')};
            }

            #id .close .x-circle-fill {
                width: 18px;
                height: 18px;
                fill: #e9ecef;
                z-index: 10;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .file-name',
                event: 'keyup',
                listener(event) {
                    toggleBtnState();
                }
            },
            // TODO: Add scroll through this with up and down arrow keys
            {
                selector: `#id .dropdown-item`,
                event: 'click',
                listener(event) {
                    component.find('.dropdown-toggle').innerText = event.target.innerText;

                    toggleBtnState();
                }
            },
            {
                selector: '#id .add-file',
                event: 'click',
                listener(event) {
                    addFile(event);
                }
            },
            {
                selector: '#id .remove-file',
                event: 'click',
                listener(event) {
                    const file = event.target.closest('.file');
                    const name = file.dataset.name;
                    const type = file.dataset.type;
                    
                    removeFile(name, type);
                }
            }
        ],
        onAdd() {

        }
    });

    function toggleBtnState() {
        const files = [...component.findAll('.file')].map(node => `${node.dataset.name}-${node.dataset.type}`);
        const name = component.find('.file-name').value;
        const type = component.find('.file-type').innerText;

        // Exists message
        showMessage(files, name, type);

        // Btn state
        component.find('.add-file').disabled = name && !files.includes(`${name}-${type}`) && type !== 'File Type' ? false : true;
    }

    function addFile(event) {
        const nameField = component.find('.file-name');
        const typeField = component.find('.file-type');
        const name = nameField.value;
        const type = typeField.innerText;

        // Empty fields
        nameField.value = '';
        typeField.innerText = 'File Type';

        component.find('.types-container').insertAdjacentHTML('beforeend', fileTemplate({ name, type }));

        // Add event
        component.find(`.file[data-name='${name}'][data-type='${type}'] .remove-file`).addEventListener('click', () => removeFile(name, type));

        // Update count
        updateCount();
    }

    function removeFile(name, type) {
        component.find(`.file[data-name='${name}'][data-type='${type}']`).remove();
        updateCount(-1);
    }

    function updateCount(num) {
        const count = component.find('.file-count');
        const oldCount = parseInt(count.innerText);
        const newCount = oldCount + (num || 1);
        count.innerText =  + newCount;
        component.find('.file-count-text').innerText = newCount === 1 ? 'file' : 'files';

        // Callback
        if (onChange) {
            onChange();
        }
    }

    function fileTemplate({ name, type }) {
        return /*html*/ `
            <div class='file' style='border-radius: 10px; border: 1px solid #ced4da; padding: 5px 5px 5px 20px; margin: 5px 0px; font-size: 14px; display: flex; justify-content: space-between; align-items: center; min-width: 200px;' data-name='${name}' data-type='${type}'>
                <div>
                    <span class='mr-3' style='font-weigth: 500; text-decoration: underline;'>${name}</span>
                    <span class='mr-3' style=''>${type}</span>
                </div>
                <div class='d-flex;'>
                    <button type="button" class="remove-file close">
                        <span class="icon-container">
                            <svg class="icon x-circle-fill">
                                <use href="#icon-bs-x-circle-fill"></use>
                            </svg>
                            <svg class="icon circle-fill">
                                <use href="#icon-bs-circle-fill"></use>
                            </svg>
                        <span>
                    </button>
                </div>
            </div>
        `;
    }

    // Show message if path already exists
    let pathExists;

    function showMessage(files, name, type) {
        if (files.includes(`${name}-${type}`)) {
            // Show message
            if (!pathExists) {
                console.log('show')
                pathExists = Alert({
                    type: 'danger',
                    text: `A file named <strong>${name}</strong> with type <strong>${type}</strong> already exists`,
                    classes: ['alert-in', 'w-100'],
                    top: 38.5,
                    parent: component.find('.input-group')
                });

                pathExists.add();
            }
        } else {
            // Remove message
            if (pathExists) {
                pathExists.remove();
                pathExists = null;
            }
        }
    }

    component.value = () => {
        return [...component.findAll('.file')].map(node => {
            return {
                name: node.dataset.name,
                type: node.dataset.type
            }
        });
    }

    return component;
}