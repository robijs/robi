/** RHC-C SharePoint Team */

/** Actions */
import Action_Get from '../Actions/Action_Get.js'

/** Components */
import Component_Calendar from '../Components/Component_Calendar.js'

/**
 * Calendar view part for facilitators.
 * 
 * @param {Object} param Argument with properties for function.
 */
export default function ViewPart_FacilitatorAcceptedMeetings(param) {
    const {
        start,
        end,
        groups,
        dashboard,
        parent
    } = param; 

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
                filter: `EventDate ge datetime'${startStr}' and EventDate le datetime'${endStr}' and FK_EventId ne 0`
            });

            /** Update counts */
            // groups.forEach(group => {
            //     dashboard.updateCount({
            //         label: group,
            //         count: acceptedEventItems.filter(item => item.FK_Group === group).length
            //     });
            // });

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

                const { uri } = __metadata;

                return {
                    title: `${FK_Group} - ${FK_Command}`,
                    id: Id,
                    color: 'mediumseagreen',
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
        },
        eventClick(info) {
            App.route(`Meetings/${info.event.id}`);
        },
        eventsSet(events) {
            console.log('>>> AcceptedEvents Set <<<');

            /** Update dashboard */
            updateDashboardAcceptedCount();
        }
    });

    acceptedCalendar.add();

    function updateDashboardAcceptedCount() {
        groups.forEach(group => {
            console.log(`${group} accepted: `, acceptedCalendar.getEvents().filter(item => item.extendedProps.FK_Group === group).length);

            dashboard.updateCount({
                label: group,
                count: acceptedCalendar.getEvents().filter(item => item.extendedProps.FK_Group === group).length,
            });
        });
    }

    return acceptedCalendar;
}
