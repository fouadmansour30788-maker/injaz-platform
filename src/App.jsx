// ═══════════════════════════════════════════════════════════════
//  INJAZ Lebanon Career Platform v2.0
//  Light professional design | Mobile-first | Admin + Journey
//  Stack: React + Supabase + Gemini AI (free)
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase ──────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ── Gemini AI ─────────────────────────────────────────────────
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

async function callGemini(prompt) {
  if (!GEMINI_KEY) throw new Error("AI not configured");
  const res = await fetch(GEMINI_URL, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "AI error");
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ── Admin emails ──────────────────────────────────────────────
const ADMIN_EMAILS = ["fouadmansour307@gmail.com", "admin@injazlebanon.org", "fouad.mansour@injazlebanon.org"];

// ── Design tokens ─────────────────────────────────────────────
const C = {
  bg: "#080F1E", bgCard: "rgba(14,25,45,0.9)", bgSidebar: "#0A1525",
  border: "rgba(201,168,76,0.2)", borderLight: "rgba(255,255,255,0.06)",
  text: "#F0EBE0", textSub: "#8A9BB5", textMuted: "#4A5A72",
  primary: "#C9A84C", primaryLight: "rgba(201,168,76,0.12)", primaryDark: "#A88830",
  accent: "#2980B9", accentLight: "rgba(41,128,185,0.12)",
  green: "#27AE60", greenLight: "rgba(39,174,96,0.12)",
  amber: "#C9A84C", amberLight: "rgba(201,168,76,0.12)",
  purple: "#9B59B6", purpleLight: "rgba(155,89,182,0.12)",
  shadow: "0 4px 20px rgba(0,0,0,0.4)",
  shadowMd: "0 8px 32px rgba(0,0,0,0.5)",
  shadowLg: "0 20px 60px rgba(0,0,0,0.6)",
  radius: "14px", radiusSm: "10px", radiusLg: "20px",
};

// ── Auth context ──────────────────────────────────────────────
const AuthCtx = createContext(null);
const useAuth = () => useContext(AuthCtx);

// ── Global styles ─────────────────────────────────────────────
const globalStyles = `
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes rotateSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes goldShimmer { 0%,100%{opacity:.7} 50%{opacity:1} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes slideIn { from { transform:translateX(-100%); } to { transform:translateX(0); } }
  @keyframes progressFill { from { width:0; } to { width:var(--w); } }
  @keyframes journeyPulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,57,43,.3)} 50%{box-shadow:0 0 0 8px rgba(200,57,43,0)} }

  * { box-sizing: border-box; }
  body { margin:0; background:${C.bg}; font-family:'DM Sans',sans-serif; }
  body::before { content:''; position:fixed; inset:0; background-image:repeating-linear-gradient(45deg,rgba(201,168,76,0.015) 0px,rgba(201,168,76,0.015) 1px,transparent 1px,transparent 60px),repeating-linear-gradient(-45deg,rgba(201,168,76,0.015) 0px,rgba(201,168,76,0.015) 1px,transparent 1px,transparent 60px); pointer-events:none; z-index:0; }
  #root { position:relative; z-index:1; }
  button { font-family:'DM Sans',sans-serif; cursor:pointer; border:none; outline:none; }
  input, select, textarea { font-family:'DM Sans',sans-serif; outline:none; }
  a { text-decoration:none; color:inherit; }

  .btn-primary {
    background:linear-gradient(135deg,#C9A84C,#E8C96A); color:#060E1C; border-radius:${C.radiusSm};
    padding:10px 20px; font-size:14px; font-weight:700;
    transition:all .25s; display:inline-flex; align-items:center; gap:8px;
  }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(201,168,76,0.4); }
  .btn-primary:active { transform:translateY(0); }

  .btn-secondary {
    background:rgba(255,255,255,0.04); color:${C.textSub}; border:1px solid rgba(255,255,255,0.1);
    border-radius:${C.radiusSm}; padding:10px 20px; font-size:14px; font-weight:500;
    transition:all .2s; display:inline-flex; align-items:center; gap:8px;
  }
  .btn-secondary:hover { border-color:rgba(201,168,76,0.4); color:#C9A84C; background:rgba(201,168,76,0.08); }

  .btn-ghost {
    background:transparent; color:${C.textSub}; border-radius:${C.radiusSm};
    padding:8px 14px; font-size:13px; font-weight:500; transition:all .2s;
    display:inline-flex; align-items:center; gap:6px;
  }
  .btn-ghost:hover { background:${C.borderLight}; color:${C.text}; }

  .input-field {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
    border-radius:${C.radiusSm}; padding:10px 14px; font-size:14px; color:${C.text};
    transition:all .2s; font-family:'DM Sans',sans-serif;
  }
  .input-field:focus { border-color:#C9A84C; box-shadow:0 0 0 3px rgba(201,168,76,0.1); background:rgba(201,168,76,0.04); }
  .input-field::placeholder { color:${C.textMuted}; }

  .select-field {
    width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1);
    border-radius:${C.radiusSm}; padding:10px 14px; font-size:14px; color:${C.text};
    transition:all .2s; appearance:none;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B6B80' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 14px center;
  }
  .select-field:focus { border-color:${C.primary}; box-shadow:0 0 0 3px ${C.primaryLight}; }

  .card {
    background:rgba(14,25,45,0.8); border-radius:${C.radius}; border:1px solid rgba(201,168,76,0.15);
    box-shadow:0 8px 32px rgba(0,0,0,0.4); padding:24px; backdrop-filter:blur(20px);
  }

  .nav-item {
    display:flex; align-items:center; gap:10px; padding:10px 14px;
    border-radius:${C.radiusSm}; font-size:14px; font-weight:500; color:${C.textSub};
    transition:all .15s; cursor:pointer; width:100%; background:transparent; border:none;
    text-align:left;
  }
  .nav-item:hover { background:${C.borderLight}; color:${C.text}; }
  .nav-item.active { background:rgba(201,168,76,0.1); color:#C9A84C; font-weight:600; border:1px solid rgba(201,168,76,0.2); }
  .nav-item .nav-icon { font-size:17px; width:22px; text-align:center; }

  .badge {
    display:inline-flex; align-items:center; padding:3px 10px;
    border-radius:20px; font-size:11px; font-weight:600; letter-spacing:.3px;
  }
  .badge-green { background:rgba(39,174,96,0.12); color:#4AE08A; border:1px solid rgba(39,174,96,0.25); }
  .badge-red { background:rgba(200,57,43,0.12); color:#FF8A80; border:1px solid rgba(200,57,43,0.25); }
  .badge-blue { background:rgba(41,128,185,0.12); color:#74B9FF; border:1px solid rgba(41,128,185,0.25); }
  .badge-amber { background:rgba(201,168,76,0.12); color:#C9A84C; border:1px solid rgba(201,168,76,0.25); }
  .badge-purple { background:${C.purpleLight}; color:${C.purple}; }
  .badge-gray { background:rgba(255,255,255,0.05); color:${C.textSub}; border:1px solid rgba(255,255,255,0.08); }

  .tag {
    display:inline-flex; align-items:center; gap:4px; padding:4px 10px;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:20px; font-size:12px; color:${C.textSub};
  }

  .stat-card {
    background:#fff; border-radius:${C.radius}; border:1px solid ${C.border};
    padding:20px; display:flex; flex-direction:column; gap:6px;
    transition:all .2s; box-shadow:${C.shadow};
  }
  .stat-card:hover { box-shadow:${C.shadowMd}; transform:translateY(-2px); }

  .tab { padding:8px 16px; border-radius:${C.radiusSm}; font-size:13px; font-weight:500;
    color:${C.textSub}; cursor:pointer; transition:all .15s; background:transparent; border:none; }
  .tab.active { background:${C.primaryLight}; color:${C.primary}; font-weight:600; }
  .tab:hover:not(.active) { background:${C.borderLight}; color:${C.text}; }

  /* Mobile overlay */
  .mobile-overlay { display:none; }
  @media(max-width:768px) {
    .mobile-overlay { display:block; position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:40; }
    .sidebar { transform:translateX(-100%); transition:transform .3s; z-index:50 !important; }
    .sidebar.open { transform:translateX(0) !important; }
  }

  /* Toast */
  .toast {
    position:fixed; bottom:24px; right:24px; padding:14px 20px; border-radius:${C.radius};
    font-size:14px; font-weight:500; display:flex; align-items:center; gap:10px;
    box-shadow:${C.shadowLg}; z-index:1000; animation:fadeUp .3s ease;
    max-width:360px; border:1px solid transparent;
  }
  .toast-success { background:rgba(39,174,96,0.12); border-color:rgba(39,174,96,0.3); color:#4AE08A; backdrop-filter:blur(20px); }
  .toast-error { background:rgba(200,57,43,0.12); border-color:rgba(200,57,43,0.3); color:#FF8A80; backdrop-filter:blur(20px); }
  .toast-info { background:rgba(201,168,76,0.1); border-color:rgba(201,168,76,0.25); color:#C9A84C; backdrop-filter:blur(20px); }

  /* Journey timeline */
  .journey-step { position:relative; padding-left:48px; padding-bottom:28px; }
  .journey-step:last-child { padding-bottom:0; }
  .journey-step::before {
    content:''; position:absolute; left:19px; top:36px; bottom:0;
    width:2px; background:${C.border};
  }
  .journey-step:last-child::before { display:none; }
  .journey-node {
    position:absolute; left:0; top:0; width:38px; height:38px;
    border-radius:50%; display:flex; align-items:center; justify-content:center;
    font-size:16px; border:2px solid transparent; font-weight:700;
  }
  .journey-node.done { background:${C.green}; color:#fff; border-color:${C.green}; }
  .journey-node.active { background:#fff; color:${C.primary}; border-color:${C.primary}; animation:journeyPulse 2s infinite; }
  .journey-node.locked { background:${C.borderLight}; color:${C.textMuted}; border-color:${C.border}; }

  /* Scrollbar */
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.3); border-radius:10px; }

  /* Animations */
  .fade-up { animation:fadeUp .4s ease both; }
  .fade-up-1 { animation:fadeUp .4s .05s ease both; }
  .fade-up-2 { animation:fadeUp .4s .1s ease both; }
  .fade-up-3 { animation:fadeUp .4s .15s ease both; }
  .fade-up-4 { animation:fadeUp .4s .2s ease both; }

  /* Responsive grid */
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
  .grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
  .grid-4 { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:14px; }
  @media(max-width:900px) { .grid-4 { grid-template-columns:1fr 1fr; } .grid-3 { grid-template-columns:1fr 1fr; } }
  @media(max-width:600px) { .grid-2,.grid-3,.grid-4 { grid-template-columns:1fr; } }
`;

// ── Toast hook ────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  return { toast, showSuccess: m => show(m, "success"), showError: m => show(m, "error"), showInfo: m => show(m, "info") };
}

function Toast({ toast }) {
  if (!toast) return null;
  const icon = toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ";
  const color = toast.type === "success" ? C.green : toast.type === "error" ? C.primary : C.accent;
  return (
    <div className={`toast toast-${toast.type}`}>
      <span style={{ width: 24, height: 24, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{icon}</span>
      {toast.msg}
    </div>
  );
}

// ── Database layer ────────────────────────────────────────────
const db = {
  async signUp(email, password, meta) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: meta } });
    if (error) throw error;
    return data;
  },
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  async signOut() { await supabase.auth.signOut(); window.location.href = "/"; },
  async getSession() { const { data } = await supabase.auth.getSession(); return data.session; },
  async getSeekerProfile(uid) {
    const { data } = await supabase.from("job_seekers").select("*").eq("user_id", uid).single();
    return data;
  },
  async getEmployerProfile(uid) {
    const { data } = await supabase.from("employers").select("*").eq("user_id", uid).single();
    return data;
  },
  async updateSeekerProfile(id, updates) {
    const { error } = await supabase.from("job_seekers").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },
  async updateEmployerProfile(id, updates) {
    const { error } = await supabase.from("employers").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
  },
  async getSeekerSkills(seekerId) {
    const { data } = await supabase.from("seeker_skills").select("skill_name").eq("seeker_id", seekerId);
    return (data || []).map(s => s.skill_name);
  },
  async upsertSkills(seekerId, skills) {
    await supabase.from("seeker_skills").delete().eq("seeker_id", seekerId);
    if (skills.length > 0) {
      await supabase.from("seeker_skills").insert(skills.map(s => ({ seeker_id: seekerId, skill_name: s })));
    }
  },
  async getActivePostings() {
    const { data } = await supabase.from("postings").select("*, employers(org_name,governorate)").eq("status", "active").order("created_at", { ascending: false });
    return data || [];
  },
  async getEmployerPostings(employerId) {
    const { data } = await supabase.from("postings").select("*").eq("employer_id", employerId).order("created_at", { ascending: false });
    return data || [];
  },
  async createPosting(posting) {
    const { data, error } = await supabase.from("postings").insert(posting).select().single();
    if (error) throw error;
    return data;
  },
  async updatePosting(id, updates) {
    const { error } = await supabase.from("postings").update(updates).eq("id", id);
    if (error) throw error;
  },
  async getApplications(seekerId) {
    const { data } = await supabase.from("applications").select("*, postings(title, employers(org_name))").eq("seeker_id", seekerId).order("created_at", { ascending: false });
    return data || [];
  },
  async applyToJob(seekerId, postingId, coverLetter) {
    const { error } = await supabase.from("applications").insert({ seeker_id: seekerId, posting_id: postingId, cover_letter: coverLetter, status: "applied" });
    if (error) throw error;
  },
  async getPlatformStats() {
    const [seekers, postings, apps] = await Promise.all([
      supabase.from("job_seekers").select("id", { count: "exact", head: true }),
      supabase.from("postings").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("applications").select("id", { count: "exact", head: true }),
    ]);
    return { seekers: seekers.count || 0, postings: postings.count || 0, applications: apps.count || 0 };
  },
  // Admin
  async getAllUsers() {
    const [seekers, employers] = await Promise.all([
      supabase.from("job_seekers").select("*").order("created_at", { ascending: false }),
      supabase.from("employers").select("*").order("created_at", { ascending: false }),
    ]);
    return { seekers: seekers.data || [], employers: employers.data || [] };
  },
  async getAllPostings() {
    const { data } = await supabase.from("postings").select("*, employers(org_name)").order("created_at", { ascending: false });
    return data || [];
  },
  async updatePostingStatus(id, status) {
    await supabase.from("postings").update({ status }).eq("id", id);
  },
  // Journey
  async getJourney(seekerId) {
    const { data } = await supabase.from("job_seekers").select("journey_stage, journey_data, journey_updated_at").eq("id", seekerId).single();
    return data;
  },
  async updateJourney(seekerId, stage, journeyData) {
    const { error } = await supabase.from("job_seekers").update({
      journey_stage: stage, journey_data: journeyData,
      journey_updated_at: new Date().toISOString()
    }).eq("id", seekerId);
    if (error) throw error;
  },
};

// ── AI layer ──────────────────────────────────────────────────
const ai = {
  async generateCoverLetter(jobTitle, orgName, skills, name, candidateSkills, tone, language) {
    const tones = { formal: "professional and formal", youth: "enthusiastic and youth-friendly", ngo: "mission-driven and NGO-focused" };
    const prompt = `Write a cover letter in ${language} for ${name} applying for ${jobTitle} at ${orgName}.
Tone: ${tones[tone] || "professional"}. Candidate skills: ${candidateSkills.join(", ")}. Required skills: ${skills.join(", ")}.
Write 3-4 paragraphs. Return only the letter.`;
    return await callGemini(prompt);
  },
  async getInterviewFeedback(question, answer, type, jobTitle) {
    const prompt = `You are an interview coach. Evaluate this answer. Return ONLY valid JSON, no markdown.
Job: ${jobTitle}. Type: ${type}. Question: ${question}. Answer: ${answer}.
Return: {"clarity_score":80,"relevance_score":75,"confidence_score":70,"overall_score":75,"tip":"specific tip","strength":"what was good"}`;
    const text = await callGemini(prompt);
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  },
  async reviewCV(cvText, sector) {
    const prompt = `You are a CV expert. Review this CV for ${sector} sector. Return ONLY valid JSON, no markdown.
CV: ${cvText.slice(0, 3000)}
Return: {"ats_score":75,"overall_verdict":"summary","top_suggestions":["s1","s2","s3"],"missing_sections":["s1"],"strongest_section":"Work Experience"}`;
    const text = await callGemini(prompt);
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  },
  computeMatchScore(seeker, posting) {
    const seekerSkills = new Set((seeker.skills || []).map(s => s.toLowerCase()));
    const required = posting.required_skills || [];
    const matched = required.filter(s => seekerSkills.has(s.toLowerCase()));
    const skillScore = required.length > 0 ? (matched.length / required.length) * 100 : 50;
    const gaps = required.filter(s => !seekerSkills.has(s.toLowerCase()));
    const expScore = (seeker.years_experience || 0) >= (posting.min_experience_years || 0) ? 90 : 50;
    const locScore = posting.work_mode === "remote" ? 100 : seeker.governorate === posting.governorate ? 100 : 65;
    const total = Math.round(skillScore * 0.5 + expScore * 0.3 + locScore * 0.2);
    return { total: Math.min(100, total), matched, gaps };
  },
};

// ── Journey stages ────────────────────────────────────────────
const JOURNEY_STAGES = [
  { id: "registered", label: "Registered", icon: "👤", desc: "Account created and verified", color: C.green },
  { id: "profile_complete", label: "Profile Complete", icon: "📋", desc: "Profile filled to 80%+", color: C.accent },
  { id: "cv_uploaded", label: "CV Ready", icon: "📄", desc: "CV uploaded and reviewed", color: C.purple },
  { id: "training", label: "INJAZ Training", icon: "🎓", desc: "Completed INJAZ workshops", color: C.amber },
  { id: "job_searching", label: "Job Searching", icon: "🔍", desc: "Actively applying to positions", color: C.primary },
  { id: "interviewing", label: "Interviewing", icon: "🤝", desc: "In interviews with employers", color: C.accent },
  { id: "placed", label: "Placed! 🎉", icon: "⭐", desc: "Successfully hired or placed", color: C.green },
];

// ── Helper components ─────────────────────────────────────────
function Spinner({ size = 20, color = C.primary }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${color}22`, borderTopColor: color, animation: "spin .7s linear infinite", flexShrink: 0 }} />;
}

function Label({ children, required }) {
  return <label style={{ fontSize: 12, fontWeight: 600, color: C.textSub, letterSpacing: ".4px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>{children}{required && <span style={{ color: C.primary }}> *</span>}</label>;
}

function ProgressBar({ value, max = 100, color = C.primary, height = 6 }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ background: C.borderLight, borderRadius: 99, height, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width .6s ease" }} />
    </div>
  );
}

function ScoreRing({ score, size = 64 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const color = score >= 75 ? C.green : score >= 50 ? C.amber : C.primary;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.borderLight} strokeWidth={5} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .8s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size / 4, fontWeight: 700, color }}>{score}%</div>
    </div>
  );
}

function StatCard({ label, value, icon, color, delay = 0 }) {
  return (
    <div className="stat-card fade-up" style={{ animationDelay: `${delay}s` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 22 }}>{icon}</div>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: C.text, fontFamily: "'Playfair Display', serif" }}>{value}</div>
      <div style={{ fontSize: 12, color: C.textSub, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

// ── Setup error screen ────────────────────────────────────────
function SetupError() {
  return (
    <div style={{ minHeight: "100vh", background: "#080F1E", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{globalStyles}</style>
      <div className="card" style={{ maxWidth: 480, textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 12, color: C.text }}>Setup Required</h2>
        <p style={{ color: C.textSub, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
          Add these environment variables in Vercel → Settings → Environment Variables:
        </p>
        <div style={{ background: C.bg, borderRadius: C.radiusSm, padding: 16, textAlign: "left", fontFamily: "monospace", fontSize: 13, color: C.accent, lineHeight: 2 }}>
          <div>VITE_SUPABASE_URL</div>
          <div>VITE_SUPABASE_ANON_KEY</div>
          <div>VITE_GEMINI_API_KEY</div>
        </div>
      </div>
    </div>
  );
}

// ── Auth screen ───────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("seeker");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ email: "", password: "", full_name: "", org_name: "", governorate: "", sector: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const govs = ["Beirut", "Mount Lebanon", "North Lebanon", "South Lebanon", "Bekaa", "Nabatieh", "Akkar", "Baalbek-Hermel"];
  const sectors = ["Technology", "Education", "Healthcare", "NGO", "Finance", "Marketing", "Engineering", "Construction", "Hospitality", "Other"];

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        await db.signIn(form.email, form.password);
      } else {
        await db.signUp(form.email, form.password, { role, full_name: form.full_name, org_name: form.org_name, governorate: form.governorate, sector: form.sector });
        setSuccess("Account created! Please check your email to verify your account, then sign in.");
        setMode("login"); setStep(1);
      }
    } catch (e) { setError(e.message || "Something went wrong"); }
    finally { setLoading(false); }
  };

  const handleReset = async () => {
    if (!form.email) { setError("Enter your email first"); return; }
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(form.email);
    setSuccess("Password reset link sent to your email.");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080F1E", display: "flex" }}>
      <style>{globalStyles}</style>
      {/* Left panel */}
      <div style={{ flex: "0 0 480px", background: "linear-gradient(160deg, #0A1628 0%, #050B14 100%)", padding: 60, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#fff", fontWeight: 700, marginBottom: 8 }}>INJAZ</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", letterSpacing: 2, textTransform: "uppercase" }}>Lebanon Career Platform</div>
        </div>
        <div>
          <div style={{ fontSize: 42, fontFamily: "'Playfair Display', serif", color: "#fff", fontWeight: 600, lineHeight: 1.3, marginBottom: 24 }}>
            Your career journey starts here.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[["🎯", "AI-powered job matching"], ["📄", "CV review & optimization"], ["🎓", "Interview coaching"], ["📊", "Career journey tracking"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,.85)", fontSize: 14 }}>
                <span style={{ fontSize: 20 }}>{icon}</span>{text}
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>© 2025 INJAZ Lebanon. All rights reserved.</div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: C.text, marginBottom: 6 }}>
            {mode === "login" ? "Welcome back" : step === 1 ? "Create account" : "Complete profile"}
          </h2>
          <p style={{ color: C.textSub, fontSize: 14, marginBottom: 32 }}>
            {mode === "login" ? "Sign in to your INJAZ account" : step === 1 ? "Join thousands of Lebanese professionals" : "Tell us more about yourself"}
          </p>

          {error && <div style={{ background: C.primaryLight, border: `1px solid ${C.primary}`, borderRadius: C.radiusSm, padding: "12px 16px", fontSize: 13, color: C.primary, marginBottom: 20 }}>{error}</div>}
          {success && <div style={{ background: C.greenLight, border: `1px solid ${C.green}`, borderRadius: C.radiusSm, padding: "12px 16px", fontSize: 13, color: C.green, marginBottom: 20 }}>{success}</div>}

          {mode === "register" && step === 1 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 24, background: C.borderLight, padding: 4, borderRadius: C.radiusSm }}>
              {[["seeker", "👤 Job Seeker"], ["employer", "🏢 Employer"]].map(([r, label]) => (
                <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all .2s", background: role === r ? "#fff" : "transparent", color: role === r ? C.primary : C.textSub, boxShadow: role === r ? C.shadow : "none" }}>{label}</button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(mode === "login" || step === 1) && <>
              {mode === "register" && step === 1 && <>
                <div><Label required>Full Name</Label><input className="input-field" placeholder="Your full name" value={form.full_name} onChange={e => set("full_name", e.target.value)} /></div>
                {role === "employer" && <div><Label required>Organization Name</Label><input className="input-field" placeholder="Company or NGO name" value={form.org_name} onChange={e => set("org_name", e.target.value)} /></div>}
              </>}
              <div><Label required>Email</Label><input className="input-field" type="email" placeholder="your@email.com" value={form.email} onChange={e => set("email", e.target.value)} /></div>
              <div><Label required>Password</Label><input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => set("password", e.target.value)} /></div>
            </>}

            {mode === "register" && step === 2 && <>
              <div><Label>Governorate</Label>
                <select className="select-field" value={form.governorate} onChange={e => set("governorate", e.target.value)}>
                  <option value="">Select governorate</option>
                  {govs.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div><Label>Primary Sector</Label>
                <select className="select-field" value={form.sector} onChange={e => set("sector", e.target.value)}>
                  <option value="">Select sector</option>
                  {sectors.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </>}

            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 15 }}
              onClick={mode === "register" && step === 1 ? () => setStep(2) : handleSubmit} disabled={loading}>
              {loading ? <Spinner size={18} color="#fff" /> : mode === "login" ? "Sign In" : step === 1 ? "Continue →" : "Create Account"}
            </button>

            {mode === "login" && <button className="btn-ghost" style={{ textAlign: "center", width: "100%", justifyContent: "center", fontSize: 13 }} onClick={handleReset}>Forgot password?</button>}
          </div>

          <div style={{ marginTop: 28, textAlign: "center", fontSize: 14, color: C.textSub }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setStep(1); setError(""); setSuccess(""); }}
              style={{ background: "none", border: "none", color: C.primary, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shell layout ──────────────────────────────────────────────
function Shell({ navItems, userLabel, userSub, accentColor = C.primary, children, activePage, setActivePage }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <style>{globalStyles}</style>

      {/* Mobile hamburger */}
      <button onClick={() => setSidebarOpen(true)} style={{ display: "none", position: "fixed", top: 16, left: 16, zIndex: 60, background: "#fff", border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: "8px 10px", cursor: "pointer" }}
        className="mobile-hamburger">☰</button>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`} style={{ width: 240, background: C.bgSidebar, borderRight: "1px solid rgba(201,168,76,0.15)", display: "flex", flexDirection: "column", padding: "24px 16px", position: "sticky", top: 0, height: "100vh", flexShrink: 0, overflowY: "auto" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, paddingLeft: 4 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16 }}>I</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: C.text }}>INJAZ</div>
            <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: .8, textTransform: "uppercase" }}>Career Platform</div>
          </div>
        </div>

        {/* User card */}
        <div style={{ background: C.bg, borderRadius: C.radiusSm, padding: "12px 14px", marginBottom: 20, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{userLabel}</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>{userSub}</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => (
            <button key={item.id} className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}>
              <span className="nav-icon">{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && <span style={{ fontSize: 11, background: C.primary, color: "#fff", borderRadius: 10, padding: "1px 7px", fontWeight: 700 }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <button className="nav-item" onClick={() => supabase.auth.signOut().finally(() => window.location.href = "/")}
          style={{ color: C.primary, marginTop: 8, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
          <span className="nav-icon">🚪</span> Sign Out
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowX: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Page header ───────────────────────────────────────────────
function PageHeader({ title, subtitle, action }) {
  return (
    <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
      <div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: C.textSub }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  SEEKER PAGES
// ══════════════════════════════════════════════════════════════

function SeekerDashboard({ setActivePage }) {
  const { profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 5000);
    (async () => {
      try {
        const [s, postings] = await Promise.all([db.getPlatformStats(), db.getActivePostings()]);
        setStats(s);
        if (profile) {
          const skills = await db.getSeekerSkills(profile.id).catch(() => []);
          const ranked = postings.map(p => ({ ...p, matchResult: ai.computeMatchScore({ ...profile, skills }, p) }))
            .sort((a, b) => b.matchResult.total - a.matchResult.total).slice(0, 3);
          setMatches(ranked);
        }
      } catch (e) { console.error(e); }
      finally { clearTimeout(t); setLoading(false); }
    })();
  }, [profile?.id]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const name = profile?.full_name?.split(" ")[0] || "there";
  const score = profile?.profile_score || 20;

  return (
    <div>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: C.text, marginBottom: 4 }}>{greeting}, {name} 👋</h1>
        <p style={{ color: C.textSub, fontSize: 14 }}>Your career dashboard — updated in real time</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard label="Platform Seekers" value={stats ? stats.seekers.toLocaleString() : "—"} icon="👥" color={C.accent} delay={0} />
        <StatCard label="Active Postings" value={stats ? stats.postings.toLocaleString() : "—"} icon="💼" color={C.green} delay={.05} />
        <StatCard label="Profile Score" value={`${score}%`} icon="⭐" color={C.amber} delay={.1} />
        <StatCard label="Applications" value={stats ? stats.applications.toLocaleString() : "—"} icon="📨" color={C.purple} delay={.15} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Matches */}
        <div className="card fade-up-2">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Top Job Matches</h3>
            <button className="btn-ghost" style={{ fontSize: 13 }} onClick={() => setActivePage("matches")}>View all →</button>
          </div>
          {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>
            : matches.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <div style={{ fontSize: 14, marginBottom: 16 }}>Complete your profile to see matches</div>
                <button className="btn-primary" onClick={() => setActivePage("profile")}>Complete Profile →</button>
              </div>
            ) : matches.map(job => (
              <div key={job.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                <ScoreRing score={job.matchResult.total} size={52} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.text, marginBottom: 2 }}>{job.title}</div>
                  <div style={{ fontSize: 12, color: C.textSub }}>{job.employers?.org_name} · {job.governorate}</div>
                </div>
                <span className={`badge ${job.matchResult.total >= 70 ? "badge-green" : job.matchResult.total >= 50 ? "badge-amber" : "badge-red"}`}>
                  {job.matchResult.total >= 70 ? "Strong" : job.matchResult.total >= 50 ? "Good" : "Partial"}
                </span>
              </div>
            ))}
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile strength */}
          <div className="card fade-up-3">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Profile Strength</h3>
              <span style={{ fontSize: 14, fontWeight: 700, color: score >= 80 ? C.green : score >= 50 ? C.amber : C.primary }}>{score}%</span>
            </div>
            <ProgressBar value={score} color={score >= 80 ? C.green : score >= 50 ? C.amber : C.primary} height={8} />
            {score < 80 && <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16, fontSize: 13 }} onClick={() => setActivePage("profile")}>Complete Profile →</button>}
          </div>

          {/* Quick actions */}
          <div className="card fade-up-4">
            <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 14 }}>Quick Actions</h3>
            {[["📄", "Generate Cover Letter", "coverletter"], ["🎤", "Practice Interview", "interview"], ["🗺️", "My Journey", "journey"], ["📊", "Market Insights", "insights"]].map(([icon, label, page]) => (
              <button key={page} className="btn-ghost" style={{ width: "100%", justifyContent: "flex-start", marginBottom: 4, fontSize: 13 }} onClick={() => setActivePage(page)}>
                <span>{icon}</span>{label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Seeker Profile ────────────────────────────────────────────
function SeekerProfile() {
  const { profile, setProfile, session } = useAuth();
  const { showSuccess, showError } = useToast();
  const [form, setForm] = useState({
    full_name: "", phone: "", governorate: "", nationality: "Lebanese",
    employment_status: "seeking", education_level: "bachelor", years_experience: 0,
    field_of_study: "", university: "", sector: "", linkedin_url: ""
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [cvReview, setCvReview] = useState(null);
  const [cvUploading, setCvUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({ full_name: profile.full_name || "", phone: profile.phone || "", governorate: profile.governorate || "", nationality: profile.nationality || "Lebanese", employment_status: profile.employment_status || "seeking", education_level: profile.education_level || "bachelor", years_experience: profile.years_experience || 0, field_of_study: profile.field_of_study || "", university: profile.university || "", sector: profile.sector || "", linkedin_url: profile.linkedin_url || "" });
      db.getSeekerSkills(profile.id).then(setSkills).catch(() => {});
    }
  }, [profile?.id]);

  const computeScore = (f, s) => {
    let score = 20;
    if (f.full_name) score += 10;
    if (f.phone) score += 8;
    if (f.governorate) score += 8;
    if (f.education_level) score += 10;
    if (f.years_experience > 0) score += 8;
    if (f.field_of_study) score += 8;
    if (f.university) score += 8;
    if (f.sector) score += 8;
    if (f.linkedin_url) score += 8;
    if (s.length >= 3) score += 8;
    return Math.min(100, score);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const score = computeScore(form, skills);
      await db.updateSeekerProfile(profile.id, { ...form, years_experience: parseInt(form.years_experience) || 0, profile_score: score });
      await db.upsertSkills(profile.id, skills);
      setProfile(p => ({ ...p, ...form, profile_score: score }));
      showSuccess("Profile saved successfully!");
    } catch (e) { showError(e.message || "Save failed"); }
    finally { setSaving(false); }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setNewSkill(""); }
  };

  const handleCVUpload = async (file) => {
    if (!file || !profile) return;
    setCvUploading(true);
    try {
      const text = await file.text().catch(() => file.name);
      const review = await ai.reviewCV(text, profile.sector || "General");
      setCvReview(review);
      showSuccess("CV reviewed successfully!");
    } catch (e) { showError("CV review failed. " + e.message); }
    finally { setCvUploading(false); }
  };

  const govs = ["Beirut", "Mount Lebanon", "North Lebanon", "South Lebanon", "Bekaa", "Nabatieh", "Akkar", "Baalbek-Hermel"];
  const score = computeScore(form, skills);

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Keep your profile updated to get better job matches"
        action={<button className="btn-primary" onClick={handleSave} disabled={saving}>{saving ? <Spinner size={16} color="#fff" /> : "✓"} Save Profile</button>} />

      {/* Score banner */}
      <div className="card fade-up" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
        <ScoreRing score={score} size={72} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 4 }}>Profile Completeness</div>
          <ProgressBar value={score} color={score >= 80 ? C.green : score >= 50 ? C.amber : C.primary} height={10} />
          <div style={{ fontSize: 12, color: C.textSub, marginTop: 8 }}>
            {score >= 80 ? "Great profile! Employers can find you easily." : score >= 50 ? "Good start — add more details to improve visibility." : "Complete your profile to start getting matched with jobs."}
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="card fade-up-1" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 20 }}>👤 Personal Information</h3>
        <div className="grid-2" style={{ gap: 16 }}>
          <div><Label required>Full Name</Label><input className="input-field" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Your full name" /></div>
          <div><Label>Phone</Label><input className="input-field" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+961 XX XXX XXX" /></div>
          <div><Label>Governorate</Label>
            <select className="select-field" value={form.governorate} onChange={e => setForm(f => ({ ...f, governorate: e.target.value }))}>
              <option value="">Select...</option>
              {govs.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div><Label>Employment Status</Label>
            <select className="select-field" value={form.employment_status} onChange={e => setForm(f => ({ ...f, employment_status: e.target.value }))}>
              {[["seeking", "Actively Seeking"], ["employed", "Employed"], ["student", "Student"], ["freelance", "Freelancing"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div><Label>Primary Sector</Label>
            <select className="select-field" value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))}>
              <option value="">Select sector...</option>
              {["Technology", "Education", "Healthcare", "NGO", "Finance", "Marketing", "Engineering", "Construction", "Hospitality", "Other"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div><Label>LinkedIn URL</Label><input className="input-field" value={form.linkedin_url} onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))} placeholder="https://linkedin.com/in/..." /></div>
        </div>
      </div>

      {/* Education */}
      <div className="card fade-up-2" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 20 }}>🎓 Education & Experience</h3>
        <div className="grid-2" style={{ gap: 16 }}>
          <div><Label>Education Level</Label>
            <select className="select-field" value={form.education_level} onChange={e => setForm(f => ({ ...f, education_level: e.target.value }))}>
              {[["high_school", "High School"], ["vocational", "Vocational"], ["bachelor", "Bachelor's"], ["master", "Master's"], ["phd", "PhD"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div><Label>Years of Experience</Label><input className="input-field" type="number" min="0" max="50" value={form.years_experience} onChange={e => setForm(f => ({ ...f, years_experience: e.target.value }))} /></div>
          <div><Label>Field of Study</Label><input className="input-field" value={form.field_of_study} onChange={e => setForm(f => ({ ...f, field_of_study: e.target.value }))} placeholder="e.g. Computer Science" /></div>
          <div><Label>University / Institution</Label><input className="input-field" value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))} placeholder="e.g. AUB, LAU, NDU" /></div>
        </div>
      </div>

      {/* Skills */}
      <div className="card fade-up-3" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 16 }}>⚡ Skills</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {skills.map(s => (
            <div key={s} className="tag">
              {s}
              <button onClick={() => setSkills(skills.filter(x => x !== s))} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input className="input-field" placeholder="Type a skill and press Enter..." value={newSkill}
            onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} style={{ flex: 1 }} />
          <button className="btn-primary" onClick={addSkill}>+ Add</button>
        </div>
      </div>

      {/* CV */}
      <div className="card fade-up-4">
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 16 }}>📄 CV Upload & AI Review</h3>
        {cvReview ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <ScoreRing score={cvReview.ats_score} size={64} />
              <div>
                <div style={{ fontWeight: 600, color: C.text, marginBottom: 4 }}>ATS Score: {cvReview.ats_score}%</div>
                <div style={{ fontSize: 13, color: C.textSub }}>{cvReview.overall_verdict}</div>
              </div>
            </div>
            <div style={{ background: C.bg, borderRadius: C.radiusSm, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, marginBottom: 8, textTransform: "uppercase" }}>Suggestions</div>
              {cvReview.top_suggestions?.map((s, i) => <div key={i} style={{ fontSize: 13, color: C.text, padding: "4px 0", display: "flex", gap: 8 }}><span style={{ color: C.amber }}>→</span>{s}</div>)}
            </div>
            <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => { setCvReview(null); setCvFile(null); }}>Replace CV</button>
          </div>
        ) : (
          <div>
            <label style={{ display: "block", border: `2px dashed ${C.border}`, borderRadius: C.radius, padding: 32, textAlign: "center", cursor: "pointer", transition: "all .2s" }}
              onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { setCvFile(f); handleCVUpload(f); } }}>
              <input type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) { setCvFile(f); handleCVUpload(f); } }} />
              {cvUploading ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}><Spinner /><span style={{ fontSize: 14, color: C.textSub }}>Analyzing CV with AI...</span></div>
                : <div><div style={{ fontSize: 36, marginBottom: 12 }}>📄</div><div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>Click or drag to upload CV</div><div style={{ fontSize: 13, color: C.textSub }}>PDF, Word, or TXT — AI will score and review it</div></div>}
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Job Matches ───────────────────────────────────────────────
function JobMatches() {
  const { profile } = useAuth();
  const [postings, setPostings] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [applying, setApplying] = useState(false);
  const [filter, setFilter] = useState("all");
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const [p, s] = await Promise.all([db.getActivePostings(), profile ? db.getSeekerSkills(profile.id) : []]);
        setSkills(s);
        const ranked = p.map(job => ({ ...job, matchResult: ai.computeMatchScore({ ...(profile || {}), skills: s }, job) }))
          .sort((a, b) => b.matchResult.total - a.matchResult.total);
        setPostings(ranked);
      } finally { setLoading(false); }
    })();
  }, [profile?.id]);

  const filtered = postings.filter(j => filter === "all" || (filter === "strong" && j.matchResult.total >= 70) || (filter === "good" && j.matchResult.total >= 50));

  const handleApply = async (job) => {
    if (!profile) return;
    setApplying(true);
    try {
      await db.applyToJob(profile.id, job.id, "");
      showSuccess("Application submitted!");
      setSelected(null);
    } catch (e) { showError("Already applied or error: " + e.message); }
    finally { setApplying(false); }
  };

  return (
    <div>
      <PageHeader title="Job Matches" subtitle="AI-matched positions based on your profile" />
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["all", "All Jobs"], ["strong", "Strong Match (70%+)"], ["good", "Good Match (50%+)"]].map(([f, l]) => (
          <button key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>{l}</button>
        ))}
      </div>
      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>
        : filtered.length === 0 ? <div className="card" style={{ textAlign: "center", padding: 60, color: C.textSub }}>No jobs found. Check back soon!</div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(job => (
            <div key={job.id} className="card" style={{ display: "flex", gap: 20, alignItems: "center", cursor: "pointer", transition: "all .2s" }}
              onClick={() => setSelected(job)} onMouseEnter={e => e.currentTarget.style.boxShadow = C.shadowMd} onMouseLeave={e => e.currentTarget.style.boxShadow = C.shadow}>
              <ScoreRing score={job.matchResult.total} size={60} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{job.title}</div>
                  <span className={`badge ${job.type === "internship" ? "badge-purple" : "badge-blue"}`}>{job.type}</span>
                </div>
                <div style={{ fontSize: 13, color: C.textSub, marginBottom: 8 }}>{job.employers?.org_name} · {job.governorate} · {job.work_mode}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {(job.required_skills || []).slice(0, 4).map(s => (
                    <span key={s} className="tag" style={{ background: job.matchResult.matched?.includes(s) ? C.greenLight : C.borderLight, color: job.matchResult.matched?.includes(s) ? C.green : C.textSub }}>{s}</span>
                  ))}
                </div>
              </div>
              <button className="btn-primary" style={{ fontSize: 13, flexShrink: 0 }} onClick={e => { e.stopPropagation(); handleApply(job); }}>Apply</button>
            </div>
          ))}
        </div>}

      {/* Job detail modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }} onClick={() => setSelected(null)}>
          <div className="card" style={{ maxWidth: 580, width: "100%", maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.text }}>{selected.title}</h2>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.textMuted }}>×</button>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <span className="badge badge-blue">{selected.type}</span>
              <span className="badge badge-gray">{selected.governorate}</span>
              <span className="badge badge-gray">{selected.work_mode}</span>
            </div>
            {selected.description && <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.7, marginBottom: 16 }}>{selected.description}</p>}
            {(selected.required_skills || []).length > 0 && <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textSub, textTransform: "uppercase", marginBottom: 8 }}>Required Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.required_skills.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => handleApply(selected)} disabled={applying}>
                {applying ? <Spinner size={16} color="#fff" /> : "Apply Now"}
              </button>
              <button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Cover Letter AI ───────────────────────────────────────────
function CoverLetterAI() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [tone, setTone] = useState("formal");
  const [language, setLanguage] = useState("English");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const { showError } = useToast();

  useEffect(() => { db.getActivePostings().then(setJobs).catch(() => {}); }, []);

  const generate = async () => {
    if (!selectedJob || !profile) return;
    const job = jobs.find(j => j.id === selectedJob);
    if (!job) return;
    setLoading(true);
    try {
      const skills = await db.getSeekerSkills(profile.id).catch(() => []);
      const result = await ai.generateCoverLetter(job.title, job.employers?.org_name || "", job.required_skills || [], profile.full_name || "", skills, tone, language);
      setLetter(result);
    } catch (e) { showError("AI error: " + e.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Cover Letter AI" subtitle="Generate a personalized cover letter in seconds" />
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card fade-up">
            <Label>Select Job</Label>
            <select className="select-field" value={selectedJob} onChange={e => setSelectedJob(e.target.value)}>
              <option value="">Choose a position...</option>
              {jobs.map(j => <option key={j.id} value={j.id}>{j.title} — {j.employers?.org_name}</option>)}
            </select>
          </div>
          <div className="card fade-up-1">
            <Label>Tone</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["formal", "🎩 Formal & Professional"], ["youth", "🌟 Youth-Friendly"], ["ngo", "🌍 NGO-Focused"]].map(([v, l]) => (
                <label key={v} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: C.radiusSm, border: `1.5px solid ${tone === v ? C.primary : C.border}`, background: tone === v ? C.primaryLight : "#fff", cursor: "pointer", fontSize: 13, fontWeight: tone === v ? 600 : 400, color: tone === v ? C.primary : C.text }}>
                  <input type="radio" value={v} checked={tone === v} onChange={() => setTone(v)} style={{ display: "none" }} />{l}
                </label>
              ))}
            </div>
          </div>
          <div className="card fade-up-2">
            <Label>Language</Label>
            <div style={{ display: "flex", gap: 8 }}>
              {["English", "Arabic", "French"].map(l => (
                <button key={l} onClick={() => setLanguage(l)} style={{ flex: 1, padding: "8px 4px", borderRadius: C.radiusSm, border: `1.5px solid ${language === l ? C.primary : C.border}`, background: language === l ? C.primaryLight : "#fff", color: language === l ? C.primary : C.textSub, fontSize: 12, fontWeight: language === l ? 700 : 400, cursor: "pointer" }}>{l}</button>
              ))}
            </div>
          </div>
          <button className="btn-primary" style={{ justifyContent: "center", padding: "12px" }} onClick={generate} disabled={loading || !selectedJob}>
            {loading ? <><Spinner size={16} color="#fff" /> Generating...</> : "✨ Generate Cover Letter"}
          </button>
        </div>

        <div className="card fade-up-1">
          {letter ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Your Cover Letter</h3>
                <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => { navigator.clipboard.writeText(letter); }}>📋 Copy</button>
              </div>
              <div style={{ background: C.bg, borderRadius: C.radiusSm, padding: 20, fontSize: 14, lineHeight: 1.8, color: C.text, whiteSpace: "pre-wrap", minHeight: 300 }}>{letter}</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, color: C.textMuted, gap: 12 }}>
              <div style={{ fontSize: 48 }}>✍️</div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Your cover letter will appear here</div>
              <div style={{ fontSize: 13 }}>Select a job and click Generate</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Interview Coach ───────────────────────────────────────────
function InterviewCoach() {
  const { profile } = useAuth();
  const [stage, setStage] = useState("setup");
  const [jobTitle, setJobTitle] = useState("");
  const [questions] = useState([
    { q: "Tell me about yourself and your background.", type: "personal" },
    { q: "Why are you interested in this position?", type: "motivation" },
    { q: "Describe a challenging situation you faced and how you resolved it.", type: "behavioral" },
    { q: "What are your greatest strengths and areas for improvement?", type: "self-awareness" },
    { q: "Where do you see yourself in 3-5 years?", type: "career" },
  ]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [allFeedback, setAllFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useToast();

  const submit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const fb = await ai.getInterviewFeedback(questions[current].q, answer, questions[current].type, jobTitle || "the position");
      setFeedback(fb);
      setAllFeedback(prev => [...prev, { question: questions[current], answer, feedback: fb }]);
    } catch (e) { showError("AI feedback error: " + e.message); }
    finally { setLoading(false); }
  };

  const next = () => {
    if (current < questions.length - 1) { setCurrent(c => c + 1); setAnswer(""); setFeedback(null); }
    else setStage("results");
  };

  const avgScore = allFeedback.length > 0 ? Math.round(allFeedback.reduce((s, f) => s + f.feedback.overall_score, 0) / allFeedback.length) : 0;

  if (stage === "setup") return (
    <div>
      <PageHeader title="Interview Coach" subtitle="Practice with AI and get instant feedback" />
      <div className="card fade-up" style={{ maxWidth: 500, margin: "0 auto", textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🎤</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 12, color: C.text }}>Ready to Practice?</h2>
        <p style={{ fontSize: 14, color: C.textSub, marginBottom: 28 }}>You'll answer {questions.length} questions and get AI feedback on each one.</p>
        <div style={{ marginBottom: 24 }}>
          <Label>Job Title (optional)</Label>
          <input className="input-field" placeholder="e.g. Project Manager, Data Analyst..." value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
        </div>
        <button className="btn-primary" style={{ justifyContent: "center", padding: "12px 32px", fontSize: 15 }} onClick={() => setStage("practice")}>Start Practice Session →</button>
      </div>
    </div>
  );

  if (stage === "results") return (
    <div>
      <PageHeader title="Session Results" subtitle="Here's how you performed" />
      <div className="card fade-up" style={{ textAlign: "center", padding: 32, marginBottom: 20 }}>
        <ScoreRing score={avgScore} size={96} />
        <div style={{ marginTop: 16, fontFamily: "'Playfair Display', serif", fontSize: 22, color: C.text }}>Overall Score: {avgScore}%</div>
        <div style={{ color: C.textSub, fontSize: 14, marginTop: 8 }}>{avgScore >= 80 ? "Excellent performance!" : avgScore >= 60 ? "Good effort — keep practicing!" : "Keep going — practice makes perfect!"}</div>
      </div>
      {allFeedback.map((item, i) => (
        <div key={i} className="card fade-up" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: C.text, flex: 1 }}>Q{i + 1}: {item.question.q}</div>
            <ScoreRing score={item.feedback.overall_score} size={48} />
          </div>
          <div style={{ background: C.greenLight, borderRadius: C.radiusSm, padding: 12, marginBottom: 8, fontSize: 13, color: C.green }}>💪 {item.feedback.strength}</div>
          <div style={{ background: C.amberLight, borderRadius: C.radiusSm, padding: 12, fontSize: 13, color: C.amber }}>💡 {item.feedback.tip}</div>
        </div>
      ))}
      <button className="btn-primary" onClick={() => { setStage("setup"); setCurrent(0); setAllFeedback([]); setFeedback(null); setAnswer(""); }}>Practice Again</button>
    </div>
  );

  return (
    <div>
      <PageHeader title="Interview Practice" subtitle={`Question ${current + 1} of ${questions.length}`} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>
        <div>
          <div className="card fade-up" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span className="badge badge-blue">{questions[current].type}</span>
              <span style={{ fontSize: 13, color: C.textSub }}>{current + 1}/{questions.length}</span>
            </div>
            <ProgressBar value={current + 1} max={questions.length} />
            <div style={{ marginTop: 20, marginBottom: 16, fontSize: 18, fontWeight: 600, color: C.text, lineHeight: 1.5 }}>{questions[current].q}</div>
            <textarea className="input-field" rows={6} style={{ resize: "vertical" }} placeholder="Type your answer here..." value={answer} onChange={e => setAnswer(e.target.value)} />
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button className="btn-primary" onClick={submit} disabled={loading || !answer.trim()}>
                {loading ? <><Spinner size={16} color="#fff" /> Analyzing...</> : "Get Feedback"}
              </button>
              {feedback && <button className="btn-secondary" onClick={next}>{current < questions.length - 1 ? "Next Question →" : "See Results →"}</button>}
            </div>
          </div>

          {feedback && (
            <div className="card fade-up" style={{ border: `1px solid ${C.green}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700, color: C.text }}>AI Feedback</h3>
                <ScoreRing score={feedback.overall_score} size={56} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[["Clarity", feedback.clarity_score], ["Relevance", feedback.relevance_score], ["Confidence", feedback.confidence_score]].map(([l, v]) => (
                  <div key={l} style={{ textAlign: "center", background: C.bg, borderRadius: C.radiusSm, padding: 12 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: C.primary }}>{v}%</div>
                    <div style={{ fontSize: 11, color: C.textSub }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: C.greenLight, borderRadius: C.radiusSm, padding: 12, marginBottom: 8, fontSize: 13, color: C.green }}>💪 <strong>Strength:</strong> {feedback.strength}</div>
              <div style={{ background: C.amberLight, borderRadius: C.radiusSm, padding: 12, fontSize: 13, color: C.amber }}>💡 <strong>Tip:</strong> {feedback.tip}</div>
            </div>
          )}
        </div>

        <div className="card fade-up-1">
          <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 16 }}>Interview Tips</h3>
          {[["⏱️", "Take 5-10 seconds to think before answering"], ["📌", "Use the STAR method for behavioral questions"], ["👁️", "Maintain confident, professional tone"], ["📊", "Quantify your achievements with numbers"], ["❓", "Prepare 2-3 questions to ask the interviewer"]].map(([icon, tip]) => (
            <div key={tip} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.borderLight}`, fontSize: 13, color: C.textSub }}>
              <span>{icon}</span><span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Journey Tracker ───────────────────────────────────────────
function JourneyTracker() {
  const { profile, session } = useAuth();
  const [currentStage, setCurrentStage] = useState("registered");
  const [journeyData, setJourneyData] = useState({});
  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (profile) {
      setCurrentStage(profile.journey_stage || "registered");
      setJourneyData(profile.journey_data || {});
    }
  }, [profile?.id]);

  const stageIndex = JOURNEY_STAGES.findIndex(s => s.id === currentStage);

  const advanceStage = async (stageId) => {
    if (!profile) return;
    const newIndex = JOURNEY_STAGES.findIndex(s => s.id === stageId);
    if (newIndex <= stageIndex) return;
    setSaving(true);
    try {
      const newData = { ...journeyData, [stageId]: { completed_at: new Date().toISOString() } };
      await db.updateJourney(profile.id, stageId, newData);
      setCurrentStage(stageId);
      setJourneyData(newData);
      showSuccess(`Stage updated: ${JOURNEY_STAGES[newIndex].label}`);
    } catch (e) { showError("Could not update journey: " + e.message); }
    finally { setSaving(false); }
  };

  const getStageStatus = (stageId) => {
    const idx = JOURNEY_STAGES.findIndex(s => s.id === stageId);
    if (idx < stageIndex) return "done";
    if (idx === stageIndex) return "active";
    return "locked";
  };

  const progressPct = Math.round(((stageIndex) / (JOURNEY_STAGES.length - 1)) * 100);

  return (
    <div>
      <PageHeader title="My Career Journey" subtitle="Track your progress through the INJAZ program" />

      {/* Progress overview */}
      <div className="card fade-up" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Journey Progress</div>
            <div style={{ fontSize: 13, color: C.textSub }}>Stage {stageIndex + 1} of {JOURNEY_STAGES.length}: {JOURNEY_STAGES[stageIndex]?.label}</div>
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: C.primary }}>{progressPct}%</div>
        </div>
        <ProgressBar value={stageIndex} max={JOURNEY_STAGES.length - 1} color={C.primary} height={10} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 11, color: C.textMuted }}>Registered</span>
          <span style={{ fontSize: 11, color: C.textMuted }}>Placed 🎉</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="card fade-up-1" style={{ marginBottom: 20 }}>
        <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 24 }}>Your Journey Timeline</h3>
        <div>
          {JOURNEY_STAGES.map((stage, i) => {
            const status = getStageStatus(stage.id);
            const completedAt = journeyData[stage.id]?.completed_at;
            return (
              <div key={stage.id} className="journey-step">
                <div className={`journey-node ${status}`}>
                  {status === "done" ? "✓" : stage.icon}
                </div>
                <div style={{ paddingTop: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <div style={{ fontWeight: status === "active" ? 700 : 600, fontSize: 15, color: status === "locked" ? C.textMuted : C.text }}>{stage.label}</div>
                    {status === "active" && <span className="badge badge-red" style={{ fontSize: 10 }}>CURRENT</span>}
                    {status === "done" && <span className="badge badge-green" style={{ fontSize: 10 }}>COMPLETED</span>}
                  </div>
                  <div style={{ fontSize: 13, color: C.textSub, marginBottom: completedAt ? 6 : 0 }}>{stage.desc}</div>
                  {completedAt && <div style={{ fontSize: 11, color: C.textMuted }}>✓ {new Date(completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>}
                  {status === "locked" && i === stageIndex + 1 && (
                    <button className="btn-primary" style={{ fontSize: 12, padding: "6px 14px", marginTop: 10 }} onClick={() => advanceStage(stage.id)} disabled={saving}>
                      {saving ? <Spinner size={14} color="#fff" /> : `Mark as Complete`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Celebration */}
      {currentStage === "placed" && (
        <div className="card fade-up" style={{ background: `linear-gradient(135deg, ${C.green}, #1a8a45)`, border: "none", textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#fff", marginBottom: 8 }}>Congratulations!</div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,.85)" }}>You've completed your INJAZ career journey. Best of luck in your new role!</div>
        </div>
      )}
    </div>
  );
}

// ── My Applications ───────────────────────────────────────────
function MyApplications() {
  const { profile } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const statusColors = { applied: "badge-blue", under_review: "badge-amber", interview: "badge-purple", offered: "badge-green", hired: "badge-green", rejected: "badge-red" };

  useEffect(() => {
    if (profile) db.getApplications(profile.id).then(setApps).finally(() => setLoading(false));
    else setLoading(false);
  }, [profile?.id]);

  return (
    <div>
      <PageHeader title="My Applications" subtitle={`${apps.length} application${apps.length !== 1 ? "s" : ""} submitted`} />
      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>
        : apps.length === 0 ? <div className="card" style={{ textAlign: "center", padding: 60, color: C.textSub }}><div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>No applications yet. Browse job matches and apply!</div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {apps.map(app => (
            <div key={app.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.text, marginBottom: 4 }}>{app.postings?.title}</div>
                <div style={{ fontSize: 13, color: C.textSub }}>{app.postings?.employers?.org_name} · Applied {new Date(app.created_at).toLocaleDateString()}</div>
              </div>
              <span className={`badge ${statusColors[app.status] || "badge-gray"}`}>{app.status?.replace("_", " ")}</span>
            </div>
          ))}
        </div>}
    </div>
  );
}

// ── Market Insights ───────────────────────────────────────────
function MarketInsights() {
  const skillData = [
    { skill: "Python", demand: 85, supply: 40 }, { skill: "Digital Marketing", demand: 78, supply: 55 },
    { skill: "SQL", demand: 72, supply: 38 }, { skill: "Data Analysis", demand: 68, supply: 32 },
    { skill: "Project Management", demand: 65, supply: 48 }, { skill: "Accounting", demand: 60, supply: 70 },
  ];
  return (
    <div>
      <PageHeader title="Market Insights" subtitle="Lebanon labor market trends and skill gaps" />
      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card fade-up">
          <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 20 }}>Skills: Supply vs Demand</h3>
          {skillData.map(item => (
            <div key={item.skill} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.skill}</span>
                <span style={{ fontSize: 11, color: item.demand > item.supply ? C.primary : C.green, fontWeight: 700 }}>
                  {item.demand > item.supply ? `Gap: +${item.demand - item.supply}` : `Surplus: +${item.supply - item.demand}`}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: C.textMuted, width: 52 }}>Demand</span>
                  <div style={{ flex: 1, background: C.borderLight, borderRadius: 99, height: 6 }}>
                    <div style={{ width: `${item.demand}%`, height: "100%", background: C.accent, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 11, color: C.textMuted, width: 28, textAlign: "right" }}>{item.demand}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: C.textMuted, width: 52 }}>Supply</span>
                  <div style={{ flex: 1, background: C.borderLight, borderRadius: 99, height: 6 }}>
                    <div style={{ width: `${item.supply}%`, height: "100%", background: C.amber, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 11, color: C.textMuted, width: 28, textAlign: "right" }}>{item.supply}</span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textSub }}><div style={{ width: 10, height: 10, borderRadius: 2, background: C.accent }} /> Demand</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textSub }}><div style={{ width: 10, height: 10, borderRadius: 2, background: C.amber }} /> Supply</div>
          </div>
        </div>
        <div className="card fade-up-1">
          <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 20 }}>Lebanon Labor Map</h3>
          {[["Beirut", 2840, 680, "Digital Marketing"], ["Mount Lebanon", 3120, 610, "Data Analysis"], ["North Lebanon", 1650, 180, "IT Support"], ["South Lebanon", 980, 90, "Healthcare Tech"], ["Bekaa", 870, 70, "Agri-tech"], ["Nabatieh", 540, 40, "Finance"], ["Akkar", 410, 25, "Vocational"], ["Baalbek-Hermel", 380, 20, "Logistics"]].map(([gov, seekers, posts, gap]) => (
            <div key={gov} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.borderLight}` }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{gov}</div>
                <div style={{ fontSize: 11, color: C.textSub }}>Gap: {gap}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{seekers.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: C.textSub }}>{posts} postings</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  EMPLOYER PAGES
// ══════════════════════════════════════════════════════════════

function EmployerDashboard({ setActivePage }) {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ postings: 0, applications: 0, seekers: 0 });
  const [recentPostings, setRecentPostings] = useState([]);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const [platformStats, postings] = await Promise.all([db.getPlatformStats(), db.getEmployerPostings(profile.id)]);
      setStats(platformStats);
      setRecentPostings(postings.slice(0, 3));
    })();
  }, [profile?.id]);

  const name = profile?.contact_person?.split(" ")[0] || profile?.org_name || "there";

  return (
    <div>
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: C.text, marginBottom: 4 }}>Welcome, {name} 👋</h1>
        <p style={{ color: C.textSub, fontSize: 14 }}>{profile?.org_name} · Employer Dashboard</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <StatCard label="Platform Seekers" value={stats.seekers} icon="👥" color={C.accent} delay={0} />
        <StatCard label="Your Active Jobs" value={recentPostings.filter(p => p.status === "active").length} icon="💼" color={C.green} delay={.05} />
        <StatCard label="Total Applications" value={stats.applications} icon="📨" color={C.purple} delay={.1} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        <div className="card fade-up-2">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, color: C.text }}>Recent Job Postings</h3>
            <button className="btn-ghost" onClick={() => setActivePage("postings")}>View all →</button>
          </div>
          {recentPostings.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: C.textSub }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
              <div style={{ marginBottom: 16 }}>No job postings yet</div>
              <button className="btn-primary" onClick={() => setActivePage("post-job")}>Post Your First Job</button>
            </div>
          ) : recentPostings.map(p => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.borderLight}` }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{p.title}</div>
                <div style={{ fontSize: 12, color: C.textSub }}>{p.type} · {p.governorate}</div>
              </div>
              <span className={`badge ${p.status === "active" ? "badge-green" : "badge-gray"}`}>{p.status}</span>
            </div>
          ))}
        </div>
        <div className="card fade-up-3">
          <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 14 }}>Quick Actions</h3>
          {[["➕", "Post a Job", "post-job"], ["📋", "My Postings", "postings"], ["👥", "View Candidates", "candidates"]].map(([icon, label, page]) => (
            <button key={page} className="btn-secondary" style={{ width: "100%", justifyContent: "flex-start", marginBottom: 10, fontSize: 13 }} onClick={() => setActivePage(page)}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PostJob() {
  const { profile } = useAuth();
  const { showSuccess, showError } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ title: "", type: "full-time", work_mode: "onsite", governorate: "", sector: "", description: "", required_skills: [], min_experience_years: 0, min_education: "bachelor", openings: 1 });
  const [newSkill, setNewSkill] = useState("");
  const [posting, setPosting] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const govs = ["Beirut", "Mount Lebanon", "North Lebanon", "South Lebanon", "Bekaa", "Nabatieh", "Akkar", "Baalbek-Hermel"];

  const publish = async () => {
    if (!profile?.id) { showError("Employer profile not found."); return; }
    setPosting(true);
    try {
      await db.createPosting({ ...form, employer_id: profile.id, status: "active", required_skills: form.required_skills });
      showSuccess("Job posted successfully! AI matching will begin immediately.");
      setStep(1);
      setForm({ title: "", type: "full-time", work_mode: "onsite", governorate: "", sector: "", description: "", required_skills: [], min_experience_years: 0, min_education: "bachelor", openings: 1 });
    } catch (e) { showError("Error: " + e.message); }
    finally { setPosting(false); }
  };

  return (
    <div>
      <PageHeader title="Post a Job" subtitle="AI will match your posting to qualified candidates immediately" />
      {/* Step indicator */}
      <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
        {["Job Details", "Requirements", "Publish"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: C.radiusSm, background: step === i + 1 ? C.primary : step > i + 1 ? C.greenLight : C.borderLight, color: step === i + 1 ? "#fff" : step > i + 1 ? C.green : C.textMuted, fontSize: 13, fontWeight: step === i + 1 ? 700 : 500 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: step > i + 1 ? C.green : "rgba(255,255,255,.3)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{step > i + 1 ? "✓" : i + 1}</span>
              {s}
            </div>
            {i < 2 && <div style={{ width: 20, height: 2, background: step > i + 1 ? C.green : C.border }} />}
          </div>
        ))}
      </div>

      <div className="card fade-up">
        {step === 1 && (
          <div>
            <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
              <div style={{ gridColumn: "1 / -1" }}><Label required>Job Title</Label><input className="input-field" value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Marketing Officer, Software Engineer" /></div>
              <div><Label>Job Type</Label>
                <select className="select-field" value={form.type} onChange={e => set("type", e.target.value)}>
                  {[["full-time", "Full Time"], ["part-time", "Part Time"], ["internship", "Internship"], ["freelance", "Freelance"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div><Label>Work Mode</Label>
                <select className="select-field" value={form.work_mode} onChange={e => set("work_mode", e.target.value)}>
                  {[["onsite", "On-site"], ["remote", "Remote"], ["hybrid", "Hybrid"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div><Label>Governorate</Label>
                <select className="select-field" value={form.governorate} onChange={e => set("governorate", e.target.value)}>
                  <option value="">Select...</option>{govs.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div><Label>Sector</Label>
                <select className="select-field" value={form.sector} onChange={e => set("sector", e.target.value)}>
                  <option value="">Select...</option>
                  {["Technology", "Education", "Healthcare", "NGO", "Finance", "Marketing", "Engineering", "Construction", "Hospitality", "Other"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><Label>Number of Openings</Label><input className="input-field" type="number" min="1" value={form.openings} onChange={e => set("openings", e.target.value)} /></div>
            </div>
            <div><Label>Job Description</Label><textarea className="input-field" rows={5} placeholder="Describe the role, responsibilities, and company culture..." value={form.description} onChange={e => set("description", e.target.value)} style={{ resize: "vertical" }} /></div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><Label>Minimum Education</Label>
              <select className="select-field" value={form.min_education} onChange={e => set("min_education", e.target.value)}>
                {[["high_school", "High School"], ["vocational", "Vocational"], ["bachelor", "Bachelor's"], ["master", "Master's"], ["phd", "PhD"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div><Label>Minimum Years of Experience</Label><input className="input-field" type="number" min="0" value={form.min_experience_years} onChange={e => set("min_experience_years", e.target.value)} /></div>
            <div>
              <Label>Required Skills</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                {form.required_skills.map(s => (
                  <div key={s} className="tag">
                    {s}
                    <button onClick={() => set("required_skills", form.required_skills.filter(x => x !== s))} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 14, padding: 0 }}>×</button>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input className="input-field" placeholder="Add a required skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && newSkill.trim()) { set("required_skills", [...form.required_skills, newSkill.trim()]); setNewSkill(""); } }}
                  style={{ flex: 1 }} />
                <button className="btn-primary" onClick={() => { if (newSkill.trim()) { set("required_skills", [...form.required_skills, newSkill.trim()]); setNewSkill(""); } }}>+ Add</button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 20 }}>Review & Publish</h3>
            <div style={{ background: C.bg, borderRadius: C.radius, padding: 24, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 20, color: C.text, marginBottom: 8 }}>{form.title || "Untitled Position"}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                <span className="badge badge-blue">{form.type}</span>
                <span className="badge badge-gray">{form.work_mode}</span>
                <span className="badge badge-gray">{form.governorate}</span>
              </div>
              <div style={{ fontSize: 14, color: C.textSub, marginBottom: 12 }}>{form.description}</div>
              {form.required_skills.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{form.required_skills.map(s => <span key={s} className="tag">{s}</span>)}</div>}
            </div>
            <div style={{ background: C.accentLight, borderRadius: C.radiusSm, padding: 14, fontSize: 13, color: C.accent, marginBottom: 20 }}>
              🤖 AI will automatically match this posting to qualified candidates when published.
            </div>
            <button className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }} onClick={publish} disabled={posting || !form.title}>
              {posting ? <><Spinner size={16} color="#fff" /> Publishing...</> : "🚀 Publish Posting"}
            </button>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
          {step > 1 && <button className="btn-secondary" onClick={() => setStep(s => s - 1)}>← Back</button>}
          {step < 3 && <button className="btn-primary" onClick={() => setStep(s => s + 1)} disabled={step === 1 && !form.title}>Continue →</button>}
        </div>
      </div>
    </div>
  );
}

function MyPostings() {
  const { profile } = useAuth();
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess } = useToast();

  useEffect(() => {
    if (profile) db.getEmployerPostings(profile.id).then(setPostings).finally(() => setLoading(false));
    else setLoading(false);
  }, [profile?.id]);

  const toggleStatus = async (p) => {
    const newStatus = p.status === "active" ? "closed" : "active";
    await db.updatePosting(p.id, { status: newStatus });
    setPostings(ps => ps.map(x => x.id === p.id ? { ...x, status: newStatus } : x));
    showSuccess(`Posting ${newStatus}`);
  };

  return (
    <div>
      <PageHeader title="My Job Postings" subtitle={`${postings.length} posting${postings.length !== 1 ? "s" : ""}`} />
      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>
        : postings.length === 0 ? <div className="card" style={{ textAlign: "center", padding: 60, color: C.textSub }}><div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>No postings yet.</div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {postings.map(p => (
            <div key={p.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>{p.title}</div>
                <div style={{ fontSize: 13, color: C.textSub }}>{p.type} · {p.governorate} · Posted {new Date(p.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className={`badge ${p.status === "active" ? "badge-green" : "badge-gray"}`}>{p.status}</span>
                <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => toggleStatus(p)}>{p.status === "active" ? "Close" : "Reopen"}</button>
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  ADMIN PAGES
// ══════════════════════════════════════════════════════════════

function AdminDashboard() {
  const [users, setUsers] = useState({ seekers: [], employers: [] });
  const [postings, setPostings] = useState([]);
  const [stats, setStats] = useState({ seekers: 0, employers: 0, postings: 0, applications: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const { showSuccess } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const [u, p, s] = await Promise.all([db.getAllUsers(), db.getAllPostings(), db.getPlatformStats()]);
        setUsers(u);
        setPostings(p);
        setStats({ seekers: u.seekers.length, employers: u.employers.length, postings: p.length, applications: s.applications });
      } finally { setLoading(false); }
    })();
  }, []);

  const togglePostingStatus = async (p) => {
    const newStatus = p.status === "active" ? "closed" : "active";
    await db.updatePostingStatus(p.id, newStatus);
    setPostings(ps => ps.map(x => x.id === p.id ? { ...x, status: newStatus } : x));
    showSuccess(`Posting ${newStatus}`);
  };

  return (
    <div>
      <div className="fade-up" style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ background: C.primary, color: "#fff", borderRadius: C.radiusSm, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>ADMIN</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: C.text }}>Platform Dashboard</h1>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard label="Total Seekers" value={stats.seekers} icon="👥" color={C.accent} delay={0} />
        <StatCard label="Employers" value={stats.employers} icon="🏢" color={C.green} delay={.05} />
        <StatCard label="Job Postings" value={stats.postings} icon="💼" color={C.amber} delay={.1} />
        <StatCard label="Applications" value={stats.applications} icon="📨" color={C.purple} delay={.15} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, background: C.borderLight, padding: 4, borderRadius: C.radiusSm, width: "fit-content" }}>
        {[["overview", "Overview"], ["seekers", "Job Seekers"], ["employers", "Employers"], ["postings", "Postings"]].map(([t, l]) => (
          <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div> : (
        <>
          {tab === "overview" && (
            <div className="grid-2" style={{ gap: 20 }}>
              <div className="card">
                <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 16 }}>Recent Seekers</h3>
                {users.seekers.slice(0, 5).map(s => (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{s.full_name || "—"}</div>
                      <div style={{ fontSize: 12, color: C.textSub }}>{s.governorate} · {s.sector}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{s.profile_score || 20}%</span>
                  </div>
                ))}
              </div>
              <div className="card">
                <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 16 }}>Recent Postings</h3>
                {postings.slice(0, 5).map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: C.textSub }}>{p.employers?.org_name}</div>
                    </div>
                    <span className={`badge ${p.status === "active" ? "badge-green" : "badge-gray"}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "seekers" && (
            <div className="card">
              <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 16 }}>All Job Seekers ({users.seekers.length})</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                      {["Name", "Governorate", "Sector", "Experience", "Profile Score", "Journey Stage"].map(h => (
                        <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: C.textSub, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.seekers.map(s => (
                      <tr key={s.id} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                        <td style={{ padding: "10px 12px", fontWeight: 600, color: C.text }}>{s.full_name || "—"}</td>
                        <td style={{ padding: "10px 12px", color: C.textSub }}>{s.governorate || "—"}</td>
                        <td style={{ padding: "10px 12px", color: C.textSub }}>{s.sector || "—"}</td>
                        <td style={{ padding: "10px 12px", color: C.textSub }}>{s.years_experience || 0}y</td>
                        <td style={{ padding: "10px 12px" }}><span style={{ fontWeight: 700, color: (s.profile_score || 20) >= 80 ? C.green : (s.profile_score || 20) >= 50 ? C.amber : C.primary }}>{s.profile_score || 20}%</span></td>
                        <td style={{ padding: "10px 12px" }}><span className="badge badge-blue" style={{ fontSize: 10 }}>{s.journey_stage || "registered"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === "employers" && (
            <div className="card">
              <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 16 }}>All Employers ({users.employers.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {users.employers.map(e => (
                  <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{e.org_name}</div>
                      <div style={{ fontSize: 12, color: C.textSub }}>{e.contact_person} · {e.governorate} · {e.sector}</div>
                    </div>
                    <span className="badge badge-green">Active</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "postings" && (
            <div className="card">
              <h3 style={{ fontWeight: 700, color: C.text, marginBottom: 16 }}>All Postings ({postings.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {postings.map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${C.borderLight}` }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{p.title}</div>
                      <div style={{ fontSize: 12, color: C.textSub }}>{p.employers?.org_name} · {p.type} · {p.governorate}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span className={`badge ${p.status === "active" ? "badge-green" : "badge-gray"}`}>{p.status}</span>
                      <button className="btn-secondary" style={{ fontSize: 12 }} onClick={() => togglePostingStatus(p)}>{p.status === "active" ? "Close" : "Reopen"}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Admin Journey Overview ────────────────────────────────────
function AdminJourneyOverview() {
  const [seekers, setSeekers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState("all");

  useEffect(() => {
    db.getAllUsers().then(u => { setSeekers(u.seekers); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = stageFilter === "all" ? seekers : seekers.filter(s => (s.journey_stage || "registered") === stageFilter);

  const stageCounts = JOURNEY_STAGES.reduce((acc, s) => {
    acc[s.id] = seekers.filter(u => (u.journey_stage || "registered") === s.id).length;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Journey Overview" subtitle="Track all participant progress across the INJAZ program" />

      {/* Stage summary */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {JOURNEY_STAGES.map(stage => (
          <div key={stage.id} style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: C.radiusSm, padding: "10px 16px", textAlign: "center", minWidth: 100 }}>
            <div style={{ fontSize: 20 }}>{stage.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: C.text }}>{stageCounts[stage.id] || 0}</div>
            <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>{stage.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <button className={`tab ${stageFilter === "all" ? "active" : ""}`} onClick={() => setStageFilter("all")}>All ({seekers.length})</button>
        {JOURNEY_STAGES.map(s => (
          <button key={s.id} className={`tab ${stageFilter === s.id ? "active" : ""}`} onClick={() => setStageFilter(s.id)}>
            {s.icon} {s.label} ({stageCounts[s.id] || 0})
          </button>
        ))}
      </div>

      {/* Participant table */}
      <div className="card">
        {loading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><Spinner /></div>
          : filtered.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: C.textSub }}>No participants in this stage.</div>
          : <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  {["Participant", "Governorate", "Sector", "Profile", "Journey Stage", "Last Updated"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: C.textSub, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const stage = JOURNEY_STAGES.find(st => st.id === (s.journey_stage || "registered"));
                  const stageIdx = JOURNEY_STAGES.findIndex(st => st.id === (s.journey_stage || "registered"));
                  const progress = Math.round((stageIdx / (JOURNEY_STAGES.length - 1)) * 100);
                  return (
                    <tr key={s.id} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                      <td style={{ padding: "12px 12px" }}>
                        <div style={{ fontWeight: 600, color: C.text }}>{s.full_name || "—"}</div>
                      </td>
                      <td style={{ padding: "12px 12px", color: C.textSub }}>{s.governorate || "—"}</td>
                      <td style={{ padding: "12px 12px", color: C.textSub }}>{s.sector || "—"}</td>
                      <td style={{ padding: "12px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <ProgressBar value={s.profile_score || 20} height={4} color={C.accent} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: C.textSub, flexShrink: 0 }}>{s.profile_score || 20}%</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span>{stage?.icon}</span>
                          <span style={{ fontSize: 12, color: C.text }}>{stage?.label}</span>
                          <span style={{ fontSize: 11, color: C.textMuted }}>({progress}%)</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 12px", color: C.textMuted, fontSize: 12 }}>
                        {s.journey_updated_at ? new Date(s.journey_updated_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════════════════════

export default function App() {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const { toast, showSuccess, showError, showInfo } = useToast();

  if (!supabase) return <SetupError />;

  const loadProfile = async (user) => {
    const userRole = user.user_metadata?.role;
    const email = user.email || "";
    const adminStatus = ADMIN_EMAILS.includes(email.toLowerCase());
    setRole(userRole);
    setIsAdmin(adminStatus);

    try {
      if (userRole === "seeker") {
        let p = null;
        try { p = await db.getSeekerProfile(user.id); } catch (_) {}
        if (!p) {
          const meta = user.user_metadata || {};
          await supabase.from("job_seekers").insert({
            user_id: user.id, full_name: meta.full_name || "",
            governorate: meta.governorate || null, sector: meta.sector || null,
            nationality: "Lebanese", profile_score: 20,
          }).single();
          p = await db.getSeekerProfile(user.id).catch(() => null);
        }
        setProfile(p);
      } else if (userRole === "employer") {
        let p = null;
        try { p = await db.getEmployerProfile(user.id); } catch (_) {}
        if (!p) {
          const meta = user.user_metadata || {};
          await supabase.from("employers").insert({
            user_id: user.id, org_name: meta.org_name || meta.full_name || "My Organization",
            contact_person: meta.full_name || "", governorate: meta.governorate || null, sector: meta.sector || null,
          }).single();
          p = await db.getEmployerProfile(user.id).catch(() => null);
        }
        setProfile(p);
      }
    } catch (e) { console.error("loadProfile error:", e); }
  };

  useEffect(() => {
    db.getSession().then(async (sess) => {
      setSession(sess);
      if (sess) await loadProfile(sess.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess);
      if (sess) await loadProfile(sess.user);
      else { setProfile(null); setRole(null); setIsAdmin(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Loading
  if (session === undefined) return (
    <div style={{ minHeight: "100vh", background: "#080F1E", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{globalStyles}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: C.primary, marginBottom: 8 }}>INJAZ</div>
        <Spinner size={32} />
      </div>
    </div>
  );

  if (!session) return <AuthCtx.Provider value={{ session, profile, setProfile, role, isAdmin, showSuccess, showError, showInfo }}><style>{globalStyles}</style><AuthScreen /><Toast toast={toast} /></AuthCtx.Provider>;

  // Seeker shell
  if (role === "seeker") {
    const navItems = [
      { id: "dashboard", icon: "🏠", label: "Dashboard" },
      { id: "profile", icon: "👤", label: "My Profile" },
      { id: "matches", icon: "⭐", label: "Job Matches" },
      { id: "coverletter", icon: "✉️", label: "Cover Letter AI" },
      { id: "interview", icon: "🎤", label: "Interview Coach" },
      { id: "journey", icon: "🗺️", label: "My Journey" },
      { id: "applications", icon: "📋", label: "Applications" },
      { id: "insights", icon: "📊", label: "Market Insights" },
      ...(isAdmin ? [{ id: "admin", icon: "👑", label: "Admin" }, { id: "admin-journey", icon: "🗺️", label: "Journey Overview" }] : []),
    ];
    const pages = {
      dashboard: <SeekerDashboard setActivePage={setActivePage} />,
      profile: <SeekerProfile />,
      matches: <JobMatches />,
      coverletter: <CoverLetterAI />,
      interview: <InterviewCoach />,
      journey: <JourneyTracker />,
      applications: <MyApplications />,
      insights: <MarketInsights />,
      admin: <AdminDashboard />,
      "admin-journey": <AdminJourneyOverview />,
    };
    return (
      <AuthCtx.Provider value={{ session, profile, setProfile, role, isAdmin, showSuccess, showError, showInfo }}>
        <Shell navItems={navItems} userLabel={profile?.full_name || "Job Seeker"} userSub={isAdmin ? "Admin Access" : `Profile ${profile?.profile_score || 20}% complete`} activePage={activePage} setActivePage={setActivePage}>
          {pages[activePage] || pages.dashboard}
        </Shell>
        <Toast toast={toast} />
      </AuthCtx.Provider>
    );
  }

  // Employer shell
  if (role === "employer") {
    const navItems = [
      { id: "dashboard", icon: "🏠", label: "Dashboard" },
      { id: "post-job", icon: "➕", label: "Post a Job" },
      { id: "postings", icon: "📋", label: "My Postings" },
      ...(isAdmin ? [{ id: "admin", icon: "👑", label: "Admin" }, { id: "admin-journey", icon: "🗺️", label: "Journey Overview" }] : []),
    ];
    const pages = {
      dashboard: <EmployerDashboard setActivePage={setActivePage} />,
      "post-job": <PostJob />,
      postings: <MyPostings />,
      admin: <AdminDashboard />,
      "admin-journey": <AdminJourneyOverview />,
    };
    return (
      <AuthCtx.Provider value={{ session, profile, setProfile, role, isAdmin, showSuccess, showError, showInfo }}>
        <Shell navItems={navItems} userLabel={profile?.org_name || "Employer"} userSub={profile?.contact_person || "Employer Account"} accentColor={C.accent} activePage={activePage} setActivePage={setActivePage}>
          {pages[activePage] || pages.dashboard}
        </Shell>
        <Toast toast={toast} />
      </AuthCtx.Provider>
    );
  }

  // Unknown role fallback
  return (
    <div style={{ minHeight: "100vh", background: "#080F1E", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{globalStyles}</style>
      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 36, marginBottom: 16 }}>🔄</div>
        <p style={{ color: C.textSub, marginBottom: 20 }}>Setting up your account...</p>
        <button className="btn-secondary" onClick={() => supabase.auth.signOut().finally(() => window.location.href = "/")}>Sign Out & Try Again</button>
      </div>
    </div>
  );
}
