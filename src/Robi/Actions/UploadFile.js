import { App } from '../Core/App.js'
import { UpdateItem } from './UpdateItem.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { Get } from './Get.js'
import { GetByUri } from './GetByUri.js'
import { CreateItem } from './CreateItem.js';

// @START-File
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
        file, name, data, library, path
    } = param;

    // PROD
    if (App.isProd()) {
        // Get new request digest
        const requestDigest = await GetRequestDigest();
        const fileBuffer = await getFileBuffer(file);
        const url = path ? 
            `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files/add(url='${name || file.name}')` : 
            `${App.get('site')}/_api/web/folders/GetByUrl('${library}')/Files/add(overwrite=true,url='${name || file.name}')`
        const upload = await fetch(url, {
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
                select: `*,Author/Title,Editor/Title`,
                expand: `File,Author,Editor`,
                data
            };

            itemToReturn = await UpdateItem(updateItemParam);
        } else {
            itemToReturn = item;
        }

        return itemToReturn;
    }
    
    // DEV
    if (App.isDev()) {
        let fakeFile = {
            File: {
                Name: data?.FileLeafRef || file.name,
                Length: 0,
                Text: await file?.text() || 'Not a plain text file.'
            },
            Name: file.name,
            OData__dlc_DocIdUrl: {
                Url: '#'
            }
        };

        const upload = {
            ...data,
            ...fakeFile
        };

        const getItem = await Get({
            list: library,
            filter: `Name eq ${file.name}`
        });

        if (getItem[0]) {
            const updatedItem = await UpdateItem({
                type: 'file',
                itemId: getItem[0].Id,
                list: library,
                data: upload
            });

            return updatedItem;
        }

        const newItem = await CreateItem({
            type: 'file',
            list: library,
            data: upload
        });

        return newItem;
    }
}
// @END-File
