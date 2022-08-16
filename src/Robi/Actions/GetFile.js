// This file may be edited programmatically.
// If you know the API, feel free to make changes by hand.
// Just be sure to put @START and @END sigils in the right places.
// Otherwise, changes made from the front end may not render properly.

import { App } from '../Core/App.js'
import { Get } from './Get.js'

// @START-File
/**
 * 
 * @param {Object} param - Interface
 * @returns {String} 
 */
export async function GetFile(param) {
    const {
        library,
        path,
        name
    } = param;

    // TODO: Add about controller

    // const getFile = await Get({
    //     list: library,
    //     filter: `Name eq '${name}'`
    // });

    // PROD
    if (App.isProd()) {
        const requestDigest = await GetRequestDigest();
        
        // Check if the file exists
        // TODO: top=0, orderby=desc
        const checkExistsAPI = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${library}${path ? `/${path}` : ''}')/Files?$filter=Name eq '${name}'`;
        const options = {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': `application/json; odata=verbose`
            }
        };
        const checkExistsResponse = await fetch(checkExistsAPI, options);
        const checkExistsData = await checkExistsResponse.json();

        if (!checkExistsData.d.results.length) {
            console.log(`File '${name}' in ${library} missing.`);

            return;
        }

        // Get file contents
        const valueAPI = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${library}${path ? `/${path}` : ''}')/Files('${name}')/$value`;
        const fileValueRequest = await fetch(valueAPI, {
            method: 'GET',
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': requestDigest
            }
        });
        const value = await fileValueRequest.text();

        return value;
    }

    // @START-Dev
    if (App.isDev()) {
        const getFile = await Get({
            list: library,
            filter: `Name eq '${name}'`
        });

        if (getFile[0]) {
            return getFile[0].File.Text;
        }
    }
    // @END-Dev
}
// @END-File
