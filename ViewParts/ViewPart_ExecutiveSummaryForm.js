/** Actions */
import Action_Get from '../Actions/Action_Get.js'

/* Components */
import Component_Container from '../Components/Component_Container.js'
import Component_Card from '../Components/Component_Card.js'
import Component_FoldingCube from '../Components/Component_FoldingCube.js'
import Component_MultiLineTextField from '../Components/Component_MultiLineTextField.js'
import Component_DropDownField from '../Components/Component_DropDownField.js'
import Component_Alert from '../Components/Component_Alert.js'

export default async function ViewPart_ExecutiveSummaryForm(param) {
    const {
        facility,
        facilities,
        market,
        parent
    } = param;

    /** Container */
    const container = Component_Container({
        width: '100%',
        direction: 'column',
        margin: '20px 0px 0px 0px',
        parent
    });

    container.add();

    /** Loading Indicator ****************************************************/
    const loadingIndicator = Component_FoldingCube({
        label: 'Loading Executive Summary',
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

    console.log(fiscalYear);

    /** Get Executive Summary Data */
    const data = facility ? 
        await Action_Get({
            list: 'FacilityExecutiveSummary',
            filter: `DMISID eq ${facility.Id} and FiscalYear eq ${fiscalYear[0]?.Id}`
        }) :
        await Action_Get({
            list: 'MarketExecutiveSummary',
            filter: `Market eq ${market.Id} and FiscalYear eq ${fiscalYear[0]?.Id}`
        });

    console.log(data);

    if (!data[0]) {
        loadingIndicator.remove();

        const infoAlert = Component_Alert({
            type: sessionYear == new Date().getFullYear() ? 'warning' : 'info',
            text: sessionYear == new Date().getFullYear() ? /** @todo check against current planning cycle not calendar year */
                `${market.Title} hasn't started an Executive Summary for FY ${sessionStorage.getItem('fiscalYear')}.` : 
                `${market.Title} did not submit an Executive Summary for FY ${sessionStorage.getItem('fiscalYear')}.`,
            width: '100%',
            parent: container
        });

        infoAlert.add();

        return;
    }

    const {
        Assumptions,
        CurrentMission,
        RDS,
        BOSConfirmation,
        SummarizeGaps,
        Resources,
        Initiatives,
        AdditionalInformation
    } = data[0];

    /** Field Settings */
    const width = '100%';
    const padding = '20px';
    const fieldMargin = '0px 0px 20px 0px';
    const fontWeight = '400';

    /** Assumptions */
    const AssumptionsField = Component_MultiLineTextField({
        value: Assumptions,
        label: 'List the agreed upon assumptions from the EPS event',
        description: '',
        width,
        padding,
        fieldMargin,
        fontWeight,
        parent: container
    });
    
    AssumptionsField.add();

    /** CurrentMission */
    const CurrentMissionField = Component_MultiLineTextField({
        value: CurrentMission,
        label: 'Specify your current mission and whether there are any mission changes or population changes predicted to occur in FY 21-23',
        description: '',
        width,
        padding,
        fieldMargin,
        fontWeight,
        parent: container
    });
    
    CurrentMissionField.add();

    /** RDS */
    const RDSField = Component_MultiLineTextField({
        value: RDS,
        label: 'Briefly state whether and how the readiness demand signal (medically ready requirement) will be supported',
        description: '',
        width,
        padding,
        fieldMargin,
        fontWeight,
        parent: container
    });
    
    RDSField.add();

    /** Yes/No */
    const BOSConfirmationField = Component_DropDownField({
        value: BOSConfirmation,
        list: '',
        label: 'Have you confirmed, in consultation with your Business Operations Specialist that direct care resources and/or existing network/partnerships are adequate to support both the readiness demand signal and health benefit mission?',
        dropDownOptions: [
            {
                id: 0,
                value: 'Yes'
            },
            {
                id: 0,
                value: 'No'
            }
        ],
        width: '250px',
        fieldMargin: '0px 20px 20px 0px',
        parent: container
    });

    BOSConfirmationField.add();

    /** SummarizeGaps */
    const SummarizeGapsField = Component_MultiLineTextField({
        value: SummarizeGaps,
        label: 'Summarize gaps that you are working to resolve with Healthcare Operations as part of the plan approval process',
        description: '',
        width,
        padding,
        fieldMargin,
        fontWeight,
        parent: container
    });
    
    SummarizeGapsField.add();

    /** Resources */
    const ResourcesField = Component_MultiLineTextField({
        value: Resources,
        label: 'Provide a high level summary of resources required beyond baseline that are linked to improvement initiatives',
        description: '',
        width,
        padding,
        fieldMargin,
        fontWeight,
        parent: container
    });
    
    ResourcesField.add();

    /** Initiatives */
    const InitiativesField = Component_MultiLineTextField({
        value: Initiatives,
        label: 'Provide a high level summary of your initiatives',
        description: '',
        width,
        padding,
        fieldMargin,
        fontWeight,
        parent: container
    });
    
    InitiativesField.add();

    /** AdditionalInformation */
    const AdditionalInformationField = Component_MultiLineTextField({
        value: AdditionalInformation,
        label: 'Additional Information',
        description: '',
        width,
        padding,
        fieldMargin,
        fontWeight,
        parent: container
    });
    
    AdditionalInformationField.add();

    /** Remove Loading Indication */
    loadingIndicator.remove();

    return {
        getFieldValues() {
            const data = {

            }

            return data;
        }
    };
}
