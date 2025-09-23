const axios = require('axios');
const AppError = require('../../utils/appError');

// Post a tweet (text or media)
async function postToTwitter({ accessToken, content, mediaUrl }) {
  try {
    // Twitter API v2 endpoint for posting tweets
    const url = 'https://api.twitter.com/2/tweets';
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };
    const data = { text: content };
    // For media, Twitter requires separate upload flow (not implemented here)
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (err) {
    throw new AppError('Twitter posting failed', 500);
  }
}

// Placeholder for token refresh logic
async function refreshTwitterToken(refreshToken) {
  // Implement OAuth2 token refresh if needed
  return null;
}

module.exports = { postToTwitter, refreshTwitterToken };
