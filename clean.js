const mongoose = require('mongoose');
const models = require('./models');


const clean = () => {
  const collections = mongoose
    .connection
    .collections;

  const collectionKeys = Object.keys(collections);

  let promises = [];

  collectionKeys.forEach((key) => {
    let promise = collections[key].remove();
    promises.push(promise);
  });

  return Promise.all(promises);
};

Object.keys(models).forEach((modelName) => {
  global[modelName] = mongoose.model(modelName);
});

require('./mongo')()
  .then(() => console.log('Cleaning Database...'))
  .then(() => {
    return clean();
  })
  .then(() => console.log('Done'))
  .catch((e) => console.error(e))
  .then(() => mongoose.disconnect());







