const Bull = require('bull');
const publishPost = require('../jobs/publishPost');
const config = require('../config/default');

const postQueue = new Bull('postQueue', config.redisUrl);

postQueue.process(publishPost);

postQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

postQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

module.exports = postQueue;
