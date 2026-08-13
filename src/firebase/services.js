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
import { db } from './init';

const COLLECTIONS = {
  SCANS: 'scans',
  LOGS: 'system_logs',
  USERS: 'users',
  STATS: 'statistics',
  ML_MODELS: 'ml_models',
};

/**
 * Scans Collection Operations
 */
export const scansService = {
  async addScan(scanData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.SCANS), {
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
      const q = query(
        collection(db, COLLECTIONS.SCANS),
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
      const q = query(
        collection(db, COLLECTIONS.SCANS),
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
      await deleteDoc(doc(db, COLLECTIONS.SCANS, scanId));
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
      const docRef = await addDoc(collection(db, COLLECTIONS.LOGS), {
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
      const q = query(
        collection(db, COLLECTIONS.LOGS),
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
      const q = query(
        collection(db, COLLECTIONS.LOGS),
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
      const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
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
      const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async updateUser(userId, updates) {
    try {
      await updateDoc(doc(db, COLLECTIONS.USERS, userId), updates);
      console.log('User updated:', userId);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email));
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
      const docRef = doc(db, COLLECTIONS.STATS, 'current');
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
      const docRef = doc(db, COLLECTIONS.STATS, 'current');
      const docSnap = await getDocs(collection(db, COLLECTIONS.STATS));
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
      const docRef = await addDoc(collection(db, COLLECTIONS.ML_MODELS), {
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
      const snapshot = await getDocs(collection(db, COLLECTIONS.ML_MODELS));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  },

  async updateModel(modelId, updates) {
    try {
      await updateDoc(doc(db, COLLECTIONS.ML_MODELS, modelId), updates);
      console.log('Model updated:', modelId);
    } catch (error) {
      console.error('Error updating model:', error);
      throw error;
    }
  },

  async deleteModel(modelId) {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ML_MODELS, modelId));
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
      const batch = writeBatch(db);
      const refs = [];
      
      scans.forEach((scan) => {
        const docRef = doc(collection(db, COLLECTIONS.SCANS));
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
