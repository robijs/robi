/** RHC-C SharePoint Team */

/* Actions */
import Action_Post from './Action_Post.js'

/**
 * Get Root SharePoint Request Digest. 
 */
export default async function Action_GetRootRequestDigest() {
    // Get new request digest
    const getRequestDigest = await Action_Post({
        url: `/_api/contextinfo`,
        headers: {
            "Accept": "application/json; odata=verbose",
        }
    });

    return getRequestDigest.d.GetContextWebInformation.FormDigestValue;
}