const express = require('express');
const socialController = require('../controllers/socialController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.post('/', socialController.addSocialAccount);
router.get('/', socialController.getSocialAccounts);
router.delete('/:id', socialController.deleteSocialAccount);

module.exports = router;
