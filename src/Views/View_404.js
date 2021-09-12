import Store from '../Core/Store.js';

/* Components */
import Component_Alert from '../Components/Component_Alert.js';
import Component_Title from '../Components/Component_Title.js'

/** Settings */
import { App } from '../Core/Settings.js'

export default async function View_404() {
    const parent = Store.get('maincontainer');

    const viewTitle = Component_Title({
        title: App.get('title'),
        subTitle: `404`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const alertBanner = Component_Alert({
        type: 'info',
        text: `Sorry! That page doesn't appear to exist. Please choose an option from the sidebar on the left.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}
