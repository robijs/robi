/** Settings */
import Setting_App from '../Settings/Setting_App.js'

export default async function Action_CreateICS(param) {
    const {
        item,
        list,
        organizer
    } = param;

    const {
        Id,
        FK_Command,
        FK_Group,
        EventDate,
        EndDate,
        SEQUENCE
    } = item;

    console.log(Id, SEQUENCE);

    function formatDate(date) {
        const event = new Date(date).toISOString().split('T');
        const yyyymmdd = event[0].split('-').join('');
        const hhmmss = event[1].split('.')[0].split(':').join('');

        /** ICS date format: yyyymmddThhmmssZ */
        return `${yyyymmdd}T${hhmmss}Z`;
    }

    const SUMMARY = `${FK_Group} - ${FK_Command}`;
    // const description = `An agenda has been set: TEST.`;
    const DESCRIPTION = `This meeting does't have an agenda, yet. Click the link below for more details.`;
    const LOCATION = 'Teams';
    const DSTART = formatDate(EventDate);
    const DTEND = formatDate(EndDate);

    /** 
     * {@link https://tools.ietf.org/html/rfc5546}
     * {@link https://www.kanzaki.com/docs/ical}
     */
    const ics =
    `BEGIN:VCALENDAR\n` +
    `VERSION:2.0\n` +
    `PRODID:-//RHC-C SharePoint Team//${Setting_App.title}//EN\n` +
    `METHOD:REQUEST\n` +
    `BEGIN:VEVENT\n` +
    `ORGANIZER:${organizer}\n` +
    `DESCRIPTION;ENCODING=8BIT;CHARSET=utf-8:${DESCRIPTION}\n` +
    `DTSTART:${DSTART}\n` +
    `DTEND:${DTEND}\n` +
    `DTSTAMP:${formatDate(new Date())}\n` +
    `STATUS:CONFIRMED\n` +
    `LOCATION;ENCODING=8BIT;CHARSET=utf-8:${LOCATION}\n` +
    `SEQUENCE:${SEQUENCE}\n` +
    `SUMMARY;ENCODING=8BIT;CHARSET=utf-8:${SUMMARY}\n` +
    `UID:List=${list},ItemId=${Id}\n` +
    `BEGIN:VALARM\n` +
    `TRIGGER:-PT15M\n` +
    `ACTION:DISPLAY;\n` +
    `DESCRIPTION:Reminder\n` +
    `CATEGORIES:Red Category\n` +
    `END:VALARM\n` +
    `END:VEVENT\n` +
    `END:VCALENDAR\n`;

    /** File name */
    const fileName = `${SUMMARY} - ${new Date(EventDate).toDateString()}.ics`;

    /** Create File object */
    const icsFile = new File([ics], fileName, {type: 'text/plain'});

    console.log(icsFile);
    
    /** Create a tag */
    const downloadLink = document.createElement('a');

    /** Add file name to a tag */
    downloadLink.download = fileName;

    /** Create file link */
    downloadLink.href = window.URL.createObjectURL(icsFile);

    /** Hide a tag */
    downloadLink.style.display = 'none';

    /** Add hidden a tag to DOM */
    document.body.appendChild(downloadLink);

    /** Simulate clicking hidden a tag */
    downloadLink.click();
}