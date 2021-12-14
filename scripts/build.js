import { mkdir, readdir, readFile, writeFile } from 'fs/promises';

let license = [
    `// Copyright ${new Date().getFullYear()} Stephen Matheis`,
    '',
    '// Permission to use, copy, modify, and/or distribute this software for any',
    '// purpose with or without fee is hereby granted, provided that the above',
    '// copyright notice and this permission notice appear in all copies.' ,
    '',
    '// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES',
    '// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF',
    '// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY',
    '// SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER',
    '// RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF',
    '// CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN',
    '// CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.',
    ''
];

try {
    // Robi
    await buildFile({
        paths: [
            '../src/Robi/Actions',
            '../src/Robi/Core',
            '../src/Robi/Models'
        ],
        imports: [
            '../src/Robi/Components'
        ],
        importFile: 'RobiUI.js',
        file:'Robi.js'
    });

    // RobiUI
    await buildFile({
        paths: [
            '../src/Robi/Components',
        ],
        imports: [
            '../src/Robi/Actions',
            '../src/Robi/Core',
            '../src/Robi/Models'
        ],
        importFile: 'Robi.js',
        file: 'RobiUI.js'
    });
} catch (err) {
    console.error(err);
}

async function getFiles(path) {
    let output = '';

    const files = await readdir(path);

    for (const file of files) {
        const text = await readFile(`${path}/${file}`, 'utf8');
        const content = text.match(/\/\/ @START-File([\s\S]*?)\/\/ @END-File/);

        output += content[1];
    }

    return output;
}

async function buildFile({ paths, imports, importFile, file }) {
    let output = license.join('\n');
    let importNames = [];

    // Imports
    for (const path of imports) {
        importNames = importNames.concat(await readdir(path)); 
    }

    output += [
        '',
        'import {',
        importNames.map(name => `    ${name.replace('.js', '')}`).join(',\n'),
        `} from './${importFile}'`,
        ''
    ].join('\n');

    for (const path of paths) {
        output += await getFiles(path);
    }

    await mkdir('../src/Robi/dist', { recursive: true });
    await writeFile(`../src/Robi/dist/${file}`, output);
}