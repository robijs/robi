/** Actions */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_QPPFiscalYear(param) {
    const {
        fiscalYear,
        dataName,
        items,
        titleColor,
        border,
        background,
        padding,
        margin,
        minWidth,
        parent,
        width,
        position,
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='round-card'>
                <div class='round-card-title'>
                    ${dropdownTemplate(items)}
                <span>
            </div>
        `,
        style: /*css*/ `
            #id.round-card {
                display: inline-flex;
                flex-direction: column;
                background: ${background || 'white'};
                padding: ${padding || '20px'};
                margin: ${margin || '0px'};
                min-width: ${minWidth || 'initial'};
                width: ${width || 'initial'};
                border-radius: 4px;
                /* border: ${Setting_App.defaultBorder}; */
                border: ${border || 'solid 1px rgba(0, 0, 0, .125)'};
            }

            #id .round-card-title {
                font-size: 1.5em;
                font-weight: 700;
                color: ${titleColor || Setting_App.defaultColor};
            }

            #id .round-card-title *,
            #id .round-card-title *:hover,
            #id .round-card-title *:active,
            #id .round-card-title *:focus {
                color: ${titleColor || Setting_App.defaultColor};
            }

            #id .nav-pills .show > .nav-link,
            #id .dropdown-item.active, 
            #id .dropdown-item:active {
                color: ${titleColor || Setting_App.defaultColor};
                background-color: initial;
            }

            #id .dropdown-item {
                cursor: pointer;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .dropdown-item',
                event: 'click',
                listener(event) {
                    const path = event.target.dataset.path;

                    console.log(path);
                }
            }
        ]
    });

    function dropdownTemplate(items) {
        let html = /*html*/ `
            <span data-name='${dataName || fiscalYear}' class='${items.length === 0 ? 'no-menu' : ''}'>
                <ul class='nav nav-pills'>
                    <li class='nav-item dropdown'>
                        <a class='nav-link dropdown-toggle' data-toggle='dropdown' href='#' role='button' aria-haspopup='true' aria-expanded='false'>Fiscal Year: <span style="font-weight: 400;">${fiscalYear}</a>
                        <div class='dropdown-menu'>
        `;
        
        items.forEach(part => {
            const {
                label,
                path
            } = part;

            html += /*html*/ `
                <span class='dropdown-item' data-path='${path}'>${label}</span>
            `;
        });

        html += /*html*/ `
                        </div>
                    </li>
                </ul>
            </span>
        `;

        return html;
    }

    return component;
}