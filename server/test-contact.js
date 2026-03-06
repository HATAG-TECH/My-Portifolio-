// server/test-contact.js
import { emailService } from './services/emailService.js';
import { store } from './models/jsonStore.js';
import { env } from './config/env.js';

async function testContactSystem() {
  console.log('🧪 Testing Contact System\n');
  
  console.log('📧 Email Configuration:');
  console.log('  User:', env.email.user);
  console.log('  To:', env.email.to);
  console.log('  Configured:', env.email.configured ? '✅' : '❌');
  console.log('  Has Password:', env.email.pass ? '✅' : '❌');
  
  if (env.email.configured) {
    console.log('\n📨 Testing email connection...');
    const testResult = await emailService.testConnection();
    console.log('  Result:', testResult.success ? '✅ Success' : '❌ Failed');
    if (!testResult.success) {
      console.log('  Error:', testResult.error);
    }
  }
  
  console.log('\n💾 Testing store...');
  await store.initialize();
  const contacts = await store.getContacts();
  console.log('  Total contacts stored:', contacts.length);
  
  console.log('\n📝 Test complete!');
}

testContactSystem().catch(console.error);