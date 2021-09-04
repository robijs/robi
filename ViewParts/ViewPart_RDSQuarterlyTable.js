/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_AddStyle from '../Actions/Action_AddStyle.js'
import Action_Store from '../Actions/Action_Store.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'

/** Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_Card from '../Components/Component_Card.js'
import Component_Container from '../Components/Component_Container.js'
import Component_Notification from '../Components/Component_Notification.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** View Parts */
import ViewPart_Table from './ViewPart_Table.js'
import ViewPart_RDSQuarterlyNewForm from './ViewPart_RDSQuarterlyNewForm.js'
import ViewPart_RDSQuarterlyEditForm from './ViewPart_RDSQuarterlyEditForm.js'

export default async function View_RDSQuarterlyTable(param) {
    const {
        parent,
        facility
    } = param;

    /** Quarterly Card */
    const summaryCard = Component_Card({
        title: 'MTF Quarterly Prediction',
        description: '',
        titleColor: Setting_App.primaryColor,
        padding: '20px',
        margin: '20px 0px',
        width: '100%',
        parent
    });

    summaryCard.add();

    /** Quarterly Container */
    const summaryContainer = Component_Container({
        width: '100%',
        direction: 'column',
        padding: '20px 0px',
        // overflowX: 'overlay',
        parent: summaryCard
    });

    summaryContainer.add();

    /** Loading Indicator ****************************************************/
    const loadingIndicator = Component_FoldingCube({
        label: 'Loading MTF Quarterly Prediction',
        margin: '40px 0px',
        parent: summaryContainer
    });
    
    loadingIndicator.add();

    /** Get FiscalYear */
    const sessionYear = sessionStorage.getItem('fiscalYear')?.split('-')[0];

    /** @todo this should already be in session storage */
    const fiscalYear = await Action_Get({
        list: 'Fiscal Years',
        filter: `Title eq '${sessionYear}'`
    });

    // console.log(fiscalYear);

    /** Get Quarterly data */
    const readinessData = await Action_Get({
        list: 'FacilityRDSQuarterly',
        filter: `DMISID eq ${facility.Id} and FiscalYear eq ${fiscalYear[0]?.Id}`
    });

    // console.log(readinessData);

    const fields = [
        {
            internalFieldName: 'Quarter',
            displayName: 'Quarter'
        },
        {
            internalFieldName: 'Subtotal',
            displayName: 'Subtotal'
        },
        {
            internalFieldName: 'MEPRSCode',
            displayName: 'MEPRS Code'
        },
        {
            internalFieldName: 'MEPRSDescription',
            displayName: 'MEPRS Description'
        },
        {
            internalFieldName: 'DHAPredictedQuarterlyFTEs',
            displayName: 'DHA Predicted Quarterly FTEs'
        },
        {
            internalFieldName: 'PercentageDHAPredictedFTEs',
            displayName: 'DHA Predicted FTEs Percentage '
        },
        {
            internalFieldName: 'MTFPredictedFTEs',
            displayName: 'MTF Predicted FTEs'
        },
        {
            internalFieldName: 'MTFPredictedPercentage',
            displayName: 'MTF Predicted Percentage'
        },
        {
            internalFieldName: 'MTFExplanation',
            displayName: 'MTF Explanation',
            type: 'mlot'
        },
        {
            internalFieldName: 'Id',
            displayName: 'Id'
        }
    ];

    const lightPurpleTitles = [
        `SUBTOTAL OF 'A' INPATIENT CARE`,
        `SUBTOTAL OF 'B' AMBULATORY CARE`,
        `SUBTOTAL OF 'C' DENTAL CARE`,
        `SUBTOTAL OF 'D' ANCILLARY SERVICES`,
        `SUBTOTAL OF 'E' SUPPORT SERVICES`,
        `SUBTOTAL OF 'F' SPECIAL PROGRAMS - HEALTHCARE`,
    ];

    const orangeTitles = [
        `SUBTOTAL OF 'F' SPECIAL PROGRAMS - ADJUSTED`,
    ];

    const blueTitles = [
        `SUBTOTAL - FTES FOR ADJUSTED BASELINE`,
    ];

    const greenTitles = [
        `SUBTOTAL SERVICE READINESS ACTIVITY (SRA) FTES`,
        `SUBTOTAL SERVICE READINESS ACTIVITY (SRA) FTES:`,
    ];

    const greyTitles = [
        `SUBTOTAL DEPLOYMENT READINESS ACTIVITY (DRA) FTES`,
        `SUBTOTAL DEPLOYMENT READINESS ACTIVITY (DRA) FTES:`,
    ];

    const lightBlueTitles = [
        `TOTAL FTES REQUIRED FOR READINESS DEMAND SIGNAL`,
        `TOTAL FTES REQUIRED FOR READINESS DEMAND SIGNAL:`
    ];

    [
        '1st',
        '2nd',
        '3rd',
        '4th'
    ].forEach(quarter => {
        /** Quarterly Table */
        const Table = ViewPart_Table({
            heading: `${quarter} Quarter (${setMonth(quarter)})`,
            headingColor: 'mediumslateblue',
            headingSize: '1.3em',
            headingMargin: quarter === '1st' ? '0px 0px 15px 0px' : '20px 0px 15px 0px',
            titleDisplayName: 'Quarter',
            formTitleField: 'Subtotal',
            fields,
            items: readinessData.filter(item => item.Title === quarter),
            checkboxes: false,
            addButton: false,
            parent: summaryContainer,
            createdRow(row, data) {
                const {
                    Subtotal
                } = data;
    
                const tds = row.querySelectorAll('td');
                const subtotal = Subtotal.toUpperCase();
    
                if (lightPurpleTitles.includes(subtotal)) {
                    addLightPurpleRowTDClasses(tds);
                }
    
                else if (orangeTitles.includes(subtotal)) {
                    addOrangeRowTDClasses(tds);
                }
    
                else if (blueTitles.includes(subtotal)) {
                    addBlueRowTDClasses(tds);
                }
    
                else if (greenTitles.includes(subtotal)) {
                    addGreenRowTDClasses(tds);
                }
    
                else if (greyTitles.includes(subtotal)) {
                    addGreyRowTDClasses(tds);
                }

                else if (lightBlueTitles.includes(subtotal)) {
                    addLightBlueRowTDClasses(tds);
                }
            },
            newForm: ViewPart_RDSQuarterlyNewForm,
            editForm: ViewPart_RDSQuarterlyEditForm,
            async onUpdate(param) {
                const {
                    item,
                    row,
                    table,
                    formValues
                } = param;

                let update = false;

                const {
                    MTFPredictedFTEs,
                    MTFPredictedPercentage,
                    MTFExplanation
                } = formValues;

                let data = {};

                if (MTFPredictedFTEs && parseFloat(MTFPredictedFTEs) !== item.MTFPredictedFTEs) {
                    update = true;
                    
                    data.MTFPredictedFTEs = MTFPredictedFTEs;
                }

                const percentage = parseFloat(MTFPredictedPercentage / 100);

                if (MTFPredictedPercentage && percentage !== item.MTFPredictedPercentage) {
                    update = true;
                    
                    data.MTFPredictedPercentage = percentage;
                }

                if (MTFExplanation && MTFExplanation !== item.MTFExplanation) {
                    update = true;
                    
                    data.MTFExplanation = MTFExplanation;
                }

                if (update) {
                    /**
                     *  @author Stephen Matheis 
                     *  Wil, remove the if statement below to make edit feature available to all users.
                    */
                    if (Action_Store.user().Role === 'Developer') {
                        console.log(data);
                        const updatedItem = await Action_UpdateItem({
                            list: 'FacilityRDSQuarterly',
                            itemId: item.Id,
                            data
                        });
    
                        table.updateRow({
                            row,
                            data: updatedItem
                        });
    
                        /** Show toast */
                        const toast = Component_Notification({
                            text: `${item.Subtotal} updated!`,
                            type: 'bs-toast',
                            parent: Action_Store.get('maincontainer')
                        });
    
                        toast.add();
                    }
                } else {
                    return 'unchanged';
                }   
            }
        });
        
        /** Changes font to fit table into view preventing users to scroll @author Wilfredo Pacheco 20210809 */       
        Array.from(Table.findAll('tr')).forEach(tr => tr.setAttribute('style', 'font-size: 12px !important;'))
        /** Word wrap table headers @author Wilfredo Pacheco 20210809 */
        Array.from(Table.findAll('th.sorting')).forEach(th => th.classList.add('text-wrap'))
        
    });

    // console.info(summaryContainer)
    // console.info(summaryContainer.element())

    function setMonth(quarter) {
        switch (quarter) {
            case '1st':
                return 'December';
            case '2nd':
                return 'March';
            case '3rd':
                return 'June';
            case '4th':
                return 'September';
            default:
                return '';
        }
    }

    /** Light Purple */
    function addLightPurpleRowTDClasses(tds) {
        /** Light Purple */
        [...tds].slice(0, 4).forEach(td => {
            td.classList.add('light-purple');
        });

        /** @todo ask product owner what criteria is used to color code columns lime green or yellow */
        // /** Lime Green */
        // tds[7].classList.add('lime-green');

        /** Light Blue */
        [...tds].slice(4, 6).forEach(td => {
            td.classList.add('light-blue');
        });
    }

    /** Orange */
    function addOrangeRowTDClasses(tds) {
        /** Orange */
        [...tds].slice(0, 4).forEach(td => {
            td.classList.add('orange');
        });

        /** Light Blue */
        [...tds].slice(4, 6).forEach(td => {
            td.classList.add('light-blue');
        });
    }

    /** Blue */
    function addBlueRowTDClasses(tds) {
        /** Blue */
        [...tds].slice(0, 4).forEach(td => {
            td.classList.add('blue');
        });

        /** Light Blue */
        [...tds].slice(4, 6).forEach(td => {
            td.classList.add('light-blue');
        });
    }

    /** Green */
    function addGreenRowTDClasses(tds) {
        /** Green */
        [...tds].slice(0, 4).forEach(td => {
            td.classList.add('green');
        });
        
        /** Light Blue */
        [...tds].slice(4, 6).forEach(td => {
            td.classList.add('light-blue');
        });
    }

    /** Grey */
    function addGreyRowTDClasses(tds) {
        /** Grey */
        [...tds].slice(0, 4).forEach(td => {
            td.classList.add('grey');
        });

        /** Light Blue */
        [...tds].slice(4, 6).forEach(td => {
            td.classList.add('light-blue');
        });
    }

    /** Light Blue */
     function addLightBlueRowTDClasses(tds) {
        /** Light Blue */
        [...tds].slice(0, 6).forEach(td => {
            td.classList.add('light-blue');
        });
    }

    /** Remove Loading Indication ********************************************/
    loadingIndicator.remove();
    
    /** Add Table styles */
    Action_AddStyle({
        name: 'rds-quarterly',
        style: /*css*/ `
            td.light-purple {
                background: rgb(217,225,242);
            }

            td.blue {
                background: rgb(000,176,240);
            }    

            td.light-blue {
                background: rgb(189,215,238);
            }

            td.orange {
                background: rgb(252,228,214);
            }

            td.green {
                background: rgb(226,239,218);
            }

            td.grey {
                background: rgb(217,217,217);
            }

            td.lime-green {
                background: rgb(178,255,102);
            }
        `
    });
}
