const express = require('express');
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/context', aiController.getContext);
router.put('/context', aiController.updateContext);
router.post('/generate', aiController.generateContent);

module.exports = router;
