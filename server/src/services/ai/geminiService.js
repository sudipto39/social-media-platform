const AIContext = require('../../models/AIContext');
const AppError = require('../../utils/appError');
const config = require('../../config/default');
const fetch = require('node-fetch');

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
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + config.geminiApiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'system', parts: [{ text: systemPrompt }] },
          { role: 'user', parts: [{ text: prompt }] }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Gemini API error');
    // Gemini API returns candidates[0].content.parts[0].text
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err) {
    throw new AppError('AI content generation failed: ' + err.message, 500);
  }
}

module.exports = {
  getUserContext,
  updateUserContext,
  generateContent
};
