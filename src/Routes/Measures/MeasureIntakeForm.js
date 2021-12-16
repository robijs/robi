import { Title, Container, Modal, BootstrapButton, SectionStepper, LoadingSpinner, FormSection } from '../../Robi/RobiUI.js'
import { App, Store, Get, CreateItem, UpdateItem, Route, UploadFile, Style } from '../../Robi/Robi.js'
import lists from '../../lists.js'
import { Publish } from './Publish.js'
import { LastEdited } from './LastEdited.js'
import { DataFiles } from './DataFiles.js'
import { Checklist } from './Checklist.js'

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

    // If path is #Measures/[Item Id]/DataFiles
    if (path === 'DataFiles') {
        DataFiles(param)
        return;
    }

    // If path is #Measures/[Item Id]/Checklist
    if (path === 'Checklist') {
        Checklist(param);
        return;
    }

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

    // Title Container
    const titleContainer = Container({
        display: 'block',
        width: '100%',
        parent: rightContainer
    });

    titleContainer.add();

    // View Title
    const viewTitle = Title({
        title: itemId ? `Measure #${itemId}` : 'New Measure',
        subTitle: section?.name || path.splitCamelCase(),
        padding: '0px 30px 10px 30px',
        width: '100%',
        parent: titleContainer,
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
                    select: `*,File/Name,File/Length,Author/Title,Editor/Title`,
                    expand: `File,Author,Editor`,
                    itemId: itemId,
                    data
                });

                console.log(updatedItem);

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

                // Set status
                data.Status = 'Under Development';

                console.log(data);

                // Create measure
                const newItem = await CreateItem({
                    list: 'Measures',
                    data
                });

                // Set measure Id
                await UpdateItem({
                    list: 'Measures',
                    select: `*,File/Name,File/Length,Author/Title,Editor/Title`,
                    expand: `File,Author,Editor`,
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
        // value: itemId ? 'Update measure information' : 'Create new measure'
        value: itemId ? 'Update' : 'Create'
    });

    saveButton.add();

    // Cancel button
    const cancelButton = BootstrapButton({
        action(event) {
            // TODO: Generalize;
            Route('Measures');
        },
        classes: ['w-100', 'pl-0'],
        parent: buttonContainer,
        type: '',
        value: /*html*/ `
            <!-- <div class="d-flex justify-content-center align-items-center back-btn" style="" title="Back"> -->
            <div class="d-flex back-btn" style="" title="Back">
                <svg class="icon" style="fill: #e63e44; font-size: 26px;">
                    <use href="#icon-bs-arrow-left-cirlce-fill"></use>
                </svg>
            </div>
        `
    });

    cancelButton.add();

    // Loading
    let loading;
    let item;
    let dataFiles;
    let checklist;

    // Each measure loaded get's stored with a unique phrase base on it's Item Id.
    // On subsequent visits to the same item the stored data is found and not refetched.
    // Generally, this is good. But data could be out of date if another user has made changes.
    // Reloading the page would refetch.
    // 
    // The stored item is updated if changes are made or saved.
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
                message: `Loading Measure #${itemId}`,
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
                select: `*,File/Name,File/Length,Author/Title,Editor/Title`,
                expand: `File,Author,Editor`,
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

        // Button container 
        const buttonContainer = Container({
            parent: viewTitle
        });

        buttonContainer.add();

        // Publish
        Publish({
            item,
            path,
            bannerParent: titleContainer,
            buttonParent: buttonContainer
        });

        // Last edited
        LastEdited({
            item,
            parent: titleContainer,
        });

        // TODO: Wrap in component
        // Add Data and checklist info panels
        leftContainer.append(/*html*/ `
            <div class='w-100 mt-2' style='height: 100%; display: flex; flex-direction: column; justify-content: end;'>
                <div class='mb-2 data-files' style='background: ${App.get('backgroundColor')}; border-radius: 10px; padding: 15px 30px; cursor: pointer;'>
                    <div style='font-weight: 500; color: ${App.get('primaryColor')};'>Data Files</div>
                    <div style=''>${dataFiles.length} ${dataFiles.length === 1 ? 'file' : 'files'}</div>
                </div>
                <div class='checklist' style='background: ${App.get('backgroundColor')}; border-radius: 10px; padding: 15px 30px; cursor: pointer;'>
                    <div style='font-weight: 500; color: ${App.get('primaryColor')};'>Checklist</div>
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
            const data = Object.fromEntries(allFields);

            // Set AO
            data.AOName = Store.user().Title.split(' ').slice(0, 2).join(' ');
            data.AOEmail = Store.user().Email;

            Store.setData('new measure', data);
    
            console.log('New measure data not set. Fields:', Store.getData('new measure'));
        }
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
}