const axios = require('axios');
const AppError = require('../../utils/appError');

// Replay a captured LinkedIn API request (from HTTP Toolkit)
async function replayLinkedInRequest({ method, url, headers, data }) {
  try {
    const response = await axios({ method, url, headers, data });
    return response.data;
  } catch (err) {
    throw new AppError('LinkedIn automation failed: ' + (err.response?.data?.message || err.message), 500);
  }
}

module.exports = { replayLinkedInRequest };
