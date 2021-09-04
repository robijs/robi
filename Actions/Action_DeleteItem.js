/** RHC-C SharePoint Team */

/* Components */
import Component_Notification from '../Components/Component_Notification.js'

/* Actions */
import Action_Get from './Action_Get.js'
import Action_GetRequestDigest from './Action_GetRequestDigest.js'
import Action_Post from './Action_Post.js'

/**
 * Update SharePoint list item.
 * @param {Object}  param          - Interface to UpdateItem() module.
 * @param {string}  param.list     - SharePoint List Name.
 * @param {number}  param.itemId   - Item Id of item in param.list.
 * @param {boolean} [param.notify] - If false, don't display notification.
 */
export default async function Action_DeleteItem(param) {
    const {
        list,
        itemId,
        filter,
        notify,
        notifyMessage
    } = param;

    /** Get item by id */
    const getItems = await Action_Get({
        list,
        filter: itemId ? `Id eq ${itemId}` : filter
    });

    // const item = getItems[0];

    /** Get new request digest */
    const requestDigest = await Action_GetRequestDigest();

    await Promise.all(getItems.map(item => {
        const postOptions = {
            url: item.__metadata.uri,
            headers: {
                "Content-Type": "application/json;odata=verbose",
                "Accept": "application/json;odata=verbose",
                "X-HTTP-Method": "DELETE",
                "X-RequestDigest": requestDigest,
                "If-Match": item.__metadata.etag
            }
        }

        return Action_Post(postOptions);
    }));

    // // Define Post interface
    // const postOptions = {
    //     url: item.__metadata.uri,
    //     headers: {
    //         "Content-Type": "application/json;odata=verbose",
    //         "Accept": "application/json;odata=verbose",
    //         "X-HTTP-Method": "DELETE",
    //         "X-RequestDigest": requestDigest,
    //         "If-Match": item.__metadata.etag
    //     }
    // }

    // // Post update
    // await Action_Post(postOptions);

    // Notify
    // if (notify !== false) {
    //     const notification = Component_Notification({
    //         text: notifyMessage || `Removed!`
    //     });

    //     notification.add();

    //     setTimeout(() => {
    //         notification.remove();
    //     }, 6000);
    // }
}