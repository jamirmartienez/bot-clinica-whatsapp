
const { default: makeWASocket, DisconnectReason, useSingleFileAuthState } = require('@adiwajshing/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function iniciarBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ['ClínicaBot', 'Chrome', '10.0']
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect =
                (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('❌ Se cerró la conexión, reconectando...');
            if (shouldReconnect) {
                iniciarBot();
            }
        } else if (connection === 'open') {
            console.log('✅ Bot conectado a WhatsApp con éxito.');
        }
    });

    sock.ev.on('creds.update', saveState);
}

iniciarBot();
