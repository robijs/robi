import { Component } from '../Actions/Component.js'
import { App } from '../Core.js';

/**
 *
 * @param {*} param
 * @returns
 */
export function Modal(param) {
    const {
        title, titleStyle, headerStyle, footerStyle, close, addContent, buttons, centered, fade, background, fullSize, showFooter, scrollable, contentPadding, parent, disableBackdropClose, position
    } = param;

    const component = Component({
        html: /*html*/ `
            <!-- Modal -->
            <!-- <div class='modal${fade ? ' fade' : ''}' tabindex='-1' role='dialog' aria-hidden='true'> -->
            <div class='modal fade' tabindex='-1' role='dialog' aria-hidden='true' ${disableBackdropClose ? 'data-keyboard="false" data-backdrop="static"' : ''}>
                <!-- <div class='modal-dialog modal-dialog-zoom ${scrollable !== false ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'> -->
                <div class='modal-dialog modal-dialog-zoom ${scrollable ? 'modal-dialog-scrollable' : ''} modal-lg${centered === true ? ' modal-dialog-centered' : ''}' role='document'>
                    <div class='modal-content'>
                        ${title || close !== false ?
                /*html*/ `<div class='modal-header' ${headerStyle ? `style='${headerStyle}'` : ''}>
                                    <h5 class='modal-title' ${titleStyle ? `style='${titleStyle}'` : ''}>${title || ''}</h5>
                                    ${close !== false ?
                        /*html*/ `
                                            <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                                                <!-- <span aria-hidden='true'>&times;</span> -->
                                                <!-- <span aria-hidden='true'>&times;</span> -->
                                                <svg class='icon'><use href='#icon-bs-x-circle-fill'></use></svg>
                                            </button>
                                        ` :
                    ''}
                                </div>`
                : ''}
                        <div class='modal-body'>
                            <!-- Form elements go here -->
                        </div>
                        <div class='modal-footer${showFooter ? '' : ' hidden'}' ${footerStyle ? `style='${footerStyle}'` : ''}>
                            ${addFooterButtons()}
                        </div>
                    </div>
                </div>
            </div>
        `,
        style: /*css*/ `
            /** Title */
            #id .modal-title {
                color: ${App.get('primaryColor')};
            }

            #id.modal {
                overflow-y: overlay;
            }

            #id.modal.show {
                padding-left: 0px !important;
            }

            /** Modal Content */
            #id .modal-content {
                border-radius: 10px;
                border: none;
                background: ${background || ''};
                padding: ${contentPadding || '0px'};
            }

            /** Modal Body */
            #id .modal-body {

            }

            /** Header */
            #id .modal-header {
                border-bottom: none;
            }
            
            /** Footer */
            #id .modal-footer {
                border-top: none;
            }

            /** Button radius */
            #id .btn {
                border-radius: 10px;
            }

            #id .btn * {
                color: inherit;
            }

            /** Button color */
            #id .btn-success {
                background: seagreen;
                border: solid 1px seagreen;
            }

            #id .btn-robi-primary {
                background: royalblue;
                border: solid 1px royalblue;
            }

            #id .btn-danger {
                background: firebrick;
                border: solid 1px firebrick;
            }

            #id .btn-secondary {
                background: none;
                border: solid 1px transparent;
                color: ${App.get('defaultColor')};
                font-weight: 500;
            }

            /** Button focus */
            #id .btn:focus {
                box-shadow: none;
            }

            /** Close focus */
            #id .close:focus {
                outline: none;
            }

            /** Close */
            #id .close {
                font-weight: 500;
                text-shadow: unset;
                opacity: 1;
            }

            #id .close .icon {
                fill: lightgray;
            }

            /** Footer */
            #id .modal-footer.hidden {
                display: none;
            }

            /** Zoom in */
            #id.fade {
                transition: opacity 75ms linear;
            }

            #id.modal.fade .modal-dialog {
                transition: transform 150ms ease-out, -webkit-transform 150ms ease-out;
            }

            #id.modal.fade .modal-dialog.modal-dialog-zoom {
                -webkit-transform: translate(0,0)scale(.5);
                transform: translate(0,0)scale(.5);
            }
            #id.modal.show .modal-dialog.modal-dialog-zoom {
                -webkit-transform: translate(0,0)scale(1);
                transform: translate(0,0)scale(1);
            }

            /** Override bootstrap defaults */
            ${fullSize ?
            /*css*/ `
                    #id .modal-lg, 
                    #id .modal-xl,
                    #id .modal-dialog {
                        max-width: initial !important;
                        margin: 40px !important;
                    }
                ` :
                ''}
        `,
        parent,
        position,
        events: [
            {
                selector: `#id .btn`,
                event: 'click',
                listener(event) {
                    const button = buttons.footer.find(item => item.value === event.target.dataset.value);

                    if (button && button.onClick) {
                        button.onClick(event);
                    }
                }
            }
        ],
        onAdd() {
            $(`#${component.get().id}`).modal();

            if (addContent) {
                addContent(component.getModalBody());
            }

            /** Close listener */
            $(component.get()).on('hidden.bs.modal', function (e) {
                component.remove();
            });

            if (title) {
                /** Scroll listener */
                component.find('.modal-body').addEventListener('scroll', event => {
                    if (event.target.scrollTop > 0) {
                        event.target.style.borderTop = `solid 1px ${App.get('sidebarBorderColor')}`;
                    } else {
                        event.target.style.borderTop = `none`;
                    }
                });
            }
        }
    });

    function addFooterButtons() {
        let html = '';

        if (buttons && buttons.footer && Array.isArray(buttons.footer) && buttons.footer.length > 0) {
            // Delete button on left
            const deleteButton = buttons.footer.find(button => button.value.toLowerCase() === 'delete');

            if (deleteButton) {
                const { value, disabled, data, classes, inlineStyle } = deleteButton;
                html += /*html*/ `
                    <div style='flex: 2'>
                        <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                    </div>
                `;
            }

            html += /*html*/ `
                <div>
            `;

            // All other buttons on right
            buttons.footer
                .filter(button => button.value.toLowerCase() !== 'delete')
                .forEach(button => {
                    const {
                        value, disabled, data, classes, inlineStyle
                    } = button;

                    html += /*html*/ `
                    <button ${inlineStyle ? `style='${inlineStyle}'` : ''} type='button' class='btn ${classes}' ${buildDataAttributes(data)} data-value='${value}' ${disabled ? 'disabled' : ''}>${value}</button>
                `;
                });

            html += /*html*/ `
                </div>
            `;
        }

        return html;
    }

    function buildDataAttributes(data) {
        if (!data) {
            return '';
        }

        return data
            .map(attr => {
                const {
                    name, value
                } = attr;

                return `data-${name}='${value}'`;
            })
            .join(' ');
    }

    component.getModalBody = () => {
        return component.find('.modal-body');
    };

    component.hideFooter = () => {
        component.find('.modal-footer').classList.add('hidden');
    };

    component.showFooter = () => {
        component.find('.modal-footer').classList.remove('hidden');
    };

    component.getModal = () => {
        return $(`#${component.get().id}`);
    };

    component.close = () => {
        return $(`#${component.get().id}`).modal('hide');
    };

    component.getButton = value => {
        return component.find(`button[data-value='${value}']`);
    };

    component.scrollable = value => {
        if (value === true) {
            component.find('.modal-dialog').classList.add('modal-dialog-scrollable');
        } else if (value === false) {
            component.find('.modal-dialog').classList.remove('modal-dialog-scrollable');
        }
    };

    return component;
}
