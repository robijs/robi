/** Actions */
import Action_Get from '../Actions/Action_Get.js'

/* Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_NameField from '../Components/Component_NameField.js'
import Component_NameField_2 from '../Components/Component_NameField_2.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_SingleLineTextField from '../Components/Component_SingleLineTextField.js'
import Component_DropDownField from '../Components/Component_DropDownField.js'

/**
 * ViewPart_EditUser
 * @description
 * @returns {Object} - @method {getFieldValues} call that return values for User
 */
export default async function ViewPart_NewUser(param) {
    const {
        table,
        modal,
        parent
    } = param;

    /** Turn body scroll off */
    modal.scrollable(false);

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
    const nameField = Component_NameField({
        label: 'Search CarePoint Accounts',
        description: 'If an account is found, Account and Email Fields will be set automatically.',
        fieldMargin: '0px 40px 20px 40px',
        parent,
        onInput(event) {
            const value = event.target.innerText;

            if (!value) {
                accountField.value('');
                emailField.value('');
            }
        },
        async onSetValue(data) {
            const {
                info
            } = data.newValue;

            if (info) {
                const {
                    Account,
                    WorkEmail
                } = info;

                /** Check if account exists */
                if (Account !== '')  {
                    const userItem = await Action_Get({
                        list: 'Users',
                        select: 'Id,LoginName',
                        filter: `LoginName eq '${Account.split('|')[2]}'`
                    });

                    if (userItem[0]) {
                        readOnlyCard.update({
                            type: 'secondary'
                        });

                        accountField.value('None');
                        emailField.value('None');
                        nameField.value('');

                        const link = `Users/${userItem[0].Id}`;

                        nameField.addError({
                            text: /*html*/ `
                                An account for this user already exists. <span class='alert-link' data-route='${link}'>Click here to view it.</span> Or search for another name.
                            `
                        });

                        return;
                    } else {
                        nameField.removeError();
                    }
                }

                readOnlyCard.update({
                    type: 'success'
                });

                if (Account) {
                    accountField.value(Account.split('|')[2]);
                }

                if (WorkEmail) {
                    emailField.value(WorkEmail);
                }
            }
        }
    });

    nameField.add();

    /** Name Field (2) */
    const nameField_2 = Component_NameField_2({
        label: 'Search CarePoint Accounts',
        description: 'If an account is found, Account and Email Fields will be set automatically.',
        fieldMargin: '0px 40px 20px 40px',
        // parent: toolbarContainer,
        parent,
        onSearch(query) {
            /** 
             * - maybe call this in the component itself
             * - doesn't need to be defined here
             */
            // marketsToolbar.showSearchList({
            //     items: {
            //         markets: filteredMarkets,
            //         facilities: filteredFacilities
            //     }
            // });
        },
        onSelect(data) {
            const {
                event,
                user
            } = param;

            console.log(data);
        },
        onClear(event) {
            console.log('clear name fields');
        }
    });

    nameField_2.add();

    /** Read Only Card */
    const readOnlyCard = Component_Alert({
        text: '',
        type: 'secondary',
        margin: '0px 40px 15px 40px',
        parent
    });

    readOnlyCard.add();

    /** Account */
    const accountField = Component_SingleLineTextField({
        label: 'Account',
        value: 'None',
        readOnly: true,
        // fieldMargin: '0px 40px 20px 40px',
        parent: readOnlyCard
    });

    accountField.add();

    /** Email */
    const emailField = Component_SingleLineTextField({
        label: 'Email',
        value: 'None',
        readOnly: true,
        // fieldMargin: '0px 40px 20px 40px',
        parent: readOnlyCard
    });

    emailField.add();

    /** Role */
    const roleField = Component_DropDownField({
        list: 'Roles',
        label: 'Role',
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
        fieldMargin: '0px 40px 20px 40px',
        parent
    });

    roleField.add();

    /** Remove Loading Indication */
    loadingIndicator.remove();

    /** Focus */
    nameField.focus();

    return {
        getFieldValues() {
            const data = {};

            if (nameField.value()) {
                /** @todo field.chagned() */
                data.Title = nameField.value();
            }

            if (accountField.value()) {
                /** @todo field.chagned() */
                data.LoginName = middleNameField.value();
            }

            if (emailField.value()) {
                /** @todo field.chagned() */
                data.Email = emailField.value();
            }

            if (roleField.value()) {
                /** @todo field.chagned() */
                data.Role = roleField.value();
            }

            return data;
        }
    };
}
