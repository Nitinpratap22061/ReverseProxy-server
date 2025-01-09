const express = require("express");
require('dotenv').config(); 
const httpProxy = require("http-proxy");
const NodeCache = require("node-cache");


const app = express();
app.use(express.urlencoded({ extended: true }));
const proxy = httpProxy.createProxyServer();  // proxy server instance



// Caching setup
const cache = new NodeCache({
    stdTTL: 100, 
    checkPeriod: 120, 
});

// Backend server configuration
const backendServer = [
    { host: 'localhost', port: process.env.BACKEND_PORT1},
    { host: 'localhost', port: process.env.BACKEND_PORT2 },
];




let currServerIndex = 0; // Used for round-robin allocation method

// Proxy response event - outside the app.use handler
proxy.on('proxyRes', (proxyRes, req, res) => {
    const chunks = [];
    proxyRes.on("data", (chunk) => {
        chunks.push(chunk); // Collect data chunks from the backend server
    });

    proxyRes.on('end', () => {
        const completeResponse = Buffer.concat(chunks).toString();
        const cacheKey = req.url;
        cache.set(cacheKey, completeResponse); // Store the response in cache

        // Send the response to the client after caching
        if (!res.headersSent) {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            res.end(completeResponse);
        }
    });
});

//set kiye hai like if we hit hello server 2 has duty
app.get('/hello' , (req,res)=>{
    console.log("[LOG] Forwarding /hello request to Backend 2");
    proxy.web(req, res, { target: `http://localhost:8084` });
})

// Reverse Proxy server implementation
app.use((req, res) => {
    const cacheKey = req.url;

    // Check if the response is cached
    const cachedRes = cache.get(cacheKey);
    if (cachedRes) {
        console.log("[CACHE] Returning cached response");
        if (!res.headersSent) {
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(cachedRes); // Send cached response and stop further processing
        }
        return;
    }

    // Load balancing logic if not in cache
    const targetServer = backendServer[currServerIndex];
    currServerIndex = (currServerIndex + 1) % backendServer.length; // round-robin logic

    // Forward the request to the selected backend server using proxy
    console.log(`[LOG] Forwarding request to: ${targetServer.host}:${targetServer.port}`);
    proxy.web(req, res, { target: `http://${targetServer.host}:${targetServer.port}` });
});

// Error handling
proxy.on('error', (err, req, res) => {
    console.error('[ERROR]', err.message);
    if (!res.headersSent) {
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Bad Gateway: Unable to connect to the target server.');
    }
});

// Start the proxy server
app.listen(8000, () => {
    console.log("Proxy server started to listen on port 8000");
});
