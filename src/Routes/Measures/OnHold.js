import { Container, Modal, BootstrapButton, MultiLineTextField, DateField, Alert } from '../../Robi/RobiUI.js'
import { App, Store, UpdateItem, Route } from '../../Robi/Robi.js'

export function OnHold({ item, parent, path }) {
    const { Id, OnHoldStart, OnHoldEnd, OnHoldComments, OnHoldName, Status } = item;

    // Place measure on hold
    if (Status === 'On Hold') {
        const bannerContainer = Container({
            width: '100%',
            padding: '0px 30px 10px 30px',
            parent,
            position: 'afterend'
        });

        bannerContainer.add();

        const user = JSON.parse(OnHoldName);

        const banner = Alert({
            type: 'robi-primary',
            classes: ['w-100'],
            text: `This measure was placed on hold <strong>${new Date(OnHoldStart).toLocaleDateString()}</strong> by <strong><a href='${App.get('site')}#Users/${user.Id}' target='_blank'>${user.Title.split(' ').slice(0, 2).join(' ')}</a></strong>. Remove it to make changes or upload data files.`,
            parent: bannerContainer,
        });
        
        banner.add();

        const removeHold = BootstrapButton({
            type: 'robi',
            value: 'Remove hold',
            parent,
            action() {
                const removeHoldModal = Modal({
                    title: false,
                    scrollable: true,
                    async addContent(modalBody) {
                        modalBody.classList.add('install-modal');

                        modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                            <h3 class='mb-2 mb-2'>Remove hold on Measure #${Id}</h3>
                        `);

                        const start = DateField({
                            label: 'Start Date',
                            value: OnHoldStart,
                            parent: modalBody
                        });
                    
                        start.add();

                        const end = DateField({
                            label: 'Estimated End Date',
                            value: OnHoldEnd,
                            parent: modalBody
                        });
                    
                        end.add();

                        const notes = MultiLineTextField({
                            label: 'Comments',
                            value: OnHoldComments,
                            parent: modalBody
                        });
                    
                        notes.add();

                        const message = Alert({
                            type: 'robi-primary',
                            text: 'Removing the hold on this mesaure will reset the dates and comments above.',
                            parent: modalBody
                        });

                        message.add();

                        const onHoldBtn = BootstrapButton({
                            async action() {
                                onHoldBtn.get().disabled = true;
                                onHoldBtn.get().innerHTML = /*html*/ `
                                    <span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span> Removing hold
                                `;

                                await UpdateItem({
                                    itemId: Id,
                                    list: 'Measures',
                                    data: {
                                        OnHoldEnd: null,
                                        OnHoldStart: null,
                                        OnHoldComments: null,
                                        OnHoldName: null,
                                        Status: null
                                    }
                                });

                                // Remove stored measure
                                Store.removeData(`edit measure ${Id}`);

                                $(removeHoldModal.get()).on('hidden.bs.modal', event => {
                                    Route(`Measures/${Id}${path ? `/${path}` : ''}`)
                                });

                                removeHoldModal.close();
                            },
                            // disabled: true,
                            classes: ['w-100 mt-5'],
                            width: '100%',
                            parent: modalBody,
                            type: 'robi',
                            value: 'Remove hold'
                        });
            
                        onHoldBtn.add();
            
                        const cancelBtn = BootstrapButton({
                            action(event) {
                                removeHoldModal.close();
                            },
                            classes: ['w-100 mt-2'],
                            width: '100%',
                            parent: modalBody,
                            type: 'light',
                            value: 'Cancel'
                        });
            
                        cancelBtn.add();
                    },
                    centered: true,
                    showFooter: false,
                });
            
                removeHoldModal.add();
            }
        });

        removeHold.add();
    } else {
        const placeOnHold = BootstrapButton({
            type: 'robi',
            value: 'Place on hold',
            parent,
            action() {
                const onHoldModal = Modal({
                    title: false,
                    scrollable: true,
                    async addContent(modalBody) {
                        modalBody.classList.add('install-modal');

                        modalBody.insertAdjacentHTML('beforeend', /*html*/ `
                            <h3 class='mb-2 mb-2'>Place Measure #${Id} on hold</h3>
                        `);

                        const start = DateField({
                            label: 'Start Date',
                            parent: modalBody
                        });
                    
                        start.add();

                        const end = DateField({
                            label: 'Estimated End Date',
                            parent: modalBody
                        });
                    
                        end.add();

                        const notes = MultiLineTextField({
                            label: 'Comments',
                            parent: modalBody
                        });
                    
                        notes.add();
                        const onHoldBtn = BootstrapButton({
                            async action() {
                                onHoldBtn.get().disabled = true;
                                onHoldBtn.get().innerHTML = /*html*/ `
                                    <span class="spinner-border" role="status" aria-hidden="true" style="width: 20px; height: 20px; border-width: 3px"></span> Placing on hold
                                `;

                                await UpdateItem({
                                    itemId: Id,
                                    list: 'Measures',
                                    data: {
                                        OnHoldEnd: toSPDate(end.value()),
                                        OnHoldStart: toSPDate(start.value()),
                                        OnHoldComments: notes.value(),
                                        OnHoldName: JSON.stringify(Store.user()),
                                        Status: 'On Hold'
                                    }
                                });

                                // Remove stored measure
                                Store.removeData(`edit measure ${Id}`);

                                $(onHoldModal.get()).on('hidden.bs.modal', event => {
                                    Route(`Measures/${Id}${path ? `/${path}` : ''}`)
                                });

                                onHoldModal.close();
                            },
                            // disabled: true,
                            classes: ['w-100 mt-5'],
                            width: '100%',
                            parent: modalBody,
                            type: 'robi',
                            value: 'Place on hold'
                        });
            
                        onHoldBtn.add();
            
                        const cancelBtn = BootstrapButton({
                            action() {
                                onHoldModal.close();
                            },
                            classes: ['w-100 mt-2'],
                            width: '100%',
                            parent: modalBody,
                            type: 'light',
                            value: 'Cancel'
                        });
            
                        cancelBtn.add();

                        function toSPDate(date) {
                            const hours = new Date().getUTCHours()
                            const hh = hours < 10 ? `0${hours}` : hours;
                            return `${date}T${hh}:00:00Z`;
                        }
                    },
                    centered: true,
                    showFooter: false,
                });
            
                onHoldModal.add();
            }
        });

        placeOnHold.add();
    }
}