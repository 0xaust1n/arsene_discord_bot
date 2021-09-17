module.exports = {
  name: 'guildMemberAdd',
  once: false,
  execute(member, client) {
    if (member.displayName.toLocaleLowerCase().includes('discord') > -1) {
      member.kick(`Bot`);
      console.log(`${member.displayName}被踢出`);
    }
  },
};
