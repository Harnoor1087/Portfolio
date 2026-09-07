import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { DEFAULT_PROFILE } from "./src/data/initialData";
import { UserProfile } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Database storage paths
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface DbSchema {
  projects: Array<{
    id: string;
    title: string;
    tagline: string;
    description: string;
    category: string;
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
    imageUrl: string;
    featured: boolean;
    visible?: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
  }>;
  messages: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    read: boolean;
  }>;
  profile: UserProfile;
}

const DEFAULT_PROJECTS = [
  {
    id: "proj-1",
    title: "PulseStream Analytics",
    tagline: "High-throughput real-time event streaming and observability platform",
    description: "An enterprise-grade telemetry engine processing 100k+ events/sec with sub-second latency, interactive DAG pipelines, and dynamic anomaly alerts.",
    category: "Full-Stack",
    techStack: ["React", "TypeScript", "Node.js", "Apache Kafka", "ClickHouse", "Tailwind CSS", "Docker"],
    liveUrl: "https://github.com",
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    featured: true,
    order: 1,
    createdAt: "2025-01-15T10:00:00.000Z",
    updatedAt: "2025-01-15T10:00:00.000Z",
  },
  {
    id: "proj-2",
    title: "Aura Canvas Studio",
    tagline: "Collaborative real-time canvas with generative AI design assists",
    description: "Multi-user vector drafting canvas powered by WebSockets and CRDTs for frictionless remote whiteboard brainstorming with smart layout suggestions.",
    category: "AI & Data",
    techStack: ["React 19", "Canvas API", "WebSockets", "Gemini API", "Tailwind CSS", "Vite"],
    liveUrl: "https://github.com",
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    featured: true,
    order: 2,
    createdAt: "2025-02-10T14:30:00.000Z",
    updatedAt: "2025-02-10T14:30:00.000Z",
  },
  {
    id: "proj-3",
    title: "OmniVault Zero-Trust",
    tagline: "Client-side encrypted secrets manager for engineering teams",
    description: "Zero-knowledge encrypted cloud credential vault leveraging Web Crypto API, WebAuthn biometrics, and automated rotation webhooks for infrastructure secrets.",
    category: "Backend & Cloud",
    techStack: ["TypeScript", "Express", "Web Crypto API", "PostgreSQL", "Redis", "Docker"],
    liveUrl: "https://github.com",
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop",
    featured: true,
    order: 3,
    createdAt: "2025-03-01T09:00:00.000Z",
    updatedAt: "2025-03-01T09:00:00.000Z",
  },
  {
    id: "proj-4",
    title: "DevMorph CLI & SDK",
    tagline: "Astute code transformation toolchain with AST pattern matching",
    description: "Blazing-fast developer toolkit for executing large-scale automated refactoring, dependency migrations, and architecture enforcement across monorepos.",
    category: "Backend & Cloud",
    techStack: ["Rust", "Node.js", "Babel AST", "TypeScript", "npm"],
    liveUrl: "https://github.com",
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
    featured: false,
    order: 4,
    createdAt: "2024-11-20T11:20:00.000Z",
    updatedAt: "2024-11-20T11:20:00.000Z",
  },
  {
    id: "proj-5",
    title: "Prism UI Design System",
    tagline: "Accessible, tokens-driven component library with fluid ergonomics",
    description: "Comprehensive React & Web Components library featuring WCAG 2.1 AAA compliance, fluid spacing tokens, dark/light adaptive theming, and extensive documentation.",
    category: "Frontend",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Radix UI", "Storybook"],
    liveUrl: "https://github.com",
    githubUrl: "https://github.com",
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop",
    featured: false,
    order: 5,
    createdAt: "2024-10-05T16:45:00.000Z",
    updatedAt: "2024-10-05T16:45:00.000Z",
  },
];

function initDb(): DbSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DbSchema = {
      projects: DEFAULT_PROJECTS,
      messages: [],
      profile: JSON.parse(JSON.stringify(DEFAULT_PROFILE)),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as DbSchema;
    parsed.projects = (parsed.projects || []).map((p) => ({
      ...p,
      visible: p.visible !== undefined ? p.visible : true,
    }));
    if (!parsed.profile) {
      parsed.profile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
    }
    return parsed;
  } catch (err) {
    console.error("Failed to parse db.json, re-initializing:", err);
    const initialData: DbSchema = {
      projects: DEFAULT_PROJECTS,
      messages: [],
      profile: JSON.parse(JSON.stringify(DEFAULT_PROFILE)),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
    return initialData;
  }
}

function saveDb(data: DbSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

let db = initDb();

// Authentication middleware
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

// Simple token storage
const activeTokens = new Set<string>();

function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
  }
  const token = authHeader.split(" ")[1];
  if (!activeTokens.has(token)) {
    return res.status(403).json({ error: "Forbidden: Session expired or invalid token" });
  }
  next();
}

/* =========================================================================
   API ROUTES
   ========================================================================= */

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Admin Auth Login
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = `adm_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    activeTokens.add(token);
    return res.json({
      success: true,
      token,
      message: "Authentication successful",
      user: { username: ADMIN_USERNAME },
    });
  }
  return res.status(401).json({
    success: false,
    error: "Invalid username or password",
  });
});

// Admin Auth Verify
app.get("/api/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ valid: false });
  }
  const token = authHeader.split(" ")[1];
  const isValid = activeTokens.has(token);
  return res.json({ valid: isValid });
});

// Admin Auth Logout
app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    activeTokens.delete(token);
  }
  res.json({ success: true });
});

// GET /api/projects - Public list of projects (or all projects if requested by authenticated admin)
app.get("/api/projects", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const isAdmin = Boolean(token && activeTokens.has(token));
  const includeHidden = req.query.all === "true" && isAdmin;

  const targetProjects = includeHidden
    ? db.projects
    : db.projects.filter((p) => p.visible !== false);

  // Return sorted: featured first, then by order asc
  const sorted = [...targetProjects].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return (a.order || 0) - (b.order || 0);
  });
  res.json(sorted);
});

// GET /api/projects/:id - Single project
app.get("/api/projects/:id", (req, res) => {
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }
  res.json(project);
});

// POST /api/projects - Create project (Protected)
app.post("/api/projects", requireAdminAuth, (req, res) => {
  const { title, tagline, description, category, techStack, liveUrl, githubUrl, imageUrl, featured, visible, order } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const newProject = {
    id: `proj-${Date.now()}`,
    title: String(title).trim(),
    tagline: tagline ? String(tagline).trim() : "",
    description: String(description).trim(),
    category: category || "Full-Stack",
    techStack: Array.isArray(techStack) ? techStack.map(String) : [],
    liveUrl: liveUrl ? String(liveUrl).trim() : "",
    githubUrl: githubUrl ? String(githubUrl).trim() : "",
    imageUrl: imageUrl ? String(imageUrl).trim() : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    featured: Boolean(featured),
    visible: visible !== undefined ? Boolean(visible) : true,
    order: typeof order === "number" ? order : db.projects.length + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.projects.push(newProject);
  saveDb(db);

  res.status(201).json(newProject);
});

// PUT /api/projects/:id - Update project (Protected)
app.put("/api/projects/:id", requireAdminAuth, (req, res) => {
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  const existing = db.projects[index];
  const { title, tagline, description, category, techStack, liveUrl, githubUrl, imageUrl, featured, visible, order } = req.body;

  const updatedProject = {
    ...existing,
    title: title !== undefined ? String(title).trim() : existing.title,
    tagline: tagline !== undefined ? String(tagline).trim() : existing.tagline,
    description: description !== undefined ? String(description).trim() : existing.description,
    category: category !== undefined ? category : existing.category,
    techStack: Array.isArray(techStack) ? techStack.map(String) : existing.techStack,
    liveUrl: liveUrl !== undefined ? String(liveUrl).trim() : existing.liveUrl,
    githubUrl: githubUrl !== undefined ? String(githubUrl).trim() : existing.githubUrl,
    imageUrl: imageUrl !== undefined ? String(imageUrl).trim() : existing.imageUrl,
    featured: featured !== undefined ? Boolean(featured) : existing.featured,
    visible: visible !== undefined ? Boolean(visible) : (existing.visible ?? true),
    order: typeof order === "number" ? order : existing.order,
    updatedAt: new Date().toISOString(),
  };

  db.projects[index] = updatedProject;
  saveDb(db);

  res.json(updatedProject);
});

// PATCH /api/projects/:id/visibility - Toggle project visibility directly (Protected)
app.patch("/api/projects/:id/visibility", requireAdminAuth, (req, res) => {
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }

  const current = db.projects[index];
  const newVisible = req.body.visible !== undefined ? Boolean(req.body.visible) : !(current.visible !== false);
  current.visible = newVisible;
  current.updatedAt = new Date().toISOString();

  db.projects[index] = current;
  saveDb(db);

  res.json(current);
});

// DELETE /api/projects/:id - Delete project (Protected)
app.delete("/api/projects/:id", requireAdminAuth, (req, res) => {
  const initialCount = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== req.params.id);

  if (db.projects.length === initialCount) {
    return res.status(404).json({ error: "Project not found" });
  }

  saveDb(db);
  res.json({ success: true, message: "Project deleted successfully" });
});

// POST /api/seed - Reset or seed projects
app.post("/api/seed", (req, res) => {
  // Allow if admin or if database is empty
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const isAdmin = token && activeTokens.has(token);

  if (db.projects.length > 0 && !isAdmin && req.body.force !== true) {
    return res.status(400).json({ error: "Database already contains projects. Provide force: true to overwrite." });
  }

  db.projects = DEFAULT_PROJECTS;
  saveDb(db);
  res.json({ success: true, count: db.projects.length, projects: db.projects });
});

/* =========================================================================
   PROFILE & BIO MANAGEMENT ENDPOINTS
   ========================================================================= */

// GET /api/profile - Public endpoint to retrieve developer profile data
app.get("/api/profile", (_req, res) => {
  res.json(db.profile || DEFAULT_PROFILE);
});

// PUT /api/profile - Protected endpoint to update developer profile data
app.put("/api/profile", requireAdminAuth, (req, res) => {
  const updatedData = req.body;
  if (!updatedData || typeof updatedData !== "object") {
    return res.status(400).json({ error: "Invalid profile data payload" });
  }

  // Merge with existing profile data
  db.profile = {
    ...db.profile,
    ...updatedData,
    name: updatedData.name !== undefined ? String(updatedData.name).trim() : db.profile.name,
    roleTitle: updatedData.roleTitle !== undefined ? String(updatedData.roleTitle).trim() : db.profile.roleTitle,
    badgeRole: updatedData.badgeRole !== undefined ? String(updatedData.badgeRole).trim() : db.profile.badgeRole,
    availabilityStatus: updatedData.availabilityStatus !== undefined ? String(updatedData.availabilityStatus).trim() : db.profile.availabilityStatus,
    location: updatedData.location !== undefined ? String(updatedData.location).trim() : db.profile.location,
    timezone: updatedData.timezone !== undefined ? String(updatedData.timezone).trim() : db.profile.timezone,
    email: updatedData.email !== undefined ? String(updatedData.email).trim() : db.profile.email,
    heroHeadlineLine1: updatedData.heroHeadlineLine1 !== undefined ? String(updatedData.heroHeadlineLine1).trim() : db.profile.heroHeadlineLine1,
    heroHeadlineLine2: updatedData.heroHeadlineLine2 !== undefined ? String(updatedData.heroHeadlineLine2).trim() : db.profile.heroHeadlineLine2,
    heroHeadlineLine3: updatedData.heroHeadlineLine3 !== undefined ? String(updatedData.heroHeadlineLine3).trim() : db.profile.heroHeadlineLine3,
    heroQuote: updatedData.heroQuote !== undefined ? String(updatedData.heroQuote).trim() : db.profile.heroQuote,
    stats: Array.isArray(updatedData.stats) ? updatedData.stats : db.profile.stats,
    githubUrl: updatedData.githubUrl !== undefined ? String(updatedData.githubUrl).trim() : db.profile.githubUrl,
    linkedinUrl: updatedData.linkedinUrl !== undefined ? String(updatedData.linkedinUrl).trim() : db.profile.linkedinUrl,
    twitterUrl: updatedData.twitterUrl !== undefined ? String(updatedData.twitterUrl).trim() : db.profile.twitterUrl,
    resumeUrl: updatedData.resumeUrl !== undefined ? String(updatedData.resumeUrl).trim() : db.profile.resumeUrl,
    aboutQuote: updatedData.aboutQuote !== undefined ? String(updatedData.aboutQuote).trim() : db.profile.aboutQuote,
    aboutBio1: updatedData.aboutBio1 !== undefined ? String(updatedData.aboutBio1).trim() : db.profile.aboutBio1,
    aboutBio2: updatedData.aboutBio2 !== undefined ? String(updatedData.aboutBio2).trim() : db.profile.aboutBio2,
    competencies: Array.isArray(updatedData.competencies) ? updatedData.competencies : db.profile.competencies,
    skills: Array.isArray(updatedData.skills) ? updatedData.skills : db.profile.skills,
    experience: Array.isArray(updatedData.experience) ? updatedData.experience : db.profile.experience,
    education: Array.isArray(updatedData.education) ? updatedData.education : db.profile.education,
    contactHeading: updatedData.contactHeading !== undefined ? String(updatedData.contactHeading).trim() : db.profile.contactHeading,
    contactSubheading: updatedData.contactSubheading !== undefined ? String(updatedData.contactSubheading).trim() : db.profile.contactSubheading,
    responseSla: updatedData.responseSla !== undefined ? String(updatedData.responseSla).trim() : db.profile.responseSla,
  };

  saveDb(db);
  res.json({ success: true, profile: db.profile });
});

// POST /api/profile/reset - Protected endpoint to reset profile to defaults
app.post("/api/profile/reset", requireAdminAuth, (_req, res) => {
  db.profile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  saveDb(db);
  res.json({ success: true, profile: db.profile, message: "Profile reset to default successfully" });
});

// POST /api/contact - Public contact form submission
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    name: String(name).trim(),
    email: String(email).trim(),
    subject: subject ? String(subject).trim() : "Portfolio Contact Inquiry",
    message: String(message).trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  db.messages.unshift(newMessage);
  saveDb(db);

  res.status(201).json({
    success: true,
    message: "Thank you! Your message has been received and I will be in touch shortly.",
  });
});

// GET /api/contact - Get contact messages (Protected)
app.get("/api/contact", requireAdminAuth, (_req, res) => {
  res.json(db.messages || []);
});

// DELETE /api/contact/:id - Delete contact message (Protected)
app.delete("/api/contact/:id", requireAdminAuth, (req, res) => {
  db.messages = db.messages.filter((m) => m.id !== req.params.id);
  saveDb(db);
  res.json({ success: true });
});

/* =========================================================================
   VITE MIDDLEWARE OR STATIC SERVING
   ========================================================================= */

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server running on http://localhost:${PORT}`);
  });
}

startServer();
