require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.Email_User,
        pass: process.env.Email_Password,
    },
});

const emailOptions = {
    from: process.env.Email_User,
    to: "earthpiparat@gmail.com",
    subject: "Test Email from Node.js",
    text: "Hello, this is a test email sent from Node.js using Nodemailer.",
};

transporter.sendMail(emailOptions, (error, info) => {
    if (error) {
        return console.log("Error occurred:", error);
    }
    console.log("Email sent successfully:", info.response);
});