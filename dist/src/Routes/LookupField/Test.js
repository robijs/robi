import { Title, Table, ModalSlideUp, BootstrapButton, LoadingSpinner } from '../../Robi/RobiUI.js'
import { App, Store, GetRequestDigest, Wait, CreateApp, CopyFile } from '../../Robi/Robi.js'
import { NewForm } from './NewForm.js'

/**
 *
 * @param {*} param
 */
export default async function Test(param) {
    const { parent } = param;

    // View title
    const viewTitle = Title({
        title: /* @START-Title */'Data Entry'/* @END-Title */,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    await Table({
		list: 'CodePurple',
        view: 'Table',
        newForm: NewForm,
		parent
	});

	// await Table({
    //     path: 'https://carepoint.health.mil/sites/J5',
    //     heading: 'DMIS Demographics',
    // 	   list: 'DMISDemo',
    //     top: 25,
    //     fields: [
    //         {
    //             name: 'Id',
    //             display: 'Id',
    //         },
    //         {
    //             name: 'Title',
    //             display: 'DMIS ID',
    //         },
    //         {
    //             name: 'dmis_facility_name',
    //             display: 'Facility Name',
    //         }
    //     ],
	// 	parent
	// });
}
