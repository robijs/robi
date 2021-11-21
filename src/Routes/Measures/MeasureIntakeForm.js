import { Authorize, Get, CreateItem, UpdateItem, DeleteItem, Route, AttachFiles, UploadFiles, SendEmail, AddStyle, UploadFile } from '../../Core/Actions.js'
import { Title, Alert, Container, FoldingCube, Card, Modal, BootstrapButton, SectionStepper, LoadingSpinner } from '../../Core/Components.js'
import { FormSection } from '../../Core/ViewParts.js'
import { App } from '../../Core/Settings.js'
import Store from '../../Core/Store.js'
import lists from '../../lists.js'

/**
 * 
 * @param {*} param ./Sections/FormSection.js
 */
export default async function MeasureIntakeForm(param) {
    const {
        parent,
        itemId,
        path
    } = param;

    // Set new measure data
    const listInfo = lists.find(item => item.list === 'Measures');
    const section = path ? listInfo.sections.find(item => item.path === path) : { name: 'All Sections' };

    /** Turn off Main Container Padding */
    // Store.get('maincontainer').paddingOff();
    parent.paddingOff();
    
    /** View Container */
    const container = Container({
        height: '100%',
        width: '100%',
        padding: '20px 0px 0px 20px;',
        parent
    });

    container.add();

    /** Left Container */
    const leftContainer = Container({
        // background: '#ebebff',
        overflow: 'overlay',
        height: '100%',
        minWidth: 'fit-content',
        direction: 'column',
        parent: container
    });

    leftContainer.add();

    /** Right Container */
    const rightContainer = Container({
        flex: '1',
        height: '100%',
        direction: 'column',
        overflowX: 'overlay',
        // padding: '20px 50px',
        // align: 'center',
        parent: container
    });

    rightContainer.add();

    /** View Title */
    const viewTitle = Title({
        // TODO: Add Measure Id here
        title: itemId ? `Edit Measure #${itemId}` : 'New Measure',
        subTitle: section.name,
        padding: '0px 20px 20px 20px',
        width: '100%',
        parent: rightContainer,
        type: 'across',
        action(event) {
            Route(`Measures/${subPath}`);
        }
    });

    viewTitle.add();

    /** Project Container */
    const projectContainer = Container({
        padding: '0px 0px 5px 0px',
        width: '100%',
        height: '100%', // FIXME: Experimental.
        direction: 'column',
        overflow: 'overlay',
        align: 'center',
        parent: rightContainer
    });

    projectContainer.add();

    /** Scroll listener */
    projectContainer.get().addEventListener('scroll', event => {
        if (event.target.scrollTop > 0) {
            projectContainer.get().style.borderTop = `solid 1px #e4e4e6`;
        } else {
            projectContainer.get().style.borderTop = `none`;
        }
    });

    /** Plan Container */
    const planContainer = Container({
        width: '100%',
        padding: '0px 20px 0px 0px;',
        direction: 'column',
        parent: projectContainer
    });

    planContainer.add();

    /** Section Stepper */
    const subPath = itemId ? itemId : 'New';

    const sectionStepper = SectionStepper({
        title: {
            text: 'All Sections',
            action(event) {
                Route(`Measures/${subPath}`);
            }
        },
        route: `Measures/${subPath}`,
        padding: '0px 20px 20px 0px',
        sections: listInfo.sections,
        selected: section.name,
        parent: leftContainer
    });

    sectionStepper.add();

    // Checklist
    sectionStepper.append(/*html*/ `
        <div class='route-container' style='height: 100%; width: 100%; border-raidus: 20px;'>
            <div class='' style='text-align: center; padding: 40px 0px; cursor: pointer; color: white; margin: 15px 0px; width: 100%; border-radius: 10px; background: red;'>Checklist (IN-OP)</div>
        </div>
    `);

    // MOP Uploader
    sectionStepper.find('.route-container').insertAdjacentHTML('beforeend', /*html*/ `
        <div class='' style='text-align: center; padding: 40px 0px; cursor: pointer; color: white; margin: 15px 0px; width: 100%; border-radius: 10px; background: blue;'>MOP Uploader (IN-OP)</div>
    `);

    // Button container
    const buttonContainer = Container({
        width: '100%',
        direction: 'column',
        parent: sectionStepper
    });

    buttonContainer.add();

    // Save button
    const saveButton = BootstrapButton({
        async action(event) {
            if (Store.getData('new measure')) {
                // Save modal
                const modal = Modal({
                    title: false,
                    disableBackdropClose: true,
                    scrollable: true,
                    async addContent(modalBody) {
                        modal.find('.modal-content').style.width = 'unset';

                        const loading = LoadingSpinner({
                            message: `<span style='color: seagreen;'>Creating Measure<span>`,
                            type: 'success',
                            classes: ['p-4'],
                            parent: modalBody
                        });
            
                        loading.add();
                    },
                    centered: true,
                    showFooter: false,
                });

                modal.add();

                console.log('Create new measure');

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
                            MeasureId: newItem.Id
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

                console.log('Done!');
                console.log($(modal.get()));

                $(modal.get()).on('hidden.bs.modal', event => {
                    Route(`Measures/${newItem.Id}${path ? `/${path}` : ''}`);
                });
    
                modal.close();
            } else {
                console.log(`Update measure ${itemId}`);
            }
        },
        classes: ['mb-2', 'w-100'],
        parent: buttonContainer,
        type: itemId ? 'primary' : 'success',
        value: itemId ? 'Update' : 'Create measure'
    });

    saveButton.add();

    // Cancel button
    const cancelButton = BootstrapButton({
        action(event) {
            console.log('Check if data saved, then route to measures');
        },
        classes: ['w-100'],
        parent: buttonContainer,
        type: 'light',
        value: 'Cancel'
    });

    cancelButton.add();

    // Loading
    let loading;
    let item;

    if (itemId) {
        const editMeasureData = Store.getData(`edit measure ${itemId}`);

        if (editMeasureData) {
            console.log(`Edit measure data ${itemId} already set. Data:`, editMeasureData);

            // FIXME: this means we can no longer compare server vs client state
            // TODO: store item with it's own name
            item = editMeasureData;
        } else {
            loading = FoldingCube({
                label: `Loading Measure Number ${itemId}`,
                parent: planContainer,
                position: 'afterend'
            });
    
            loading.add();
    
            // Get item
            // TODO: generalize this with param.list
            item = await Get({
                list: 'Measures',
                filter: `Id eq ${itemId}`
            });

            item = item[0];

            // TODO: Wrap both of these calls in Promise.all()
            const files = await Get({
                list: 'MeasuresFiles',
                select: `*,File/Name,File/Length,Author/Title,Editor/Title`,
                expand: `File,Author,Editor`,
                filter: `MeasureId eq ${itemId}`
            });

            item.Files = files;
    
            loading.remove();

            Store.setData(`edit measure ${itemId}`, item);
    
            console.log(`Edit measure data not set. Item: `, Store.getData(`edit measure ${itemId}`));
        }
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

    // Render sections
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
    } else {
        FormSection({
            item,
            section,
            listInfo,
            parent: planContainer
        });
    }

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