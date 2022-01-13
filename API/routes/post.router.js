const express = require('express');
const router = express.Router();

const postController = require('../controllers/post.controller');

router.get('/', postController.getPosts);

router.get('/user/:id', postController.getPostsByUser);

router.get('/:id', postController.getPost);

router.put('/:id', postController.updatePost);

router.delete('/:id', postController.deletePost);


module.exports = router;