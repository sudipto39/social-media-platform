const express = require('express');
const router = express.Router();

// GET: Verification callback from Meta (hub.challenge)
router.get('/instagram', (req, res) => {
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// POST: Webhook events
router.post('/instagram', (req, res) => {
  // You can add signature validation if needed
  // For now, just log and 200 OK
  try {
    console.log('Instagram Webhook Event:', JSON.stringify(req.body));
  } catch (e) {}
  res.sendStatus(200);
});

module.exports = router;
