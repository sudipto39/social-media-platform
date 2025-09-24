const axios = require('axios');
const AppError = require('../../utils/appError');

// Post to Instagram using Meta Graph API (official)
async function postToInstagram({ accessToken, imageUrl, caption, igUserId }) {
  try {
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
    throw new AppError('Instagram posting failed: ' + (err.response?.data?.error?.message || err.message), 500);
  }
}

// Meta Graph API handles token refresh via long-lived tokens (not implemented here)

module.exports = { postToInstagram };
