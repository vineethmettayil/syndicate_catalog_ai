import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';

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

// Mock Firebase service for demo
class MockFirebaseService {
  private currentUser: User | null = null;
  private currentProfile: UserProfile | null = null;
  private authListeners: ((user: User | null) => void)[] = [];

  async signIn(email: string, password: string): Promise<UserProfile> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      uid: 'demo-user-123',
      email: email,
      displayName: 'Demo User'
    } as User;

    const profile: UserProfile = {
      uid: mockUser.uid,
      email: email,
      name: 'Demo User',
      role: 'catalog_ops',
      department: 'Operations',
      createdAt: new Date(),
      lastLogin: new Date()
    };

    this.currentUser = mockUser;
    this.currentProfile = profile;
    this.notifyAuthListeners(mockUser);
    
    return profile;
  }

  async signUp(email: string, password: string, userData: Partial<UserProfile>): Promise<UserProfile> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      uid: 'demo-user-' + Date.now(),
      email: email,
      displayName: userData.name || 'New User'
    } as User;

    const profile: UserProfile = {
      uid: mockUser.uid,
      email: email,
      name: userData.name || 'New User',
      role: userData.role || 'catalog_ops',
      department: userData.department || 'Operations',
      createdAt: new Date(),
      lastLogin: new Date()
    };

    this.currentUser = mockUser;
    this.currentProfile = profile;
    this.notifyAuthListeners(mockUser);
    
    return profile;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.currentProfile = null;
    this.notifyAuthListeners(null);
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.authListeners.push(callback);
    // Immediately call with current state
    callback(this.currentUser);
    
    return () => {
      this.authListeners = this.authListeners.filter(listener => listener !== callback);
    };
  }

  private notifyAuthListeners(user: User | null) {
    this.authListeners.forEach(listener => listener(user));
  }

  getCurrentProfile(): UserProfile | null {
    return this.currentProfile;
  }
}

const mockFirebaseService = new MockFirebaseService();

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = mockFirebaseService.onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        const profile = mockFirebaseService.getCurrentProfile();
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const profile = await mockFirebaseService.signIn(email, password);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      const profile = await mockFirebaseService.signUp(email, password, userData);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await mockFirebaseService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut
  };
};

export const useProcessingJobs = (userId?: string) => {
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Mock data for demo
      const mockJobs: ProcessingJob[] = [
        {
          id: '1',
          userId: userId || 'demo-user',
          fileName: 'sample_catalog.csv',
          marketplace: 'namshi',
          status: 'completed',
          totalSkus: 5,
          processedSkus: 5,
          successfulSkus: 4,
          failedSkus: 1,
          createdAt: new Date(Date.now() - 3600000), // 1 hour ago
          completedAt: new Date(Date.now() - 3000000) // 50 minutes ago
        }
      ];
      setJobs(mockJobs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [userId]);

  const createJob = async (jobData: Omit<ProcessingJob, 'id' | 'createdAt'>) => {
    try {
      const newJob: ProcessingJob = {
        ...jobData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      setJobs(prev => [newJob, ...prev]);
      return newJob.id;
    } catch (error) {
      throw error;
    }
  };

  const updateJob = async (jobId: string, updates: Partial<ProcessingJob>) => {
    try {
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      ));
    } catch (error) {
      throw error;
    }
  };

  return {
    jobs,
    loading,
    error,
    createJob,
    updateJob,
    refetch: fetchJobs
  };
};