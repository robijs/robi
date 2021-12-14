import { readdir, readFile, writeFile } from 'fs/promises'

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
    '',
    ''
];

try {
    // Robi
    await buildFile({
        paths: [
            './src/Robi/Actions',
            './src/Robi/Core',
            './src/Robi/Models'
        ],
        file:'Robi.js'
    });

    // RobiUI
    await buildFile({
        paths: [
            './src/Robi/Components',
        ],
        file: 'RobiUI.js'
    });
} catch (err) {
    console.error(err);
}

async function buildFile({ paths, file }) {
    let output = license.join('\n');
    let exportNames = [];

    // Imports
    for (const path of paths) {
        const files = await readdir(path);
        exportNames = exportNames.concat(files);
        
        output += files.map(file => {
            return `import { ${file.replace('.js', '')} } from '${path.replace('./src/Robi/', './')}/${file}'`
        }).join('\n');

        output += '\n';
    }


    output += [
        '',
        'export {',
        exportNames.map(name => `    ${name.replace('.js', '')}`).join(',\n'),
        `}`,
        ''
    ].join('\n');

    // importNames.forEach(file => {
    //     const name = file.replace('.js', '')
    //     console.log(`Function: ${name}`);
    //     const found = body.search(`${name}\\(`);
    //     console.log(found);
    // });

    await writeFile(`./src/Robi/${file}`, output);

    console.log(`Built ${file} in src/Robi`);
}