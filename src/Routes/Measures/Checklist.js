import { Title, BootstrapButton, LoadingSpinner, Table } from '../../Robi/RobiUI.js'
import { Store, Get, Route } from '../../Robi/Robi.js'
import { NewStep } from './NewStep.js'

/**
 * 
 * @param {*} param ./Sections/FormSection.js
 */
export async function Checklist(param) {
    const {
        parent,
        itemId,
        path
    } = param;

    if (!itemId) {
        Route('404');

        return;
    }

    // View Title
    const viewTitle = Title({
        title: `Measure #${itemId}`,
        subTitle: 'Checklist',
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

    // Table
    await Table({
        list: 'MeasuresChecklist',
        items: checklist,
        heading: '',
        view: 'Checklist',
        buttons: [],
        // defaultButtons: false,
        width: '100%',
        parent,
        newForm: NewStep,
        newFormTitle: 'New step',
        async onDelete(table) {
            checklist = await Get({
                list: 'MeasuresChecklist',
                select: `*,Author/Title,Editor/Title`,
                expand: `File,Author,Editor`,
                filter: `MeasureId eq ${itemId}`
            });

            Store.setData(`measure ${itemId} checklist`, checklist);
        }
    });

    const measuresBtn = BootstrapButton({
        action() {
            Route('Measures');
        },
        classes: ['w-100', 'mt-4'],
        parent,
        type: 'robi',
        value: 'Measures'
    });

    measuresBtn.add();

    const backBtn = BootstrapButton({
        action() {
            history.back();
        },
        classes: ['w-100', 'ml-2'],
        parent,
        type: '',
        value: 'Back'
    });

    backBtn.add();
}