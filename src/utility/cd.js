const dayjs = require('dayjs');
const admin = require('firebase-admin');
const db = admin.database();
const ref = db.ref(`/leverage`);

module.exports = {
  name: 'cd',
  description: 'utility for function cd',
  check: async (msg, key) => {
    const dbResult = await ref.child(msg.author.id).once('value');
    const temp = dbResult.val();
    if (temp[key] == undefined || temp == null) {
      return 'READY';
    }
    if (temp[key] != undefined) {
      const cd = new Date(temp[key]);
      return checkDistance(cd);
    }
  },
  get: async (msg, key) => {
    const dbResult = await ref.child(msg.author.id).once('value');
    const temp = dbResult.val();
    if (temp[key] != undefined) {
      const cd = new Date(temp[key]);
      return checkDistance(cd);
    } else {
      return 'READY';
    }
  },
  set: (msg, key, type, amount) => {
    const updateObj = {};
    updateObj[key] = dayjs(new Date()).add(amount, type).format();
    ref.child(msg.author.id).update(updateObj);
  },
};

const checkDistance = (cd) => {
  const now = new Date();
  let distance = cd - now;
  if (distance < 0) {
    return 'READY';
  }
  const rDay = Math.floor(distance / 86400000);
  distance -= rDay * 86400000;
  const rHour = Math.floor(distance / 3600000);
  distance -= rHour * 3600000;
  const rMin = Math.floor(distance / 60000);
  distance -= rMin * 60000;
  const rSec = Math.floor(distance / 1000);
  return `${rDay > 0 ? `${rDay}天` : ''}${rHour > 0 ? `${rHour}小時` : ''}${rMin > 0 ? `${rMin}分` : ''}${rSec}秒`;
};
