import { readFile } from 'fs/promises'
import { readfiles } from './readfiles.js'

export async function getFiles(path) {
    let output = '';

    const files = await readfiles(path);

    for (const file of files) {
        const text = await readFile(`${path}/${file}`, 'utf8');
        const content = text.match(/\/\/ @START-File([\s\S]*?)\/\/ @END-File/);

        if (file === 'InitializeApp.js') {
            let updatedContent = content[1].replace(/\/\* @START-timestamp \*\/([\s\S]*?)\/\* @END-timestamp \*\//, `/* @START-timestamp */'${new Date().toISOString()}'/* @END-timestamp */`);

            output += updatedContent;
            
            continue;
        }

        output += content[1];
    }

    return output;
}