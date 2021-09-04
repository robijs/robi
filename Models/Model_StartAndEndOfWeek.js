/** 
 * RHC-C SharePoint Team | PA&E Project Request 
 * 
 * @link https://stackoverflow.com/a/12793705
 *
 * Modified By
 * @author Stephen Matheis
 * @email stephen.a.matheis.ctr@mail.mil
 * @date 2020.11.16
 * 
 * - Replaced 'var' with 'const'
 * - Changed return value to @Object from @Array
 */

export default function Model_StartAndEndOfWeek(date) {
    // set local variable
    const now = date ? new Date(date) : new Date();

    // set time to some convenient value
    now.setHours(0,0,0,0);

    // Get the previous Monday
    const monday = new Date(now);
    monday.setDate(monday.getDate() - monday.getDay() + 1);

    // Get next Sunday
    const sunday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7);

    // Return object of date objects
    return {
        monday,
        sunday
    };
}
