import Store from '../Core/Store.js';

/* Components */
import Component_Title from '../Components/Component_Title.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_Container from '../Components/Component_Container.js'
import Component_RequestAssitanceInfo from '../Components/Component_RequestAssitanceInfo.js';

/** Settings */
import { App } from '../Core/Settings.js'

export default async function View_Help() {
    const parent = Store.get('maincontainer');

    const viewTitle = Component_Title({
        title: App.get('title'),
        subTitle: `Help`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** View Container */
    const viewContainer = Component_Container({
        display: 'block',
        margin: '20px 0px 0px 0px',
        parent
    });

    viewContainer.add();

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
        parent: viewContainer
    });

    requestAssistanceInfo.add();
}
