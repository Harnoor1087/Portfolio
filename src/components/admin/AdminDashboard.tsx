import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  LogOut,
  RefreshCw,
  Search,
  LayoutGrid,
  Table as TableIcon,
  MessageSquare,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Eye,
  Calendar,
  X,
} from 'lucide-react';
import { Project, ProjectInput, ContactMessage } from '../../types';
import { api } from '../../services/api';
import { ProjectModal } from './ProjectModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface AdminDashboardProps {
  onLogout: () => void;
  onReturnToPortfolio: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onReturnToPortfolio }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'messages'>('projects');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string; type: 'project' | 'message' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Message inspection modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [projData, msgData] = await Promise.all([
        api.getProjects(),
        api.getMessages().catch(() => []),
      ]);
      setProjects(projData);
      setMessages(msgData);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      showNotification(err.message || 'Error fetching data from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProject = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (id: string, title: string, type: 'project' | 'message') => {
    setItemToDelete({ id, title, type });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true);
      if (itemToDelete.type === 'project') {
        await api.deleteProject(itemToDelete.id);
        setProjects(projects.filter((p) => p.id !== itemToDelete.id));
        showNotification(`Project "${itemToDelete.title}" deleted.`);
      } else {
        await api.deleteMessage(itemToDelete.id);
        setMessages(messages.filter((m) => m.id !== itemToDelete.id));
        showNotification('Contact dispatch record deleted.');
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete record.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveProject = async (data: ProjectInput) => {
    try {
      setIsSaving(true);
      if (projectToEdit) {
        const updated = await api.updateProject(projectToEdit.id, data);
        setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
        showNotification(`Project "${updated.title}" updated successfully.`);
      } else {
        const created = await api.createProject(data);
        setProjects([created, ...projects]);
        showNotification(`New project "${created.title}" published.`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSeedProjects = async () => {
    try {
      setLoading(true);
      const data = await api.seedProjects(true);
      setProjects(data);
      showNotification('Portfolio database successfully seeded with demo projects.');
    } catch (err: any) {
      showNotification(err.message || 'Failed to seed demo projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="admin-management-panel" className="min-h-screen bg-[#050505] pt-20 pb-16 text-[#E0E0E0]">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded shadow-2xl flex items-center gap-2.5 text-xs font-mono border ${
            notification.type === 'success'
              ? 'bg-[#080808] text-white border-[#F27D26]'
              : 'bg-rose-950/90 text-rose-200 border-rose-500'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#F27D26]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-white/10 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-white/5 border border-white/10 text-[#F27D26] flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Admin Management Dashboard</h1>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/30">
                  Live Session
                </span>
              </div>
              <p className="text-xs font-mono text-white/50">Direct write access to full-stack portfolio database records</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="admin-view-portfolio-btn"
              onClick={onReturnToPortfolio}
              className="px-3.5 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>Public View</span>
            </button>

            <button
              id="admin-seed-btn"
              onClick={handleSeedProjects}
              disabled={loading}
              className="px-3.5 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset to default showcase projects"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F27D26]' : 'text-[#F27D26]'}`} />
              <span>Reset / Seed</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="px-3.5 py-2 rounded bg-white/5 hover:bg-rose-950/60 border border-white/10 hover:border-rose-800 text-white/50 hover:text-rose-300 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded bg-[#080808] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">Total Projects</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">{projects.length}</div>
            <div className="text-[10px] font-mono text-white/30 mt-0.5">Active in database</div>
          </div>

          <div className="p-5 rounded bg-[#080808] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">Featured Projects</div>
            <div className="text-2xl font-bold font-mono text-[#F27D26] mt-1">
              {projects.filter((p) => p.featured).length}
            </div>
            <div className="text-[10px] font-mono text-white/30 mt-0.5">Highlighted on landing</div>
          </div>

          <div className="p-5 rounded bg-[#080808] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">Categories</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {new Set(projects.map((p) => p.category)).size}
            </div>
            <div className="text-[10px] font-mono text-white/30 mt-0.5">Engineering domains</div>
          </div>

          <div className="p-5 rounded bg-[#080808] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">Contact Inquiries</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">{messages.length}</div>
            <div className="text-[10px] font-mono text-white/30 mt-0.5">Dispatches received</div>
          </div>
        </div>

        {/* Tab & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="inline-flex p-1 bg-[#080808] border border-white/10 rounded">
              <button
                id="admin-tab-projects"
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 rounded text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-[#F27D26] text-black shadow-md'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Projects ({projects.length})</span>
              </button>

              <button
                id="admin-tab-messages"
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 rounded text-xs font-mono uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'messages'
                    ? 'bg-[#F27D26] text-black shadow-md'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Dispatches ({messages.length})</span>
              </button>
            </div>

            {activeTab === 'projects' && (
              <div className="hidden sm:inline-flex p-1 bg-[#080808] border border-white/10 rounded">
                <button
                  id="admin-view-table-btn"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded text-white/50 hover:text-white transition-colors cursor-pointer ${
                    viewMode === 'table' ? 'bg-white/10 text-white' : ''
                  }`}
                  title="Table View"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  id="admin-view-cards-btn"
                  onClick={() => setViewMode('cards')}
                  className={`p-1.5 rounded text-white/50 hover:text-white transition-colors cursor-pointer ${
                    viewMode === 'cards' ? 'bg-white/10 text-white' : ''
                  }`}
                  title="Cards View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'projects' && (
              <>
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full pl-9 pr-4 py-2 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-[#F27D26]"
                  />
                </div>

                <button
                  id="admin-add-project-btn"
                  onClick={handleCreateProject}
                  className="px-4 py-2.5 rounded font-mono text-xs uppercase tracking-widest font-bold text-black bg-[#F27D26] hover:bg-[#d86815] flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Add Project</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* PROJECTS TAB CONTENT */}
        {activeTab === 'projects' && (
          <div>
            {loading ? (
              <div className="p-12 text-center text-zinc-500 text-sm">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-violet-400" />
                Loading records from server...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="p-12 rounded bg-[#080808] border border-dashed border-white/10 text-center">
                <Layers className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Projects Found</h3>
                <p className="text-xs font-mono text-white/50 mb-4">
                  {projects.length === 0
                    ? 'Your database currently has no project records. Click below to add one or seed demo projects.'
                    : `No projects match "${searchQuery}".`}
                </p>
                {projects.length === 0 ? (
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleCreateProject}
                      className="px-4 py-2 rounded bg-[#F27D26] hover:bg-[#d86815] text-black font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Create First Project
                    </button>
                    <button
                      onClick={handleSeedProjects}
                      className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Seed Demo Projects
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            ) : viewMode === 'table' ? (
              /* TABLE VIEW */
              <div className="rounded border border-white/10 bg-[#080808] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm font-sans">
                    <thead className="bg-black/60 text-white/50 uppercase tracking-widest text-[10px] font-mono border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Project</th>
                        <th className="py-3.5 px-4 font-semibold">Category</th>
                        <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Tech Stack</th>
                        <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                        <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">Links</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProjects.map((project) => (
                        <tr
                          key={project.id}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          {/* Project thumbnail & title */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-12 h-9 rounded object-cover bg-black/60 shrink-0 border border-white/5"
                              />
                              <div>
                                <div className="font-bold text-white group-hover:text-[#F27D26] transition-colors">
                                  {project.title}
                                </div>
                                <div className="text-xs text-white/50 line-clamp-1 max-w-xs font-light">
                                  {project.tagline || project.description}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider bg-white/5 text-white/70 border border-white/10 whitespace-nowrap">
                              {project.category}
                            </span>
                          </td>

                          {/* Tech Stack */}
                          <td className="py-3.5 px-4 hidden md:table-cell">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {project.techStack.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white/60 border border-white/10"
                                >
                                  {t}
                                </span>
                              ))}
                              {project.techStack.length > 3 && (
                                <span className="text-[10px] font-mono text-white/40 self-center">
                                  +{project.techStack.length - 3}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Featured */}
                          <td className="py-3.5 px-4 text-center">
                            {project.featured ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/30">
                                <Sparkles className="w-3 h-3 text-[#F27D26]" />
                                <span>Featured</span>
                              </span>
                            ) : (
                              <span className="text-white/30 text-xs font-mono">Standard</span>
                            )}
                          </td>

                          {/* Links */}
                          <td className="py-3.5 px-4 hidden sm:table-cell">
                            <div className="flex items-center gap-2">
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-[#F27D26] transition-colors"
                                  title="View Live"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-[#F27D26] transition-colors"
                                  title="View GitHub"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Actions: Edit & Delete per row (strictly required by prompt) */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                id={`admin-edit-project-${project.id}`}
                                onClick={() => handleEditProject(project)}
                                className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-[#F27D26] transition-colors cursor-pointer"
                                title="Edit Project"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#F27D26]" />
                              </button>
                              <button
                                id={`admin-delete-project-${project.id}`}
                                onClick={() => handleDeletePrompt(project.id, project.title, 'project')}
                                className="p-1.5 rounded bg-white/5 hover:bg-rose-950/60 border border-white/10 hover:border-rose-800 text-white/50 hover:text-rose-300 transition-colors cursor-pointer"
                                title="Delete Project"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* CARD VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-5 rounded bg-[#080808] border border-white/5 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg"
                  >
                    <div>
                      <div className="aspect-video w-full rounded overflow-hidden bg-black/60 mb-3 relative border border-white/5">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        {project.featured && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#F27D26] text-black text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                            <Sparkles className="w-3 h-3 text-black" /> Featured
                          </div>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-white/80 text-[10px] font-mono uppercase tracking-wider border border-white/10">
                          {project.category}
                        </div>
                      </div>

                      <h3 className="font-bold text-white text-base mb-1">{project.title}</h3>
                      <p className="text-xs text-white/60 line-clamp-2 mb-3 font-light">{project.description}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.techStack.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white/60 border border-white/10"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-white/50 hover:text-[#F27D26] flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Live
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-white/50 hover:text-[#F27D26] flex items-center gap-1"
                          >
                            <Github className="w-3 h-3" /> Code
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-[#F27D26]" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(project.id, project.title, 'project')}
                          className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-rose-950/80 border border-white/10 hover:border-rose-800 text-rose-300 text-xs font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 text-rose-400" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MESSAGES TAB CONTENT */}
        {activeTab === 'messages' && (
          <div>
            {messages.length === 0 ? (
              <div className="p-12 rounded bg-[#080808] border border-dashed border-white/10 text-center">
                <MessageSquare className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Messages In Inbox</h3>
                <p className="text-xs font-mono text-white/50">
                  When prospective employers or collaborators submit the contact form on the public site, inquiries will appear here.
                </p>
              </div>
            ) : (
              <div className="rounded border border-white/10 bg-[#080808] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm font-sans">
                    <thead className="bg-black/60 text-white/50 uppercase tracking-widest text-[10px] font-mono border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Sender</th>
                        <th className="py-3.5 px-4 font-semibold">Subject</th>
                        <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Date</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {messages.map((msg) => (
                        <tr key={msg.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{msg.name}</div>
                            <div className="text-xs font-mono text-[#F27D26]">{msg.email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-white/90">{msg.subject}</div>
                            <div className="text-xs text-white/50 line-clamp-1 font-light">{msg.message}</div>
                          </td>
                          <td className="py-3.5 px-4 hidden md:table-cell text-white/40 text-xs font-mono">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedMessage(msg)}
                                className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono uppercase tracking-wider cursor-pointer"
                              >
                                Read
                              </button>
                              <button
                                onClick={() => handleDeletePrompt(msg.id, `message from ${msg.name}`, 'message')}
                                className="p-1.5 rounded bg-white/5 hover:bg-rose-950/60 border border-white/10 hover:border-rose-800 text-rose-400 cursor-pointer"
                                title="Delete Message"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Add / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        projectToEdit={projectToEdit}
        isSaving={isSaving}
        onClose={() => {
          setIsModalOpen(false);
          setProjectToEdit(null);
        }}
        onSave={handleSaveProject}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        itemTitle={itemToDelete?.title || ''}
        itemType={itemToDelete?.type}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />

      {/* Message Inspection Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#080808] border border-white/10 rounded p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#F27D26] mb-1">
              INCOMING DISPATCH
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{selectedMessage.subject}</h3>
            <div className="text-xs font-mono text-white/50 mb-4">
              From: <strong className="text-white">{selectedMessage.name}</strong> ({selectedMessage.email})
            </div>
            <div className="p-4 rounded bg-black/60 border border-white/10 text-sm text-white/80 whitespace-pre-wrap leading-relaxed mb-5 max-h-60 overflow-y-auto font-light">
              {selectedMessage.message}
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-white/40">
              <span>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="px-4 py-2 rounded bg-[#F27D26] hover:bg-[#d86815] text-black font-mono font-bold text-xs uppercase tracking-wider"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
