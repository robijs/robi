import { createServer } from 'http';
import { createWriteStream, mkdirSync, renameSync } from 'fs';

createServer((req, res) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
        "Access-Control-Max-Age": 2592000, // 30 days
    };

    console.log(req.method);

    if (req.method === "POST") {
        let body;

        req.on("data", data => {
            body = data;

            // TODO: Handle malformed requests
            const url = decodeURI(req.url);
            const query = url.split('?')[1];
            const props = query.split('&');
            const { path, file } = Object.fromEntries(props.map(prop => {
                const [ key, value ] = prop.split('=');
                return [ key, value ];
            }));

            // Make dirs if they don't exist
            mkdirSync(`./${path}`, { recursive: true });

            const writableStream = createWriteStream(`./${path}/${file}`);
            writableStream.write(data);

            console.log(`\nSuccessfully wrote to -> ${path}/${file}\n`);
        });

        req.on("end", () => {
            res.writeHead(200, headers);
            res.end(body);
        });

        return;
    }

    if (req.method === "OPTIONS") {
        console.log('reached options');
        res.writeHead(200, headers);
        res.end();
        return;
    }

    if (req.method === "DELETE") {
        console.log(`DELETE`);

        // TODO: Handle malformed requests
        const url = decodeURI(req.url);
        const query = url.split('?')[1];
        const props = query.split('&');
        const { path, file } = Object.fromEntries(props.map(prop => {
            const [ key, value ] = prop.split('=');
            return [ key, value ];
        }));

        // Make dirs if they don't exist
        renameSync(`./${path}`, `./${path}_ARCHIVED`);

        console.log(`\nSuccessfully archvied route at -> ${path}_ARCHIVED\n`);

        req.on("end", () => {
            res.writeHead(200, headers);
        });

        return;
    }

    if (req.method === "GET") {
        res.writeHead(200, headers);
        res.end(/*html*/ `
            <h1>Methods allowed:</h1>
            <ul>
                <li>POST: http://127.0.0.1:2035/?path=[path/to/file]&file=[filename.ext]</li>
                <li>DELETE:</li>
                <ul>
                    <li>Directory: http://127.0.0.1:2035/?path=[path/to/dir]</li>
                    <li>File: http://127.0.0.1:2035/?path=[path/to/file]&file=[filename.ext]</li>
                </ul>
            </ul>
        `);
        return;
    }

}).listen(2035);