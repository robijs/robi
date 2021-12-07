import { App } from '../Core.js'

/**
 *
 * @param {*} param
 * @returns
 */
export function GetSiteUsers(param) {
    const {
        query
    } = param;

    const abortController = new AbortController();

    // const url = `${App.get('domain')}/_api/web/siteusers?$filter=substringof('${query.toLowerCase()}',LoginName) eq true and substringof('i%3A0%23.w',LoginName) eq true`;
    // const url = [
    //     `${App.get('domain')}`,
    //     `/_api/web/SiteUserInfoList/items`,
    //     `?$top=200`,
    //     `&$select=Id,Title,FirstName,LastName,Name,EMail`,
    //     `&$filter=substringof('i:0e.t|dod_adfs_provider|', Name) and (substringof('${query}', Title) or substringof('${query}', EMail) or substringof('${query}', FirstName) or substringof('${query}', LastName))&$orderby=Name`
    // ].join('');
    const url = [
        `${App.get('site')}`,
        `/_vti_bin/listdata.svc/UserInformationList`,
        `?$top=200`,
        `&$select=Name,Account,WorkEmail`,
        // `&$filter=substringof('i:0e.t|dod_adfs_provider|', Account) and (substringof('${query}', Name) or substringof('${query}', WorkEmail))&$orderby=Name`
        `&$filter=substringof('${query}', Account) or (substringof('${query}', Name) or substringof('${query}', WorkEmail))&$orderby=Name`
    ].join('');
    const init = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; odata=verbose'
        },
        signal: abortController.signal
    };

    return {
        abortController,
        response: fetch(url, init).then(async (response) => {
            const data = await response.json();

            // return data.d.results;
            return data.d;
        })
        .catch(error => {
            // console.log(error);
        })
    };
}
