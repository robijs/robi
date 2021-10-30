import { Get } from '../../Core/Actions.js'
import { Container, FoldingCube, Card } from '../../Core/Components.js'
import { App } from '../../Core/Settings.js'
import { Table } from '../../Core/ViewParts.js'
import Store from '../../Core/Store.js'
import EditMeasure from './EditMeasure.js'
import NewMeasure from './NewMeasure.js'

export default async function Measures(param = {}) {
    const {
        itemId
    } = param;

    const parent = Store.get('maincontainer');

    const card = Card({
        // title: 'Measures',
        titleColor: App.get('primaryColor'),
        padding: '20px',
        margin: '20px 0px',
        width: '100%',
        parent
    });

    card.add();

    const container = Container({
        width: '100%',
        direction: 'column',
        padding: '20px 0px 0px 0px',
        parent: card
    });

    container.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading Measures',
        margin: '40px 0px',
        parent: container
    });
    
    loadingIndicator.add();

    const measures = await Get({
        list: 'Measures'
    });

    const measuresTable = Table({
        heading: '',
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id',
            },
            {
                internalFieldName: 'MeasureId',
                displayName: 'Measure Number',
            },
            {
                internalFieldName: 'MeasureName',
                displayName: 'Individual Measure Name',
            },
            // Concat AOName and AOOffice
            {
                internalFieldName: 'AOName',
                displayName: 'Action Officer',
            },
            // Concat AOName and AOOffice
            {
                internalFieldName: 'AltAOName',
                displayName: 'Alternate AO'
            },
            {
                internalFieldName: 'Frequency',
                displayName: 'Reporting Frequency'
            },
            {
                internalFieldName: 'DashboardLinks',
                displayName: 'Dashboard Links',
                render(data, type, row) {
                    const links = JSON.parse(data);

                    console.log(links);

                    return links.map(link => {
                        const { url, display } = link;

                        return /*html*/ `
                            <a href='${url}'>${display.trim()}</a>
                        `
                    }).join(', ');
                }
            }
        ],
        // headerFilter: true,
        items: measures,
        checkboxes: false,
        addButton: true,
        addButtonValue: 'Add measure',
        editForm: EditMeasure,
        newForm: NewMeasure,
        parent: container
    });

    /** Remove Loading Indication */
    loadingIndicator.remove();

    /** Open modal */
    if (itemId) {
        const row = measuresTable.findRowById(itemId);

        if (row) {
            row.show().draw(false).node().click();
        }
    }
}