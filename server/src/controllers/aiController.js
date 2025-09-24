const geminiService = require('../services/ai/geminiService');
const catchAsync = require('../utils/catchAsync');

exports.getContext = catchAsync(async (req, res, next) => {
  const ctx = await geminiService.getUserContext(req.user._id);
  res.status(200).json({ status: 'success', context: ctx.context });
});

exports.updateContext = catchAsync(async (req, res, next) => {
  const ctx = await geminiService.updateUserContext(req.user._id, req.body.context);
  res.status(200).json({ status: 'success', context: ctx.context });
});

exports.generateContent = catchAsync(async (req, res, next) => {
  const { prompt, type } = req.body;
  const content = await geminiService.generateContent({ userId: req.user._id, prompt, type });
  res.status(200).json({ status: 'success', content });
});
