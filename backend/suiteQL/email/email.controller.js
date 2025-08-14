const emailService = require('./email.service');

exports.sendEmail = async (req, res) => {
  try {
    const { receiver, subject, text } = req.body;

    if (!receiver || !subject || !text) {
      return res.status(400).json({ error: 'receiver, subject, and text are required in the body.' });
    }

    const result = await emailService.sendTestEmail(receiver, subject, text);
    res.status(200).json({ message: 'Email sent successfully', result });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
};

exports.sendHtmlEmail = async (req, res) => {
  try {
    const { receiver, subject, htmlContent, attachments } = req.body;

    if (!receiver || !subject || !htmlContent) {
      return res.status(400).json({ error: 'receiver, subject, and htmlContent are required in the body.' });
    }

    const result = await emailService.sendHtmlEmail(receiver, subject, htmlContent, attachments);
    res.status(200).json({ message: 'HTML email sent successfully', result });
  } catch (error) {
    console.error('HTML email sending error:', error);
    res.status(500).json({ error: 'Failed to send HTML email', details: error.message });
  }
};

exports.sendOrderConfirmation = async (req, res) => {
  try {
    const { customerEmail, orderDetails } = req.body;

    if (!customerEmail || !orderDetails) {
      return res.status(400).json({ error: 'customerEmail and orderDetails are required in the body.' });
    }

    const result = await emailService.sendOrderConfirmationEmail(customerEmail, orderDetails);
    res.status(200).json({ message: 'Order confirmation email sent successfully', result });
  } catch (error) {
    console.error('Order confirmation email sending error:', error);
    res.status(500).json({ error: 'Failed to send order confirmation email', details: error.message });
  }
};
