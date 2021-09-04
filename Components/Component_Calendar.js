/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/* Actions */
import Component from '../Actions/Action_Component.js'

export default function Component_Calendar(param) {
    const {
        initialView,
        visibleRange,
        headerToolbar,
        height,
        padding,
        events,
        eventClick,
        dateClick,
        datesSet,
        eventsSet,
        parent,
        position
    } = param;

    const component = Component({
        html: /*html */ `
            <div class='calendar container'></div>
        `,
        style: /*css*/ `
            /** Container */
            #id {
                padding: ${padding || '0px 15px'};
            }

            /** links */
            .fc a:hover {
                text-decoration: none;
            }

            /** Header Color */
            .fc-col-header {
                position: relative;
                background-color: rgba(${Setting_App.primaryColorRGB}, .30);
            }

            /** Background color */        
            .fc-view-harness {
                background: white;
            }

            /** Override default theme border */
            .fc-theme-standard td, 
            .fc-theme-standard th {
                border: 1px solid var(--fc-border-color, ${Setting_App.primaryColor});
            }

            .fc-theme-standard .fc-scrollgrid {
                border: 1px solid var(--fc-border-color, ${Setting_App.primaryColor});
            }

            .fc .fc-scrollgrid {
                border-collapse: collapse;
                border-right-width: 0;
                border-bottom-width: 0;
            }

            /** Today background color */
            #id .fc-day-today {
                background-color: rgba(${Setting_App.primaryColorRGB}, .15);
            }

            /** Default text color */
            #id a {
                color: ${Setting_App.primaryColor};
            }

            /** Title color */
            #id .fc-toolbar-title {
                color: ${Setting_App.primaryColor};
            }

            /** Toolbar buttons */
            #id .fc-toolbar-chunk:nth-child(3) .fc-button-group .fc-button {
                background: white;
                color: ${Setting_App.primaryColor};
            }

            #id .fc-toolbar-chunk:nth-child(3) .fc-button-group .fc-button.fc-button-active {
                background: ${Setting_App.primaryColor};
                color: white;
            }

            /** Event text color */
            #id .fc-title,
            #id .fc-icon {
                color: white;
            }

            /** Week / Day text color */
            #id .fc-event-main .fc-event-time,
            #id .fc-event-main .fc-event-title {
                color: white;
            }

            /** Event title weight */
            #id .fc-daygrid-event .fc-event-title {
                font-weight: 500;
            }

            /** Event hover */
            #id .fc-daygrid-event:hover {
                cursor: pointer;
            }

            /** Button color */
            #id .fc-button {
                background: ${Setting_App.primaryColor};
                border: solid 1px ${Setting_App.primaryColor};
            }

            /** Button focus */
            #id .fc-button:focus {
                box-shadow: none;
                background: darkslateblue;
            }

            /** initialView: listMonth */
            #id.fc-theme-standard .fc-list {
                background: ${Setting_App.secondaryColor};
                border: none;
            }

            #id.fc-theme-standard .fc-list td,
            #id.fc-theme-standard .fc-list th {
                border: none;
            }

            #id.fc-theme-standard .fc-list .fc-cell-shaded {
                background: rgba(${Setting_App.primaryColorRGB}, .30);
            }

            #id .fc-list-event:hover td {
                background: transparent;
                cursor: pointer;
            }

            /** Empty list */
            #id.fc .fc-list-empty {
                background: transparent;
            }
        `,
        parent,
        position,
        events: [

        ],
        onAdd() {
            component.setData();
        }
    });

    let calendar;

    component.setData = () => {
        const options = {
            initialView: initialView || 'dayGridMonth',
            fixedWeekCount: false,
            /** {@link https://fullcalendar.io/docs/showNonCurrentDates} */
            showNonCurrentDates: false, /** default: true */
            weekends: false,
            height: height || 'auto',
            headerToolbar: headerToolbar === undefined ? {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            } : headerToolbar,
        };

        if (initialView === 'list') {
            options.visibleRange = visibleRange
        }

        if (events) {
            options.events = events;
        }

        if (dateClick) {
            options.dateClick = dateClick;
        }

        if (eventClick) {
            options.eventClick = eventClick;
        }

        if (datesSet) {
            options.datesSet = datesSet;
        }

        if (eventsSet) {
            options.eventsSet = eventsSet;
        }

        // console.log(options);

        calendar = new FullCalendar.Calendar(component.get(), options);

        calendar.render();
    }

    component.calendar = () => {
        return calendar;
    }

    component.addEvent = (event) => {
        calendar.addEvent(event)
    }

    component.getEvents = () => {
        return calendar.getEvents();
    }

    component.removeEvents = () => {
        return calendar.removeAllEvents();
    }

    component.getEventById = (id) => {
        return calendar.getEventById(id);
    }

    return component;
}