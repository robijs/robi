

/* Actions */
import Action_GetItemCount from './Action_GetItemCount.js'
import Action_CreateGetFilter from './Action_CreateGetFilter.js'

export default async function Action_GetLib(param) {
    const {
        path,
        type,
        filter,
        select,
        expand,
        orderby
    } = param;

    const url = `../../_api/web/GetFolderByServerRelativeUrl('${path}')/${type || 'Files'}`;
    const headers = {
        headers : { 
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const itemCount = await Action_GetItemCount({
        path,
        type: 'lib'
    });

    let queryFilterString = '';
    
    if (filter) {
        queryFilterString = typeof filter === 'string' ? `$filter=${filter}` : `$filter=${Action_CreateGetFilter(filter)}`;
    }

    if (select) {
        queryFilterString += `${queryFilterString ? '&' : ''}$select=${select}`;
    }

    if (expand) {
        queryFilterString += `${queryFilterString ? '&' : ''}$expand=${expand}`;
    }

    if (orderby) {
        queryFilterString += `${queryFilterString ? '&' : ''}$orderby=${orderby}`;
    }

    try {
        const response = await fetch(`${`${url}?$top=${itemCount}`}&${queryFilterString || ''}`, headers);

        const data = await response.json();
    
        if (Array.isArray(data)) {
            return data
        } else {
            return data.d.results;
        }
    } catch(error) {
        console.log(error);
    }
}
