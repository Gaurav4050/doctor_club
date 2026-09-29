# All India Doctors Club Association Portal

A Next.js portal designed around the official **All India Doctors Club Association** poster theme, featuring doctor membership enrolment, JSON persistence, and a dedicated admin portal.

---

## 🌟 Key Features

1. **Poster Themed Aesthetic & Memorial Styling**:
   - Royal Navy Blue (`#07172e`, `#0b2545`) with Rich Gold accents (`#f59e0b`, `#fbbf24`) and subtle medical heartbeat/ECG motifs.
   - Vector Caduceus Association Crest Emblem with doctors silhouette and laurels.
   - The 6 foundational pillars directly from the poster:
     - **Made by Doctors** (Medical Empathy)
     - **For Doctors** (Fraternity First)
     - **For Your Welfare** (Welfare & Rights)
     - **For Your Safety** (24/7 Doctor Safety)
     - **To Give You a Voice** (Collective Voice)
     - **To Unite Together** (Nationwide Unity)
   - Executive Leadership section featuring **Dr. Ankit Jakhar** (Founder, 7374926939) and **Dr. Dinesh k. Samota** (Co-Founder, 8696772312) with 1-click Direct Call & WhatsApp buttons.

2. **Doctor Registration Form**:
   - Full Name (with automatic `Dr.` prefix formatting)
   - Mobile / WhatsApp Number (with validation)
   - Email Address
   - Passing Batch Year (from 1980 to 2026)
   - City, State & Address
   - Practice / Workplace Name
   - Clinic Type: **Personal Clinic (Own Practice)** vs **Working in Hospital/Clinic (Employed)** vs **Visiting Consultant**
   - Specialization / Discipline (MBBS, Physiotherapy, Orthopedics, Dental, Surgery, etc.)
   - State Medical Council Registration No.
   - **Instant Digital Membership Card Generator** upon submission (with Member ID, QR badge, and Print/Save PDF support).

3. **Data Persistence (Zero Data Loss Guarantee)**:
   - All submissions are saved to **`data/registrations.json`**.
   - **How data loss is prevented across redeployments**:
     - **Local / VPS / Docker / PM2**: `data/registrations.json` persists on disk permanently.
     - **Vercel / Serverless**: Serverless functions reset local disk on redeploy. To ensure zero data loss on Vercel, the app includes built-in support for **Upstash Redis / Vercel KV** (`KV_REST_API_URL` & `KV_REST_API_TOKEN`). Just add those 2 variables to Vercel and every submission syncs to the cloud permanently!
     - **1-Click Admin Backup & Restore**: The Admin dashboard includes **"Download JSON File"**, **"Export CSV"**, and **"Restore / Upload JSON"** buttons, so you can backup and restore records anytime with one click.

4. **Hidden Admin Portal (`/admin/registrations`)**:
   - Access URL: [`/admin/registrations`](http://localhost:3000/admin/registrations) (also aliases `/admin` and `/admin/registration`).
   - Protected with an Admin PIN (Default: `1234`).
   - Real-time search across names, phone numbers, cities, clinics, and batches.
   - Filter by Practice Type (Personal Clinics vs Hospitals) and Batch Year.
   - Live metrics: Total Registered, Personal Clinics count, Hospital count, Cities represented.
   - 1-Click WhatsApp messaging to any registered doctor with a pre-filled greeting.
   - View Doctor Credentials modal and delete record support.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser:
http://localhost:3000
```

Admin URL: `http://localhost:3000/admin/registrations` (PIN: `1234`)
