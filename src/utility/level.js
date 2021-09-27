const admin = require('firebase-admin');
const db = admin.database();
const ref = db.ref(`/leverage`);

module.exports = {
  name: 'level',
  description: 'utility for function level',
  checkLevel: (bExp, AExp) => {
    const levelAry = [1000, 10000, 100000, 500000, 1000000];
    const temp = {};
    for (const val of levelAry) {
      if (bExp < val && AExp >= val) {
        temp.isLevelUp = true;
        temp.level = val;
        break;
      } else {
        continue;
      }
    }
    return temp;
  },
  levelUp: async (msg, level) => {
    const levelObject = {
      0: 'Fish',
      1000: 'Newbie',
      10000: 'Gambler',
      100000: 'Poker Facer',
      500000: 'Rich Fucker',
      1000000: 'Hand Of Fate',
    };
    const nextLevel = levelObject[level];
    ref.child(`${msg.author.id}`).update({
      name: `${msg.author.username}`,
      level: `${nextLevel}`,
    });
    return msg.channel.send(`恭喜 \`${msg.author.username}\`  賭博等級升級為 \`${nextLevel}\``);
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
    return temp.level;
  },
  getNextLevelXp: (xp) => {
    const levelAry = [1000, 10000, 100000, 500000, 1000000];
    for (const val of levelAry) {
      if (xp <= val) {
        return val;
      } else {
        continue;
      }
    }
  },
};
