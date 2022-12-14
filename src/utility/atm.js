const admin = require('firebase-admin');
const db = admin.database();
const atmRef = db.ref(`/atm`);

module.exports = {
  name: 'atm ',
  description: 'utility for atm',
  save: async (user, a) => {
    //return int
    const amount = parseInt(a);
    const dbResult = await atmRef.child(user.id).once('value');
    const temp = dbResult.val();
    if (temp != null) {
      let currentAmount = parseInt(temp.amount) + amount;
      atmRef.child(`${user.id}`).update({
        name: `${user.username}`,
        amount: currentAmount,
      });
      return currentAmount;
    } else {
      atmRef.child(`${user.id}`).set({
        name: `${user.username}`,
        amount: amount,
      });
      return amount;
    }
  },

  withdraw: async (user, a) => {
    //return int
    const amount = parseInt(a);
    const dbResult = await atmRef.child(user.id).once('value');
    const temp = dbResult.val();
    if (temp != null) {
      let currentAmount = parseInt(temp.amount) - amount;
      atmRef.child(`${user.id}`).update({
        name: `${user.username}`,
        amount: currentAmount,
      });
      return currentAmount;
    } else {
      atmRef.child(`${user.id}`).set({
        name: `${user.username}`,
        amount: amount,
      });
      return amount;
    }
  },

  get: async (user) => {
    dbResult = await atmRef.child(user.id).once('value');
    const temp = dbResult.val();
    if (temp != null) {
      let currentAmount = parseInt(temp.amount);
      return currentAmount;
    } else {
      atmRef.child(`${user.id}`).set({
        name: `${user.username}`,
        amount: `${0}`,
      });
      return 0;
    }
  },
};
