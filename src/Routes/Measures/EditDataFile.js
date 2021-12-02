import { CreateItem, Route, Store, App, UploadFile } from '../../Robi/Robi.js'
import { BootstrapDropdown, MultiLineTextField, NumberField, SingleLineTextField, DateField, AttachmentsContainer, Alert } from '../../Robi/RobiUI.js'

/**
 *
 * @param {*} param
 * @returns
 */
export async function EditDataFile(param) {
    const { event, fields, item: measureItem, list, modal, parent, table } = param;
    
    console.log(measureItem);

    // Get file types
    const itemId = parseInt(location.href.split('#')[1].split('/')[1]);
    const item = Store.getData(`edit measure ${itemId}`);
    const { FileTypes } = item;

    if (!FileTypes) {
        const alertInfo = Alert({
            type: 'robi-primary',
            text: `There are no file types associated with this measure. <strong class='timing' style='cursor: pointer;'>Click here</strong> to go to the Timing section of the intake form to add file types.`,
            parent
        });

        alertInfo.add();

        alertInfo.find('.timing').addEventListener('click', () => Route(`Measures/${itemId}/Timing`));

        return;
    }

    // // File Types
    // const fileTypes = BootstrapDropdown({
    //     label: 'File Type',
    //     description: `
    //         If your file isn't in this list, <strong class='timing' style='cursor: pointer;'>Click here</strong> to go to the Timing section of the intake form to add additional file types. Only .txt, .xls, .xlsx, .or csv file types will be accepted. All other file types will not be processed.
    //     `,
    //     options: JSON.parse(FileTypes).map(choice => {
    //         const { name, type } = choice;

    //         return {
    //             label: `${name} (${type})`,
    //             path: type
    //         };
    //     }),
    //     action() {
    //         // Get file type
    //         console.log(fileTypes.selected());

    //         // Check files
    //         toUpload.forEach(file => {
    //             console.log(file.name.split('.').at(-1));
    //         });
    //     },
    //     parent
    // });

    // fileTypes.add();
    // fileTypes.find('.timing').addEventListener('click', () => Route(`Measures/${itemId}/Timing`));

    // Data through date
    const throughDate = DateField({
        label: 'Data through date',
        description: `
            What is the last date of the reporting period this dataset applies to? Also known as <strong><em>End of the Measurement Period</em></strong>.
        `,
        value: measureItem.DataThroughDate,
        parent
    });

    throughDate.add();

    // Data pulled date
    const pulledDate = DateField({
        label: 'Data through date',
        description: `
            What date was this data pulled from its soruce?
        `,
        value: measureItem.DataPulledDate,
        parent
    });

    pulledDate.add();

    // MIP Link
    const mipLink = SingleLineTextField({
        label: 'MIP Link',
        description: '(Eg. "SFM-PRDDWSP.IWP_J5.dbo.table_name")',
        value: measureItem.MIPLink,
        parent
    });

    mipLink.add();

    let toUpload = [];
    const attachments = AttachmentsContainer({
        label: 'Drop data files to upload here',
        parent,
        itemId: measureItem.Id,
        value: [measureItem],
        onChange(files) {
            toUpload = files;

            // Get file type
            const fileType = fileTypes.selected().toLowerCase();

            // Check files
            toUpload.forEach(file => {
                const ext = file.name.split('.').at(-1).toLowerCase();

                if (fileType === 'excel') {
                    const allowed = ['xls', 'xlsx'];

                    if (allowed.includes(ext)) {
                        console.log(`${file.name} good`);
                        attachments.find(`.file-preview[data-filename='${file.name}']`).style.background = '#d1e7dd';
                    } else {
                        console.log(`${file.name} bad`);
                        attachments.find(`.file-preview[data-filename='${file.name}']`).style.background = '#f8d7da';
                        
                        const pathExists = Alert({
                            type: 'danger',
                            text: `Files must have an .xls or .xlsx extension.`,
                            classes: ['alert-in', 'w-100'],
                            top: attachments.get().offsetHeight,
                            parent: attachments
                        });

                        pathExists.add();

                        setTimeout(() => {
                            attachments.find(`.file-preview[data-filename='${file.name}']`).remove();
                            pathExists.remove();
                        }, 5000);
                    }

                    return;
                }

                if (fileType === 'csv') {
                    if (ext === 'csv') {
                        console.log(`${file.name} good`);
                        attachments.find(`.file-preview[data-filename='${file.name}']`).style.background = '#d1e7dd';
                    } else {
                        console.log(`${file.name} bad`);
                        attachments.find(`.file-preview[data-filename='${file.name}']`).style.background = '#f8d7da';
                        const pathExists = Alert({
                            type: 'danger',
                            text: `Files must have an .xls or .xlsx extension.`,
                            classes: ['alert-in', 'w-100'],
                            top: attachments.get().offsetHeight,
                            parent: attachments
                        });

                        pathExists.add();

                        setTimeout(() => {
                            attachments.find(`.file-preview[data-filename='${file.name}']`).remove();
                            pathExists.remove();
                        }, 5000);
                    }

                    return;
                }

                if (fileType === 'text') {
                    if (ext === 'txt') {
                        console.log(`${file.name} good`);
                        attachments.find(`.file-preview[data-filename='${file.name}']`).style.background = '#d1e7dd';
                    } else {
                        console.log(`${file.name} bad`);
                        attachments.find(`.file-preview[data-filename='${file.name}']`).style.background = '#f8d7da';
                        const pathExists = Alert({
                            type: 'danger',
                            text: `Files must have an .xls or .xlsx extension.`,
                            classes: ['alert-in', 'w-100'],
                            top: attachments.get().offsetHeight,
                            parent: attachments
                        });

                        pathExists.add();

                        setTimeout(() => {
                            attachments.find(`.file-preview[data-filename='${file.name}']`).remove();
                            pathExists.remove();
                        }, 5000);
                    }

                    return;
                }
            });
        }
    });

    attachments.add();

    return {
        async onUpdate(event) {
            return;

            const data = {
                MIPLink: mipLink.value() || null,
                DataThroughDate: toSPDate(throughDate.value()),
                DataPulledDate: toSPDate(pulledDate.value()),
                MeasureId: itemId
            };

            // Upload files
            const filesList = attachments;

            let uploads = [];

            for (let item in toUpload) {
                const file = toUpload[item];
                const name = file.name;

                const ext = file.name.split('.').at(-1);
                // const newName = `ml_${itemId}_${fileTypes.value().replaceAll(' ', '_').toLowerCase()}_${formatDate(pulledDate.value())}_${formatDate(throughDate.value())}.${ext}`;
                const newName = `ml_${itemId}_${fileTypes.value().replaceAll(' ', '_').toLowerCase()}_${formatDate(pulledDate.value())}_${formatDate(throughDate.value())}`;
                data.FileLeafRef = newName;

                // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
                filesList.find(`.remove-container[data-filename='${name}'] .status`).innerText = 'Queued';
                filesList.find(`.remove-container[data-filename='${name}'] .tip`).innerText = 'up next';
                filesList.find(`.remove-container[data-filename='${name}'] .remove-icon`).innerHTML = /*html*/ `
                    <div style='width: 22px; height: 22px; background: #ced4da; border-radius: 50%;'></div>
                `;

                // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
                filesList.find(`.remove-container[data-filename='${name}'] .status`).innerText = 'Uploading';
                filesList.find(`.remove-container[data-filename='${name}'] .tip`).innerText = 'please wait';
                filesList.find(`.remove-container[data-filename='${name}'] .remove-icon`).innerHTML = /*html*/ `
                    <div class='spinner-grow text-secondary' role='status' style='width: 22px; height: 22px;'></div>
                `;

                const testUpload = await UploadFile({
                    library: 'DataFiles',
                    file,
                    data
                });

                console.log(testUpload);
                uploads.push(testUpload);

                filesList.find(`.pending-count`).innerText = '';
                filesList.find(`.pending-count`).classList.add('hidden');
                filesList.find(`.count`).innerText = `${parseInt(filesList.find(`.count`).innerText) + 1}`;
                filesList.find(`.remove-container[data-filename='${name}']`).dataset.itemid = testUpload.Id;
                filesList.find(`.remove-container[data-filename='${name}'] .status`).innerText = 'Uploaded!';
                filesList.find(`.remove-container[data-filename='${name}'] .tip`).innerText = `${'ontouchstart' in window ? 'tap' : 'click'} to undo`;
                filesList.find(`.remove-container[data-filename='${name}'] .remove-icon`).innerHTML = /*html*/ `
                    <svg class='icon undo'><use href='#icon-bs-arrow-left-circle-fill'></use></svg>
                `;
            }

            function formatDate(date) {
                var d = new Date(date);
                console.log(date, d);
                return d.getFullYear().toString() + ( d.getMonth() + 1 < 10 ? '0' + ( d.getMonth() + 1 ) : d.getMonth() + 1 ) + ( d.getDate() < 10 ? '0' + d.getDate() : d.getDate().toString() );  
            }

            function toSPDate(date) {
                const [year, month, day] = date.split('-');
                return `${month}/${day}/${year}`;
            }

            return uploads.map(file => {
                file.Name = file.File.Name;
                
                return file;
            });
        }
    };
}

