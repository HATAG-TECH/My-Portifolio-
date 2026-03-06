// server/test-env.js
import './config/env.js'; // This will run the env loading and show debug output

console.log('\n=== TESTING ENVIRONMENT VARIABLES ===');
console.log('CONTACT_EMAIL_USER:', process.env.CONTACT_EMAIL_USER || '❌ NOT SET');
console.log('CONTACT_EMAIL_PASS:', process.env.CONTACT_EMAIL_PASS ? '✅ SET (hidden)' : '❌ NOT SET');
console.log('CONTACT_EMAIL_TO:', process.env.CONTACT_EMAIL_TO || '❌ NOT SET');
console.log('=====================================');
