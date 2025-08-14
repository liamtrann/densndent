/**
 * Email HTML Templates
 * This file contains all HTML email templates for better organization
 */

/**
 * Basic email template wrapper
 * @param {string} content - The main content to wrap
 * @param {string} title - Email title
 * @returns {string} Complete HTML email
 */
function createBaseTemplate(content, title = 'Smiles First Corp') {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }nets
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eee; }
        .button { display: inline-block; background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .button:hover { background-color: #45a049; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">Smiles First Corp</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Professional Dental Solutions</p>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p style="color: #666; font-size: 14px; margin: 0;">
            <strong>Smiles First Corp</strong><br>
            Professional Dental Solutions<br>
            Questions? Contact us at ${process.env.EMAIL_FROM || 'support@smilesfirstcorp.com'}
          </p>
          <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Simple notification email template
 * @param {string} message - The message content
 * @param {string} title - Email title
 * @returns {string} HTML email
 */
function createSimpleNotificationTemplate(message, title = 'Notification') {
    const content = `
    <h2 style="color: #333; margin-top: 0;">${title}</h2>
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50;">
      <p style="color: #333; line-height: 1.6; margin: 0;">${message}</p>
    </div>
  `;

    return createBaseTemplate(content, title);
}

/**
 * Order confirmation email template
 * @param {Object} orderDetails - Order information
 * @returns {string} HTML email
 */
function createOrderConfirmationTemplate(orderDetails) {
    const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #4CAF50; margin: 0;">Order Confirmed!</h2>
      <p style="color: #666; margin: 5px 0;">Thank you for your order</p>
    </div>
    
    <!-- Order Details -->
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #333; margin-top: 0;">Order Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #666; width: 30%;"><strong>Order ID:</strong></td>
          <td style="padding: 8px 0; color: #333;">#${orderDetails.orderId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;"><strong>Customer:</strong></td>
          <td style="padding: 8px 0; color: #333;">${orderDetails.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;"><strong>Date:</strong></td>
          <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
          <td style="padding: 8px 0; color: #4CAF50; font-weight: bold;">Confirmed</td>
        </tr>
      </table>
    </div>
    
    <!-- Items Table -->
    <div style="margin: 30px 0;">
      <h3 style="color: #333; margin-bottom: 15px;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background-color: #4CAF50; color: white;">
            <th style="padding: 12px; text-align: left;">Item</th>
            <th style="padding: 12px; text-align: center;">Quantity</th>
            <th style="padding: 12px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderDetails.items.map((item, index) => `
            <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
              <td style="padding: 12px; color: #333; border-bottom: 1px solid #eee;">
                <strong>${item.name}</strong>
                ${item.description ? `<br><small style="color: #666;">${item.description}</small>` : ''}
              </td>
              <td style="padding: 12px; text-align: center; color: #333; border-bottom: 1px solid #eee;">${item.quantity}</td>
              <td style="padding: 12px; text-align: right; color: #333; border-bottom: 1px solid #eee; font-weight: bold;">$${parseFloat(item.price).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        ${orderDetails.total ? `
          <tfoot>
            <tr style="background-color: #4CAF50; color: white;">
              <th style="padding: 12px; text-align: right;" colspan="2">Total:</th>
              <th style="padding: 12px; text-align: right; font-size: 18px;">$${parseFloat(orderDetails.total).toFixed(2)}</th>
            </tr>
          </tfoot>
        ` : ''}
      </table>
    </div>
    
    <!-- Action Buttons -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://smilesfirstcorp.com/track-order/${orderDetails.orderId}" 
         class="button" style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 0 10px;">
        Track Your Order
      </a>
      <a href="https://smilesfirstcorp.com/orders/${orderDetails.orderId}/invoice" 
         class="button" style="background-color: #2196F3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 0 10px;">
        Download Invoice
      </a>
    </div>
    
    <!-- Shipping Info -->
    ${orderDetails.shippingAddress ? `
      <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-top: 0;">Shipping Information</h3>
        <p style="color: #333; margin: 0; line-height: 1.6;">
          ${orderDetails.shippingAddress}
        </p>
        <p style="color: #666; margin: 10px 0 0 0; font-size: 14px;">
          Estimated delivery: ${orderDetails.estimatedDelivery || '3-5 business days'}
        </p>
      </div>
    ` : ''}
  `;

    return createBaseTemplate(content, `Order Confirmation - #${orderDetails.orderId}`);
}

/**
 * Order status update email template
 * @param {Object} orderDetails - Order information with status
 * @returns {string} HTML email
 */
function createOrderStatusUpdateTemplate(orderDetails) {
    const statusColors = {
        'processing': '#FF9800',
        'shipped': '#2196F3',
        'delivered': '#4CAF50',
        'cancelled': '#f44336'
    };

    const statusColor = statusColors[orderDetails.status.toLowerCase()] || '#666';

    const content = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: ${statusColor}; margin: 0;">Order Update</h2>
      <p style="color: #666; margin: 5px 0;">Your order status has been updated</p>
    </div>
    
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusColor};">
      <h3 style="color: #333; margin-top: 0;">Order #${orderDetails.orderId}</h3>
      <p style="color: #333; margin: 10px 0;">
        <strong>Status:</strong> 
        <span style="color: ${statusColor}; font-weight: bold; text-transform: uppercase;">${orderDetails.status}</span>
      </p>
      ${orderDetails.statusMessage ? `
        <p style="color: #333; margin: 10px 0; line-height: 1.6;">${orderDetails.statusMessage}</p>
      ` : ''}
      ${orderDetails.trackingNumber ? `
        <p style="color: #333; margin: 10px 0;">
          <strong>Tracking Number:</strong> ${orderDetails.trackingNumber}
        </p>
      ` : ''}
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://smilesfirstcorp.com/track-order/${orderDetails.orderId}" 
         class="button" style="background-color: ${statusColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Track Your Order
      </a>
    </div>
  `;

    return createBaseTemplate(content, `Order Update - #${orderDetails.orderId}`);
}

/**
 * Welcome email template
 * @param {Object} userDetails - User information
 * @returns {string} HTML email
 */
function createWelcomeTemplate(userDetails) {
    const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #4CAF50; margin: 0;">Welcome to Smiles First Corp!</h2>
      <p style="color: #666; margin: 5px 0;">We're excited to have you on board</p>
    </div>
    
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #333; line-height: 1.6; margin: 0;">
        Hi ${userDetails.name || 'there'},<br><br>
        Thank you for joining Smiles First Corp! We're committed to providing you with the best professional dental solutions.
      </p>
    </div>
    
    <div style="margin: 30px 0;">
      <h3 style="color: #333;">What's next?</h3>
      <ul style="color: #333; line-height: 1.8; padding-left: 20px;">
        <li>Browse our extensive catalog of dental products</li>
        <li>Set up recurring orders for your frequently needed items</li>
        <li>Access exclusive member pricing and promotions</li>
        <li>Get dedicated customer support</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://smilesfirstcorp.com/products" 
         class="button" style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 0 10px;">
        Shop Now
      </a>
      <a href="https://smilesfirstcorp.com/account" 
         class="button" style="background-color: #2196F3; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 0 10px;">
        My Account
      </a>
    </div>
  `;

    return createBaseTemplate(content, 'Welcome to Smiles First Corp');
}

/**
 * Password reset email template
 * @param {Object} resetDetails - Reset information
 * @returns {string} HTML email
 */
function createPasswordResetTemplate(resetDetails) {
    const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h2 style="color: #FF9800; margin: 0;">Password Reset Request</h2>
      <p style="color: #666; margin: 5px 0;">We received a request to reset your password</p>
    </div>
    
    <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF9800;">
      <p style="color: #333; line-height: 1.6; margin: 0;">
        Someone requested a password reset for your account. If this was you, click the button below to reset your password. If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetDetails.resetLink}" 
         class="button" style="background-color: #FF9800; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Reset Password
      </a>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="color: #666; font-size: 14px; margin: 0; text-align: center;">
        This link will expire in ${resetDetails.expiryHours || 24} hours for security reasons.
      </p>
    </div>
  `;

    return createBaseTemplate(content, 'Password Reset Request');
}

module.exports = {
    createBaseTemplate,
    createSimpleNotificationTemplate,
    createOrderConfirmationTemplate,
    createOrderStatusUpdateTemplate,
    createWelcomeTemplate,
    createPasswordResetTemplate
};
