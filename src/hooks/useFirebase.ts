import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { firebaseService, UserProfile, ProcessingJob } from '../services/firebaseService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseService.onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Fetch user profile from Firestore
          // This would need to be implemented in firebaseService
          setUserProfile({
            uid: user.uid,
            email: user.email!,
            name: user.displayName || 'User',
            role: 'catalog_ops', // Default role
            department: 'Operations',
            createdAt: new Date(),
            lastLogin: new Date()
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const profile = await firebaseService.signIn(email, password);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      const profile = await firebaseService.signUp(email, password, userData);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseService.signOut();
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
      const fetchedJobs = await firebaseService.getProcessingJobs(userId);
      setJobs(fetchedJobs);
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
      const jobId = await firebaseService.createProcessingJob(jobData);
      await fetchJobs(); // Refresh the list
      return jobId;
    } catch (error) {
      throw error;
    }
  };

  const updateJob = async (jobId: string, updates: Partial<ProcessingJob>) => {
    try {
      await firebaseService.updateProcessingJob(jobId, updates);
      await fetchJobs(); // Refresh the list
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