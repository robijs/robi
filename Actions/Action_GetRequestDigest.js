/** RHC-C SharePoint Team */

/* Actions */
import Action_Post from './Action_Post.js'

/**
 * Get SharePoint Request Digest. 
 */
export default async function GetRequestDigest() {
    // Get new request digest
    const getRequestDigest = await Action_Post({
        url: `../../_api/contextinfo`,
        headers: {
            "Accept": "application/json; odata=verbose",
        }
    });

    return getRequestDigest.d.GetContextWebInformation.FormDigestValue;
}