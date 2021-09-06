/** Actions */
import Action_Get from '../Actions/Action_Get.js'

/* Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_DropDownField from '../Components/Component_DropDownField.js'

/**
 * ViewPart_EditUser
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export default async function ViewPart_EditUser(param) {
    const {
        item,
        table,
        row,
        modal,
        parent
    } = param;

    /** Turn body scroll off */
    modal.scrollable(false);

    const {
        Title,
        LoginName,
        Email,
        Role
    } = item;
    
    /** Loading Indicator */
    const loadingIndicator = Component_FoldingCube({
        label: 'Loading form',
        margin: '40px 0px',
        parent
    });
    
    loadingIndicator.add();

    /** Roles */
    const roles = await Action_Get({
        list: 'Roles'
    });

    /** Name */
    const nameField = Component_SingleLineTextField({
        label: 'Name',
        value: Title,
        fieldMargin: '0px',
        parent
    });

    nameField.add();

    /** Account */
    const accountField = Component_SingleLineTextField({
        label: 'Account',
        value: LoginName,
        fieldMargin: '0px',
        parent
    });

    accountField.add();

    /** Email */
    const emailField = Component_SingleLineTextField({
        label: 'Email',
        value: Email,
        fieldMargin: '0px',
        parent
    });

    emailField.add();

    /** Role */
    const roleField = Component_DropDownField({
        list: 'Roles',
        label: 'Role',
        value: Role,
        dropDownOptions: roles.map(item => {
            const {
                Id, Title
            } = item;

            return {
                id: Id,
                value: Title
            };
        }),
        width: '200px',
        fieldMargin: '0px',
        parent
    });

    roleField.add();

    /** Remove Loading Indication */
    loadingIndicator.remove();

    return {
        getFieldValues() {
            const data = {};

            if (nameField.value() !== Title) {
                /** @todo field.chagned() */
                data.Title = nameField.value();
            }

            if (accountField.value() !== LoginName) {
                /** @todo field.chagned() */
                data.LoginName = middleNameField.value();
            }

            if (emailField.value() !== Email) {
                /** @todo field.chagned() */
                data.Email = emailField.value();
            }

            if (roleField.value() !== Role) {
                /** @todo field.chagned() */
                data.Role = roleField.value();
            }

            return data;
        }
    };
}
