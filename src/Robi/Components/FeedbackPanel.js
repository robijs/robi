import { Container } from './Container.js'
import { Table } from '../Components/Table.js'
import { Get } from '../Robi.js';

// @START-File
/**
 *
 * @param {*} param
 */
export async function FeedbackPanel({ parent }) {
    // TODO: Filter to user's feedback only
    const items = await Get({
        list: 'Feedback'
    });

    console.log(items);

    Table({
        list: 'Feedback',
        view: 'Table',
        addButtonValue: 'Submit new feedback',
        parent
    });
}
// @END-File
