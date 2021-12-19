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
                        <div class='add-table'>
                            <div class='filter d-flex justify-content-end'>
                                <div class="btn-group" role="group">
                                    <div type="button" class="btn btn-robi-reverse"></div>
                                    <div type="button" class="btn btn-outline-robi"></div>
                                    <div type="button" class="btn btn-outline-robi"></div>
                                </div>
                            </div>
                            <div class='buttons'>
                                <div class='btn btn-robi' style='line-height: 0;'>&plus;</div>
                                <div class='btn btn-robi'></div>
                                <div class='btn btn-robi'></div>
                            </div>
                            <div class='columns d-flex'>
                                <div class='column'></div>
                                <div class='column'></div>
                                <div class='column'></div>
                            </div>
                            <div class='rows'>
                                <div class='add-table-row'></div>
                                <div class='add-table-row'></div>
                                <div class='add-table-row'></div>
                            </div>
                        </div>
                        </button>
                        <button class="dropdown-item" type="button">
                            <span>
                                <svg class="icon" style="font-size: 20;">
                                    <use href="#icon-bs-list-ul"></use>
                                </svg>
                            </span>
                            <!-- <span>
                                Table
                            </span> -->
                        </button>
                        <button class="dropdown-item" type="button">
                            <span>
                                <svg class="icon" style="font-size: 20;">
                                    <use href="#icon-bs-list-ul"></use>
                                </svg>
                            </span>
                            <!-- <span>
                                Table
                            </span> -->
                        </button>
                    </div>
                </div>

                <!-- Test -->

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
                transition: transform 300ms ease;
            }

            #id .scale-up {
                transform: scale(2);
            }

            #id .dropdown-menu {
                left: -54.81px !important;
                top: -45px !important;
                background: transparent;
                border-radius: 10px;
                border: none;
                padding: 0px;
                min-width: 0px;
            }

            #id .dropdown-item {
                display: flex;
                color: ${App.get('primaryColor')};
                align-items: center;
                justify-content: center;
                padding: 10px;
                border-radius: 20px;
                /* width: 40px; */
                /* height: 40px; */
            }

            #id .dropdown-menu .dropdown-item .icon {
                fill: ${App.get('primaryColor')};
            }

            .grown-in-center {
                background: white;
                animation: 150ms ease-in-out forwards grown-in-center;
                border-radius: 20px;
                box-shadow: rgb(0 0 0 / 10%) 0px 0px 16px -2px;
                padding: 10px;
                display: flex;
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

            /* Add table */
            #id .add-table {
                border-radius: 20px;
                padding: 10px;
                border: solid 2px ${App.get('primaryColor')};
            }

            #id .add-table .buttons .btn {
                height: 15px;
            }

            #id .add-table .filter .btn-outline-robi {
                border-width: 2px;
            }

            #id .columns .column {
                flex: 1;
                height: 2px;
                border-radius: 2px;
                margin: 2px 0px;
                background: ${App.get('defaultColor')};
            }

            #id .columns .column:not(:last-child) {
                margin-right: 5px;
            }

            #id .rows .add-table-row {
                height: 10px;
                border-radius: 10px;
            }

            #id .rows .add-table-row:nth-of-type(odd) {
                background: ${App.get('backgroundColor')};
            }

            #id .rows .add-table-row:nth-of-type(even) {
                background-color: ${App.get('primaryColor') + ( App.get('selectedRowOpacity') || 10 )} !important;
            }

            #id .rows .add-table-row:first-child {
                margin-top: 2px;
            }

            #id .rows .add-table-row:not(:last-child) {
                margin-bottom: 2px;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .tools',
                event: 'click',
                listener(event) {
                    event.target.classList.add('scale-up');
                }
            }
        ],
        onAdd() {
            $(`#${component.get().id}`).on('hidden.bs.dropdown', function () {
                component.find('.tools').classList.remove('scale-up');
            });
        }
    });

    return component;
}
// @END-File
