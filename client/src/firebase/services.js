/**
 * Firebase Services - Firestore CRUD operations
 * Handles data synchronization with Firestore database
 */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { getFirebaseServices } from './init';

const COLLECTIONS = {
  SCANS: 'scans',
  LOGS: 'system_logs',
  USERS: 'users',
  STATS: 'statistics',
  ML_MODELS: 'ml_models',
};

function getDb() {
  try {
    const { db } = getFirebaseServices();
    return db;
  } catch (error) {
    console.error('[Firebase] Not initialized:', error.message);
    return null;
  }
}

function guardFirebase(operation) {
  const dbInstance = getDb();
  if (!dbInstance) {
    console.warn(`[Firebase] Skipping ${operation}: Firestore is not initialized`);
    return null;
  }
  return dbInstance;
}

/**
 * Scans Collection Operations
 */
export const scansService = {
  async addScan(scanData) {
    try {
      const dbInstance = guardFirebase('addScan');
      if (!dbInstance) return null;
      const docRef = await addDoc(collection(dbInstance, COLLECTIONS.SCANS), {
        ...scanData,
        createdAt: Timestamp.now(),
        syncedAt: Timestamp.now(),
      });
      console.log('Scan added:', docRef.id);
      return { id: docRef.id, ...scanData };
    } catch (error) {
      console.error('Error adding scan:', error);
      throw error;
    }
  },

  async getScans(limitCount = 100) {
    try {
      const dbInstance = guardFirebase('getScans');
      if (!dbInstance) return [];
      const q = query(
        collection(dbInstance, COLLECTIONS.SCANS),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching scans:', error);
      throw error;
    }
  },

  async getScansByType(type) {
    try {
      const dbInstance = guardFirebase('getScansByType');
      if (!dbInstance) return [];
      const q = query(
        collection(dbInstance, COLLECTIONS.SCANS),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching scans by type:', error);
      throw error;
    }
  },

  async deleteScan(scanId) {
    try {
      const dbInstance = guardFirebase('deleteScan');
      if (!dbInstance) return;
      await deleteDoc(doc(dbInstance, COLLECTIONS.SCANS, scanId));
      console.log('Scan deleted:', scanId);
    } catch (error) {
      console.error('Error deleting scan:', error);
      throw error;
    }
  },
};

/**
 * System Logs Collection Operations
 */
export const logsService = {
  async addLog(logData) {
    try {
      const dbInstance = guardFirebase('addLog');
      if (!dbInstance) return null;
      const docRef = await addDoc(collection(dbInstance, COLLECTIONS.LOGS), {
        ...logData,
        timestamp: Timestamp.now(),
      });
      return { id: docRef.id, ...logData };
    } catch (error) {
      console.error('Error adding log:', error);
      throw error;
    }
  },

  async getLogs(limitCount = 500) {
    try {
      const dbInstance = guardFirebase('getLogs');
      if (!dbInstance) return [];
      const q = query(
        collection(dbInstance, COLLECTIONS.LOGS),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  },

  async getLogsByLevel(level) {
    try {
      const dbInstance = guardFirebase('getLogsByLevel');
      if (!dbInstance) return [];
      const q = query(
        collection(dbInstance, COLLECTIONS.LOGS),
        where('level', '==', level),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching logs by level:', error);
      throw error;
    }
  },
};

/**
 * Users Collection Operations
 */
export const usersService = {
  async addUser(userData) {
    try {
      const dbInstance = guardFirebase('addUser');
      if (!dbInstance) return null;
      const docRef = await addDoc(collection(dbInstance, COLLECTIONS.USERS), {
        ...userData,
        createdAt: Timestamp.now(),
      });
      return { id: docRef.id, ...userData };
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },

  async getUsers() {
    try {
      const dbInstance = guardFirebase('getUsers');
      if (!dbInstance) return [];
      const snapshot = await getDocs(collection(dbInstance, COLLECTIONS.USERS));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async updateUser(userId, updates) {
    try {
      const dbInstance = guardFirebase('updateUser');
      if (!dbInstance) return;
      await updateDoc(doc(dbInstance, COLLECTIONS.USERS, userId), updates);
      console.log('User updated:', userId);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      const dbInstance = guardFirebase('getUserByEmail');
      if (!dbInstance) return null;
      const q = query(collection(dbInstance, COLLECTIONS.USERS), where('email', '==', email));
      const snapshot = await getDocs(q);
      return snapshot.docs.length > 0 ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      throw error;
    }
  },
};

/**
 * Statistics Collection Operations
 */
export const statsService = {
  async updateStats(statsData) {
    try {
      const dbInstance = guardFirebase('updateStats');
      if (!dbInstance) return;
      const docRef = doc(dbInstance, COLLECTIONS.STATS, 'current');
      await updateDoc(docRef, {
        ...statsData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;
    }
  },

  async getStats() {
    try {
      const dbInstance = guardFirebase('getStats');
      if (!dbInstance) return null;
      const docRef = doc(dbInstance, COLLECTIONS.STATS, 'current');
      const docSnap = await getDocs(collection(dbInstance, COLLECTIONS.STATS));
      if (docSnap.docs.length > 0) {
        return docSnap.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },
};

/**
 * ML Models Collection Operations
 */
export const modelsService = {
  async addModel(modelData) {
    try {
      const dbInstance = guardFirebase('addModel');
      if (!dbInstance) return null;
      const docRef = await addDoc(collection(dbInstance, COLLECTIONS.ML_MODELS), {
        ...modelData,
        createdAt: Timestamp.now(),
      });
      return { id: docRef.id, ...modelData };
    } catch (error) {
      console.error('Error adding model:', error);
      throw error;
    }
  },

  async getModels() {
    try {
      const dbInstance = guardFirebase('getModels');
      if (!dbInstance) return [];
      const snapshot = await getDocs(collection(dbInstance, COLLECTIONS.ML_MODELS));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },

  async updateModel(modelId, updates) {
    try {
      const dbInstance = guardFirebase('updateModel');
      if (!dbInstance) return;
      await updateDoc(doc(dbInstance, COLLECTIONS.ML_MODELS, modelId), updates);
      console.log('Model updated:', modelId);
    } catch (error) {
      console.error('Error updating model:', error);
      throw error;
    }
  },

  async deleteModel(modelId) {
    try {
      const dbInstance = guardFirebase('deleteModel');
      if (!dbInstance) return;
      await deleteDoc(doc(dbInstance, COLLECTIONS.ML_MODELS, modelId));
      console.log('Model deleted:', modelId);
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  },
};

/**
 * Batch Operations
 */
export const batchService = {
  async batchAddScans(scans) {
    try {
      const dbInstance = guardFirebase('batchAddScans');
      if (!dbInstance) return [];
      const batch = writeBatch(dbInstance);
      const refs = [];
      
      scans.forEach((scan) => {
        const docRef = doc(collection(dbInstance, COLLECTIONS.SCANS));
        batch.set(docRef, {
          ...scan,
          createdAt: Timestamp.now(),
        });
        refs.push(docRef);
      });

      await batch.commit();
      console.log(`Batch added ${scans.length} scans`);
      return refs;
    } catch (error) {
      console.error('Error batch adding scans:', error);
      throw error;
    }
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
