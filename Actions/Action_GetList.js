/** RHC-C SharePoint Team */

export default async function Action_GetList(param) {
    const {
        listName
    } = param;

    const url = `../../_api/web/lists/GetByTitle('${listName}')`;
    const headers = {
        headers : { 
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': `application/json; odata=verbose`
        }
    };

    const response = await fetch(url, headers);

    if (response) {
        const data = await response.json();

        if (data && data.d) {
            return data.d;
        }
    }
}
