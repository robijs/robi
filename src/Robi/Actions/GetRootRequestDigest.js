import { Post } from './Post.js'

// @START
/**
 *
 * @returns
 */
export async function GetRootRequestDigest() {
    const getRequestDigest = await Post({
        url: `/_api/contextinfo`,
        headers: {
            "Accept": "application/json; odata=verbose",
        }
    });

    return getRequestDigest.d.GetContextWebInformation.FormDigestValue;
}
// @END
