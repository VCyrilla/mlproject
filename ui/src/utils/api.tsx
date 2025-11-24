import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-05e5e588`;

// Store access token globally
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken || publicAnonKey}`,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

// Auth API
export const authAPI = {
  signup: async (data: { email: string; password: string; fullName: string; organization: string; role: string }) => {
    return fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  signin: async (email: string, password: string) => {
    return fetchAPI('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getSession: async () => {
    return fetchAPI('/auth/session');
  },
};

// Analysis API
export const analysisAPI = {
  upload: async (fileData: { fileName: string; fileSize: number; fileHash: string; fileType: string }) => {
    return fetchAPI('/analysis/upload', {
      method: 'POST',
      body: JSON.stringify(fileData),
    });
  },

  getAnalysis: async (id: string) => {
    return fetchAPI(`/analysis/${id}`);
  },

  getHistory: async () => {
    return fetchAPI('/analysis/history');
  },

  deleteAnalysis: async (id: string) => {
    return fetchAPI(`/analysis/${id}`, {
      method: 'DELETE',
    });
  },

  applyAction: async (id: string, action: string, notes?: string) => {
    return fetchAPI(`/analysis/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, notes }),
    });
  },

  getFilesByStatus: async (status: string) => {
    return fetchAPI(`/files/by-status/${status}`);
  },
};

// CLI API
export const cliAPI = {
  execute: async (command: string) => {
    return fetchAPI('/cli/execute', {
      method: 'POST',
      body: JSON.stringify({ command }),
    });
  },

  getHistory: async () => {
    return fetchAPI('/cli/history');
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return fetchAPI('/dashboard/stats');
  },
};
