import { App, Store } from '../Core.js'
import { App, Store } from '../Core.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Post } from './Post.js'

/**
 * Update SharePoint list item.
 * @param {Object}  param          - Interface to UpdateItem() module.
 * @param {string}  param.list     - SharePoint List Name.
 * @param {number}  param.itemId   - Item Id of item in param.list.
 * @param {boolean} [param.notify] - If false, don't display notification.
 */
export async function DeleteList(param) {
    const {
        list,
    } = param;

    if (App.get('mode') === 'prod') {
        // TODO: Check if list exists first

        /** Get new request digest */
        const requestDigest = await GetRequestDigest();

        const postOptions = {
            url: `${App.get('site')}/_api/web/lists/GetByTitle('${list}')`,
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-HTTP-Method": "DELETE",
                "X-RequestDigest": requestDigest,
                "If-Match": "*" // dangerous, check etag
            }
        }

        await Post(postOptions);

        // Console success
        console.log(`Deleted list '${list}'`);

        // Append to install-console
        const deleteConsole = Store.get('install-console');

        if (deleteConsole) {
            deleteConsole.append(/*html*/ `
                <div class='console-line'>
                    <!-- <code class='line-number'>0</code> -->
                    <code>Deleted list '${list}'</code>
                </div>
            `);

            deleteConsole.get().scrollTop = deleteConsole.get().scrollHeight;
        }

        const progressBar = Store.get('install-progress-bar');

        if (progressBar) {
            progressBar.update();
        }
    } else if (App.get('mode') === 'dev') {
        const options = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
            }
        }

        const response = await fetch(`http://localhost:3000/${list}`, options);
        const deletedItem = await response.json();

        return deletedItem;
    }
}
