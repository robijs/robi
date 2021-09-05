

/* Actions */
import Action_GetRequestDigest from './Action_GetRequestDigest.js'
import Action_Post from './Action_Post.js'
import Action_AddColumnToView from './Action_AddColumnToView.js'

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.   
 * @param {string}   param.list     SharePoint list Name.
 */
export default async function Action_CreateColumn(param) {
    const {
        list,
        name,
        type
    } = param;

    // Get new request digest
    const requestDigest = await Action_GetRequestDigest();

    const postOptions = {
        url: `../../_api/web/lists/GetByTitle('${list}')/Fields`,
        data: {
            __metadata: {
                'type': `SP.Field`,
            },
            'Title': name,
            'FieldTypeKind': type
        },
        headers: {
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    }

    const newField = await Action_Post(postOptions);

    /** Add column to All Items view */
    await Action_AddColumnToView({
        list,
        name
    });

    return newField.d;
}