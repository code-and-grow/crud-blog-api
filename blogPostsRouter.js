// Set up dependencies
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

const timeCreated = new Date().toTimeString();
BlogPosts.create(
	'My 1st Awesome Post',
	'Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit. Curabitur blandit tempus porttitor. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
	'Holden Caufield',
	timeCreated);

BlogPosts.create(
	'My Second Interesting Post',
	'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Cras mattis consectetur purus sit amet fermentum. Nulla vitae elit libero, a pharetra augue.',
	'Holden Caufield',
	timeCreated);

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

// Add blog post
router.post('/', jsonParser, (req, res) => {
	const required = ['title', 'content', 'author', 'publishDate'];
	for(let i=0; i<required.length; i++) {
		const field = required[i];
		if(!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.log(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(item);
});

// Delete blog post by ID
router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post ${req.params.id}`);
	res.status(204).end();
});

// Update blog post by ID
router.put('/:id', jsonParser, (req, res) => {
	const required = ['id', 'title', 'content', 'author', 'publishDate'];
	for(let i = 0; i < required.length; i++){
		const field = required[i];
		if(!(field in req.body)) {
			const message = `Missing ${field} in request body`;
			console.log(message);
			return res.status(400).send(message);
		}
	}
	if(req.params.id !== req.body.id) {
		const message = `Request path id (${req.params.id}) and request body id (${req.body.id} must match)`;
		console.log(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog post with id ${req.params.id}`);
	BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end();
});


module.exports = router;