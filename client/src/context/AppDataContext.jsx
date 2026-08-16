import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_STATS, INITIAL_SCAN_HISTORY, INITIAL_ML_MODELS, INITIAL_SYSTEM_LOGS } from '../utils/initialData';
import { scansService, logsService, modelsService } from '../firebase/services';

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
  // Backend connection state
  const [backendReady, setBackendReady] = useState(false);
  const [backendError, setBackendError] = useState(null);

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

  // Load data from backend API on mount
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        console.log('Loading data from backend API...');
        
        const [apiScans, apiModels] = await Promise.all([
          scansService.getScans(100).catch(() => []),
          modelsService.getModels().catch(() => []),
        ]);

        if (apiScans.length > 0) {
          setScans(apiScans);
          saveToStorage(STORAGE_KEYS.scans, apiScans);
          console.log(`✓ Loaded ${apiScans.length} scans from backend`);
        }

        if (apiModels.length > 0) {
          setMlModels(apiModels);
          saveToStorage(STORAGE_KEYS.mlModels, apiModels);
          console.log(`✓ Loaded ${apiModels.length} models from backend`);
        }

        setBackendReady(true);
        console.log('✓ Backend data sync complete');
      } catch (error) {
        console.warn('Backend API warning:', error.message);
        console.log('Continuing with localStorage-only mode');
        setBackendError(error.message);
        setBackendReady(true); // Still mark as ready to not block UI
      }
    };

    const timer = setTimeout(loadBackendData, 300);
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

    // Sync to backend API asynchronously
    scansService.addScan({
      url: newScan.input || 'unknown',
      status: newScan.result === 'Phishing' ? 'phishing' : newScan.result === 'Suspicious' ? 'suspicious' : 'safe',
      type: newScan.type?.toLowerCase() || 'url',
      details: {
        riskScore: newScan.riskScore,
        badgeColor: newScan.badgeColor,
        date: newScan.date,
        category: newScan.category,
      },
    }).catch(err => {
      console.warn('Error syncing scan to backend:', err.message);
    });

    return newScan;
  }, [broadcast]);

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

    // Sync to backend API asynchronously
    logsService.addLog({
      action: module,
      level: level.toLowerCase() === 'threat' ? 'error' : level.toLowerCase() === 'warn' ? 'warning' : 'info',
      message,
    }).catch(err => {
      console.warn('Error syncing log to backend:', err.message);
    });

    return newLog;
  }, [broadcast]);

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
    return newUser;
  }, [broadcast]);

  const updateUserRole = useCallback((email, role) => {
    setUsers(prev => {
      const next = prev.map(u => u.email === email ? { ...u, role } : u);
      saveToStorage(STORAGE_KEYS.users, next);
      return next;
    });

    broadcast({ type: 'USER_UPDATED', payload: { email, role } });
  }, [broadcast]);

  const addModel = useCallback((model) => {
    const newModel = { ...model, id: model.id || `M-${Date.now()}` };

    setMlModels(prev => {
      const next = [newModel, ...prev];
      saveToStorage(STORAGE_KEYS.mlModels, next);
      return next;
    });

    broadcast({ type: 'MODEL_ADDED', payload: newModel });

    // Sync to backend
    modelsService.addModel(newModel).catch(err => {
      console.warn('Error syncing model to backend:', err.message);
    });

    return newModel;
  }, [broadcast]);

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

    // Sync to backend
    modelsService.updateModel(id, { status: newStatus }).catch(err => {
      console.warn('Error updating model in backend:', err.message);
    });
  }, [mlModels, broadcast]);

  const deleteModel = useCallback((id) => {
    setMlModels(prev => {
      const next = prev.filter(m => m.id !== id);
      saveToStorage(STORAGE_KEYS.mlModels, next);
      return next;
    });

    broadcast({ type: 'MODEL_DELETED', payload: { id } });

    // Sync to backend
    modelsService.deleteModel(id).catch(err => {
      console.warn('Error deleting model from backend:', err.message);
    });
  }, [broadcast]);

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
    // Backend status (kept for FirebaseStatus component compatibility)
    firebaseReady: backendReady,
    firebaseError: backendError,
    isLocalMode: !backendReady || !!backendError,
  }), [scans, logs, users, stats, mlModels,
    addScan, addLog, addUser, updateUserRole,
    addModel, toggleModelStatus, deleteModel, refreshAll,
    backendReady, backendError]);

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
