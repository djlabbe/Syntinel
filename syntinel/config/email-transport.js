const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'SyntinelNotification@gmail.com',
        pass: '@ll$81122'
    }
});