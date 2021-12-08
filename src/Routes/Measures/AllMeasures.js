import { Store } from '../../Robi/Robi.js'
import { Container, Table } from '../../Robi/RobiUI.js'
import { MeasuresToolbar } from './MeasuresToolbar.js'

export async function AllMeasures({ parent }) {
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

    // TODO: Rethink this API. Unweildy.
    async function displayTable() {
        await Table({
            list: 'Measures',
            view: 'Measures',
            addButtonValue: 'New Measure Intake Form',
            openInModal: true,
            filter,
            margin: '20px 0px',
            parent: tableContainer,
            heading: '',
            toolbar({ parent }) {
                const toolbar = MeasuresToolbar({
                    selected,
                    options: [
                        'Published',
                        'On Hold',
                        'Under Development',
                        'All'
                    ],
                    parent,
                    async onFilter(option) {
                        selected = option;

                        switch(option) {
                            case 'Published':
                                filter = `Status eq 'Published'`;
                                break;
                            case 'On Hold':
                                filter = `Status eq 'On Hold'`;
                                break;
                            case 'Under Development':
                                filter = `(Author eq ${Store.user().SiteId} or AOEmail eq '${Store.user().Email}' or AltAOEmail eq '${Store.user().Email}') and (Status eq 'Under Development')`;
                                break;
                            case 'All':
                                filter = `Status eq 'Published' or Status eq 'On Hold' or (Author eq ${Store.user().SiteId} or AOEmail eq '${Store.user().Email}' or AltAOEmail eq '${Store.user().Email}')`;
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