import fs from 'fs';
import path from 'path';

// Primary file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const PRIMARY_FILE = path.join(DATA_DIR, 'registrations.json');
const TMP_FILE = path.join('/tmp', 'registrations_backup.json');

// Initial seed data with realistic dummy entries so user sees a rich UI immediately
// Initial seed data with realistic doctor entries
const INITIAL_SEED = [
  {
    id: "AIDC-2026-7206",
    name: "Dr. Gaurav Rathore",
    phone: "07742280279",
    email: "gauravsinghrathorerathore+909@gmail.com",
    batchYear: "2023",
    city: "Udaipur",
    state: "Rajasthan",
    address: "Hotel Janak Niwas, Udaipur",
    clinicName: "Anand Hospital",
    clinicType: "Post-Graduate / Resident Doctor",
    councilNo: "RMC/2023/7206",
    specialization: "Orthopedics (MS / DNB Ortho)",
    registrationDate: "2026-09-29T14:15:04.622Z",
    status: "Registered Member"
  },
  {
    id: "AIDC-2026-1001",
    name: "Dr. Ankit Jakhar",
    phone: "7374926939",
    email: "ankit.jakhar@allindiadoctorsclub.org",
    batchYear: "2018",
    qualification: "MBBS, MD (Medicine)",
    city: "Jaipur",
    state: "Rajasthan",
    address: "Doctors Hub, Tonk Road, Jaipur",
    clinicName: "Jakhar Health & Wellness Clinic",
    clinicType: "Personal Clinic (Own Practice)",
    councilNo: "RMC/2018/8421",
    specialization: "General Medicine & Critical Care",
    role: "Founder",
    registrationDate: "2026-01-15T10:30:00.000Z",
    status: "Verified Member"
  },
  {
    id: "AIDC-2026-1002",
    name: "Dr. Dinesh k. Samota",
    phone: "8696772312",
    email: "dinesh.samota@allindiadoctorsclub.org",
    batchYear: "2019",
    qualification: "MBBS, MS (Ortho)",
    city: "Sikar / Jaipur",
    state: "Rajasthan",
    address: "Samota Memorial Ortho Care, Sikar Road",
    clinicName: "Apex Memorial Medical Centre",
    clinicType: "Hospital / Healthcare Institute",
    councilNo: "RMC/2019/9104",
    specialization: "Orthopedics & Joint Care",
    role: "Co-Founder",
    registrationDate: "2026-01-16T11:45:00.000Z",
    status: "Verified Member"
  }
];

// Helper to check if persistent cloud storage is configured
export function isCloudConfigured() {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return Boolean(kvUrl && kvToken);
}

// Helper to determine writeable file path
function getFilePath() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.accessSync(DATA_DIR, fs.constants.W_OK);
    return PRIMARY_FILE;
  } catch (err) {
    // If running in a read-only environment like AWS Lambda / Vercel Serverless
    return TMP_FILE;
  }
}

// In-memory fallback cache for serverless environments
let memoryCache = null;

/**
 * Fetch registrations from persistent cloud store (if configured via env vars)
 * Supports Upstash Redis / Vercel KV / Cloudflare KV / custom REST DB
 */
async function fetchFromCloudKV() {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!kvUrl || !kvToken) {
    return null;
  }

  try {
    const res = await fetch(`${kvUrl}/get/aidc_registrations`, {
      headers: {
        Authorization: `Bearer ${kvToken}`
      },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.result) {
        return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      }
    }
  } catch (e) {
    console.error('Failed to fetch from Cloud KV:', e.message);
  }
  return null;
}

/**
 * Save registrations to persistent cloud store (if configured)
 */
async function saveToCloudKV(registrations) {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!kvUrl || !kvToken) {
    return false;
  }

  try {
    const res = await fetch(`${kvUrl}/set/aidc_registrations`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registrations)
    });
    return res.ok;
  } catch (e) {
    console.error('Failed to save to Cloud KV:', e.message);
    return false;
  }
}

/**
 * Get all registrations
 */
export async function getRegistrations() {
  // 1. Try Cloud KV first if configured
  const cloudData = await fetchFromCloudKV();
  if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
    memoryCache = cloudData;
    try {
      const targetFile = getFilePath();
      fs.writeFileSync(targetFile, JSON.stringify(cloudData, null, 2), 'utf-8');
    } catch (_) {}
    return cloudData;
  }

  // 2. Try Local File
  try {
    if (fs.existsSync(PRIMARY_FILE)) {
      const raw = fs.readFileSync(PRIMARY_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read primary file, checking memory cache or tmp file:', e.message);
  }

  // 3. Try tmp file if primary failed
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch (_) {}

  // 4. Fallback to memory cache
  if (memoryCache && Array.isArray(memoryCache) && memoryCache.length > 0) {
    return memoryCache;
  }

  // Initialize file with seed data
  try {
    const targetFile = getFilePath();
    fs.writeFileSync(targetFile, JSON.stringify(INITIAL_SEED, null, 2), 'utf-8');
  } catch (_) {}

  memoryCache = [...INITIAL_SEED];
  return memoryCache;
}

/**
 * Save a new registration
 */
export async function saveRegistration(registrationData) {
  const currentList = await getRegistrations();

  const newEntry = {
    id: `AIDC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    ...registrationData,
    registrationDate: new Date().toISOString(),
    status: registrationData.status || "Registered Member"
  };

  // Prepend so latest appears first
  const updatedList = [newEntry, ...currentList.filter(item => item.phone !== newEntry.phone)];

  // Update memory cache
  memoryCache = updatedList;

  // 1. Save to Local File / TMP File
  let localSaved = false;
  try {
    fs.writeFileSync(PRIMARY_FILE, JSON.stringify(updatedList, null, 2), 'utf-8');
    localSaved = true;
  } catch (err) {
    try {
      fs.writeFileSync(TMP_FILE, JSON.stringify(updatedList, null, 2), 'utf-8');
      localSaved = true;
    } catch (e2) {
      console.warn('File write error (safely retained in memory cache):', e2.message);
    }
  }

  // 2. Save to Cloud KV (if configured)
  const cloudSaved = await saveToCloudKV(updatedList);

  return {
    success: true,
    data: newEntry,
    total: updatedList.length,
    storageStatus: {
      localSaved,
      cloudSaved,
      cloudConfigured: isCloudConfigured()
    }
  };
}

/**
 * Replace all registrations (for backup import / restore)
 */
export async function setAllRegistrations(newList) {
  if (!Array.isArray(newList)) {
    throw new Error('Data must be an array of registrations');
  }

  memoryCache = newList;

  try {
    fs.writeFileSync(PRIMARY_FILE, JSON.stringify(newList, null, 2), 'utf-8');
  } catch (_) {
    try {
      fs.writeFileSync(TMP_FILE, JSON.stringify(newList, null, 2), 'utf-8');
    } catch (_) {}
  }

  await saveToCloudKV(newList);
  return { success: true, count: newList.length };
}

/**
 * Delete a registration by ID
 */
export async function deleteRegistration(id) {
  const currentList = await getRegistrations();
  const updatedList = currentList.filter(item => item.id !== id);

  memoryCache = updatedList;

  try {
    fs.writeFileSync(PRIMARY_FILE, JSON.stringify(updatedList, null, 2), 'utf-8');
  } catch (_) {
    try {
      fs.writeFileSync(TMP_FILE, JSON.stringify(updatedList, null, 2), 'utf-8');
    } catch (_) {}
  }

  await saveToCloudKV(updatedList);
  return { success: true, count: updatedList.length };
}
