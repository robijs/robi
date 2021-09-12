/** Actions */
import Action_Store from './Action_Store.js'
import Action_GetItemCount from './Action_GetItemCount.js'

/** Settings */
import { App } from '../Core/Settings.js'

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
        action,
        mode
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

    if (App.get('mode') === 'prod' || mode === 'prod') {
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
    } else if (App.get('mode') === 'dev' || mode === 'dev') {
        const queryFilterString = [
            formatFilter(filter),
            formatOrder(orderby)
        ]
        .filter(x => x)
        .join('&');

        function formatFilter(value) {
            if (value) {
                return value
                .split(' and ')
                .map(group => {
                    const [ field, operator, value ] = group.split(' ');

                    return `${field}${operator === 'eq' ? '=' : ''}${value.replace(/["']/g, "")}`;
                })
                .join('&');
            }
        }

        /** GET /posts?_sort=views&_order=asc */
        function formatOrder(value) {
            if (value) {
                const [ field, order ] = value.split(' ');

                return `_sort=${field}&_order=${order}`;
            }
        }

        // console.log(`http://locaslhost:3000/${list}${queryFilterString ? `?${queryFilterString}` : ''}`);

        const response = await fetch(`http://localhost:3000/${list}${queryFilterString ? `?${queryFilterString}` : ''}`, options);
        // const response = await fetch(`http://localhost:3000/${list}`, options);

        return await response.json();
    }
}
