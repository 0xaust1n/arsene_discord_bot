const admin = require('firebase-admin');
const db = admin.database();
const ref = db.ref('/game-history');

module.exports = {
  saveHistory: async (key, value) => {
    const existResult = await ref.child(key).get();
    const exist = existResult.val();
    if (exist) {
      await ref.child(key).update({
        pool: value.pool + exist.pool,
        ...value,
      });
    }
  },

  addRandomToPool: async (key, value) => {
    const existResult = await ref.child(key).get();
    const exist = existResult.val();
    if (exist) {
      await ref.child(key).update({
        pool: exist.pool > 0 ? value.pool + exist.pool : exist.pool,
        ...exist.deck,
      });
    }
  },
  getHistory: async (key) => {
    const dbReuslt = await ref.child(key).get();
    return dbReuslt.val();
  },
};
