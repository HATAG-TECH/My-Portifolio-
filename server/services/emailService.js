// server/services/emailService.js
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    
    console.log('📧 EmailService constructor:', {
      hasUser: !!env.email.user,
      hasPass: !!env.email.pass,
      user: env.email.user
    });
    
    if (env.email.user && env.email.pass) {
      this.initializeTransporter();
    } else {
      console.warn('⚠️  Email not configured - missing credentials');
    }
  }

  initializeTransporter() {
    try {
      console.log('🔧 Initializing email transporter...');
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: env.email.user,
          pass: env.email.pass
        }
      });
      this.isConfigured = true;
      console.log('✅ Email service configured successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error.message);
      this.isConfigured = false;
    }
  }

 

  async sendContactEmail({ name, email, message }) {
    // Always log the submission
    console.log('📬 Contact form submission:', { 
      name, 
      email, 
      message: message.substring(0, 50) + '...' 
    });

    // If email not configured, just return success (for development)
    if (!this.isConfigured || !this.transporter) {
      console.log('📧 Email not sent (development mode)');
      return { success: true, devMode: true };
    }

    try {
      const mailOptions = {
        from: `"Habtamu's Portfolio" <${env.email.user}>`,
        to: env.email.to,
        replyTo: email,
        subject: `New Portfolio Message from ${name}`,
        html: this.generateEmailTemplate({ name, email, message })
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', info.messageId);
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      throw error;
    }
  }

  generateEmailTemplate({ name, email, message }) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
            color: white; 
            padding: 30px 20px; 
            border-radius: 12px 12px 0 0;
            text-align: center;
          }
          .content { 
            background: #f8fafc; 
            padding: 30px; 
            border: 1px solid #e2e8f0;
            border-radius: 0 0 12px 12px;
          }
          .field { margin-bottom: 20px; }
          .label { 
            font-weight: 600; 
            color: #0f172a; 
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .value { 
            color: #1e293b; 
            font-size: 1.1rem;
            background: white;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .footer { 
            text-align: center; 
            margin-top: 20px; 
            color: #64748b; 
            font-size: 0.85rem;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin:0">📬 New Message from Portfolio</h2>
            <p style="margin:10px 0 0; opacity:0.9">Someone wants to connect with Habtamu</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">👤 Name</div>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <div class="label">📧 Email</div>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <div class="label">💬 Message</div>
              <div class="value">${message.replace(/\n/g, '<br>')}</div>
            </div>
          </div>
          <div class="footer">
            <p>Received on ${new Date().toLocaleString()}</p>
            <p style="font-size:0.8rem">This message was sent from your portfolio contact form</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async testConnection() {
    if (!this.isConfigured) {
      return { success: false, message: 'Email not configured' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"Test" <${env.email.user}>`,
        to: env.email.to,
        subject: '✅ Portfolio Email Test',
        text: 'Your email configuration is working perfectly!',
        html: '<h1>✅ Test Successful!</h1><p>Your portfolio email service is properly configured.</p>'
      });
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();