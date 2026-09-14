/**
 * Seed Script — Run manually to create admin & demo accounts.
 * Usage: node server/seed.js
 */

require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const path = require('path');
const User = require('./server/models/User');

const ACCOUNTS = [
  {
    name: 'System Administrator',
    email: 'admin@apds.edu',
    password: 'Admin@12345',
    role: 'admin',
  },
  {
    name: 'Amna Najam',
    email: 'amna.student@uos.edu.pk',
    password: 'User@12345',
    role: 'user',
  },
  {
    name: 'Alisha Noor',
    email: 'alisha.student@uos.edu.pk',
    password: 'User@12345',
    role: 'user',
  },
];

async function seed() {
  try {
    console.log('\n📦 APDS Seed Script');
    console.log('===================');
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/phishing_db';
    console.log('🔗 Connecting to:', uri.replace(/:([^@]+)@/, ':****@'));
    await mongoose.connect(uri);
    console.log('✅ Connected!\n');

    for (const account of ACCOUNTS) {
      const exists = await User.findOne({ email: account.email });
      if (exists) {
        console.log(`⏭️  Skip  [${account.role}] ${account.email} — already exists`);
        // Ensure role is correct on existing account
        if (exists.role !== account.role) {
          exists.role = account.role;
          await exists.save();
          console.log(`   ↳ Updated role to "${account.role}"`);
        }
      } else {
        await User.create(account);
        console.log(`✅ Created [${account.role}] ${account.email}`);
      }
    }

    console.log('\n📋 All accounts in database:');
    const all = await User.find({}, 'name email role createdAt').sort({ createdAt: 1 });
    all.forEach(u => {
      console.log(`  • ${u.name} <${u.email}> [${u.role}]`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Seed complete!\n');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
