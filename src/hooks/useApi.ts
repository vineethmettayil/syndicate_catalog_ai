import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { authAPI, templatesAPI, processingAPI, analyticsAPI } from '../services/api';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

// Auth hooks
export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation(
    ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password),
    {
      onSuccess: (data) => {
        login(data.user, data.token);
        localStorage.setItem('syndicate-ai-token', data.token);
        toast.success('Successfully logged in!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Login failed');
      },
    }
  );

  const registerMutation = useMutation(
    (userData: any) => authAPI.register(userData),
    {
      onSuccess: (data) => {
        login(data.user, data.token);
        localStorage.setItem('syndicate-ai-token', data.token);
        toast.success('Account created successfully!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Registration failed');
      },
    }
  );

  const logoutHandler = () => {
    logout();
    localStorage.removeItem('syndicate-ai-token');
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  return {
    user,
    token,
    isAuthenticated,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutHandler,
    isLoggingIn: loginMutation.isLoading,
    isRegistering: registerMutation.isLoading,
  };
};

// Templates hooks
export const useTemplates = (params?: { marketplace?: string; category?: string }) => {
  return useQuery(
    ['templates', params],
    () => templatesAPI.getAll(params),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );
};

export const useTemplate = (id: string) => {
  return useQuery(
    ['template', id],
    () => templatesAPI.getById(id),
    {
      enabled: !!id,
    }
  );
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (template: any) => templatesAPI.create(template),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['templates']);
        toast.success('Template created successfully!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Failed to create template');
      },
    }
  );
};

// Processing hooks
export const useProcessingJobs = () => {
  return useQuery(
    ['processing-jobs'],
    () => processingAPI.getUserJobs(),
    {
      refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    }
  );
};

export const useProcessingJob = (jobId: string) => {
  return useQuery(
    ['processing-job', jobId],
    () => processingAPI.getJob(jobId),
    {
      enabled: !!jobId,
      refetchInterval: (data) => {
        // Stop refetching if job is completed or failed
        return data?.status === 'processing' ? 2000 : false;
      },
    }
  );
};

export const useCreateProcessingJob = () => {
  const queryClient = useQueryClient();
  const { setCurrentJob } = useStore();
  
  return useMutation(
    (jobData: any) => processingAPI.createJob(jobData),
    {
      onSuccess: (data) => {
        setCurrentJob(data);
        queryClient.invalidateQueries(['processing-jobs']);
        toast.success('Processing job started!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Failed to start processing');
      },
    }
  );
};

export const useJobResults = (jobId: string) => {
  return useQuery(
    ['job-results', jobId],
    () => processingAPI.getJobResults(jobId),
    {
      enabled: !!jobId,
    }
  );
};

// Analytics hooks
export const useDashboardAnalytics = (timeRange?: string) => {
  return useQuery(
    ['dashboard-analytics', timeRange],
    () => analyticsAPI.getDashboard(timeRange),
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );
};

export const usePerformanceMetrics = (params?: { marketplace?: string; timeRange?: string }) => {
  return useQuery(
    ['performance-metrics', params],
    () => analyticsAPI.getPerformance(params),
    {
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const useActivityLog = (limit?: number) => {
  return useQuery(
    ['activity-log', limit],
    () => analyticsAPI.getActivity(limit),
    {
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  );
};

// Real-time processing updates
export const useRealTimeProcessing = (jobId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const { updateJobProgress } = useStore();

  useEffect(() => {
    if (!jobId) return;

    // Simulate WebSocket connection for real-time updates
    const interval = setInterval(async () => {
      try {
        const job = await processingAPI.getJob(jobId);
        if (job.status === 'processing') {
          updateJobProgress(jobId, job.progress);
        }
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, updateJobProgress]);

  return { isConnected };
};

// Batch operations
export const useBatchOperations = () => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation(
    ({ jobId, itemIds }: { jobId: string; itemIds: string[] }) =>
      processingAPI.batchApprove(jobId, itemIds),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['job-results']);
        toast.success(data.message);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Batch approve failed');
      },
    }
  );

  const rejectMutation = useMutation(
    ({ jobId, itemIds }: { jobId: string; itemIds: string[] }) =>
      processingAPI.batchReject(jobId, itemIds),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['job-results']);
        toast.success(data.message);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Batch reject failed');
      },
    }
  );

  return {
    batchApprove: approveMutation.mutate,
    batchReject: rejectMutation.mutate,
    isApproving: approveMutation.isLoading,
    isRejecting: rejectMutation.isLoading,
  };
};

// Performance monitoring
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    memoryUsage: 0,
    apiLatency: 0,
  });

  useEffect(() => {
    // Monitor page load time
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime }));

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit
      }));
    }

    // Monitor API latency
    const startTime = Date.now();
    fetch('/api/health')
      .then(() => {
        const latency = Date.now() - startTime;
        setMetrics(prev => ({ ...prev, apiLatency: latency }));
      })
      .catch(() => {
        setMetrics(prev => ({ ...prev, apiLatency: -1 }));
      });
  }, []);

  return metrics;
};