import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Github, Linkedin, Twitter, Mail, FileText, Code2, Cpu, Globe, Database, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { DEFAULT_PROFILE } from '../data/initialData';

interface HeroProps {
  profile?: UserProfile;
  onExploreProjects: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ profile = DEFAULT_PROFILE, onExploreProjects, onContactClick }) => {
  const p = profile || DEFAULT_PROFILE;
  const stats = p.stats && p.stats.length > 0 ? p.stats : DEFAULT_PROFILE.stats;

  return (
    <section
      id="hero-section"
      className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden border-b border-white/5 bg-[#050505]"
    >
      {/* Subtle Background Warm Glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#F27D26]/5 blur-3xl pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="max-w-4xl">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase tracking-widest text-[#F27D26] font-mono mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] animate-pulse"></span>
            <span>{p.availabilityStatus || 'Available for Contracts & Engineering 2026'}</span>
          </motion.div>

          {/* Headline & Name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="text-xs uppercase tracking-[0.25em] font-mono text-white/40 mb-3">
              {p.name} / Portfolio
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-white">
              {p.heroHeadlineLine1 || 'STAFF'} <br />
              <span className="text-white/40">{p.heroHeadlineLine2 || 'SYSTEMS'}</span> <br />
              {p.heroHeadlineLine3 || 'ENGINEER'}<span className="text-[#F27D26]">.</span>
            </h1>
          </motion.div>

          {/* Editorial Serif Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-serif italic text-xl sm:text-2xl text-white/70 max-w-2xl font-light leading-relaxed mb-10"
          >
            {p.heroQuote || DEFAULT_PROFILE.heroQuote}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 mb-14"
          >
            <button
              id="hero-cta-projects"
              onClick={onExploreProjects}
              className="bg-[#F27D26] text-black px-6 py-3 font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer rounded"
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-cta-contact"
              onClick={onContactClick}
              className="border border-white/20 px-6 py-3 font-bold uppercase tracking-widest text-xs text-white hover:bg-white hover:text-black transition-all flex items-center gap-2 cursor-pointer rounded"
            >
              <Mail className="w-4 h-4" />
              <span>Get In Touch</span>
            </button>

            {p.resumeUrl && (
              <a
                id="hero-cta-resume"
                href={p.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 px-5 py-3 font-mono text-xs uppercase tracking-wider text-white/70 hover:text-white hover:border-white/30 transition-colors flex items-center gap-2 rounded bg-white/5"
              >
                <FileText className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>Resume / CV</span>
              </a>
            )}

            <div className="flex items-center gap-2 ml-auto sm:ml-2">
              {p.githubUrl && (
                <a
                  id="hero-cta-github"
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded border border-white/10 text-white/40 hover:text-[#F27D26] hover:border-[#F27D26]/40 transition-colors bg-white/5"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}

              {p.linkedinUrl && (
                <a
                  id="hero-cta-linkedin"
                  href={p.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded border border-white/10 text-white/40 hover:text-[#F27D26] hover:border-[#F27D26]/40 transition-colors bg-white/5"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}

              {p.twitterUrl && (
                <a
                  id="hero-cta-twitter"
                  href={p.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded border border-white/10 text-white/40 hover:text-[#F27D26] hover:border-[#F27D26]/40 transition-colors bg-white/5"
                  aria-label="Twitter Profile"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Live Metric Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/5"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 bg-[#080808] border border-white/5 rounded">
                <div className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${idx % 2 === 1 ? 'text-[#F27D26]' : 'text-white'}`}>
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
