import { GetRequestDigest } from './GetRequestDigest.js'
import { CreateFolder } from './CreateFolder.js'
import { App } from '../Core/App.js'

export async function CreateFile({ contents, file, path, dir}) {
    // FIXME: Update SharePoint API
    if (App.isProd()) {
        // Create Route dir
        await CreateFolder({
            path: `App/src/Routes/${fileName.value()}`
        });

        // Create Route file
        // TODO: Create Route dir and file
        const path = `${App.get('library')}/src/Routes/${fileName.value()}`
        const targetSiteUrl = App.get('site') + "/_api/web/GetFolderByServerRelativeUrl('" + path + "')/Files/Add(url='" + `${fileName.value()}.js` + "',overwrite=true)";
        const srcRequestDigest = await GetRequestDigest();
        
        // TODO: Add check for App/src path so other paths that you might want to copy from aren't affected
        const newFile = await fetch(targetSiteUrl, {
            method: 'POST',
            body: contents, 
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': srcRequestDigest
            }
        });

        return newFile;
    }
    
    const newFile = await fetch(
        `http://127.0.0.1:2035/?path=${path}${dir ? `/${dir}` : ''}&file=${file}.js`, 
        {
            method: 'POST',
            body: contents
        }
    );

    return newFile;
}