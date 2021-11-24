import { Title } from '../../Core/Components.js'
import { App } from '../../Core/Settings.js'

/**
 * 
 */
export default async function Test(param) {
    const { parent } = param;

    // View title
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Test`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();
}