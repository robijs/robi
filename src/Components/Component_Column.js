/** Actions */
import Action_Component from '../Actions/Action_Component.js'

export default function Component_Tree(param) {
    const {
        data,
        parent,
        position,
    } = param;

    const component = Action_Component({
        html: /*html*/ `
            <div class='tree'>
                ${buildTree()}    
            </div>
        `,
        style: /*css*/ `
            /* Tree */
            #id {
                width: 100%;
                /* height: */
                cursor: pointer;
                text-align: left;
                font-weight: 400;
                padding: 15px 14px;
                font-size: 1.7em;
                border-left: solid 3px transparent;
                border-right: solid 3px transparent;
            }

            #id .tree-label,
            #id .tree-item-label {
                font-size: 1.5em;
                font-size: .7em;
                display: flex;
                align-items: center;
            }

            #id .tree-label span,
            #id .tree-item-label span {
                color: ${Setting_App.secondaryColor};
            }

            #id .tree-label .triangle,
            #id .tree-item-label .triangle {
                font-size: 1.5em;
                transition: 150ms;
                -webkit-transition: 150ms;
                -moz-transition: 150ms;
                -ms-transition: 150ms;
                -o-transition: 150ms;
            }

            #id .tree-items,
            #id .tree-item-items {
                display: none;
            }

            #id .tree-item {
                font-size: .6em;
                margin-left: 30px;
            }

            /** Rotate down */
            .rotate-down {
                transition: 150ms;
                -webkit-transition: 150ms;
                -moz-transition: 150ms;
                -ms-transition: 150ms;
                -o-transition: 150ms;
                -webkit-transform: rotate(90deg);
                -moz-transform: rotate(90deg);
                -o-transform: rotate(90deg);
                -ms-transform: rotate(90deg);
                transform: rotate(90deg);
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '.tree-label',
                event: 'click',
                listener(event) {
                    const open = this.dataset.open;

                    console.log(open);

                    if (open === 'no') {
                        this.dataset.open = 'yes';
                        
                        this.querySelector('.triangle').classList.add('rotate-down');
                        
                        component.find('.tree-items').style.display = 'initial';
                    } else if (open === 'yes') {
                        this.dataset.open = 'no';
                        
                        this.querySelector('.triangle').classList.remove('rotate-down');
                        
                        component.find('.tree-items').style.display = 'none';
                    }
                }
            }
        ]
    });

    function buildTree() {
        const {
            label,
            items
        } = data;
        
        console.log(data);
        
        let html = /*html*/ `
            <div class='tree-label' data-open='no'>
                <span>${label}</span>
                <span class='triangle'>&blacktriangleright;</span>
            </div>
            <div class='tree-items'>
        `

        items.forEach(item => {
            const {
                label,
                items
            } = item;

            html += /*html*/ `
                <div class='tree-item' data-open='no'>
                    <div class='tree-item-label'>
                        <span>${label}</span>
                        <span class='triangle'>&blacktriangleright;</span>
                    </div>
                    <div class='tree-item-items'>
            `;

            items.forEach(item => {
                html += /*html*/ `
                    <div class='tree-item-item'>${item}</div>
                `;
            });

            html += /*html*/ `
                </div>
            `;  
        });

        html += /*html*/ `
            </div>
        `;

        return html;
    }

    return component;
}