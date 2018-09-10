// Set up dependencies
const express = require('express');
const morgan = require('morgan');

// Set up app
const app = express();

// Import BlogPosts model
const blogPostsRouter = require('./blogPostsRouter');

// Log HTTP layer
app.use(morgan('common'));

// Set up router to handle requests
app.use('/blog-posts', blogPostsRouter);

let server;

// function to start server for tests
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise ( (resolve, reject) => {
    server = app;
    server.listen(port, () => {
      console.log(`Server has started and app is listening on port ${port}`);
      resolve(server);
    })
    .on('error', err => {
      reject(err);
    });
  });
}

// function to close server after running tests
function closeServer() {
  return new Promise ( (resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if(err) {
        reject(err);
        return;
      } 
      resolve();
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block runs.
if(require.main === module) {
  runServer().catch(err => console.error(err));
}

// Listen for requests
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});

module.exports = {app, runServer, closeServer};