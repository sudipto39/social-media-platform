const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Twitter OAuth
router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login', session: true }), authController.oauthSuccess);

// LinkedIn OAuth
router.get('/linkedin', passport.authenticate('linkedin'));
router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login', session: true }), authController.oauthSuccess);

// Instagram OAuth
router.get('/instagram', passport.authenticate('instagram'));
router.get('/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login', session: true }), authController.oauthSuccess);

module.exports = router;
