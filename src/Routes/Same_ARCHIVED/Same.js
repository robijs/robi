import { Title } from '../../Robi/RobiUI.js'

export default async function Measures({ parent, pathParts, props }) {
    // View title
    const routeTitle = Title({
        title: /* @START-Title */'Different'/* @END-Title */,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    routeTitle.add();
}