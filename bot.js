require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Kara liste kelimeleri yükle
const blacklistWords = process.env.BLACKLIST_WORDS.split(',');
const gifUrl = process.env.GIF_URL;

client.once('ready', () => {
    console.log(`🤖 Bot aktif: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return; // Bot mesajlarını yok say

    // Mesaj kara liste kelimeleri içeriyor mu kontrol et
    if (blacklistWords.some(word => message.content.toLowerCase().includes(word))) {
        try {
            await message.delete();
            await message.channel.send({
                content: `🚫 Yasaklı kelime kullanıldı!`,
                files: [gifUrl]
            });
            console.log(`🛡️ Kara liste kelime tespit edildi ve mesaj silindi: ${message.author.tag}`);
        } catch (error) {
            console.error(`❌ Mesaj silinirken hata oluştu: ${error}`);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
