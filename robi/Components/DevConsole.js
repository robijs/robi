import { Component, DeleteApp } from '../Actions.js';
import { UpdateApp } from "./UpdateApp";
import { ResetApp } from "./ResetApp";
import { ReinstallApp } from "./ReinstallApp";
import { ModifyFile } from "./ModifyFile";
import { App } from '../Core/Settings.js';

/**
 *
 * @param {*} param
 * @returns
 */

export function DevConsole(param) {
    const { parent, position } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                <div class='dev-console'>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Modify ${App.get('name')}</div>
                            <div class='dev-console-description'>Change list schemas in <code>App/src/lists.js</code> and app initialization settings in <code>App/src/app.js</code> right in the browser. Update app below to commit changes.</div>
                        </div>
                        <div class='d-flex flex-column justify-content-center'>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-code mb-3 dev-console-button modify-lists'>Modify lists</button>
                            </div>
                            <div class='d-flex align-items-center ml-5'>
                                <button class='btn btn-code dev-console-button modify-app'>Edit app initialization properties</button>
                            </div>
                        </div>
                    </div>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Update ${App.get('name')}</div>
                            <div class='dev-console-description'>Sync ${App.get('name')} with list schemas defined in <code>App/src/lists.js</code>. You can choose which new lists and columns will be created and which existing lists and columns will be deleted.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-robi-primary dev-console-button update'>Update ${App.get('name')}</button>
                        </div>
                    </div>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Reset lists</div>
                            <div class='dev-console-description'>Delete and recreate selected lists. All items from selected lists will be deleted. This can't be undone.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-secondary dev-console-button reset'>Choose lists to reset</button>
                        </div>
                    </div>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Reinstall ${App.get('name')}</div>
                            <div class='dev-console-description'>Delete and recreate all lists. Resets all settings. All items will be deleted. This can't be undone.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-secondary dev-console-button reinstall'>Remove data and reinstall ${App.get('name')}</button>
                        </div>
                    </div>
                    <div class='dev-console-row'>
                        <div class='dev-console-text'>
                            <div class='dev-console-label'>Delete ${App.get('name')}</div>
                            <div class='dev-console-description'>Delete all lists and remove all settings. All items will be deleted. This can't be undone. You will need to install the app again later.</div>
                        </div>
                        <div class='d-flex align-items-center ml-5'>
                            <button class='btn btn-danger dev-console-button delete'>Delete all lists and data</button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                padding: 20px 0px;
            }
            
            #id .alert {
                border: none;
                border-radius: 20px;
            }

            #id .dev-console-title {
                font-size: 1.5em;
                font-weight: 700;
                color: #24292f;
                margin-bottom: 10px;
            }

            #id .dev-console {
                width: 100%;
                border-radius: 20px;
                display: flex;
                flex-direction: column;
            }

            #id .dev-console-row {
                width: 100%;
                display: flex;
                justify-content: space-between;
                padding: 20px 30px;
                border-radius: 20px;
                background: ${App.get('backgroundColor')};
            }

            #id .dev-console-text {
                max-width: 700px;
            }

            #id .dev-console-label {
                font-weight: 600;
            }

            #id .dev-console-row:not(:last-child) {
                margin-bottom: 20px;
            }

            #id .dev-console-button {
                font-weight: 600;
                font-size: 14px;
                padding: 10px;
                height: fit-content;
                border-radius: 10px;
                width: 300px;
            }

            #id .btn-danger {
                background: firebrick;
            }

            #id .btn-code {
                background: #292D3E;
                border-color: #292D3E;
                color: white;
            }

            #id .btn-secondary {
                background: white;
                color: firebrick;
                border-color: firebrick;
            }

            #id .dev-console-button:focus,
            #id .dev-console-button:active {
                box-shadow: none;
            }
        `,
        parent: parent,
        position,
        events: [
            {
                selector: '#id .modify-lists',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    ModifyFile({
                        path: 'App/src',
                        file: 'lists.js'
                    });
                }
            },
            {
                selector: '#id .modify-app',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    ModifyFile({
                        path: 'App/src',
                        file: 'app.js'
                    });
                }
            },
            {
                selector: '#id .update',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    UpdateApp();
                }
            },
            {
                selector: '#id .reset',
                event: 'click',
                listener(event) {
                    console.log('Button:', event.target.innerText);

                    ResetApp();
                }
            },
            {
                selector: '#id .reinstall',
                event: 'click',
                listener(event) {
                    console.log('Button:', event.target.innerText);

                    ReinstallApp();
                }
            },
            {
                selector: '#id .delete',
                event: 'click',
                async listener(event) {
                    console.log('Button:', event.target.innerText);

                    DeleteApp();
                }
            }
        ],
        onAdd() {
            console.log('check if lists modified');
        }
    });

    return component;
}
