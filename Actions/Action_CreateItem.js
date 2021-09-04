/** RHC-C SharePoint Team */

/* Components */
import Component_Notification from '../Components/Component_Notification.js'

/* Actions */
import Action_GetRequestDigest from './Action_GetRequestDigest.js'
import Action_Post from './Action_Post.js'
import Action_Get from './Action_Get.js'

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.type     SharePoint list item type.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export default async function Action_CreateItem(param) {
    const {
        type,
        list,
        select,
        expand,
        data,
        notify,
        message
    } = param;

    // Get new request digest
    const requestDigest = await Action_GetRequestDigest();

    data.__metadata = {
        'type': `SP.Data.${type || list}ListItem`
    }

    /**
     * Pass this object to fetch
     * 
     * @interface
     * @property {string} url - SharePoint 2013 API
     *
     */
    const postOptions = {
        url: `../../_api/web/lists/GetByTitle('${list}')/items`,
        data,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    let newItem = await Action_Post(postOptions);

    if (!newItem) {
        return;
    }

    const refetechedNewItem = await Action_Get({
        list,
        select,
        expand,
        filter: `Id eq ${newItem.d.Id}`
    });

    if (notify) {
        const notification = Component_Notification({
            text: message || `Item created`
        });

        notification.add();
        notification.remove(6000);
    }
    
    return refetechedNewItem[0];
}