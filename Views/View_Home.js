/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_Route from '../Actions/Action_Route.js'
import Action_Store from '../Actions/Action_Store.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'

/** Components */
import Component_Title from '../Components/Component_Title.js'
import Component_HomeTemplate from '../Components/Component_HomeTemplate.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** View Parts */
import ViewPart_Table from '../ViewParts/ViewPart_Table.js'
import ViewPart_EditUser from '../ViewParts/ViewPart_EditUser.js'
import ViewPart_NewUser from '../ViewParts/ViewPart_NewUser.js'
import Component_Alert from '../Components/Component_Alert.js'

export default async function View_Home() {
    /** View Parent */
    const parent = Action_Store.get('maincontainer');

    /** View Title */
    const viewTitle = Component_Title({
        title: Setting_App.title,
        subTitle: `Combat Support Agency Review Team`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    // const form = Component_HomeTemplate({
    //     parent
    // });

    // form.add();

    viewTitle.add();
}
