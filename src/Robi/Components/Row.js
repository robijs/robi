import { Component } from '../Actions/Component.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Row(render) {
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
        `,
        parent: Store.get('viewcontainer'),
        events: [],
        onAdd() {
            render(component);
        }
    });

    component.add();
}
// @END-File
