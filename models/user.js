const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  googleDisplayName: { type: String },
  googleId: { type: String },
  googleAccessToken: { type: String },
  googleRefreshToken: { type: String },

  githubDisplayName: { type: String },
  githubId: { type: String },
  githubAccessToken: { type: String },
  githubRefreshToken: { type: String },
  githubUsername: { type: String },

  linkedinDisplayName: { type: String },
  linkedinId: { type: String },
  linkedinAccessToken: { type: String },
  linkedinRefreshToken: { type: String },

  instagramDisplayName: { type: String },
  instagramId: { type: String },
  instagramAccessToken: { type: String },
  instagramRefreshToken: { type: String },

  twitterDisplayName: { type: String },
  twitterId: { type: String },
  twitterAccessToken: { type: String },
  twitterTokenSecret: { type: String }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
