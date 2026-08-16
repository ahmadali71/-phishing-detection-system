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

export const usersService = {
  // Auth endpoints (replacing old addUser behavior)
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async login(userData) {
    const response = await api.post('/auth/login', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
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
