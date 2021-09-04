/** RHC-C SharePoint Team */

/** Actions */
import Action_Store from '../Actions/Action_Store.js';

/* Components */
import Component_Alert from '../Components/Component_Alert.js';
import Component_Title from '../Components/Component_Title.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default async function View_404() {
    const parent = Action_Store.get('maincontainer');

    const viewTitle = Component_Title({
        title: Setting_App.title,
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
