import { createServer } from 'http';
import { createWriteStream } from 'fs';

createServer((req, res) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET",
        "Access-Control-Max-Age": 2592000, // 30 days
        /** add other headers as per requirement */
    };

    if (req.method === "POST") {
        let body;

        req.on("data", data => {
            body = data;
            const url = decodeURI(req.url);
            const query = url.split('?')[1];
            const props = query.split('&');
            const { path, file } = Object.fromEntries(props.map(prop => {
                const [ key, value ] = prop.split('=');
                return [ key, value ];
            }));

            var writableStream = createWriteStream(`../${path}/${file}`);

            writableStream.write(data);
        });

        req.on("end", () => {
            res.writeHead(200, headers);
            res.end(body);
        });
    }
}).listen(2035);