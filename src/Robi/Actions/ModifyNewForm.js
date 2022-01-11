import { Modal } from '../Components/Modal.js'
import { FormTools } from '../Components/FormTools.js'

// @START-File
/**
 *
 * @param {*} param
 */
export async function ModifyNewForm({ list, display, fields, newForm }) {
    const modal = Modal({
        contentPadding: '30px',
        title: `Modify New Item Form`,
        async addContent(modalBody) {
            const form = await newForm({
                fields,
                list,
                modal: modal,
                parent: modalBody
            });

            if (form.label) {
                modal.getButton('Create').innerText = form.label;
            }

            if (form) {
                modal.showFooter();
            }
        },
        buttons: {
            footer: [
                {
                    value: 'Cancel',
                    classes: '',
                    data: [
                        {
                            name: 'dismiss',
                            value: 'modal'
                        }
                    ]
                },
                // TODO: send modal prop to form
                {
                    value: 'Create',
                    classes: 'btn-robi',
                    async onClick(event) {
                        console.log('for demonstration purposes only');
                    }
                }
            ]
        }
    });

    modal.add();

    const tools = FormTools({
        form: 'NewForm',
        list,
        container: modal,
        parent: modal.getHeader(),
        container: modal,
    });

    tools.add();
}
// @END-File
