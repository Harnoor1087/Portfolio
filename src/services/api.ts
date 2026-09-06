import { Project, ProjectInput, ContactMessage, AdminAuthResponse } from '../types';

const TOKEN_KEY = 'portfolio_admin_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Public project fetching
  async getProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects');
    if (!res.ok) {
      throw new Error(`Failed to fetch projects: ${res.statusText}`);
    }
    return res.json();
  },

  async getProject(id: string): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch project: ${res.statusText}`);
    }
    return res.json();
  },

  // Contact form submission
  async submitContact(data: { name: string; email: string; subject?: string; message: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to send message');
    }
    return result;
  },

  // Admin Auth
  async login(credentials: { username: string; password: string }): Promise<AdminAuthResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setStoredToken(data.token);
    }
    return data;
  },

  async verifyAuth(): Promise<boolean> {
    const token = getStoredToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/verify', {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return Boolean(data.valid);
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } finally {
      removeStoredToken();
    }
  },

  // Admin Project CRUD
  async createProject(project: ProjectInput): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create project');
    }
    return data;
  },

  async updateProject(id: string, project: Partial<ProjectInput>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update project');
    }
    return data;
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to delete project');
    }
  },

  // Admin Contact Messages
  async getMessages(): Promise<ContactMessage[]> {
    const res = await fetch('/api/contact', {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch contact messages');
    }
    return res.json();
  },

  async deleteMessage(id: string): Promise<void> {
    const res = await fetch(`/api/contact/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to delete message');
    }
  },

  // Seed default demo projects
  async seedProjects(force = true): Promise<Project[]> {
    const res = await fetch('/api/seed', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ force }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to seed projects');
    }
    return data.projects;
  },
};
