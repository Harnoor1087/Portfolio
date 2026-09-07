import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Layers,
  Link,
  ChevronDown,
  ChevronUp,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, HeroStat, CompetencyItem, TimelineItem, SkillCategory, SkillItem } from '../../types';
import { api } from '../../services/api';
import { DEFAULT_PROFILE } from '../../data/initialData';

interface ProfileEditorProps {
  onProfileUpdated?: (updated: UserProfile) => void;
  onReturnToPortfolio?: () => void;
  showNotification: (text: string, type?: 'success' | 'error') => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  onProfileUpdated,
  onReturnToPortfolio,
  showNotification,
}) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'hero' | 'about' | 'skills' | 'timeline' | 'contact'>('general');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getProfile();
      setProfile(data);
      setIsDirty(false);
    } catch (err: any) {
      console.error('Failed to load profile:', err);
      showNotification('Failed to load profile from database. Using default fallback.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await api.updateProfile(profile);
      setProfile(updated);
      setIsDirty(false);
      if (onProfileUpdated) onProfileUpdated(updated);
      showNotification('Portfolio profile information saved successfully!');
    } catch (err: any) {
      console.error('Save error:', err);
      showNotification(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all profile and bio fields to their original default values? This cannot be undone.')) {
      return;
    }
    try {
      setSaving(true);
      const resetData = await api.resetProfile();
      setProfile(resetData);
      setIsDirty(false);
      if (onProfileUpdated) onProfileUpdated(resetData);
      showNotification('Profile has been restored to default values.');
    } catch (err: any) {
      showNotification(err.message || 'Failed to reset profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Stat item handlers
  const handleStatChange = (index: number, field: keyof HeroStat, val: string) => {
    const updatedStats = [...(profile.stats || [])];
    updatedStats[index] = { ...updatedStats[index], [field]: val };
    handleFieldChange('stats', updatedStats);
  };

  const handleAddStat = () => {
    const updatedStats = [...(profile.stats || []), { value: '100+', label: 'New Metric' }];
    handleFieldChange('stats', updatedStats);
  };

  const handleRemoveStat = (index: number) => {
    const updatedStats = (profile.stats || []).filter((_, i) => i !== index);
    handleFieldChange('stats', updatedStats);
  };

  // Competency handlers
  const handleCompetencyChange = (index: number, field: keyof CompetencyItem, val: string) => {
    const updated = [...(profile.competencies || [])];
    updated[index] = { ...updated[index], [field]: val };
    handleFieldChange('competencies', updated);
  };

  const handleAddCompetency = () => {
    const updated = [
      ...(profile.competencies || []),
      { title: 'New Focus Area', description: 'Describe your expertise in this domain...' },
    ];
    handleFieldChange('competencies', updated);
  };

  const handleRemoveCompetency = (index: number) => {
    const updated = (profile.competencies || []).filter((_, i) => i !== index);
    handleFieldChange('competencies', updated);
  };

  // Skill category & item handlers
  const handleAddSkillCategory = () => {
    const updated = [
      ...(profile.skills || []),
      {
        name: 'New Category',
        skills: [{ name: 'Skill Name', level: 'Advanced' as const }],
      },
    ];
    handleFieldChange('skills', updated);
  };

  const handleRemoveSkillCategory = (catIndex: number) => {
    const updated = (profile.skills || []).filter((_, i) => i !== catIndex);
    handleFieldChange('skills', updated);
  };

  const handleCategoryNameChange = (catIndex: number, newName: string) => {
    const updated = [...(profile.skills || [])];
    updated[catIndex] = { ...updated[catIndex], name: newName };
    handleFieldChange('skills', updated);
  };

  const handleAddSkillToCategory = (catIndex: number) => {
    const updated = [...(profile.skills || [])];
    const cat = updated[catIndex];
    cat.skills = [...cat.skills, { name: 'New Skill', level: 'Proficient' }];
    handleFieldChange('skills', updated);
  };

  const handleRemoveSkillFromCategory = (catIndex: number, skillIndex: number) => {
    const updated = [...(profile.skills || [])];
    updated[catIndex].skills = updated[catIndex].skills.filter((_, i) => i !== skillIndex);
    handleFieldChange('skills', updated);
  };

  const handleSkillItemChange = (
    catIndex: number,
    skillIndex: number,
    field: keyof SkillItem,
    value: any
  ) => {
    const updated = [...(profile.skills || [])];
    updated[catIndex].skills[skillIndex] = {
      ...updated[catIndex].skills[skillIndex],
      [field]: value,
    };
    handleFieldChange('skills', updated);
  };

  // Timeline handlers (experience / education)
  const handleTimelineChange = (
    listType: 'experience' | 'education',
    index: number,
    field: keyof TimelineItem,
    value: any
  ) => {
    const list = [...(profile[listType] || [])];
    list[index] = { ...list[index], [field]: value };
    handleFieldChange(listType, list);
  };

  const handleAddTimelineItem = (listType: 'experience' | 'education') => {
    const newItem: TimelineItem = {
      id: `${listType}-${Date.now()}`,
      title: listType === 'experience' ? 'Senior Engineer' : 'Degree or Certification',
      organization: listType === 'experience' ? 'Tech Corp' : 'University Name',
      location: 'San Francisco, CA',
      period: '2024 - Present',
      description: ['Led system architecture and cross-functional teams.'],
      skills: ['TypeScript', 'Cloud'],
      type: listType,
    };
    const list = [newItem, ...(profile[listType] || [])];
    handleFieldChange(listType, list);
  };

  const handleRemoveTimelineItem = (listType: 'experience' | 'education', index: number) => {
    const list = (profile[listType] || []).filter((_, i) => i !== index);
    handleFieldChange(listType, list);
  };

  const handleTimelineBulletChange = (
    listType: 'experience' | 'education',
    itemIndex: number,
    bulletIndex: number,
    text: string
  ) => {
    const list = [...(profile[listType] || [])];
    const desc = [...list[itemIndex].description];
    desc[bulletIndex] = text;
    list[itemIndex].description = desc;
    handleFieldChange(listType, list);
  };

  const handleAddTimelineBullet = (listType: 'experience' | 'education', itemIndex: number) => {
    const list = [...(profile[listType] || [])];
    list[itemIndex].description = [...list[itemIndex].description, 'New accomplishment highlight...'];
    handleFieldChange(listType, list);
  };

  const handleRemoveTimelineBullet = (
    listType: 'experience' | 'education',
    itemIndex: number,
    bulletIndex: number
  ) => {
    const list = [...(profile[listType] || [])];
    list[itemIndex].description = list[itemIndex].description.filter((_, i) => i !== bulletIndex);
    handleFieldChange(listType, list);
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="w-8 h-8 border-2 border-[#F27D26] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-white/60 font-mono text-sm">Retrieving profile settings from server database...</p>
      </div>
    );
  }

  return (
    <div id="profile-editor" className="space-y-8">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded bg-[#080808] border border-white/10 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">Portfolio Bio & Content Editor</h2>
            {isDirty && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 font-mono mt-0.5">
            Every text, metric, timeline item, and skill here updates live on the public portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onReturnToPortfolio && (
            <button
              id="profile-view-live-btn"
              onClick={onReturnToPortfolio}
              className="px-3 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>Preview Live</span>
            </button>
          )}

          <button
            id="profile-reset-btn"
            onClick={handleReset}
            disabled={saving}
            className="px-3 py-2 rounded bg-white/5 hover:bg-rose-950/40 border border-white/10 hover:border-rose-800 text-white/50 hover:text-rose-300 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset profile data to original template values"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            id="profile-save-btn"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded bg-[#F27D26] hover:bg-[#ff8f3d] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer shadow-lg"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {[
          { id: 'general', label: 'Identity & Info', icon: User },
          { id: 'hero', label: 'Hero & Metrics', icon: Sparkles },
          { id: 'about', label: 'About & Philosophy', icon: Layers },
          { id: 'skills', label: 'Skills & Stack', icon: Code2 },
          { id: 'timeline', label: 'Timeline & Career', icon: Briefcase },
          { id: 'contact', label: 'Contact & Socials', icon: Link },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              id={`profile-subtab-${tab.id}`}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#F27D26] text-black shadow-md'
                  : 'bg-[#080808] border border-white/5 text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General Identity */}
      {activeSection === 'general' && (
        <div className="space-y-6">
          <div className="p-6 rounded bg-[#080808] border border-white/5 space-y-6">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Identity & Baseline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Full Display Name *
                </label>
                <input
                  id="profile-input-name"
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="e.g. Alex Rivera"
                />
                <span className="text-[10px] text-white/40 font-mono mt-1 block">
                  Used in browser title, hero section, footer, and navigation.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Header Monogram / Badge Role *
                </label>
                <input
                  id="profile-input-badgeRole"
                  type="text"
                  value={profile.badgeRole || ''}
                  onChange={(e) => handleFieldChange('badgeRole', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="e.g. Staff SWE"
                />
                <span className="text-[10px] text-white/40 font-mono mt-1 block">
                  Appears in the upper-left navigation header next to your initials monogram.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Professional Role Title *
                </label>
                <input
                  id="profile-input-roleTitle"
                  type="text"
                  value={profile.roleTitle || ''}
                  onChange={(e) => handleFieldChange('roleTitle', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="e.g. Staff Full-Stack Engineer & Distributed Systems"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Current Availability Status *
                </label>
                <input
                  id="profile-input-availabilityStatus"
                  type="text"
                  value={profile.availabilityStatus || ''}
                  onChange={(e) => handleFieldChange('availabilityStatus', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="e.g. Available for Staff Engineering & Architecture 2026"
                />
                <span className="text-[10px] text-white/40 font-mono mt-1 block">
                  Displayed in pulsing badge at the top of Hero and About sections.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Physical Base Location *
                </label>
                <input
                  id="profile-input-location"
                  type="text"
                  value={profile.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="e.g. San Francisco, CA & Remote"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Timezone *
                </label>
                <input
                  id="profile-input-timezone"
                  type="text"
                  value={profile.timezone || ''}
                  onChange={(e) => handleFieldChange('timezone', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="e.g. Pacific Time (UTC-7)"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hero Section & Metric Cards */}
      {activeSection === 'hero' && (
        <div className="space-y-6">
          <div className="p-6 rounded bg-[#080808] border border-white/5 space-y-6">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Hero Typography & Headline Lines
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Hero Headline Line 1
                </label>
                <input
                  id="profile-input-heroLine1"
                  type="text"
                  value={profile.heroHeadlineLine1 || ''}
                  onChange={(e) => handleFieldChange('heroHeadlineLine1', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none uppercase font-bold"
                  placeholder="STAFF"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Hero Headline Line 2 (Muted)
                </label>
                <input
                  id="profile-input-heroLine2"
                  type="text"
                  value={profile.heroHeadlineLine2 || ''}
                  onChange={(e) => handleFieldChange('heroHeadlineLine2', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none uppercase font-bold"
                  placeholder="SYSTEMS"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Hero Headline Line 3
                </label>
                <input
                  id="profile-input-heroLine3"
                  type="text"
                  value={profile.heroHeadlineLine3 || ''}
                  onChange={(e) => handleFieldChange('heroHeadlineLine3', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none uppercase font-bold"
                  placeholder="ENGINEER"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                Editorial Serif Tagline / Subtitle
              </label>
              <textarea
                id="profile-input-heroQuote"
                rows={3}
                value={profile.heroQuote || ''}
                onChange={(e) => handleFieldChange('heroQuote', e.target.value)}
                className="w-full px-4 py-3 rounded bg-white/5 border border-white/10 text-white font-serif italic text-base focus:border-[#F27D26] focus:outline-none leading-relaxed"
                placeholder="Bridging the fragile gap between high-end digital aesthetics and resilient, distributed architectures..."
              />
            </div>
          </div>

          {/* Metric Highlight Stats */}
          <div className="p-6 rounded bg-[#080808] border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Hero Metric Cards (Stats Bar)
                </h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  Highlighted numeric achievements displayed at the bottom of the hero section.
                </p>
              </div>

              <button
                id="profile-add-stat-btn"
                onClick={handleAddStat}
                className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[#F27D26] hover:text-[#ff8f3d] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Metric</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(profile.stats || []).map((stat, idx) => (
                <div key={idx} className="p-4 rounded bg-white/5 border border-white/10 relative group">
                  <button
                    onClick={() => handleRemoveStat(idx)}
                    className="absolute top-2 right-2 p-1 text-white/40 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Delete metric"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                    Metric Value #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-black/40 border border-white/10 text-white font-mono font-bold text-lg mb-2 focus:border-[#F27D26] focus:outline-none"
                    placeholder="e.g. 07+"
                  />

                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                    Metric Label
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                    className="w-full px-3 py-1.5 rounded bg-black/40 border border-white/10 text-white/80 font-mono text-xs focus:border-[#F27D26] focus:outline-none"
                    placeholder="e.g. Years Experience"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: About & Focus */}
      {activeSection === 'about' && (
        <div className="space-y-6">
          <div className="p-6 rounded bg-[#080808] border border-white/5 space-y-6">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Narrative Bio & Engineering Philosophy
            </h3>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                Featured Philosophy Quote
              </label>
              <textarea
                id="profile-input-aboutQuote"
                rows={2}
                value={profile.aboutQuote || ''}
                onChange={(e) => handleFieldChange('aboutQuote', e.target.value)}
                className="w-full px-4 py-3 rounded bg-white/5 border border-white/10 text-white font-serif italic text-base focus:border-[#F27D26] focus:outline-none leading-relaxed"
                placeholder="Engineering revolves around cognitive ergonomics for developers..."
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                Bio Paragraph 1 (Career Overview & Background)
              </label>
              <textarea
                id="profile-input-aboutBio1"
                rows={3}
                value={profile.aboutBio1 || ''}
                onChange={(e) => handleFieldChange('aboutBio1', e.target.value)}
                className="w-full px-4 py-3 rounded bg-white/5 border border-white/10 text-white font-sans text-sm focus:border-[#F27D26] focus:outline-none leading-relaxed"
                placeholder="I am a full-stack engineer and distributed systems architect with over seven years..."
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                Bio Paragraph 2 (Approach & Focus)
              </label>
              <textarea
                id="profile-input-aboutBio2"
                rows={3}
                value={profile.aboutBio2 || ''}
                onChange={(e) => handleFieldChange('aboutBio2', e.target.value)}
                className="w-full px-4 py-3 rounded bg-white/5 border border-white/10 text-white font-sans text-sm focus:border-[#F27D26] focus:outline-none leading-relaxed"
                placeholder="Whether orchestrating high-throughput Kafka streaming services or refining React design systems..."
              />
            </div>
          </div>

          {/* Core Competencies Box */}
          <div className="p-6 rounded bg-[#080808] border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Core Competencies & Focus Cards
                </h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  Displayed in the right-hand panel of the About section.
                </p>
              </div>

              <button
                id="profile-add-competency-btn"
                onClick={handleAddCompetency}
                className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[#F27D26] hover:text-[#ff8f3d] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Competency</span>
              </button>
            </div>

            <div className="space-y-4">
              {(profile.competencies || []).map((comp, idx) => (
                <div key={idx} className="p-4 rounded bg-white/5 border border-white/10 space-y-3 relative group">
                  <button
                    onClick={() => handleRemoveCompetency(idx)}
                    className="absolute top-3 right-3 p-1 text-white/40 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Delete competency"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="max-w-md">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                      Competency Title #{idx + 1}
                    </label>
                    <input
                      type="text"
                      value={comp.title}
                      onChange={(e) => handleCompetencyChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-black/40 border border-white/10 text-white font-mono font-bold text-sm focus:border-[#F27D26] focus:outline-none"
                      placeholder="e.g. Distributed Architecture"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                      Description Summary
                    </label>
                    <textarea
                      rows={2}
                      value={comp.description}
                      onChange={(e) => handleCompetencyChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 rounded bg-black/40 border border-white/10 text-white/80 font-sans text-xs focus:border-[#F27D26] focus:outline-none leading-relaxed"
                      placeholder="e.g. Event-driven systems, micro-frontends, caching tiers, and resilient RPC interfaces."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Technical Skills & Tooling */}
      {activeSection === 'skills' && (
        <div className="space-y-6">
          <div className="p-6 rounded bg-[#080808] border border-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Technical Skills & Tooling Categories
                </h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  Organize your frameworks, languages, databases, and DevOps tools into clean visual groups.
                </p>
              </div>

              <button
                id="profile-add-skill-cat-btn"
                onClick={handleAddSkillCategory}
                className="px-3.5 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[#F27D26] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Category</span>
              </button>
            </div>

            <div className="space-y-6">
              {(profile.skills || []).map((cat, catIdx) => (
                <div key={catIdx} className="p-5 rounded bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xs font-mono text-[#F27D26] uppercase">#{catIdx + 1}</span>
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) => handleCategoryNameChange(catIdx, e.target.value)}
                        className="px-3 py-1.5 rounded bg-black/50 border border-white/10 text-white font-mono font-bold text-sm max-w-sm focus:border-[#F27D26] focus:outline-none"
                        placeholder="Category Name"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddSkillToCategory(catIdx)}
                        className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-[#F27D26] text-xs font-mono flex items-center gap-1 cursor-pointer border border-white/10"
                        title="Add skill to this category"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Skill</span>
                      </button>

                      <button
                        onClick={() => handleRemoveSkillCategory(catIdx)}
                        className="p-1.5 rounded text-white/40 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Delete entire category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {cat.skills.map((skill, skillIdx) => (
                      <div
                        key={skillIdx}
                        className="p-3 rounded bg-black/40 border border-white/5 flex items-center justify-between gap-2"
                      >
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              handleSkillItemChange(catIdx, skillIdx, 'name', e.target.value)
                            }
                            className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs font-mono focus:border-[#F27D26] focus:outline-none"
                            placeholder="Skill Name"
                          />

                          <select
                            value={skill.level || 'Proficient'}
                            onChange={(e) =>
                              handleSkillItemChange(catIdx, skillIdx, 'level', e.target.value as any)
                            }
                            className="w-full px-2 py-0.5 rounded bg-black border border-white/10 text-white/70 text-[10px] font-mono focus:border-[#F27D26] focus:outline-none"
                          >
                            <option value="Expert">Expert (Highlighted)</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Proficient">Proficient</option>
                          </select>
                        </div>

                        <button
                          onClick={() => handleRemoveSkillFromCategory(catIdx, skillIdx)}
                          className="p-1 text-white/30 hover:text-rose-400 transition-colors cursor-pointer self-center"
                          title="Remove skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Timeline & Career */}
      {activeSection === 'timeline' && (
        <div className="space-y-8">
          {/* Work Experience */}
          <div className="p-6 rounded bg-[#080808] border border-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Professional Work Experience
                </h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  Chronological career positions, key engineering highlights, and technologies.
                </p>
              </div>

              <button
                id="profile-add-experience-btn"
                onClick={() => handleAddTimelineItem('experience')}
                className="px-3.5 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[#F27D26] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-6">
              {(profile.experience || []).map((item, idx) => (
                <div key={item.id || idx} className="p-5 rounded bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-white/40 mb-1">
                          Role Title *
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleTimelineChange('experience', idx, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-black/50 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                          placeholder="e.g. Lead Distributed Systems Engineer"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-white/40 mb-1">
                          Company / Organization *
                        </label>
                        <input
                          type="text"
                          value={item.organization}
                          onChange={(e) => handleTimelineChange('experience', idx, 'organization', e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-black/50 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                          placeholder="e.g. Nexus Cloud Labs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-white/40 mb-1">
                          Period / Dates *
                        </label>
                        <input
                          type="text"
                          value={item.period}
                          onChange={(e) => handleTimelineChange('experience', idx, 'period', e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-black/50 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                          placeholder="e.g. 2023 - Present"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-white/40 mb-1">
                          Location *
                        </label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => handleTimelineChange('experience', idx, 'location', e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-black/50 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                          placeholder="e.g. San Francisco, CA"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveTimelineItem('experience', idx)}
                      className="p-1.5 text-white/30 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete experience entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                        Key Accomplishment Bullets
                      </span>
                      <button
                        onClick={() => handleAddTimelineBullet('experience', idx)}
                        className="text-[11px] font-mono text-[#F27D26] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    {item.description.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} className="flex items-center gap-2">
                        <span className="text-white/30 font-mono text-xs">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) =>
                            handleTimelineBulletChange('experience', idx, bulletIdx, e.target.value)
                          }
                          className="flex-1 px-3 py-1 rounded bg-black/30 border border-white/10 text-white/80 text-xs focus:border-[#F27D26] focus:outline-none"
                          placeholder="Accomplishment bullet..."
                        />
                        <button
                          onClick={() => handleRemoveTimelineBullet('experience', idx, bulletIdx)}
                          className="p-1 text-white/20 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Skills tags */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-white/40 mb-1">
                      Tech Stack Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={(item.skills || []).join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                        handleTimelineChange('experience', idx, 'skills', tags);
                      }}
                      className="w-full px-3 py-1.5 rounded bg-black/40 border border-white/10 text-white font-mono text-xs focus:border-[#F27D26] focus:outline-none"
                      placeholder="e.g. Go, Kubernetes, Kafka, gRPC"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Education */}
          <div className="p-6 rounded bg-[#080808] border border-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Academic Degrees & Certifications
                </h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  Degrees, universities, honors, and notable research or coursework.
                </p>
              </div>

              <button
                id="profile-add-education-btn"
                onClick={() => handleAddTimelineItem('education')}
                className="px-3.5 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[#F27D26] text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Degree / Cert</span>
              </button>
            </div>

            <div className="space-y-6">
              {(profile.education || []).map((item, idx) => (
                <div key={item.id || idx} className="p-5 rounded bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-white/40 mb-1">
                          Degree / Certificate *
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleTimelineChange('education', idx, 'title', e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-black/50 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                          placeholder="e.g. B.S. in Computer Science"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-white/40 mb-1">
                          University / Institution *
                        </label>
                        <input
                          type="text"
                          value={item.organization}
                          onChange={(e) => handleTimelineChange('education', idx, 'organization', e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-black/50 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                          placeholder="e.g. University of California, Berkeley"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-white/40 mb-1">
                          Period / Year *
                        </label>
                        <input
                          type="text"
                          value={item.period}
                          onChange={(e) => handleTimelineChange('education', idx, 'period', e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-black/50 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                          placeholder="e.g. 2015 - 2019"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-white/40 mb-1">
                          Location *
                        </label>
                        <input
                          type="text"
                          value={item.location}
                          onChange={(e) => handleTimelineChange('education', idx, 'location', e.target.value)}
                          className="w-full px-3 py-1.5 rounded bg-black/50 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                          placeholder="e.g. Berkeley, CA"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveTimelineItem('education', idx)}
                      className="p-1.5 text-white/30 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete education entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                        Honors & Coursework Bullets
                      </span>
                      <button
                        onClick={() => handleAddTimelineBullet('education', idx)}
                        className="text-[11px] font-mono text-[#F27D26] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Bullet</span>
                      </button>
                    </div>

                    {item.description.map((bullet, bulletIdx) => (
                      <div key={bulletIdx} className="flex items-center gap-2">
                        <span className="text-white/30 font-mono text-xs">•</span>
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) =>
                            handleTimelineBulletChange('education', idx, bulletIdx, e.target.value)
                          }
                          className="flex-1 px-3 py-1 rounded bg-black/30 border border-white/10 text-white/80 text-xs focus:border-[#F27D26] focus:outline-none"
                          placeholder="Degree highlight or honor..."
                        />
                        <button
                          onClick={() => handleRemoveTimelineBullet('education', idx, bulletIdx)}
                          className="p-1 text-white/20 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Contact & Social Links */}
      {activeSection === 'contact' && (
        <div className="space-y-6">
          <div className="p-6 rounded bg-[#080808] border border-white/5 space-y-6">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
              <Link className="w-4 h-4" />
              Contact Messaging & Direct Inquiries
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Direct Email Address *
                </label>
                <input
                  id="profile-input-email"
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="alex.rivera.swe@gmail.com"
                />
                <span className="text-[10px] text-white/40 font-mono mt-1 block">
                  Displayed on the contact card and copied to clipboard by visitors.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Response SLA Notice
                </label>
                <input
                  id="profile-input-responseSla"
                  type="text"
                  value={profile.responseSla || ''}
                  onChange={(e) => handleFieldChange('responseSla', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="Within 24 business hours (PST)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Contact Section Heading
                </label>
                <input
                  id="profile-input-contactHeading"
                  type="text"
                  value={profile.contactHeading || ''}
                  onChange={(e) => handleFieldChange('contactHeading', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="Let's construct something extraordinary together"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Contact Section Subheading Narrative
                </label>
                <textarea
                  id="profile-input-contactSubheading"
                  rows={2}
                  value={profile.contactSubheading || ''}
                  onChange={(e) => handleFieldChange('contactSubheading', e.target.value)}
                  className="w-full px-4 py-3 rounded bg-white/5 border border-white/10 text-white font-sans text-sm focus:border-[#F27D26] focus:outline-none leading-relaxed"
                  placeholder="Whether you have a Staff/Principal engineering opportunity, need architectural advisory..."
                />
              </div>
            </div>
          </div>

          {/* Social Profiles & External URLs */}
          <div className="p-6 rounded bg-[#080808] border border-white/5 space-y-6">
            <h3 className="text-sm font-mono uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
              <Link className="w-4 h-4" />
              Verified External Profiles & Resume Link
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  GitHub Profile URL
                </label>
                <input
                  id="profile-input-github"
                  type="url"
                  value={profile.githubUrl || ''}
                  onChange={(e) => handleFieldChange('githubUrl', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="https://github.com/username"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  LinkedIn Profile URL
                </label>
                <input
                  id="profile-input-linkedin"
                  type="url"
                  value={profile.linkedinUrl || ''}
                  onChange={(e) => handleFieldChange('linkedinUrl', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Twitter / X Profile URL
                </label>
                <input
                  id="profile-input-twitter"
                  type="url"
                  value={profile.twitterUrl || ''}
                  onChange={(e) => handleFieldChange('twitterUrl', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="https://x.com/username"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">
                  Resume / CV Document URL (Optional)
                </label>
                <input
                  id="profile-input-resume"
                  type="url"
                  value={profile.resumeUrl || ''}
                  onChange={(e) => handleFieldChange('resumeUrl', e.target.value)}
                  className="w-full px-4 py-2.5 rounded bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#F27D26] focus:outline-none"
                  placeholder="https://example.com/resume.pdf"
                />
                <span className="text-[10px] text-white/40 font-mono mt-1 block">
                  If set, a "Resume / CV" button will appear in the Hero section.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-40 p-4 rounded bg-[#080808]/95 backdrop-blur-md border border-white/10 flex items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-mono text-white/60">
          <CheckCircle2 className="w-4 h-4 text-[#F27D26]" />
          <span>All edits sync to persistent database storage upon save.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="profile-bottom-save-btn"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded bg-[#F27D26] hover:bg-[#ff8f3d] text-black font-bold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer shadow-lg"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
