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
    let user;
    if (msg.mentions.users.first() != undefined) {
      user = msg.mentions.users.first();
    } else {
      user = msg.author;
    }
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
};
