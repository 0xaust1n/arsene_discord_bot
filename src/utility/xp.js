const admin = require('firebase-admin');
const db = admin.database();
const ref = db.ref(`/leverage`);
const level = require('../utility/level');

module.exports = {
  name: 'xp',
  description: 'utility for function xp',
  add: async (msg, exp) => {
    const expAmount = parseInt(exp);
    const dbResult = await ref.child(msg.author.id).once('value');
    const temp = dbResult.val();
    if (temp.xp == undefined) {
      temp.xp = 0;
    }
    if (temp != null) {
      let currentXp = parseInt(temp.xp) + expAmount;
      ref.child(`${msg.author.id}`).update({
        name: `${msg.author.username}`,
        xp: currentXp,
      });
      const checkLevel = level.checkLevel(temp.xp, currentXp);
      if (checkLevel.isLevelUp) {
        level.levelUp(msg, checkLevel.level);
      }
    }
  },
  get: async (user) => {
    const dbResult = await ref.child(user.id).once('value');
    const temp = dbResult.val();
    if (temp != null && temp.xp != undefined) {
      let currentXP = parseInt(temp.xp);
      return currentXP;
    } else {
      ref.child(`${user.id}`).set({
        name: `${user.username}`,
        amount: `${50}`,
        xp: 0,
        level: `Fish`,
      });
      return 0;
    }
  },
};
