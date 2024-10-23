const { WAConnection } = require('@whiskeysockets/baileys');

async function startBot() {
    const conn = new WAConnection();
    conn.on('qr', (qr) => {
        console.log('Scan this QR code to log in:', qr);
    });

    await conn.connect();
    console.log('Bot is connected!');
}

startBot();
