const Instagram = require('node-instagram').default;

const InstagramService = {
  getSelfFeed: user => {
    const instagram = new Instagram({
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      accessToken: user.instagramAccessToken
    });

    return instagram.get('users/self/media/recent', { count: 12 });
  }
};

module.exports = InstagramService;
