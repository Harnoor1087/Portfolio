import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Plus, Image as ImageIcon, Link as LinkIcon, Github, Tag, Layers, Check, Eye, EyeOff } from 'lucide-react';
import { Project, ProjectInput } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  projectToEdit: Project | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: ProjectInput) => Promise<void>;
}

const PRESET_IMAGES = [
  { label: 'Cloud & Telemetry', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Creative Studio', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Cybersecurity', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Terminal / CLI', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Modern UI Design', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop' },
  { label: 'Code Matrix', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop' },
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  projectToEdit,
  isSaving,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProjectInput>({
    title: '',
    tagline: '',
    description: '',
    category: 'Full-Stack',
    techStack: [],
    liveUrl: '',
    githubUrl: '',
    imageUrl: PRESET_IMAGES[0].url,
    featured: false,
    visible: true,
    order: 1,
  });

  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title,
        tagline: projectToEdit.tagline || '',
        description: projectToEdit.description,
        category: projectToEdit.category,
        techStack: projectToEdit.techStack || [],
        liveUrl: projectToEdit.liveUrl || '',
        githubUrl: projectToEdit.githubUrl || '',
        imageUrl: projectToEdit.imageUrl || PRESET_IMAGES[0].url,
        featured: Boolean(projectToEdit.featured),
        visible: projectToEdit.visible !== false,
        order: projectToEdit.order || 1,
      });
    } else {
      setFormData({
        title: '',
        tagline: '',
        description: '',
        category: 'Full-Stack',
        techStack: ['React', 'TypeScript', 'Tailwind CSS'],
        liveUrl: '',
        githubUrl: '',
        imageUrl: PRESET_IMAGES[0].url,
        featured: false,
        visible: true,
        order: 1,
      });
    }
    setTagInput('');
    setError(null);
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/,/g, '');
    if (trimmed && !formData.techStack.includes(trimmed)) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, trimmed],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      techStack: formData.techStack.filter((t) => t !== tagToRemove),
    });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Project title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Project description is required.');
      return;
    }
    if (formData.techStack.length === 0) {
      setError('Please provide at least one technology stack tag.');
      return;
    }

    try {
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save project. Please check server logs.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl bg-[#080808] border border-white/10 rounded p-6 sm:p-8 shadow-2xl relative my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-5 right-5 p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-[#F27D26] uppercase tracking-widest mb-1">
            <Layers className="w-4 h-4 text-[#F27D26]" />
            <span>Database Record</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {projectToEdit ? `Edit "${projectToEdit.title}"` : 'Add New Project'}
          </h2>
          <p className="text-xs sm:text-sm font-mono text-white/50">
            Provide the metadata, technology stack, URLs, and display flags for the portfolio.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs sm:text-sm font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Title & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="project-title" className="block text-xs font-mono text-white/70 mb-1.5">
                Project Title *
              </label>
              <input
                id="project-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. PulseStream Analytics"
                className="w-full px-3.5 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="project-category" className="block text-xs font-mono text-white/70 mb-1.5">
                Category *
              </label>
              <select
                id="project-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
              >
                <option value="Full-Stack">Full-Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend & Cloud">Backend & Cloud</option>
                <option value="AI & Data">AI & Data</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="project-tagline" className="block text-xs font-mono text-white/70 mb-1.5">
              Short Punchy Tagline
            </label>
            <input
              id="project-tagline"
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. High-throughput real-time event streaming platform"
              className="w-full px-3.5 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="project-description" className="block text-xs font-mono text-white/70 mb-1.5">
              Detailed Description *
            </label>
            <textarea
              id="project-description"
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the architectural challenges, scale, and solution..."
              className="w-full px-3.5 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors resize-y"
            />
          </div>

          {/* Tech Stack Tags */}
          <div>
            <label htmlFor="project-tech-input" className="block text-xs font-mono text-white/70 mb-1.5">
              Tech Stack Tags * (Press Enter or comma to add)
            </label>
            <div className="flex gap-2 mb-2.5">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="project-tech-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="e.g. React 19, Kafka, PostgreSQL..."
                  className="w-full pl-10 pr-4 py-2 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>Add Tag</span>
              </button>
            </div>

            {/* Rendered Chips */}
            <div className="flex flex-wrap gap-1.5 p-3 rounded bg-black/40 border border-white/10 min-h-12 items-center">
              {formData.techStack.length === 0 ? (
                <span className="text-xs text-white/40 font-mono italic">No tags added yet. Type a technology and click "Add Tag".</span>
              ) : (
                formData.techStack.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-white/5 text-white/80 border border-white/10"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-white/40 hover:text-rose-400 transition-colors"
                      title="Remove tag"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="project-live-url" className="block text-xs font-mono text-white/70 mb-1.5">
                Live URL
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="project-live-url"
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="project-github-url" className="block text-xs font-mono text-white/70 mb-1.5">
                GitHub Repository URL
              </label>
              <div className="relative">
                <Github className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="project-github-url"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/alexrivera/project"
                  className="w-full pl-10 pr-4 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Image URL & Presets */}
          <div>
            <label htmlFor="project-image-url" className="block text-xs font-mono text-white/70 mb-1.5">
              Project Image URL or Curated Preset
            </label>
            <div className="relative mb-2.5">
              <ImageIcon className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="project-image-url"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
              />
            </div>

            {/* Presets picker */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                  className={`group relative aspect-video rounded overflow-hidden border transition-all cursor-pointer ${
                    formData.imageUrl === preset.url
                      ? 'border-[#F27D26] ring-2 ring-[#F27D26]/50'
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-1 text-[10px] font-mono text-white text-center leading-tight">
                    {preset.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Visibility, Featured & Order */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    id="project-visible-toggle"
                    type="checkbox"
                    checked={formData.visible !== false}
                    onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-black/60 text-emerald-500 focus:ring-emerald-500 cursor-pointer accent-emerald-500"
                  />
                  <span className="text-xs font-mono text-white flex items-center gap-1.5 uppercase tracking-wider">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Visible on Portfolio</span>
                    <span className="text-[10px] text-white/40 normal-case font-sans">
                      (uncheck to save as private draft)
                    </span>
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    id="project-featured-toggle"
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 bg-black/60 text-[#F27D26] focus:ring-[#F27D26] cursor-pointer accent-[#F27D26]"
                  />
                  <span className="text-xs font-mono text-white flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#F27D26]" />
                    <span>Featured Spotlight</span>
                    <span className="text-[10px] text-white/40 normal-case font-sans">
                      (highlighted top placement)
                    </span>
                  </span>
                </label>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <label htmlFor="project-order" className="text-xs font-mono text-white/50">
                  Display Order:
                </label>
                <input
                  id="project-order"
                  type="number"
                  min={1}
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 1 })}
                  className="w-20 px-3 py-1.5 rounded bg-black/60 border border-white/10 text-white text-center text-xs font-mono focus:outline-none focus:border-[#F27D26]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              id="project-modal-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="py-2.5 px-5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="project-modal-submit-btn"
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded bg-[#F27D26] hover:bg-[#d86815] disabled:opacity-50 text-black font-mono font-bold text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Database...' : projectToEdit ? 'Update Project' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
