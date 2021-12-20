import { Table, Title, Sortable, BootstrapButton, Container } from '../../Robi/RobiUI.js'

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

    // Enable sort
    const sortCtr = Container({
        justify: 'end',
        parent
    });

    sortCtr.add();

    let sortable = false;

    const sortBtn = BootstrapButton({
        type: 'robi',
        value: 'Sort',
        classes: ['mt-3', 'mb-3'],
        parent: sortCtr,
        action(event) {
            if (!sortable) {
                event.target.innerText = 'Cancel';

                $(`#${parent.get().id}`).sortable({ items: '.table-container' });
                $(`#${parent.get().id} .table-container > *`).css({"pointer-events": "none", "user-select": "none"});

                sortable = true;
            } else {
                event.target.innerText = 'Sort';
                $(`#${parent.get().id}`).sortable('destroy');
                $(`#${parent.get().id} .table-container > *`).css({"pointer-events": "auto", "user-select": "auto"});

                sortable = false;
            }
        }
    });

    sortBtn.add();

    // @START-Table:Test
    await Table({
        list: 'Test',
        parent,
        advancedSearch: true,
        toolbar: [
            {
                label: 'All',
                filter(data) {
                    return data;
                }
            },
            {
                label: 'One',
                filter(data) {
                    return data.filter(item => item.Choice === 'One');
                }
            },
            {
                label: 'Two',
                filter(data) {
                    return data.filter(item => item.Choice === 'Two');
                }
            },
            {
                label: 'Three',
                filter(data) {
                    return data.filter(item => item.Choice === 'Three');
                }
            }
        ]
    });
    // @END-Table:Test
    
    // @START-Table:Test-2
    await Table({
        list: 'Test',
        parent,
        advancedSearch: true,
        toolbar: [
            {
                label: 'All',
                filter(data) {
                    return data;
                }
            },
            {
                label: 'One',
                filter(data) {
                    return data.filter(item => item.Choice === 'One');
                }
            },
            {
                label: 'Two',
                filter(data) {
                    return data.filter(item => item.Choice === 'Two');
                }
            },
            {
                label: 'Three',
                filter(data) {
                    return data.filter(item => item.Choice === 'Three');
                }
            }
        ]
    });
    // @END-Table:Test-2

    // @START-Table:Test-3
    await Table({
        list: 'Test',
        parent,
        advancedSearch: true,
        toolbar: [
            {
                label: 'All',
                filter(data) {
                    return data;
                }
            },
            {
                label: 'One',
                filter(data) {
                    return data.filter(item => item.Choice === 'One');
                }
            },
            {
                label: 'Two',
                filter(data) {
                    return data.filter(item => item.Choice === 'Two');
                }
            },
            {
                label: 'Three',
                filter(data) {
                    return data.filter(item => item.Choice === 'Three');
                }
            }
        ]
    });
    // @END-Table:Test-3
}