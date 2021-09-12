/** Actions */
import Store from '../Core/Store.js'

/** Components */
import { Title } from '../Core/Components.js'

/** Settings */
import { App } from '../Core/Settings.js'

export default async function View_Home() {
    /** View Parent */
    const parent = Store.get('maincontainer');

    /** View Title */
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Subtitle (Ex: Application/Abbreviation Full Name)`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();
}
