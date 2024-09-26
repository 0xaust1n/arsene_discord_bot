const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require('discord.js');

module.exports = {
  name: 'auction',
  description: '開始一場拍賣',
  data: new SlashCommandBuilder()
    .setName('auction')
    .setDescription('開始一場拍賣')
    .addStringOption((option) =>
      option
        .setName('item-name')
        .setDescription('拍賣的物品名稱')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option.setName('start-price').setDescription('起始價格').setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('increase-rate')
        .setDescription('每標價格')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('item-image').setDescription('物品圖片').setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('duration')
        .setDescription('拍賣持續時間(小時)')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('物品描述')
        .setRequired(false)
    ),

  async execute(interaction) {
    const embedMessage = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('拍賣物品')
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription('請在下方點擊按鈕參加拍賣')
      .setImage(interaction.options.getString('item-image'))
      .addFields(
        { name: '物品名稱', value: interaction.options.getString('item-name') },
        {
          name: '起始價格',
          value: `${interaction.options.getInteger('start-price')} 臺幣`,
        },
        {
          name: '每標價格',
          value: `${interaction.options.getInteger('increase-rate')} 臺幣`,
        },
        {
          name: '拍賣持續時間',
          value: `${interaction.options.getInteger('duration')}`,
        },
        {
          name: '物品描述',
          value:
            interaction.options.getString('description') === null
              ? '無'
              : interaction.options.getString('description'),
        }
      )
      .setTimestamp();

    const bidUtil = require('../utility/auction');

    bidUtil.initAuction({
      id: interaction.id,
      startBidAmount: interaction.options.getInteger('start-price'),
      increaseRate: interaction.options.getInteger('increase-rate'),
      author: interaction.user.id,
    });

    // init buttons
    const biddingButton = new ButtonBuilder()
      .setCustomId('bidding')
      .setLabel('下標')
      .setStyle(ButtonStyle.Success);
    const withdrawBidButton = new ButtonBuilder()
      .setCustomId('withdraw-bid')
      .setLabel('撤標')
      .setStyle(ButtonStyle.Danger);

    // add to raw
    const row = new ActionRowBuilder().addComponents(
      biddingButton,
      withdrawBidButton
    );

    // reply message
    await interaction.reply({ embeds: [embedMessage], components: [row] });
  },
};
