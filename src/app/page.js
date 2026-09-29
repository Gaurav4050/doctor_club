'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Stethoscope, 
  HeartHandshake, 
  Megaphone, 
  ShieldAlert, 
  Users2, 
  Phone, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Building, 
  HeartPulse, 
  ChevronRight, 
  Sparkles,
  Lock,
  Compass,
  GraduationCap,
  Activity,
  Menu,
  X
} from 'lucide-react';
import ClubEmblem from '@/components/ClubEmblem';
import RegistrationForm from '@/components/RegistrationForm';

export default function Home() {
  const [stats, setStats] = useState({ total: 240, personalClinics: 145, cities: 38 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch live registration counts
    fetch('/api/register')
      .then(res => res.json())
      .then(data => {
        if (data && data.total) {
          setStats(prev => ({
            ...prev,
            total: Math.max(data.total, 240)
          }));
        }
      })
      .catch(() => {});
  }, []);

  const scrollToRegistration = () => {
    const el = document.getElementById('registration-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const pillars = [
    {
      title: "MADE BY DOCTORS",
      subtitle: "Because we understand your struggles.",
      color: "#0284c7",
      bgGradient: "from-blue-600/20 to-sky-900/10",
      borderColor: "border-sky-500/40",
      icon: Stethoscope,
      badge: "Medical Empathy"
    },
    {
      title: "FOR DOCTORS",
      subtitle: "Built with your needs, not just for you.",
      color: "#0d9488",
      bgGradient: "from-teal-600/20 to-emerald-950/10",
      borderColor: "border-teal-500/40",
      icon: Users2,
      badge: "Fraternity First"
    },
    {
      title: "FOR YOUR WELFARE",
      subtitle: "Supporting your rights, growth and well-being.",
      color: "#2563eb",
      bgGradient: "from-indigo-600/20 to-slate-900/20",
      borderColor: "border-indigo-500/40",
      icon: ShieldCheck,
      badge: "Welfare & Rights"
    },
    {
      title: "FOR YOUR SAFETY",
      subtitle: "Because your safety matters — always.",
      color: "#ea580c",
      bgGradient: "from-orange-600/20 to-amber-950/10",
      borderColor: "border-orange-500/40",
      icon: ShieldAlert,
      badge: "24/7 Doctor Safety"
    },
    {
      title: "TO GIVE YOU A VOICE",
      subtitle: "To stand for your concerns and rights.",
      color: "#8b5cf6",
      bgGradient: "from-purple-600/20 to-indigo-950/10",
      borderColor: "border-purple-500/40",
      icon: Megaphone,
      badge: "Collective Voice"
    },
    {
      title: "TO UNITE TOGETHER",
      subtitle: "Stronger as one, for a better future.",
      color: "#16a34a",
      bgGradient: "from-emerald-600/20 to-teal-950/10",
      borderColor: "border-emerald-500/40",
      icon: HeartHandshake,
      badge: "Nationwide Unity"
    }
  ];

  return (
    <div className="min-h-screen bg-[#051020] text-slate-100 selection:bg-amber-500 selection:text-slate-950 relative overflow-hidden">
      {/* Ambient Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-700/15 via-amber-500/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[400px] left-0 w-[500px] h-[500px] bg-sky-600/10 blur-[130px] pointer-events-none" />

      {/* Top Navbar */}
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#051020]/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="shrink-0 flex items-center">
              <ClubEmblem size={36} className="sm:hidden" />
              <ClubEmblem size={46} className="hidden sm:inline-flex" />
            </div>
            <div className="min-w-0">
              <div className="font-heading font-black text-xs sm:text-base tracking-wide sm:tracking-wider text-amber-300 leading-tight truncate">
                ALL INDIA DOCTORS CLUB
              </div>
              <div className="text-[8px] sm:text-[10px] tracking-wider sm:tracking-widest text-slate-400 uppercase font-semibold leading-tight truncate">
                Association • Established for Doctors
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <a href="#about" className="hover:text-amber-400 transition-colors">Our Vision</a>
            <a href="#pillars" className="hover:text-amber-400 transition-colors">Core Pillars</a>
            <a href="#leadership" className="hover:text-amber-400 transition-colors">Leadership</a>
            <a href="#registration-section" className="hover:text-amber-400 transition-colors">Member Registration</a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Desktop Join Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToRegistration();
              }}
              className="btn-gold hidden sm:inline-flex text-xs py-2 px-4 font-bold uppercase tracking-wider shadow-md whitespace-nowrap items-center gap-1.5"
            >
              <span>Join Club</span>
              <ArrowRight size={13} className="shrink-0" />
            </button>

            {/* Mobile Compact Join Button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToRegistration();
              }}
              className="sm:hidden btn-gold py-1.5 px-3 text-[11px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap flex items-center gap-1"
            >
              <span>Join</span>
              <ArrowRight size={12} className="shrink-0" />
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 rounded-lg bg-slate-800/80 text-amber-300 border border-amber-400/20 hover:bg-slate-700 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#071830]/98 border-b border-amber-400/25 px-5 py-4 space-y-3 backdrop-blur-xl animate-fadeIn">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-amber-300 border-b border-white/5"
            >
              Our Vision
            </a>
            <a
              href="#pillars"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-amber-300 border-b border-white/5"
            >
              Core Pillars
            </a>
            <a
              href="#leadership"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-amber-300 border-b border-white/5"
            >
              Leadership & Founders
            </a>
            <a
              href="#registration-section"
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToRegistration();
              }}
              className="block py-2 text-xs font-bold uppercase tracking-wider text-amber-300 border-b border-white/5"
            >
              Doctor Registration Form
            </a>
            <div className="pt-2 flex flex-col gap-2 text-xs">
              <a
                href="tel:7374926939"
                className="flex items-center gap-2 text-amber-400 font-semibold"
              >
                <Phone size={14} /> Founder Helpline: 7374926939
              </a>
              <a
                href="tel:8696772312"
                className="flex items-center gap-2 text-amber-400 font-semibold"
              >
                <Phone size={14} /> Co-Founder Helpline: 8696772312
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section matching the Poster Theme */}
      <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-20 px-3 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto">
        {/* Poster Top Tagline */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-300 text-[11px] sm:text-sm font-semibold mb-5 sm:mb-6 shadow-lg shadow-amber-500/10 max-w-full">
          <HeartPulse size={14} className="text-amber-400 animate-pulse shrink-0" />
          <span className="truncate">Stronger Together for a Better Tomorrow</span>
        </div>

        {/* Association Crest Emblem */}
        <div className="flex justify-center mb-5 sm:mb-6 relative">
          <div className="relative group">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl group-hover:bg-amber-400/30 transition-all" />
            <ClubEmblem size={120} className="sm:hidden relative z-10" />
            <ClubEmblem size={170} className="hidden sm:inline-flex relative z-10" />
          </div>
        </div>

        {/* Main Ribbon Title from Poster */}
        <div className="relative inline-block max-w-4xl mx-auto my-2 sm:my-3 px-2 w-full sm:w-auto">
          <div className="py-2 sm:py-2.5 px-3 sm:px-12 banner-ribbon rounded-xl transform -skew-x-1 sm:-skew-x-2">
            <h1 className="font-heading font-black text-xl sm:text-4xl md:text-5xl tracking-wide text-slate-950 leading-tight">
              ALL INDIA DOCTORS CLUB
            </h1>
            <div className="text-xs sm:text-2xl font-black tracking-widest text-[#06162d] mt-0.5 sm:mt-1">
              A S S O C I A T I O N
            </div>
          </div>
        </div>

        {/* Poster Subtitle */}
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-4 text-[11px] sm:text-sm font-bold tracking-wider text-slate-300 uppercase px-2">
          <span className="text-amber-400">Created by Doctors</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-amber-400">For Doctors</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-amber-400">For a Stronger Medical Community</span>
        </div>

        {/* Hero Narrative Description */}
        <p className="mt-4 sm:mt-5 text-xs sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal px-2">
          The sovereign fraternal association safeguarding healthcare professionals, resident doctors, private practitioners, and medical officers across India. From clinical safety to medico-legal support and collective brotherhood.
        </p>

        {/* Hero Actions */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
          <button
            onClick={scrollToRegistration}
            className="btn-gold text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8 font-extrabold uppercase tracking-wider w-full sm:w-auto"
          >
            Register as Doctor Member <ArrowRight size={16} />
          </button>

          <a
            href="#leadership"
            className="btn-outline-gold text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 font-semibold w-full sm:w-auto justify-center"
          >
            Meet the Founders
          </a>
        </div>

        {/* Live Statistics Counter Strip */}
        <div className="mt-10 sm:mt-14 max-w-3xl mx-auto grid grid-cols-3 gap-1 sm:gap-3 p-3 sm:p-6 rounded-2xl glass-panel border border-white/10 text-center">
          <div className="border-r border-white/10 px-1 sm:px-4">
            <div className="text-xl sm:text-3xl font-extrabold text-amber-400 font-heading">
              {stats.total}+
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold mt-1">
              Registered Doctors
            </div>
          </div>

          <div className="border-r border-white/10 px-1 sm:px-4">
            <div className="text-xl sm:text-3xl font-extrabold text-cyan-400 font-heading">
              100%
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold mt-1">
              Doctor-Run Body
            </div>
          </div>

          <div className="px-1 sm:px-4">
            <div className="text-xl sm:text-3xl font-extrabold text-emerald-400 font-heading">
              24/7
            </div>
            <div className="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold mt-1">
              Doctor Helpline
            </div>
          </div>
        </div>
      </section>

      {/* Heartbeat ECG Divider with Poster Motto */}
      <div className="relative py-8 bg-gradient-to-r from-transparent via-[#0c244a] to-transparent border-y border-amber-400/20">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Activity className="text-amber-400 animate-pulse shrink-0" size={28} />
            <div>
              <div className="font-heading font-black text-lg text-amber-300 tracking-wider">
                ONE COMMUNITY • ONE VOICE • ONE GOAL
              </div>
              <div className="text-xs text-slate-400">
                Upholding the dignity, security and fellowship of all medical practitioners.
              </div>
            </div>
          </div>

          <div className="font-mono text-xs text-amber-300 font-bold px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30">
            FOR DOCTORS | BY DOCTORS
          </div>
        </div>
      </div>

      {/* 6 Core Pillars from the Poster */}
      <section id="pillars" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 rounded-full border border-amber-400/25 mb-3">
            Foundational Charter
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            The Six Pillars of Our Association
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Every initiative of the All India Doctors Club Association is anchored upon these solemn commitments to our fellow medical brothers and sisters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className={`relative rounded-2xl p-7 glass-panel glass-panel-hover border ${pillar.borderColor} overflow-hidden group transition-all`}
              >
                {/* Top Pill badge */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center p-3 shadow-lg"
                    style={{ backgroundColor: `${pillar.color}25`, border: `1.5px solid ${pillar.color}` }}
                  >
                    <Icon size={26} style={{ color: pillar.color }} />
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                    style={{ backgroundColor: `${pillar.color}15`, color: pillar.color, border: `1px solid ${pillar.color}35` }}
                  >
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="font-heading font-black text-xl text-white mb-2 tracking-wide group-hover:text-amber-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {pillar.subtitle}
                </p>

                {/* Sub-accent line */}
                <div
                  className="mt-5 h-1 w-12 rounded-full transition-all group-hover:w-full"
                  style={{ backgroundColor: pillar.color }}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* Leadership & Founders Section from Poster */}
      <section id="leadership" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 rounded-full border border-amber-400/25 mb-2">
            Leadership & Visionaries
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
            Executive Leadership
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            Reachable, dedicated leadership committed to hearing every member&apos;s voice and standing by you in every challenge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Dr. Ankit Jakhar - Founder */}
          <div className="rounded-3xl glass-panel p-7 sm:p-9 border-2 border-amber-400/50 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400/20 to-transparent w-40 h-40 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-1 shrink-0 shadow-lg">
                <div className="w-full h-full bg-[#081B38] rounded-xl flex items-center justify-center text-amber-400 font-heading font-black text-2xl">
                  AJ
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Founder
                </span>
                <h3 className="font-heading font-bold text-2xl text-white mt-1">
                  Dr. Ankit Jakhar
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Founder, All India Doctors Club Association
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4">
              Dedicated to building an unshakeable pan-India brotherhood of doctors where clinical autonomy, practitioner safety, and fair working environments are non-negotiable rights.
            </p>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-amber-400" />
                <span className="font-mono text-base font-bold text-amber-300">
                  7374926939
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:7374926939"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
                >
                  Direct Call
                </a>
                <a
                  href="https://wa.me/917374926939?text=Hello%20Dr.%20Ankit%20Jakhar,%20I%20am%20reaching%20out%20regarding%20All%20India%20Doctors%20Club%20Association."
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <MessageSquare size={13} /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Dr. Dinesh k. Samota - Co-Founder */}
          <div className="rounded-3xl glass-panel p-7 sm:p-9 border-2 border-amber-400/50 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400/20 to-transparent w-40 h-40 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-1 shrink-0 shadow-lg">
                <div className="w-full h-full bg-[#081B38] rounded-xl flex items-center justify-center text-amber-400 font-heading font-black text-2xl">
                  DS
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Co-Founder
                </span>
                <h3 className="font-heading font-bold text-2xl text-white mt-1">
                  Dr. Dinesh k. Samota
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Co-Founder, All India Doctors Club Association
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4">
              Pioneering comprehensive welfare initiatives, legal support systems, and professional growth opportunities for clinicians, resident doctors, and clinic owners.
            </p>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-amber-400" />
                <span className="font-mono text-base font-bold text-amber-300">
                  8696772312
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="tel:8696772312"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
                >
                  Direct Call
                </a>
                <a
                  href="https://wa.me/918696772312?text=Hello%20Dr.%20Dinesh%20Samota,%20I%20am%20reaching%20out%20regarding%20All%20India%20Doctors%20Club%20Association."
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <MessageSquare size={13} /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Registration Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <RegistrationForm
          onSuccess={(newDoctor) => {
            setStats(prev => ({
              ...prev,
              total: prev.total + 1
            }));
          }}
        />
      </section>

      {/* Why Register / Association Charter */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Membership Privileges & Protection
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Why thousands of doctors are choosing to stand together under one national banner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <ShieldAlert size={24} />
            </div>
            <h4 className="font-heading font-bold text-lg text-white">Emergency Grievance & Safety</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rapid response network and legal guidance in incidents of workplace violence, harassment, or unlawful institutional actions.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Building size={24} />
            </div>
            <h4 className="font-heading font-bold text-lg text-white">Clinic & Practice Growth</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Peer-to-peer referral networks, verified practitioner directory listings, cross-consultations, and collective medical purchasing support.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Award size={24} />
            </div>
            <h4 className="font-heading font-bold text-lg text-white">Official Credentialing</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Official Digital Membership ID Card, verified association credentials, certificate of active fraternity standing, and national conference access.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030914] border-t border-amber-500/30 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-white/10">
          <div className="flex items-center gap-4 text-center md:text-left">
            <ClubEmblem size={64} />
            <div>
              <h3 className="font-heading font-bold text-amber-300 text-lg sm:text-xl">
                ALL INDIA DOCTORS CLUB ASSOCIATION
              </h3>
              <p className="text-xs text-slate-400">
                Created by Doctors • For Doctors • For a Stronger Medical Community
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-semibold text-slate-300">
            <a href="tel:7374926939" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
              <Phone size={14} className="text-amber-400" /> Helpline: 7374926939
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <a href="tel:8696772312" className="hover:text-amber-400 flex items-center gap-1.5 transition-colors">
              <Phone size={14} className="text-amber-400" /> Helpline: 8696772312
            </a>
          </div>
        </div>

        {/* Bottom Banner from Poster */}
        <div className="mt-8 text-center space-y-2">
          <div className="text-xs sm:text-sm font-black tracking-widest text-amber-400 font-heading">
            FOR DOCTORS | BY DOCTORS | TOGETHER WE GROW
          </div>
          <p className="text-[11px] text-slate-400">
            © {new Date().getFullYear()} All India Doctors Club Association. All rights reserved. Data securely maintained in association registry.
          </p>
        </div>
      </footer>
    </div>
  );
}
