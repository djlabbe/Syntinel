const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'SyntinelNotification@gmail.com',
        pass: '@ll$81122'
    }
});
const mailOptions = {
    from: 'syntinelNotification@gmail.com',
    to: 'thejoshaz@gmail.com',
    subject: 'hello world!',
    html: 'hello world!',
};
transport.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    }
    console.log('Message sent:' + info);
});