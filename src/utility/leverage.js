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
    const temp = dbResult.val();
    if (temp != null) {
      let currentAmount = parseInt(temp.amount) + amount;
      ref.child(`${user.id}`).update({
        name: `${user.username}`,
        amount: currentAmount,
      });
      return currentAmount;
    }
  },
  get: async (user) => {
    dbResult = await ref.child(user.id).once('value');
    const temp = dbResult.val();
    if (temp != null) {
      let currentAmount = parseInt(temp.amount);
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
