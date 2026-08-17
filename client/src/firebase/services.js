import axios from 'axios';

// Use relative URL — Vite dev server proxies /api to http://localhost:5000
const API_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add token if it exists
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const scansService = {
  async addScan(scanData) {
    const response = await api.post('/scans', scanData);
    return response.data;
  },

  async getScans(limitCount = 100) {
    const response = await api.get(`/scans?limit=${limitCount}`);
    return response.data;
  },

  async getScansByType(type) {
    // Requires backend update for query params if needed, mock for now
    const response = await api.get('/scans');
    return response.data.filter(scan => scan.type === type);
  },

  async deleteScan(scanId) {
    const response = await api.delete(`/scans/${scanId}`);
    return response.data;
  },
};

export const logsService = {
  async addLog(logData) {
    const response = await api.post('/logs', logData);
    return response.data;
  },

  async getLogs(limitCount = 500) {
    const response = await api.get(`/logs?limit=${limitCount}`);
    return response.data;
  },

  async getLogsByLevel(level) {
    const response = await api.get('/logs');
    return response.data.filter(log => log.level === level);
  },
};

// ── Demo accounts used as offline fallback when server is not reachable ──
const DEMO_ACCOUNTS = [
  {
    _id: 'demo-admin-001',
    name: 'System Administrator',
    email: 'admin@apds.edu',
    password: 'Admin@12345',
    role: 'admin',
    token: 'demo-admin-token',
  },
  {
    _id: 'demo-user-001',
    name: 'Amna Najam',
    email: 'amna.student@uos.edu.pk',
    password: 'User@12345',
    role: 'user',
    token: 'demo-user-token',
  },
  {
    _id: 'demo-user-002',
    name: 'Alisha Noor',
    email: 'alisha.student@uos.edu.pk',
    password: 'User@12345',
    role: 'user',
    token: 'demo-user-token-2',
  },
];

export const usersService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (err) {
      // Offline fallback: check demo accounts
      const found = DEMO_ACCOUNTS.find(
        a => a.email.toLowerCase() === userData.email?.toLowerCase()
      );
      if (found) {
        throw new Error('User already exists');
      }
      // Allow demo self-registration
      const newUser = {
        _id: `demo-new-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: 'user',
        token: `demo-token-${Date.now()}`,
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    }
  },

  async login(userData) {
    try {
      const response = await api.post('/auth/login', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (err) {
      // ── OFFLINE DEMO FALLBACK ──
      // If server is down, match against known demo accounts
      const found = DEMO_ACCOUNTS.find(
        a =>
          a.email.toLowerCase() === userData.email?.toLowerCase() &&
          a.password === userData.password
      );
      if (found) {
        const { password: _pw, ...safeUser } = found;
        localStorage.setItem('user', JSON.stringify(safeUser));
        return safeUser;
      }
      // Re-throw original error so login form shows correct message
      throw err;
    }
  },

  async logout() {
    localStorage.removeItem('user');
  },

  async addUser(userData) {
    // Alias for register to support older frontend code
    return this.register(userData);
  },

  // These might need admin endpoints in backend if actually needed
  async getUsers() {
    // We don't have a get all users in backend yet, just getMe
    // This is mock for now to keep UI from crashing
    return [];
  },

  async updateUser(userId, updates) {
    // MOCK
    return null;
  },

  async getUserByEmail(email) {
    // MOCK
    return null;
  },
};

export const statsService = {
  async updateStats(statsData) {
    const response = await api.put('/stats', statsData);
    return response.data;
  },

  async getStats() {
    const response = await api.get('/stats');
    return response.data;
  },
};

export const modelsService = {
  async addModel(modelData) {
    const response = await api.post('/models', modelData);
    return response.data;
  },

  async getModels() {
    const response = await api.get('/models');
    return response.data;
  },

  async updateModel(modelId, updates) {
    const response = await api.put(`/models/${modelId}`, updates);
    return response.data;
  },

  async deleteModel(modelId) {
    const response = await api.delete(`/models/${modelId}`);
    return response.data;
  },
};

export const batchService = {
  async batchAddScans(scans) {
    const response = await api.post('/scans/batch', { scans });
    return response.data;
  },
};

export default {
  scansService,
  logsService,
  usersService,
  statsService,
  modelsService,
  batchService,
};
