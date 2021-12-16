import { Store } from '../../Robi/Robi.js'
import { Container, Table } from '../../Robi/RobiUI.js'

export async function AllMeasures({ parent }) {
    const tableContainer = Container({
        width: '100%',
        display: 'block',
        parent
    });

    tableContainer.add();

    // Table
    await Table({
        list: 'Measures',
        view: 'Measures',
        addButtonValue: 'New Measure Intake Form',
        openInModal: true,
        parent: tableContainer,
        heading: '',
        advancedSearch: true,
        toolbar: [
            {
                label: 'All',
                filter(data) {
                    return data;
                }
            },
            {
                label: 'Published',
                filter(data) {
                    return data.filter(item => item.Status === 'Published');
                }
            },
            {
                label: 'Under Development',
                filter(data) {
                    return data.filter(item => item.Status === 'Under Development');
                }
            },
            {
                label: 'Mine',
                filter(data) {
                    const email = Store.user().Email;
                    const author = Store.user().SiteId;

                    console.log(email, author);

                    return data.filter(item => item.AOEmail === email || item.AltAOEmail === email || item.DSEmail === email || item.AltDSEmail === email || item.AuthorId === author);
                }
            },
            {
                label: 'On Hold',
                filter(data) {
                    return data.filter(item => item.Status === 'On Hold');
                }
            }
        ]
    });
}