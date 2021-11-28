import { Title } from '../../Robi/RobiUI.js'

/**
 * 
 * @param {*} param 
 */
export default async function Test(param) {
    const { parent } = param;

    // View title
    const viewTitle = Title({
        title: `Test`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();
}