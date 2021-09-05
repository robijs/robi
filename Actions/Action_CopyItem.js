

/* Components */
import Component_Notification from '../Components/Component_Notification.js'

/* Actions */
import Action_GetRequestDigest from './Action_GetRequestDigest.js'
import Action_Post from './Action_Post.js'

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export default async function Action_CopyItem(param) {
    const {
        file,
        newName,
        from,
        to,
        notify,
        message
    } = param;

    // Get new request digest
    const requestDigest = await Action_GetRequestDigest();

    // data.__metadata = {
    //     'type': `SP.Data.${type || list}ListItem`
    // }

    const postOptions = {
        url: `https://rhcc.amedd.army.mil/mtf/DHCC/cmdandstaffslides/_api/web/folders/GetByUrl('/mtf/DHCC/cmdandstaffslides/${from}')/Files/getbyurl('${file}')/copyTo(strNewUrl='/mtf/DHCC/cmdandstaffslides/${to}/${newName || file}',bOverWrite=true)`,
        // url: `https://rhcc.amedd.army.mil/mtf/DHCC/_api/web/GetFileByServerRelativeUrl('/mtf/DHCC/cmdandstaffslides/Slides/${file}')/copyTo('/mtf/DHCC/cmdandstaffslides/ArchivedSlides/${file}')`,
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    const copyItem = await Action_Post(postOptions);

    if (!copyItem) {
        return;
    }
    
    if (notify !== false) {
        const notification = Component_Notification({
            text: message || `Success!`
        });

        notification.add();
        notification.remove(6000);
    }

    return copyItem.d;
}