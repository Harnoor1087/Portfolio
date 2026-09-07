import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle2, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { DEFAULT_PROFILE, TIMELINE_EXPERIENCE, TIMELINE_EDUCATION, SKILL_CATEGORIES } from '../data/initialData';

interface AboutProps {
  profile?: UserProfile;
}

export const About: React.FC<AboutProps> = ({ profile = DEFAULT_PROFILE }) => {
  const [timelineTab, setTimelineTab] = useState<'all' | 'experience' | 'education'>('all');
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('All');

  const p = profile || DEFAULT_PROFILE;
  const experienceList = p.experience && p.experience.length > 0 ? p.experience : TIMELINE_EXPERIENCE;
  const educationList = p.education && p.education.length > 0 ? p.education : TIMELINE_EDUCATION;
  const skillsList = p.skills && p.skills.length > 0 ? p.skills : SKILL_CATEGORIES;
  const competencies = p.competencies && p.competencies.length > 0 ? p.competencies : DEFAULT_PROFILE.competencies;

  const allTimeline = [
    ...experienceList,
    ...educationList,
  ];

  const filteredTimeline = timelineTab === 'all'
    ? allTimeline
    : timelineTab === 'experience'
    ? experienceList
    : educationList;

  return (
    <section id="about" className="py-20 sm:py-28 border-b border-white/5 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        {/* Section Header */}
        <div className="mb-14 sm:mb-18">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#F27D26] font-mono mb-2">
            (01) // PROFILE & ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Architecting systems with precision, craft & human-centered UX<span className="text-[#F27D26]">.</span>
          </h2>
        </div>

        {/* Bio & Philosophy Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-start">
          <div className="lg:col-span-7 space-y-6 text-white/80 text-base sm:text-lg leading-relaxed">
            <p className="font-serif italic text-xl sm:text-2xl text-white/90 leading-relaxed font-light">
              "{p.aboutQuote || DEFAULT_PROFILE.aboutQuote}"
            </p>
            <p className="text-white/70 text-base leading-relaxed">
              {p.aboutBio1 || DEFAULT_PROFILE.aboutBio1}
            </p>
            <p className="text-white/70 text-base leading-relaxed">
              {p.aboutBio2 || DEFAULT_PROFILE.aboutBio2}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-wider text-white/50">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>{p.location || 'San Francisco, CA & Remote'}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F27D26]" />
                <span>{p.availabilityStatus || 'Open to Staff / Lead / Senior Roles'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#080808] border border-white/10 rounded p-6 sm:p-7 shadow-xl">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-[0.2em] text-[#F27D26] mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F27D26]" />
              Core Competencies & Focus
            </h3>
            <ul className="space-y-4 text-sm text-white/80">
              {competencies.map((comp, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26] mt-2 shrink-0" />
                  <span>
                    <strong className="text-white">{comp.title}:</strong> {comp.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Skills Section */}
        <div id="skills" className="mb-24 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#F27D26] font-mono mb-1">
                (02) // TOOLING & PROFICIENCY
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                Technical Skills & Tooling
              </h3>
              <p className="text-xs sm:text-sm text-white/50 mt-1 font-mono">
                Technologies and frameworks leveraged in production environments.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-white/5 border border-white/10 rounded">
              {['All', ...skillsList.map(c => c.name)].map((cat) => (
                <button
                  key={cat}
                  id={`skill-filter-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setActiveSkillCategory(cat)}
                  className={`px-3 py-1.5 rounded text-[11px] uppercase tracking-wider font-medium transition-all cursor-pointer ${
                    activeSkillCategory === cat
                      ? 'bg-[#F27D26] text-black font-bold shadow-sm'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {skillsList
              .filter(cat => activeSkillCategory === 'All' || cat.name === activeSkillCategory)
              .map((group) => (
                <div
                  key={group.name}
                  className="p-5 rounded bg-[#080808] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#F27D26] mb-4">
                      {group.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-white/5 text-white/80 border border-white/10 hover:border-[#F27D26]/40 hover:text-[#F27D26] transition-colors"
                        >
                          <span>{skill.name}</span>
                          {skill.level === 'Expert' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F27D26]" title="Expert Proficiency" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Experience & Education Timeline */}
        <div id="timeline" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#F27D26] font-mono mb-1">
                (03) // CAREER CHRONOLOGY
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                Experience & Academic Timeline
              </h3>
              <p className="text-xs sm:text-sm text-white/50 mt-1 font-mono">
                Chronological track record of impact, architectural roles, and degrees.
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="inline-flex p-1 rounded bg-white/5 border border-white/10">
              <button
                id="timeline-filter-all"
                onClick={() => setTimelineTab('all')}
                className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                  timelineTab === 'all'
                    ? 'bg-[#F27D26] text-black shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                id="timeline-filter-experience"
                onClick={() => setTimelineTab('experience')}
                className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  timelineTab === 'experience'
                    ? 'bg-[#F27D26] text-black shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                Experience
              </button>
              <button
                id="timeline-filter-education"
                onClick={() => setTimelineTab('education')}
                className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  timelineTab === 'education'
                    ? 'bg-[#F27D26] text-black shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Education
              </button>
            </div>
          </div>

          {/* Timeline List */}
          <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-10 sm:space-y-12">
            {filteredTimeline.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="relative group"
              >
                {/* Node Icon on Timeline Line */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border bg-[#050505] border-[#F27D26] text-[#F27D26] shadow-sm">
                  {item.type === 'experience' ? (
                    <Briefcase className="w-3.5 h-3.5" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5" />
                  )}
                </div>

                {/* Content Box */}
                <div className="p-6 rounded bg-[#080808] border border-white/5 hover:border-white/15 transition-all shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      {item.title}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded bg-white/5 text-[#F27D26] border border-white/10 self-start sm:self-auto">
                      <Calendar className="w-3 h-3 text-[#F27D26]" />
                      {item.period}
                    </span>
                  </div>

                  <div className="text-xs font-mono uppercase tracking-[0.15em] text-white/50 mb-4 flex items-center gap-2">
                    <span>{item.organization}</span>
                    <span className="text-white/20">•</span>
                    <span>{item.location}</span>
                  </div>

                  <ul className="space-y-2 mb-4">
                    {item.description.map((bullet, idx) => (
                      <li key={idx} className="text-sm text-white/70 leading-relaxed flex items-start gap-2.5">
                        <ChevronRight className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {item.skills && item.skills.length > 0 && (
                    <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/5 text-white/60 border border-white/5"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
