import { Get } from '../../Core/Actions.js'
import { Title, Container, FoldingCube, Card } from '../../Core/Components.js'
import { App } from '../../Core/Settings.js'
import { Table } from '../../Core/ViewParts.js'
import Store from '../../Core/Store.js'

export default async function Measures(param) {
    const {
        parent,
        itemId
    } = param;

    // View title
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Measures`,
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