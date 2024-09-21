module.exports = {
  name: 'withdraw-bid',
  description: 'withdraw bid',
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

    const bidder = bidHisotry.bidders ? Object.values(bidHisotry.bidders) : [];

    if (bidder.length === 0) {
      await interaction.reply({
        content: '你還沒有進行任何出價',
        ephemeral: true,
      });
      return;
    }

    if (bidder[bidder.length - 1] !== interaction.user.id) {
      await interaction.reply({
        content: '你不是最高出價者',
        ephemeral: true,
      });
      return;
    }

    const bids = bidHisotry.bids ? Object.values(bidHisotry.bids) : [];

    // remove the last bidder and bid amount
    const modifyBidderObj = { ...bidHisotry.bidders };
    delete modifyBidderObj[bidder.length - 1];

    const modifyBidsObj = { ...bidHisotry.bids };
    delete modifyBidsObj[bids.length - 1];

    await bidUtil.updateBid({
      id: interaction.message.interaction.id,
      bidders: modifyBidderObj,
      bids: modifyBidsObj,
    });

    // remove old bid amount and bidder
    // 5 is the number of fields before bid
    if (interaction.message.embeds[0].fields.length > 5) {
      interaction.message.embeds[0].fields.pop();
      interaction.message.embeds[0].fields.pop();
    }

    if (bids.length > 1) {
      interaction.message.embeds[0].fields.push({
        name: '當前價格',
        value: `${bids[bids.length - 2]} 臺幣`,
      });

      interaction.message.embeds[0].fields.push({
        name: '最高出價者',
        value: `<@${bidder[bidder.length - 2]}>`,
      });
    }

    await interaction.update({
      embeds: interaction.message.embeds,
    });

    await interaction.followUp({
      content: '下標已經成功撤回',
      ephemeral: true,
    });

    return;
  },
};
