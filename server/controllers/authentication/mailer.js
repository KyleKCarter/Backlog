const nodemailer = require('nodemailer')
const creds = require('../../../emailconfig')

const sendRegisterEmail = (req, res) => {
    const { name, email } = req.body;
    
    //create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: creds.USER,
            password: creds.PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    //setup email data with unicode symbols
    let mailOptions = {
        from: creds.USER, //sender address
        to: email, //list of receivers
        subject: 'Welcome to Backlog',
        text: `Hi ${name}! You'vre all signed up and ready to start browsing.`
    };

    //send mail with defined transport object
    transporter.sendMail(mailOptions, (error, data) => {
        if (error) {
            console.log('Error occured with nodemailer')
            res.status(500).json('An error occured with nodemailer')
        } else {
            console.log('Email sent')
            res.status(200).json('An email was sent')
        }
    });
}

module.exports = {
    sendRegisterEmail
}