/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_Store from '../Actions/Action_Store.js'

/** Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_Card from '../Components/Component_Card.js'
import Component_Container from '../Components/Component_Container.js'
/** NOTE: This seems to create a new modal element each time it is called; @author Wilfredo Pacheco 20210817 */
import Component_Modal from '../Components/Component_Modal.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** View Parts */
import ViewPart_Table from './ViewPart_Table.js'
// import ViewPart_HSDEnrollmentNewForm from './ViewPart_HSDEnrollmentNewForm.js'
// import ViewPart_HSDEnrollmentEditForm from './ViewPart_HSDEnrollmentEditForm.js'

/** Moved form to seperate module; @author Wilfredo Pacheco 20210817 */
import ShowForm from './Form.HSDEnrollment.js'

export default async function View_HSDEnrollementTable(param) {
    const {
        parent,
        facility
    } = param;
    
    var isStatusComplete = false; // Handles create and edit funtionality for enrollment table;
    const FacilitySelected = document.FacilitySelected = facility
    const FacilityValue = document.FacilityValue
    const StartYearValue = FacilityValue.props.fy.split('-')[0]
    const EndYearValue = FacilityValue.props.fy.split('-')[1]
    
    /** Set the FiscalYearValue to reference @author Wilfredo Pacheco 20210823 */
    const FiscalYearValue = document.FiscalYearValue = Action_Store.get('Fiscal Years').find(year => year.Title === EndYearValue)

    try {
        const HSDSectionStepData = document.Sections.find(section => section.name === 'Health Services Delivery')
        // Sets the complete value preventing edits;
        if ( HSDSectionStepData && HSDSectionStepData.status === 'complete' ){ isStatusComplete = true; }
    }
    catch(e) { console.info(e) }

    /** Card */
    const card = Component_Card({ // FIXME: The period (Month YYYY - Month YYYY) string should be defined;
        title: /*html*/ `
            <div>Enrollment</div>
            <div style='font-size: .8em; font-weight: 400;'><em>Estimate based on sum from period (Month ${StartYearValue} - Month ${EndYearValue})</em></div>
        `,
        description: '',
        titleColor: Setting_App.primaryColor,
        padding: '20px',
        margin: '20px 0px',
        width: '100%',
        parent
    });

    card.add();

    /** Container */
    const container = Component_Container({
        width: '100%',
        direction: 'column',
        padding: '20px 0px',
        // overflowX: 'overlay',
        parent: card
    });

    container.add();

    /** Loading Indicator ****************************************************/
    const loadingIndicator = Component_FoldingCube({
        label: 'Loading MTF Enrollment data',
        margin: '40px 0px',
        parent: container
    });
    
    loadingIndicator.add();

    /** Get FiscalYear */
    const sessionYear = sessionStorage.getItem('fiscalYear')?.split('-')[0];

    /** @todo this should already be in session storage */
    const fiscalYear = await Action_Get({
        list: 'Fiscal Years',
        filter: `Title eq '${sessionYear}'`
    });

    /** Get Enrollment data */
    const items = await Action_Get({
        list: 'FacilityHSDEnrollment',
        filter: `DMISID eq ${facility.Id} and FiscalYear eq ${fiscalYear[0]?.Id}`
    });

    const ReclamaData = await Action_Get({
        list: 'FacilityHSDEnrollmentReclama',
        filter: `DMISID/Id eq ${facility.Id} and FiscalYear/Id eq ${FiscalYearValue.Id}`
    });

    const ReclamaExists = ReclamaData.length > 0

    const fields = [
        'ADStatus',
        'Gender',
        'AgeGroup',
        'Forecast',
        'Adjusted'
    ].join(',');

    const EnrollmentTableEl = ViewPart_Table({
        heading: '',
        headingColor: 'mediumslateblue',
        headingSize: '1.3em',
        fields, // Table Headers;
        items, // Array of data;
        checkboxes: false,
        parent: container,
        // newForm: ViewPart_HSDEnrollmentNewForm,
        newForm: ShowForm, /** New Form used with required business rules; @author Wilfredo Pacheco */
        // editForm: ViewPart_HSDEnrollmentEditForm,
    });

    /** Start multi select of table item event; */
    const Table = $(EnrollmentTableEl.get())
    const AddButton = Array.from(Table.DataTable().data().buttons())[0].node
    const EditButton = document.createElement('button')
    const ClearButton = document.createElement('button')
    AddButton.querySelector('span').innerText = 'Create Reclama' // Rename button from default string 'Add';
    // AddButton.setAttribute('style', 'margin-right:0px !important;') // Remove default margin CSS;
    AddButton.setAttribute('data-request-type', 'POST')
    EditButton.innerText = 'Edit Reclama'
    EditButton.classList = 'btn btn-outline-primary mx-2'
    EditButton.setAttribute('type', 'button')
    EditButton.setAttribute('data-request-type', 'PATCH')
    ClearButton.innerText = 'Clear Selected'
    ClearButton.classList = 'btn btn-outline-secondary mr-2 d-none'
    ClearButton.setAttribute('type', 'button')

    /** Clear selected rows event; */
    ClearButton.addEventListener('click', function(event){
        return Table.DataTable().rows().deselect();
    })

    // Edit button click event;
    EditButton.addEventListener('click', function(event){
        const userModal = Component_Modal({
            title: `New Item`,
            async addContent(modalBody) {
                
                ShowForm({
                    modal: userModal,
                    parent: modalBody,
                    table: EnrollmentTableEl,
                    RequestType: 'PATCH',
                    Item: ReclamaExists ? ReclamaData[0] : null,
                    event: event
                // }, SelectedItems)
                })

                userModal.showFooter();
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
                        classes: 'btn-primary',
                        async onClick(event) {
                            
                        }
                    }
                ]
            },
            parent
        });

        userModal.add();
    })

    if ( isStatusComplete ){
        AddButton.classList.add('d-none')
        EditButton.classList.add('d-none')
    }
    
    if ( ReclamaExists ){
        AddButton.setAttribute('style', 'margin-right:0px !important;') // Remove default margin CSS;
        $(AddButton).after($(EditButton), $(ClearButton)) // Adds EditButton just after AddButton Element;
        AddButton.classList.add('d-none')
    }

    /** Remove editForm event and allow user to select multiple rows to edit; @author Wilfredo Pacheco 20210817 */
    Table.DataTable().off('click')

    /** End multiselect events; */
 

    /** Remove Loading Indication ********************************************/
    loadingIndicator.remove();
}
