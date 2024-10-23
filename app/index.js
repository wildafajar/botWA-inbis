const {DisconnectReason, useMultiFileAuthState} = require("baileys");
const makeWASocket = require("baileys").default;


async function connect() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
    const socket = makeWASocket({
        printQRInTerminal: true,
        auth: state,

    });

    socket.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr} = update;
        if (qr) {
            console.log(qr);
        }

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

            if (shouldReconnect)
            {
                connect();

            }
        }

    });

    socket.ev.on("creds.update", saveCreds);

    // Add event listener for messages
    socket.ev.on('messages.update', async (mek) => {
        for (const message of mek) {
            if (message.key.fromMe) continue;
            if (message.message.conversation.toLowerCase() === 'hallo') {
                await socket.sendMessage(message.key.remoteJid, 'hallo', { quoted: message });
            }
        }
    });
}

connect();