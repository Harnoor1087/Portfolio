import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FolderGit2, Sparkles, Filter, RefreshCw, PlusCircle, ExternalLink, Github, X, Check } from 'lucide-react';
import { Project } from '../types';
import { api } from '../services/api';
import { ProjectCard } from './ProjectCard';

interface ProjectsProps {
  onNavigateToAdmin?: () => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onNavigateToAdmin }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [seeding, setSeeding] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProjects();
      setProjects(data);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Unable to load projects from server database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSeedProjects = async () => {
    try {
      setSeeding(true);
      const data = await api.seedProjects(true);
      setProjects(data);
    } catch (err: any) {
      console.error('Error seeding projects:', err);
      setError(err.message || 'Failed to seed sample projects.');
    } finally {
      setSeeding(false);
    }
  };

  const categories = ['All', 'Featured', 'Full-Stack', 'AI & Data', 'Backend & Cloud', 'Frontend'];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      activeCategory === 'All'
        ? true
        : activeCategory === 'Featured'
        ? p.featured
        : p.category === activeCategory;

    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="projects" className="py-20 sm:py-28 border-b border-white/5 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#F27D26] font-mono mb-2">
              (04) // DYNAMIC ARCHIVE & WORK
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Featured Projects <span className="text-[#F27D26] font-mono text-xl sm:text-2xl ml-2">({projects.length.toString().padStart(2, '0')})</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-xl font-mono">
              Systems and applications pulled dynamically from the database.
            </p>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="projects-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tech or title..."
                className="w-full sm:w-64 pl-9 pr-4 py-2 text-xs bg-white/5 border border-white/10 rounded text-white placeholder-white/40 focus:outline-none focus:border-[#F27D26] font-mono transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              id="projects-refresh-btn"
              onClick={fetchProjects}
              disabled={loading}
              className="p-2.5 rounded bg-white/5 border border-white/10 text-white/50 hover:text-[#F27D26] hover:border-[#F27D26]/40 transition-colors flex items-center justify-center cursor-pointer"
              title="Refresh projects from database"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F27D26]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`projects-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#F27D26] text-black font-bold shadow-sm'
                  : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat === 'Featured' && <Sparkles className="w-3 h-3 inline mr-1 text-black" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && projects.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded bg-[#080808] border border-white/5 animate-pulse flex flex-col p-6 space-y-4">
                <div className="aspect-video bg-white/5 rounded" />
                <div className="h-6 w-3/4 bg-white/5 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-2/3 bg-white/5 rounded" />
                <div className="mt-auto pt-4 flex gap-2">
                  <div className="h-8 flex-1 bg-white/5 rounded" />
                  <div className="h-8 w-20 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded bg-[#080808] border border-rose-500/30 text-center max-w-lg mx-auto">
            <p className="text-xs font-mono text-rose-400 mb-3">{error}</p>
            <button
              id="projects-retry-btn"
              onClick={fetchProjects}
              className="px-4 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold uppercase tracking-wider"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State (Required by prompt: "Include a clean empty-state if no projects exist") */}
        {!loading && projects.length === 0 && !error && (
          <div
            id="projects-empty-state"
            className="p-12 sm:p-16 rounded bg-[#080808] border border-dashed border-white/10 text-center max-w-2xl mx-auto"
          >
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 text-[#F27D26]">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Projects in Database Yet</h3>
            <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto mb-6 font-mono leading-relaxed">
              The portfolio database is currently clean and ready for records. You can seed it with sample showcase items or log into the Admin panel to add your own.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                id="empty-state-seed-btn"
                onClick={handleSeedProjects}
                disabled={seeding}
                className="px-5 py-2.5 rounded bg-[#F27D26] hover:bg-[#d86815] text-black text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
                <span>{seeding ? 'Seeding Database...' : 'Seed Showcase Projects'}</span>
              </button>

              {onNavigateToAdmin && (
                <button
                  id="empty-state-admin-btn"
                  onClick={onNavigateToAdmin}
                  className="px-5 py-2.5 rounded bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span>Add via Admin Dashboard</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filtered Out State */}
        {!loading && projects.length > 0 && filteredProjects.length === 0 && (
          <div className="p-10 rounded bg-[#080808] border border-white/5 text-center max-w-md mx-auto">
            <Filter className="w-8 h-8 text-white/30 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Matching Projects Found</h3>
            <p className="text-xs font-mono text-white/40 mb-4">
              Try adjusting your category filter or clearing your search term "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onSelectProject={(p) => setSelectedProject(p)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#080808] border border-white/10 rounded overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/80 text-white/60 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-video w-full bg-black overflow-hidden relative shrink-0 border-b border-white/5">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-90" />
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-white/5 text-[#F27D26] border border-white/10">
                      {selectedProject.category}
                    </span>
                    {selectedProject.featured && (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest bg-[#F27D26] text-black font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {selectedProject.title}
                  </h3>
                  <p className="text-xs font-mono text-[#F27D26] mt-1">
                    {selectedProject.tagline}
                  </p>
                </div>

                <div className="text-sm text-white/70 leading-relaxed font-light space-y-2">
                  <p>{selectedProject.description}</p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#F27D26] mb-3">
                    Technologies & Architecture
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded text-xs font-mono bg-white/5 text-white/70 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-4 rounded bg-[#F27D26] hover:bg-[#d86815] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Launch Live Demo</span>
                      <ExternalLink className="w-4 h-4 text-black" />
                    </a>
                  )}
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Source Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
