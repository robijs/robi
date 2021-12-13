import { App } from '../Core.js'
import { Post } from './Post.js'

// @START
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function GetRequestDigest(param = {}) {
    const { web, site } = param;

    const getRequestDigest = await Post({
        url: `${site || App.get('site')}${web ? `/${web}` : ''}/_api/contextinfo`,
        headers: {
            "Accept": "application/json; odata=verbose",
        }
    });

    return getRequestDigest.d.GetContextWebInformation.FormDigestValue;
}
// @END
