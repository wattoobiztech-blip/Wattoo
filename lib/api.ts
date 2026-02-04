import axios, { AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data.data;
          setToken(token);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        removeToken();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// API Interface Types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
}

interface ProfileData {
  name: string;
  age: number;
  religion?: string;
  cast?: string;
  city?: string;
  state?: string;
  country?: string;
  education?: string;
  profession?: string;
  income?: number;
  about?: string;
  [key: string]: any;
}

interface SearchFilters {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  religion?: string[];
  cast?: string[];
  cities?: string[];
  states?: string[];
  countries?: string[];
  education?: string[];
  minIncome?: number;
  maxIncome?: number;
  maritalStatus?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
}

// API Functions
export const api = {
  // Authentication
  auth: {
    register: (data: RegisterData): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/auth/register', data),

    login: (data: LoginData): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/auth/login', data),

    logout: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/auth/logout'),

    refreshToken: (refreshToken: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/auth/refresh', { refreshToken }),

    forgotPassword: (email: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/auth/forgot-password', { email }),

    resetPassword: (token: string, newPassword: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/auth/reset-password', { token, newPassword }),

    changePassword: (currentPassword: string, newPassword: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/auth/change-password', { currentPassword, newPassword }),

    getProfile: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/auth/profile'),

    updateProfile: (data: Partial<RegisterData>): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.put('/auth/profile', data),
  },

  // User Management
  user: {
    getDashboard: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/user/dashboard'),

    getStats: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/user/stats'),

    updateSettings: (settings: any): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.put('/user/settings', settings),
  },

  // Profile Management
  profile: {
    get: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/profile'),

    create: (data: ProfileData): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/profile', data),

    update: (data: Partial<ProfileData>): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.put('/profile', data),

    getById: (id: number): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get(`/profile/${id}`),

    uploadPhoto: (file: File): Promise<AxiosResponse<ApiResponse>> => {
      const formData = new FormData();
      formData.append('file', file);
      return apiClient.post('/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },

    getCompletion: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/profile/completion'),
  },

  // Search & Matching
  search: {
    profiles: (filters: SearchFilters): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/search/profiles', { params: filters }),

    saveFilters: (filters: SearchFilters): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/search/save', filters),

    getSavedFilters: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/search/saved'),
  },

  // Matches
  matches: {
    getDaily: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/matches/daily'),

    expressInterest: (profileId: number, message?: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/matches/interest', { profileId, message }),

    getMutual: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/matches/mutual'),

    getReceived: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/matches/received'),

    getSent: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/matches/sent'),

    respondToInterest: (interestId: number, response: 'accept' | 'reject'): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post(`/matches/interest/${interestId}/respond`, { response }),
  },

  // Subscriptions
  subscriptions: {
    getPlans: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/subscriptions/plans'),

    getCurrent: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/subscriptions/current'),

    subscribe: (planType: string, paymentMethod: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/subscriptions/subscribe', { planType, paymentMethod }),

    cancel: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/subscriptions/cancel'),

    getInvoices: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/subscriptions/invoices'),
  },

  // Admin APIs
  admin: {
    login: (username: string, password: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/admin/login', { username, password }),

    getDashboardMetrics: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/admin/dashboard/metrics'),

    getChartData: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/admin/dashboard/charts'),

    getRecentActivity: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/admin/dashboard/activity'),

    // User Management
    getUsers: (page = 1, limit = 20, filters?: any): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/admin/users', { params: { page, limit, ...filters } }),

    updateUserStatus: (userId: number, status: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.put(`/admin/users/${userId}/status`, { status }),

    blockUser: (userId: number, reason: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post(`/admin/users/${userId}/block`, { reason }),

    deleteUser: (userId: number): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.delete(`/admin/users/${userId}`),

    // Profile Management
    getPendingApprovals: (): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/admin/profiles/pending'),

    approveProfile: (profileId: number, notes?: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post(`/admin/profiles/${profileId}/approve`, { notes }),

    rejectProfile: (profileId: number, reason: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post(`/admin/profiles/${profileId}/reject`, { reason }),

    requestChanges: (profileId: number, changes: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post(`/admin/profiles/${profileId}/changes`, { changes }),

    // Subscription Management
    getSubscriptions: (page = 1, limit = 20): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/admin/subscriptions', { params: { page, limit } }),

    getPaymentHistory: (page = 1, limit = 20): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/admin/payments', { params: { page, limit } }),

    // Comments
    addComment: (profileId: number, comment: string, category: string): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.post('/admin/comments', { profileId, comment, category }),

    getComments: (profileId?: number): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.get('/admin/comments', { params: { profileId } }),

    updateComment: (commentId: number, updates: any): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.put(`/admin/comments/${commentId}`, updates),

    deleteComment: (commentId: number): Promise<AxiosResponse<ApiResponse>> =>
      apiClient.delete(`/admin/comments/${commentId}`),
  },
};

// Utility functions
export const authUtils = {
  setToken,
  getToken,
  removeToken,
  isAuthenticated: (): boolean => !!getToken(),
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api;