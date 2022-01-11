import { Component } from '../Actions/Component.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Row(render, options = {}) {
    const { parent } = options;
    
    const id = Store.getNextRow();

    const component = Component({
        html: /*html*/ `
            <div class='robi-row' data-row='${id}'></div>
        `,
        style: /*css*/ `
            #id.robi-row {
                width: 100%;
                display: block;
            }

            .robi-row:not(:last-child) {
                margin-bottom: 30px;
            }
        `,
        // FIXME: Do I like this? Does it assume too much?
        parent: parent || Store.get('viewcontainer'),
        events: [],
        onAdd() {
            render(component);
        }
    });

    component.add();
}
// @END-File
