const admin = require('firebase-admin');
const db = admin.database();
const bidRef = db.ref(`/auction`);

module.exports = {
  name: 'auction',
  description: 'utility for auction',

  async initAuction(bid) {
    bidRef.child(`${bid.id}`).set({
      startBidAmount: Number(bid.startBidAmount),
      increaseRate: Number(bid.increaseRate),
      author: `${bid.author}`,
      bidders: null,
      bids: null,
      status: 'active',
    });
  },

  async getBid(bid) {
    const dbResult = await bidRef.child(`${bid.id}`).once('value');
    return dbResult.val();
  },

  async updateBid(bid) {
    bidRef.child(`${bid.id}`).update({
      bidders: bid.bidders,
      bids: bid.bids,
    });
  },
};
