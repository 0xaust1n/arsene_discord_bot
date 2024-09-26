const chance = require('chance').Chance();

module.exports = {
  getRandomInt: (min, max) => {
    return chance.integer({ min: min, max: max });
  },

  gertRandomElemet: (array) => {
    return chance.pickone(array);
  },
};
