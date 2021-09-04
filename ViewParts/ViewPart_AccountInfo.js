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

export default async function View_AccountInfo(param) {
    const {
        parent,
    } = param;

    const accountInfoCard = Component_Card({
        title: 'Account',
        titleColor: Setting_App.primaryColor,
        width: '100%',
        margin: '20px 0px 0px 0px',
        parent
    });

    accountInfoCard.add();

    const {
        Title,
        LoginName,
        Email,
        Role,
    } = Action_Store.user();

    /** Name */
    const nameField = Component_SingleLineTextField({
        label: 'Name',
        value: Title,
        readOnly: true,
        fieldMargin: '0px',
        parent: accountInfoCard
    });

    nameField.add();

    /** Account */
    const accountField = Component_SingleLineTextField({
        label: 'Account',
        value: LoginName,
        readOnly: true,
        fieldMargin: '0px',
        parent: accountInfoCard
    });

    accountField.add();
    
    /** Email */
    const emailField = Component_SingleLineTextField({
        label: 'Email',
        value: Email,
        readOnly: true,
        fieldMargin: '0px',
        parent: accountInfoCard
    });

    emailField.add();

    /** Role */
    const roleField = Component_SingleLineTextField({
        label: 'Role',
        value: Role || 'User',
        readOnly: true,
        fieldMargin: '0px',
        parent: accountInfoCard
    });

    roleField.add();
}
