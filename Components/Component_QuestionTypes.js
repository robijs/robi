/** Action */
import Action_Component from '../Actions/Action_Component.js'
import Action_Route from '../Actions/Action_Route.js'

export default function Component_QPPQuestions(param) {
    const {
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='qpp-questions'>
                <h4>For general questions related to each section of the CSART tool please submit your question below:</h4>
                    <div class=button-container>
                        <div class='btn btn-primary question' data-path='Questions/General'>General Questions</div>
                    </div>
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

            #id h4 {
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
                    Action_Route(this.dataset.path);
                }
            }
        ]
    });

    return component;
}