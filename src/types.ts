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
  visible?: boolean;
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

export interface SkillItem {
  name: string;
  level?: 'Expert' | 'Advanced' | 'Proficient';
  icon?: string;
}

export interface SkillCategory {
  name: string;
  skills: SkillItem[];
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

export interface HeroStat {
  value: string;
  label: string;
}

export interface CompetencyItem {
  title: string;
  description: string;
}

export interface UserProfile {
  // Identity & Navigation
  name: string;
  roleTitle: string;
  badgeRole: string;
  availabilityStatus: string;
  location: string;
  timezone: string;
  email: string;

  // Hero Section
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroHeadlineLine3: string;
  heroQuote: string;
  stats: HeroStat[];

  // Social Links
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  resumeUrl?: string;

  // About Section
  aboutQuote: string;
  aboutBio1: string;
  aboutBio2: string;
  competencies: CompetencyItem[];

  // Skills
  skills: SkillCategory[];

  // Timeline
  experience: TimelineItem[];
  education: TimelineItem[];

  // Contact Section
  contactHeading: string;
  contactSubheading: string;
  responseSla: string;
}

export interface AdminAuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  error?: string;
  user?: { username: string };
}
