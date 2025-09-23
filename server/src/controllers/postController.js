const Post = require('../models/Post');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { schedulePost } = require('../services/scheduler');

exports.createPost = catchAsync(async (req, res, next) => {
  const { content, media, type, socialAccounts, scheduledFor, platform } = req.body;
  const post = await Post.create({
    user: req.user._id,
    content,
    media,
    type,
    socialAccounts,
    scheduledFor,
    platform,
    status: scheduledFor ? 'scheduled' : 'draft'
  });
  if (scheduledFor) await schedulePost(post._id, scheduledFor);
  res.status(201).json({ status: 'success', post });
});

exports.getPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find({ user: req.user._id }).populate('socialAccounts');
  res.status(200).json({ status: 'success', posts });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const post = await Post.findOne({ _id: req.params.id, user: req.user._id }).populate('socialAccounts');
  if (!post) return next(new AppError('Post not found', 404));
  res.status(200).json({ status: 'success', post });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!post) return next(new AppError('Post not found', 404));
  res.status(200).json({ status: 'success', post });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!post) return next(new AppError('Post not found', 404));
  res.status(204).json({ status: 'success', data: null });
});
