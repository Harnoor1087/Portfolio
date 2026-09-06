import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, Sparkles, Code2, Layers } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelectProject?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => {
  const [imgError, setImgError] = useState(false);

  // Fallback banner placeholder if image fails
  const fallbackImg = `https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      id={`project-card-${project.id}`}
      className="group relative flex flex-col rounded bg-[#080808] border border-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden shadow-xl"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/60 border-b border-white/5">
        <img
          src={imgError ? fallbackImg : project.imageUrl || fallbackImg}
          alt={project.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80" />

        {/* Featured Tag */}
        {project.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#F27D26] text-black text-[10px] font-mono font-bold tracking-widest uppercase shadow-md">
            <Sparkles className="w-3 h-3 text-black" />
            <span>Featured</span>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-sm bg-black/80 backdrop-blur-md text-white/90 text-[10px] font-mono uppercase tracking-widest border border-white/10">
          {project.category}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3 className="text-xl font-bold text-white group-hover:text-[#F27D26] transition-colors tracking-tight">
              {project.title}
            </h3>
            <div className="w-6 h-6 border border-white/20 rounded-full flex items-center justify-center text-xs text-white/60 group-hover:border-[#F27D26] group-hover:text-[#F27D26] transition-colors shrink-0">
              ↗
            </div>
          </div>

          <p className="text-xs font-mono text-[#F27D26] mb-3 line-clamp-1">
            {project.tagline || project.category}
          </p>

          <p className="text-sm text-white/70 leading-relaxed line-clamp-3 mb-5 font-light">
            {project.description}
          </p>
        </div>

        <div>
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-white/70 border border-white/10"
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 5 && (
              <span className="px-1.5 py-0.5 rounded text-[11px] font-mono text-white/40 bg-white/5 border border-white/5">
                +{project.techStack.length - 5}
              </span>
            )}
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-2 pt-4 border-t border-white/5">
            {project.liveUrl && (
              <a
                id={`project-live-btn-${project.id}`}
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded bg-[#F27D26] hover:bg-[#d86815] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5 text-black" />
              </a>
            )}

            {project.githubUrl && (
              <a
                id={`project-github-btn-${project.id}`}
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                title="View Source Code"
              >
                <Github className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Source</span>
              </a>
            )}

            {onSelectProject && (
              <button
                id={`project-details-btn-${project.id}`}
                onClick={() => onSelectProject(project)}
                className="p-2 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="View Full Architecture Details"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};
