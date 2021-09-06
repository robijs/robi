/* Actions */
import Action_Store from './Action_Store.js'
import Action_GetItemCount from './Action_GetItemCount.js'
import Action_CreateGetFilter from './Action_CreateGetFilter.js'
import Setting_App from '../Settings/Setting_App.js';

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

    if (Setting_App.mode === 'prod') {
        const itemCount = await Action_GetItemCount({
            apiPath: path,
            list
        });
    
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
    } else if (Setting_App.mode === 'dev') {
        const queryFilterString = [
            formatFilter(filter),
            // insertIf(orderby, 'orderby')
        ]
        .filter(x => x)
        .join('&');

        console.log(filter);
        console.log(queryFilterString);

        function formatFilter(value) {
            if (value) {
                return value
                .split(' and ')
                .map(pair => {
                    const [ field, operator, value ] = pair.split(' ');

                    return `${field}${operator === 'eq' ? '=' : ''}${value.replace(/["']/g, "")}`;
                })
                .join('&');
            }
        }

        const response = await fetch(`http://localhost:3000/${list}${queryFilterString ? `?${queryFilterString}` : ''}`, options);
        // const response = await fetch(`http://localhost:3000/${list}`, options);

        return await response.json();
    }
}
