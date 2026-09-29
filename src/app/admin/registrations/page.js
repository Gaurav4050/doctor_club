'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Search, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Trash2, 
  RefreshCw, 
  Lock, 
  Eye, 
  ArrowLeft, 
  Check, 
  AlertTriangle,
  Stethoscope,
  ExternalLink,
  MessageCircle,
  Database
} from 'lucide-react';
import ClubEmblem from '@/components/ClubEmblem';

export default function AdminRegistrationsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState('');
  const [cloudConfigured, setCloudConfigured] = useState(true);
  const [showCloudGuide, setShowCloudGuide] = useState(false);

  // Default Admin PIN can be 3456 or 1234
  useEffect(() => {
    const savedAuth = sessionStorage.getItem('aidc_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    const cleanPin = pin.trim();
    if (cleanPin === '3456' || cleanPin === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('aidc_admin_auth', 'true');
      setPinError('');
      fetchData();
    } else {
      setPinError('Incorrect PIN. Please enter 3456 or 1234.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const json = await res.json();
      let serverList = [];
      if (json.success) {
        serverList = json.data || [];
        setCloudConfigured(Boolean(json.cloudConfigured));
      }

      // Check browser localStorage for registrations submitted from this browser
      let localList = [];
      try {
        localList = JSON.parse(localStorage.getItem('aidc_registered_members') || '[]');
      } catch (_) {}

      // Merge server + local records, ensuring no duplicate phone numbers or IDs
      const mergedMap = new Map();
      serverList.forEach(item => {
        const key = item.phone || item.id;
        if (key) mergedMap.set(key, item);
      });

      const missingOnServer = [];
      localList.forEach(item => {
        const key = item.phone || item.id;
        if (key && !mergedMap.has(key)) {
          mergedMap.set(key, { ...item, _isLocalOnly: true });
          missingOnServer.push(item);
        }
      });

      const finalList = Array.from(mergedMap.values());
      setRegistrations(finalList);

      if (json.stats && missingOnServer.length === 0) {
        setStats(json.stats);
      } else {
        setStats({
          total: finalList.length,
          personalClinics: finalList.filter(i => i.clinicType?.toLowerCase().includes('personal')).length,
          hospitalAffiliated: finalList.filter(i => i.clinicType && !i.clinicType.toLowerCase().includes('personal')).length,
          uniqueCities: [...new Set(finalList.map(i => i.city).filter(Boolean))].length,
          batchDistribution: finalList.reduce((acc, i) => { if (i.batchYear) acc[i.batchYear] = (acc[i.batchYear] || 0) + 1; return acc; }, {})
        });
      }

      // If local entries are missing on the server, auto-sync them to the server
      if (missingOnServer.length > 0) {
        syncLocalToServer(missingOnServer);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const syncLocalToServer = async (items) => {
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', data: items })
      });
      const data = await res.json();
      if (data.success && data.addedCount > 0) {
        setMessage(`Synced ${data.addedCount} local registration(s) to server database!`);
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (_) {}
  };

  // Download raw JSON file
  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registrations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aidc_registrations_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setMessage('JSON file successfully downloaded to your computer!');
    setTimeout(() => setMessage(''), 4000);
  };

  // Export to CSV spreadsheet
  const handleExportCSV = () => {
    if (!registrations || registrations.length === 0) return;

    const headers = ["Member ID", "Doctor Name", "Phone", "Email", "Batch Year", "City", "State", "Clinic / Hospital Name", "Practice Type", "Specialization", "Council No", "Registration Date"];
    const rows = registrations.map(d => [
      d.id || "",
      `"${(d.name || "").replace(/"/g, '""')}"`,
      `"${d.phone || ""}"`,
      `"${d.email || ""}"`,
      `"${d.batchYear || ""}"`,
      `"${(d.city || "").replace(/"/g, '""')}"`,
      `"${(d.state || "").replace(/"/g, '""')}"`,
      `"${(d.clinicName || "").replace(/"/g, '""')}"`,
      `"${(d.clinicType || "").replace(/"/g, '""')}"`,
      `"${(d.specialization || "").replace(/"/g, '""')}"`,
      `"${(d.councilNo || "").replace(/"/g, '""')}"`,
      `"${d.registrationDate || ""}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aidc_doctors_list_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Handle Restore / Import JSON
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!Array.isArray(parsed)) {
          alert('Uploaded JSON must contain an array of doctor registrations.');
          return;
        }

        const confirmRestore = confirm(`Are you sure you want to restore ${parsed.length} doctor records? This will update the database.`);
        if (!confirmRestore) return;

        const res = await fetch('/api/admin/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'restore', data: parsed })
        });
        const resJson = await res.json();
        if (resJson.success) {
          setMessage(`Successfully restored ${resJson.count} registrations!`);
          fetchData();
        } else {
          alert(resJson.error || 'Failed to restore data.');
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  // Delete registration
  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to remove registration for ${name} (${id})?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/registrations?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setRegistrations(prev => prev.filter(item => item.id !== id));
        setMessage(`Doctor record ${id} was deleted.`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      alert('Failed to delete registration.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter registrations
  const filtered = registrations.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.phone && item.phone.includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.city && item.city.toLowerCase().includes(q)) ||
      (item.clinicName && item.clinicName.toLowerCase().includes(q)) ||
      (item.id && item.id.toLowerCase().includes(q)) ||
      (item.specialization && item.specialization.toLowerCase().includes(q));

    const matchesType = selectedType === 'ALL' ? true :
      selectedType === 'PERSONAL' ? (item.clinicType && item.clinicType.toLowerCase().includes('personal')) :
      (item.clinicType && !item.clinicType.toLowerCase().includes('personal'));

    const matchesBatch = selectedBatch === 'ALL' ? true : (item.batchYear === selectedBatch);

    return matchesSearch && matchesType && matchesBatch;
  });

  // Extract unique batches for filter
  const batches = [...new Set(registrations.map(i => i.batchYear).filter(Boolean))].sort((a,b) => b - a);

  // If Not Authenticated, show Passcode Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#051020] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-amber-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="flex justify-center mb-4">
            <ClubEmblem size={80} />
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">Admin Access Portal</h1>
          <p className="text-slate-400 text-xs mt-1 mb-6">
            All India Doctors Club Association • Member Directory & Management
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative flex items-center">
              <input
                type="password"
                placeholder="Enter Secret Passcode (3456 or 1234)"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                className="custom-input with-icon text-center text-lg tracking-widest font-mono"
              />
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {pinError && (
              <p className="text-xs text-red-400">{pinError}</p>
            )}

            <button type="submit" className="btn-gold w-full text-sm font-bold py-3.5">
              Unlock Association Records
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-xs text-slate-400 flex justify-between items-center">
            <Link href="/" className="hover:text-amber-400 flex items-center gap-1 transition-colors">
              <ArrowLeft size={14} /> Back to Public Website
            </Link>
            <span className="text-[11px] text-slate-500 font-mono">Protected Portal</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#051020] text-slate-100 p-4 sm:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <ClubEmblem size={64} />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold tracking-wider uppercase border border-amber-400/30">
                  Secret Admin Registry
                </span>
                <span className="text-xs text-slate-400 font-mono">/admin/registrations</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mt-1">
                Doctor Registrations Directory
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm">
                All India Doctors Club Association • Realtime Member Submissions
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft size={14} /> View Main Website
            </Link>

            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition-all"
              title="Download entire JSON database file to computer"
            >
              <Download size={14} /> Download JSON File
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition-all"
              title="Export as Excel / CSV sheet"
            >
              <FileSpreadsheet size={14} /> Export CSV / Excel
            </button>

            <label className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 flex items-center gap-1.5 transition-all cursor-pointer">
              <Upload size={14} /> Restore / Upload JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Persistence Notice Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-blue-950/70 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Database size={18} className={cloudConfigured ? "text-emerald-400 shrink-0" : "text-amber-400 shrink-0"} />
            <div>
              {cloudConfigured ? (
                <>
                  <span className="font-bold text-emerald-300">Cloud Database Connected: </span>
                  <span className="text-slate-300">
                    Registrations are synchronized across all servers and devices permanently.
                  </span>
                </>
              ) : (
                <>
                  <span className="font-bold text-amber-300">Serverless Local Mode: </span>
                  <span className="text-slate-300">
                    Data is stored in local JSON and browser storage. For multi-device cloud persistence on Vercel, connect free Upstash Redis.
                  </span>
                  <button
                    onClick={() => setShowCloudGuide(true)}
                    className="ml-2 text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
                  >
                    View 1-Min Guide
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchData}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh List
            </button>
          </div>
        </div>

        {/* Cloud Guide Modal */}
        {showCloudGuide && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0b172a] border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Database size={20} className="text-amber-400" />
                  <h3 className="font-bold text-white text-base font-heading">
                    Vercel Permanent Cloud Storage Setup (Free)
                  </h3>
                </div>
                <button
                  onClick={() => setShowCloudGuide(false)}
                  className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Because Vercel serverless containers reset between executions, registrations saved on one serverless instance must be stored in a cloud database to be visible to all devices. Upstash Redis is 100% free forever (10,000 requests/day).
              </p>

              <div className="space-y-3 text-xs bg-slate-900/80 p-4 rounded-xl border border-white/5 mb-4">
                <div className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0 text-[11px]">1</span>
                  <div className="text-slate-200">
                    Open your project dashboard on <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-amber-400 underline">vercel.com</a>.
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0 text-[11px]">2</span>
                  <div className="text-slate-200">
                    Click the <strong>Storage</strong> tab at the top &gt; Click <strong>Connect Store</strong> &gt; Select <strong>Upstash Redis</strong> (Free).
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0 text-[11px]">3</span>
                  <div className="text-slate-200">
                    Follow the prompt to connect. Vercel automatically injects <code>KV_REST_API_URL</code> and <code>KV_REST_API_TOKEN</code>!
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold shrink-0 text-[11px]">4</span>
                  <div className="text-slate-200">
                    Redeploy the project. Every registration will now permanently sync across all devices!
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowCloudGuide(false)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="mt-3 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check size={16} /> {message}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="text-slate-400 text-xs font-semibold uppercase">Total Registered</div>
          <div className="text-3xl font-extrabold text-amber-400 font-heading mt-1">
            {stats ? stats.total : registrations.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Enrolled Doctors</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="text-slate-400 text-xs font-semibold uppercase">Personal Clinics</div>
          <div className="text-3xl font-extrabold text-cyan-400 font-heading mt-1">
            {stats ? stats.personalClinics : registrations.filter(r => r.clinicType?.includes('Personal')).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Private Practitioners</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="text-slate-400 text-xs font-semibold uppercase">Hospital Affiliated</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading mt-1">
            {stats ? stats.hospitalAffiliated : registrations.filter(r => !r.clinicType?.includes('Personal')).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Consultants & Staff</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10">
          <div className="text-slate-400 text-xs font-semibold uppercase">Cities Represented</div>
          <div className="text-3xl font-extrabold text-purple-400 font-heading mt-1">
            {stats ? stats.uniqueCities : new Set(registrations.map(r => r.city)).size}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across States</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto glass-panel p-4 rounded-2xl border border-white/10 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96 flex items-center">
          <input
            type="text"
            placeholder="Search by name, phone, city, clinic, batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="custom-input with-icon text-sm py-2.5"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Practice Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="custom-input custom-select text-xs py-2 px-3 w-auto cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">All Practice Types</option>
            <option value="PERSONAL" className="bg-slate-900">Personal Clinics Only</option>
            <option value="HOSPITAL" className="bg-slate-900">Hospital / Institutional</option>
          </select>

          {/* Batch Year Filter */}
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="custom-input custom-select text-xs py-2 px-3 w-auto cursor-pointer"
          >
            <option value="ALL" className="bg-slate-900">All Batches</option>
            {batches.map(b => (
              <option key={b} value={b} className="bg-slate-900">Batch {b}</option>
            ))}
          </select>

          <span className="text-xs text-slate-400 px-2">
            Showing <strong>{filtered.length}</strong> of {registrations.length}
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900/90 text-amber-300 font-semibold uppercase tracking-wider text-[11px] border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Member ID & Doctor</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Batch & Discipline</th>
                <th className="py-3.5 px-4">Clinic / Hospital & Type</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-amber-400" />
                    Loading registered members...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No doctor registrations matched your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Doctor Info */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{item.name}</div>
                      <div className="font-mono text-[11px] text-amber-400/90">{item.id}</div>
                      {item.role && (
                        <span className="inline-block mt-0.5 px-2 py-0.2 text-[10px] rounded bg-amber-400/20 text-amber-300 font-bold">
                          {item.role}
                        </span>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-slate-200">
                        <Phone size={13} className="text-amber-400" />
                        <a href={`tel:${item.phone}`} className="hover:underline">{item.phone}</a>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Mail size={13} className="text-slate-400" />
                        <a href={`mailto:${item.email}`} className="hover:underline truncate max-w-[150px] inline-block">{item.email}</a>
                      </div>
                    </td>

                    {/* Batch & Specialization */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-[11px] font-semibold border border-blue-500/30">
                        <GraduationCap size={12} /> Batch {item.batchYear || 'N/A'}
                      </span>
                      <div className="text-xs text-slate-300 mt-1 font-medium">
                        {item.specialization || item.qualification || 'Doctor'}
                      </div>
                      {item.councilNo && (
                        <div className="text-[10px] text-slate-400">Reg: {item.councilNo}</div>
                      )}
                    </td>

                    {/* Clinic & Type */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{item.clinicName || 'Not specified'}</div>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded mt-1 font-medium ${
                        item.clinicType?.toLowerCase().includes('personal')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.clinicType || 'Private Practice'}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{item.city || 'N/A'}</div>
                      <div className="text-[11px] text-slate-400">{item.state || 'India'}</div>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-400">
                      {item.registrationDate ? new Date(item.registrationDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : 'Registered'}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Direct WhatsApp button */}
                        <a
                          href={`https://wa.me/91${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${item.name}, greetings from All India Doctors Club Association! Your membership ID is ${item.id}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle size={15} />
                        </a>

                        {/* View Card */}
                        <button
                          onClick={() => setSelectedDoctor(item)}
                          className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                          title="View Digital Member Card"
                        >
                          <Eye size={15} />
                        </button>

                        {/* Delete Entry */}
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          disabled={deletingId === item.id}
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                          title="Delete this record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Member Card & Details */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#0a1e3b] border-2 border-amber-400/50 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-amber-400/20 pb-4 mb-4">
              <ClubEmblem size={50} />
              <div>
                <h3 className="font-heading font-bold text-amber-300 text-lg leading-tight">
                  ALL INDIA DOCTORS CLUB ASSOCIATION
                </h3>
                <span className="text-xs text-slate-300">Official Membership Credentials</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs">Member ID:</span>
                  <span className="font-mono text-amber-300 font-bold">{selectedDoctor.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs">Full Name:</span>
                  <span className="text-white font-bold">{selectedDoctor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs">Mobile / WhatsApp:</span>
                  <span className="text-white">{selectedDoctor.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs">Email:</span>
                  <span className="text-white">{selectedDoctor.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs">Passing Batch Year:</span>
                  <span className="text-amber-200">Batch of {selectedDoctor.batchYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs">Specialization:</span>
                  <span className="text-white">{selectedDoctor.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs">Clinic / Workplace:</span>
                  <span className="text-white">{selectedDoctor.clinicName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs">Practice Type:</span>
                  <span className="text-amber-300">{selectedDoctor.clinicType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-xs">City & State:</span>
                  <span className="text-white">{selectedDoctor.city}, {selectedDoctor.state}</span>
                </div>
                {selectedDoctor.address && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Address:</span>
                    <span className="text-slate-300 text-right max-w-xs">{selectedDoctor.address}</span>
                  </div>
                )}
                {selectedDoctor.councilNo && (
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Medical Council Reg:</span>
                    <span className="text-slate-200 font-mono">{selectedDoctor.councilNo}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Close
              </button>
              <a
                href={`tel:${selectedDoctor.phone}`}
                className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 flex items-center gap-1.5"
              >
                <Phone size={14} /> Call Doctor
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
