const axios = require('axios');
const AppError = require('../../utils/appError');

// Post to LinkedIn (text or media)
async function postToLinkedIn({ accessToken, content, mediaUrl, profileId }) {
  try {
    const url = `https://api.linkedin.com/v2/ugcPosts`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    };
    const data = {
      author: `urn:li:person:${profileId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: content },
          shareMediaCategory: mediaUrl ? 'IMAGE' : 'NONE',
          media: mediaUrl ? [{ status: 'READY', originalUrl: mediaUrl }] : []
        }
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
    };
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (err) {
    throw new AppError('LinkedIn posting failed', 500);
  }
}

// Placeholder for token refresh logic
async function refreshLinkedInToken(refreshToken) {
  // Implement OAuth2 token refresh if needed
  return null;
}

module.exports = { postToLinkedIn, refreshLinkedInToken };
