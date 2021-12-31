import { Title } from '../../Robi/RobiUI.js'

export default async function Measures({ parent }) {
    // View title
    const routeTitle = Title({
        title: /* @START-Title */'Sort'/* @END-Title */,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    routeTitle.add();
}