import { Component } from '../Actions/Component.js'
import { Store } from '../Core/Store.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function Row(render, options = {}) {
    const { parent, display, height, minHeight, flex, align } = options;
    
    const id = Store.getNextRow();

    const component = Component({
        html: /*html*/ `
            <div class='robi-row' data-row='${id}'></div>
        `,
        style: /*css*/ `
            /* TODO: Make flex work */
            #id.robi-row {
                width: 100%;
                display: ${display || 'block'};
                ${height ? `height: ${height};` : ''}
                ${minHeight ? `min-height: ${minHeight};` : ''}
                ${flex ? `flex: ${flex};` : ''}
                ${align ? `align-items: ${align};` : ''}
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
