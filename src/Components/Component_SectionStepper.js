/** Actions */
import Action_Component from '../Actions/Action_Component.js'
import Action_Store from '../Actions/Action_Store.js'

/** Settings */
import Setting_App from '../Settings/Setting_App.js';

export default function Component_SectionStepper(param) {
    const {
        title,
        sections,
        scrollElement,
        action,
        parent,
        position
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='section-stepper'>
                <div class='section-title-group'>
                    ${title ? /*html*/`<div class='section-title'>${title.text}</div>` : ''}
                    <div class='section-group-container'>
                        ${createHTML()}
                    </div>
                </div>
                <div class='section-legend'>
                    <!-- <h3>Legend</h3> -->
                    <!-- Not Started -->
                    <div class='section-group'>
                        <div class='section-circle-bar-container'>
                            <div class='section-circle not-started'></div>
                        </div>
                        <div class='section-name'>
                            <span class='section-name-text'>Not Started</span>
                        </div>
                    </div>
                    <!-- Started -->
                    <div class='section-group'>
                        <div class='section-circle-bar-container'>
                            <div class='section-circle started'></div>
                        </div>
                        <div class='section-name'>
                            <span class='section-name-text'>Started</span>
                        </div>
                    </div>
                    <!-- Not Started -->
                    <div class='section-group'>
                        <div class='section-circle-bar-container'>
                            <div class='section-circle complete'></div>
                        </div>
                        <div class='section-name'>
                            <span class='section-name-text'>Complete</span>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Root */
            #id.section-stepper {
                height: 100%;
                padding: 15px 13px 5px 13px;
                display: inline-flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: overlay;
                border-right: solid 1px ${Setting_App.get('sidebarBorderColor')};
            }

            /* Title */
            #id .section-title {
                font-size: 1em;
                color: ${Setting_App.get('primaryColor')};
                margin-bottom: 15px;
                padding: .275rem .75rem;
                cursor: pointer;
            }

            /* Sections */
            #id .section-group {
                display: flex;
                justify-content: flex-start;
            }

            /* Circle and Bar Container */
            #id .section-circle-bar-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            /* Circle */
            #id .section-circle {
                user-select: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                padding: 6px;
                background: ${Setting_App.get('primaryColor')};
                border: solid 1px ${Setting_App.get('primaryColor')};
                color: white;
                text-align: center;
                line-height: .6;
            }

            #id .section-circle.not-started {
                background: white;
                color: ${Setting_App.get('primaryColor')};
            }

            #id .section-circle.started {
                /* Green */
                color: #155724;
                background-color: #d4edda;

                /* Blue */
                color: white;
                background-color: #007bff;

                /* Orange */
                /* color: #212529; */
                /* background-color: #ffc107; */
                /* background: orange; */
                /* color: white; */
            }

            #id .section-circle.complete {
                color: #fff;
                background-color: #28a745;
                /* background: mediumseagreen;
                color: white; */
            }

            #id .section-circle.error {
                background: #f8d7da;
                color: #721c24;
                border-color: #721c24;
            }

            /* Bar */
            #id .section-bar {
                background: ${Setting_App.get('primaryColor')};
                height: 10px;
                width: 1px;
                margin: 5px 0px;
            }

            /* Name */
            #id .section-name {
                font-weight: 500;
                white-space: nowrap;
            }

            #id .section-name-text {
                margin: 0px 8px;
                font-size: 14px;
            }

            #id .section-name-text.selected {
                border-bottom: solid 2px ${Setting_App.get('primaryColor')};
            }

            /* Legend */
            #id .section-legend .section-group {
                margin: 5px 0px;
            }

            #id .section-legend {
                font-size: .8em;
            }

            #id .section-legend .section-circle {
                width: 20px;
                height: 20px;
                padding: 3px;
            }

            /* Hover */
            #id .section-group-container .section-circle:hover,
            .section-group-container .section-name-text:hover {
                cursor: pointer;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            // {
            //     selector: '#id .section-group',
            //     event: 'click',
            //     listener: scrollToSection
            // },
            {
                selector: '#id .section-group',
                event: 'click',
                listener: action
            },
            {
                selector: '#id .section-title',
                event: 'click',
                listener(event) {
                    if (title && title.action) {
                        title.action(event);
                    }
                }
            }
        ]
    });

    function createHTML() {
        let html = '';

        sections.forEach((section, index, sections) => {
            const {
                name,
                status
            } = section;

            html += /*html*/ `
                <div class='section-group'>
                    <div class='section-circle-bar-container'>
                        <div class='section-circle ${status}' data-name='${name}'>${index + 1}</div>
            `;

            if (index < sections.length - 1) {
                html += /*html*/ `
                    <div class='section-bar'></div>
                `;
            }
           
            html += /*html*/ `
                    </div>
                    <div class='section-name'>
                        <span class='section-name-text' data-name='${name}'>${name}</span>
                    </div>
                </div>
            `;
        });

        return html;
    }

    function scrollToSection(event) {
        const maincontainer = Action_Store.get('maincontainer');
        const name = this.querySelector('.section-name-text').innerText;
        const title = [...maincontainer
            .findAll(`[class*='title'], h1, h2, h3, h4, h5, h6`)]
            .find(node => node.innerText === name);
        const top = title.classList.contains('section-title') ? title.parentElement.offsetTop - title.offsetHeight : title.offsetTop;

        scrollElement.get().scrollTo({
            top,
            behavior: 'smooth'
        });
    }

    component.select = section => {
        const name = component.find(`.section-name-text[data-name='${section}']`);

        // console.log(name);

        if (name) {
            name.classList.add('selected');
        }
    }

    component.deselect = section => {
        const name = component.find(`.section-name-text[data-name='${section}']`);

        if (name) {
            name.classList.remove('selected');
        }
    }

    component.update = sections => {
        sections.forEach(section => {
            const {
                name,
                status
            } = section;

            const circle = component.find(`.section-circle[data-name='${name}']`);

            circle.classList.remove('complete', 'started','not-started');
            circle.classList.add(status);
        });
    }

    return component;
}