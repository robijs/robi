import { GetRequestDigest } from './GetRequestDigest.js'
import { App } from '../Core/App.js'

// @START-File
/**
 * 
 * @param {Object} param
 */
export async function AddImportToFile({ module, path, file, dir }) {
    let digest;
    let request;

    // FIXME: Update SharePoint API
    if (App.isProd()) {
        digest = await GetRequestDigest();
        request  = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files('app.js')/$value`, {
            method: 'GET',
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });
    } else {
        request = await fetch(`http://127.0.0.1:8080/${path}/${file}.js`);
    }

    let content = await request.text();

    // Set import
    const imports = content.match(/\/\/ @START-Imports([\s\S]*?)\/\/ @END-Imports/);
    const newImports = imports[1] + `import ${module} from './${dir}/${module}.js'\n`
    const updatedContent = content.replace(/\/\/ @START-Imports([\s\S]*?)\/\/ @END-Imports/, `// @START-Imports${newImports}// @END-Imports`);

    let setFile;

    if (App.isProd()) {
        setFile = await fetch(`${App.get('site')}/_api/web/GetFolderByServerRelativeUrl('App/src')/Files/Add(url='app.js',overwrite=true)`, {
            method: 'POST',
            body: updatedContent, 
            headers: {
                'binaryStringRequestBody': 'true',
                'Accept': 'application/json;odata=verbose;charset=utf-8',
                'X-RequestDigest': digest
            }
        });
    } else {
        setFile = await fetch(`http://127.0.0.1:2035/?path=${path}&file=${file}.js`, {
            method: 'POST',
            body: updatedContent
        });
    }
}
// @END-File