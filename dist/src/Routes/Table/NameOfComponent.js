import { Component } from '../Robi.js'

// @START-File
/**
 * 
 * @param {Object} param - Object passed in as only argument to a Robi component
 * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. 
 * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.
 * @returns {Object} - Robi component.
 */
export function NameOfComponent(param) {
    const {
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class=''>

            </div>
        `,
        style: /*css*/ `
            #id {

            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id',
                event: 'click',
                listener(event) {
                    console.log(`${component.get().id} clicked`);
                }
            }
        ],
        onAdd() {

        }
    });

    return component;
}
// @END-File
