# Firebase Setup Guide - Phishing Detection System

## ✅ Current Status

Your project is **50% setup**. Firebase credentials are configured, but integration needs completion.

---

## 📋 Setup Checklist

### ✅ Already Done
- [x] Firebase credentials in `.env`
- [x] Firebase package installed (`firebase@12.17.1`)
- [x] Firebase config file created (`src/firebase/config.js`)
- [x] Environment variables loaded correctly

### ⚠️ Completed (Just Now)
- [x] Firebase initialization module (`src/firebase/init.js`)
- [x] Firestore services layer (`src/firebase/services.js`)
- [x] Firebase startup in `main.jsx`

### ❌ Still Needed
- [ ] Update AppDataContext to sync with Firestore
- [ ] Set up Firestore Database in Firebase Console
- [ ] Configure Firestore Security Rules
- [ ] Enable Firebase Authentication (optional)
- [ ] Test Firebase connectivity

---

## 🔧 Next Steps

### Step 1: Setup Firestore Database in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **phishing-detection-syste-b0199**
3. Go to **Firestore Database** (left menu)
4. Click **Create Database**
5. Choose:
   - Start in **Production Mode** (secure by default)
   - Region: **us-central1** (or your preferred region)
   - Click **Create**

### Step 2: Configure Firestore Security Rules

Replace default rules with:

```firestore
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow everyone to read, authenticated users to write (for development)
    // ⚠️ CHANGE THIS FOR PRODUCTION
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

**Publish Rules** when done.

### Step 3: Test Firebase Connection

Run your app:
```bash
npm run dev
```

Check the browser console. You should see:
```
✓ Firebase App initialized
✓ Firestore initialized
✓ Authentication initialized
✓ All Firebase services initialized successfully
```

---

## 📦 Collections Structure

Firestore will auto-create these collections:

```
phishing-detection-syste-b0199/
├── scans/
│   └── {docId}
│       ├── type: "URL" | "Email"
│       ├── input: string
│       ├── result: "Phishing" | "Suspicious" | "Safe"
│       ├── riskScore: number
│       ├── date: timestamp
│       └── createdAt: timestamp
│
├── system_logs/
│   └── {docId}
│       ├── level: "INFO" | "WARN" | "THREAT" | "ERROR"
│       ├── module: string
│       ├── message: string
│       └── timestamp: timestamp
│
├── users/
│   └── {docId}
│       ├── name: string
│       ├── email: string
│       ├── role: string
│       └── createdAt: timestamp
│
├── ml_models/
│   └── {docId}
│       ├── name: string
│       ├── status: "Active" | "Inactive"
│       ├── version: string
│       └── createdAt: timestamp
│
└── statistics/
    └── current
        ├── totalScans: number
        ├── phishingDetected: number
        ├── safeItems: number
        └── updatedAt: timestamp
```

---

## 🔌 Using Firebase Services

### Add a Scan
```javascript
import { scansService } from './firebase/services';

const scanData = {
  type: 'URL',
  input: 'https://example.com',
  result: 'Safe',
  riskScore: 15
};

const newScan = await scansService.addScan(scanData);
```

### Fetch Scans
```javascript
const scans = await scansService.getScans(50); // Get last 50
const urlScans = await scansService.getScansByType('URL');
```

### Add Log
```javascript
import { logsService } from './firebase/services';

await logsService.addLog({
  level: 'INFO',
  module: 'URL Scanner',
  message: 'Scan completed'
});
```

---

## 🔐 Security Best Practices

### ✅ DO:
- ✓ Rotate API keys regularly
- ✓ Use Firestore Security Rules to restrict access
- ✓ Never commit `.env` to git
- ✓ Use Environment Variables for sensitive data
- ✓ Enable Authentication for production
- ✓ Audit Firestore access logs

### ❌ DON'T:
- ✗ Expose API keys in client-side code
- ✗ Use "allow all" rules in production
- ✗ Store sensitive data unencrypted
- ✗ Disable Firebase security features

---

## 📊 Sync Strategy

### Option 1: Firestore as Primary (Recommended)
- Write all new data to Firestore
- Keep localStorage as offline cache
- Sync on app startup

### Option 2: Hybrid Mode
- Write to localStorage immediately (fast UX)
- Sync to Firestore in background
- Resolve conflicts on pull

### Option 3: Real-time Sync (Advanced)
- Use Firestore real-time listeners
- Update UI instantly
- Requires listener management

---

## 🚀 Production Deployment

Before deploying:

1. **Update Security Rules** - Don't use development rules
2. **Enable Authentication** - Restrict to authorized users
3. **Set up Backups** - Enable automated Firestore backups
4. **Monitor Quotas** - Check Firestore read/write usage
5. **Test Performance** - Load test with realistic data
6. **Setup Logging** - Enable Cloud Logging for debugging

### Firestore Pricing
- **Reads**: $0.06 per 100K
- **Writes**: $0.18 per 100K
- **Deletes**: $0.02 per 100K
- **Storage**: $0.18 per GB/month

Monitor at: Firebase Console → Firestore → Usage

---

## 🐛 Troubleshooting

### "Firebase not configured" error
→ Check `.env` file has all VITE_FIREBASE_* variables

### Firestore permission denied
→ Check Firestore Security Rules and user authentication

### Data not syncing
→ Check browser console for errors
→ Verify Firestore database is created
→ Check internet connectivity

### Performance slow
→ Add database indexes (Firestore will suggest them)
→ Optimize query filters
→ Use pagination for large datasets

---

## 📚 Useful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Pricing Calculator](https://firebase.google.com/pricing)
- [Firebase Console](https://console.firebase.google.com/)

---

## 💡 Next Recommendation

Update `AppDataContext.jsx` to use Firestore services. This will:
- ✓ Persist data to the cloud
- ✓ Enable real-time collaboration
- ✓ Provide backup and recovery
- ✓ Scale automatically

Would you like me to update the AppDataContext to use Firebase?
