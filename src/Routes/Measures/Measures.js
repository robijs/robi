import { Table, Title, Alert } from '../../Robi/RobiUI.js'
import { MeasureIntakeForm  } from './MeasureIntakeForm.js'

export default async function Measures({ parent, pathParts, props }) {
    
    // TODO: Move to Table()
    // TODO: pass in form components and path as params
    // TODO: immediately route to form if path is list/new or list/#
    // FIXME: User shouldn't have to define route selection logic
    let itemId;

    if (pathParts.length >= 2) {
        itemId = parseInt(pathParts[1]);

        if (typeof itemId === 'number' && !isNaN(itemId)) {
            console.log('edit form');
            MeasureIntakeForm({
                parent,
                itemId: itemId,
                path: pathParts[2],
                props
            });

            return;
        } else if (pathParts[1] === 'New') {
            MeasureIntakeForm({
                parent,
                path: pathParts[2],
                props
            });

            return;
        }
    }

    // View title
    const viewTitle = Title({
        title: `Measures`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    // TODO: Get user role
    // TODO: Add My Measures, based on role
    
    const info = Alert({
        margin: '20px 0px',
        type: 'robi-primary',
        text: '<strong>My Dashboard</strong> coming soon!',
        parent
    });

    info.add();

    // Table
    const newTable = await Table({
        list: 'Measures',
        view: 'Measures',
        addButtonValue: 'New Measure Intake Form',
        openInModal: true,
        heading: '',
        margin: '20px 0px',
        parent
    });

    // Open modal
    // TODO: Move to Table()
    if (itemId) {
        const row = measuresTable.findRowById(itemId);

        if (row) {
            row.show().draw(false).node().click();
        }
    }
}