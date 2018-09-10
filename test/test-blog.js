// set up dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

// test starts
describe('Blog', function() {

  //start the server
  before(function() {
    return runServer();
  });
  // close server when done
  after(function() {
    return closeServer();
  });

  // normal case test strategy I:
  // 1. send GET request to '/blogs-posts'
  // 2. check if blog posts list is returned and has expected data
  it('should return blog posts list with GET request', function() {
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);
        const expectedKeys = ['title', 'content', 'author', 'publishDate', 'id'];
        res.body.forEach( function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);          
        });
      });
  });
  // normal case test strategy II:
  // 1. send POST request to '/blog-posts' with proper data
  // 2. check if the response object has expected data
  it('should add a blog post with POST request', function() {
    const newPost = {
      title: 'Test title',
      content: 'Test content',
      author: 'Test Author',
      publishDate: '00:00:00 31.08.2018'
    }
    return chai
      .request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys(newPost);
        expect(res.body.title).to.equal(newPost.title);
        expect(res.body.content).to.equal(newPost.content);
        expect(res.body.author).to.equal(newPost.author);
        expect(res.body.publishDate).to.equal(newPost.publishDate);
      });
  });
  // normal case test strategy III:
  // 1. send GET request to get a blog post id for updating
  // 2. send PUT request to update blog post
  // 3. check if the response has updated data
  it('should update a blog post with PUT request', function() {
    const updatePost = {
      title: 'Updated title',
      content: 'Updated content',
      author: 'Updated Author',
      publishDate: '11:11:11 01.09.2018'
    }
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(res) {
        updatePost.id = `${res.body[0].id}`;
        return chai
          .request(app)
          .put(`/blog-posts/${updatePost.id}`)
          .send(updatePost)
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
  // normal case test strategy IV:
  // 1. send GET request to get a blog post id for deleting
  // 2. send DELETE request to delete blog post
  it('should delete a blog post with DELETE request', function() {
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai
          .request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
  // edge case test strategy I:
  // 1. send POST request to '/blog-posts' with missing data
  // 2. check if the response status is set to 400
  it('should not add blog post when missing a field', function() {
    const newPost = {
      title: 'Test title',
      content: 'Test content',
      author: 'Test Author'
    }
    return chai
      .request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        expect(res).to.have.status(400);
      });    
  });
  // edge case test strategy II:
  // 1. send GET request to get a blog post id for updating
  // 2. send PUT request to update blog post with unmatching IDs
  // 3. check if the response status is set to 400
  it('should not update a blog post with PUT request if req.params and req.body IDs don\'t match', function() {
    const updatePost = {
      title: 'Updated title',
      content: 'Updated content',
      author: 'Updated Author',
      publishDate: '11:11:11 01.09.2018'
    }
    return chai
      .request(app)
      .get('/blog-posts')
      .then(function(res) {
        updatePost.id = `${res.body[0].id}`;
        return chai
          .request(app)
          .put(`/blog-posts/${res.body[1].id}`)
          .send(updatePost)
      })
      .then(function(res) {
        expect(res).to.have.status(400);
      });
  });
});