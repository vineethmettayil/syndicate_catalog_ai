import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('syndicate-ai-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('syndicate-ai-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    role?: string;
    department?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Templates API
export const templatesAPI = {
  getAll: async (params?: { marketplace?: string; category?: string }) => {
    const response = await api.get('/templates', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },
  
  create: async (template: any) => {
    const response = await api.post('/templates', template);
    return response.data;
  },
  
  update: async (id: string, template: any) => {
    const response = await api.put(`/templates/${id}`, template);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  },
  
  getMarketplacePerformance: async (marketplace: string) => {
    const response = await api.get(`/templates/marketplace/${marketplace}/performance`);
    return response.data;
  },
};

// Processing API
export const processingAPI = {
  createJob: async (jobData: {
    fileName: string;
    marketplace: string;
    data: any[];
    options?: any;
  }) => {
    const response = await api.post('/processing/jobs', jobData);
    return response.data;
  },
  
  getJob: async (jobId: string) => {
    const response = await api.get(`/processing/jobs/${jobId}`);
    return response.data;
  },
  
  getUserJobs: async () => {
    const response = await api.get('/processing/jobs');
    return response.data;
  },
  
  getJobResults: async (jobId: string) => {
    const response = await api.get(`/processing/jobs/${jobId}/results`);
    return response.data;
  },
  
  batchApprove: async (jobId: string, itemIds: string[]) => {
    const response = await api.post('/processing/batch/approve', { jobId, itemIds });
    return response.data;
  },
  
  batchReject: async (jobId: string, itemIds: string[]) => {
    const response = await api.post('/processing/batch/reject', { jobId, itemIds });
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboard: async (timeRange?: string) => {
    const response = await api.get('/analytics/dashboard', { 
      params: { timeRange } 
    });
    return response.data;
  },
  
  getPerformance: async (params?: { marketplace?: string; timeRange?: string }) => {
    const response = await api.get('/analytics/performance', { params });
    return response.data;
  },
  
  getActivity: async (limit?: number) => {
    const response = await api.get('/analytics/activity', { 
      params: { limit } 
    });
    return response.data;
  },
  
  getExports: async () => {
    const response = await api.get('/analytics/exports');
    return response.data;
  },
};

// File upload utility
export const uploadFile = async (file: File, onProgress?: (progress: number) => void) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });
  
  return response.data;
};

export default api;