const express = require('express');
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.post('/', postController.createPost);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;
