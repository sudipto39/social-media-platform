const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const User = require('../models/User');
const SocialAccount = require('../models/SocialAccount');
const config = require('./default');

module.exports = function(passport) {
  // Twitter
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL,
    passReqToCallback: true
  }, async (req, token, tokenSecret, profile, done) => {
    try {
      let user = req.user;
      if (!user) {
        // Not logged in, create or find user by Twitter profile
        user = await User.findOne({ email: profile.emails?.[0]?.value });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails?.[0]?.value || `${profile.username}@twitter.com`,
            avatar: profile.photos?.[0]?.value
          });
        }
      }
      // Link social account
      await SocialAccount.findOneAndUpdate(
        { user: user._id, platform: 'twitter' },
        {
          accessToken: token,
          refreshToken: tokenSecret,
          profileId: profile.id,
          profileName: profile.displayName,
          profileAvatar: profile.photos?.[0]?.value
        },
        { upsert: true, new: true }
      );
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

  // LinkedIn
  passport.use(new LinkedInStrategy({
    clientID: config.linkedin.clientID,
    clientSecret: config.linkedin.clientSecret,
    callbackURL: config.linkedin.callbackURL,
    scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = req.user;
      if (!user) {
        user = await User.findOne({ email: profile.emails?.[0]?.value });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value
          });
        }
      }
      await SocialAccount.findOneAndUpdate(
        { user: user._id, platform: 'linkedin' },
        {
          accessToken,
          refreshToken,
          profileId: profile.id,
          profileName: profile.displayName,
          profileAvatar: profile.photos?.[0]?.value
        },
        { upsert: true, new: true }
      );
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

  // Instagram
  passport.use(new InstagramStrategy({
    clientID: config.instagram.clientID,
    clientSecret: config.instagram.clientSecret,
    callbackURL: config.instagram.callbackURL,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = req.user;
      if (!user) {
        user = await User.findOne({ email: profile.emails?.[0]?.value });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails?.[0]?.value || `${profile.username}@instagram.com`,
            avatar: profile.photos?.[0]?.value
          });
        }
      }
      await SocialAccount.findOneAndUpdate(
        { user: user._id, platform: 'instagram' },
        {
          accessToken,
          refreshToken,
          profileId: profile.id,
          profileName: profile.displayName,
          profileAvatar: profile.photos?.[0]?.value
        },
        { upsert: true, new: true }
      );
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

  // Serialize/deserialize
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
