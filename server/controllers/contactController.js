import { getMailerTransport } from '../config/mailer.js';
import { env } from '../config/env.js';
import { saveContact } from '../models/jsonStore.js';

function buildEmailHtml({ name, email, message, consent }) {
  return `
    <h3>New Portfolio Contact</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>GDPR Consent:</strong> ${consent ? 'Yes' : 'No'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;
}

export async function submitContact(req, res, next) {
  try {
    const { name, email, message, consent, website = '' } = req.body;

    if (website) {
      return res.status(400).json({ ok: false, message: 'Spam detected' });
    }

    const stored = await saveContact({
      name,
      email,
      message,
      consent,
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || '',
      gdprConsentAt: new Date().toISOString(),
    });

    const transporter = getMailerTransport();
    if (transporter) {
      await transporter.sendMail({
        from: `"Portfolio Contact" <${env.contactEmailUser}>`,
        to: env.contactEmailTo || env.contactEmailUser,
        replyTo: email,
        subject: `Portfolio inquiry from ${name}`,
        text: message,
        html: buildEmailHtml({ name, email, message, consent }),
      });
    }

    return res.json({
      ok: true,
      message: 'Contact request received.',
      data: { id: stored.id, createdAt: stored.createdAt },
    });
  } catch (error) {
    return next(error);
  }
}
