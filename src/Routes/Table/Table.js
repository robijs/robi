import { Table, Title } from '../../Robi/RobiUI.js'

export default async function Measures({ parent, pathParts, props }) {
    // View title
    const viewTitle = Title({
        title: /* @START-Title */'Table'/* @END-Title */,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();
    
    // @START-Table:Test
    await Table({
        list: 'Test',
        parent,
        advancedSearch: true,
        toolbar: [
               {
                label: 'All',
                filter(data) {

                }
            },
            {
                label: 'One',
                filter(data) {

                }
            },
            {
                label: 'two',
                filter(data) {

                }
            }
        ]
    });
    // @END-Table:Test
}