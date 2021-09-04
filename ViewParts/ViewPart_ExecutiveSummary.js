/** Components */
import Component_Card from '../Components/Component_Card.js'
import Component_Heading from '../Components/Component_Heading.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** View Parts */
import ViewPart_ExecutiveSummaryForm from '../ViewParts/ViewPart_ExecutiveSummaryForm.js'

export default async function View_ExecutiveSummary(param) {
    const {
        facility,
        facilities,
        market,
        parent,
    } = param;
    
    const card = Component_Card({
        title: 'Executive Summary',
        description: /*html*/ `
            <p>Captures significant mission or population changes occurring in the last year or projected to occur which requires DHA visibility. The summary includes both the medical readiness and health care initiatives within the Market (utilizing both direct and purchased care capabilities/partnerships), that the Market/MTFs will execute in the year ahead.</p>
            <p>The QPP plans shall address performance improvement required to achieve great outcomes. To achieve great outcomes each of the Market/MTFs initiatives must address the gap analysis between their present state, and the desired end state based upon their readiness mission and DHA priorities.</p>
        `,
        titleColor: Setting_App.primaryColor,
        padding: '20px',
        width: '100%',
        parent
    });

    card.add();

    ViewPart_ExecutiveSummaryForm({
        market,
        facility,
        facilities,
        parent
    });
}
