import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_STATS, INITIAL_SCAN_HISTORY, INITIAL_ML_MODELS, INITIAL_SYSTEM_LOGS } from '../utils/initialData';
import { scansService, logsService, usersService, modelsService, statsService } from '../firebase/services';

const AppDataContext = createContext(null);

const STORAGE_KEYS = {
  scans: 'apds_scans',
  logs: 'apds_logs',
  users: 'apds_users',
  stats: 'apds_stats',
  mlModels: 'apds_ml_models'
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e.message);
  }
}

let broadcastChannel = null;
try {
  broadcastChannel = new BroadcastChannel('apds_realtime_sync');
} catch (e) {
  console.warn('BroadcastChannel not supported, cross-tab sync disabled');
}

export function AppDataProvider({ children }) {
  // Firebase state
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);

  // Data state
  const [scans, setScans] = useState(() => loadFromStorage(STORAGE_KEYS.scans, INITIAL_SCAN_HISTORY));
  const [logs, setLogs] = useState(() => loadFromStorage(STORAGE_KEYS.logs, INITIAL_SYSTEM_LOGS));
  const [users, setUsers] = useState(() => loadFromStorage(STORAGE_KEYS.users, [
    { name: 'Amna Najam', email: 'amnanajam2003@gmail.com', role: 'BS IT Student / Security Analyst' },
    { name: 'Alisha Noor', email: 'ashkapoor887@gmail.com', role: 'BS IT Student / Security Analyst' },
    { name: 'Mam Shaista Ghafoor', email: 'shaista.ghafoor@uos.edu.pk', role: 'Admin / Head of Department' },
  ]));
  const [stats, setStats] = useState(() => loadFromStorage(STORAGE_KEYS.stats, INITIAL_STATS));
  const [mlModels, setMlModels] = useState(() => loadFromStorage(STORAGE_KEYS.mlModels, INITIAL_ML_MODELS));

  // Initialize Firestore data on mount
  useEffect(() => {
    const initFirestoreData = async () => {
      try {
        console.log('Loading data from Firestore...');
        
        const [firestoreScans, firestoreLogs, firestoreUsers, firestoreModels] = await Promise.all([
          scansService.getScans(100).catch(() => []),
          logsService.getLogs(500).catch(() => []),
          usersService.getUsers().catch(() => []),
          modelsService.getModels().catch(() => []),
        ]);

        // Update state with Firestore data if available
        if (firestoreScans.length > 0) {
          setScans(firestoreScans);
          saveToStorage(STORAGE_KEYS.scans, firestoreScans);
          console.log(`✓ Loaded ${firestoreScans.length} scans from Firestore`);
        }

        if (firestoreLogs.length > 0) {
          setLogs(firestoreLogs);
          saveToStorage(STORAGE_KEYS.logs, firestoreLogs);
          console.log(`✓ Loaded ${firestoreLogs.length} logs from Firestore`);
        }

        if (firestoreUsers.length > 0) {
          setUsers(firestoreUsers);
          saveToStorage(STORAGE_KEYS.users, firestoreUsers);
          console.log(`✓ Loaded ${firestoreUsers.length} users from Firestore`);
        }

        if (firestoreModels.length > 0) {
          setMlModels(firestoreModels);
          saveToStorage(STORAGE_KEYS.mlModels, firestoreModels);
          console.log(`✓ Loaded ${firestoreModels.length} models from Firestore`);
        }

        setFirebaseReady(true);
        console.log('✓ Firestore data sync complete');
      } catch (error) {
        console.warn('Firestore initialization warning:', error.message);
        console.log('Continuing with localStorage-only mode');
        setFirebaseError(error.message);
        setFirebaseReady(true); // Still mark as ready to not block UI
      }
    };

    // Small delay to ensure Firebase is initialized in main.jsx first
    const timer = setTimeout(initFirestoreData, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!broadcastChannel) return;
    const handler = (event) => {
      const msg = event.data;
      if (!msg || !msg.type) return;

      switch (msg.type) {
        case 'SCAN_ADDED':
          setScans(prev => {
            const exists = prev.some(s => s.id === msg.payload.id);
            if (exists) return prev;
            return [msg.payload, ...prev];
          });
          break;
        case 'LOG_ADDED':
          setLogs(prev => {
            const exists = prev.some(l => l.id === msg.payload.id);
            if (exists) return prev;
            return [msg.payload, ...prev];
          });
          break;
        case 'USER_ADDED':
          setUsers(prev => {
            const exists = prev.some(u => u.email === msg.payload.email);
            if (exists) return prev;
            return [...prev, msg.payload];
          });
          break;
        case 'USER_UPDATED':
          setUsers(prev => prev.map(u => u.email === msg.payload.email ? { ...u, ...msg.payload } : u));
          break;
        case 'MODEL_ADDED':
          setMlModels(prev => {
            const exists = prev.some(m => m.id === msg.payload.id);
            if (exists) return prev;
            return [msg.payload, ...prev];
          });
          break;
        case 'MODEL_TOGGLED':
          setMlModels(prev => prev.map(m => m.id === msg.payload.id ? { ...m, status: msg.payload.status } : m));
          break;
        case 'MODEL_DELETED':
          setMlModels(prev => prev.filter(m => m.id !== msg.payload.id));
          break;
        case 'FULL_STATE':
          if (msg.payload.scans) setScans(msg.payload.scans);
          if (msg.payload.logs) setLogs(msg.payload.logs);
          if (msg.payload.users) setUsers(msg.payload.users);
          if (msg.payload.stats) setStats(msg.payload.stats);
          if (msg.payload.mlModels) setMlModels(msg.payload.mlModels);
          break;
        default:
          break;
      }
    };

    broadcastChannel.addEventListener('message', handler);
    return () => broadcastChannel.removeEventListener('message', handler);
  }, []);

  const broadcast = useCallback((message) => {
    if (broadcastChannel) {
      try { broadcastChannel.postMessage(message); } catch (_) {}
    }
  }, []);

  const addScan = useCallback((scanObj) => {
    const newScan = {
      ...scanObj,
      id: Date.now(),
      date: new Date().toLocaleString(),
      syncedAt: new Date().toISOString()
    };

    // Update local state immediately (optimistic update)
    setScans(prev => {
      const next = [newScan, ...prev];
      saveToStorage(STORAGE_KEYS.scans, next);
      return next;
    });

    // Update stats
    setStats(prev => {
      const next = {
        totalScans: prev.totalScans + 1,
        phishingDetected: scanObj.result === 'Phishing' ? prev.phishingDetected + 1 : prev.phishingDetected,
        safeItems: scanObj.result === 'Safe' ? prev.safeItems + 1 : prev.safeItems,
        accuracyRate: prev.accuracyRate,
      };
      saveToStorage(STORAGE_KEYS.stats, next);
      return next;
    });

    broadcast({ type: 'SCAN_ADDED', payload: newScan });

    // Sync to Firestore asynchronously
    if (firebaseReady && !firebaseError) {
      scansService.addScan({
        type: newScan.type,
        input: newScan.input,
        result: newScan.result,
        riskScore: newScan.riskScore,
        badgeColor: newScan.badgeColor,
        date: newScan.date,
        category: newScan.category,
      }).catch(err => {
        console.warn('Error syncing scan to Firestore:', err.message);
      });
    }

    return newScan;
  }, [firebaseReady, firebaseError, broadcast]);

  const addLog = useCallback((level, module, message) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      level,
      module,
      message,
    };

    setLogs(prev => {
      const next = [newLog, ...prev];
      saveToStorage(STORAGE_KEYS.logs, next);
      return next;
    });

    broadcast({ type: 'LOG_ADDED', payload: newLog });

    // Sync to Firestore asynchronously
    if (firebaseReady && !firebaseError) {
      logsService.addLog({
        level,
        module,
        message,
      }).catch(err => {
        console.warn('Error syncing log to Firestore:', err.message);
      });
    }

    return newLog;
  }, [firebaseReady, firebaseError, broadcast]);

  const addUser = useCallback((userData) => {
    const newUser = { ...userData, id: userData.email || Date.now().toString() };

    setUsers(prev => {
      const exists = prev.some(u => u.email === newUser.email);
      if (exists) return prev;
      const next = [...prev, newUser];
      saveToStorage(STORAGE_KEYS.users, next);
      return next;
    });

    broadcast({ type: 'USER_ADDED', payload: newUser });

    // Sync to Firestore asynchronously
    if (firebaseReady && !firebaseError) {
      usersService.addUser(newUser).catch(err => {
        console.warn('Error syncing user to Firestore:', err.message);
      });
    }

    return newUser;
  }, [firebaseReady, firebaseError, broadcast]);

  const updateUserRole = useCallback((email, role) => {
    setUsers(prev => {
      const next = prev.map(u => u.email === email ? { ...u, role } : u);
      saveToStorage(STORAGE_KEYS.users, next);
      return next;
    });

    broadcast({ type: 'USER_UPDATED', payload: { email, role } });

    // Sync to Firestore asynchronously
    if (firebaseReady && !firebaseError) {
      usersService.getUserByEmail(email)
        .then(user => {
          if (user?.id) {
            return usersService.updateUser(user.id, { role });
          }
        })
        .catch(err => {
          console.warn('Error updating user in Firestore:', err.message);
        });
    }
  }, [firebaseReady, firebaseError, broadcast]);

  const addModel = useCallback((model) => {
    const newModel = { ...model, id: model.id || `M-${Date.now()}` };

    setMlModels(prev => {
      const next = [newModel, ...prev];
      saveToStorage(STORAGE_KEYS.mlModels, next);
      return next;
    });

    broadcast({ type: 'MODEL_ADDED', payload: newModel });

    // Sync to Firestore asynchronously
    if (firebaseReady && !firebaseError) {
      modelsService.addModel(newModel).catch(err => {
        console.warn('Error syncing model to Firestore:', err.message);
      });
    }

    return newModel;
  }, [firebaseReady, firebaseError, broadcast]);

  const toggleModelStatus = useCallback((id) => {
    setMlModels(prev => {
      const next = prev.map(m => {
        if (m.id !== id) return m;
        const newStatus = m.status === 'Active' ? 'Standby' : 'Active';
        return { ...m, status: newStatus };
      });
      saveToStorage(STORAGE_KEYS.mlModels, next);
      return next;
    });

    const target = mlModels.find(m => m.id === id);
    const newStatus = target?.status === 'Active' ? 'Standby' : 'Active';
    broadcast({ type: 'MODEL_TOGGLED', payload: { id, status: newStatus } });

    // Sync to Firestore asynchronously
    if (firebaseReady && !firebaseError) {
      modelsService.updateModel(id, { status: newStatus }).catch(err => {
        console.warn('Error updating model in Firestore:', err.message);
      });
    }
  }, [mlModels, firebaseReady, firebaseError, broadcast]);

  const deleteModel = useCallback((id) => {
    setMlModels(prev => {
      const next = prev.filter(m => m.id !== id);
      saveToStorage(STORAGE_KEYS.mlModels, next);
      return next;
    });

    broadcast({ type: 'MODEL_DELETED', payload: { id } });

    // Sync to Firestore asynchronously
    if (firebaseReady && !firebaseError) {
      modelsService.deleteModel(id).catch(err => {
        console.warn('Error deleting model from Firestore:', err.message);
      });
    }
  }, [firebaseReady, firebaseError, broadcast]);

  const refreshAll = useCallback(() => {
    setScans(loadFromStorage(STORAGE_KEYS.scans, INITIAL_SCAN_HISTORY));
    setLogs(loadFromStorage(STORAGE_KEYS.logs, INITIAL_SYSTEM_LOGS));
    setUsers(loadFromStorage(STORAGE_KEYS.users, []));
    setStats(loadFromStorage(STORAGE_KEYS.stats, INITIAL_STATS));
    setMlModels(loadFromStorage(STORAGE_KEYS.mlModels, INITIAL_ML_MODELS));
  }, []);

  const value = useMemo(() => ({
    scans, logs, users, stats, mlModels,
    addScan, addLog, addUser, updateUserRole,
    addModel, toggleModelStatus, deleteModel,
    refreshAll,
    // Firebase status
    firebaseReady,
    firebaseError,
    isLocalMode: !firebaseReady || !!firebaseError,
  }), [scans, logs, users, stats, mlModels,
    addScan, addLog, addUser, updateUserRole,
    addModel, toggleModelStatus, deleteModel, refreshAll,
    firebaseReady, firebaseError]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}

export default AppDataContext;
