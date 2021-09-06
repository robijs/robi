/** Action */
import Action_Component from '../Actions/Action_Component.js'
import Action_Route from '../Actions/Action_Route.js'

export default function Component_QPPReports(param) {
    const {
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='qpp-questions'>
                <h4>Please click on the report name to launch it in a new window:</h4>
                    <div class='button-container mb-4'>
                        <div class='btn btn-primary question' data-path=''>Facility Enrollment Aggregate Report</div>
                        <div class='btn btn-primary question' data-path=''>Facility Workload Aggregate Report</div>
                        <div class='btn btn-primary question' data-path=''>Market Enrollment Aggregate Report</div>
                        <div class='btn btn-primary question' data-path=''>Market Workload Aggregate Report</div>
                        <div class='btn btn-primary question' data-path=''>Readiness Quarterly MTF Prediction Report</div>
                        <div class='btn btn-primary question' data-path=''>Readiness Quarterly MTF Prediction Report (For Markets)</div>
                        <div class='btn btn-primary question' data-path=''>Plan Review Status</div>
                        <div class='btn btn-primary question' data-path=''>Reclama Tracker Enrollment Dataset</div>
                        <div class='btn btn-primary question' data-path=''>Reclama Tracker Workload Dataset</div>
                    </div>
                <h5 class='mb-4'>For help with these reports please contact the following SMEs:</h4>
                <table>
                    <tbody>
                        <tr>
                            <td class='heading first' colspan='2'>Executive Summary</td>
                        </tr>
                        <tr>
                            <td>Sherry Stone</td>
                            <td><a href='mailto:sherry.j.stone2.civ@mail.mil'>sherry.j.stone2.civ@mail.mil</a></td>
                        </tr>
                        <tr>
                            <td>Mary Stanhope</td>
                            <td><a href='mailto:mary.e.stanhope2.civ@mail.mil'>mary.e.stanhope2.civ@mail.mil</a></td>
                        </tr>
                        <tr>
                            <td>Jacqueline Greene</td>
                            <td><a href='mailto:jacqueline.f.greene2.civ@mail.mil'>jacqueline.f.greene2.civ@mail.mil</a></td>
                        </tr>
                        <tr>
                            <td>Angela Powers</td>
                            <td><a href='mailto:angela.e.powers.civ@mail.mil'>angela.e.powers.civ@mail.mil</a></td>
                        </tr>
                        <tr>
                            <td class='heading' colspan='2'>Initiatives Summary</td>
                        </tr>
                        <tr>
                            <td>Angela Koelsch</td>
                            <td><a href='mailto:angela.a.koelsch.civ@mail.mil'>angela.a.koelsch.civ@mail.mil</a></td>
                        </tr>
                        <tr>
                            <td>Mary Horne</td>
                            <td><a href='mailto:mary.a.horne.civ@mail.mil'>mary.a.horne.civ@mail.mil</a></td>
                        </tr>
                        <tr>
                            <td class='heading' colspan='2'>Market Integration</a></td>
                        </tr>
                        <tr>
                            <td>Tamara Fatzinger</td>
                            <td><a href='mailto:tamara.g.fatzinger.civ@mail.mil'>tamara.g.fatzinger.civ@mail.mil</a></td>
                        </tr>
                        <tr>
                            <td class='heading' colspan='2'>Plan Review Status</a></td>
                        </tr>
                        <tr>
                            <td>Sherry Stone</td>
                            <td><a href='mailto:sherry.j.stone2.civ@mail.mil'>sherry.j.stone2.civ@mail.mil</a></td>
                        </tr>
                        <tr>
                            <td>Mary Stanhope</td>
                            <td><a href='mailto:mary.e.stanhope2.civ@mail.mil'>mary.e.stanhope2.civ@mail.mil</a></td>
                        </tr>
                        <tr>
                            <td>Jacqueline Greene</td>
                            <td><a href='mailto:jacqueline.f.greene2.civ@mail.mil'>jacqueline.f.greene2.civ@mail.mil</a></td>
                        </tr>
                        <tr>
                            <td>Angela Powers</td>
                            <td><a href='mailto:angela.e.powers.civ@mail.mil'>angela.e.powers.civ@mail.mil</a></td>
                        </tr>
                        <tr>
                    </tbody>
                </table>
            </div>
        `,
        style: /*css*/ `
            #id .heading {
                font-weight: 500;
                font-size: 1.1em;
                padding-bottom: 10px;
            }
            
            #id .heading:not(.first) {
                padding-top: 30px;
            }

            #id td {
                padding-right: 20px;
                padding-bottom: 5px;
            }

            #id ul li {
                font-size: 1.2em;
                padding: 5px 0px;
            }

            #id h4, 
            #id h5 {
                font-weight: 400;
            }

            #id .mt-50 {
                margin-top: 50px;
            }

            #id .mt-30 {
                margin-top: 30px;
            }

            #id .button-container {
                display: flex;
                flex-direction: column;
                width: fit-content;
            }
            
            #id .btn {
                margin: 10px 0px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .question',
                event: 'click',
                listener(event) {
                    // Action_Route(this.dataset.path);
                    console.log(this.dataset.path);
                }
            }
        ]
    });

    return component;
}