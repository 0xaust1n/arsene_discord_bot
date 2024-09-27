const admin = require('firebase-admin');
const db = admin.database();
const ref = db.ref('/game-history');

module.exports = {
  saveHistory: async (key, input) => {
    const existResult = await ref.child(key).get();
    const exist = existResult.val();
    if (exist && input.isWin == false) {
      const totalValue = input.pool + exist.pool;
      await ref.child(key).update({
        pool: totalValue,
        deck: input.deck,
      });
    } else {
      await ref.child(key).set({
        pool: input.pool,
        deck: input.deck,
      });
    }
  },

  addToPool: async (key, value) => {
    const existResult = await ref.child(key).get();
    const exist = existResult.val();
    if (exist) {
      await ref.child(key).update({
        pool: value + exist.pool,
        deck: exist.deck,
      });
    }
  },
  getHistory: async (key) => {
    const dbReuslt = await ref.child(key).get();
    return dbReuslt.val();
  },
};
