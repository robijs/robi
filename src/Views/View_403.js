import Store from '../Core/Store.js'

/* Components */
import Component_Alert from '../Components/Component_Alert.js';
import Component_Title from '../Components/Component_Title.js'

/** Settings */
import { App } from '../Core/Settings.js'

export default async function View_403() {
    const parent = Store.get('maincontainer');

    const viewTitle = Component_Title({
        title: App.get('title'),
        subTitle: `403`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const alertBanner = Component_Alert({
        type: 'warning',
        text: `Sorry! You don't have access to this page. Please select a different option from the menu on the left.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}
