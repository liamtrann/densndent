const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.Email_User,
    pass: process.env.Email_Password,
  },
});

async function sendTestEmail(_to, subject, text) {
  const emailOptions = {
    from: process.env.Email_User,
    to: "huzaifakhan2001.ind@gmail.com", // override any input
    subject,
    text,
  };

  const info = await transporter.sendMail(emailOptions);
  return info.response;
}

module.exports = {
  sendTestEmail,
};
