

/* Actions */
import GetRequestDigest from './Action_GetRequestDigest.js'
import Action_Post from './Action_Post.js'
import Action_CreateColumn from './Action_CreateColumn.js'

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.type     SharePoint list item type.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export default async function Action_CreateList(param) {
    const {
        list,
        fields
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    const postOptions = {
        url: `../../_api/web/lists`,
        data: {
            __metadata: {
                'type': `SP.List`,
            },
            'BaseTemplate': 100,
            'Title': list
        },
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    /** Create list */
    const newList = await Action_Post(postOptions);

    /** Create fields */
    for (let field in fields) {
        const {
            name,
            type
        } = fields[field];
        
        await Action_CreateColumn({
            list,
            name,
            type
        });
    }

    return newList.d;
}