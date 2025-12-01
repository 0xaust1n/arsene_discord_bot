const chance = require('chance').Chance();

module.exports = {
  getRandomInt: (min, max) => {
    return chance.integer({ min: min, max: max });
  },

  getRandomElement: (array) => {
    return chance.pickone(array);
  },
};
