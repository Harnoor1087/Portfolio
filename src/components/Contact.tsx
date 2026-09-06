import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Send, Check, Copy, Github, Linkedin, Twitter, MessageSquare, Clock, MapPin, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const emailAddress = 'alex.rivera.swe@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setFeedbackMsg('Please provide your name, email address, and message.');
      return;
    }

    try {
      setStatus('submitting');
      setFeedbackMsg('');
      const res = await api.submitContact(formData);
      setStatus('success');
      setFeedbackMsg(res.message || 'Thank you! Your message was transmitted successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setStatus('error');
      setFeedbackMsg(err.message || 'Unable to deliver message. Please use the direct email link.');
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#050505] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct Info & Socials */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#F27D26] font-mono mb-2">
                (05) // INITIATE TRANSMISSION
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                Let's construct something extraordinary together<span className="text-[#F27D26]">.</span>
              </h2>
              <p className="text-white/70 text-base sm:text-lg leading-relaxed font-light">
                Whether you have a Staff/Principal engineering opportunity, need architectural advisory for a distributed platform, or want to discuss novel ideas—my inbox is always open.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              <div className="p-4 rounded bg-[#080808] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-white/5 text-[#F27D26] border border-white/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#F27D26]" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono tracking-wider text-white/40">Direct Email</div>
                    <a
                      href={`mailto:${emailAddress}`}
                      className="text-xs sm:text-sm font-mono font-semibold text-white hover:text-[#F27D26] transition-colors"
                    >
                      {emailAddress}
                    </a>
                  </div>
                </div>
                <button
                  id="contact-copy-email-btn"
                  onClick={handleCopyEmail}
                  className="p-2 rounded bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#F27D26]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-4 rounded bg-[#080808] border border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-white/5 text-[#F27D26] border border-white/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-[#F27D26]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-white/40">Response SLA</div>
                  <div className="text-xs sm:text-sm font-mono text-white/90">
                    Within 24 business hours (PST)
                  </div>
                </div>
              </div>

              <div className="p-4 rounded bg-[#080808] border border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-white/5 text-[#F27D26] border border-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#F27D26]" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-white/40">Location Base</div>
                  <div className="text-xs sm:text-sm font-mono text-white/90">
                    San Francisco Bay Area, CA & Remote
                  </div>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#F27D26] mb-3">
                Verified Profiles
              </div>
              <div className="flex items-center gap-3">
                <a
                  id="social-link-github"
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded bg-white/5 border border-white/10 text-white/60 hover:text-[#F27D26] hover:border-[#F27D26]/40 transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  id="social-link-linkedin"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded bg-white/5 border border-white/10 text-white/60 hover:text-[#F27D26] hover:border-[#F27D26]/40 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  id="social-link-twitter"
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded bg-white/5 border border-white/10 text-white/60 hover:text-[#F27D26] hover:border-[#F27D26]/40 transition-colors"
                  aria-label="X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded bg-[#080808] border border-white/10 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#F27D26]" />
                Send a Direct Dispatch
              </h3>
              <p className="text-xs sm:text-sm text-white/50 mb-6 font-mono">
                Fill out the message dispatch below. Submitted records persist directly to the database for administrative review.
              </p>

              {status === 'success' ? (
                <div className="p-6 rounded bg-white/5 border border-[#F27D26]/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#F27D26]/20 text-[#F27D26] flex items-center justify-center mx-auto border border-[#F27D26]/30">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Transmission Confirmed</h4>
                  <p className="text-xs sm:text-sm text-white/80 font-mono leading-relaxed max-w-sm mx-auto">
                    {feedbackMsg}
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-2 px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Send Another Dispatch
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status === 'error' && (
                    <div className="p-3.5 rounded bg-rose-950/40 border border-rose-500/40 flex items-center gap-2.5 text-rose-300 text-xs font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{feedbackMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Sarah Connor"
                        className="w-full px-3.5 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sarah@acme.corp"
                        className="w-full px-3.5 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                      Subject / Topic
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Staff Engineering Opportunity / Architecture Advisory"
                      className="w-full px-3.5 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your team, tech stack, and what you're working to accomplish..."
                      className="w-full px-3.5 py-2.5 rounded bg-black/60 border border-white/10 text-white placeholder-white/30 text-sm font-mono focus:outline-none focus:border-[#F27D26] transition-colors resize-y"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3.5 px-6 rounded font-mono text-xs uppercase tracking-widest font-bold text-black bg-[#F27D26] hover:bg-[#d86815] disabled:opacity-60 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Send className={`w-3.5 h-3.5 text-black ${status === 'submitting' ? 'animate-pulse' : ''}`} />
                    <span>{status === 'submitting' ? 'Transmitting Dispatch...' : 'Dispatch Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
