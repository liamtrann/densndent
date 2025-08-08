const emailService = require('./email.service');

exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ error: 'to, subject, and text are required in the body.' });
    }

    const result = await emailService.sendTestEmail(to, subject, text);
    res.status(200).json({ message: 'Email sent successfully', result });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};
