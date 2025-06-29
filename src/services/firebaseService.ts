import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { db, storage, auth } from '../config/firebase';
import { ProductData, AIProcessingResult } from './aiService';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'catalog_ops' | 'image_team';
  department: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface ProcessingJob {
  id: string;
  userId: string;
  fileName: string;
  marketplace: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalSkus: number;
  processedSkus: number;
  successfulSkus: number;
  failedSkus: number;
  createdAt: Date;
  completedAt?: Date;
  errorMessage?: string;
}

export interface SKURecord {
  id: string;
  jobId: string;
  sku: string;
  originalData: ProductData;
  processedData?: ProductData;
  aiResult?: AIProcessingResult;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'review_needed';
  marketplace: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVersion {
  id: string;
  marketplace: string;
  version: string;
  fields: { [key: string]: any };
  imageSpecs: { [key: string]: any };
  isActive: boolean;
  createdAt: Date;
  changes: string;
}

class FirebaseService {
  // Authentication methods
  async signUp(email: string, password: string, userData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        name: userData.name || '',
        role: userData.role || 'catalog_ops',
        department: userData.department || '',
        createdAt: new Date(),
        lastLogin: new Date()
      };

      await addDoc(collection(db, 'users'), userProfile);
      return userProfile;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login
      const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid));
      const userDocs = await getDocs(userQuery);
      
      if (!userDocs.empty) {
        const userDoc = userDocs.docs[0];
        await updateDoc(userDoc.ref, { lastLogin: new Date() });
        return { ...userDoc.data(), id: userDoc.id } as UserProfile;
      }

      throw new Error('User profile not found');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // File upload methods
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('File delete error:', error);
      throw error;
    }
  }

  // Processing job methods
  async createProcessingJob(jobData: Omit<ProcessingJob, 'id' | 'createdAt'>): Promise<string> {
    try {
      const job: Omit<ProcessingJob, 'id'> = {
        ...jobData,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'processing_jobs'), job);
      return docRef.id;
    } catch (error) {
      console.error('Create processing job error:', error);
      throw error;
    }
  }

  async updateProcessingJob(jobId: string, updates: Partial<ProcessingJob>): Promise<void> {
    try {
      const jobRef = doc(db, 'processing_jobs', jobId);
      await updateDoc(jobRef, { ...updates, updatedAt: new Date() });
    } catch (error) {
      console.error('Update processing job error:', error);
      throw error;
    }
  }

  async getProcessingJob(jobId: string): Promise<ProcessingJob | null> {
    try {
      const jobRef = doc(db, 'processing_jobs', jobId);
      const jobDoc = await getDoc(jobRef);
      
      if (jobDoc.exists()) {
        return { id: jobDoc.id, ...jobDoc.data() } as ProcessingJob;
      }
      return null;
    } catch (error) {
      console.error('Get processing job error:', error);
      throw error;
    }
  }

  async getProcessingJobs(userId?: string, limit_count: number = 50): Promise<ProcessingJob[]> {
    try {
      let jobQuery = query(
        collection(db, 'processing_jobs'),
        orderBy('createdAt', 'desc'),
        limit(limit_count)
      );

      if (userId) {
        jobQuery = query(
          collection(db, 'processing_jobs'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(limit_count)
        );
      }

      const querySnapshot = await getDocs(jobQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProcessingJob[];
    } catch (error) {
      console.error('Get processing jobs error:', error);
      throw error;
    }
  }

  // SKU record methods
  async createSKURecord(skuData: Omit<SKURecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const record: Omit<SKURecord, 'id'> = {
        ...skuData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'sku_records'), record);
      return docRef.id;
    } catch (error) {
      console.error('Create SKU record error:', error);
      throw error;
    }
  }

  async batchCreateSKURecords(skuRecords: Omit<SKURecord, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      const now = new Date();

      skuRecords.forEach(skuData => {
        const docRef = doc(collection(db, 'sku_records'));
        const record = {
          ...skuData,
          createdAt: now,
          updatedAt: now
        };
        batch.set(docRef, record);
      });

      await batch.commit();
    } catch (error) {
      console.error('Batch create SKU records error:', error);
      throw error;
    }
  }

  async updateSKURecord(recordId: string, updates: Partial<SKURecord>): Promise<void> {
    try {
      const recordRef = doc(db, 'sku_records', recordId);
      await updateDoc(recordRef, { ...updates, updatedAt: new Date() });
    } catch (error) {
      console.error('Update SKU record error:', error);
      throw error;
    }
  }

  async getSKURecords(jobId: string): Promise<SKURecord[]> {
    try {
      const recordQuery = query(
        collection(db, 'sku_records'),
        where('jobId', '==', jobId),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(recordQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SKURecord[];
    } catch (error) {
      console.error('Get SKU records error:', error);
      throw error;
    }
  }

  // Template management methods
  async saveTemplateVersion(templateData: Omit<TemplateVersion, 'id' | 'createdAt'>): Promise<string> {
    try {
      const template: Omit<TemplateVersion, 'id'> = {
        ...templateData,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'template_versions'), template);
      return docRef.id;
    } catch (error) {
      console.error('Save template version error:', error);
      throw error;
    }
  }

  async getActiveTemplate(marketplace: string): Promise<TemplateVersion | null> {
    try {
      const templateQuery = query(
        collection(db, 'template_versions'),
        where('marketplace', '==', marketplace),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(templateQuery);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as TemplateVersion;
      }
      return null;
    } catch (error) {
      console.error('Get active template error:', error);
      throw error;
    }
  }

  // Analytics and reporting methods
  async getProcessingStats(userId?: string, days: number = 30): Promise<any> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      let jobQuery = query(
        collection(db, 'processing_jobs'),
        where('createdAt', '>=', startDate),
        orderBy('createdAt', 'desc')
      );

      if (userId) {
        jobQuery = query(
          collection(db, 'processing_jobs'),
          where('userId', '==', userId),
          where('createdAt', '>=', startDate),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(jobQuery);
      const jobs = querySnapshot.docs.map(doc => doc.data()) as ProcessingJob[];

      const stats = {
        totalJobs: jobs.length,
        completedJobs: jobs.filter(job => job.status === 'completed').length,
        failedJobs: jobs.filter(job => job.status === 'failed').length,
        totalSkus: jobs.reduce((sum, job) => sum + job.totalSkus, 0),
        successfulSkus: jobs.reduce((sum, job) => sum + job.successfulSkus, 0),
        failedSkus: jobs.reduce((sum, job) => sum + job.failedSkus, 0),
        averageProcessingTime: 0, // Calculate based on job completion times
        marketplaceBreakdown: {} as { [key: string]: number }
      };

      // Calculate marketplace breakdown
      jobs.forEach(job => {
        stats.marketplaceBreakdown[job.marketplace] = 
          (stats.marketplaceBreakdown[job.marketplace] || 0) + job.totalSkus;
      });

      return stats;
    } catch (error) {
      console.error('Get processing stats error:', error);
      throw error;
    }
  }

  // User activity logging
  async logUserActivity(userId: string, action: string, details: any): Promise<void> {
    try {
      const activityLog = {
        userId,
        action,
        details,
        timestamp: new Date(),
        ip: 'unknown', // In production, capture from request
        userAgent: navigator.userAgent
      };

      await addDoc(collection(db, 'user_activity'), activityLog);
    } catch (error) {
      console.error('Log user activity error:', error);
      // Don't throw error for logging failures
    }
  }
}

export const firebaseService = new FirebaseService();