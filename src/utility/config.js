const admin = require('firebase-admin');
const db = admin.database();

module.exports = {
  getConfig: async (key) => {
    const ref = db.ref(`/config/${key}`);
    const dbReuslt = await ref.get();
    return dbReuslt.val();
  },
};
