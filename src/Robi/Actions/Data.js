import { Store } from '../Core.js'

// @START
/**
 * 
 * @param {*} lists 
 * @returns 
 */
export async function Data(lists) {
    let responses;

    if (lists) {
        responses = await Promise.all(lists.map(param => {
            const {
                list,
                label,
                select,
                expand,
                filter,
                orderby
            } = param;

            return Get({
                list,
                select,
                expand,
                filter,
                orderby,
                action() {
                    Store.get('app-loading-bar').update({
                        newDisplayText: label
                    });
                }
            });
        }));
    }

    await Store.get('app-loading-bar')?.end();

    return responses
}
// @END
