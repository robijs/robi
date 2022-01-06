import { Table, Title, BootstrapButton, Container } from '../../Robi/RobiUI.js'

export default async function SortTables3({ parent }) {
    // View title
    const routeTitle = Title({
        title: /* @START-Title */'Sort Tables'/* @END-Title */,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    routeTitle.add();

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
        classes: ['mt-3'],
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
    
    // @START-Table:Number
    await Table({
        list: 'Number',
        parent,
        advancedSearch: true,
        toolbar: [
            {
                label: 'All',
                filter(data) {
                    return data;
                }
            }
        ]
    });
    // @END-Table:Number
    
    // @START-Table:MLOT
    await Table({
        list: 'MLOT',
        parent,
        advancedSearch: true,
        toolbar: [
            {
                label: 'All',
                filter(data) {
                    return data;
                }
            }
        ]
    });
    // @END-Table:MLOT

    // @START-Table:SLOT
    await Table({
        list: 'SLOT',
        parent,
        advancedSearch: true,
        toolbar: [
            {
                label: 'All',
                filter(data) {
                    return data;
                }
            }
        ]
    });
    // @END-Table:SLOT

    // @START-Table:Choice
    await Table({
        list: 'Choice',
        parent,
        advancedSearch: true,
        toolbar: [
            {
                label: 'All',
                filter(data) {
                    return data;
                }
            }
        ]
    });
    // @END-Table:Choice
}