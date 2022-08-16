import { createServer } from 'http';
import { readFile, writeFile } from 'fs/promises'
import formidable from 'formidable'

const server = createServer((req, res) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
    };

    if (req.url === '/api/upload' && req.method.toLowerCase() === 'post') {
        // parse a file upload
        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                res.end(String(err));
                return;
            }

            let output = [];

            for (let name in files) {
                const temp = await readFile(files[name].filepath);

                // TODO: Pass in library name (replace hard coded uploads)
                await writeFile(`./uploads/${name}`, temp);

                console.log(`Uploaded '${name}' to ./uploads`);

                output.push(name);
            }

            res.writeHead(200, headers);
            // res.end(JSON.stringify({ fields, files }, null, 2));
            res.end(JSON.stringify(output));
        });

        return;
    }

    // show a file upload form
    headers['Content-type'] = 'text/html';
    res.writeHead(200, headers);
    res.end(/*html*/ `
        <form action="/api/upload" enctype="multipart/form-data" method="post">
            <div>File: <input type="file" name="multipleFiles" multiple="multiple" /></div>
            <input type="submit" value="Upload" />
        </form>
    `);
});

server.listen(2036, () => {
    console.log('Upload files to http://localhost:2036/api/upload');
});