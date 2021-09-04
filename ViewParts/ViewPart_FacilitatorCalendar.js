/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'
import Action_DeleteItem from '../Actions/Action_DeleteItem.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_CreateICS from '../Actions/Action_CreateICS.js'
import Action_SendEmail from '../Actions/Action_SendEmail.js'
import Action_AttachFiles from '../Actions/Action_AttachFiles.js'

/** Components */
import Component_AcceptedCalendarDashboard from '../Components/Component_AcceptedCalendarDashboard.js'
import Component_Calendar from '../Components/Component_Calendar.js'
import Component_Container from '../Components/Component_Container.js'
import Component_Modal from '../Components/Component_Modal.js'
import Component_RadioButtons from '../Components/Component_RadioButtons.js'
import Component_DropDownField from '../Components/Component_DropDownField.js'
import Component_TimeSlotCounter from '../Components/Component_TimeSlotCounter.js'
import Component_DuplicateWeek from '../Components/Component_DuplicateWeek.js'
import Component_TimeSlots from '../Components/Component_TimeSlots.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_CommandsDashboard from '../Components/Component_CommandsDashboard.js'

/** View Parts */
import ViewPart_FacilitatorAcceptedMeetings from '../ViewParts/ViewPart_FacilitatorAcceptedMeetings.js'

/**
 * Calendar view part for Facilitators.
 * 
 * @param {Object} param - Single object acts as a function interface. 
 *                         Data and methods can be passed to this function as properies of this object.
 * @param {(Object|String)} param.parent - Compoent object or html/css selector string.
 */
export default async function ViewPart_FacilitatorCalendar(param) {
    const { 
        parent /** parent property - @description Parent element gets passed from the caller. */
    } = param; 

    /** Holds the Calendar and the List of meetings. */
    const container = Component_Container({
        margin: '40px 0px',
        height: '80%',
        parent
    });

    container.add();

    /** leftContainer - @description Container of the Calendar element. */
    const leftContainer = Component_Container({
        direction: 'column',
        flex: '2',
        height: '100%',
        parent: container
    });

    leftContainer.add();    

    /** rightContainer - @description List of meetings Accepted. */
    const rightContainer = Component_Container({
        direction: 'column',
        align: 'center',
        flex: '1',
        height: '100%',
        parent: container
    });

    rightContainer.add();

    /** Make these components accessible */
    let modal;
    let timeSlotCounter;
    let weeks;
    let timeSlots;
    let groupRadioButtons;
    let commandField;
    let acceptedCalendar;

    /** Commands and Groups*/
    const {
        commands,
        groups
    } = await getCommandsAndGroups();

    /** Commands Dashboard */
    let selectedDashboardGroup;
    let commandsDashboard;

    /** Accepted Dashboard */
    const acceptedCalendarDashboard = Component_AcceptedCalendarDashboard({
        title: 'Accepted Meetings',
        groups: groups.map(item => {
            const {
                Group
            } = item;
            
            return {
                label: Group,
                count: 0,
                total: commands.length,
                description: 'Commands accepted',
                color: App.primaryColor,
                background: 'white'
            }
        }),
        action(event) {
            /** Toggle color */
            if (selectedDashboardGroup) {
                acceptedCalendarDashboard.toggleColor(selectedDashboardGroup, false);
            }

            /** Dismiss selected dashboard on second click */
            if (selectedDashboardGroup && selectedDashboardGroup.dataset.label === this.dataset.label) {
                commandsDashboard.remove();
                commandsDashboard = undefined;
                selectedDashboardGroup = undefined;

                return;
            } else if (selectedDashboardGroup !== undefined) {
                /** Remove previous dashboard */
                commandsDashboard.remove();
            }

            /** Show new dashboard */
            const accepted = acceptedCalendar
                .getEvents()
                .filter(event => event.extendedProps.FK_Group === this.dataset.label)

            const unAccepted = commands
                .filter(item => !accepted.map(event => event.extendedProps.FK_Command).includes(item.Command))
                .map(item => item.Command);

            commandsDashboard = Component_CommandsDashboard({
                title: this.dataset.label,
                commands: {
                    accepted: accepted.map(event => {
                        const {
                            start,
                            end
                        } = event;

                        const eventDate = start.toLocaleString('default', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        });
                        const startTime = start.toLocaleString('default', {timeStyle: 'short'});
                        const endTime = end.toLocaleString('default', {timeStyle: 'short'});
                        
                        return {
                            command: event.extendedProps.FK_Command,
                            event: `${eventDate} - ${startTime} to ${endTime}`
                        };
                    }),
                    unAccepted
                },
                parent: acceptedCalendarDashboard,
                position: 'afterend'
            });

            commandsDashboard.add();

            /** Toggle color */
            acceptedCalendarDashboard.toggleColor(this, true);
            
            /** Set selected dashboard */
            selectedDashboardGroup = this;
        },
        size: '1.5em',
        weight: '500',
        parent: rightContainer
    });

    acceptedCalendarDashboard.add();

    /** Calendar */
    const openCalendar = Component_Calendar({
        parent: leftContainer,
        height: `100%`,
        padding: '0px 15px 0px 0px',
        /** {@link https://fullcalendar.io/docs/events-function} */
        async events(info, successCallback, failureCallback) {
            const {
                start,
                end,
                endStr,
                startStr
            } = info;
            
            /** Empty events */
            removeEvents();

            /** Get events */
            const {
                eventItems,
                acceptedEventItems
            } = await getEventsListItems(startStr, endStr);

            /** For each event item, return an object for the api to render the event */
            successCallback(formatEvents(eventItems, acceptedEventItems));

            /** Set acceptedCalendar */
            setAcceptedCalendar(start, end);
        },
        /** {@link https://fullcalendar.io/docs/eventClick} */
        async eventClick(info) {
            /** Remove previous modal from DOM */
            removeModal();

            /** Add new modal */
            addModal(info);
        },
        /** {@link https://fullcalendar.io/docs/dateClick} */
        dateClick(info) {
            /** Remove previous modal from DOM */
            if (modal) {
                modal.remove();
            }

            /** Click event for user date click -  Add Date Modal */
            modal = Component_Modal({
                title: info.date.toLocaleString('default', {
                    dateStyle: 'full'
                }),
                addContent(modalBody) {
                    /** Select Group */
                    groupRadioButtons = Component_RadioButtons({
                        label: 'Choose group',
                        description: '',
                        buttons: [
                            {
                                id: 0,
                                value: 'Infection Prevention'
                            },
                            {
                                id: 0,
                                value: 'Patient Safety'
                            }
                        ],
                        onSetValue() {
                            const selectedButton = groupRadioButtons.value();

                            if (selectedButton) {
                                startTime.enable();
                            }
                        },
                        parent: modalBody
                    });

                    groupRadioButtons.add();

                    /** Time Container */
                    const timeContainer = Component_Container({
                        parent: modalBody 
                    });

                    timeContainer.add();

                    /** Start Time*/
                    const startTime = Component_DropDownField({
                        label: 'From',
                        direction: 'row',
                        width: '75px',
                        editable: false,
                        disabled: true,
                        dropDownOptions: buildHourOptions(),
                        parent: timeContainer,
                        onSetValue() {
                            /** Reset time slots */
                            if (timeSlots) {
                                timeSlots.remove();
                            }

                            /** Set Options */
                            const i = parseInt(startTime.value().split(':')[0]);

                            endTime.setOptions({
                                options: buildHourOptions(i + 1)
                            });

                            /** Enable endTime */
                            endTime.enable();

                            /** Reset end time if less */
                            if (parseInt(endTime.value().split(':')[0]) < i) {
                                /** Reset end time value */
                                endTime.value('');

                                /** Remove counter */
                                timeSlotCounter.remove();
                                timeSlotCounter = undefined;

                                /** Hide footer */
                                modal.hideFooter();
                            } else if (endTime.value()) {
                                /** Add counter */
                                if (!timeSlotCounter) {
                                    timeSlotCounter = Component_TimeSlotCounter({
                                        group: groupRadioButtons.value(),
                                        startTime: startTime.value(),
                                        endTime: endTime.value(),
                                        parent: timeContainer,
                                        position: 'afterend'
                                    });
    
                                    timeSlotCounter.add();
                                } else {
                                    timeSlotCounter.updateCounter({
                                        startTime: startTime.value(),
                                        endTime: endTime.value()
                                    });
                                }

                                /** Add time slots */
                                timeSlots = Component_TimeSlots({
                                    day: info.date.getDay(),
                                    group: groupRadioButtons.value(),
                                    startTime: startTime.value(),
                                    endTime: endTime.value(),
                                    parent: timeSlotCounter,
                                    position: 'afterend',
                                    onRemove(event) {
                                        const count = timeSlots.getTimes().length;

                                        if (count) {
                                            timeSlotCounter.updateCounter({
                                                count: timeSlots.getTimes().length
                                            });
                                        } else {
                                            /** Reset start and end time */
                                            startTime.value('');
                                            endTime.value('');

                                            /** Remove counter */
                                            timeSlotCounter.remove();
                                            timeSlotCounter = undefined;

                                            /** Hide footer */
                                            modal.hideFooter();
                                        }
                                        
                                    }
                                });

                                timeSlots.add();

                                /** Add Duplicate Week  */
                                if (!weeks) {
                                    weeks = Component_DuplicateWeek({
                                        date: info.date,
                                        parent: modalBody
                                    });
    
                                    weeks.add();
                                }
                            }
                        }
                    });

                    startTime.add();

                    /** End Time */
                    const endTime = Component_DropDownField({
                        label: 'to',
                        direction: 'row',
                        width: '75px',
                        editable: false,
                        disabled: true,
                        dropDownOptions: [],
                        parent: timeContainer,
                        onSetValue() {
                            /** Reset time slots */
                            if (timeSlots) {
                                timeSlots.remove();
                            }

                            /** Add counter */
                            if (!timeSlotCounter) {
                                timeSlotCounter = Component_TimeSlotCounter({
                                    group: groupRadioButtons.value(),
                                    startTime: startTime.value(),
                                    endTime: endTime.value(),
                                    parent: timeContainer,
                                    position: 'afterend'
                                });

                                timeSlotCounter.add();
                            } else {
                                timeSlotCounter.updateCounter({
                                    startTime: startTime.value(),
                                    endTime: endTime.value()
                                });
                            }

                            /** Add time slots */
                            timeSlots = Component_TimeSlots({
                                day: info.date.getDay(),
                                group: groupRadioButtons.value(),
                                startTime: startTime.value(),
                                endTime: endTime.value(),
                                parent: timeSlotCounter,
                                position: 'afterend',
                                onRemove(event) {
                                    const count = timeSlots.getTimes().length;

                                    if (count) {
                                        timeSlotCounter.updateCounter({
                                            count: timeSlots.getTimes().length
                                        });
                                    } else {
                                        /** Reset start and end time */
                                        startTime.value('');
                                        endTime.value('');
                                        
                                        /** Remove counter */
                                        timeSlotCounter.remove();
                                        timeSlotCounter = undefined;

                                        /** Hide footer */
                                        modal.hideFooter();
                                    }
                                }
                            });

                            timeSlots.add();

                            /** Add Duplicate Week  */
                            if (!weeks) {
                                weeks = Component_DuplicateWeek({
                                    date: info.date,
                                    parent: modalBody
                                });

                                weeks.add();
                            }

                            /** Show Footer */
                            modal.showFooter();
                        }
                    });

                    endTime.add();
                },

                /** Button definitions for Calendar Api Date Click */
                buttons: {
                    footer: [
                        {
                            value: 'No',
                            classes: 'btn-secondary',
                            data: [
                                {
                                    name: 'dismiss',
                                    value: 'modal'
                                }
                            ],
                            onClick(event) {
                                resetComponents();
                            }
                        },
                        {
                            value: 'Yes',
                            classes: 'btn-primary',
                            async onClick(event) {
                                /** Set cursor */
                                document.querySelector('html').classList.add('wait');

                                /** Get group */
                                const group = groupRadioButtons.value();

                                /** Check if event already exists */
                                const events = openCalendar.getEvents().map(item => `${item.title} ${item.start.toString()}`);
                        
                                /** Combine dates and times */
                                const dates = weeks.getDates().map(date => {
                                    return timeSlots.getTimes()
                                    .filter(time => {
                                        const {
                                            startHour
                                        } = time;

                                        if (!events.includes(`${group} ${new Date(`${date} ${startHour}`).toString()}`)) {
                                            return time;
                                        }
                                    })
                                    .map(time => {
                                        const {
                                            startHour,
                                            endHour
                                        } = time;

                                        const EventDate = `${date} ${startHour}`;

                                        return {
                                            Title: group,
                                            Location: group === 'Infection Prevention' ? 'IP' : group === 'Patient Safety' ? 'PS' : '',
                                            EventDateFilter: EventDate,
                                            EventDate,
                                            EndDate: `${date} ${endHour}`
                                        };
                                    });
                                }).flat();

                                /** Add items */
                                const newEvents = await Promise.all(dates.map(async data => {
                                    return Action_CreateItem({
                                        list: 'Events',
                                        data
                                    });
                                }));

                                /** Add events to calendar*/
                                newEvents.forEach(event => {
                                    const { 
                                        Id,
                                        Title, 
                                        EventDate,
                                        EndDate,
                                        FK_Command,
                                        FK_Group,
                                        __metadata
                                    } = event;
                
                                    const {
                                        uri
                                    } = __metadata;
                
                                    /** @todo return object from Model_FullCalendarEvent */
                                    openCalendar.addEvent({
                                        title: `${Title}`,
                                        id: Id,
                                        color: App.primaryColor, 
                                        start: EventDate,
                                        end: EndDate,
                                        extendedProps: {
                                            uri, // Uri of the event item;
                                            status: 'open', // Status of the event item;
                                            Command: null, // Command identifier;
                                            Group: Title,
                                            acceptedEventId: null // Check to see if the event has been accepted;
                                        }
                                    });
                                });

                                /** Empty variables in module scope */
                                resetComponents();

                                /** close and remove modal */
                                modal.getModal().modal('hide');

                                /** Set cursor */
                                document.querySelector('html').classList.remove('wait');
                            }
                        }
                    ]
                },
                parent
            });

            modal.add();
        },
        eventsSet(events) {
            console.log('*** Events Set ***');
            /** Set open count on dashboard */
            updateDashboardOpenCount();
        }
    });

    openCalendar.add();

    /** Remove events */
    function removeEvents() {
        if (openCalendar.calendar()) {
            openCalendar.removeEvents();
        }
    }

    /** Get Commands and Groups */
    async function getCommandsAndGroups() {
        const items = await Promise.all([
            Action_Get({
                list: 'Commands',
                select: 'Id,Command',
                filter: `Active eq 'Yes'`
            }),
            Action_Get({
                list: 'Groups',
                filter: `Group ne 'Facilitator'`
            })
        ]);

        return {
            commands: items[0],
            groups: items[1]
        }
    }

    /** Get Events */
    async function getEventsListItems(startStr, endStr) {
        const items = await Promise.all([
            Action_Get({
                list: 'Events',
                select: 'Id,Title,EventDate,EndDate,ParticipantsPicker/Name',
                expand: 'ParticipantsPicker/Id',
                filter: `EventDateFilter ge datetime'${startStr}' and EventDateFilter le datetime'${endStr}'`
            }),
            Action_Get({
                list: 'AcceptedEvents',
                filter: `FK_EventId ne 0 and EventDate ge datetime'${startStr}' and EventDate le datetime'${endStr}'`
            })
        ]);

        return {
            eventItems: items[0],
            acceptedEventItems: items[1]
        }
    }

    /** Format events */
    function formatEvents(eventItems, acceptedEventItems) {
        return eventItems.map(event => {
            const { 
                Id,
                Title, 
                EventDate,
                EndDate,
                __metadata
            } = event;

            const {
                uri
            } = __metadata;

            const accepted = acceptedEventItems.find(item => item.FK_EventId === Id);
            const status = accepted ? 'accepted' : 'open';
            const color = accepted ? 'mediumseagreen' : App.primaryColor;
            const Command = accepted ? accepted.FK_Command : null;

            return {
                title: `${Title}`, // Title used to render the event in the api;
                id: Id,
                color,
                start: EventDate, // Start date for the event;
                end: EndDate, // Send date for the event;
                /** Custom properties specific for this application; */
                extendedProps: {
                    uri, // Uri of the event item;
                    status, // Status of the event item;
                    Command, // Command identifier;
                    Group: Title,
                    SEQUENCE: accepted ? accepted.SEQUENCE: null,
                    acceptedEventId: accepted ? accepted.Id : null, // Check to see if the event has been accepted;
                }
            };
        });
    }

    /** Define set acceptedCalendar */
    function setAcceptedCalendar(start, end) {
        const {
            type,
            title
        } = openCalendar.calendar().view;

        /** Set Accepted Meetings */
        if (type !== 'dayGridMonth') {
            return;
        }

        /** Set dashboard title */
        acceptedCalendarDashboard.setTitle(`${title} - Accepted Meetings`)

        /** Remove previous calendar */
        if (acceptedCalendar) {
            acceptedCalendar.remove();
        }

        /** Unselect dashboard group  */
        if (selectedDashboardGroup) {
            acceptedCalendarDashboard.toggleColor(selectedDashboardGroup, false);
        }

        /** Remove expaned commands dashboard */
        if (commandsDashboard) {
            commandsDashboard.remove();
            commandsDashboard = undefined;
            selectedDashboardGroup = undefined;
        }

        /** Define new meetings list and add to DOM */
        acceptedCalendar = ViewPart_FacilitatorAcceptedMeetings({
            start,
            end,
            dashboard: acceptedCalendarDashboard,
            groups: groups.map(group => group.Group),
            parent: rightContainer
        });
    }

    /** Add modal */
    async function addModal(info) {
        const {
            event 
        } = info;
        
        const {
            start,
            end,
            extendedProps
        } = event;

        const {
            status,
            Command,
            Group,
        } = extendedProps;

        const titleDate = formatEventDate(event);

        /** Define the Modal Component */
        modal = Component_Modal({
            title: `${Group} | ${titleDate}`,
            /** @todo break out into separate functions */
            async addContent(modalBody) {
                /** Filter available commands */
                const availableCommands = commands
                    .filter(item => {
                        const { Command } = item;
                        const acceptedCommands = acceptedCalendar
                            .getEvents()
                            .filter(command => command.extendedProps.FK_Group === Group)
                            .map(command => command.extendedProps.FK_Command);

                        if (!acceptedCommands.includes(Command)) {
                            return item 
                        }
                    })
                    .map(item => {
                        const {
                            Id,
                            Command
                        } = item;

                        return {
                            id: Id,
                            value: Command
                        };
                    });

                /** Define shared param to commandField = Component_DropDownField(param)*/
                const commandFieldParam = {
                    labelAfter: '?',
                    direction: 'row',
                    width: '100px',
                    fieldMargin: '0px',
                    editable: false,
                    dropDownOptions: availableCommands,
                    parent: modalBody,
                    onSetValue() {
                        if (commandField.value()) {
                            modal.getButton('Update').disabled = false;
                        }
                    }
                }

                /** Define shared param to label = Component_Alert(param)*/
                const labelAlertParam = {
                    parent: modalBody
                }

                /** Check if the status of the event is open or accepted */
                if (status === 'open') {
                    /** Add open props to labelAlertParam */
                    labelAlertParam.type = 'info'
                    labelAlertParam.text = 'This time hasn\'t been claimed.'
                    commandFieldParam.label = 'Accept on behalf of';
                    
                    /** Define the global variable commandField */
                    commandField = Component_DropDownField(commandFieldParam); 
                } else if (status === 'accepted') {
                    /** Add accepted props to labelAlertParam */
                    labelAlertParam.type = 'success'
                    labelAlertParam.text = `This time has been claimed by ${Command}.`
                    commandFieldParam.label = 'Change to'
                    
                    /** Define the global variable commandField */
                    commandField = Component_DropDownField(commandFieldParam);
                }

                /** Create Component_Alert with labelAlertParam */
                const label = Component_Alert(labelAlertParam);

                /** Add Component_Alert to DOM */
                label.add();

                /** @todo this is ugly */
                if (availableCommands.length === 0) {
                    /** Create Component_Alert with labelAlertParam */
                    const resetAlert = Component_Alert({
                        type: 'danger',
                        text: /*html*/ `
                            <p>All commands have accepted a meeting.</p>
                            <p><strong><i>Reset an accepted meeting before making changes on behalf of a command.</i></strong></p>
                        `,
                        parent: modalBody
                    });

                    /** Add Component_Alert to DOM */
                    resetAlert.add();
                } else {
                    /** Add Component_DropDownMenu to DOM */
                    commandField.add();
                }

                /** Unhide Modal button row */
                modal.showFooter();
            },
            buttons: defineModalButtons(info),
            parent
        });

        modal.add();
    }

    /** Combine formatted event date and time strings */
    function formatEventDate(event) {
        const {
            start,
            end
        } = event;
        
        const dateStyle =  {
            dateStyle: 'full'
        };
        const timeStyle = {
            timeStyle: 'short'
        };

        return `${formatDate(start, dateStyle)} from ${formatTime(start, timeStyle)} to ${formatTime(end, timeStyle)}`;
    }

    /** Format event date string */
    function formatDate(date, options) {
        return date.toLocaleString('default', options);
    }

    /** Format event time string */
    function formatTime(date, options) {
        return date.toLocaleTimeString('default', options);
    }

    /** Remove bootstrap modal node from DOM (close just hides the element) */
    function removeModal() {
        if (modal) {
            modal.remove();
        }
    }

    /** Build buttons.footer array to pass to modal component */
    function defineModalButtons(info) {
        let buttons = {
            footer: [
                {
                    value: 'Cancel',
                    classes: 'btn-secondary',
                    data: [
                        {
                            name: 'dismiss',
                            value: 'modal'
                        }
                    ],
                    onClick(event) {
                        resetComponents();
                    }
                },
                {
                    value: 'Delete',
                    classes: 'btn-danger',
                    async onClick(pointerEvent) {
                        onDelete(info, pointerEvent);
                    }
                }
            ]
        };

        const {
            status
        } = info.event.extendedProps;

        if (status === 'accepted') {
            buttons.footer.push({
                value: 'Reset',
                classes: 'btn-warning',
                async onClick(pointerEvent) {
                   onReset(info, pointerEvent)
                }
            });
        }

        buttons.footer.push({
            value: 'Update',
            disabled: true,
            classes: 'btn-primary',
            async onClick(pointerEvent) {
                onUpdate(info, pointerEvent);
            }
        });
        
        return buttons;
    }

    /** Delete */
    async function onDelete(info, pointerEvent) {
        const {
            event 
        } = info;
        
        const {
            id,
            extendedProps
        } = event;

        const {
            status,
            acceptedEventId
        } = extendedProps;

        /** Disable button */
        $(pointerEvent.target)
            .attr('disabled', '')
            .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Deleting');

        /** Delete Event */
        await Action_DeleteItem({
            list: 'Events',
            itemId: id
        });

        /** Remove openCalendar event */
        event.remove();

        /** If status === 'accepted' delete AcceptedEvents item as well */
        if (status === 'accepted') {
            await Action_DeleteItem({
                list: 'AcceptedEvents',
                itemId: acceptedEventId
            });

            /** Remove acceptedCalendar event */
            acceptedCalendar.getEventById(acceptedEventId).remove();

            /** Update dashboard */
            // updateDashboardAcceptedCount();
            // updateDashboardOpenCount();
        }

        resetComponents();

        /** Enable button */
        $(pointerEvent.target)
            .removeAttr('disabled')
            .text('Complete!');

        /** Close and remove modal */
        modal.getModal().modal('hide');
    }

    /** Define what happens on modal Update button click */
    async function onUpdate(info, pointerEvent) {
        $(pointerEvent.target)
            .attr('disabled', '')
            .html(/*html*/ `
                <span class="spinner-border spinner-border-sm" style="margin-right: 5px;" role="status" aria-hidden="true"></span>
                <span>Updating calendar</span>
            `);

        /** Check status */
        await checkStatus(info);

        /** Reset components defined in module scope */
        resetComponents();

        /** Update alerts */
        // updateDashboardAcceptedCount();
        // updateDashboardOpenCount();
        
        /** Close modal */
        modal.getModal().modal('hide');
    }

    /** Check event status and choose path to take */
    async function checkStatus(info) {
        const {
            event
        } = info;

        const {
            extendedProps
        } = event;

        const {
            status,
            acceptedEventId
        } = extendedProps;

        /** Mine */
        if (status === 'accepted') {
            await ifStatusIsAccepted(event, acceptedEventId);

            return;
        }

        /** Open */
        if (status === 'open') {
            await ifStatusIsOpen(event);

            return;
        }
    }

    /** Triggered if checkStatus === 'mine' */
    async function ifStatusIsAccepted(event, acceptedEventId) {
        /** Update AcceptedEvent item*/
        const updatedAcceptedEvent = await Action_UpdateItem({
            list: 'AcceptedEvents',
            itemId: acceptedEventId,
            data: {
                /** @todo update SEQUENCE field */
                FK_Command: commandField.value()
            }
        });

        /** Create and send email */
        createICSAndSendEmail(updatedAcceptedEvent, event, 'UPDATED');

        /** Update event props */
        event.setExtendedProp('Command', updatedAcceptedEvent.FK_Command);

        /** Update AcceptedEvent props */
        const acceptedCalendarEvent = acceptedCalendar.getEventById(acceptedEventId);

        acceptedCalendarEvent.setProp('title', `${updatedAcceptedEvent.FK_Group} - ${updatedAcceptedEvent.FK_Command}`);
        acceptedCalendarEvent.setExtendedProp('FK_Command', updatedAcceptedEvent.FK_Command);
        acceptedCalendarEvent.setExtendedProp('FK_Group', updatedAcceptedEvent.FK_Group);
    }
    
    /** Triggered if checkStatus === 'open' */
    async function ifStatusIsOpen(event) {
        const {
            id,
            start,
            end,
            extendedProps
        } = event;

        const {
            Group,
        } = extendedProps;

        /** Create new AcceptedEvent item */
        const listItem = await Action_CreateItem({
            list: 'AcceptedEvents',
            data: {
                FK_EventId: id,
                FK_Command: commandField.value(),
                FK_Group: Group,
                EventDate: start.toISOString(),
                EndDate: end.toISOString()
            }
        });

        /** Update event props */
        event.setExtendedProp('status', 'accepted');
        event.setExtendedProp('Command', listItem.FK_Command);
        event.setExtendedProp('acceptedEventId', listItem.Id);
        event.setProp('borderColor', 'mediumseagreen');

        const {
            FK_EventId,
            FK_Command,
            FK_Group,
            EventDate,
            EndDate,
            __metadata
        } = listItem;

        const {
            uri
        } = __metadata;

        /** Add Accepted Meetings event */
        acceptedCalendar.addEvent({
            title: `${FK_Group} - ${FK_Command}`,
            id: listItem.Id,
            color: 'mediumseagreen',
            start: EventDate,
            end: EndDate,
            extendedProps: {
                uri,
                FK_EventId,
                FK_Command,
                FK_Group
            }
        });

        /** Update dashboard */
        // updateDashboardAcceptedCount();
        // updateDashboardOpenCount();
    }

    /** Reset */
    async function onReset(info, pointerEvent) {
        const {
            event 
        } = info;
        
        const {
            extendedProps
        } = event;

        const {
            acceptedEventId
        } = extendedProps;

        // Disable button - Prevent user from clicking this item more than once;
        $(pointerEvent.target)
            .attr('disabled', '')
            .html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Resetting');

        /** Simulate delete AcceptedEvent - need it for ics attachments */
        await Action_UpdateItem({
            list: 'AcceptedEvents',
            itemId: acceptedEventId,
            data: {
                FK_EventId: 0,
                FK_Group: '',
                FK_Command: ''
            }
        });
        
        /** Set status: 'open' */
        event.setProp('borderColor', App.primaryColor);
        event.setExtendedProp('status', 'open');
        event.setExtendedProp('Command', null);
        event.setExtendedProp('acceptedEventId', null);
        event.setExtendedProp('SEQUENCE', null);

        /** Update Accepted Meetings */
        acceptedCalendar.getEventById(acceptedEventId).remove();

        /** Update dashboard */
        /** @todo dashboard is not updating after reset */
        // updateDashboardAcceptedCount();
        // updateDashboardOpenCount();

        /** Reset components defined in module scope */
        resetComponents();

        modal.getModal().modal('hide');
    }

    /**
     * Create and send email
     * 
     * @param {Object} acceptedEvent 
     * @param {Object} selectedEvent 
     * @param {String('UPDATED'|'NEW')} type
     * 
     * @return {Promise}
     */
    async function createICSAndSendEmail(acceptedEvent, selectedEvent, type) {
        const {
            FK_Command,
            FK_Group
        } = acceptedEvent;

        const mostRecentIcsFile = await createICSFile(acceptedEvent);

        /** Get group members */
        const groupMembers = await Action_Get({
            list: 'Users',
            filter: `Command eq '${FK_Command}' and Group eq '${FK_Group}'`
        });

        const To = groupMembers.map(member => `i:0#.w|mhs\\${member.Account}`);

        console.log(acceptedEvent, groupMembers, To);

        const addToCalendarLink = `${App.webApp}${mostRecentIcsFile}`;
        const meetingLink = `${location.href.split('#')[0]}#Meetings/${acceptedEvent.Id}`;
        const subjectDate = formatEventDate(selectedEvent);

        /** Send Email */

        /**** TURNED OFF - SET FLAG */

        // await Action_SendEmail({
        //     /** @todo make user changeable */
        //     From: 'i:0#.w|mhs\\joseph.paulino',
        //     /** @todo remover after testing */
        //     To: To.length === 0 ? ['i:0#.w|mhs\\stephen.matheis'] : To,
        //     /** @todo uncomment to CC facilitator */
        //     // CC: [
        //     //     'i:0#.w|mhs\\joseph.paulino'
        //     // ],
        //     Subject: `${type}: ${FK_Group} - ${FK_Command} Meeting | ${subjectDate}`,
        //     Body: /*html*/ `
        //         <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
        //             ${
        //                 type === 'UPDATED' ? 
        //                 /*html*/ `
        //                     <p>The <strong>${FK_Group}</strong> meeting for <strong>${FK_Command}</strong> has changed to <strong>${subjectDate}</strong>.</p>
        //                 ` : 
        //                 ''
        //             }
        //             <p>
        //                 <a href='${addToCalendarLink}'>Click here</a> to update your calendar event
        //             </p>
        //             <p>
        //                 <a href='${meetingLink}'>Click here</a> to view this event's agenda, notes, tasks, files, and comments
        //             </p>
        //         </div>
        //     `
        // });
    }

    /**
     * Create ICS file
     * 
     * @param {Object} acceptedEvent - SharePoint AcceptedEvents list item
     * @return {Promise} ServerRelativeUrl
     */
    async function createICSFile(acceptedEvent) {
        const {
            FK_Group
        } = acceptedEvent;

        const locationInfo = await Action_Get({
            list: 'Locations',
            filter: `FK_Group eq '${FK_Group}'`
        });

        /** @todo pull in meeting agenda from AcceptedEvent Agenda field */
        /** Agenda */

        /** Description */
        /** @todo hard coded to DCS - might be replaced with Teams or another platform - consider making dynamic */
        const description = 
        `DCS Web Conf URL: ${locationInfo[0].Url}` +
        '<br>' +
        `Dial In Number: ${locationInfo[0].DialInNumber} or DSN: ${locationInfo[0].DSN}` +
        '<br>' +
        `PIN: ${locationInfo[0].PIN}` +
        '<br>' +
        '<br>' +
        /** @todo replace hard coded link to meeting */
        `<a href='${App.webApp}/apps/IPPSCS/SiteAssets/app/app.html/Meetings/` + 
        `${acceptedEvent.Id}'>Click here</a> to view this ` +
        `meeting's agenda, notes, tasks, files, and comments`;

        /** Create UPDATED ICS */
        /** @todo assumes location - check for one, first */
        const icsFile = Action_CreateICS({
            list: 'AcceptedEvents',
            item: acceptedEvent,
            organizer: 'joseph.m.paulino3.civ@mail.mil', /** @todo make user changeable */
            location: `Dial In Number: ${locationInfo[0].DialInNumber} or DSN: ${locationInfo[0].DSN} | PIN: ${locationInfo[0].PIN}`,
            description
        });

        /** Attach ICS to AcceptedEvent */
        const acceptedEventAttachments = await Action_AttachFiles({
            list: 'AcceptedEvents',
            id: acceptedEvent.Id,
            files: [
                icsFile
            ]
        });

        return acceptedEventAttachments.AttachmentFiles.results.find(file => parseInt(file.FileName.replace('.ics', '')) === acceptedEvent.SEQUENCE).ServerRelativeUrl;
    }

    /******************************************************************************************** */

    function updateDashboardOpenCount() {
        groups
            .map(group => group.Group)
            .forEach(group => {
                console.log(`${group} open: `, openCalendar.getEvents().filter(item => item.extendedProps.Group === group && item.extendedProps.status === 'open').length);
                
                acceptedCalendarDashboard.updateOpenCount({
                    label: group,
                    count: openCalendar.getEvents().filter(item => item.extendedProps.Group === group && item.extendedProps.status === 'open').length
                });
            });
    }

    function buildHourOptions(i = 0) {
        let times = [];

        for (i; i < 24; i++) {
            times.push({
                id: 0,
                value: `${i < 10 ? '0' : ''}${i}:00`
            });
        }

        return times;
    }

    function resetComponents() {
        timeSlotCounter = undefined;
        weeks = undefined;
        timeSlots = undefined;
        groupRadioButtons = undefined;
        commandField = undefined;
    }
}
