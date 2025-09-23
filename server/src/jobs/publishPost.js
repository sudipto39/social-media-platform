const Post = require('../models/Post');
const SocialAccount = require('../models/SocialAccount');
const { postToTwitter } = require('../services/social/twitter');
const { postToLinkedIn } = require('../services/social/linkedin');
const { postToInstagram } = require('../services/social/instagram');

module.exports = async function(job) {
  const { postId } = job.data;
  const post = await Post.findById(postId).populate('socialAccounts');
  if (!post) throw new Error('Post not found');
  let results = [];
  for (const account of post.socialAccounts) {
    try {
      let res;
      if (account.platform === 'twitter') {
        res = await postToTwitter({ accessToken: account.accessToken, content: post.content });
      } else if (account.platform === 'linkedin') {
        res = await postToLinkedIn({ accessToken: account.accessToken, content: post.content, profileId: account.profileId });
      } else if (account.platform === 'instagram') {
        // For demo, use first media as imageUrl
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
