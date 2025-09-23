const SocialAccount = require('../models/SocialAccount');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.addSocialAccount = catchAsync(async (req, res, next) => {
  const { platform, accessToken, refreshToken, profileId, profileName, profileAvatar, expiresAt } = req.body;
  const account = await SocialAccount.create({
    user: req.user._id,
    platform,
    accessToken,
    refreshToken,
    profileId,
    profileName,
    profileAvatar,
    expiresAt
  });
  res.status(201).json({ status: 'success', account });
});

exports.getSocialAccounts = catchAsync(async (req, res, next) => {
  const accounts = await SocialAccount.find({ user: req.user._id });
  res.status(200).json({ status: 'success', accounts });
});

exports.deleteSocialAccount = catchAsync(async (req, res, next) => {
  const account = await SocialAccount.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!account) return next(new AppError('Social account not found', 404));
  res.status(204).json({ status: 'success', data: null });
});
