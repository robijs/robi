/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_NavMenu(param) {
    const {
        title,
        sections,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='nav-menu'>
                ${title ? /*html*/`<div class='nav-menu-title'>${title}</div>` : ''}
                <div class='nav-menu-group-container'>
                    ${createHTML()}
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Root */
            .nav-menu {
                height: 100%;
                padding: 40px;
                display: inline-flex;
                flex-direction: column;
                overflow: overlay;
            }

            /* Title */
            .nav-menu-title {
                font-size: 1.5em;
                color: ${Setting_App.primaryColor};
            }

            /* Option */
            .nav-menu-option {
                display: flex;
                align-items: center;
                justify-content: flex-start;
            }

            /* Triangle */
            .nav-menu-triangle {
                user-select: none;
                cursor: pointer;
                color: ${Setting_App.primaryColor};
                font-size: 1.5em;
            }
        `,
        parent,
        position: position || 'beforeend',
        events: [
            {
                selector: '.nav-menu-triangle',
                event: 'click',
                listener(event) {
                    const currentStatus = event.target.dataset.status;

                    if (currentStatus === 'closed') {
                        event.target.innerHTML = '&blacktriangledown;';
                        event.target.dataset.status = 'open'

                        const section = sections.find(section => section.title === event.target.nextElementSibling.innerText);
                        const option = event.target.parentElement;

                        let html = /*html*/ `
                            <div class='nav-menu-sub-obtions'>
                        `;

                        section.subsections.forEach(subsection => {
                            const {
                                title
                            } = subsection;

                            html += /*html*/ `
                                <div class='nav-menu-option'>
                                    <span>${title}</span>
                                </div>
                            `;
                        });

                        html += /*html*/ `
                            </div>
                        `;

                        option.insertAdjacentHTML('beforeend', html);
                    } else {
                        event.target.innerHTML = '&blacktriangleright;';
                        event.target.dataset.status = 'closed';
                    }
                }
            }
        ]
    });

    function createHTML() {
        let html = '';

        sections.forEach(section => {
            const {
                title,
                subsections
            } = section;
            
            html += /*html*/ `
                <div class='nav-menu-option'>
                    <span class='nav-menu-triangle' data-status='closed'>&blacktriangleright;</span>
                    <span>${title}</span>
                </div>
            `;
        });

        return html;
    }

    return component;
}