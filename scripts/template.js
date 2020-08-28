const http = require('http');
const port = process.argv.slice(2) || 80;

const server = http.createServer((req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('not okay');
});

server.listen(+port, '0.0.0.0');

console.log(`Node server running on port ${port}`);