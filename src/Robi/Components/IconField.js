// This file may be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made from the front end may not render properly.

import { Component } from '../Actions/Component.js'
import { HTML } from '../Actions/HTML.js'

// @START-File
/**
 * 
 * @param {Object} param - Object passed in as only argument to a Robi component
 * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. 
 * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.
 * @returns {Object} - Robi component.
 */
export function IconField(param) {
    const {
        parent,
        position,
        icons
    } = param;

    const component = Component({
        html: /*html*/ `
            <div class='icon-field'>
                <div class='d-flex flex-wrap'>
                    ${
                        HTML({
                            items: icons,
                            each(icon) {
                                return /*html*/ `
                                    <div class='icon-container d-flex justify-content-center' data-target='true'>
                                        <svg class='icon' style='font-size: 32px; fill: var(--primary);'>
                                            <use href='#${icon}'></use>
                                        </svg>
                                    </div>
                                `
                            }
                        })
                    }
                </div>
            </div>
        `,
        style: /*css*/ `
            #id .icon-container {
                cursor: pointer;
                padding: 20px;
                margin: 10px;
                background-color: var(--background);
                border-radius: 15px;
                transition: background-color 150ms ease;
            }

            #id .icon-container:hover {
                background: var(--primary20);
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
