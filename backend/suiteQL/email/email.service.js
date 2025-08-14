// Load environment variables
require('dotenv').config();

const sgMail = require('@sendgrid/mail');
const emailTemplates = require('./emailTemplates');

// Validate environment variables at module load
if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
  console.warn('WARNING: SendGrid environment variables (SENDGRID_API_KEY, EMAIL_FROM) are not set. Email functionality may not work.');
}

// Set the SendGrid API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendTestEmail(receiver, subject, text) {
  console.log('🔍 Environment variables check:', {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? 'Set' : 'Not set',
    EMAIL_FROM: process.env.EMAIL_FROM ? 'Set' : 'Not set'
  });

  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    const errorMsg = 'SendGrid credentials not configured. Check your .env file for SENDGRID_API_KEY and EMAIL_FROM.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  console.log('📤 [EMAIL] Sending email via SendGrid to:', receiver);

  // Use the template system for better formatting
  const htmlContent = emailTemplates.createSimpleNotificationTemplate(text, subject);

  const msg = {
    to: receiver,
    from: {
      email: process.env.EMAIL_FROM,
      name: 'Smiles First Corp'
    },
    replyTo: process.env.EMAIL_FROM,
    subject: subject,
    text: text,
    html: htmlContent,
    // Anti-spam headers
    headers: {
      'X-Entity-ID': 'smilesfirstcorp-notifications',
      'X-Entity-Name': 'Smiles First Corp Notifications'
    },
    // Tracking settings to improve reputation
    trackingSettings: {
      clickTracking: { enable: true },
      openTracking: { enable: true }
    }
  };

  try {
    const response = await sgMail.send(msg);
    console.log('✅ [EMAIL] Email sent successfully via SendGrid');
    return response[0];
  } catch (error) {
    console.error('❌ [EMAIL] SendGrid error:', error.message);
    if (error.response) {
      console.error('❌ [EMAIL] SendGrid response:', error.response.body);
    }
    throw error;
  }
}

// Rich HTML email with attachments
async function sendHtmlEmail(receiver, subject, htmlContent, attachments = []) {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error('SendGrid credentials not configured.');
  }

  const msg = {
    to: receiver,
    from: process.env.EMAIL_FROM,
    subject: subject,
    text: 'Please view this email in HTML format',
    html: htmlContent,
    attachments: attachments
  };

  try {
    console.log('📤 [EMAIL] Sending HTML email via SendGrid...');
    const response = await sgMail.send(msg);
    console.log('✅ [EMAIL] HTML email sent successfully via SendGrid');
    return response[0];
  } catch (error) {
    console.error('❌ [EMAIL] SendGrid HTML email error:', error.message);
    throw error;
  }
}

// Order confirmation email template
async function sendOrderConfirmationEmail(customerEmail, orderDetails) {
  const htmlContent = emailTemplates.createOrderConfirmationTemplate(orderDetails);
  const subject = `Order Confirmation - #${orderDetails.orderId}`;

  return await sendHtmlEmail(customerEmail, subject, htmlContent);
}

// Order status update email
async function sendOrderStatusUpdateEmail(customerEmail, orderDetails) {
  const htmlContent = emailTemplates.createOrderStatusUpdateTemplate(orderDetails);
  const subject = `Order Update - #${orderDetails.orderId}`;

  return await sendHtmlEmail(customerEmail, subject, htmlContent);
}

// Welcome email
async function sendWelcomeEmail(customerEmail, userDetails) {
  const htmlContent = emailTemplates.createWelcomeTemplate(userDetails);
  const subject = 'Welcome to Smiles First Corp!';

  return await sendHtmlEmail(customerEmail, subject, htmlContent);
}

// Password reset email
async function sendPasswordResetEmail(customerEmail, resetDetails) {
  const htmlContent = emailTemplates.createPasswordResetTemplate(resetDetails);
  const subject = 'Password Reset Request';

  return await sendHtmlEmail(customerEmail, subject, htmlContent);
}

module.exports = {
  sendTestEmail,
  sendHtmlEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail
};
