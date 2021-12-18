import { Component } from '../Actions/Component.js'
import { GenerateUUID } from '../Actions/GenerateUUID.js'
import { App } from '../Core/App.js'

// @START-File
/**
 * 
 * @param {Object} param - Object passed in as only argument to a Robi component
 * @param {(Object | HTMLElement | String)} param.parent - A Robi component, HTMLElement, or css selector as a string. 
 * @param {String} param.position - Options: beforebegin, afterbegin, beforeend, afterend.
 * @returns {Object} - Robi component.
 */
export function ViewTools(param) {
    const {
        parent,
        position
    } = param;

    const id = GenerateUUID();

    const component = Component({
        html: /*html*/ `
            <div class=''>
                <button class="btn tools" type="button" id="${id}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    •••
                </button>
                <div class="dropdown-menu" aria-labelledby="${id}">
                    <div class="grown-in-center">
                        <button class="dropdown-item" type="button">
                            <span>
                                <svg class="icon" style="font-size: 16;">
                                    <use href="#icon-bs-list-ul"></use>
                                </svg>
                            </span>
                            <span>
                                Table
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0px;
                right: 0px;
                height: 62px;
                width: 100%;
                color: ${App.get('primaryColor')};
            }

            #id .tools {
                cursor: pointer;
                color: ${App.get('primaryColor')};
                font-size: 20px;
            }

            #id .dropdown-menu {
                left: -54.81px !important;
                background: transparent;
                border-radius: 10px;
                border: none;
                padding: 0px;
            }

            #id .dropdown-menu .dropdown-item {
                display: flex;
                justify-content: space-between;
                color: ${App.get('primaryColor')};
            }

            #id .dropdown-menu .dropdown-item .icon {
                fill: ${App.get('primaryColor')};
            }

            .grown-in-center {
                background: #e9ecef;
                animation: 150ms ease-in-out forwards grown-in-center;
                border-radius: 20px;
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                padding: .5rem;
            }

            @keyframes grown-in-center {
                from {
                    transform: scale(0);
                    transform-origin: center;
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    transform-origin: center;
                    opacity: 1;
                }
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
