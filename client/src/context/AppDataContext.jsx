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

function deduplicateItems(items, keyFn) {
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  return items.filter((item, idx) => {
    const key = keyFn(item, idx);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function AppDataProvider({ children }) {
  // Backend connection state
  const [backendReady, setBackendReady] = useState(false);
  const [backendError, setBackendError] = useState(null);

  // Data state with automatic deduplication
  const [scans, setScans] = useState(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.scans, INITIAL_SCAN_HISTORY);
    return deduplicateItems(loaded, (s, i) => s.id || `${s.input}-${i}`);
  });

  const [logs, setLogs] = useState(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.logs, INITIAL_SYSTEM_LOGS);
    return deduplicateItems(loaded, (l, i) => l.id || `${l.timestamp}-${i}`);
  });

  const [users, setUsers] = useState(() => {
    const raw = loadFromStorage(STORAGE_KEYS.users, null);
    if (raw !== null && Array.isArray(raw)) {
      const mapped = raw.map(u => ({
        id: u.id || `usr-${Math.random().toString(36).substring(2, 9)}`,
        name: u.name || 'User',
        email: u.email || 'user@apds.edu',
        role: u.role || 'Security Analyst',
        department: u.department || 'Dept of CS & IT, UOS',
        status: u.status || 'Active',
        joinedDate: u.joinedDate || '2026-01-15'
      }));
      return deduplicateItems(mapped, u => u.email?.toLowerCase());
    }
    return [
      { id: 'usr-01', name: 'Amna Najam', email: 'amnanajam2003@gmail.com', role: 'Admin', department: 'BS IT (Dept of CS & IT, UOS)', status: 'Active', joinedDate: '2026-01-15' },
      { id: 'usr-02', name: 'Alisha Noor', email: 'ashkapoor887@gmail.com', role: 'Admin', department: 'BS IT (Dept of CS & IT, UOS)', status: 'Active', joinedDate: '2026-01-15' },
      { id: 'usr-03', name: 'Mam Shaista Ghafoor', email: 'shaista.ghafoor@uos.edu.pk', role: 'Admin', department: 'Head of Department / Supervisor', status: 'Active', joinedDate: '2025-09-01' },
      { id: 'usr-04', name: 'Cyber Security Auditor', email: 'auditor@apds.uos.edu.pk', role: 'Security Analyst', department: 'Forensic Lab', status: 'Active', joinedDate: '2026-02-20' },
    ];
  });

  const [stats, setStats] = useState(() => loadFromStorage(STORAGE_KEYS.stats, INITIAL_STATS));

  const [mlModels, setMlModels] = useState(() => {
    const loaded = loadFromStorage(STORAGE_KEYS.mlModels, INITIAL_ML_MODELS);
    return deduplicateItems(loaded, m => m.id || m.name);
  });

  // Load data from backend API on mount with deduplication and ID normalization
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        console.log('Loading data from backend API...');
        
        const [apiScans, apiModels] = await Promise.all([
          scansService.getScans(100).catch(() => []),
          modelsService.getModels().catch(() => []),
        ]);

        if (apiScans && apiScans.length > 0) {
          const normalizedScans = apiScans.map((s, idx) => ({
            id: s._id || s.id || `SCN-API-${idx + 101}`,
            type: s.type ? (s.type.charAt(0).toUpperCase() + s.type.slice(1)) : 'URL',
            input: s.url || s.input || 'Threat Target',
            result: s.status ? (s.status.charAt(0).toUpperCase() + s.status.slice(1)) : (s.result || 'Safe'),
            riskScore: s.details?.riskScore || s.riskScore || '0/100',
            date: s.details?.date || (s.createdAt ? new Date(s.createdAt).toLocaleString() : new Date().toLocaleString()),
            category: s.details?.category || s.category || s.status || 'Safe',
            badgeColor: s.details?.badgeColor || (s.status === 'phishing' ? 'danger' : s.status === 'suspicious' ? 'warning' : 'emerald')
          }));
          const dedupedScans = deduplicateItems(normalizedScans, s => s.id || s.input);
          setScans(dedupedScans);
          saveToStorage(STORAGE_KEYS.scans, dedupedScans);
          console.log(`✓ Loaded ${dedupedScans.length} unique scans from backend`);
        }

        if (apiModels && apiModels.length > 0) {
          const normalizedModels = apiModels.map((m, idx) => ({
            id: m.id || `M-0${idx + 1}`,
            name: m.name,
            type: m.type || m.version || 'Supervised Classifier',
            accuracy: typeof m.accuracy === 'number' ? `${m.accuracy}%` : (m.accuracy || '95.0%'),
            status: m.status ? (m.status.charAt(0).toUpperCase() + m.status.slice(1)) : 'Active',
            framework: m.framework || 'Scikit-Learn',
            date: m.date || (m.createdAt ? new Date(m.createdAt).toISOString().split('T')[0] : '2026-05-01')
          }));
          const dedupedModels = deduplicateItems(normalizedModels, m => m.id || m.name);
          setMlModels(dedupedModels);
          saveToStorage(STORAGE_KEYS.mlModels, dedupedModels);
          console.log(`✓ Loaded ${dedupedModels.length} unique models from backend`);
        }

        setBackendReady(true);
        console.log('✓ Backend data sync complete');
      } catch (error) {
        console.warn('Backend API warning:', error.message);
        console.log('Continuing with localStorage-only mode');
        setBackendError(error.message);
        setBackendReady(true);
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
          setUsers(prev => prev.map(u => u.email.toLowerCase() === msg.payload.email.toLowerCase() ? { ...u, ...msg.payload } : u));
          break;
        case 'USER_DELETED':
          setUsers(prev => prev.filter(u => u.email.toLowerCase() !== msg.payload.email.toLowerCase()));
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
      id: `SCN-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
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
      id: `LOG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
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
    const newUser = {
      id: userData.id || `usr-${Date.now()}`,
      name: userData.name || 'Anonymous User',
      email: userData.email,
      role: userData.role || 'Security Analyst',
      department: userData.department || 'Dept of CS & IT, UOS',
      status: userData.status || 'Active',
      joinedDate: userData.joinedDate || new Date().toISOString().split('T')[0]
    };

    setUsers(prev => {
      const exists = prev.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
      if (exists) {
        return prev.map(u => u.email.toLowerCase() === newUser.email.toLowerCase() ? { ...u, ...newUser } : u);
      }
      const next = [newUser, ...prev];
      saveToStorage(STORAGE_KEYS.users, next);
      return next;
    });

    broadcast({ type: 'USER_ADDED', payload: newUser });
    return newUser;
  }, [broadcast]);

  const editUser = useCallback((originalEmail, updatedData) => {
    setUsers(prev => {
      const next = prev.map(u => {
        if (u.email.toLowerCase() !== originalEmail.toLowerCase()) return u;
        return { ...u, ...updatedData };
      });
      saveToStorage(STORAGE_KEYS.users, next);
      return next;
    });

    broadcast({ type: 'USER_UPDATED', payload: { email: originalEmail, ...updatedData } });
  }, [broadcast]);

  const deleteUser = useCallback((identifier, userObj) => {
    const targetEmail = String(identifier || userObj?.email || '').trim().toLowerCase();
    const targetId = String(userObj?.id || identifier || '').trim().toLowerCase();

    setUsers(prev => {
      const next = prev.filter(u => {
        if (!u) return false;
        const uEmail = String(u.email || '').trim().toLowerCase();
        const uId = String(u.id || '').trim().toLowerCase();
        if (targetEmail && uEmail === targetEmail) return false;
        if (targetId && uId === targetId) return false;
        if (userObj) {
          if (userObj.email && String(userObj.email || '').trim().toLowerCase() === uEmail) return false;
          if (userObj.id && String(userObj.id || '').trim().toLowerCase() === uId) return false;
        }
        return true;
      });
      saveToStorage(STORAGE_KEYS.users, next);
      return next;
    });

    broadcast({ type: 'USER_DELETED', payload: { email: targetEmail } });
  }, [broadcast]);

  const updateUserRole = useCallback((email, role) => {
    setUsers(prev => {
      const next = prev.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, role } : u);
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
    let nextStatus = 'Active';
    setMlModels(prev => {
      const next = prev.map(m => {
        if (m.id !== id && m._id !== id) return m;
        const newStatus = m.status === 'Active' ? 'Standby' : 'Active';
        nextStatus = newStatus;
        return { ...m, status: newStatus };
      });
      saveToStorage(STORAGE_KEYS.mlModels, next);
      return next;
    });

    broadcast({ type: 'MODEL_TOGGLED', payload: { id, status: nextStatus } });

    // Sync to backend asynchronously
    modelsService.updateModel(id, { status: nextStatus }).catch(err => {
      console.warn('Error updating model in backend:', err.message);
    });
  }, [broadcast]);

  const deleteModel = useCallback((identifier, modelObj) => {
    const targetId = String(identifier || modelObj?.id || modelObj?._id || '').trim().toLowerCase();
    const targetName = String(modelObj?.name || identifier || '').trim().toLowerCase();

    setMlModels(prev => {
      const next = prev.filter(m => {
        if (!m) return false;
        const mId = String(m.id || m._id || '').trim().toLowerCase();
        const mName = String(m.name || '').trim().toLowerCase();
        if (targetId && mId === targetId) return false;
        if (targetName && mName === targetName) return false;
        if (modelObj) {
          if (modelObj.id && String(m.id || '').trim().toLowerCase() === String(modelObj.id).trim().toLowerCase()) return false;
          if (modelObj._id && String(m._id || '').trim().toLowerCase() === String(modelObj._id).trim().toLowerCase()) return false;
          if (modelObj.name && String(m.name || '').trim().toLowerCase() === String(modelObj.name).trim().toLowerCase()) return false;
        }
        return true;
      });
      saveToStorage(STORAGE_KEYS.mlModels, next);
      return next;
    });

    broadcast({ type: 'MODEL_DELETED', payload: { id: identifier } });

    // Sync to backend
    const backendId = modelObj?._id || modelObj?.id || identifier;
    modelsService.deleteModel(backendId).catch(err => {
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
    addScan, addLog, addUser, editUser, deleteUser, updateUserRole,
    addModel, toggleModelStatus, deleteModel,
    refreshAll,
    // Backend status (kept for FirebaseStatus component compatibility)
    firebaseReady: backendReady,
    firebaseError: backendError,
    isLocalMode: !backendReady || !!backendError,
  }), [scans, logs, users, stats, mlModels,
    addScan, addLog, addUser, editUser, deleteUser, updateUserRole,
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
