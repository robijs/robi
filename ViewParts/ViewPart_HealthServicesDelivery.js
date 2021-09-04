/** Components */
import Component_Card from '../Components/Component_Card.js'
import Component_Heading from '../Components/Component_Heading.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** View Parts */
import ViewPart_HSDEnrollmentTable from '../ViewParts/ViewPart_HSDEnrollmentTable.js'
import ViewPart_HSDWorkloadTable from '../ViewParts/ViewPart_HSDWorkloadTable.js'

export default async function View_HealthServicesDelivery(param) {
    const {
        facility,
        facilities,
        parent,
    } = param;
    
    const card = Component_Card({
        title: 'Health Services Delivery',
        description: /*html*/ `
            <p>This module is part of the quadruple aim performance process that provides MTFs and Markets the opportunity to review the projected healthcare services and anticipated workload for the upcoming fiscal year (FY22). This subsequently informs MTF resourcing by providing upfront funding based on the projected workload 'targets' within the Health Services Delivery Module. Prior to start of each FY, MTF funding details are provided on the Statement of Operations (SOO), thus creating financial certainty and reliability for MTF Commanders and Resource Managers. For more in depth information on Integrated Resources (IR), please <a href='https://carepoint.health.mil/sites/IRIS/Documents/Customer_Guide_FY20_SOO.pdf' target='_blank'>click here</a> for the Integrated Resources Customer Guide for FY20 available within CarePoint, updated guidelines forthcoming.</p>
            <p>The workload targets are presented by Service Lines, which are clinically similar grouping of MEPRS codes. These workload targets are derived using statistical forecasting methods which are applied to recent historical data, with no additional input from the MTFs. This module allows MTFs and Markets to review the projected workload targets and also provides an opportunity, when necessary, to request adjustments to the workload and/or enrollment levels through a 'reclama' process. This reclama process is the mechanism to provide essential feedback to DHA on changes impacting MTF capability/capacity such as new initiatives, patient population changes, facility changes etc., which may result in new MCSC support needs, which could not be anticipated using historical data. MTF and Market reviews will include reclamas to both increase and decrease projected workload as appropriate. MTFs should reflect known changes in their reclamas while avoiding speculation about any staff reductions until they are confirmed by their higher command (ie: reclamas will not be accepted pre-decisional capability/capacity modifications such as MILPER reductions, NDAA Section 703 changes, etc.) MTFs and Markets will sustain clinical readiness by optimizing direct care processes and leveraging strategic partnerships with the Veterans Administration.</p>
            <p>Incremental enrollment or workload changes will be evaluated at the MTF (Parent), Service Line level by workload type (RVUs, APCs, RWPs, MHBDs, DWVs). All reclamas will be assessed for readiness implications, MCSC's ability to support and MTF/market compliance with mandated performance standards for enrollment and workload as established in DHA PI 6025.11 and DHA IPM18-001. Reclamas validated through each of these functional proponents will be reviewed financially for inclusion in the FY21 Statement of Operations. Workload and enrollment adjustments with a cumulative impact of +/-5% or greater to any specific workload type in a single Service Line or enrollment beneficiary category at the parent DMIS level will be prioritized for individual assessment due to their financial effect on the MTF. Workload and enrollment adjustments with a cumulative impact less than +/-5% will be compared to most recent performance for inclusion in the FY22 Statement of Operations. These thresholds are the same regardless of MTF type (Medical Center, Hospital, and Clinic).</p>
            <p>PRIME definition – Prime Enrollment is for those enrolled to the MTF for care. Prime Enrollee: Beneficiaries enrolled under TRICARE Prime. This includes Active Duty, Active Duty Family Members, Retirees and Retiree Family Members under age 65 in CONUS. OCONUS is Active Duty and Active Duty Family Member under age 65. Keep in mind, Prime enrollees do not equal 100% of your empaneled population.</p>
            <div class='row justify-content-center'>
                <table style='margin-left: 20%;margin-right: 20%;' class='table table-light'>
                    <thead>
                        <tr>
                            <th scope='col'>Parent MTF Group</th>
                            <th scope='col'>% Change (from initial workload target at SL and Workload Type)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>MEDCEN</td><td>+/- 5%</td></tr>
                        <tr><td>Hospital</td><td>+/- 5%</td></tr>
                        <tr><td>Clinic</td><td>+/- 5%</td></tr>
                    </tbody>
                </table>
            </div>
        `,
        titleColor: Setting_App.primaryColor,
        padding: '20px',
        width: '100%',
        parent
    });

    card.add();

    if (facilities) {
        facilities.forEach(facility => {
            /** Add Heading */
            const heading = Component_Heading({
                text: facility.QPP_DropDown,
                size: '1.7em',
                // color: 'mediumslateblue',
                width: '100%',
                margin: '30px 0px 0px 0px',
                // padding: '0px 50px',
                parent
            });
    
            heading.add();

            addViewParts(facility);
        });
    } else if (facility) {
        addViewParts(facility);
    }

    function addViewParts(facility) {
        /** RDS Summary Table */
        ViewPart_HSDEnrollmentTable({
            facility,
            parent
        });

        /** RDS Summary Table */
        ViewPart_HSDWorkloadTable({
            facility,
            parent
        });
    }
}
