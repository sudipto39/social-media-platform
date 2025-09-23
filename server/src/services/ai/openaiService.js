const OpenAI = require('openai');
const AIContext = require('../../models/AIContext');
const config = require('../../config/default');
const AppError = require('../../utils/appError');

const openai = new OpenAI({ apiKey: config.openaiApiKey });

async function getUserContext(userId) {
  let ctx = await AIContext.findOne({ user: userId });
  if (!ctx) {
    ctx = await AIContext.create({ user: userId, context: {} });
  }
  return ctx;
}

async function updateUserContext(userId, context) {
  return await AIContext.findOneAndUpdate(
    { user: userId },
    { context, updatedAt: Date.now() },
    { new: true, upsert: true }
  );
}

async function generateContent({ userId, prompt, type = 'text' }) {
  const ctx = await getUserContext(userId);
  const systemPrompt = `You are a helpful social media assistant. Use the following business context: ${JSON.stringify(ctx.context)}. Generate a ${type} post that is engaging, authentic, and not obviously AI-generated.`;
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.8
    });
    return response.choices[0].message.content;
  } catch (err) {
    throw new AppError('AI content generation failed', 500);
  }
}

module.exports = {
  getUserContext,
  updateUserContext,
  generateContent
};
