/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_Store from '../Actions/Action_Store.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** Components */
import Component_Card from '../Components/Component_Card.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_FormButton from '../Components/Component_FormButton.js'

export default async function View_SupportingFiles(param) {
    const {
        parent,
    } = param;
    
    const card = Component_Card({
        title: 'Supporting Files',
        titleColor: Setting_App.primaryColor,
        padding: '20px',
        width: '100%',
        parent
    });

    card.add();
}
