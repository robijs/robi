/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_DeleteItem from '../Actions/Action_DeleteItem.js'
import Action_CreateICS from '../Actions/Action_CreateICS.js'
import Action_SendEmail from '../Actions/Action_SendEmail.js'
import Action_UploadFiles from '../Actions/Action_UploadFiles.js'

/* Components */
import Component_Container from '../Components/Component_Container.js'
import Component_FormButton from '../Components/Component_FormButton.js'
import Component_MultiLineTextField from '../Components/Component_MultiLineTextField.js'
import Component_Files from '../Components/Component_Files.js'
import Component_TasksList from '../Components/Component_TasksLists.js'

/** View Parts */
import ViewPart_Comments from './ViewPart_Comments.js'

export default async function ViewPart_MeetingForm(param) {
    const {
        parent
    } = param;

    let {
        item
    } = param;

    const {
        Id
    } = item;

    /** Agenda */
    const agendaField = Component_MultiLineTextField({
        label: 'Agenda',
        labelSize: '1.5em',
        fieldMargin: '0px',
        readOnly: App.user.Group === 'Facilitator' ? false : true,
        value: item.Agenda,
        placeHolder: `None`,
        parent,
        async onFocusout(event) {
            /** Update Agenda */
            const updatedItem = await Action_UpdateItem({
                list: 'AcceptedEvents',
                itemId: Id,
                data: {
                    Agenda: agendaField.value()
                }
            });

            /** Replace local item */
            item = updatedItem;
        }
    });

    agendaField.add();

    /** Notes */
    const notesField = Component_MultiLineTextField({
        label: 'Notes',
        labelSize: '1.5em',
        fieldMargin: '0px',
        readOnly: App.user.Group === 'Facilitator' ? false : true,
        minHeight: '200px',
        value: item.Notes,
        placeHolder: `None`,
        parent,
        async onFocusout(event) {
            /** Update Agenda */
            const updatedItem = await Action_UpdateItem({
                list: 'AcceptedEvents',
                itemId: Id,
                data: {
                    Notes: notesField.value()
                }
            });

            /** Replace local item */
            item = updatedItem;
        }
    });

    notesField.add();

    /** Files */
    const select = 'Id,FK_AcceptedEventId,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,File/Name';
    const expand = 'Author/Id,Editor/Id,File';

    const files = await Action_Get({
        list: 'EventDocuments',
        select,
        expand,
        filter: `FK_AcceptedEventId eq ${Id}`
    });

    const field_Files = Component_Files({
        label: 'Files',
        labelSize: '1.5em',
        list: 'EventDocuments',
        files: files.map(file => formatFile(file)),
        parent,
        remove: App.user.Group === 'Facilitator' ? true : false,
        async onAdd(files) {
            /** Upload files */
            const uploadedFiles = await Action_UploadFiles({
                files,
                site: '/apps/ippscs',
                list: 'EventDocuments',
                select,
                expand
            });

            /** Update FK_AcceptedEventId field */
            for (let file in uploadedFiles) {
                const updatedItem = await Action_UpdateItem({
                    list: 'EventDocuments',
                    itemId: uploadedFiles[file].Id,
                    data: {
                        FK_AcceptedEventId: Id
                    },
                    select,
                    expand
                });

                field_Files.addFile(formatFile(updatedItem));
            }
        }
    });

    field_Files.add();

    function formatFile(file) {
        return {
            id: file.Id,
            name: file.File.Name,
            created: new Date(file.Created).toLocaleDateString(),
            author: file.Author.Title,
            authorAccount: file.Author.Name.split('\\')[1],
            modified: new Date(file.Modified).toLocaleDateString(),
            editor: file.Editor.Title,
            uri: file.__metadata.uri
        }
    }

    /** Tasks */
    /** @todo pull in samepage tasks UI */
    /** @todo add delete tasks item */

    // id,
    // value,
    // checked,
    // CompletedBy,
    // CompletedDate

    const tasks = await Action_Get({
        list: 'Tasks',
        select: 'Id,Task,Done,Completed,CompletedBy',
        filter: `ParentId eq '${Id}'`
    });

    console.log(tasks);

    const tasksListField = Component_TasksList({
        label: 'Tasks',
        labelSize: '1.5em',
        options: [
            {
                title: '',
                items: tasks.map(task => {
                    const {
                        Id,
                        Task,
                        Done,
                        Completed,
                        CompletedBy
                    } = task;
        
                    return {
                        id: Id,
                        value: Task,
                        checked: Done,
                        Completed,
                        CompletedBy
                    }
                }),
            }
        ],
        async onCheck(event) {
            await Action_UpdateItem({
                list: 'Tasks',
                itemId: parseInt(event.target.dataset.itemid),
                data: {
                    Done: event.target.checked,
                    Completed: new Date().toISOString(),
                    CompletedBy: App.user.Account
                },
                notify: false
            });
        },
        async onAddNewItem(event) {
            const Task = event.target.innerText;

            if (Task) {
                const newItem = await Action_CreateItem({
                    list: 'Tasks',
                    data: {
                        ParentId: Id,
                        Task
                    },
                    notify: false
                });

                /** Add item to UI */
                tasksListField.addItemAbove({
                    group: '',
                    itemToAdd: {
                        id: newItem.Id,
                        value: newItem.Task,
                    },
                    item: event.target
                });
            }
        },
        async onDelete(itemId) {
            await Action_DeleteItem({
                list: 'Tasks',
                itemId,
                notify: false
            });
        },
        parent
    });

    tasksListField.add();

    /** Button Container */
    const buttonContainer = Component_Container({
        parent,
        position: 'beforeend',
        width: '100%',
        justify: 'flex-start',
        margin: '40px 0px 20px 0px'
    });

    buttonContainer.add();

    /** Cancel Button */
    const cancelButton = Component_FormButton({
        value: 'Go back to Meetings',
        type: 'cancel',
        parent: buttonContainer,
        async action() {
            App.route('Meetings');
        }
    });

    cancelButton.add();

    /** Add to calendar button - downloads last created ICS file */
    const addToCalendarButton = Component_FormButton({
        value: 'Add to calendar',
        type: 'normal',
        parent: buttonContainer,
        async action() {
            const attachemnts = item.AttachmentFiles.results;
            const iframe = document.createElement('iframe');

            iframe.style.display = 'none';
            iframe.src = `${App.webApp}${attachemnts[attachemnts.length - 1].ServerRelativeUrl}`;

            document.body.appendChild(iframe);
        }
    });

    addToCalendarButton.add();

    /** Send email Button */
    const sendEmailButton = Component_FormButton({
        value: `Email ${App.user.Group === 'Facilitator' ? `${item.FK_Group} - ${item.FK_Command}`: 'facilitator'}`,
        type: 'normal',
        parent: buttonContainer,
        async action() {
            const meetingTime = `${new Date(item.EventDate).toLocaleString('default', {
                dateStyle: 'full'
            })} from ${new Date(item.EventDate).toLocaleTimeString('default', {
                timeStyle: 'short'
            })} to ${new Date(item.EndDate).toLocaleTimeString('default', {
                timeStyle: 'short'
            })}`;
            const users = await Action_Get({
                list: 'Users',
                select: 'Email',
                filter: App.user.Group === 'Facilitator' ? `Group eq '${item.FK_Group}' and Command eq '${item.FK_Command}'` : `Group eq 'Facilitator'`
            });
            const emails = users.map(item => item.Email);
            const newLine = '%0D%0A';
            const groupCommand = `${item.FK_Group} (${item.FK_Command})`;
            const notice = `${newLine}${newLine}_____________________________________________________________________________________________________________________________________${newLine}`;
            const meetingLink = `Meeting details: ${location.href.split('#')[0]}#Meetings/${item.Id}`;
            const salutation = App.user.Group === 'Facilitator' ? '- Conference Scheduler Facilitators' : `- ${groupCommand}`;

            /** 
             * {@link https://tools.ietf.org/html/rfc6068} 
             * 
             * RFC 6068 specifies comma (,) as valid email separator.
             * However, Outlook won't accept this. Semicolons w/ or w/o spaces seem to work.
             * 
             * {@link https://stackoverflow.com/a/22765878}
             * Link break - use %0D%0A  instead of \n or <br>
             */
            location.href = `mailto:${emails.join(';')}&subject=${groupCommand} | ${meetingTime}&body=${notice}${newLine}${meetingLink}${newLine}${newLine}${salutation}`
        }
    });

    sendEmailButton.add();
    
    /** Comments */
    ViewPart_Comments({
        parentId: Id,
        parent: buttonContainer,
        position: 'beforebegin'
    });
}
