/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_AddStyle from '../Actions/Action_AddStyle.js'
import GetRequestDigest from '../Actions/Action_GetRequestDigest.js'

/** Components */
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_Card from '../Components/Component_Card.js'
import Component_Container from '../Components/Component_Container.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** View Parts */
import ViewPart_Table from '../ViewParts/ViewPart_Table.js'
// import ViewPart_RDSSummaryNewForm from './ViewPart_RDSSummaryNewForm.js'
// import ViewPart_RDSSummaryEditForm from './ViewPart_RDSSummaryEditForm.js'
// import ViewPart_RDSSummaryDisplayForm from './ViewPart_RDSSummaryDisplayForm.js'

export default async function View_RDSSummaryTable(param) {
    const {
        parent,
        facility
    } = param;

    /** Summary Card */
    const summaryCard = Component_Card({
        title: 'DHA Predicted Summary',
        description: '',
        titleColor: Setting_App.primaryColor,
        padding: '20px',
        margin: '20px 0px',
        width: '100%',
        // 'background-color': 'transparent',
        // border: '0',
        parent
    });

    summaryCard.add();

    /** Summary Container */
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
        label: 'Loading DHA Predicted Summary',
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

    /** Get Summary data */
    const readinessData = await Action_Get({
        list: 'FacilityRDSSummary',
        filter: `DMISID eq ${facility.Id} and FiscalYear eq ${fiscalYear[0]?.Id}`
    });

    // console.log(readinessData);

    const fields = [
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
            internalFieldName: 'TotalAvailableNonAvailableFTEs',
            displayName: 'Total Available/Non-available FTEs'
        },
        {
            internalFieldName: 'TotalLeaveFTEs',
            displayName: 'Total Leave FTEs'
        },
        {
            internalFieldName: 'TotalOtherFTEs',
            displayName: 'Total Other FTEs'
        },
        {
            internalFieldName: 'TotalSickFTEs',
            displayName: 'Total Sick FTEs'
        },
        {
            internalFieldName: 'TotalNonAvailableFTEs',
            displayName: 'Total Non-available FTEs'
        },
        {
            internalFieldName: 'TotalFAdjustedFTEs',
            displayName: 'Total FAdjusted FTEs'
        },
        {
            internalFieldName: 'AdjustedBaseline',
            displayName: 'Adjusted Baseline'
        },
        {
            internalFieldName: 'ServiceReadinessActivities',
            displayName: 'Service Readiness Activities'
        },
        {
            internalFieldName: 'DeployReadinessActivities',
            displayName: 'Deploy Readiness Activities'
        },
        {
            internalFieldName: 'DHAPredictedQuarterlyFTEs',
            displayName: 'DHA PredictedQuarterly FTEs'
        },
        {
            internalFieldName: 'PercentageDHAPredictedFTEs',
            displayName: 'DHA Predicted FTEs Percentage'
        },
        {
            internalFieldName: 'Id',
            displayName: 'Id'
        }
    ];

    /** Add Table styles */
    Action_AddStyle({
        name: 'rds-summary',
        style: /*css*/ `
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
        `
    });

    const lightBlueTitles = [
        `SUBTOTAL OF 'A' INPATIENT CARE`,
        `SUBTOTAL OF 'B' AMBULATORY CARE`,
        `SUBTOTAL OF 'C' DENTAL CARE`,
        `SUBTOTAL OF 'D' ANCILLARY SERVICES`,
        `SUBTOTAL OF 'E' SUPPORT SERVICES`,
        `SUBTOTAL OF 'F' SPECIAL PROGRAMS - HEALTHCARE`,
        `TOTAL FTES REQUIRED FOR READINESS DEMAND SIGNAL`,
        `TOTAL FTES REQUIRED FOR READINESS DEMAND SIGNAL:`
    ];

    const orangeTitles = [
        `SUBTOTAL OF 'F' SPECIAL PROGRAMS - ADJUSTED`,
    ];

    const blueTitles = [
        `SUBTOTAL - FTES FOR ADJUSTED BASELINE`,
    ];

    const greenTitles = [
        `SUBTOTAL SERVICE READINESS ACTIVITY (SRA) FTES`,
        `SUBTOTAL SERVICE READINESS ACTIVITY (SRA) FTES:`
    ];

    const greyTitles = [
        `SUBTOTAL DEPLOYMENT READINESS ACTIVITY (DRA) FTES`,
        `SUBTOTAL DEPLOYMENT READINESS ACTIVITY (DRA) FTES:`
    ];

    /** Summary Table */

    const Table = ViewPart_Table({
        heading: '',
        titleDisplayName: 'Subtotal',
        fields,
        items: readinessData,
        checkboxes: false,
        parent: summaryContainer,
        order: [[ fields.length - 1, 'asc' ]],
        addButton: false,
        formTitleField: 'Title',
        formFooter: false,
        createdRow(row, data) {
            const {
                Title
            } = data;

            const tds = row.querySelectorAll('td');
            const subtotal = Title.toUpperCase();

            if (lightBlueTitles.includes(subtotal)) {
                addLightBlueRowTDClasses(tds);
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
        },
        // newForm: ViewPart_RDSSummaryNewForm,
        // displayForm: ViewPart_RDSSummaryDisplayForm,
        // editForm: ViewPart_RDSSummaryEditForm // Note: This is the click action from the list;
    });

    /** Changes font to fit table into view preventing users to scroll @author Wilfredo Pacheco 20210809 */       
    Array.from(Table.findAll('tr')).forEach(tr => tr.setAttribute('style', 'font-size: 12px !important;'))
    /** Allows the Summary Table to fit in the window @author Wilfredo Pacheco 20210809 */
    Table.DataTable().table().container().querySelector('table').classList.remove('nowrap')
    Table.DataTable().off('click') // Remove Original Click method provided by default;

    /** Light Blue */
    function addLightBlueRowTDClasses(tds) {
        /** Light Blue */
        [...tds].slice(0, 8).forEach(td => {
            td.classList.add('light-blue');
        });

        [...tds].slice(12).forEach(td => {
            td.classList.add('light-blue');
        });

        /** Orange */
        tds[8].classList.add('orange');

        /** Blue */
        tds[9].classList.add('blue');

        /** Green */
        tds[10].classList.add('green');

        /** Grey */
        tds[11].classList.add('grey');
    }

    /** Orange */
    function addOrangeRowTDClasses(tds) {
        /** Orange */
        [...tds].slice(0, 9).forEach(td => {
            td.classList.add('orange');
        });

        /** Blue */
        tds[9].classList.add('blue');

        /** Green */
        tds[10].classList.add('green');

        /** Grey */
        tds[11].classList.add('grey');
        
        /** Light Blue */
        [...tds].slice(12).forEach(td => {
            td.classList.add('light-blue');
        });
    }

    /** Blue */
    function addBlueRowTDClasses(tds) {
        /** Blue */
        [...tds].slice(0, 10).forEach(td => {
            td.classList.add('blue');
        });

        /** Green */
        tds[10].classList.add('green');

        /** Grey */
        tds[11].classList.add('grey');
        
        /** Light Blue */
        [...tds].slice(12).forEach(td => {
            td.classList.add('light-blue');
        });
    }

    /** Green */
    function addGreenRowTDClasses(tds) {
        /** Green */
        [...tds].slice(0, 11).forEach(td => {
            td.classList.add('green');
        });

        /** Grey */
        tds[11].classList.add('grey');
        
        /** Light Blue */
        [...tds].slice(12).forEach(td => {
            td.classList.add('light-blue');
        });
    }

    /** Grey */
    function addGreyRowTDClasses(tds) {
        /** Grey */
        [...tds].slice(0, 12).forEach(td => {
            td.classList.add('grey');
        });

        /** Light Blue */
        [...tds].slice(12).forEach(td => {
            td.classList.add('light-blue');
        });
    }

    /** Remove Loading Indication ********************************************/
    loadingIndicator.remove();
}
