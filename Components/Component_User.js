/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'
import Action_DeleteItem from '../Actions/Action_DeleteItem.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'

/* Components */
import Component_DropDownField from './Component_DropDownField.js'
import Component_FormButton from './Component_FormButton.js'
import Component_Container from './Component_Container.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'

export default function Component_User(param) {
    const {
        user,
        parent,
        data,
        position
    } = param;

    const assignedCommands = data.map(item => item.FK_Command);
    const unassignedCommands = App.data.lists.Commands.filter(item => !assignedCommands.includes(item.Title));

    let editRole;

    const component = Component({
        html: /*html*/ `
            <div class='user'>
                <div class='user-name-container'>
                    <div class='user-name'>${user.FirstName} ${user.LastName}</div>
                    <div class='user-role'>${user.FK_Role}</div>
                </div>
                <div class='user-groups'>
                    <div class='user-groups-title-container'>
                        <div class='user-groups-title'>Commands</div>
                        <div class='user-remove-group-button hidden'>Unassign</div>
                    </div>
                    ${createHTML()}
                </div>
                <div class='user-button-container'>
                    ${displayButton()}
                    <div class='user-edit-button'>Edit</div>
                    <div class='user-edit-toolbar hidden'>
                        <div class='user-edit-toolbar-button save'>Save</div>
                        <div class='user-edit-toolbar-button cancel'>Cancel</div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: 20px 0px 0px 0px;
                padding: 10px;
                background: white;
                border-radius: 4px;
                border: ${App.defaultBorder};
                width: 500px;
            }

            .user-name-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: ${App.primaryColor};
                margin-bottom: 10px;
                font-weight: 500;
            }

            .user-name {
                font-size: 1.4em;
            }

            .user-role {
                font-size: 1.2;
            }

            .user-group-container {
                display: flex;
                align-items: center;
                margin: 5px 0px;
            }

            .user-groups-title-container {
                display: flex;
                align-items: flex-end;
            }

            .user-group-checkbox {
                margin-right: 5px;
            }

            .user-groups-title {
                font-size: 1.2em;
                font-weight: 500;
                margin-right: 5px;
            }

            /* Buttons */
            .user-button-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .user-remove-group-button {
                font-size: .8em;
                cursor: pointer;
                display: inline-block;
                border-radius: 4px;
                color: white;
                background: crimson;
                border: solid 2px firebrick;
                padding: 2px 5px;
            }

            .user-new-group-button {
                cursor: pointer;
                display: inline-block;
                border-radius: 4px;
                color: white;
                background: mediumseagreen;
                border: solid 2px seagreen;
                padding: 2px 5px;
            }

            .hidden {
                display: none;
            }

            /** Edit */
            .user-edit-button {
                font-size: .9em;
                cursor: pointer;
                display: inline-block;
                border-radius: 4px;
                color: ${App.primaryColor};
                background: transparent;
                border: solid 2px ${App.primaryColor};
                padding: 2px 5px;
            }

            .user-edit-toolbar {
                align-items: center;
            }

            .user-edit-toolbar-button {
                display: inline-block;
                font-size: .9em;
                margin: 0px 5px;
                cursor: pointer;
                border-radius: 4px;
                background: transparent;
                padding: 2px 5px;
            }

            .user-edit-toolbar-button.save {
                color: white;
                background: ${App.primaryColor};
                border: solid 2px ${App.primaryColor};
            }

            .user-edit-toolbar-button.cancel {
                color: ${App.primaryColor};
                border: solid 2px ${App.primaryColor};
            }

            /* Assinged to all */
            .user-all-assigned {
                font-size: .9em;
                font-weight: 500;
            }

            /* Checkboxes */
            label {
                display: flex;
            }

            input[type='checkbox'] {
                position: absolute;
                left: -10000px;
                top: auto;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            input[type='checkbox'] ~ .toggle {
                width: 20px;
                height: 20px;
                position: relative;
                display: inline-block;
                vertical-align: middle;
                /* border: solid 2px seagreen; */
                border: solid 2px lightgray;
                border-radius: 4px;
                cursor: pointer;
            }

            input[type='checkbox']:hover ~ .toggle {
                border-color: mediumseagreen;
            }
            

            input[type='checkbox']:checked ~ .toggle {
                border: solid 2px mediumseagreen;
                background: mediumseagreen url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: `#id input[type='checkbox']`,
                event: 'change',
                listener: onCheck
            },
            {
                selector: `#id .user-remove-group-button`,
                event: 'click',
                listener(event) {
                    const checked = component.findAll(`input[type='checkbox']:checked`)

                    checked.forEach(async checkbox => {
                        const group = checkbox.dataset.group;
                        const assignedCommand = App.data.lists.AssignedCommands.find(item => item.FK_Command === group && item.FK_Account === user.Account);

                        if (assignedCommand) {
                            console.log(group, assignedCommand);
                            
                            await Action_DeleteItem({
                                list: 'AssignedCommands',
                                itemId: assignedCommand.Id
                            });

                            /** Update UI */
                            const row = checkbox.closest('.user-group-container');

                            if (row) {
                                row.remove();
                                component.find('.user-remove-group-button').classList.add('hidden');
                            }
                        }
                    });
                }
            },
            {
                selector: `#id .user-new-group-button`,
                event: 'click',
                listener(event) {
                    const editButton = component.find('.user-edit-button');
                    
                    editButton.style.display = 'none';
                    event.target.style.display = 'none';

                    if (unassignedCommands.length > 0) {
                        const menu = Component_DropDownField({
                            label: 'Select Group',
                            dropDownOptions: unassignedCommands.map(item => {
                                return {
                                    id: item.Id,
                                    value: item.Title
                                }
                            }),
                            width: '300px',
                            parent: component,
                            fieldMargin: '0px'
                        });
                    
                        menu.add();
    
                        const container = Component_Container({
                            width: '300px',
                            justify: 'flex-end',
                            parent: component
                        });
                    
                        container.add();
    
                        const submit = Component_FormButton({
                            value: 'Assign',
                            type: 'create',
                            margin: '0px 0px 0px 10px',
                            parent: container,
                            async action() {
                                const FK_Command = menu.value();

                                if (unassignedCommands.map(item => item.Title).includes(FK_Command)) {
                                    const newItem = await Action_CreateItem({
                                        list: 'AssignedCommands',
                                        data: {
                                            FK_Command,
                                            FK_Account: user.Account
                                        },
                                        notify: false
                                    });

                                    /** Reset field */
                                    menu.value('');

                                    /** Add new group */
                                    addNewGroup(FK_Command);
                                } else {
                                    console.log('value in field does not match valid group name');
                                }
                            }
                        });
    
                        submit.add();
    
                        const cancel = Component_FormButton({
                            value: 'Cancel',
                            type: 'cancel',
                            margin: '0px 0px 0px 10px',
                            parent: container,
                            async action() {
                                menu.remove();
                                container.remove();
    
                                event.target.style.display = 'inline-flex';
                                editButton.style.display = 'inline-flex';
                            }
                        });
    
                        cancel.add();
                    }
                }
            },
            {
                selector: `#id .user-edit-button`,
                event: 'click',
                listener(event) {
                    /** Hide edit button */
                    event.target.style.display = 'none';

                    /** Unhide toolbar */
                    const toolbar = component.find('.user-edit-toolbar');
                    toolbar.classList.remove('hidden');

                    /** Get 'Role' */
                    const roleElement = component.find('.user-role');
                    const role = roleElement.innerText;
                    
                    /** Empty element */
                    roleElement.innerHTML = '';
                    
                    /** Add drop down field*/
                    editRole = Component_DropDownField({
                        label: '',
                        dropDownOptions: [
                            {
                                id: 0,
                                value: 'User'
                            },
                            {
                                id: 0,
                                value: 'Administrator'
                            }
                        ],
                        width: '130px',
                        parent: roleElement,
                        fieldMargin: '0px'
                    });
                
                    editRole.add();

                    /** Set value to current role */
                    editRole.value(role);
                }
            },
            {
                selector: `#id .user-edit-toolbar-button.cancel`,
                event: 'click',
                listener: cancelEdit
            },
            {
                selector: `#id .user-edit-toolbar-button.save`,
                event: 'click',
                async listener(event) {
                    const userAccount = App.data.lists.Users.find(item => item.Account === user.Account);
                    const currentRole = userAccount ? userAccount.FK_Role : '';
                    const selectedRole = editRole.value();

                    if (selectedRole !== currentRole) {
                        console.log('new role');

                        const updatedItem = await Action_UpdateItem({
                            list: 'Users',
                            itemId: userAccount.Id,
                            data: {
                                FK_Role: selectedRole
                            }
                        });

                        cancelEdit();
                    }
                }
            }
        ]
    });

    function displayButton() {
        let html = '';

        if (unassignedCommands.length > 0) {
            html += /*html*/ `
                <div class='user-new-group-button'>Assign to new command</div>
            `;
        } else {
            html += /*html*/ `
                <div class='user-all-assigned'><em>(Assigned to all commands)</em></div>
            `;
        }

        return html;
    }

    /** @todo if data.length === 0 display 'Not assigned to any commands' message */
    function createHTML() {
        let html = '';
        
        data.forEach(item => {
            const {
                FK_Command
            } = item;

            html += /*html*/ `
                <div class='user-group-container'>
                    <div class='user-group-checkbox'>
                        <label>
                            <input type="checkbox" data-group="${FK_Command}" />
                            <span class="toggle"></span>
                        </label>
                    </div>
                    <div class='user-group'>${FK_Command}</div>
                </div>
            `
        });

        return html;
    }

    function onCheck(event) {
        const checkboxes = component.findAll(`input[type='checkbox']:checked`);
        const removeButton = component.find('.user-remove-group-button');

        if (checkboxes.length > 0) {
            removeButton.classList.remove('hidden');
        } else {
            removeButton.classList.add('hidden');
        }
    }

    function addNewGroup(group) {
        const html = /*html*/ `
            <div class='user-group-container'>
                <div class='user-group-checkbox'>
                    <label>
                        <input type="checkbox" data-group='${group}'/>
                        <span class="toggle"></span>
                    </label>
                </div>
                <div class='user-group'>${group}</div>
            </div>
        `;

        const groupContainer = component.find('.user-groups');
        groupContainer.insertAdjacentHTML('beforeend', html);

        const checkbox = component.find(`input[type='checkbox'][data-group='${group}']`);
        checkbox.addEventListener('change', onCheck);
    }

    function cancelEdit(event) {
        /** Hide toolbar */
        const toolbar = component.find('.user-edit-toolbar');
        toolbar.classList.add('hidden');

        /** Show edit button */
        const editButton = component.find('.user-edit-button');
        editButton.style.display = 'inline-flex';

        /** Replace 'role' drop down menu with current role */
        const userAccount = App.data.lists.Users.find(item => item.Account === user.Account);
        
        if (userAccount) {
            const roleElement = component.find('.user-role');
            roleElement.innerHTML = userAccount.FK_Role;
        }
    }

    return component;
}