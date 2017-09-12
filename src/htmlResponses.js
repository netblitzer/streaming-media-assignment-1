const fs = require('fs');

// Preload all files
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const client2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const client3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

// Index handler
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};
// Client2 handler
const getClient2 = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(client2);
  response.end();
};
// Client3 handler
const getClient3 = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(client3);
  response.end();
};

// Export the functions
module.exports = {
  getIndex,
  getClient2,
  getClient3,
};
