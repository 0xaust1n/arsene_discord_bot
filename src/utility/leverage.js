const admin = require('firebase-admin');
const db = admin.database();
const ref = db.ref(`/leverage`);
module.exports = {
  name: 'leverage ',
  description: 'utility for leverage',
  add: async (msg, a) => {
    //return int
    const amount = parseInt(a);
    const dbResult = await ref.child(msg.author.id).once('value');
    const temp = dbResult.val();
    if (temp.amount == undefined) {
      temp.amount = 50;
    }
    if (temp != null) {
      let currentAmount = parseInt(temp.amount) + amount;
      ref.child(`${msg.author.id}`).update({
        name: `${msg.author.username}`,
        amount: currentAmount,
      });
      return currentAmount;
    }
  },
  get: async (msg) => {
    const dbResult = await ref.child(msg.author.id).once('value');
    const temp = dbResult.val();
    if (temp != null) {
      let currentAmount = parseInt(temp.amount);
      return currentAmount;
    } else {
      ref.child(`${msg.author.id}`).set({
        name: `${msg.author.username}`,
        amount: `${50}`,
      });
      return 50;
    }
  },
};
