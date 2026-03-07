// server/controllers/contactController.js
import { emailService } from '../services/emailService.js';
import { store } from '../models/jsonStore.js';
import { env } from '../config/env.js';

export const contactController = {
  // Send contact message
  async sendMessage(req, res) {
    try {
      const { name, email, message } = req.body;
      
      // Validation
      if (!name || !email || !message) {
        return res.status(400).json({ 
          error: 'All fields are required' 
        });
      }
      
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ 
          error: 'Invalid email format' 
        });
      }

      if (message.length < 10) {
        return res.status(400).json({ 
          error: 'Message must be at least 10 characters long' 
        });
      }

      if (message.length > 5000) {
        return res.status(400).json({ 
          error: 'Message must not exceed 5000 characters' 
        });
      }

      // Save to store
      const contactData = {
        id: Date.now().toString(),
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
        ip: req.ip,
        userAgent: req.get('User-Agent')
      };

      await store.addContact(contactData);

      // Try email delivery, but do not fail the request if SMTP delivery fails.
      let emailResult = { success: false, devMode: false };
      try {
        emailResult = await emailService.sendContactEmail({ name, email, message });
      } catch (emailError) {
        console.error('⚠️ Email delivery failed, but contact was saved:', emailError.message);
      }

      res.status(200).json({ 
        success: true, 
        message: 'Message sent successfully!',
        devMode: emailResult.devMode || false,
        emailDelivered: Boolean(emailResult.success)
      });
      
    } catch (error) {
      console.error('❌ Contact controller error:', error);
      res.status(500).json({ 
        error: 'Failed to send message. Please try again later.' 
      });
    }
  },

  // Get contact form status (for testing)
  async getStatus(req, res) {
    try {
      const contacts = await store.getContacts();
      
      res.status(200).json({
        emailConfigured: emailService.isConfigured,
        totalMessages: contacts.length,
        recentMessages: contacts.slice(-5).map(c => ({
          id: c.id,
          name: c.name,
          timestamp: c.timestamp
        }))
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
