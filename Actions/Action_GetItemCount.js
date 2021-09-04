/** RHC-C SharePoint Team */

/* Actions */
import Action_Error from './Action_Error.js'

export default async function Action_GetItemCount(param) {
    const {
        list,
        path,
        type
    } = param;

    let {
        apiPath
    } = param;

    apiPath = apiPath || '../..';
    const url = type === 'lib' ? `${apiPath}/_api/web/GetFolderByServerRelativeUrl('${path}')/ItemCount` : `${apiPath}/_api/web/lists/GetByTitle('${list}')/ItemCount`;
    
    const headers = {
        headers : { 
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        }
    };

    try {
        const response = await fetch(url, headers);

        if (!response.ok) {
            await Action_Error({
                Message: response.status.toString(),
                Source: import.meta.url,
                Line: 0,
                ColumnNumber: 0,
                Error: JSON.stringify(new Error().stack.replace('Error\n    at ', ''))
            });
        }
    
        const data = await response.json();
        
        return data.d.ItemCount;
    } catch(error) {
        console.log(error);
    }
}
