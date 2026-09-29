'use client';

import { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  GraduationCap, 
  MapPin, 
  Building2, 
  Stethoscope, 
  FileCheck, 
  CheckCircle2, 
  Download, 
  Printer, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import ClubEmblem from './ClubEmblem';

export default function RegistrationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    batchYear: new Date().getFullYear().toString(),
    city: '',
    state: 'Rajasthan',
    address: '',
    clinicName: '',
    clinicType: 'Personal Clinic (Own Practice)',
    specialization: 'MBBS / General Physician',
    councilNo: '',
    agreeTerms: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredData, setRegisteredData] = useState(null);

  const batchYears = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1980; y--) {
    batchYears.push(y.toString());
  }

  const specializationOptions = [
    "MBBS / General Medicine",
    "Physiotherapy (BPT / MPT)",
    "Orthopedics (MS / DNB Ortho)",
    "General Surgery / Laparoscopic",
    "Pediatrics & Child Health",
    "Obstetrics & Gynecology (OB-GYN)",
    "Dental Surgery (BDS / MDS)",
    "Cardiology / Critical Care",
    "Dermatology & Cosmetology",
    "Radiology / Pathology",
    "Anesthesiology & Pain Medicine",
    "Ayurveda / Homeopathy (AYUSH)",
    "Junior / Senior Resident Doctor",
    "Other Specialization"
  ];

  const indianStates = [
    "Rajasthan", "Delhi NCR", "Maharashtra", "Gujarat", "Uttar Pradesh",
    "Madhya Pradesh", "Haryana", "Punjab", "Bihar", "West Bengal",
    "Karnataka", "Tamil Nadu", "Telangana", "Kerala", "Uttarakhand",
    "Himachal Pradesh", "Jharkhand", "Assam", "Odisha", "Other State"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!formData.name.trim()) {
      setError('Please enter your full name with Dr. prefix');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Please provide a valid 10-digit mobile / WhatsApp number');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please provide your city/district');
      return;
    }
    if (!formData.clinicName.trim()) {
      setError('Please provide the clinic or hospital name');
      return;
    }

    setLoading(true);

    try {
      // Ensure name has "Dr." if missing
      const formattedName = formData.name.toLowerCase().startsWith('dr.') || formData.name.toLowerCase().startsWith('dr ')
        ? formData.name 
        : `Dr. ${formData.name.trim()}`;

      const payload = {
        ...formData,
        name: formattedName
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Also persist in browser localStorage as an instant client backup
        try {
          const existingLocal = JSON.parse(localStorage.getItem('aidc_registered_members') || '[]');
          const updatedLocal = [
            result.data,
            ...existingLocal.filter(item => item.phone !== result.data.phone && item.id !== result.data.id)
          ];
          localStorage.setItem('aidc_registered_members', JSON.stringify(updatedLocal));
        } catch (_) {}

        setRegisteredData(result.data);
        if (onSuccess) onSuccess(result.data);
      } else {
        setError(result.error || 'Failed to submit registration. Please try again.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      setError('Network error. Could not connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'All India Doctors Club Association',
        text: `I just registered as an official member of All India Doctors Club Association! Join the strongest medical network across India.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard! Share it with fellow doctors.');
    }
  };

  // If registered successfully, display Membership Confirmation & Digital Card
  if (registeredData) {
    return (
      <div className="w-full max-w-3xl mx-auto p-6 md:p-8 rounded-2xl glass-panel border border-amber-500/40 shadow-2xl relative overflow-hidden animate-fadeIn">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={36} />
          </div>
          <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
            Membership Confirmed & Saved
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading">
            Welcome to the Fraternity, <br />
            <span className="text-gold-gradient">{registeredData.name}</span>
          </h2>
          <p className="text-slate-300 text-sm mt-2 max-w-lg mx-auto">
            Your registration is securely recorded in the official association records. Your digital membership credential has been generated below.
          </p>
        </div>

        {/* Digital Membership ID Card */}
        <div className="id-card-print-target relative bg-gradient-to-br from-[#0c2447] via-[#091a33] to-[#040e1d] rounded-2xl border-2 border-amber-400/60 p-4 sm:p-6 md:p-8 text-white shadow-2xl mb-8 overflow-hidden">
          {/* Card Header Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border-b border-amber-400/25 pb-4 sm:pb-5 text-center sm:text-left">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <ClubEmblem size={44} className="sm:hidden shrink-0" />
              <ClubEmblem size={56} className="hidden sm:inline-flex shrink-0" />
              <div>
                <h3 className="font-heading font-black tracking-wide text-amber-300 text-sm sm:text-base md:text-lg leading-tight">
                  ALL INDIA DOCTORS CLUB
                </h3>
                <p className="text-[9px] sm:text-[11px] font-semibold tracking-wider text-slate-300 uppercase">
                  Association • Official Member Card
                </p>
              </div>
            </div>
            <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1">
              <span className="text-[10px] tracking-wider text-amber-200/70 font-mono uppercase">Member ID</span>
              <span className="font-mono text-xs sm:text-base font-bold px-2.5 py-1 bg-amber-400/10 border border-amber-400/40 text-amber-300 rounded-md">
                {registeredData.id}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 items-center">
            {/* Doctor Profile Mini Avatar */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-slate-700/50">
              <div className="w-20 h-20 rounded-full border-2 border-amber-400/80 p-1 mb-2 bg-gradient-to-b from-blue-900 to-slate-900 flex items-center justify-center">
                <Stethoscope size={36} className="text-amber-400" />
              </div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} /> ACTIVE MEMBER
              </span>
              <span className="text-[11px] text-slate-400 mt-1">Batch of {registeredData.batchYear}</span>
            </div>

            {/* Doctor Credentials */}
            <div className="md:col-span-2 space-y-2.5">
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Doctor Name</div>
                <div className="text-lg md:text-xl font-bold text-white font-heading">{registeredData.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Specialization</span>
                  <span className="text-amber-200 font-medium">{registeredData.specialization}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Clinic / Hospital</span>
                  <span className="text-slate-200 font-medium truncate block">{registeredData.clinicName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Practice Type</span>
                  <span className="text-slate-200 font-medium">{registeredData.clinicType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Location</span>
                  <span className="text-slate-200 font-medium">{registeredData.city}, {registeredData.state}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>
              <span>Motto: </span>
              <strong className="text-amber-300">Created by Doctors • For Doctors</strong>
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              Registered: {new Date(registeredData.registrationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 no-print w-full">
          <button
            onClick={handlePrint}
            className="btn-gold text-xs sm:text-sm py-2.5 px-5 w-full sm:w-auto"
          >
            <Printer size={16} /> Print / Save PDF
          </button>

          <button
            onClick={handleShare}
            className="btn-outline-gold text-xs sm:text-sm py-2.5 px-5 w-full sm:w-auto justify-center"
          >
            <Share2 size={16} /> Share With Doctors
          </button>

          <button
            onClick={() => {
              setRegisteredData(null);
              setFormData({
                name: '',
                phone: '',
                email: '',
                batchYear: new Date().getFullYear().toString(),
                city: '',
                state: 'Rajasthan',
                address: '',
                clinicName: '',
                clinicType: 'Personal Clinic (Own Practice)',
                specialization: 'MBBS / General Physician',
                councilNo: '',
                agreeTerms: true
              });
            }}
            className="text-slate-400 hover:text-white text-xs px-4 py-2 flex items-center justify-center gap-1 transition-colors w-full sm:w-auto"
          >
            <RefreshCw size={14} /> Register Another Doctor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="registration-section" className="w-full max-w-3xl mx-auto rounded-3xl glass-panel p-6 sm:p-10 border border-amber-500/30 relative">
      {/* Top Banner Ribbon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wider uppercase mb-3">
          <Sparkles size={14} className="text-amber-400 animate-pulse" />
          Official Doctor Enrolment Portal
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
          Join All India Doctors Club
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl mx-auto">
          Stronger Together for a Better Tomorrow. Fill in your medical credentials to become an official member of the nationwide association.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-sm flex items-start gap-3">
          <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Doctor Personal & Contact */}
        <div className="bg-slate-900/50 p-5 sm:p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider mb-2">
            <User size={16} /> 1. Doctor Information
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="name"
                  placeholder="Dr. Ankit Kumar"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="custom-input with-icon"
                />
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mobile / WhatsApp Number <span className="text-amber-400">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="tel"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="custom-input with-icon"
                />
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Used for association circulars & verification</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-amber-400">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  name="email"
                  placeholder="doctor@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="custom-input with-icon"
                />
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Passing Batch Year <span className="text-amber-400">*</span>
              </label>
              <div className="relative flex items-center">
                <select
                  name="batchYear"
                  value={formData.batchYear}
                  onChange={handleChange}
                  className="custom-input custom-select with-icon cursor-pointer"
                >
                  {batchYears.map(yr => (
                    <option key={yr} value={yr} className="bg-slate-900 text-white">
                      Batch of {yr}
                    </option>
                  ))}
                </select>
                <GraduationCap size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Practice & Hospital */}
        <div className="bg-slate-900/50 p-5 sm:p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider mb-2">
            <Building2 size={16} /> 2. Practice & Clinical Workplace
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Clinic / Hospital Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="clinicName"
                  placeholder="e.g. LifeCare Clinic or District Hospital"
                  value={formData.clinicName}
                  onChange={handleChange}
                  required
                  className="custom-input with-icon"
                />
                <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Practice Category <span className="text-amber-400">*</span>
              </label>
              <div className="relative flex items-center">
                <select
                  name="clinicType"
                  value={formData.clinicType}
                  onChange={handleChange}
                  className="custom-input custom-select with-icon cursor-pointer"
                >
                  <option value="Personal Clinic (Own Practice)" className="bg-slate-900 text-white">
                    Personal Clinic (Own Practice)
                  </option>
                  <option value="Working in Hospital / Clinic (Employed)" className="bg-slate-900 text-white">
                    Working in Hospital / Clinic (Employed)
                  </option>
                  <option value="Visiting Consultant / Multi-Centre" className="bg-slate-900 text-white">
                    Visiting Consultant / Multi-Centre
                  </option>
                  <option value="Academic / Medical College Faculty" className="bg-slate-900 text-white">
                    Academic / Medical College Faculty
                  </option>
                  <option value="Post-Graduate / Resident Doctor" className="bg-slate-900 text-white">
                    Post-Graduate / Resident Doctor
                  </option>
                </select>
                <Stethoscope size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Medical Specialization / Discipline <span className="text-amber-400">*</span>
              </label>
              <div className="relative flex items-center">
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="custom-input custom-select with-icon cursor-pointer"
                >
                  {specializationOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
                <Stethoscope size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                State Medical Council No. <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="councilNo"
                  placeholder="e.g. RMC/2021/10492"
                  value={formData.councilNo}
                  onChange={handleChange}
                  className="custom-input with-icon"
                />
                <FileCheck size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Address & Location */}
        <div className="bg-slate-900/50 p-5 sm:p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-bold uppercase tracking-wider mb-2">
            <MapPin size={16} /> 3. Location Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                City / Town <span className="text-amber-400">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="city"
                  placeholder="e.g. Jaipur, Sikar, Kota, Delhi"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="custom-input with-icon"
                />
                <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                State <span className="text-amber-400">*</span>
              </label>
              <div className="relative flex items-center">
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="custom-input custom-select with-icon cursor-pointer"
                >
                  {indianStates.map((st) => (
                    <option key={st} value={st} className="bg-slate-900 text-white">
                      {st}
                    </option>
                  ))}
                </select>
                <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Clinic / Residential Address
            </label>
            <input
              type="text"
              name="address"
              placeholder="Building name, Street, Landmark"
              value={formData.address}
              onChange={handleChange}
              className="custom-input"
            />
          </div>
        </div>

        {/* Association Pledge / Terms */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300 flex items-start gap-3">
          <input
            type="checkbox"
            name="agreeTerms"
            id="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            required
            className="mt-1 h-4 w-4 rounded border-amber-400 text-amber-500 focus:ring-amber-400 cursor-pointer"
          />
          <label htmlFor="agreeTerms" className="cursor-pointer leading-relaxed">
            I hereby certify that I am a medical / healthcare professional and agree to stand in unity with the aims and objectives of the <strong>All India Doctors Club Association</strong>: Welfare, Safety, Mutual Growth, and One Voice for Doctors.
          </label>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full sm:w-auto text-base py-4 px-10 rounded-full font-bold shadow-xl transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw size={18} className="animate-spin" />
                Registering & Generating Member ID...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Register as Official Member <ArrowRight size={18} />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
