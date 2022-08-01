const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

function clientInit(){
    const client = new Client({
    //    authStrategy: new LocalAuth(),
        //puppeteer: {
            //executablePath: '/usr/bin/chromium-browser',
            //ignoreDefaultArgs: ['--disable-extensions'],
            //args: ['--no-sandbox', '--disable-setuid-sandbox']
        //  }
    });

    client.on('qr', (qr) => {
        qrcode.generate(qr, {small: true}, function(qrcode){
            console.log(qrcode)
        });

    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.on('disconnect', () => {
        console.log('disconnecting');
        clientInit()
    });

    client.initialize();
    return client
}

module.exports = clientInit()
