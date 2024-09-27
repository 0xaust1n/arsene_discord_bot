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

  getHistory: async (key) => {
    const dbReuslt = await ref.child(key).get();
    return dbReuslt.val();
  },
};
