
# Reverse Proxy Server with Load Balancing and Caching

This is a simple **Reverse Proxy** server built with **Express.js**, **http-proxy**, and **NodeCache**. It forwards incoming HTTP requests to multiple backend servers, balancing the load between them, and caches responses to improve performance.

## Features

- **Load Balancing**: Requests are forwarded to one of the backend servers using a round-robin algorithm.
- **Caching**: Responses from the backend servers are cached to reduce server load and improve response times.
- **Error Handling**: If a backend server is unreachable, a "502 Bad Gateway" error is returned to the client.
- **Environment Variables**: Configuration like server ports are managed using environment variables for flexibility.

## Prerequisites

- **Node.js** (v14.x or later)
- **npm** (or yarn)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/reverse-proxy.git
   cd reverse-proxy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create an `.env` file to store environment variables. Here is an example:
   ```env
   BACKEND1_HOST=localhost
   BACKEND1_PORT=8081
   BACKEND2_HOST=localhost
   BACKEND2_PORT=8082
   CACHE_TTL=100
   ```

4. Start the proxy server:
   ```bash
   npm start
   ```

   The server will start on port `8000` by default, and it will forward requests to the backend servers defined in the `.env` file.

## Usage

- The proxy server listens on **port 8000** by default. You can test the server by sending requests to the following endpoints:
  - **/hello**: Returns a `Hello page` message.
  - **/gateway**: (if implemented) Returns a `Gateway page` message.

Example cURL request:
```bash
curl http://localhost:8000/hello
```

### Load Balancing
The proxy server distributes incoming requests to the backend servers in a round-robin fashion. For example:
- `Request 1` goes to `backend1` (port `8081`)
- `Request 2` goes to `backend2` (port `8082`)

### Caching
The proxy caches responses from the backend servers for `100 seconds` (as set in the `.env` file). Subsequent requests to the same URL will return the cached response until the cache expires.

## Error Handling

- If a backend server is unreachable, the proxy will return a **502 Bad Gateway** error.

## Contributing

If you'd like to contribute to this project:
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
