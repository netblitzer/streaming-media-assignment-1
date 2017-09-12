const fs = require('fs');
const path = require('path');

const getRange = (request) => {
  let r = request.headers.range;

  if (!r) {
    r = 'bytes=0-';
  }

  return r;
};

const getStream = (response, file, rng) => {
  const stream = fs.createReadStream(file, rng);

  stream.on('open', () => {
    stream.pipe(response);
  });

  stream.on('error', (streamErr) => {
    response.end(streamErr);
  });
};

const loadFile = (request, response, dir, type) => {
  // create a file object
  const file = path.resolve(__dirname, dir);

  // check over the file for errors
  fs.stat(file, (err, stats) => {
    // if any errors, return with the correct error code
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }

      response.end();
      return;
    }

    // find the byte range requested
    const range = getRange(request);

    // get the positions of the range
    const positions = range.replace(/bytes=/, '').split('-');

    let start = parseInt(positions[0], 10);

    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }

    const chunksize = (end - start) + 1;

    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': type,
    });

    // create the stream and pipe to the response
    getStream(response, file, { start, end });
  });
};

const getParty = (request, response) => {
  loadFile(request, response, '../client/party.mp4', 'video/mp4');
};

const getBird = (request, response) => {
  loadFile(request, response, '../client/bird.mp4', 'video/mp4');
};

const getBling = (request, response) => {
  loadFile(request, response, '../client/bling.mp3', 'audio/mpeg');
};

// Export the functions
module.exports = {
  getParty,
  getBling,
  getBird,
};
