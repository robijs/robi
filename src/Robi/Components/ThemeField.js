import { Component } from '../Actions/Component.js'
import { Themes } from '../Models/Themes.js'
import { App } from '../Core/App.js'

// @START-File
/**
 *
 * @param {*} param
 * @returns
 */
export function ThemeField(param) {
    const {
        label, margin, parent, position, selected
    } = param;

    const component = Component({
        html: /*html*/ `
            <div>
                ${label !== false ? /*html*/ `<label>Theme</label>` : ''}
                <div class='themes'>
                    ${
                        Themes.map(theme => {
                            // TODO: UI and Logic for choosing / switching themes
                            const { name, light, dark } = theme;
                            const { primary, secondary, background, color } = theme[App.get('prefersColorScheme')];

                            return /*html*/ `
                                <div class='d-flex flex-column justify-content-center align-items-center mb-4'>
                                    <div class='theme-app ${name === selected ? 'selected' : ''}' style='color: ${color};' data-theme='${name}'>
                                        <div class='theme-sidebar' style='background: ${background};'>
                                            <div class='theme-sidebar-title'>Title</div>
                                            <div class='theme-nav selected' style='background: ${primary}; color: white;'>Selected</div>
                                            <div class='theme-nav'>Route</div>
                                        </div>
                                        <div class='theme-maincontainer' style='background: ${secondary};'>
                                            <div class='theme-title'>${name}</div>
                                        </div>
                                    </div>
                                    <!-- Toggle Light/Dark Mode -->
                                    <div class='d-flex justify-content-center align-items-center'>
                                        <div class="mode mt-2 mr-2">
                                            <label style='display: none;' title='Hidden checkbox to toggle dark/light mode' for="toggle-${name}"></label>
                                            <input id="toggle-${name}" class="toggle" type="checkbox" style='color: ${primary}' checked>
                                        </div>
                                        <div class='mode-text' data-toggleid="toggle-${name}">Light</div>
                                    </div>
                                </div>
                            `
                        }).join('\n')
                    }
                </div>
            </div>
        `,
        style: /*css*/ `
            #id {
                margin: ${margin || '0px 0px 20px 0px'};
            }

            #id .themes {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                max-width: 995px;
            }

            #id label {
                font-weight: 500;
            }

            #id .theme-app {
                cursor: pointer;
                display: flex;
                height: 150px;
                width: 200px;
                border-radius: 10px;
                border: solid 1px ${App.get('borderColor')};
            }

            #id .theme-app.selected {
                box-shadow: 0px 0px 0px 3px mediumseagreen;
            }

            #id .theme-sidebar {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                border-right: solid 1px ${App.get('borderColor')};
                border-radius: 10px 0px 0px 10px;
                flex: 1;
            }

            #id .theme-sidebar-title {
                margin: 8px 4px 0px 4px;
                padding: 0px 8px;
                font-weight: 700;
                font-size: 13px;
            }

            #id .theme-nav {
                margin: 0px 4px;
                padding: 2px 8px;
                border-radius: 6px;
                font-weight: 500;
                font-size: 11px;
            }

            #id .theme-nav.selected {
                margin: 4px;
            }

            #id .theme-maincontainer {
                flex: 2;
                border-radius: 0px 10px 10px 0px;
            }

            #id .theme-title {
                margin: 8px;
                font-weight: 700;
                font-size: 13px;
            }

            /* Toggle - https://codepen.io/mrozilla/pen/OJJNjRb */
            .toggle {
                --size: 20px;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                outline: none;
                border: none;
                cursor: pointer;
                width: var(--size);
                height: var(--size);
                box-shadow: inset calc(var(--size) * 0.33) calc(var(--size) * -0.25) 0;
                border-radius: 999px;
                transition: all 200ms;
                z-index: 1;
            }

            .toggle:checked {
                --ray-size: calc(var(--size) * -0.4);
                --offset-orthogonal: calc(var(--size) * 0.65);
                --offset-diagonal: calc(var(--size) * 0.45);
                transform: scale(0.75);
                box-shadow: inset 0 0 0 var(--size), calc(var(--offset-orthogonal) * -1) 0 0 var(--ray-size), var(--offset-orthogonal) 0 0 var(--ray-size), 0 calc(var(--offset-orthogonal) * -1) 0 var(--ray-size), 0 var(--offset-orthogonal) 0 var(--ray-size), calc(var(--offset-diagonal) * -1) calc(var(--offset-diagonal) * -1) 0 var(--ray-size), var(--offset-diagonal) var(--offset-diagonal) 0 var(--ray-size), calc(var(--offset-diagonal) * -1) var(--offset-diagonal) 0 var(--ray-size), var(--offset-diagonal) calc(var(--offset-diagonal) * -1) 0 var(--ray-size);
            }

            .mode-text {
                font-size: 14px;
                font-weight: 500;
            }
        `,
        parent,
        position,
        events: [
            {
                selector: '#id .theme-app',
                event: 'click',
                listener(event) {
                    // Deselect all
                    component.findAll('.theme-app').forEach(node => {
                        node.classList.remove('selected');
                    });
                    
                    // Select
                    this.classList.add('selected');
                }
            },
            {
                selector: '#id .toggle',
                event: 'change',
                listener(event) {
                    const toggleid = event.target.toggleid;
                    const mode = event.checked ? 'light' : 'dark';

                    component.find(`.mode-text[data-toggleid='${toggleid}']`).innerText = mode;
                }
            }
        ]
    });

    // TODO: Set value
    component.value = () => {
        return component.find('.theme-app.selected')?.dataset.theme;
    };

    return component;
}
// @END-File
