# Firestore Services Reference

Complete API documentation for Firestore services in your app.

---

## 📦 Import All Services

```javascript
import {
  scansService,
  logsService,
  usersService,
  statsService,
  modelsService,
  batchService,
} from './firebase/services';
```

---

## 🔍 Scans Service

### Add a Scan
```javascript
const newScan = await scansService.addScan({
  type: 'URL',           // 'URL' or 'Email'
  input: 'https://example.com',
  result: 'Phishing',    // 'Phishing', 'Suspicious', 'Safe'
  riskScore: 92,
  date: new Date().toLocaleString(),
  category: 'Phishing'
});
// Returns: { id, type, input, result, riskScore, date, createdAt, syncedAt }
```

### Get All Scans
```javascript
const scans = await scansService.getScans(100);  // Get last 100
// Returns: [{ id, type, input, result, riskScore, date, ... }, ...]
```

### Get Scans by Type
```javascript
const urlScans = await scansService.getScansByType('URL');
const emailScans = await scansService.getScansByType('Email');
```

### Delete a Scan
```javascript
await scansService.deleteScan(scanId);
```

---

## 📝 Logs Service

### Add a Log
```javascript
const newLog = await logsService.addLog({
  level: 'INFO',        // 'INFO', 'WARN', 'THREAT', 'ERROR'
  module: 'URL Scanner',
  message: 'Scan completed: https://example.com'
});
// Returns: { id, level, module, message, timestamp }
```

### Get All Logs
```javascript
const logs = await logsService.getLogs(500);  // Get last 500
```

### Get Logs by Level
```javascript
const errors = await logsService.getLogsByLevel('ERROR');
const threats = await logsService.getLogsByLevel('THREAT');
const warnings = await logsService.getLogsByLevel('WARN');
```

---

## 👥 Users Service

### Add a User
```javascript
const newUser = await usersService.addUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Security Analyst'
});
// Returns: { id, name, email, role, createdAt }
```

### Get All Users
```javascript
const users = await usersService.getUsers();
```

### Get User by Email
```javascript
const user = await usersService.getUserByEmail('john@example.com');
// Returns: { id, name, email, role, ... } or null
```

### Update User
```javascript
await usersService.updateUser(userId, {
  role: 'Admin',
  name: 'John Doe Updated'
});
```

---

## 🤖 Models Service

### Add a Model
```javascript
const newModel = await modelsService.addModel({
  name: 'Random Forest Classifier',
  status: 'Active',      // 'Active', 'Standby', 'Inactive'
  version: '2.1.0'
});
// Returns: { id, name, status, version, createdAt }
```

### Get All Models
```javascript
const models = await modelsService.getModels();
```

### Update Model
```javascript
await modelsService.updateModel(modelId, {
  status: 'Standby',
  version: '2.2.0'
});
```

### Delete Model
```javascript
await modelsService.deleteModel(modelId);
```

---

## 📊 Statistics Service

### Update Statistics
```javascript
await statsService.updateStats({
  totalScans: 1250,
  phishingDetected: 45,
  safeItems: 1200,
  accuracyRate: 96.5
});
```

### Get Statistics
```javascript
const stats = await statsService.getStats();
// Returns: { totalScans, phishingDetected, safeItems, accuracyRate, updatedAt }
```

---

## 📦 Batch Service

### Batch Add Multiple Scans
```javascript
const scansToAdd = [
  { type: 'URL', input: 'https://example1.com', result: 'Safe', riskScore: 10 },
  { type: 'URL', input: 'https://example2.com', result: 'Phishing', riskScore: 95 },
  { type: 'Email', input: 'Suspicious email', result: 'Suspicious', riskScore: 65 },
];

await batchService.batchAddScans(scansToAdd);
// Returns: [docRef1, docRef2, docRef3, ...]
```

---

## 🔄 Error Handling

### All services wrap errors in try-catch:

```javascript
try {
  const scans = await scansService.getScans();
} catch (error) {
  console.error('Error fetching scans:', error);
  // Handle error - app will use localStorage fallback
}
```

### Check Console for Warnings
```
Warning: Error adding scan: Permission denied
Warning: Error updating user in Firestore: Network error
```

---

## ⚡ Performance Tips

### 1. Limit Data Loaded
```javascript
// Good - limits query
const recentScans = await scansService.getScans(50);

// Bad - loads everything
const allScans = await scansService.getScans(999999);
```

### 2. Use Specific Collections
```javascript
// Good - only gets URL scans
const urlScans = await scansService.getScansByType('URL');

// Bad - loads all scans and filters client-side
const allScans = await scansService.getScans();
const urlOnly = allScans.filter(s => s.type === 'URL');
```

### 3. Batch Operations
```javascript
// Good - batch add 100 at once
await batchService.batchAddScans(scans);

// Bad - add one at a time
for (const scan of scans) {
  await scansService.addScan(scan);  // 100 requests!
}
```

---

## 🔐 Data Validation

Services don't validate input. Always validate before calling:

```javascript
// Validate before adding scan
if (!input || !result) {
  throw new Error('Input and result are required');
}

if (!['Phishing', 'Suspicious', 'Safe'].includes(result)) {
  throw new Error('Invalid result value');
}

if (riskScore < 0 || riskScore > 100) {
  throw new Error('Risk score must be 0-100');
}

// Now safe to add
await scansService.addScan({ type, input, result, riskScore });
```

---

## 📱 Real-time Listeners (Advanced)

For real-time updates without polling:

```javascript
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase/init';

// Listen to all scans in real-time
const unsubscribe = onSnapshot(
  collection(db, 'scans'),
  (snapshot) => {
    const scans = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Real-time scans:', scans);
  },
  (error) => {
    console.error('Error listening to scans:', error);
  }
);

// Stop listening when done
// unsubscribe();
```

---

## 🔄 Sync Strategy

### Current Implementation (Hybrid)
1. **Read on startup** → Load from Firestore
2. **Write locally first** → Update UI instantly
3. **Write to cloud** → Async sync to Firestore
4. **Fallback** → Use localStorage if Firestore unavailable

### Usage from Components
```javascript
const { addScan } = useAppData();

// This automatically:
// 1. Updates local state (instant)
// 2. Saves to localStorage (offline)
// 3. Syncs to Firestore (background)
addScan({ type: 'URL', input, result, riskScore });
```

### No Direct Service Calls Needed
Most of the time, use `useAppData()` instead of services directly:

```javascript
// ✅ Good - automatic sync
const { addScan } = useAppData();
addScan(scanData);

// ❌ Avoid - manual sync needed
import { scansService } from './firebase/services';
await scansService.addScan(scanData);  // Doesn't update local state
```

---

## 🐛 Debugging

### Enable Firestore Logging
```javascript
// In firebase/init.js, add:
import { enableLogging } from 'firebase/firestore';
enableLogging(true);
```

### Monitor Network Requests
1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Add scan/log/user
4. Look for `POST` requests to `firestore.googleapis.com`

### Check Firestore Console
1. Go to Firebase Console
2. Firestore Database
3. Click collections and verify data
4. Check indexes if queries slow

---

## 📚 Collection Reference

### Scans Collection
```typescript
{
  id: string;           // Auto-generated
  type: 'URL' | 'Email';
  input: string;
  result: 'Phishing' | 'Suspicious' | 'Safe';
  riskScore: number;    // 0-100
  date: string;
  category: string;
  badgeColor?: string;
  createdAt: Timestamp;
  syncedAt: Timestamp;
}
```

### System Logs Collection
```typescript
{
  id: string;           // Auto-generated
  level: 'INFO' | 'WARN' | 'THREAT' | 'ERROR';
  module: string;
  message: string;
  timestamp: Timestamp;
}
```

### Users Collection
```typescript
{
  id: string;           // Auto-generated
  name: string;
  email: string;
  role: string;
  createdAt: Timestamp;
}
```

### ML Models Collection
```typescript
{
  id: string;           // Auto-generated
  name: string;
  status: 'Active' | 'Standby' | 'Inactive';
  version: string;
  createdAt: Timestamp;
}
```

### Statistics Collection
```typescript
{
  id: 'current';
  totalScans: number;
  phishingDetected: number;
  safeItems: number;
  accuracyRate: number;
  updatedAt: Timestamp;
}
```

---

## 🎓 Learning Path

**Level 1: Basic** (You are here)
- Use `useAppData()` hooks
- App auto-syncs to Firestore
- No manual service calls needed

**Level 2: Intermediate**
- Direct service calls for advanced queries
- Batch operations
- Real-time listeners

**Level 3: Advanced**
- Complex Firestore queries
- Custom Security Rules
- Performance optimization
- Analytics

---

## 📞 Need Help?

See detailed documentation:
- **Quick Start**: `FIRESTORE_QUICKSTART.md`
- **Setup Guide**: `FIREBASE_SETUP.md`
- **Integration**: `FIRESTORE_INTEGRATION.md`
- **Firestore Docs**: https://firebase.google.com/docs/firestore
