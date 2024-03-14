# Spaces README

This README provides instructions on how to run the server and client applications, a description of the application's architecture and concurrency handling, assumptions and design choices, and guidance on accessing the chat application once deployed.

## Running the Applications

### Run Server

install dependencies : `npm install`.
start server : `nodemon server.js`.
server will run on `http://localhost:4001`.

### Run Client

install dependencies : `npm install`.
start server : `npm start`.
client will run on `http://localhost:3000`.

## Application Architecture

### Client

The client application is built using React and uses the `socket.io-client` library to establish a connection with the server. Upon connecting, the client receives an initial chat history from the server and displays it. When a user types a message and clicks the "Send" button, the message is emitted to the server using the `socket.emit` method.

### Server

The server is built using Node.js and Express.js.When a client connects, the server generates or retrieves a session ID and associates it with the client's socket. The server maintains a chat history array and sends it to the client upon connection.

When the server receives a "ping" event from a client, it adds the message to the chat history and broadcasts it to all connected clients using the `io.emit` method.

Concurrency is handled by Socket.IO, which allows multiple clients to connect to the server simultaneously. Each client is assigned a unique session ID, and the server keeps track of all connected clients using a map.

## Design Choices

1. **Session Management**: The application uses session IDs to identify clients. When a client connects for the first time, a new session ID is generated and stored in the browser's localStorage. Subsequent connections use the stored session ID for identification.

2. **Chat History**: The chat history is maintained on the server-side and sent to clients upon connection. This design choice was made to ensure that all clients have the same chat history, even if they connect at different times.

3. **Real-time Updates**: The application uses Socket.IO for real-time communication, allowing for instant updates to be broadcasted to all connected clients.
