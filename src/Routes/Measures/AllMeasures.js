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
        // margin: '20px 0px',
        parent: tableContainer,
        heading: '',
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
    
    // // Table
    // let filter = `Status eq 'Published' or Status eq 'On Hold' or (Author eq ${Store.user().SiteId} or AOEmail eq '${Store.user().Email}' or AltAOEmail eq '${Store.user().Email}')`;
    // let selected = 'All';

    // await displayTable();

    // // TODO: Rethink this API. Unweildy.
    // async function displayTable() {
    //     await Table({
    //         list: 'Measures',
    //         view: 'Measures',
    //         addButtonValue: 'New Measure Intake Form',
    //         openInModal: true,
    //         // filter,
    //         margin: '20px 0px',
    //         parent: tableContainer,
    //         heading: '',
    //         toolbar: [
    //             {
    //                 label: 'All',
    //                 filter: ''
    //             },
    //             {
    //                 label: 'Published',
    //                 filter: `Status eq 'Published'`
    //             }
    //         ]
    //         // toolbar({ parent }) {
    //         //     const toolbar = MeasuresToolbar({
    //         //         selected,
    //         //         options: [
    //         //             'All',
    //         //             'Published',
    //         //             'Under Development',
    //         //             'Mine',
    //         //             'On Hold'
    //         //         ],
    //         //         parent,
    //         //         async onFilter(option) {
    //         //             selected = option;

    //         //             switch(option) {
    //         //                 case 'Mine':
    //         //                     filter = `(Author eq ${Store.user().SiteId} or AOEmail eq '${Store.user().Email}' or AltAOEmail eq '${Store.user().Email}' or DSEmail eq '${Store.user().Email}' or AltDSEmail eq '${Store.user().Email}')`;
    //         //                     break;
    //         //                 case 'Published':
    //         //                     filter = `Status eq 'Published'`;
    //         //                     break;
    //         //                 case 'On Hold':
    //         //                     filter = `Status eq 'On Hold'`;
    //         //                     break;
    //         //                 case 'Under Development':
    //         //                     filter = `Status eq 'Under Development'`;
    //         //                     break;
    //         //                 case 'All':
    //         //                     filter = `Status eq 'Published' or Status eq 'On Hold' or (Author eq ${Store.user().SiteId} or AOEmail eq '${Store.user().Email}' or AltAOEmail eq '${Store.user().Email}')`;
    //         //                     break;
    //         //             }

    //         //             tableContainer.empty();
            
    //         //             await displayTable();
    //         //         }
    //         //     });
            
    //         //     toolbar.add();
    //         // }
    //     });
    // }
}