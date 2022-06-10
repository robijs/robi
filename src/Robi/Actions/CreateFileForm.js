import { Modal } from '../Components/Modal.js'
import { Button } from '../Components/Button.js'
import { LoadingSpinner } from '../Components/LoadingSpinner.js'
import { SingleLineTextField } from '../Components/SingleLineTextField.js'
import { AddImportToFile } from './AddImportToFile.js'
import { CreateFile } from './CreateFile.js'

// @START-File
/**
 *
 * @param {*} param
 */
export function CreateFileForm({ parent, path, template, dir, addImportTo }) {
    const addRouteModal = Modal({
        title: false,
        scrollable: true,
        close: true,
        async addContent(modalBody) {
            modalBody.classList.add('install-modal');
            addRouteModal.find('.modal-dialog').style.maxWidth = 'fit-content';
            addRouteModal.find('.modal-dialog').style.minWidth = '800px';

            modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                <h3 class='mb-3'>Create a new component</h3>
            `);

            // TODO: Prevent creating components that already exist
            const fileName = SingleLineTextField({
                label: 'Name',
                addon: `${path}/${dir ? `${dir}/` : ''}`,
                parent: modalBody,
                onKeydown(event) {
                    if (event.code === 'Space' || event.code === 'Tab') {
                        return false;
                    }
                },
                onKeyup(event) {
                    if (fileName.value()) {
                        addFileBtn.enable();
                    } else {
                        addFileBtn.disable();
                    }
                }
            });

            fileName.add();

            const addFileBtn = Button({
                async action() {
                    // TODO: Generalize show save modal and blur background
                    // Update app.js first or live-server will reload when
                    // Route/Path/Path.js is created
                    const modal = Modal({
                        title: false,
                        disableBackdropClose: true,
                        scrollable: true,
                        shadow: true,
                        async addContent(modalBody) {
                            modal.find('.modal-content').style.width = 'unset';

                            const loading = LoadingSpinner({
                                message: /*html*/ `
                                    <span style='color: var(--primary);'>
                                        <span>Creating component</span>
                                        <span style='font-weight: 700; font-family:'>'${fileName.value()}'</span>
                                    <span>
                                `,
                                type: 'robi',
                                classes: ['p-4'],
                                parent: modalBody
                            });
                
                            loading.add();
                        },
                        centered: true,
                        showFooter: false,
                        position: 'afterend'
                    });

                    modal.add();

                    // Blur entire app
                    document.querySelector('#app').style.transition = 'filter 150ms';
                    document.querySelector('#app').style.filter = 'blur(5px)';

                    // Add import to file
                    if (addImportTo) {
                        AddImportToFile({
                            module: fileName.value(),
                            path,
                            file: addImportTo
                        });
                    }

                    // Create new file
                    CreateFile({
                        contents: template({ name: fileName.value() }),
                        file: fileName.value(),
                        path,
                        dir
                    });
                },
                disabled: true,
                classes: ['w-100 mt-5'],
                width: '100%',
                parent: modalBody,
                type: 'robi',
                value: 'Create file'
            });

            addFileBtn.add();

            const cancelBtn = Button({
                action(event) {
                    addRouteModal.close();
                },
                classes: ['w-100 mt-2'],
                width: '100%',
                parent: modalBody,
                type: '',
                value: 'Cancel'
            });

            cancelBtn.add();

            setTimeout(() => {
                fileName.focus();
            }, 350);
        },
        parent,
        // centered: true,
        showFooter: false,
    });

    addRouteModal.add();
}
// @END-File
