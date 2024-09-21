module.exports = {
  name: 'bidding',
  description: 'button action for bidding',
  async execute(interaction) {
    const bidUtil = require('../utility/auction');

    const bidHisotry = await bidUtil.getBid({
      id: interaction.message.interaction.id,
    });

    if (!bidHisotry) {
      await interaction.reply({
        content: '拍賣已經結束',
        ephemeral: true,
      });
      return;
    }

    const bidders = bidHisotry.bidders ? Object.values(bidHisotry.bidders) : [];

    if (bidHisotry.author === interaction.user.id) {
      await interaction.reply({
        content: '你不能對自己的物品出價',
        ephemeral: true,
      });
    }

    if (
      bidders.length != 0 &&
      bidders[bidders.length - 1] === interaction.user.id
    ) {
      await interaction.reply({
        content: '你已經是最高出價者',
        ephemeral: true,
      });
      return;
    }

    const bids = bidHisotry.bids ? Object.values(bidHisotry.bids) : [];

    const currentBidAmount =
      bids.length == 0
        ? parseInt(bidHisotry.startBidAmount) +
          parseInt(bidHisotry.increaseRate)
        : parseInt(bids[bids.length - 1]) + parseInt(bidHisotry.increaseRate);

    const bidderObj = { ...bidHisotry.bidders };
    const bidsObj = { ...bidHisotry.bids };
    bidsObj[bids.length] = Number(currentBidAmount);
    bidderObj[bidders.length] = interaction.user.id;

    await bidUtil.updateBid({
      id: interaction.message.interaction.id,
      bidders: bidderObj,
      bids: bidsObj,
    });

    // remove old bid amount and bidder
    // 5 is the number of fields before bid
    if (interaction.message.embeds[0].fields.length > 5) {
      interaction.message.embeds[0].fields.pop();
      interaction.message.embeds[0].fields.pop();
    }

    interaction.message.embeds[0].fields.push({
      name: '當前價格',
      value: `${currentBidAmount} 臺幣`,
    });

    interaction.message.embeds[0].fields.push({
      name: '最高出價者',
      value: `<@${interaction.user.id}>`,
    });

    await interaction.update({
      embeds: interaction.message.embeds,
    });

    await interaction.followUp({
      content: `下標成功！ 目前最高金額為 ${currentBidAmount} 臺幣.`,
      ephemeral: true,
    });

    return;
  },
};
