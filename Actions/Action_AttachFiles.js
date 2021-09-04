/** RHC-C SharePoint Team */

/* Actions */
import Action_Get from './Action_Get.js'
import GetRequestDigest from './Action_GetRequestDigest.js'

/**
 * 
 * @param {Object} param - Single function argument.
 * @param {String} param.string - Name of the SharePoint list.
 * @param {Number} param.id - SharePoint list item id.
 * @param {Files} param.files - Type FileList. From <input type='files'>. {@link https://developer.mozilla.org/en-US/docs/Web/API/FileList}
 * 
 * @returns {Object} SharePoint list item.
 */
export default async function AttachFiles(param) {
    /** Destructure Interface */
    const {
        list,
        id,
        files
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    // Upload responses
    const responses = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const name = file.name;
        const fileBuffer = await getFileBuffer(file);

        const upload = await fetch(`../../_api/web/lists/getbytitle('${list}')/items(${id})/AttachmentFiles/add(FileName='${name}')`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json; odata=verbose',
                'content-type': 'application/json; odata=verbose',
                'X-RequestDigest': requestDigest,
            },
            body: fileBuffer
        });

        responses.push(upload);
    }

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            
            fileReader.onload = event => resolve(event.target.result);
            fileReader.readAsArrayBuffer(file);
        });
    }

    await Promise.all(responses);

    const getUpdatedItem = await Action_Get({
        list,
        filter: `Id eq ${id}`,
        select: `Attachments,AttachmentFiles${list === ',References' ? 'Description' : ''}`,
        expand: 'AttachmentFiles',
    });

    return getUpdatedItem[0];
}