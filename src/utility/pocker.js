const random = require('./random');
module.exports = {
  ranks: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
  genDeck() {
    const suits = ['♠', '♣', '♥', '♦'];
    const deck = [];
    for (const suit of suits) {
      for (const rank of this.ranks) {
        deck.push(`${suit}/${rank}`);
      }
    }
    return deck;
  },

  sortHand(hand) {
    // sort by rank
    return hand.sort((a, b) => {
      const rankA = a.split('/')[1];
      const rankB = b.split('/')[1];
      return this.ranks.indexOf(rankA) - this.ranks.indexOf(rankB);
    });
  },

  isHandEqual(hand) {
    return hand[0].split('/')[1] === hand[1].split('/')[1];
  },

  deal(deck, count) {
    const hand = [];
    for (let i = 0; i < count; i++) {
      // remove random card from deck
      const randomIndex = random.getRandomInt(0, deck.length - 1);
      const card = deck.splice(randomIndex, 1)[0];
      hand.push(card);
    }
    return hand;
  },

  dealAndSortHand(deck, count) {
    const hand = this.deal(deck, count);
    return this.sortHand(hand);
  },

  dragonGateGame(hand, deal) {
    const lowHandRank = this.ranks.indexOf(hand[0].split('/')[1]);
    const highHandRank = this.ranks.indexOf(hand[1].split('/')[1]);
    const dealRank = this.ranks.indexOf(deal.split('/')[1]);

    if (dealRank < lowHandRank || dealRank > highHandRank) {
      return 'lose';
    } else if (dealRank === lowHandRank || dealRank === highHandRank) {
      return 'hit';
    } else {
      return 'win';
    }
  },
};
