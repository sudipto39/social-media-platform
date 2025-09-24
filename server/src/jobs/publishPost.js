const Post = require('../models/Post');
const SocialAccount = require('../models/SocialAccount');
const { replayTwitterRequest } = require('../services/social/twitter');
const { replayLinkedInRequest } = require('../services/social/linkedin');
const { postToInstagram } = require('../services/social/instagram');

module.exports = async function(job) {
  const { postId, twitterRequest, linkedinRequest } = job.data;
  const post = await Post.findById(postId).populate('socialAccounts');
  if (!post) throw new Error('Post not found');
  let results = [];
  for (const account of post.socialAccounts) {
    try {
      let res;
      if (account.platform === 'twitter') {
        // Use captured HTTP Toolkit request for Twitter
        res = await replayTwitterRequest(twitterRequest);
      } else if (account.platform === 'linkedin') {
        // Use captured HTTP Toolkit request for LinkedIn
        res = await replayLinkedInRequest(linkedinRequest);
      } else if (account.platform === 'instagram') {
        // Use Meta Graph API for Instagram
        res = await postToInstagram({ accessToken: account.accessToken, imageUrl: post.media[0], caption: post.content, igUserId: account.profileId });
      }
      results.push({ platform: account.platform, status: 'success', response: res });
    } catch (err) {
      results.push({ platform: account.platform, status: 'failed', error: err.message });
    }
  }
  // Update post status
  post.status = results.every(r => r.status === 'success') ? 'published' : 'failed';
  post.publishedAt = new Date();
  post.error = results.filter(r => r.status === 'failed').map(r => r.error).join('; ');
  await post.save();
  return results;
};
