/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_Store from '../Actions/Action_Store.js';

/** Components */
import Component_Title from '../Components/Component_Title.js'
import Component_Container from '../Components/Component_Container.js'
import Component_QPPQuestions from '../Components/Component_QPPQuestions.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default async function View_Quesitons() {
    /** View Parent */
    const parent = Action_Store.get('maincontainer');

    /** View Title */
    const viewTitle = Component_Title({
        title: Setting_App.title,
        subTitle: `Questions`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** View Container */
    const viewContainer = Component_Container({
        display: 'block',
        margin: '30px 0px',
        parent
    });

    viewContainer.add();

    const qppQuestions = Component_QPPQuestions({
        parent: viewContainer
    });

    qppQuestions.add();
}
