const mongoose = require("mongoose");
const models = require("../models");
const { User } = models;
const config = require("../config/mongo");

// const seeds = () => {
//   for (i = 0; i < 10; i++) {
//     let newUser = new User({
//       displayName: `User${i}`
//     });
//   }
//
//   let promises = [];
//
//   return Promise.all(promises);
// };

const mongodbUrl =
  process.env.NODE_ENV === "production"
    ? process.env[config.use_env_variable]
    : `mongodb://${config.host}/${config.database}`;

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  mongoose: mongoose,
  seeds: seeds,
  models: models,
  clean: true
});
