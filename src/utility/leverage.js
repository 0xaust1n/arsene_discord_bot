const admin = require('firebase-admin');
const db = admin.database();
const ref = db.ref(`/leverage`);
module.exports = {
  name: 'leverage ',
  description: 'utility for leverage',
  add: async (user, a) => {
    //return int
    const amount = parseInt(a);
    const dbResult = await ref.child(user.id).once('value');
    const userInfo = dbResult.val();
    if (userInfo != null) {
      let currentAmount = parseInt(userInfo.amount) + amount;
      // handle negative numbers
      if (amount < 0 && Math.abs(amount) >= parseInt(userInfo.amount)) {
        currentAmount = 0;
      }
      ref.child(`${user.id}`).update({
        name: `${user.username}`,
        amount: currentAmount,
      });
      return currentAmount;
    }
  },
  get: async (user) => {
    dbResult = await ref.child(user.id).once('value');
    const userInfo = dbResult.val();
    if (userInfo != null) {
      let currentAmount = parseInt(userInfo.amount);
      return currentAmount;
    } else {
      ref.child(`${user.id}`).set({
        name: `${user.username}`,
        amount: `${50}`,
        xp: 0,
        level: `Fish`,
      });
      return 50;
    }
  },
  set: async (user, amount) => {
    ref.child(`${user.id}`).update({
      amount: amount,
    });
  },
};
