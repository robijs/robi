/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'

/** Components */
import Component_Calendar from '../Components/Component_Calendar.js'
import Component_Alert from '../Components/Component_Alert.js'
import Component_Modal from '../Components/Component_Modal.js'

/**
 * Calendar View Part for non-facilitators.
 * 
 * @param {Object} param Argument with properties for function.
 */
export default function ViewPart_GroupAcceptedMeetings(param) {
    const {
        start,
        end,
        alertContainer,
        openCalendar,
        parent
    } = param;

    /** Make these components accessible */
    let modal;
    let openTimesAlert;
    let acceptedTimesAlert;

    /** Accepted calendar - initialView: list */
    const acceptedCalendar = Component_Calendar({
        initialView: 'list',
        visibleRange: {
            start,
            end
        },
        height: `100%`,
        padding: '0px 0px 0px 15px',
        headerToolbar: false,
        parent,
        async events(info, successCallback, failureCallback) {
            const {
                endStr,
                startStr
            } = info;

            const acceptedEventItems = await Action_Get({
                list: 'AcceptedEvents',
                filter: `EventDate ge datetime'${startStr}' and EventDate le datetime'${endStr}' and FK_Group eq '${App.user.Group}'`
            });

            successCallback(acceptedEventItems.map(event => {
                const { 
                    Id,
                    FK_EventId,
                    FK_Command,
                    FK_Group,
                    EventDate,
                    EndDate,
                    __metadata
                } = event;

                const {
                    uri
                } = __metadata;

                /** @todo return object from Model_FullCalendarEvent */
                return {
                    title: `${FK_Group} - ${FK_Command}`,
                    id: Id,
                    color: FK_Command === App.user.Command ? 'mediumseagreen': 'firebrick',
                    start: EventDate,
                    end: EndDate,
                    extendedProps: {
                        uri,
                        FK_EventId,
                        FK_Command,
                        FK_Group
                    }
                };
            }));

            /** Update alerts */
            updateAlerts();
        },
        eventClick(info) {
            if (info.event.extendedProps.FK_Command === App.user.Command && info.event.extendedProps.FK_Group === App.user.Group) {
                App.route(`Meetings/${info.event.id}`);
            } else {
                /** Remove previous modal from DOM */
                if (modal) {
                    modal.remove();
                }

                /** Show Date Modal */
                modal = Component_Modal({
                    title: 'Sorry!',
                    async addContent(modalBody) {
                        const accessAlert = Component_Alert({
                            type: 'danger',
                            text: `You don't have permission to view this meeting.`,
                            parent: modalBody
                        });
    
                        accessAlert.add();
                    },
                    parent
                });

                modal.add();
            }
        }
    });

    acceptedCalendar.add();

    /** Update alerts */
    async function updateAlerts() {
        console.log('ViewPart_GroupAcceptedMeetings: updateAlerts()');

        if (openCalendar.calendar().view.type === 'dayGridMonth') {
            /** Empty alert container on every refresh*/
            alertContainer.empty();

            if (openCalendar.getEvents().length > 0) {
                /** Define accepted alert shared param properties */
                let acceptedAlertParam = {
                    parent: alertContainer,
                    width: '100%'
                }

                const acceptedTime = acceptedCalendar.getEvents().find(event => event.extendedProps.FK_Command === App.user.Command && event.extendedProps.FK_Group === App.user.Group);

                if (acceptedTime) {
                    const {
                        id,
                        start,
                        end
                    } = acceptedTime;
            
                    const meetingLink = `${location.href.split('#')[0]}#Meetings/${id}`;

                    acceptedAlertParam.type = 'success';
                    acceptedAlertParam.text = /*html*/ `
                        Your group accepted <a href='${meetingLink}' target='_blank' class='alert-link'>${start.toLocaleString('default', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        })} from ${start.toLocaleTimeString('default', {
                            timeStyle: 'short'
                        })} to ${end.toLocaleTimeString('default', {
                            timeStyle: 'short'
                        })}<span>
                    `;
                } else {
                    /** Add open times alert */
                    openTimesAlert = Component_Alert({
                        type: 'info',
                        text: `Open meeting times available for ${openCalendar.calendar().view.title}`,
                        parent: alertContainer
                    });

                    openTimesAlert.add();
                    
                    acceptedAlertParam.type = 'warning';
                    acceptedAlertParam.text = `Your group hasn't accepted a meeting time`;
                }

                acceptedTimesAlert = Component_Alert(acceptedAlertParam);
                acceptedTimesAlert.add();
            } else {
                /** Add open times alert */
                openTimesAlert = Component_Alert({
                    type: 'secondary',
                    text: `No meeting times available for ${openCalendar.calendar().view.title}`,
                    parent: alertContainer
                });

                openTimesAlert.add();
            }
        }
    }

    acceptedCalendar.updateAlerts = updateAlerts;

    return acceptedCalendar;
}
