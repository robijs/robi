import { App } from '../Core.js'
import { GetRequestDigest } from './GetRequestDigest.js'
import { CopyFile } from './CopyFile.js'
import { GetFolders } from './GetFolders.js'

//@START
/**
 * 
 * @param {*} param 
 * @returns 
 */
export async function CopyRecurse(param) {
    const { path, filter, targetWeb, appName, appTitle } = param;

    // 1. Look for files at top level of source site
    const url = `${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('${path}')/Files`;
    
    console.log(url);

    const requestDigest = await GetRequestDigest();
    const options = {
        method: 'GET',
        headers: {
            "Accept": "application/json;odata=verbose",
            "Content-type": "application/json; odata=verbose",
            "X-RequestDigest": requestDigest,
        }
    };
    const query = await fetch(url, options);
    const response = await query.json();

    if (response.d.results.length) {
        console.log(`Top level files in '${path}'`)
        
        for (let item in response.d.results) {
            const file = response.d.results[item];
            const { Name } = file;

            await CopyFile({
                source: App.get('site'),
                target: `${App.get('site')}/${targetWeb}`,
                path,
                file: Name,
                appName,
                appTitle
            });

            console.log(`File '${Name}' copied.`);
        }
    } else {
        console.log(`No files in '${path}'`);
    }

    // 2. Look for directories
    const dirs = await GetFolders({ path, filter });

    for (let item in dirs) {
        const file = dirs[item];
        const { Name } = file;
        
        console.log(`- ${Name}`);
        // 3 Create dirs
        await CreateFolder({
            web: targetWeb,
            path: `${path}/${Name}`
        });

        console.log(`Folder '${Name}' copied.`);

        // Recurse into dir
        await CopyRecurse({
            path: `${path}/${Name}`,
            targetWeb,
            appName,
            appTitle
        });
    }

    return true;
}