const axios = require('axios');
const AppError = require('../../utils/appError');

// Replay a captured Twitter API request (from HTTP Toolkit)
async function replayTwitterRequest({ method, url, headers, data }) {
  try {
    const response = await axios({ method, url, headers, data });
    return response.data;
  } catch (err) {
    throw new AppError('Twitter automation failed: ' + (err.response?.data?.error || err.message), 500);
  }
}

module.exports = { replayTwitterRequest };
