const admin = require('firebase-admin');
const db = admin.database();
const ref = db.ref(`/leverage`);

module.exports = {
  name: 'level',
  description: 'utility for function level',
  checkLevel: (level, currentXp) => {
    const levelAry = [10000, 100000, 10000000, 50000000000, 10000000000000];
    const titleAry = ['Newbie', 'Gambler', 'Senior Gambler', 'Legend Gambler', 'Hand Of Fate'];
    const temp = {};
    for (const [index, val] of levelAry.entries()) {
      if (currentXp >= val) {
        temp.level = val;
        temp.title = titleAry[index];
        continue;
      } else {
        break;
      }
    }
    if (level != temp.title) {
      temp.isLevelUp = true;
    }
    return temp;
  },
  levelUp: async (msg, level) => {
    const levelObject = {
      0: 'Fish',
      10000: 'Newbie',
      100000: 'Gambler',
      10000000: 'Senior Gambler',
      50000000000: 'Legend Gambler',
      10000000000000: 'Hand Of Fate',
    };
    const nextLevel = levelObject[level];
    ref.child(`${msg.author.id}`).update({
      name: `${msg.author.username}`,
      level: `${nextLevel}`,
    });
    return msg.channel.send(`恭喜 \`${msg.author.username}\`  賭博等級升級為 \`${nextLevel}\``);
  },
  get: async (user) => {
    dbResult = await ref.child(user.id).once('value');
    const temp = dbResult.val();
    return temp.level;
  },
  getNextLevelXp: (xp) => {
    const levelAry = [10000, 100000, 100000, 10000000, 50000000000, 10000000000000];
    for (const val of levelAry) {
      if (xp <= val) {
        return val;
      } else {
        continue;
      }
    }
  },
};
