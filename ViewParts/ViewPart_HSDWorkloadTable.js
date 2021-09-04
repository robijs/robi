/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_Store from '../Actions/Action_Store.js'

/** Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_Card from '../Components/Component_Card.js'
import Component_Container from '../Components/Component_Container.js'

import Component_Modal from '../Components/Component_Modal.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** View Parts */
import ViewPart_Table from './ViewPart_Table.js'
import ViewPart_HSDWorkloadNewForm from './ViewPart_HSDWorkloadNewForm.js'
// import ViewPart_HSDWorkloadEditForm from './ViewPart_HSDWorkloadEditForm.js'
import ShowForm from './Form.HSDWorkload.js'


export default async function View_HSDWorkloadTable(param) {
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

    /** Quarterly Card */
    const card = Component_Card({
        title: /*html*/ `
            <div>Workload</div>
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

    /** Quarterly Container */
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
        label: 'Loading Workload data',
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
        list: 'FacilityHSDWorkload',
        filter: `DMISID eq ${facility.Id} and FiscalYear eq ${fiscalYear[0]?.Id}`
    });

    const ReclamaData = await Action_Get({
        list: 'FacilityHSDWorkloadReclama',
        filter: `DMISID/Id eq ${facility.Id} and FiscalYear/Id eq ${FiscalYearValue.Id}`
    });

    const ReclamaExists = ReclamaData.length > 0

    const fields = [
        'WorkloadServiceLine',
        'WorkloadType',
        'APC',
        'PERVU',
        'WRVU',
        'RWP',
        'MHBD',
        'DWV'
    ].join(',');

    const EnrollmentTableEl = ViewPart_Table({
        heading: '',
        headingColor: 'mediumslateblue',
        headingSize: '1.3em',
        fields,
        items,
        checkboxes: false,
        parent: container,
        newForm: ShowForm,
        // newForm: ViewPart_HSDWorkloadNewForm,
        // editForm: ViewPart_HSDWorkloadEditForm
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

    /** Remove Loading Indication ********************************************/
    loadingIndicator.remove();
}
