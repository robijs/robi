/* Actions */
import Action_GetRequestDigest from './Action_GetRequestDigest.js'
import Action_Post from './Action_Post.js'

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
export default async function Action_CreateColumn(param) {
    const {
        list,
        view,
        name
    } = param;

    // Get new request digest
    const requestDigest = await Action_GetRequestDigest();

    const postOptions = {
        url: `../../_api/web/lists/GetByTitle('${list}')/Views/GetByTitle('${view || 'All Items'}')/ViewFields/addViewField('${name}')`,
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    const newField = await Action_Post(postOptions);

    return newField.d;
}