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

// Listen for requests
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});