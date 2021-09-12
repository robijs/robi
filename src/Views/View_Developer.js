

/** Actions */
import Action_Authorize from '../Actions/Action_Authorize.js'
import Action_Get from '../Actions/Action_Get.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_Store from '../Actions/Action_Store.js'
import Action_Route from '../Actions/Action_Route.js'
import Action_AttachFiles from '../Actions/Action_AttachFiles.js'
import Action_UploadFiles from '../Actions/Action_UploadFiles.js'
import Action_SendEmail from '../Actions/Action_SendEmail.js'
// import Action_GetADUsers from '../Actions/Action_GetADUsers.js'

/** Components */
import Component_Title from '../Components/Component_Title.js'
import Component_DashboardBanner from '../Components/Component_DashboardBanner.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_Heading from '../Components/Component_Heading.js'
import Component_Timer from '../Components/Component_Timer.js'
import Component_DataTable from '../Components/Component_DataTable.js'
import Component_Card from '../Components/Component_Card.js'
import Component_Container from '../Components/Component_Container.js'
import Component_BootstrapButton from '../Components/Component_BootstrapButton.js'
import Component_UploadButton from '../Components/Component_UploadButton.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** View Parts */
import ViewPart_Table from '../ViewParts/ViewPart_Table.js'
import ViewPart_ErrorForm from '../ViewParts/ViewPart_ErrorForm.js'
import ViewPart_LogForm from '../ViewParts/ViewPart_LogForm.js'

export default async function View_Developer(param) {
    /** Authorize */
    const isAuthorized = Action_Authorize('Users');

    if (!isAuthorized) {
        return;
    }
    
    /** View Parent */
    const parent = Action_Store.get('maincontainer');
    
    /** View Title */
    const viewTitle = Component_Title({
        title: Setting_App.title,
        subTitle: 'Developer',
        parent,
        date: new Date().toLocaleString('default', {
            dateStyle: 'full'
        }),
        type: 'across'
    });

    viewTitle.add();

    /** Alert Message */
    const alertMessage = Component_Alert({
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
    const logCard = Component_Card({
        title: 'Logs',
        description: '',
        titleColor: Setting_App.get('primaryColor'),
        padding: '20px',
        margin: '20px 0px',
        width: '100%',
        parent
    });

    logCard.add();

    const logContainer = Component_Container({
        width: '100%',
        direction: 'column',
        padding: '20px 0px',
        parent: logCard
    });

    logContainer.add();

    const logLoadingIndicator = Component_FoldingCube({
        label: 'Loading data',
        margin: '40px 0px',
        parent: logContainer
    });
        
    logLoadingIndicator.add();

    const log = await Action_Get({
        list: 'Log',
        select: 'Id,Title,Message,Module,StackTrace,SessionId,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        top: '25',
        // skip: '0',
        // paged: true
    });

    console.log(log);

    const logTable = ViewPart_Table({
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
        editForm: ViewPart_LogForm,
        editFormTitle: 'Log',
        parent: logContainer
    });

    logLoadingIndicator.remove();

    /** Errors */
    const errorsCard = Component_Card({
        title: 'Errors',
        description: '',
        titleColor: Setting_App.get('primaryColor'),
        padding: '20px',
        margin: '20px 0px',
        width: '100%',
        parent
    });

    errorsCard.add();

    const errorsContainer = Component_Container({
        width: '100%',
        direction: 'column',
        padding: '20px 0px',
        parent: errorsCard
    });

    errorsContainer.add();

    const errorsLoadingIndicator = Component_FoldingCube({
        label: 'Loading data',
        margin: '40px 0px',
        parent: errorsContainer
    });
        
    errorsLoadingIndicator.add();

    const errors = await Action_Get({
        list: 'Errors',
        select: 'Id,Message,Error,Source,Line,ColumnNumber,SessionId,Status,Created,Author/Title',
        expand: 'Author/Id',
        orderby: 'Id desc',
        top: '25'
    });

    const errorsTable = ViewPart_Table({
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
        editForm: ViewPart_ErrorForm,
        editFormTitle: 'Error',
        parent: errorsContainer
    });

    errorsLoadingIndicator.remove();

    /** Data Loading Indicator */
    const dataLoadingIndicator = Component_FoldingCube({
        label: 'Loading data',
        margin: '40px 0px',
        parent
    });
        
    dataLoadingIndicator.add();

    // const items = await Action_Get({
    //     list: '[LIST NAME]'
    // });
    
    // console.log(items);

    /** Alert Message */
    const loadingMessage = Component_Alert({
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
    const timer = Component_Timer({
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

                const newItem = await Action_CreateItem({
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
    const attachFilesButton = Component_UploadButton({
        async action(files) {
            console.log(files);

            const uploadedFiles = await Action_AttachFiles({
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
    const sendEmailButton = Component_BootstrapButton({
        async action(event) {
            await Action_SendEmail({
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
