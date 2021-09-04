/** RHC-C SharePoint Team */

/** Actions */
import Action_Store from '../Actions/Action_Store.js'

/* Components */
import Component_Title from '../Components/Component_Title.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** View Parts */
import ViewPart_AccountInfo from '../ViewParts/ViewPart_AccountInfo.js'
import ViewPart_DeveloperLinks from '../ViewParts/ViewPart_DeveloperLinks.js'
import ViewPart_ReleaseNotes from '../ViewParts/ViewPart_ReleaseNotes.js'
import ViewPart_SiteUsage from '../ViewParts/ViewPart_SiteUsage.js'

export default async function View_Settings() {
    const parent = Action_Store.get('maincontainer');

    const viewTitle = Component_Title({
        title: Setting_App.title,
        subTitle: `Settings`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    ViewPart_AccountInfo({
        parent
    });

    /** Authorize */
    if (Action_Store.user().Role === 'Developer') {
        ViewPart_DeveloperLinks({
            parent
        });
    }

    ViewPart_ReleaseNotes({
        parent
    });

    /** Authorize */
    if (Action_Store.user().Role === 'Developer') {
        ViewPart_SiteUsage({
            parent
        });
    }
}
