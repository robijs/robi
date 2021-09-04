/** Settings */
import Setting_App from '../Settings/Setting_App.js'

/** Actions */
import Action_GetList from '../Actions/Action_GetList.js'

export default async function Action_ConnectCalendarToOutlook(param) {
    const {
        type,
        cmd,
        url,
        listUrl,
        siteName,
        listName
    } = param;

    let {
        listGUID
    } = param;

    if (!listGUID) {
        const list = await Action_GetList({
            listName
        });

        listGUID = list.Id;
    }

    const stsSyncProtocolParameters = [
        'stssync://sts/?ver=1.1',
        `type=${type || 'calendar'}`,
        `cmd=${cmd || 'add-folder'}`,
        `base-url=${url || encodeURIComponent(location.href.split('/SiteAssets')[0])}`,
        `list-url=${listUrl || `%2FLists%2F${encodeURIComponent(listName)}`}`, /** / (forward-slash) is encoded as %2F */
        `guid=%7B${listGUID}%7D`, /** { is encoded as %7B and } is encoded as %7D */
        `site-name=${siteName || encodeURIComponent(Setting_App.title)}`,
        `list-name=${listName || encodeURIComponent(listName)}`
    ];

    console.log(stsSyncProtocolParameters);
    console.log(stsSyncProtocolParameters.join('&'));
    
    window.open(stsSyncProtocolParameters.join('&'));
}
