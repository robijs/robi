/** Action */
import Action_Component from '../Actions/Action_Component.js'

/** Components */
import Component_Modal from './Component_Modal.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default function Component_PortalHome(param) {
    const {
        header,
        plans,
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='portal-home'>
                <div class='portal-home-header'>
                    <!-- <p class='justify'>The QPP plans shall address performance improvements required to achieve great outcomes. To achieve great outcomes each of the Market/MTFs initiatives must address the gap analysis between their present state, and the desired end state based upon their readiness mission and DHA priorities.</p> -->
                    <p class='justify'>${header}</p>
                </div>
                ${buildPlans(plans)}
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: 20px 0px;
            }

            /* Plan */
            .portal-home-plan {
                display: flex;
                margin-top: 40px;
            }

            /** Plan image */
            .portal-home-plan-img img {
                width: 400px;
                border-radius: 4px;
            }

            .portal-home-plan-img {
                cursor: pointer;
                position: relative;
                height: fit-content;
                border-radius: 4px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
            }

            .portal-home-plan-img::after {
                content: "";
                border-radius: 4px;
                position: absolute;
                z-index: -1;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                opacity: 0;
                transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
            }

            .portal-home-plan-img:hover {
                -webkit-transform: scale(1.1, 1.1);
                transform: scale(1.1, 1.1);
            }
            
            .portal-home-plan-img:hover::after {
                opacity: 1;
            }

            .portal-home-plan-img .icon {
                position: absolute;
                bottom: 5px;
                right: 5px;
                font-size: 1.4em;
                stroke: ${Setting_App.primaryColor};
                fill: ${Setting_App.primaryColor};
            }

            /** Plan text */
            .portal-home-plan-text {
                margin-left: 40px;
            }

            .justify {
                text-align: justify;
            }

            /** Enlarge */
            .enlarge {
                cursor: pointer;
                color: ${Setting_App.secondaryColor};
                background: ${Setting_App.primaryColor};
                border-radius: 4px;
                padding: 5px 15px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id img',
                event: 'click',
                listener(event) {
                    showModal(this.title, this.src);
                }
            },
            {
                selector: '#id .enlarge',
                event: 'click',
                listener(event) {
                    showModal(this.title, this.dataset.src);
                }
            }
        ]
    });

    function buildPlans(plans) {
        return plans.map(plan => {
            const {
                label,
                img,
                text
            } = plan;

            return /*html*/ `
                <div class='portal-home-plan'>
                    <div class='portal-home-plan-img'>
                        <img src='..${img}' title='${label}'>
                        <svg class='icon'>
                            <use href='#icon-zoom-in'></use>
                        </svg>
                    </div>
                    <div class='portal-home-plan-text'>
                        <h4>${label}</h4>
                        <p>${text}</p>
                        <p class='justify'>
                            <span class='enlarge' data-src='..${img}' title='${label}'>Select the graphic to enlarge</span>
                        </p>
                    </div>
                </div>
            `;
        }).join('\n');
    }

    function showModal(title, src) {
        const modal = Component_Modal({
            title: title,
            fullSize: true,
            addContent(modalBody) {
                const html = /*html*/ `
                    <!-- <img src='${src}' title='QPP Lifecycle' style='width: 100%;'> -->
                    <div style='display: flex; justify-content: center; align-items: center;'>
                        <img src='${src}' title='QPP Lifecycle' style='max-width: 100%; max-height: 755px'>
                    </div>
                `;

                modalBody.insertAdjacentHTML('beforeend', html);
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
                    }
                ]
            },
            parent
        });

        modal.add();
    }

    return component;
}