// server/test-email-final.js
import { emailService } from './services/emailService.js';
import { env } from './config/env.js';

console.log('📧 FINAL EMAIL TEST');
console.log('==================');
console.log('Configuration:');
console.log('  User:', env.email.user);
console.log('  To:', env.email.to);
console.log('  Configured:', env.email.configured ? '✅' : '❌');
console.log('');

async function runTest() {
  try {
    console.log('📨 Sending test email...');
    const result = await emailService.testConnection();
    
    if (result.success) {
      console.log('✅ TEST PASSED!');
      console.log('📬 Message ID:', result.messageId);
      console.log('');
      console.log('Check your inbox at:', env.email.to);
    } else {
      console.log('❌ TEST FAILED:', result.error);
    }
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

runTest();