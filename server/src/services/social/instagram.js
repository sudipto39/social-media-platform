const axios = require('axios');
const AppError = require('../../utils/appError');

// Post to Instagram (image or video)
async function postToInstagram({ accessToken, imageUrl, caption, igUserId }) {
  try {
    // Instagram Graph API: create media object, then publish
    // 1. Create media object
    const mediaRes = await axios.post(
      `https://graph.facebook.com/v18.0/${igUserId}/media`,
      { image_url: imageUrl, caption, access_token: accessToken }
    );
    // 2. Publish media
    const publishRes = await axios.post(
      `https://graph.facebook.com/v18.0/${igUserId}/media_publish`,
      { creation_id: mediaRes.data.id, access_token: accessToken }
    );
    return publishRes.data;
  } catch (err) {
    throw new AppError('Instagram posting failed', 500);
  }
}

// Placeholder for token refresh logic
async function refreshInstagramToken(refreshToken) {
  // Implement OAuth2 token refresh if needed
  return null;
}

module.exports = { postToInstagram, refreshInstagramToken };
