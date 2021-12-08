import { Store } from '../../Robi/Robi.js'
import { Container, Table } from '../../Robi/RobiUI.js'
import { MeasuresToolbar } from './MeasuresToolbar.js'

export async function MyMeasures({ parent }) {
    const tableContainer = Container({
        width: '100%',
        display: 'block',
        parent
    });

    tableContainer.add();
    
    // Table
    let filter = `Status eq 'Published'`;
    let selected = 'Published';

    await displayTable();

    async function displayTable() {
        await Table({
            list: 'Measures',
            view: 'Measures',
            addButtonValue: 'New Measure Intake Form',
            openInModal: true,
            filter,
            margin: '20px 0px',
            parent: tableContainer,
            heading: 'My Measures',
            toolbar({ parent }) {
                const toolbar = MeasuresToolbar({
                    selected,
                    options: [
                        'Under Development',
                        'Published',
                        'On Hold',
                        'All'
                    ],
                    parent,
                    async onFilter(option) {
                        selected = option;

                        const isMine = `(Author eq ${Store.user().SiteId} or AOEmail eq '${Store.user().Email}' or AltAOEmail eq '${Store.user().Email}')`;

                        switch(option) {
                           case 'Under Development':
                            filter = `${isMine} and (Status eq 'Under Development')`;
                            break;
                        case 'Published':
                            filter = `${isMine} and (Status eq 'Published')`
                            break;
                        case 'On Hold':
                            filter = `${isMine} and (Status eq 'On Hold')`
                            break;
                        case 'All':
                            filter = isMine
                            break;
                        }

                        tableContainer.empty();
            
                        await displayTable();
                    }
                });
            
                toolbar.add();
            }
        });
    }

}