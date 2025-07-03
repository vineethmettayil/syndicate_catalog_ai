import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'catalog_ops' | 'image_team';
  department: string;
}

interface ProcessingJob {
  id: string;
  fileName: string;
  marketplace: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalSkus: number;
  processedSkus: number;
  successfulSkus: number;
  failedSkus: number;
  progress: {
    currentStep: string;
    percentage: number;
    estimatedTimeRemaining: number;
  };
  createdAt: string;
  completedAt?: string;
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // UI State
  sidebarOpen: boolean;
  activeTab: string;
  loading: boolean;
  
  // Processing
  currentJob: ProcessingJob | null;
  processingHistory: ProcessingJob[];
  
  // Data
  uploadedData: any[];
  processedResults: any[];
  
  // Settings
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    autoSave: boolean;
  };
}

interface AppActions {
  // Auth actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  
  // UI actions
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  
  // Processing actions
  setCurrentJob: (job: ProcessingJob | null) => void;
  addToHistory: (job: ProcessingJob) => void;
  updateJobProgress: (jobId: string, progress: Partial<ProcessingJob['progress']>) => void;
  
  // Data actions
  setUploadedData: (data: any[]) => void;
  setProcessedResults: (results: any[]) => void;
  clearData: () => void;
  
  // Settings actions
  updatePreferences: (preferences: Partial<AppState['preferences']>) => void;
}

export const useStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        token: null,
        isAuthenticated: false,
        sidebarOpen: false,
        activeTab: 'dashboard',
        loading: false,
        currentJob: null,
        processingHistory: [],
        uploadedData: [],
        processedResults: [],
        preferences: {
          theme: 'light',
          notifications: true,
          autoSave: true,
        },

        // Auth actions
        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        login: (user, token) => set({ 
          user, 
          token, 
          isAuthenticated: true 
        }),
        logout: () => set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          currentJob: null,
          uploadedData: [],
          processedResults: []
        }),

        // UI actions
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        setActiveTab: (activeTab) => set({ activeTab }),
        setLoading: (loading) => set({ loading }),

        // Processing actions
        setCurrentJob: (currentJob) => set({ currentJob }),
        addToHistory: (job) => set((state) => ({
          processingHistory: [job, ...state.processingHistory.slice(0, 9)]
        })),
        updateJobProgress: (jobId, progress) => set((state) => ({
          currentJob: state.currentJob?.id === jobId 
            ? { ...state.currentJob, progress: { ...state.currentJob.progress, ...progress } }
            : state.currentJob,
          processingHistory: state.processingHistory.map(job =>
            job.id === jobId 
              ? { ...job, progress: { ...job.progress, ...progress } }
              : job
          )
        })),

        // Data actions
        setUploadedData: (uploadedData) => set({ uploadedData }),
        setProcessedResults: (processedResults) => set({ processedResults }),
        clearData: () => set({ 
          uploadedData: [], 
          processedResults: [], 
          currentJob: null 
        }),

        // Settings actions
        updatePreferences: (newPreferences) => set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        })),
      }),
      {
        name: 'syndicate-ai-store',
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          preferences: state.preferences,
          processingHistory: state.processingHistory.slice(0, 5), // Keep only recent history
        }),
      }
    ),
    { name: 'syndicate-ai' }
  )
);

// Selectors for better performance
export const useAuth = () => useStore((state) => ({
  user: state.user,
  token: state.token,
  isAuthenticated: state.isAuthenticated,
  login: state.login,
  logout: state.logout,
}));

export const useUI = () => useStore((state) => ({
  sidebarOpen: state.sidebarOpen,
  activeTab: state.activeTab,
  loading: state.loading,
  setSidebarOpen: state.setSidebarOpen,
  setActiveTab: state.setActiveTab,
  setLoading: state.setLoading,
}));

export const useProcessing = () => useStore((state) => ({
  currentJob: state.currentJob,
  processingHistory: state.processingHistory,
  setCurrentJob: state.setCurrentJob,
  addToHistory: state.addToHistory,
  updateJobProgress: state.updateJobProgress,
}));

export const useData = () => useStore((state) => ({
  uploadedData: state.uploadedData,
  processedResults: state.processedResults,
  setUploadedData: state.setUploadedData,
  setProcessedResults: state.setProcessedResults,
  clearData: state.clearData,
}));