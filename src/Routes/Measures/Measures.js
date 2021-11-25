import { Get } from '../../Core/Actions.js'
import { Title, Container, FoldingCube, Card } from '../../Core/Components.js'
import { App } from '../../Core/Settings.js'
import { Table } from '../../Core/ViewParts.js'
import Store from '../../Core/Store.js'
import MeasureIntakeForm from './MeasureIntakeForm.js'

export default async function Measures({ parent,pathParts, props }) {
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

    const newTable = Table({
        list: 'Measures',
        view: 'Measures',
        openInModal: true,
        heading: '',
        margin: '20px 0px',
        parent
    });

    // Open modal
    if (itemId) {
        const row = measuresTable.findRowById(itemId);

        if (row) {
            row.show().draw(false).node().click();
        }
    }
}