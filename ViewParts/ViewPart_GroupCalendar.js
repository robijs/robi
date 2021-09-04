/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'
import Action_CreateItem from '../Actions/Action_CreateItem.js'
import Action_UpdateItem from '../Actions/Action_UpdateItem.js'
import Action_CreateICS from '../Actions/Action_CreateICS.js'
import Action_SendEmail from '../Actions/Action_SendEmail.js'
import Action_AttachFiles from '../Actions/Action_AttachFiles.js'

/** Components */
import Component_Alert from '../Components/Component_Alert.js'
import Component_Container from '../Components/Component_Container.js'
import Component_Heading from '../Components/Component_Heading.js'
import Component_Calendar from '../Components/Component_Calendar.js'
import Component_Modal from '../Components/Component_Modal.js'
import Component_Label from '../Components/Component_Label.js'
import Component_DropDownField from '../Components/Component_DropDownField.js'

/** View Parts */
import ViewPart_GroupAcceptedMeetings from '../ViewParts/ViewPart_GroupAcceptedMeetings.js'

export default async function ViewPart_GroupCalendar(param) {
    const {
        parent
    } = param;

    /** Container */
    const container = Component_Container({
        margin: '40px 0px',
        height: '80%',
        parent
    });

    container.add();
    
    /** Left */
    const leftContainer = Component_Container({
        direction: 'column',
        flex: '2',
        height: '100%',
        parent: container
    });

    leftContainer.add();

    /** Right */
    const rightContainer = Component_Container({
        direction: 'column',
        align: 'center',
        flex: '1',
        height: '100%',
        parent: container
    });

    rightContainer.add();

    /** Accepted Heading */
    const acceptedHeading = Component_Heading({
        text: 'Accepted Meetings',
        size: '1.75em',
        weight: '500',
        height: `41px`,
        margin: `0px 0px 24px 0px`,
        parent: rightContainer
    });

    acceptedHeading.add();

    /** Add alert container */
    const alertContainer = Component_Container({
        display:'block',
        padding: '0px 0px 0px 15px',
        width: '100%',
        parent: rightContainer,
    });

    alertContainer.add();

    /** Make these references available throughout module scope */
    /** @todo figure out how to pass these explicitly (remove side effects) */
    let modal;
    let openTimeField;
    let acceptedCalendar;

    /** Open Calendar */
    const openCalendar = Component_Calendar({
        parent: leftContainer,
        height: `100%`,
        padding: '0px 15px 0px 0px',
        group: App.user.Group,
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
            } = await getEvents(startStr, endStr);

            /** Set FullCalendar internal events array */
            successCallback(formatEvents(eventItems, acceptedEventItems));

            /** Set acceptedCalendar */
            setAcceptedCalendar(start, end);
        },
        /** {@link https://fullcalendar.io/docs/eventClick} */
        eventClick(info) {
            /** Remove previous modal from DOM */
            removeModal();

            /** Add new modal */
            addModal(info);  
        }
    });

    openCalendar.add();

    /** Get Events */
    async function getEvents(startStr, endStr) {
        const items = await Promise.all([
            Action_Get({
                list: 'Events',
                select: 'Id,Title,EventDate,EndDate,ParticipantsPicker/Name',
                expand: 'ParticipantsPicker/Id',
                filter: `EventDateFilter ge datetime'${startStr}' and EventDateFilter le datetime'${endStr}' and Title eq '${App.user.Group}'`
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
            const status = accepted && accepted.FK_Command === App.user.Command ? 'mine': accepted && accepted.FK_Command !== App.user.Command ? 'accepted' : 'open';
            const color = accepted && accepted.FK_Command === App.user.Command ? 'mediumseagreen': accepted && accepted.FK_Command !== App.user.Command ? 'firebrick' : App.primaryColor;
            const Command = accepted ? accepted.FK_Command : null;

            /** @todo return object from Model_FullCalendarEvent */
            return {
                title: Title,
                id: Id,
                color,
                start: EventDate,
                end: EndDate,
                extendedProps: {
                    uri,
                    status,
                    Command,
                    SEQUENCE: accepted ? accepted.SEQUENCE: null,
                    acceptedEventId: accepted ? accepted.Id : null
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
        acceptedHeading.setHeading(`${title} - Accepted Meetings`)

        /** Remove previous calendar */
        if (acceptedCalendar) {
            acceptedCalendar.remove();
        }

        /** Define new meetings list and add to DOM */
        acceptedCalendar = ViewPart_GroupAcceptedMeetings({
            start,
            end,
            openCalendar,
            alertContainer,
            parent: rightContainer
        });
    }

    /** Empty openCalendar internal events array */
    function removeEvents() {
        if (openCalendar.calendar()) {
            openCalendar.removeEvents();
        }
    }
    
    /** Add modal */
    function addModal(info) {
        const {
            event
        } = info;

        /** Build modal title */
        const title = formatEventDate(event);

        let acceptedAlert;

        /** Show Date Modal */
        modal = Component_Modal({
            title,
            /** @todo break out into separate functions */
            async addContent(modalBody) {
                /** Open */
                if (info.event.extendedProps.status === 'open') {
                    /** Look for event event in acceptedCalendar */
                    const acceptedEvent = acceptedCalendar.getEvents().find(event => event.extendedProps.FK_Group === App.user.Group && event.extendedProps.FK_Command === App.user.Command);

                    let label;

                    if (acceptedEvent) {
                        const acceptedEventDateText = `${acceptedEvent.start.toLocaleString('default', {
                                dateStyle: 'full'
                            })} from ${acceptedEvent.start.toLocaleTimeString('default', {
                                timeStyle: 'short'
                            })} to ${new Date(acceptedEvent.end).toLocaleTimeString('default', {
                                timeStyle: 'short'
                            })}
                        `;

                        label = /*html*/`
                            <p>Would you like to change your meeting time?</p>
                            <div>
                                <div style='display: flex; margin-bottom: 10px'>
                                    <div style='width: 60px; font-weight: 700;'>From</div>
                                    <div>${acceptedEventDateText}</div>
                                </div>
                                <div style='display: flex;'>
                                    <div style='width: 60px; font-weight: 700;'>To</div>
                                    <div>${title}</div>
                                </div>
                            </div>
                        `;
                    } else {
                        label = 'Would you like to accept this meeting time?'
                    }
                    
                    const question = Component_Label({
                        label,
                        parent: modalBody
                    });

                    question.add();

                    modal.showFooter();
                }
                
                /** Mine */
                if (info.event.extendedProps.status === 'mine') {
                    /** Disable Yes button */
                    modal.getButton('Yes').disabled = true;

                    acceptedAlert = Component_Alert({
                        type: 'success',
                        text: `You've accepted this meeting time.`,
                        parent: modalBody
                    });

                    acceptedAlert.add();

                    openTimeField = Component_DropDownField({
                        label: 'Change to',
                        labelAfter: '?',
                        direction: 'row',
                        width: '375px',
                        fieldMargin: '0px',
                        editable: false,
                        dropDownOptions: openCalendar
                        .getEvents()
                        .filter(item => item.extendedProps.status === 'open')
                        .sort((a, b) => a.start - b.start)
                        .map(item => {
                            const {
                                id,
                                start,
                                end
                            } = item;

                            const startDate = new Date(start);

                            return {
                                id: id,
                                value: `${startDate.toLocaleString('default', {
                                    dateStyle: 'full'
                                })} ${startDate.toLocaleTimeString('default', {
                                    timeStyle: 'short'
                                })} - ${new Date(end).toLocaleTimeString('default', {
                                    timeStyle: 'short'
                                })}`
                            };
                        }),
                        parent: modalBody,
                        onSetValue() {
                            /** Update alert */
                            acceptedAlert.update({
                                type: 'warning',
                                text: `Change your meeting time to ${openTimeField.value()}?`
                            });

                            /** Enable Yes button */
                            if (openTimeField.value()) {
                                modal.getButton('Yes').disabled = false;
                            }
                        }
                    });

                    openTimeField.add();

                    modal.showFooter();
                }

                /** Not mine */
                if (info.event.extendedProps.status === 'accepted') {
                    const label = Component_Label({
                        label: 'This time has been accepted by another command. Please select an open meeting time.',
                        parent: modalBody
                    });

                    label.add();
                }
            },
            buttons: defineModalButtons(info, title),
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
    function defineModalButtons(info, title) {
        let buttons = {
            footer: [
                {
                    value: 'No',
                    classes: 'btn-secondary',
                    data: [
                        {
                            name: 'dismiss',
                            value: 'modal'
                        }
                    ]
                },
                {
                    value: 'Yes',
                    classes: 'btn-primary',
                    async onClick(pointerEvent) {
                        onYes(info, pointerEvent);
                    }
                }
            ]
        }
        
        const {
            status
        } = info.event.extendedProps;

        if (status === 'mine') {
            buttons.footer.splice(0, 0, {
                value: 'Reset',
                classes: 'btn-warning',
                async onClick(pointerEvent) {
                    onReset(info, title, pointerEvent);
                }
            });
        }

        return buttons;
    }

    /** Define what happens when clicking modal yes button */
    async function onYes(info, pointerEvent) {
        $(pointerEvent.target)
            .attr('disabled', '')
            .html(/*html*/ `
                <span class="spinner-border spinner-border-sm" style="margin-right: 5px;" role="status" aria-hidden="true"></span>
                <span>Updating calendar</span>
            `);

        /** Check status */
        await checkStatus(info);

        /** Update alerts */
        acceptedCalendar.updateAlerts();
        
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
        } = extendedProps;

        /** Mine */
        if (status === 'mine') {
            await ifStatusIsMine(event);

            return;
        }

        /** Open */
        if (status === 'open') {
            await ifStatusIsOpen(event);

            return;
        }
    }

    /** Triggered if checkStatus === 'mine' */
    async function ifStatusIsMine(event) {
        const acceptedEvent = acceptedCalendar.getEventById(event.extendedProps.acceptedEventId);
        const previousEvent = event;
        const selectedEvent = openCalendar.getEventById(openTimeField.getValueItemId());

        await updateAccepetedEvent(acceptedEvent, previousEvent, selectedEvent, 'Button: Yes | Status: mine | AcceptedEvent: true');
    }
    
    /** Triggered if checkStatus === 'open' */
    async function ifStatusIsOpen(event) {
        const selectedEvent = event;
        const acceptedEvent = acceptedCalendar.getEvents().find(event => event.title === `${App.user.Group} - ${App.user.Command}`);
        
        if (acceptedEvent) {
            const previousEvent = openCalendar.getEventById(acceptedEvent.extendedProps.FK_EventId);

            await updateAccepetedEvent(acceptedEvent, previousEvent, selectedEvent, 'Button: Yes | Status: open | AcceptedEvent: true');
        } else {
            await createAcceptedEvent(selectedEvent, 'Button: Yes | Status: open | AcceptedEvent: false');
        }
    }

    /** 
     * Update acceptedCalendar event and previous and selected openCalendar events
     * 
     * @param {Object} acceptedEvent
     * @param {Object} previousEvent
     * @param {Object} selectedEvent
     * @param {String} logMessage
     * 
     * @return {Promise}
     */
    async function updateAccepetedEvent(acceptedEvent, previousEvent, selectedEvent, logMessage) {
        /** Set SEQUENCE */
        const SEQUENCE = previousEvent.extendedProps.SEQUENCE + 1;

        /** Update AcceptedEvents item */
        const updatedAcceptedEvent = await Action_UpdateItem({
            list: 'AcceptedEvents',
            itemId: acceptedEvent.id,
            data: {
                FK_EventId: parseInt(selectedEvent.id),
                EventDate: selectedEvent.start.toISOString(),
                EndDate: selectedEvent.end.toISOString(),
                SEQUENCE
            }
        });

        /** Log passed in message */
        console.log(logMessage);

        /** Create and send UPDATED email */
        await createICSAndSendEmail(updatedAcceptedEvent, selectedEvent, 'UPDATED');

        /** 
         * Updated acceptedCalendar event start and end date
         * {@link  https://fullcalendar.io/docs/Event-setStart} 
         */
        acceptedEvent.setStart(selectedEvent.start, {maintainDuration: true});

        /** Updated acceptedCalendar event extendedProps */
        acceptedEvent.setExtendedProp('FK_EventId', parseInt(selectedEvent.id));

        /** Update selected event openCalendar event props */
        selectedEvent.setProp('borderColor', 'mediumseagreen');
        selectedEvent.setExtendedProp('Command', acceptedEvent.extendedProps.FK_Command);
        selectedEvent.setExtendedProp('status', 'mine');
        selectedEvent.setExtendedProp('acceptedEventId', acceptedEvent.id);
        selectedEvent.setExtendedProp('SEQUENCE', SEQUENCE);

        /** Update previous event openCalendar event props */
        previousEvent.setProp('borderColor', App.primaryColor);
        previousEvent.setExtendedProp('Command', null);
        previousEvent.setExtendedProp('status', 'open');
        previousEvent.setExtendedProp('acceptedEventId', null);
        previousEvent.setExtendedProp('SEQUENCE', null);
    }
    
    /** 
     * Create new AcceptedEvent item, add it to acceptedCalendar, and update openCalendar event
     * 
     * @param {Object} selectedEvent
     * @param {String} logMessage
     * 
     * @return {Promise}
     */
    async function createAcceptedEvent(selectedEvent, logMessage) {
        /** Create new AcceptedEvent */
        const newAcceptedEvent = await Action_CreateItem({
            list: 'AcceptedEvents',
            data: {
                FK_EventId: parseInt(selectedEvent.id),
                FK_Command: App.user.Command,
                FK_Group: App.user.Group,
                EventDate: selectedEvent.start.toISOString(),
                EndDate: selectedEvent.end.toISOString(),
            }
        });

        /** Log passed in message */
        console.log(logMessage);

        /** Create and send UPDATED email */
        await createICSAndSendEmail(newAcceptedEvent, selectedEvent, 'NEW');

        /** Add event to acceptedCalendar */
        acceptedCalendar.addEvent({
            title: `${newAcceptedEvent.FK_Group} - ${newAcceptedEvent.FK_Command}`,
            id: newAcceptedEvent.Id,
            color: 'mediumseagreen',
            start: newAcceptedEvent.EventDate,
            end: newAcceptedEvent.EndDate,
            extendedProps: {
                uri: newAcceptedEvent.__metadata.uri,
                FK_EventId: newAcceptedEvent.FK_EventId,
                FK_Command: newAcceptedEvent.FK_Command,
                FK_Group: newAcceptedEvent.FK_Group
            }
        });

        /** Update openCalendar event props */
        selectedEvent.setProp('borderColor', 'mediumseagreen');
        selectedEvent.setExtendedProp('Command', newAcceptedEvent.FK_Command);
        selectedEvent.setExtendedProp('status', 'mine');
        selectedEvent.setExtendedProp('acceptedEventId', newAcceptedEvent.Id);
        selectedEvent.setExtendedProp('SEQUENCE', 0);
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
        const mostRecentIcsFile = await createICSFile(acceptedEvent);

        /** Get group members */
        const groupMembers = await Action_Get({
            list: 'Users',
            filter: `Command eq '${App.user.Command}' and Group eq '${App.user.Group}'`
        });

        const To = groupMembers.map(member => `i:0#.w|mhs\\${member.Account}`);
        const addToCalendarLink = `${App.webApp}${mostRecentIcsFile}`;
        const meetingLink = `${location.href.split('#')[0]}#Meetings/${acceptedEvent.Id}`;
        const subjectDate = formatEventDate(selectedEvent);

        /** Send Email */
        
        /************************************************************** TURNED OFF - Set FLAG */

        // await Action_SendEmail({
        //     From: 'i:0#.w|mhs\\joseph.paulino', /** @todo make user changeable */
        //     To,
        //     /** @note uncomment to CC facilitator */
        //     // CC: [
        //     //     'i:0#.w|mhs\\joseph.paulino'
        //     // ],
        //     Subject: `${type}: ${App.user.Group} - ${App.user.Command} Meeting | ${subjectDate}`,
        //     Body: /*html*/ `
        //         <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
        //             ${
        //                 type === 'UPDATED' ? 
        //                 /*html*/ `
        //                     <p>The <strong>${App.user.Group}</strong> meeting for <strong>${App.user.Command}</strong> has changed to <strong>${subjectDate}</strong>.</p>
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
        const locationInfo = await Action_Get({
            list: 'Locations',
            filter: `FK_Group eq '${App.user.Group}'`
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
        `<a href='${App.webApp}/apps/IPPSCS/SiteAssets/app/app.html#Meetings/` + 
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

    /** 
     * Define what happens when clicking modal reset button
     * 
     * @param {Object} info
     * @param {String} title
     * @param {Object} pointerEvent
     * 
     * @return {Promise}
    */
    async function onReset(info, title, pointerEvent) {
        /** Disable button - Prevent user from clicking this item more than once */
        $(pointerEvent.target)
            .attr('disabled', '')
            .html(/*html*/ `
                <span class="spinner-border spinner-border-sm" style="margin-right: 5px;" role="status" aria-hidden="true"></span>
                <span>Resetting</span>
            `);

        const message =
        `This meeting's, agenda, notes, files, and comments will be permanently lost.\n\n` +
        'Are you sure you want to release this meeting time?\n\n' +
        'Please make sure to accept another meeting time as soon as possible!';
        
        const check = confirm(message);

        if (check) {
            /***************************************************************************/
            console.log('Button: Reset | Method: CANCEL');

            /** Create CANCEL ICS */
            const cancelIcs = Action_CreateICS({
                list: 'AcceptedEvents',
                item: {
                    Id: info.event.extendedProps.acceptedEventId,
                    FK_Command: App.user.Command,
                    FK_Group: App.user.Group,
                    EventDate: info.event.start,
                    EndDate: info.event.end,
                    SEQUENCE: parseInt(info.event.extendedProps.SEQUENCE) + 1
                },
                method: 'CANCEL',
                organizer: 'joseph.m.paulino3.civ@mail.mil' /** @todo make user changeable */,
                location: 'None',
                description: 'This meeting has been canceled. Please remove this event from your calendar'
            });

            /** Attach ICS to AcceptedEvent */
            const acceptedEventAttachments = await Action_AttachFiles({
                list: 'AcceptedEvents',
                id: info.event.extendedProps.acceptedEventId,
                files: [
                    cancelIcs
                ]
            });

            console.log(acceptedEventAttachments);

            /** @todo only keep the most recent change attached? */
            const icsFiles = acceptedEventAttachments.AttachmentFiles.results;
            const mostRecentIcsFile = icsFiles[icsFiles.length - 1].ServerRelativeUrl;

            /** Get group members */
            const groupMembers = await Action_Get({
                list: 'Users',
                filter: `Command eq '${App.user.Command}' and Group eq '${App.user.Group}'`
            });

            const To = groupMembers.map(member => `i:0#.w|mhs\\${member.Account}`);
            const addToCalendarLink = `${App.webApp}${mostRecentIcsFile}`;

            /** Send Email */

            /************************************************************** TURNED OFF - Set FLAG */

            // await Action_SendEmail({
            //     From: 'i:0#.w|mhs\\joseph.paulino', /** @todo make user changeable */
            //     To,
            //     /** @note uncomment to CC facilitator */
            //     // CC: [
            //     //     'i:0#.w|mhs\\joseph.paulino'
            //     // ],
            //     Subject: `CANCELED: ${App.user.Group} - ${App.user.Command} Meeting | ${title}`,
            //     /** @todo replace hard codeded domain */
            //     Body: /*html*/ `
            //         <div style="font-family: 'Calibri', sans-serif; font-size: 11pt;">
            //             <p>
            //                 <a href='${addToCalendarLink}'>Click here</a> to remove this event from your calendar
            //             </p>
            //         </div>
            //     `
            // });
            /***************************************************************************/
                                        
            /** Simulate delete AcceptedEvent - need it for ics attachments */
            await Action_UpdateItem({
                list: 'AcceptedEvents',
                itemId: info.event.extendedProps.acceptedEventId,
                data: {
                    FK_EventId: 0,
                    FK_Group: '',
                    FK_Command: ''
                }
            });

            /** Set status: 'open' */
            info.event.setProp('borderColor', App.primaryColor);
            info.event.setExtendedProp('Command', null);
            info.event.setExtendedProp('status', 'open');
            info.event.setExtendedProp('acceptedEventId', null);
            info.event.setExtendedProp('SEQUENCE', null);

            /** Update Accepted Meetings */
            const acceptedCalendarEvent = acceptedCalendar.getEventById(info.event.extendedProps.acceptedEventId);

            if (acceptedCalendarEvent) {
                acceptedCalendarEvent.remove();
            }
        }

        acceptedCalendar.updateAlerts();
        
        modal.getModal().modal('hide');
    }
}
