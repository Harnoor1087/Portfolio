export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Full-Stack' | 'Frontend' | 'Backend & Cloud' | 'AI & Data' | 'Mobile';
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

export interface TimelineItem {
  id: string;
  type: 'experience' | 'education';
  title: string;
  organization: string;
  location: string;
  period: string;
  description: string[];
  skills?: string[];
}

export interface SkillCategory {
  name: string;
  skills: { name: string; level?: 'Expert' | 'Advanced' | 'Proficient'; icon?: string }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  error?: string;
}
