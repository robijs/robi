import { App } from '../Core.js'
import { UpdateItem } from './UpdateItem.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { GetByUri } from './GetByUri.js'

/**
 * Create SharePoint list item.
 * @param {Object}   param          Interface to UpdateItem() module.
 * @param {string}   param.list     SharePoint list Name.
 * @param {string}   [param.list]   SharePoint list item type.
 * @param {function} param.action   Function to be run after updating item posts.
 * @param {boolean}  [param.notify] If false, don't display notification.
 */
export async function UploadFile(param) {
    const {
        file, data, library
    } = param;

    // Get new request digest
    const requestDigest = await GetRequestDigest();

    console.log(file);

    const [first, ...rest] = file.name.split('.');
    const ext = rest.pop();

    let fileName = ext === 'pptx' || ext === 'txt' || ext === 'exe' ? [first].concat(rest).join('_dot_') : `${[first].concat(rest).join('_dot_')}.${ext}`;

    const fileBuffer = await getFileBuffer(file);
    const upload = await fetch(`${App.get('site')}/_api/web/folders/GetByUrl('${library}')/Files/add(overwrite=true,url='${fileName}')`, {
        method: 'POST',
        headers: {
            "Accept": "application/json;odata=verbose",
            'content-type': 'application/json; odata=verbose',
            "X-RequestDigest": requestDigest,
            "content-length": fileBuffer.byteLength
        },
        body: fileBuffer
    });

    function getFileBuffer(file) {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();

            fileReader.onload = event => resolve(event.target.result);
            fileReader.readAsArrayBuffer(file);
        });
    }

    const response = await upload.json();

    let item = await GetByUri({
        uri: response.d.ListItemAllFields.__deferred.uri
    });

    let itemToReturn;

    if (data) {
        const updateItemParam = {
            list: library,
            itemId: item.Id,
            data
        };

        itemToReturn = await UpdateItem(updateItemParam);
    } else {
        itemToReturn = item;
    }

    return itemToReturn;
}