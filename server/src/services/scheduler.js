const postQueue = require('../workers/queue');

async function schedulePost(postId, scheduledFor) {
  // Add job to queue to run at scheduledFor
  await postQueue.add({ postId }, { delay: Math.max(0, new Date(scheduledFor) - Date.now()) });
}

module.exports = { schedulePost };
