/** RHC-C SharePoint Team */

/** Actions */
import Action_Store from '../Actions/Action_Store.js';

/* Components */
import Component_Title from '../Components/Component_Title.js'
import Component_Heading from '../Components/Component_Heading.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_Text from '../Components/Component_Text.js';
import Component_RequestAssitanceInfo from '../Components/Component_RequestAssitanceInfo.js';

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default async function View_Help() {
    const parent = Action_Store.get('maincontainer');

    const viewTitle = Component_Title({
        title: Setting_App.title,
        subTitle: `Help`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** User Guide Heading */
    const userGuideHeading = Component_Heading({
        text: 'User guides',
        margin: '20px 0px',
        parent
    });

    userGuideHeading.add();

    /** Alert */
    const infoAlert = Component_Alert({
        type: 'info',
        text: 'User guides coming soon!',
        parent
    });

    infoAlert.add();

    /** Request assitance Heading */
    const requestAssistanceHeading = Component_Heading({
        text: 'Request Assistance',
        margin: '50px 0px 20px 0px',
        parent
    });

    requestAssistanceHeading.add();

    const requestAssistanceInfo = Component_RequestAssitanceInfo({
        data: [
            {
                label: 'For data related questions, please contact:',
                name: 'First Last',
                title: 'TItle, Branch',
                email: 'first.last.civ@mail.mil',
                phone: '(555) 555-5555'
            }
        ],
        parent
    });

    requestAssistanceInfo.add();
}
