const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const config = require('../config/default');

const signToken = id => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  user.password = undefined;
  res.status(201).json({
    status: 'success',
    token,
    user
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = signToken(user._id);
  user.password = undefined;
  res.status(200).json({
    status: 'success',
    token,
    user
  });
});

// Social OAuth skeletons (to be implemented in detail later)
exports.twitterAuth = (req, res, next) => {
  // passport.authenticate('twitter')
  res.status(501).json({ status: 'error', message: 'Twitter OAuth not implemented yet.' });
};
exports.linkedinAuth = (req, res, next) => {
  // passport.authenticate('linkedin')
  res.status(501).json({ status: 'error', message: 'LinkedIn OAuth not implemented yet.' });
};
exports.instagramAuth = (req, res, next) => {
  // passport.authenticate('instagram')
  res.status(501).json({ status: 'error', message: 'Instagram OAuth not implemented yet.' });
};

exports.oauthSuccess = (req, res) => {
  // You can customize this response or redirect to frontend
  res.status(200).json({
    status: 'success',
    user: req.user,
    message: 'OAuth login successful.'
  });
};
