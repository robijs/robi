/** Actions */
import Action_Store from '../Actions/Action_Store.js'
import Action_Route from '../Actions/Action_Route.js'

/** Components */
import Component_Title from '../Components/Component_Title.js'

/** Settings */
import { App } from '../Core/Settings.js'

export default async function View_Home() {
    /** View Parent */
    const parent = Action_Store.get('maincontainer');

    /** View Title */
    const viewTitle = Component_Title({
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
