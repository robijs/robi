import { Title, Table, Container, FoldingCube, Card, Modal, BootstrapButton, SectionStepper, LoadingSpinner, FormSection, MultiLineTextField, DateField, Alert } from '../../Robi/RobiUI.js'
import { App, Store, Get, CreateItem, UpdateItem, Route, UploadFile, Style } from '../../Robi/Robi.js'
import lists from '../../lists.js'
import { EditDataFile } from './EditDataFile.js'
import { NewDataFile } from './NewDataFile.js'
import { NewStep } from './NewStep.js'
import { OnHold } from './OnHold.js'

/**
 * 
 * @param {*} param ./Sections/FormSection.js
 */
export async function MeasureIntakeForm(param) {
    const {
        parent,
        itemId,
        path
    } = param;

    // Set new measure data
    const listInfo = lists.find(item => item.list === 'Measures');
    const section = path ? listInfo.sections.find(item => item.path === path) : { name: 'All Sections' };

    // Turn off view container default padding
    parent.paddingOff();
    
    // Form Container
    const formContainer = Container({
        height: '100%',
        width: '100%',
        // padding: '51px 0px 0px 51px',
        // padding: '20px 0px 0px 31px', // same height as collapse container
        padding: '0px',
        parent
    });

    formContainer.add();

    // Left Container
    const leftContainer = Container({
        // radius: '10px',
        overflow: 'overlay',
        height: '100%',
        minWidth: 'fit-content',
        direction: 'column',
        padding: '20px',
        borderRight: 'solid 1px #d6d8db80',
        parent: formContainer
    });

    leftContainer.add();

    // Right Container
    const rightContainer = Container({
        flex: '1',
        height: '100%',
        direction: 'column',
        overflowX: 'overlay',
        padding: '20px 0px 0px 0px',
        parent: formContainer
    });

    rightContainer.add();

    // View Title
    const viewTitle = Title({
        title: itemId ? `Measure #${itemId} Intake Form` : 'New Measure Intake Form',
        subTitle: section?.name || path.splitCamelCase(),
        padding: '0px 30px 10px 30px',
        width: '100%',
        parent: rightContainer,
        type: 'across',
        action(event) {
            console.log('scroll');
            projectContainer.get().scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });

    viewTitle.add();

    // Project Container
    const projectContainer = Container({
        name: 'project',
        padding: '0px',
        width: '100%',
        height: '100%',
        direction: 'column',
        overflow: 'overlay',
        align: 'center',
        parent: rightContainer
    });

    projectContainer.add();

    // TODO: Move to Container method
    // Scroll listener
    projectContainer.get().addEventListener('scroll', event => {
        if (event.target.scrollTop > 0) {
            projectContainer.get().style.borderTop = `solid 1px #d6d8db80`;
        } else {
            projectContainer.get().style.borderTop = `none`;
        }
    });

    // Plan Container
    const planContainer = Container({
        width: '100%',
        name: 'plan',
        padding: '10px 20px 0px 20px;',
        direction: 'column',
        parent: projectContainer
    });

    planContainer.add();

    // Section Stepper
    const subPath = itemId ? itemId : 'New';

    const sectionStepperContainer = Container({
        direction: 'column',
        // height: '100%',
        // padding: '0px 31px 5px 0px',
        parent: leftContainer
    });

    sectionStepperContainer.add();

    const sectionStepper = SectionStepper({
        title: {
            text: 'All Sections',
            action(event) {
                Route(`Measures/${subPath}`);
            }
        },
        route: `Measures/${subPath}`,
        // padding: '0px 31px 11px 0px',
        sections: listInfo.sections,
        selected: section ? section.name : undefined,
        parent: sectionStepperContainer
    });

    sectionStepper.add();

    // Button container
    const buttonContainer = Container({
        width: '100%',
        direction: 'column',
        margin: '15px 0px 0px 0px',
        parent: sectionStepperContainer
    });

    buttonContainer.add();

    // Save button
    // TODO: Indicate when item has been changed (like with modify file)
    // TODO: Disable update on load, enable if changed
    // TODO: Remove changed indicator and disable button if all changes reverted
    // TODO: Add a revert changes button
    const saveButton = BootstrapButton({
        async action(event) {
            if (itemId) {
                console.log(`Update Measure #${itemId}`);

                // Save modal
                const modal = Modal({
                    title: false,
                    disableBackdropClose: true,
                    scrollable: true,
                    async addContent(modalBody) {
                        modal.find('.modal-content').style.width = 'unset';

                        const loading = LoadingSpinner({
                            message: `<span style='color: ${App.get('primaryColor')};'>Saving changes to Measure #${itemId}<span>`,
                            type: 'robi',
                            classes: ['p-4'],
                            parent: modalBody
                        });
            
                        loading.add();
                    },
                    centered: true,
                    showFooter: false,
                });

                modal.add();

                const allFields = listInfo?.fields.map(field => [field.name, null]);
                const dummyItem = Object.fromEntries(allFields);
                const item = Store.getData(`edit measure ${itemId}`);
                const data = {}

                for (let prop in dummyItem) {
                    if (item[prop]) {
                        data[prop] = item[prop];
                    }
                }

                console.log(data);

                // Set measure Id
                const updatedItem = await UpdateItem({
                    list: 'Measures',
                    itemId: itemId,
                    data
                });

                // Add Files prop and value to updated item returned from SP
                updatedItem.Files = item.Files;

                // Replace stored measure
                Store.setData(`edit measure ${itemId}`, updatedItem);

                // Re-route on close modal
                // FIXME: Is this necessary?
                $(modal.get()).on('hidden.bs.modal', event => {
                    Route(`Measures/${itemId}${path ? `/${path}` : ''}`);
                });
    
                // Close save modal
                modal.close();
            } else {
                console.log('Create new measure');

                // Create modal
                const modal = Modal({
                    title: false,
                    disableBackdropClose: true,
                    scrollable: true,
                    async addContent(modalBody) {
                        modal.find('.modal-content').style.width = 'unset';

                        const loading = LoadingSpinner({
                            message: `<span style='color: ${App.get('primaryColor')};'>Creating Measure<span>`,
                            type: 'robi',
                            classes: ['p-4'],
                            parent: modalBody
                        });
            
                        loading.add();
                    },
                    centered: true,
                    showFooter: false,
                });

                modal.add();

                const files = Store.getData('new measure').Files;

                delete Store.getData('new measure').Files;

                console.log(Store.getData('new measure'), files);

                const data = {}

                for (let prop in Store.getData('new measure')) {
                    if (Store.getData('new measure')[prop]) {
                        data[prop] = Store.getData('new measure')[prop];
                    }
                }

                console.log(data);

                // Create measure
                const newItem = await CreateItem({
                    list: 'Measures',
                    data
                });

                // Set measure Id
                await UpdateItem({
                    list: 'Measures',
                    itemId: newItem.Id,
                    data: {
                        MeasureId: newItem.Id
                    }
                });

                // Upload files
                for (let item in files) {
                    const file = files[item];
                    const filesList = Store.get('files');

                    // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
                    filesList.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Queued';
                    filesList.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = 'up next';
                    filesList.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                        <div style='width: 22px; height: 22px; background: #ced4da; border-radius: 50%;'></div>
                    `;

                    // /** TODO: @todo remove 'remove' event listener -> add 'cancel' event listener   */
                    filesList.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Uploading';
                    filesList.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = 'please wait';
                    filesList.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                        <div class='spinner-grow text-secondary' role='status' style='width: 22px; height: 22px;'></div>
                    `;
            
                    const testUpload = await UploadFile({
                        library: 'MeasuresFiles',
                        file,
                        data: {
                            ParentId: newItem.Id
                        }
                    });

                    console.log(testUpload);

                    filesList.find(`.pending-count`).innerText = '';
                    filesList.find(`.pending-count`).classList.add('hidden');
                    filesList.find(`.count`).innerText = `${parseInt(filesList.find(`.count`).innerText) + 1}`;
                    filesList.find(`.remove-container[data-filename='${file.name}']`).dataset.itemid = testUpload.Id;
                    filesList.find(`.remove-container[data-filename='${file.name}'] .status`).innerText = 'Uploaded!';
                    filesList.find(`.remove-container[data-filename='${file.name}'] .tip`).innerText = `${'ontouchstart' in window ? 'tap' : 'click'} to undo`;
                    filesList.find(`.remove-container[data-filename='${file.name}'] .remove-icon`).innerHTML = /*html*/ `
                        <svg class='icon undo'><use href='#icon-bs-arrow-left-circle-fill'></use></svg>
                    `;
                }

                // console.log('Done!');

                // Remove stored measure
                Store.removeData('new measure');

                $(modal.get()).on('hidden.bs.modal', event => {
                    Route(`Measures/${newItem.Id}${path ? `/${path}` : ''}`);
                });
    
                modal.close();
            }
        },
        classes: ['mb-2', 'w-100'],
        parent: buttonContainer,
        // type: itemId ? 'primary' : 'success',
        type: 'robi',
        value: itemId ? 'Update intake form' : 'Create measure'
    });

    saveButton.add();

    // Back button
    const publishButton = BootstrapButton({
        action(event) {
            console.log('Check if data saved, then route to measures');
            alert('publish');
        },
        classes: ['w-100', 'mb-2'],
        parent: buttonContainer,
        type: 'robi',
        value: 'Publish measure'
    });

    publishButton.add();

    // Back button
    const storeButton = BootstrapButton({
        action(event) {
            console.log('Check if data saved, then route to measures');
            alert('save');
            // history.back();
        },
        classes: ['w-100', 'mb-2'],
        parent: buttonContainer,
        type: 'robi',
        value: 'Save measure'
    });

    storeButton.add();

    // Back button
    const cancelButton = BootstrapButton({
        action(event) {
            console.log('Check if data saved, then route to measures');
            // history.back();
        },
        classes: ['w-100'],
        parent: buttonContainer,
        type: 'light',
        value: 'Back'
    });

    cancelButton.add();

    // Loading
    let loading;
    let item;
    let dataFiles;
    let checklist;

    // TODO: With the way it works now, each measure loaded get's stored with a unique phase.
    // This means that on subsequent visits to tthe same item, the data is found and not fetched.
    // Generally, this is good. But it means data could be out of date if another user has made
    // changes. Reloading the page would refetch.
    // 
    // Also, the stored item is updated if changes are made or saved.
    if (itemId) {
        // Get stored data
        const editMeasureData = Store.getData(`edit measure ${itemId}`);

        if (editMeasureData) {
            console.log(`Measure #${itemId} found. Item:`, editMeasureData);

            // FIXME: this means we can no longer compare server vs client state
            // TODO: store item with it's own name
            item = editMeasureData;
            dataFiles = Store.getData(`measure ${itemId} data files`);
            checklist = Store.getData(`measure ${itemId} checklist`);
        } else {
            loading = LoadingSpinner({
                message: `Loading Measure #${itemId} intake form`,
                type: 'robi',
                parent: planContainer,
                position: 'afterend'
            });
    
            loading.add();
    
            // TODO: Wrap these calls in Promise.all()
            // TODO: generalize this with param.list
            // Get item
            item = await Get({
                list: 'Measures',
                filter: `Id eq ${itemId}`
            });

            item = item ? item[0] : undefined;

            const files = await Get({
                list: 'MeasuresFiles',
                select: `*,File/Name,File/Length,Author/Title,Editor/Title`,
                expand: `File,Author,Editor`,
                filter: `ParentId eq ${itemId}`
            });

            item.Files = files;

            // Data files
            dataFiles = await Get({
                list: 'DataFiles',
                select: `*,File/Name,File/Length,Author/Title,Editor/Title`,
                expand: `File,Author,Editor`,
                filter: `MeasureId eq ${itemId}`
            });

            // FIXME: hack. could be slow with large doc libs.
            dataFiles = dataFiles?.map(file => {
                file.Name = file.File.Name;

                return file;
            });

            // Checklist
            checklist = await Get({
                list: 'MeasuresChecklist',
                select: `*,Author/Title,Editor/Title`,
                expand: `File,Author,Editor`,
                filter: `MeasureId eq ${itemId}`
            });

            // console.log(dataFiles, checklist);
    
            loading.remove();

            // Store data
            Store.setData(`edit measure ${itemId}`, item);
            Store.setData(`measure ${itemId} data files`, dataFiles);
            Store.setData(`measure ${itemId} checklist`, checklist);
    
            console.log(`Measure #${itemId} item missing. Item: `, Store.getData(`edit measure ${itemId}`));
        }

        // Add place measure on hold / remove hold button and modal
        OnHold({
            item,
            path,
            parent: viewTitle,
        });

        // TODO: Wrap in component
        // Add Data and checklist info panels
        leftContainer.append(/*html*/ `
            <div class='w-100 mt-2'>
                <div class='mb-2 data-files' style='background: ${App.get('backgroundColor')}; border-radius: 20px; padding: 15px 30px; cursor: pointer;'>
                    <div style='font-weight: 500;'>Data Files</div>
                    <div style=''>${dataFiles.length} ${dataFiles.length === 1 ? 'file' : 'files'}</div>
                </div>
                <div class='checklist' style='background: ${App.get('backgroundColor')}; border-radius: 20px; padding: 15px 30px; cursor: pointer;'>
                    <div style='font-weight: 500;'>Checklist</div>
                    <div style=''>${checklist.length} ${checklist.length === 1 ? 'step' : 'steps'}</div>
                </div>
            </div>
        `);

        // TODO: generalize route
        leftContainer.find('.data-files')?.addEventListener('click', () => Route(`Measures/${itemId}/DataFiles`));
        leftContainer.find('.checklist')?.addEventListener('click', () => Route(`Measures/${itemId}/Checklist`));
        
        // Print CSS
        Style({
            name: 'print-measure',
            style: /*css*/ `
                @media print {
                    #${Store.get('sidebar').get().id} {
                        display: none !important;
                    }
    
                    #${leftContainer.get().id} {
                        display: none !important;
                    }
    
                    #${Store.get('maincontainer').get().id},
                    #${parent.get().id} {
                        overflow: visible;
                        height: 100%;
                    }
                }
            `
        });
    } else {
        const newMeasureData = Store.getData('new measure');

        if (newMeasureData) {
            console.log('New measure data already set. Data:', newMeasureData);
        } else {
            const allFields = listInfo?.fields.map(field => [field.name, null]);
            Store.setData('new measure', Object.fromEntries(allFields));
    
            console.log('New measure data not set. Fields:', Store.getData('new measure'));
        }
    }

    // If path is #Measures/[Item Id]/DataFiles show table and exit
    if (path === 'DataFiles') {
        await Table({
            list: 'DataFiles',
            items: dataFiles,
            addButton: item.Status === 'On Hold' ? false : true,
            heading: '',
            view: 'DataFiles',
            buttons: [],
            exportButtons: false,
            defaultButtons: item.Status === 'On Hold' ? false : undefined,
            addButtonValue: 'Upload data file',
            width: '100%',
            parent: planContainer,
            newForm: NewDataFile,
            newFormTitle: 'New data file',
            editForm: EditDataFile,
            editFormTitle: 'Edit data file'
        });

        return;
    }

    // If path is #Measures/[Item Id]/Checklist show table and exit
    if (path === 'Checklist') {
        await Table({
            list: 'MeasuresChecklist',
            items: checklist,
            heading: '',
            view: 'Checklist',
            buttons: [],
            defaultButtons: false,
            width: '100%',
            parent: planContainer,
            newForm: NewStep,
            newFormTitle: 'New step',
        });

        return;
    }

    // If path is #Measures/[Item Id] with no section render all sections
    if (section.name === 'All Sections') {
        listInfo.sections.forEach(section => {
            const { name } = section;

            FormSection({
                heading: name,
                item,
                section,
                listInfo,
                parent: planContainer
            });
        });

        return;
    }
    
    // Show section based on path
    FormSection({
        item,
        section,
        listInfo,
        parent: planContainer
    });

    function addHeading(text) {
        viewTitle.setSubtitle(text);

        if (item) {
            const card = Card({
                background: App.get('backgroundColor'),
                width: '100%',
                parent: planContainer
            });

            card.add();

            card.append(/*html*/ `
                <div class='d-flex justify-content-between'>
                    <div class='mb-2'>
                        <strong>Measure ID</strong>
                        <span class="badge ${item ? 'bg-dark': 'bg-success'} ml-2" style="color: white; font-size: 14px;">${item?.Id || 'New'}</span>
                    </div>
                    <div class='mb-2'>
                        <strong>Measure Status</strong>
                        <select class='mi-select ml-2' value='${item?.MeasureStatus || ''}'>
                            <option class='mi-option' value='Under Development'>Under Development</option>
                            <option class='mi-option' value='Published'>Published</option>
                            <option class='mi-option' value='Archived'>Archived</option>
                        </select>
                    </div>
                    <div>
                        <strong>Last Updated</strong>
                        <span class="badge bg-dark ml-2" style="color: white; font-size: 14px;">${new Date(item.Created).toLocaleDateString()}</span>
                    </div>   
                </div>
            `);
        }
    }
}