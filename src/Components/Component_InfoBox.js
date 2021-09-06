/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Global Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_InfoBox(options) {
    const {
        page,
        pages,
        start,
        end,
        total
    } = options;

    const component = Component({
        type: 'info-box',
        html: /*html*/ `
            <div class='info-box'>
                <div>
                    <span>Page</span>
                    <span class="page-count">${page}</span>
                    <span>of</span>
                    <span class="page-total">${pages}</span>
                </div>
                <div>
                    <span>Showing</span>
                    <span class="item-start">${start}</span>
                    <span>-</span>
                    <span class="item-end">${end}</span>
                    <span>of</span>
                    <span class="item-total">${total}</span>
                </div>
            </div>
        `,
        style: /*css*/ `
            /* Icon */
            .info-box {
                user-select: none;
                display: inline-flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                padding: 11.5px;
                margin: 15px 0px;
                background: white;
                border:  ${Setting_App.defaultBorder};
            }

            .info-box > div {
                margin-right: 20px;
            }

            .page-count,
            .page-total,
            .item-start,
            .item-end,
            .item-total {
                font-weight: 500;
            }
        `,
        parent: options.parent,
        position: options.position || 'beforeend',
        events: [
            
        ]
    });

    component.update = (options) => {
        const {
            page,
            start,
            end,
        } = options;
        
        const pageCount = component.find(`.page-count`);
        const itemStart = component.find(`.item-start`);
        const itemEnd = component.find(`.item-end`);

        pageCount.innerText = page;
        itemStart.innerText = start;
        itemEnd.innerText = end;
    }

    return component;
}