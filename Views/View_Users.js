/** RHC-C SharePoint Team */

/** Actions */
import Action_Authorize from '../Actions/Action_Authorize.js'
import Action_Get from '../Actions/Action_Get.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_DeleteItem from '../Actions/Action_DeleteItem.js'
import Action_Store from '../Actions/Action_Store.js'
import Action_Route from '../Actions/Action_Route.js'

/** Components */
import Component_Title from '../Components/Component_Title.js'
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_Card from '../Components/Component_Card.js'
import Component_Container from '../Components/Component_Container.js'
import Component_DataTable from '../Components/Component_DataTable.js'
import Component_Modal from '../Components/Component_Modal.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** View Parts */
import ViewPart_Table from '../ViewParts/ViewPart_Table.js'
import ViewPart_EditUser from '../ViewParts/ViewPart_EditUser.js'
import ViewPart_NewUser from '../ViewParts/ViewPart_NewUser.js'
import Component_Alert from '../Components/Component_Alert.js'

export default async function View_Users(param = {}) {
    const {
        itemId
    } = param;

    /** Authorize */
    const isAuthorized = Action_Authorize('Users');

    if (!isAuthorized) {
        return;
    }

    const parent = Action_Store.get('maincontainer');

    const viewTitle = Component_Title({
        title: Setting_App.title,
        subTitle: 'Users',
        date: `${new Date().toLocaleString('default', {
            dateStyle: 'full'
        })}`,
        type: 'across',
        parent
    });

    viewTitle.add();

    let user;
    let selectedRow;
    let userForm;
    let messageExists;
    let messageValid;

    const card = Component_Card({
        title: '',
        titleColor: Setting_App.primaryColor,
        padding: '20px',
        margin: '20px 0px',
        width: '100%',
        parent
    });

    card.add();

    const container = Component_Container({
        width: '100%',
        direction: 'column',
        padding: '0px 0px 0px 0px',
        parent: card
    });

    container.add();

    /** Loading Indicator */
    const loadingIndicator = Component_FoldingCube({
        label: 'Loading Users',
        margin: '40px 0px',
        parent: container
    });
    
    loadingIndicator.add();
    
    const usersTable = ViewPart_Table({
        heading: '',
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id',
            },
            {
                internalFieldName: 'Title',
                displayName: 'Name',
            },
            {
                internalFieldName: 'LoginName',
                displayName: 'Login Name',
            },
            {
                internalFieldName: 'Email',
                displayName: 'Email',
            },
            {
                internalFieldName: 'Role',
                displayName: 'Role'
            }
        ],
        items: await Action_Get({
            list: 'Users'
        }),
        checkboxes: true,
        addButton: true,
        addButtonValue: 'Add user',
        editForm: ViewPart_EditUser,
        newForm: ViewPart_NewUser,
        parent: container
    });

    // const usersTable = Component_DataTable({
    //     headers: [
    //         '',
    //         'Id',
    //         'Name',
    //         'Account',
    //         'Email',
    //         'Role'
    //     ],
    //     checkboxes: true,
    //     border: false,
    //     columns: [
    //         {
    //             data: null,
    //         },
    //         {
    //             data: 'Id',
    //             type: 'number',
    //             visible: false,
    //             render(data, type, row) {
    //                 return data;
    //             }
    //         },
    //         {
    //             data: 'Title',
    //             type: 'text',
    //             render(data, type, row) {
    //                 return data;
    //             }
    //         },
    //         {
    //             data: 'LoginName',
    //             type: 'text',
    //             render(data, type, row) {
    //                 return data;
    //             }
    //         },
    //         {
    //             data: 'Email',
    //             type: 'text',
    //             render(data, type, row) {
    //                 return data;
    //             }
    //         },
    //         {
    //             data: 'Role',
    //             type: 'text',
    //             render(data, type, row) {
    //                 return data;
    //             }
    //         }
    //     ],
    //     data: await Action_Get({
    //         list: 'Users'
    //     }),
    //     rowId: 'Id',
    //     order: [[2, 'asc']],
    //     buttons: [
    //         {
    //             text: /*html*/ `
    //                 <svg class='icon'>
    //                     <use href='#icon-user'></use>
    //                 </svg>
    //                 <span>Add user</span>
    //             `,
    //             className: 'add-item',
    //             action: function (e, dt, node, config) {
    //                 // console.log(e, dt, node, config);
    //                 const userModal = Component_Modal({
    //                     title: `New User`,
    //                     async addContent(modalBody) {
    //                         userForm = await ViewPart_NewUser({
    //                             parent: modalBody
    //                         });
        
    //                         userModal.showFooter();
    //                     },
    //                     buttons: {
    //                         footer: [
    //                             {
    //                                 value: 'Cancel',
    //                                 classes: 'btn-secondary',
    //                                 data: [
    //                                     {
    //                                         name: 'dismiss',
    //                                         value: 'modal'
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 value: 'Create',
    //                                 classes: 'btn-primary',
    //                                 async onClick(event) {
    //                                     /** Disable button - Prevent user from clicking this item more than once */
    //                                     $(event.target).attr('disabled', '');

    //                                     /** Get field values from userForm View Part */
    //                                     const data = userForm.getFieldValues();

    //                                     /** Check required values */
    //                                     if (!data) {
    //                                         if (messageValid) {
    //                                             messageValid.remove();
    //                                         }

    //                                         messageValid = Component_Alert({
    //                                             type: 'danger',
    //                                             text: `Missing requried information. Please check that all fields are valid.`,
    //                                             close: true,
    //                                             parent: userModal.getModalBody(),
    //                                             position: 'beforeend'
    //                                         });

    //                                         messageValid.add();

    //                                         /** Enable button */
    //                                         $(event.target).removeAttr('disabled')

    //                                         return;
    //                                     }

    //                                     /** Create AllowSwitchGroups items */
    //                                     const Account = data.Account;

    //                                     /** Check if account already exists */
    //                                     if (Account)  {
    //                                         const userItem = await Action_Get({
    //                                             list: 'Users',
    //                                             select: 'Id,Account',
    //                                             filter: `Account eq '${Account}'`
    //                                         });
                            
    //                                         if (userItem[0]) {
    //                                             if (messageExists) {
    //                                                 messageExists.remove();
    //                                             }

    //                                             const link = `${location.href.split('#')[0]}#Users/${userItem[0].Id}`

    //                                             messageExists = Component_Alert({
    //                                                 type: 'danger',
    //                                                 text: /*html*/ `
    //                                                     An account for this user already exists. <a href='${link}' class='alert-link'>Click here to view it.</a>
    //                                                 `,
    //                                                 close: true,
    //                                                 parent: userModal.getModalBody(),
    //                                                 position: 'afterbegin'
    //                                             });

    //                                             messageExists.add();

    //                                             /** Enable button */
    //                                             $(event.target).removeAttr('disabled')

    //                                             return;
    //                                         }
    //                                     }

    //                                     /** Update button value */
    //                                     $(event.target).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating user');

    //                                     /** Create new user */
    //                                     const newItem = await Action_CreateItem({
    //                                         list: 'Users',
    //                                         data
    //                                     });

    //                                     /** Craete AllowedSwitchGroups items */
    //                                     const groups = userForm.getAllowedGroups();

    //                                     await Promise.all(groups.map(Group => {
    //                                         return Action_CreateItem({
    //                                             list: 'AllowedSwitchGroups',
    //                                             data: {
    //                                                 Account,
    //                                                 Group
    //                                             }
    //                                         });
    //                                     }));

    //                                     /** Add new user to table */
    //                                     usersTable.addRow({
    //                                         data: newItem
    //                                     });

    //                                     // Enable button;
    //                                     $(event.target)
    //                                         .removeAttr('disabled')
    //                                         .text('Complete!')
        
    //                                     /** Hide modal */
    //                                     userModal.getModal().modal('hide');
    //                                 }
    //                             }
    //                         ]
    //                     },
    //                     parent
    //                 });
        
    //                 userModal.add();
    //             }
    //         },
    //         {
    //             text: /*html*/ `
    //                 <svg class='icon'>
    //                     <use href='#icon-cross'></use>
    //                 </svg>
    //                 <span>Delete user</span>
    //             `,
    //             className: 'ml-50 disabled delete-item',
    //             action: function(e, dt, node, config) {
    //                 console.log('e', e);
    //                 console.log('dt', dt);
    //                 console.log('node', node);
    //                 console.log('config', config);

    //                 const selected = usersTable.selected();

    //                 console.log('select', selected);
    //             }
    //         },
    //         {
    //             extend: 'excelHtml5',
    //             className: 'ml-50',
    //             exportOptions: {
    //                 header: false,
    //                 footer: false,
    //                 columns: [3,4,5,6,7,8,9,10,11,12,13]
    //             }
    //         },
    //         {
    //             extend: 'csvHtml5',
    //             exportOptions: {
    //                 header: false,
    //                 footer: false,
    //                 columns: [3,4,5,6,7,8,9,10,11,12,13]
    //             }
    //         },
    //         {
    //             extend: 'pdfHtml5',
    //             exportOptions: {
    //                 columns: [3,4,5,6,7,8,9,10,11,12,13]
    //             }
    //         }
    //     ],
    //     onRowClick(param) {
    //         const {
    //             row,
    //             item
    //         } = param;

    //         /** Set row */
    //         selectedRow = row;

    //         /** Set user */
    //         user = item;

    //         const title = user.Title;

    //         /** Show User */
    //         const eventModal = Component_Modal({
    //             title,
    //             async addContent(modal) {
    //                 userForm = await ViewPart_EditUser({
    //                     user: item,
    //                     parent: modal
    //                 });

    //                 eventModal.showFooter();
    //             },
    //             buttons: {
    //                 footer: [
    //                     {
    //                         value: 'Cancel',
    //                         classes: 'btn-secondary',
    //                         data: [
    //                             {
    //                                 name: 'dismiss',
    //                                 value: 'modal'
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         value: 'Delete',
    //                         classes: 'btn-danger',
    //                         async onClick(event) {
    //                             /** Disable button - Prevent user from clicking this item more than once */
    //                             $(event.target).attr('disabled', '')

    //                             const check = confirm(`This will delete the IPPSCS user account for:\n\n    ${title}\n\nAre you sure you want to proceed?`);

    //                             if (check) {
    //                                 /** Update button text */
    //                                 $(event.target).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Deleting user');
                                    
    //                                 /** Delete Users item */
    //                                 await Action_DeleteItem({
    //                                     list: 'Users',
    //                                     itemId: user.Id
    //                                 });
                                    
    //                                 usersTable.removeRow(selectedRow);

    //                                 /** Enable button */
    //                                 $(event.target)
    //                                     .removeAttr('disabled')
    //                                     .text('Complete!');

    //                                 /** Hide modal */
    //                                 eventModal.getModal().modal('hide');
    //                             } else {
    //                                 /** Enable button */
    //                                 $(event.target).removeAttr('disabled')
    //                             }
    //                         }
    //                     },
    //                     {
    //                         value: 'Update',
    //                         classes: 'btn-primary',
    //                         async onClick(event) {
    //                             /** Disable button - Prevent user from clicking this item more than once */
    //                             $(event.target)
    //                                 .attr('disabled', '')
    //                                 .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating user');

    //                             /** Get form data */
    //                             const data = userForm.getFieldValues();
                                
    //                             let updatedItem;

    //                             if (data) {
    //                                 updatedItem = await Action_UpdateItem({
    //                                     list: 'Users',
    //                                     itemId: user.Id,
    //                                     data
    //                                 });

    //                                 usersTable.updateRow({
    //                                     row: selectedRow,
    //                                     data: updatedItem
    //                                 });
    //                             } else {
    //                                 console.log('data unchanged');
    //                             }

    //                             /** Get checked groups items */
    //                             const groups = userForm.getAllowedGroups();
                                
    //                             if (groups) {
    //                                 /** Added */
    //                                 if (groups.added.length > 0) {
    //                                     await Promise.all(groups.added.map(Group => {
    //                                         return Action_CreateItem({
    //                                             list: 'AllowedSwitchGroups',
    //                                             data: {
    //                                                 Account: updatedItem ? updatedItem.Account : user.Account,
    //                                                 Group
    //                                             }
    //                                         });
    //                                     }));
    //                                 }
                            
    //                                 /** Removed */
    //                                 if (groups.removed.length > 0) {
    //                                     await Promise.all(groups.removed.map(item => {
    //                                         return Action_DeleteItem({
    //                                             list: 'AllowedSwitchGroups',
    //                                             itemId: item.Id
    //                                         });
    //                                     }));
    //                                 }
    //                             } else {
    //                                 console.log('groups unchanged');
    //                             }

    //                             /** Enable button */
    //                             $(event.target)
    //                                 .removeAttr('disabled')
    //                                 .text('Complete!');

    //                             /** Hide modal */
    //                             eventModal.getModal().modal('hide');
    //                         }
    //                     }
    //                 ]
    //             },
    //             parent
    //         });

    //         eventModal.add();
    //     },
    //     onSelect(param) {
    //         const selected = usersTable.selected();

    //         console.log('select', selected);

    //         const button = usersTable.getButton('delete-item');

    //         if (button) {
    //             button.classList.remove('disabled');
    //         }
    //     },
    //     onDeselect(param) {
    //         const selected = usersTable.selected();

    //         console.log('deselect', selected);

    //         const button = usersTable.getButton('delete-item');

    //         if (button && selected.length === 0) {
    //             button.classList.add('disabled');
    //         }
    //     },
    //     onDraw(param) {
    //         const {
    //             jqevent,
    //             table
    //         } = param;

    //         /* Set dashboard on table filter */
    //         const data = table.rows({ search: 'applied' }).data().toArray();
    //     },
    //     parent: container
    // });

    // usersTable.add();

    /** Remove Loading Indication */
    loadingIndicator.remove();

    /** Open modal */
    if (itemId) {
        const row = usersTable.findRowById(itemId);

        if (row) {
            row.show().draw(false).node().click();
        }
    }
}
