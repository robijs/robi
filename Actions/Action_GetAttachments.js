/** RHC-C SharePoint Team */

/* Actions */
import Get from './Action_Get.js'

export default async function Action_GetAttachments(param) {
    const {
        list,
        itemId
    } = param;

    const item = await Get({
        list,
        select: 'Attachments,AttachmentFiles',
        expand: 'AttachmentFiles',
        filter: `Id eq ${itemId}`
    });

    try {
        return item[0].AttachmentFiles.results;
    } catch (error) {
        console.log(error);
    }
}
