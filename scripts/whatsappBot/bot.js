const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcodeImage = require('qrcode-terminal');

function clientInit(){
    const client = new Client({
    //    authStrategy: new LocalAuth(),
        //puppeteer: {
            //executablePath: '/usr/bin/chromium-browser',
            //ignoreDefaultArgs: ['--disable-extensions'],
            //args: ['--no-sandbox', '--disable-setuid-sandbox']
          //}
    });

    client.on('qr', (qr) => {
        //console.log('QR RECEIVED', qr)
        qrcodeImage.generate(qr, {small: true});
        global.qrcode = qr
       
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
