import { mkdir, readdir, readFile, writeFile } from 'fs/promises';

let output = [
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
].join('\n');

try {
    const paths = [
        '../src/Robi/Actions',
        '../src/Robi/Core',
        '../src/Robi/Models'
    ];

    for (const path of paths) {
        output += await getFiles(path);
    }

    const dir = mkdir('../src/Robi/dist', { recursive: true });
    const build = await writeFile('../src/Robi/dist/Robi.js', output);
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