/* Actions */
import Action_Store from './Action_Store.js'
import Action_GetItemCount from './Action_GetItemCount.js'
import Action_CreateGetFilter from './Action_CreateGetFilter.js'

export default async function Action_Get(param) {
    const {
        list,
        filter,
        select,
        expand,
        orderby,
        top,
        skip,
        paged,
        startId,
        api,
        path,
        action
    } = param;

    /** Add abort signal */
    const abortController = new AbortController();

    Action_Store.addAbortController(abortController);

    const url = `${path || '../..'}/_api/web/lists/GetByTitle`;

    const options = {
        headers : { 
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        },
        signal: abortController.signal
    };

    const itemCount = await Action_GetItemCount({
        apiPath: path,
        list
    });

    // let queryFilterString = '';
    
    // if (filter) {
    //     queryFilterString = typeof filter === 'string' ? `$filter=${filter}` : `$filter=${Action_CreateGetFilter(filter)}`;
    // }

    // if (select) {
    //     queryFilterString += `${queryFilterString ? '&' : ''}$select=${select}`;
    // }

    // if (expand) {
    //     queryFilterString += `${queryFilterString ? '&' : ''}$expand=${expand}`;
    // }

    // if (orderby) {
    //     queryFilterString += `${queryFilterString ? '&' : ''}$orderby=${orderby}`;
    // }

    // if (paged) {
    //     queryFilterString += `${queryFilterString ? '&' : ''}$orderby=${orderby}`;
    // }

    // if (startId) {
    //     queryFilterString += `${queryFilterString ? '&' : ''}$orderby=${orderby}`;
    // }

    // if (count) {
    //     queryFilterString += `${queryFilterString ? '&' : ''}$orderby=${orderby}`;
    // }

    const queryFilterString = [
        insertIf(filter, 'filter'),
        insertIf(select, 'select'),
        insertIf(expand, 'expand'),
        insertIf(orderby, 'orderby'),
        insertIf(skip, 'skip'),
        paged ? `$skiptoken=Paged=TRUE${startId ? `&P_ID=${startId}` : ''}`: undefined,
        // paged ? `$skiptoken=Paged=TRUE&P_ID=${startId ? startId : itemCount}`: undefined,
    ]
    .filter(x => x)
    .join('&');

    function insertIf(value, parameter) {
        return value ? `$${parameter}=${value}` : undefined;
    }

    try {
        const response = await fetch(api || `${`${url}('${list}')/items?$top=${top || itemCount}`}&${queryFilterString || ''}`, options);
        const data = await response.json();
    
        if (action) {
            action(data);
        }

        if (paged || skip) {
            return data.d;
        } else if (Array.isArray(data)) {
            return data
        } else {
            return data.d.results;
        }
    } catch (error) {
        console.log(error);
    }
}
