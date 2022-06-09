// This file can be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made with GUI tools will not render properly.

import { Component } from '../../Robi/Robi.js'

// @START-Test
/**
 * 
 * @param {Object} param - Object passed in as only argument to a Robi component
 * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. 
 * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.
 * @returns {Object} - Robi component.
 */
export default function Test(param) {
    const {
        parent,
        position
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class=''>
                Test
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
// @END-Test
