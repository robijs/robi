import { Title, BootstrapButton, LoadingSpinner, Table } from '../../Robi/RobiUI.js'
import { App, Store, Get, Route } from '../../Robi/Robi.js'
import { EditDataFile } from './EditDataFile.js'
import { NewDataFile } from './NewDataFile.js'
import { OnHold } from './OnHold.js'

/**
 * 
 * @param {*} param ./Sections/FormSection.js
 */
export async function DataFiles(param) {
    const {
        parent,
        itemId,
        path
    } = param;
    
    if (!itemId) {
        Route('404');

        return;
    }

    // parent.append(/*html*/ `
    //     <div class='d-flex justify-content-center align-items-center back-btn' style='height: 62px; padding: 0px 27px; position: absolute; top: 0px; left: 0px; cursor: pointer;' title='Back'>
    //         <svg class='icon' style='fill: ${App.get('primaryColor')}; font-size: 22px;'>
    //             <use href='#icon-bs-arrow-left-cirlce-fill'></use>
    //         </svg>
    //     </div>
    // `);

    // View Title
    const viewTitle = Title({
        back: true,
        title: `Measure #${itemId}`,
        subTitle: 'Data Files',
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    // Loading
    let loading;
    let item;
    let dataFiles;
    let checklist;

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
            parent,
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
        bannerParent: parent,
        buttonParent: parent
    });

    // Table
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
        parent,
        newForm: NewDataFile,
        newFormTitle: 'New data file',
        editForm: EditDataFile,
        editFormTitle: 'Edit data file',
        async onDelete(table) {
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

            Store.setData(`measure ${itemId} data files`, dataFiles);
        }
    });
}