import { Authorize, Get, CreateItem, UpdateItem, DeleteItem, Route, AttachFiles, UploadFiles, SendEmail } from '../Core/Actions.js'
import { 
    Title,
    Alert,
    Container,
    RequestAssitanceInfo,
    FoldingCube,
    Card,
    Modal,
    BootstrapButton,
    Timer,
    UploadButton,
    QuestionTypes,
    QuestionsToolbar

} from '../Core/Components.js'
import { App } from '../Core/Settings.js'
import Store from '../Core/Store.js'

/** View Parts */
import {
    Table,
    EditUser,
    NewUser,
    AccountInfo,
    DeveloperLinks,
    ReleaseNotes,
    SiteUsage,
    ErrorForm,
    LogForm,
    Question as VP_Question,
    QuestionCards,
    NewQuestion
} from '../Core/ViewParts.js'

/** Models */
import { Question as M_Question, Questions as M_Questions } from './Models.js'

/**
 * 
 */
export async function Home() {
    /** View Parent */
    const parent = Store.get('maincontainer');

    /** View Title */
    const viewTitle = Title({
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

/**
 * 
 */
export async function Help() {
    const parent = Store.get('maincontainer');

    const viewTitle = Title({
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
    const viewContainer = Container({
        display: 'block',
        margin: '20px 0px 0px 0px',
        parent
    });

    viewContainer.add();

    const requestAssistanceInfo = RequestAssitanceInfo({
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

/**
 * 
 */
export async function Unauthorized() {
    const parent = Store.get('maincontainer');

    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `403`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const alertBanner = Alert({
        type: 'warning',
        text: `Sorry! You don't have access to this page. Please select a different option from the menu on the left.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}

/**
 * 
 */
export async function Missing() {
    const parent = Store.get('maincontainer');

    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `404`,
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    const alertBanner = Alert({
        type: 'info',
        text: `Sorry! That page doesn't appear to exist. Please choose an option from the sidebar on the left.`,
        parent,
        margin: '20px 0px 0px 0px'
    });

    alertBanner.add();
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function Users(param = {}) {
    const {
        itemId
    } = param;

    /** Authorize */
    const isAuthorized = Authorize('Users');

    if (!isAuthorized) {
        return;
    }

    const parent = Store.get('maincontainer');

    const viewTitle = Title({
        title: App.get('title'),
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

    const card = Card({
        title: '',
        titleColor: App.get('primaryColor'),
        padding: '20px',
        margin: '20px 0px',
        width: '100%',
        parent
    });

    card.add();

    const container = Container({
        width: '100%',
        direction: 'column',
        padding: '0px 0px 0px 0px',
        parent: card
    });

    container.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading Users',
        margin: '40px 0px',
        parent: container
    });
    
    loadingIndicator.add();
    
    const usersTable = Table({
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
        items: await Get({
            list: 'Users'
        }),
        checkboxes: true,
        addButton: true,
        addButtonValue: 'Add user',
        editForm: EditUser,
        newForm: NewUser,
        parent: container
    });

    // const usersTable = DataTable({
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
    //     data: await Get({
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
    //                 const userModal = Modal({
    //                     title: `New User`,
    //                     async addContent(modalBody) {
    //                         userForm = await NewUser({
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

    //                                         messageValid = Alert({
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
    //                                         const userItem = await Get({
    //                                             list: 'Users',
    //                                             select: 'Id,Account',
    //                                             filter: `Account eq '${Account}'`
    //                                         });
                            
    //                                         if (userItem[0]) {
    //                                             if (messageExists) {
    //                                                 messageExists.remove();
    //                                             }

    //                                             const link = `${location.href.split('#')[0]}#Users/${userItem[0].Id}`

    //                                             messageExists = Alert({
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
    //                                     const newItem = await CreateItem({
    //                                         list: 'Users',
    //                                         data
    //                                     });

    //                                     /** Craete AllowedSwitchGroups items */
    //                                     const groups = userForm.getAllowedGroups();

    //                                     await Promise.all(groups.map(Group => {
    //                                         return CreateItem({
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
    //         const eventModal = Modal({
    //             title,
    //             async addContent(modal) {
    //                 userForm = await EditUser({
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
    //                                 await DeleteItem({
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
    //                                 updatedItem = await UpdateItem({
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
    //                                         return CreateItem({
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
    //                                         return DeleteItem({
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

/**
 * 
 */
export async function Settings() {
    const parent = Store.get('maincontainer');

    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Settings`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    AccountInfo({
        parent
    });

    /** Authorize */
    if (Store.user().Role === 'Developer') {
        DeveloperLinks({
            parent
        });
    }

    ReleaseNotes({
        parent
    });

    /** Authorize */
    if (Store.user().Role === 'Developer') {
        SiteUsage({
            parent
        });
    }
}

/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function Developer(param) {
    /** Authorize */
    const isAuthorized = Authorize('Users');

    if (!isAuthorized) {
        return;
    }
    
    /** View Parent */
    const parent = Store.get('maincontainer');
    
    /** View Title */
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: 'Developer',
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** Alert Message */
    const alertMessage = Alert({
        type: 'warning',
        text: /*html*/ `
            <h5 class="alert-heading">Developers, please read before making changes!</h5>
            <p style='font-size: .9em;'>Actions performed here may affect the QPP application for all users. Some or all changes may not be reversible.</p>
            <hr>
            <p class="mb-0" style='font-size: .9em;'>Please proceed with extreme caution.</p>
        `,
        margin: '20px 0px',
        width: '100%',
        parent
    });

    alertMessage.add();

    /** Log */
    const logCard = Card({
        title: 'Logs',
        description: '',
        titleColor: App.get('primaryColor'),
        padding: '20px',
        margin: '20px 0px',
        width: '100%',
        parent
    });

    logCard.add();

    const logContainer = Container({
        width: '100%',
        direction: 'column',
        padding: '20px 0px',
        parent: logCard
    });

    logContainer.add();

    const logLoadingIndicator = FoldingCube({
        label: 'Loading data',
        margin: '40px 0px',
        parent: logContainer
    });
        
    logLoadingIndicator.add();

    const log = await Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        top: '25',
        // skip: '0',
        // paged: true
    });

    console.log(log);

    const logTable = Table({
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id'
            },
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Title',
                displayName: 'Type'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ],
        buttons: [
            
        ],
        showId: true,
        addButton: false,
        checkboxes: false,
        formTitleField: 'Id',
        order: [[ 0, 'desc' ]],
        items: log,
        editForm: LogForm,
        editFormTitle: 'Log',
        parent: logContainer
    });

    logLoadingIndicator.remove();

    /** Errors */
    const errorsCard = Card({
        title: 'Errors',
        description: '',
        titleColor: App.get('primaryColor'),
        padding: '20px',
        margin: '20px 0px',
        width: '100%',
        parent
    });

    errorsCard.add();

    const errorsContainer = Container({
        width: '100%',
        direction: 'column',
        padding: '20px 0px',
        parent: errorsCard
    });

    errorsContainer.add();

    const errorsLoadingIndicator = FoldingCube({
        label: 'Loading data',
        margin: '40px 0px',
        parent: errorsContainer
    });
        
    errorsLoadingIndicator.add();

    const errors = await Get({
        list: 'Errors',
        select: 'Id,Message,Error,Source,Line,ColumnNumber,SessionId,Status,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        top: '25'
    });

    const errorsTable = Table({
        fields: [
            {
                internalFieldName: 'Id',
                displayName: 'Id'
            },
            {
                internalFieldName: 'SessionId',
                displayName: 'SessionId'
            },
            {
                internalFieldName: 'Created',
                displayName: 'Created'
            },
            {
                internalFieldName: 'Author',
                displayName: 'Author'
            }
        ],
        showId: true,
        addButton: false,
        checkboxes: false,
        formFooter: false,
        formTitleField: 'Id',
        order: [[ 0, 'desc' ]],
        items: errors,
        editForm: ErrorForm,
        editFormTitle: 'Error',
        parent: errorsContainer
    });

    errorsLoadingIndicator.remove();

    /** Data Loading Indicator */
    const dataLoadingIndicator = FoldingCube({
        label: 'Loading data',
        margin: '40px 0px',
        parent
    });
        
    dataLoadingIndicator.add();

    // const items = await Get({
    //     list: '[LIST NAME]'
    // });
    
    // console.log(items);

    /** Alert Message */
    const loadingMessage = Alert({
        type: 'success',
        text: /*html*/ `
            Data loaded
        `,
        margin: '20px 0px',
        width: '100%',
        parent
    });

    loadingMessage.add();
    
    /** Remove loading indicator */
    dataLoadingIndicator.remove();

    /** Toggle update */
    let run = false;

    /** Update clock and buttons */
    const timer = Timer({
        parent,
        start() {
            run = true;
            console.log(`Run: ${run}`);

            update();
        },
        stop() {
            run = false;
            console.log(`Run: ${run}`);
        },
        reset() {
            console.log('reset');
        }
    });

    timer.add();

    async function update() {
        /** Set items */
        for (const [index, value] of items.entries()) {
            if (run) {
                const {
                    Id,
                    Title,
                } = value;

                const newItem = await CreateItem({
                    list: 'FacilityPlans',
                    data: {
                        Status: 'Completed',
                        DMISIDId: Id,
                        FiscalYearId: 7
                    }
                });

                console.log(`Id: ${newItem.Id} Facility: ${Title} created.`);
                
                if (index === items.length - 1) {
                    timer.stop();
                }
            } else {
                console.log('stoped');
                
                break;
            }
        }
    }

    /** Test Attach Files Button */
    const attachFilesButton = UploadButton({
        async action(files) {
            console.log(files);

            const uploadedFiles = await AttachFiles({
                list: 'View_Home',
                id: 1,
                files
            });

            console.log(uploadedFiles);
        },
        parent,
        type: 'btn-outline-success',
        value: 'Attach file',
        margin: '20px 0px 20px 0px'
    });

    attachFilesButton.add();

    /** Test Send Email */
    const sendEmailButton = BootstrapButton({
        async action(event) {
            await SendEmail({
                From: 'i:0e.t|dod_adfs_provider|1098035555@mil',
                To: 'i:0e.t|dod_adfs_provider|1098035555@mil',
                // CC: [
                //     ''
                // ],
                Subject: `Test Subject`,
                /** @todo replace hard codeded domain */
                Body: /*html*/ `
                    <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
                        <p>
                            Test body.
                        </p>
                    </div>
                `
            });
        },
        parent,
        type: 'btn-outline-success',
        value: 'Send Email',
        margin: '0px 0px 0px 20px'
    });

    sendEmailButton.add();
    
    /** Open modal */
    if (param.pathParts.length === 3) {
        const {
            pathParts
        } = param;

        const table = pathParts[1];
        const itemId = parseInt(pathParts[2]);

        let row;

        if (table === 'Errors') {
            row = errorsTable.findRowById(itemId);
        } else if (table === 'Logs') {
            row = logTable.findRowById(itemId);
        }
        
        if (row) {
            row.show().draw(false).node()?.click();
        }
    }
}

/**
 * 
 */
export async function Questions() {
    /** View Parent */
    const parent = Store.get('maincontainer');

    /** View Title */
    const viewTitle = Title({
        title: App.get('title'),
        subTitle: `Questions`,
        parent,
        date: new Date().toLocaleString('en-US', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** View Container */
    const viewContainer = Container({
        display: 'inline-flex',
        direction: 'column',
        margin: '20px 0px 0px 0px',
        parent
    });

    viewContainer.add();

    /** Check local storage for questionTypes */
    let questionTypes = JSON.parse(localStorage.getItem(`${App.get('title').split(' ').join('-')}-questionTypes`));

    if (!questionTypes) {
        console.log('questionTypes not in local storage. Adding...');

        const questionTypesResponse = await Get({
            list: 'View_Questions',
            filter: `Title eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('title').split(' ').join('-')}-questionTypes`, JSON.stringify(questionTypesResponse[0].Value));
        questionTypes = JSON.parse(localStorage.getItem(`${App.get('title').split(' ').join('-')}-questionTypes`));

        console.log('questionTypes added to local storage.');
    }

    questionTypes.forEach(type => {
        const {
            title,
            path
        } = type;

        const card = Card({
            title,
            description: '',
            parent: viewContainer,
            margin: '0px 0px 20px 0px',
            width: '100%'
        });

        card.add();
    });

    // const qppQuestions = QuestionTypes({
    //     parent: viewContainer
    // });

    // qppQuestions.add();
}

/**
 * 
 * @param {*} param 
 */
export async function QuestionsBoard(param) {
    const {
        path
    } = param;

    /** View Parent */
    const parent = Store.get('maincontainer');

    /** View Title */
    let viewTitle;
    let currentType;

    /** Check local storage for questionTypes */
    let questionTypes = localStorage.getItem(`${App.get('title').split(' ').join('-')}-questionTypes`);

    if (questionTypes) {
        console.log('Found questionTypes in local storage.');

       setTitle(questionTypes);
    } else {
        console.log('questionTypes not in local storage. Adding...');

        /** Set temporary title  */
        viewTitle = Title({
            title: App.get('title'),
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions'
                },
                {
                    label: /*html*/ `
                        <div class='spinner-grow text-primary' role='status'>
                            <span class='sr-only'>Loading...</span>
                        </div>
                    `,
                    path: '',
                    currentPage: true
                }
            ],
            parent,
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();

        const questionTypesResponse = await Get({
            list: 'View_Questions',
            filter: `Title eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('title').split(' ').join('-')}-questionTypes`, JSON.stringify(questionTypesResponse[0].Value));

        console.log('questionTypes added to local storage.');
        
        setTitle(localStorage.getItem(`${App.get('title').split(' ').join('-')}-questionTypes`))
    }
    
    function setTitle(items) {
        /** If View Tile exists, remove from DOM */
        if (viewTitle) {
            viewTitle.remove();
        }
        
        /** Parse types */
        const types = JSON.parse(items);

        /** Find question type from passed in path */
        currentType = types.find(item => item.path === path);
        
        /** Set new title with drop down options */
        viewTitle = Title({
            title: App.get('title'),
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions',
                }
            ],
            dropdownGroups: [
                {
                    name: currentType.title,
                    items: types
                    //.filter(item => item.path !== path) /** filter out current selection */
                    .map(facility => {
                        const {
                            title,
                            path
                        } = facility;
            
                        return {
                            label: title,
                            path: `Questions/${path}`
                        };
                    })
                }
            ],
            route(path) {
                Route(path);
            },
            parent,
            position: 'afterbegin',
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();
    }

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px',
        parent
    });

    viewContainer.add();

    /** New Question Form */
    let newQuestionForm;

    /** Toolbar */
    const qppQuestionsToolbar = QuestionsToolbar({
        selected: 'All',
        onFilter(filter) {
            console.log(filter);

            /** param */
            const param = {
                path,
                parent: questionsContainer
            };

            const questions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            switch (filter) {
                case 'All':
                    param.questions = questions;
                    break;
                case 'Mine':
                    param.questions = questions.filter(question => {
                        // console.log(question.Author.Title, Store.user().Title);

                        return question.Author.Title === Store.user().Title;
                    });
                    break;
                case 'Unanswered':
                    param.questions = questions.filter(question => {
                        // console.log(question.replies);

                        return question.replies.length === 0;
                    });
                    break;
                case 'Answered':
                    param.questions = questions.filter(question => {
                        // console.log(question.replies);

                        return question.replies.length !== 0;
                    });
                    break;
                case 'Featured':
                    param.questions = questions.filter(question => {
                        // console.log(question.Featured);

                        return question.Featured;
                    });
                    break;
                default:
                    break;
            }

            /** Add new list of cards */
            questionCards = QuestionCards(param);
        },
        onSearch(query) {
            console.log('query: ', query);

            const questions = Store.get('Model_Questions').filter(question => question.QuestionType === path);

            const filteredQuestions = questions.filter(question => {
                const {
                    Title,
                    Body,
                    Author,
                    Created
                } = question;

                const date = `${new Date(Created).toLocaleDateString()} ${new Date(Created).toLocaleTimeString('default', {
                    hour: 'numeric',
                    minute: 'numeric'
                })}`.toLowerCase();

                if (Title.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Title: ${Title}.`);
                    
                    return question;
                } else if (Body && Body.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Body: ${Body}.`);
                    
                    return question;
                } else if (Author.Title.toLowerCase().includes(query)) {
                    console.log(`SEARCH - Found in Author name: ${Author.Title}.`);
                    
                    return question;
                } else if (date.includes(query)) {
                    console.log(`SEARCH - Found in Created date: ${date}.`);
                    
                    return question;
                }
            });

            /** Add new list of cards */
            questionCards = QuestionCards({
                path,
                questions: filteredQuestions,
                parent: questionsContainer
            });
        },
        onClear(event) {
            console.log(event);

            /** Add new list of cards */
            questionCards = QuestionCards({
                path,
                questions,
                parent: questionsContainer
            });
        },
        onAsk() {
            const modal = Modal({
                title: 'Ask a question',
                showFooter: true,
                background: App.get('secondaryColor'),
                addContent(modalBody) {
                    newQuestionForm = NewQuestion({
                        parent: modalBody,
                        modal
                    });
                },
                buttons: {
                    footer: [
                        {
                            value: 'Cancel',
                            classes: 'btn-secondary',
                            data: [
                                {
                                    name: 'dismiss',
                                    value: 'modal'
                                }
                            ]
                        },
                        {
                            value: 'Submit',
                            classes: 'btn-success',
                            disabled: true,
                            async onClick(event) {
                                /** Disable button */
                                event.target.disabled = true;
                                event.target.innerHTML = /*html*/ `
                                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting
                                `;

                                const fieldValues = newQuestionForm.getFieldValues();

                                fieldValues.ParentId = 0;
                                fieldValues.QuestionType = path;
                                
                                /** Create Question */
                                const newItem = await CreateItem({
                                    list: 'Questions',
                                    data: fieldValues
                                });

                                /** Set QuestionId */
                                const updatedItem = await UpdateItem({
                                    list: 'Questions',
                                    select: 'Id,Title,Body,Created,ParentId,QuestionId,QuestionType,Featured,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title',
                                    expand: `Author/Id,Editor/Id`,
                                    itemId: newItem.Id,
                                    data: {
                                        QuestionId: newItem.Id
                                    }
                                });

                                console.log(Store.get('Model_Questions'));

                                const question = M_Question({
                                    question: updatedItem
                                });

                                Store.get('Model_Questions').push(question);

                                console.log(Store.get('Model_Questions'));

                                /** Add new quesiton card to DOM */
                                questionCards.addCard(question);

                                /** Completed */
                                event.target.disabled = false;
                                event.target.innerHTML = 'Submitted!';

                                /** close and remove modal */
                                modal.getModal().modal('hide');
                            }
                        }
                    ]
                },
                parent
            });
    
            modal.add();
        },
        parent: viewContainer
    });

    qppQuestionsToolbar.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading Questions',
        margin: '40px 0px',
        parent: viewContainer
    });
    
    loadingIndicator.add();

    /** Questions Container */
    const questionsContainer = Container({
        display: 'flex',
        direction: 'column',
        width: 'fit-content',
        margin: '30px 0px',
        parent: viewContainer
    });

    questionsContainer.add();

    let questions = Store.get('Model_Questions');

    if (questions) {
        console.log('Model_Questions found.');

        questions = questions.filter(question => question.QuestionType === path);
    } else {
        console.log('Model_Questions missing. Fetching...');

        const fetchedQuestions = await M_Questions({
            // filter: `QuestionType eq '${path}'`
        });

        questions = fetchedQuestions.filter(question => question.QuestionType === path);
        
        console.log('Model_Questions stored.');
    }

    /** Add all question cards to DOM */
    let questionCards = QuestionCards({
        path,
        questions,
        parent: questionsContainer
    });

    /** Remove Loading Indicator */
    loadingIndicator.remove();
}

/**
 * 
 * @param {*} param 
 */
export async function Question(param) {
    const {
        path,
        itemId
    } = param;

    /** View Parent */
    const parent = Store.get('maincontainer');

    /** View Title */
    let viewTitle;

    /** Check local storage for questionTypes */
    let questionTypes = localStorage.getItem(`${App.get('title').split(' ').join('-')}questionTypes`);

    if (questionTypes) {
        console.log('Found questionTypes in local storage.');

       setTitle(questionTypes);
    } else {
        console.log('questionTypes not in local storage. Adding...');

        /** Set temporary title  */
        viewTitle = Title({
            title: App.get('title'),
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions'
                },
                {
                    label: /*html*/ `
                        <div class='spinner-grow text-primary' role='status'>
                            <span class='sr-only'>Loading...</span>
                        </div>
                    `,
                    path: '',
                    currentPage: true
                }
            ],
            parent,
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();

        const questionTypesResponse = await Get({
            list: 'View_Questions',
            filter: `Title eq 'QuestionTypes'`
        });

        localStorage.setItem(`${App.get('title').split(' ').join('-')}questionTypes`, questionTypesResponse[0].Value);

        console.log('questionTypes added to local storage.');
        
        setTitle(localStorage.getItem(`${App.get('title').split(' ').join('-')}questionTypes`))
    }
    
    function setTitle(items) {
        /** If View Tile exists, remove from DOM */
        if (viewTitle) {
            viewTitle.remove();
        }
        
        /** Parse types */
        const types = JSON.parse(items);

        /** Find question type from passed in path */
        const currentType = types.find(item => item.path === path);
        
        /** Set new title with drop down options */
        viewTitle = Title({
            title: App.get('title'),
            breadcrumb: [
                {
                    label: 'Questions',
                    path: 'Questions',
                }
            ],
            dropdownGroups: [
                {
                    name: currentType.title,
                    items: types.map(facility => {
                        const {
                            title,
                            path
                        } = facility;
            
                        return {
                            label: title,
                            path: `Questions/${path}`
                        };
                    })
                },
                {
                    name:  /*html*/ `
                        <span class='spinner-grow text-primary' role='status'>
                            <span class='sr-only'>Loading...</span>
                        </span>
                    `,
                    dataName: 'loading-questions',
                    items: []
                }
            ],
            route(path) {
                Route(path);
            },
            parent,
            position: 'afterbegin',
            date: new Date().toLocaleString('en-US', {
                dateStyle: 'full'
            }),
            type: 'across'
        });

        viewTitle.add();
    }

    /** View Container */
    const viewContainer = Container({
        display: 'block',
        margin: '30px 0px',
        maxWidth: '800px',
        parent
    });

    viewContainer.add();

    /** Loading Indicator */
    const loadingIndicator = FoldingCube({
        label: 'Loading Question',
        margin: '40px 0px',
        parent: viewContainer
    });
    
    loadingIndicator.add();

    let questions = Store.get('Model_Questions');

    if (questions) {
        console.log('Model_Questions found.');

        questions = questions.filter(question => question.QuestionType === path);
    } else {
        console.log('Model_Questions missing. Fetching...');

        const fetchedQuestions = await M_Questions({
            // filter: `QuestionType eq '${path}'`
        });

        questions = fetchedQuestions.filter(question => question.QuestionType === path);
        
        console.log('Model_Questions stored.');
    }

    const question = questions.find(question => question.Id === itemId);

    viewTitle.updateDropdown({
        name: 'loading-questions',
        replaceWith: {
            name: question.Title,
            dataName: question.Id,
            items: questions
            //.filter(question => question.Id !== itemId) /** filter out current question */
            .map(question => {
                const {
                    Id,
                    Title
                } = question;

                return {
                    label: Title,
                    path: `Questions/${path}/${Id}`
                }
            })
        }
    });

    /** Question */
    VP_Question({
        question,
        parent: viewContainer
    });
    
    /** Remove Loading Indicator */
    loadingIndicator.remove();
}
