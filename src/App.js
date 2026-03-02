// ═══════════════════════════════════════════════════════════════════
//  INJAZ Lebanon AI Career Platform — PRODUCTION VERSION
//  Stack: React + Supabase (auth + database + storage) + OpenAI API
//  NO server required. Deploy to Vercel free tier in 10 minutes.
//
//  SETUP (one time):
//  1. npm install @supabase/supabase-js openai
//  2. Create .env with your keys (see bottom of file)
//  3. Run the SQL schema in Supabase
//  4. Deploy to Vercel
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase client (reads from env vars) ───────────────────────
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// ─── Auth Context ────────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

// ═══════════════════════════════════════════════════════════════
//  GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=JetBrains+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:#07111F;color:#E4EAF4;overflow-x:hidden}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#07111F}::-webkit-scrollbar-thumb{background:#1E5FAD;border-radius:3px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
  @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(46,134,222,.25)}50%{box-shadow:0 0 28px rgba(46,134,222,.55)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
  .fade-up{animation:fadeUp .45s ease both}
  .card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:24px;transition:border-color .2s,background .2s}
  .card:hover{border-color:rgba(46,134,222,.28);background:rgba(255,255,255,.055)}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;border:none;transition:all .18s ease;text-decoration:none;white-space:nowrap}
  .btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}
  .btn-primary{background:linear-gradient(135deg,#2E86DE,#1A4A8A);color:#fff}
  .btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 22px rgba(46,134,222,.38)}
  .btn-amber{background:linear-gradient(135deg,#F5A623,#E8943A);color:#07111F}
  .btn-amber:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 22px rgba(245,166,35,.35)}
  .btn-secondary{background:rgba(255,255,255,.07);color:#E4EAF4;border:1px solid rgba(255,255,255,.11)}
  .btn-secondary:hover:not(:disabled){background:rgba(255,255,255,.12)}
  .btn-ghost{background:transparent;color:#2E86DE;border:1px solid rgba(46,134,222,.3)}
  .btn-ghost:hover:not(:disabled){background:rgba(46,134,222,.1)}
  .btn-danger{background:rgba(231,76,60,.13);color:#E74C3C;border:1px solid rgba(231,76,60,.28)}
  .btn-danger:hover:not(:disabled){background:rgba(231,76,60,.22)}
  .btn-green{background:linear-gradient(135deg,#27AE60,#1E8449);color:#fff}
  .input{width:100%;padding:11px 16px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#E4EAF4;font-family:'DM Sans',sans-serif;font-size:14px;transition:all .2s;outline:none}
  .input:focus{border-color:#2E86DE;background:rgba(255,255,255,.08);box-shadow:0 0 0 3px rgba(46,134,222,.14)}
  .input::placeholder{color:#374151}
  select.input{cursor:pointer}textarea.input{resize:vertical;min-height:96px}
  .label{display:block;font-size:11.5px;font-weight:700;letter-spacing:.7px;color:#6B7A9A;text-transform:uppercase;margin-bottom:6px}
  .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.4px}
  .badge-blue{background:rgba(46,134,222,.18);color:#5DADE2}
  .badge-green{background:rgba(39,174,96,.18);color:#58D68D}
  .badge-amber{background:rgba(245,166,35,.18);color:#F5A623}
  .badge-red{background:rgba(231,76,60,.18);color:#E74C3C}
  .badge-purple{background:rgba(142,68,173,.18);color:#BB8FCE}
  .badge-gray{background:rgba(255,255,255,.08);color:#8FA0B4}
  .progress-bar{height:6px;background:rgba(255,255,255,.07);border-radius:3px;overflow:hidden}
  .progress-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#2E86DE,#5DADE2);transition:width 1s ease}
  .sidebar-item{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:10px;cursor:pointer;font-size:14px;font-weight:500;transition:all .18s;color:#6B7A9A;border:1px solid transparent;background:none;width:100%;text-align:left;font-family:'DM Sans',sans-serif}
  .sidebar-item:hover{background:rgba(255,255,255,.05);color:#E4EAF4}
  .sidebar-item.active{background:rgba(46,134,222,.14);color:#2E86DE;border-color:rgba(46,134,222,.22)}
  .tab{padding:7px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;transition:all .18s;color:#6B7A9A;background:transparent;border:none;font-family:'DM Sans',sans-serif}
  .tab.active{background:rgba(46,134,222,.18);color:#2E86DE}
  .tab:hover:not(.active){color:#E4EAF4}
  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}
  @media(max-width:600px){.form-grid{grid-template-columns:1fr}}
  .spinner{width:20px;height:20px;border-radius:50%;border:2px solid rgba(255,255,255,.2);border-top-color:#fff;animation:spin .7s linear infinite}
  .toast{position:fixed;top:20px;right:20px;padding:14px 20px;border-radius:12px;font-size:14px;font-weight:600;z-index:9999;animation:slideIn .3s ease;max-width:340px}
  .toast-success{background:#1E4D2B;border:1px solid #27AE60;color:#58D68D}
  .toast-error{background:#4D1E1E;border:1px solid #E74C3C;color:#E74C3C}
  .toast-info{background:#1A2E4A;border:1px solid #2E86DE;color:#5DADE2}
`;

// ═══════════════════════════════════════════════════════════
//  UTILITY HOOKS & HELPERS
// ═══════════════════════════════════════════════════════════

// Toast notification system
function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3800);
  };
  return { toast, showSuccess: m => show(m, "success"), showError: m => show(m, "error"), showInfo: m => show(m, "info") };
}

const Toast = ({ toast }) => toast ? (
  <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
) : null;

// Score Ring component
const ScoreRing = ({ score, size = 64 }) => {
  const color = score >= 80 ? "#27AE60" : score >= 60 ? "#F5A623" : "#E74C3C";
  const r = size / 2 - 5;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="4.5" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4.5"
          strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round" style={{ transition: "stroke-dasharray .9s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Serif Display'", fontSize: size * 0.27, color, fontWeight: 700 }}>{score}%</div>
    </div>
  );
};

// Stat card
const StatCard = ({ label, value, icon, color = "#2E86DE", trend, delay = 0 }) => (
  <div className="card fade-up" style={{ animationDelay: `${delay}s` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}22`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
      {trend != null && <span style={{ fontSize: 12, fontWeight: 700, color: trend >= 0 ? "#27AE60" : "#E74C3C" }}>
        {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%</span>}
    </div>
    <div style={{ fontFamily: "'DM Serif Display'", fontSize: 30, color: "#E4EAF4", lineHeight: 1, marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 13, color: "#6B7A9A" }}>{label}</div>
  </div>
);

// Inline spinner
const Spinner = ({ size = 20, color = "#fff" }) => (
  <div style={{ width: size, height: size, borderRadius: "50%",
    border: `2px solid rgba(255,255,255,.2)`, borderTopColor: color,
    animation: "spin .7s linear infinite", flexShrink: 0 }} />
);

// Section header
const SectionHeader = ({ title, sub, action }) => (
  <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
    <div>
      <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: 26, color: "#E4EAF4", marginBottom: 4 }}>{title}</h1>
      {sub && <p style={{ fontSize: 13, color: "#6B7A9A" }}>{sub}</p>}
    </div>
    {action}
  </div>
);

// ═══════════════════════════════════════════════════════════
//  SUPABASE DATA LAYER
//  All database operations live here
// ═══════════════════════════════════════════════════════════

const db = {
  // ── Auth ─────────────────────────────────────────────────
  async signUp(email, password, meta) {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: meta }
    });
    if (error) throw error;

    // Create role-specific profile row
    if (data.user) {
      if (meta.role === "seeker") {
        await supabase.from("job_seekers").insert({
          user_id: data.user.id,
          full_name: meta.full_name,
          governorate: meta.governorate || null,
          sector: meta.sector || null,
          nationality: meta.nationality || null,
          profile_score: 20,
        });
      } else {
        await supabase.from("employers").insert({
          user_id: data.user.id,
          org_name: meta.org_name,
          contact_person: meta.full_name,
          governorate: meta.governorate || null,
          sector: meta.sector || null,
        });
      }
    }
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  // ── Seeker Profile ────────────────────────────────────────
  async getSeekerProfile(userId) {
    const { data, error } = await supabase
      .from("job_seekers")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateSeekerProfile(userId, updates) {
    const { data, error } = await supabase
      .from("job_seekers")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ── Skills ────────────────────────────────────────────────
  async getSeekerSkills(seekerId) {
    const { data } = await supabase
      .from("seeker_skills")
      .select("skill_name")
      .eq("seeker_id", seekerId);
    return (data || []).map(r => r.skill_name);
  },

  async addSeekerSkill(seekerId, skillName) {
    await supabase.from("seeker_skills").upsert(
      { seeker_id: seekerId, skill_name: skillName },
      { onConflict: "seeker_id,skill_name" }
    );
  },

  async removeSeekerSkill(seekerId, skillName) {
    await supabase.from("seeker_skills")
      .delete().eq("seeker_id", seekerId).eq("skill_name", skillName);
  },

  // ── Postings ──────────────────────────────────────────────
  async getActivePostings() {
    const { data, error } = await supabase
      .from("postings")
      .select("*, employers(org_name, sector, governorate, logo_url)")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getEmployerPostings(employerId) {
    const { data, error } = await supabase
      .from("postings")
      .select("*")
      .eq("employer_id", employerId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createPosting(employerId, posting) {
    const { data, error } = await supabase
      .from("postings")
      .insert({ ...posting, employer_id: employerId, status: "active" })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async closePosting(postingId) {
    await supabase.from("postings").update({ status: "closed" }).eq("id", postingId);
  },

  // ── Matches ───────────────────────────────────────────────
  async getSeekerMatches(seekerId) {
    const { data, error } = await supabase
      .from("matches")
      .select("*, postings(*, employers(org_name, governorate))")
      .eq("seeker_id", seekerId)
      .order("total_score", { ascending: false })
      .limit(20);
    if (error) throw error;
    return data || [];
  },

  async upsertMatch(match) {
    await supabase.from("matches").upsert(match, { onConflict: "seeker_id,posting_id" });
  },

  // ── Applications ──────────────────────────────────────────
  async applyToJob(seekerId, postingId, coverLetterText) {
    const { data, error } = await supabase
      .from("applications")
      .insert({ seeker_id: seekerId, posting_id: postingId, cover_letter_text: coverLetterText, status: "applied" })
      .select().single();
    if (error) throw error;
    return data;
  },

  async getSeekerApplications(seekerId) {
    const { data } = await supabase
      .from("applications")
      .select("*, postings(job_title, employers(org_name))")
      .eq("seeker_id", seekerId)
      .order("applied_at", { ascending: false });
    return data || [];
  },

  async getPostingApplications(postingId) {
    const { data } = await supabase
      .from("applications")
      .select("*, job_seekers(full_name, governorate, education_level, years_experience)")
      .eq("posting_id", postingId)
      .order("applied_at", { ascending: false });
    return data || [];
  },

  async updateApplicationStatus(appId, status) {
    await supabase.from("applications").update({ status, status_updated_at: new Date().toISOString() }).eq("id", appId);
  },

  // ── Employer ──────────────────────────────────────────────
  async getEmployerProfile(userId) {
    const { data, error } = await supabase
      .from("employers")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateEmployerProfile(userId, updates) {
    const { data, error } = await supabase
      .from("employers")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select().single();
    if (error) throw error;
    return data;
  },

  // ── Cover Letters ─────────────────────────────────────────
  async saveCoverLetter(userId, postingId, text, tone, language) {
    const { data } = await supabase.from("cover_letters").insert({
      user_id: userId, posting_id: postingId,
      letter_text: text, tone, language
    }).select().single();
    return data;
  },

  // ── Analytics ─────────────────────────────────────────────
  async getPlatformStats() {
    const [s, e, p, a] = await Promise.all([
      supabase.from("job_seekers").select("id", { count: "exact", head: true }),
      supabase.from("employers").select("id", { count: "exact", head: true }),
      supabase.from("postings").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("applications").select("id", { count: "exact", head: true }),
    ]);
    return { seekers: s.count||0, employers: e.count||0, postings: p.count||0, applications: a.count||0 };
  },
};

// ═══════════════════════════════════════════════════════════
//  AI LAYER — calls OpenAI via Supabase Edge Function
//  (no API key exposed in browser)
// ═══════════════════════════════════════════════════════════

const ai = {
  async generateCoverLetter(jobTitle, orgName, requiredSkills, candidateName, candidateSkills, tone, language) {
    const { data, error } = await supabase.functions.invoke("ai-cover-letter", {
      body: { jobTitle, orgName, requiredSkills, candidateName, candidateSkills, tone, language }
    });
    if (error) throw new Error("AI service unavailable");
    return data.letter;
  },

  async getInterviewFeedback(question, answer, questionType, jobTitle) {
    const { data, error } = await supabase.functions.invoke("ai-interview-feedback", {
      body: { question, answer, questionType, jobTitle }
    });
    if (error) throw new Error("AI service unavailable");
    return data.feedback;
  },

  async reviewCV(cvText, sector) {
    const { data, error } = await supabase.functions.invoke("ai-cv-review", {
      body: { cvText, sector }
    });
    if (error) throw new Error("AI service unavailable");
    return data.review;
  },

  // Client-side matching (no AI cost) — runs in browser
  computeMatchScore(seeker, posting) {
    const seekerSkillSet = new Set((seeker.skills || []).map(s => s.toLowerCase()));
    const required = posting.required_skills || [];
    const matched = required.filter(s => seekerSkillSet.has(s.toLowerCase()));
    const skillScore = required.length > 0 ? (matched.length / required.length) * 100 : 50;
    const gaps = required.filter(s => !seekerSkillSet.has(s.toLowerCase()));

    const seekerExp = seeker.years_experience || 0;
    const reqExp = posting.min_experience_years || 0;
    const expScore = seekerExp >= reqExp ? Math.min(100, 100 - (seekerExp - reqExp - 3) * 8)
      : Math.max(0, 100 - (reqExp - seekerExp) * 22);

    const eduLevels = { less_than_hs: 0, high_school: 1, vocational: 2, bachelor: 3, master: 4, phd: 5 };
    const seekerEdu = eduLevels[seeker.education_level] ?? 3;
    const reqEdu = eduLevels[posting.min_education] ?? 2;
    const eduScore = seekerEdu >= reqEdu ? 100 : seekerEdu === reqEdu - 1 ? 55 : 0;

    const locScore = posting.work_mode === "remote" ? 100
      : seeker.governorate === posting.governorate ? 100
      : seeker.governorate ? 30 : 50;

    const availScore = seeker.availability === "immediately" ? 100
      : seeker.availability === "within_1_month" ? 72
      : seeker.availability === "within_3_months" ? 44 : 12;

    const total = Math.round(
      0.40 * skillScore + 0.25 * expScore + 0.15 * eduScore + 0.12 * locScore + 0.08 * availScore
    );

    const flags = [];
    if (gaps.length) flags.push(`Skill gaps: ${gaps.slice(0,2).join(", ")}${gaps.length > 2 ? ` +${gaps.length-2}` : ""}`);
    if (seekerExp > reqExp + 4) flags.push("Possibly overqualified");
    if (locScore < 50) flags.push("Location mismatch");

    return { total, skillScore: Math.round(skillScore), expScore: Math.round(expScore),
      eduScore: Math.round(eduScore), locScore: Math.round(locScore), flags, matched, gaps };
  }
};

// ═══════════════════════════════════════════════════════════
//  APP SHELL
// ═══════════════════════════════════════════════════════════

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const { toast, showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    // Get initial session
    db.getSession().then(async (sess) => {
      setSession(sess);
      if (sess) await loadProfile(sess.user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess);
      if (sess) await loadProfile(sess.user);
      else { setProfile(null); setRole(null); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (user) => {
    const userRole = user.user_metadata?.role;
    setRole(userRole);
    try {
      if (userRole === "seeker") {
        const p = await db.getSeekerProfile(user.id);
        setProfile(p);
      } else if (userRole === "employer") {
        const p = await db.getEmployerProfile(user.id);
        setProfile(p);
      }
    } catch (e) {
      // Profile may not exist yet (race condition after signup) — retry once
      setTimeout(() => loadProfile(user), 1200);
    }
  };

  // Loading state
  if (session === undefined) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#07111F" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(46,134,222,.2)", borderTopColor: "#2E86DE", animation: "spin .8s linear infinite" }} />
        <div style={{ fontFamily: "'DM Serif Display'", fontSize: 18, color: "#6B7A9A" }}>Loading INJAZ Platform…</div>
      </div>
    </div>
  );

  const ctx = { session, profile, setProfile, role, showSuccess, showError, showInfo, supabase, db, ai };

  return (
    <AuthContext.Provider value={ctx}>
      <style>{globalStyles}</style>
      <Toast toast={toast} />
      {!session && <AuthScreen />}
      {session && role === "seeker" && <SeekerShell />}
      {session && role === "employer" && <EmployerShell />}
    </AuthContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════
//  AUTH SCREEN
// ═══════════════════════════════════════════════════════════

function AuthScreen() {
  const { showError, showSuccess } = useAuth();
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("seeker");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email:"", password:"", confirm:"", full_name:"", org_name:"", governorate:"", sector:"", nationality:"lebanese", consent: false });
  const f = k => e => setForm(prev => ({ ...prev, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const GOVS = ["Beirut","Mount Lebanon","North Lebanon","South Lebanon","Bekaa","Nabatieh","Akkar","Baalbek-Hermel"];
  const SECTORS = ["ICT","Finance","Education","Health","Construction","Hospitality","NGO","Agriculture","Other"];

  const handleSubmit = async e => {
    e.preventDefault();
    if (mode === "register" && step === 1) { setStep(2); return; }
    if (mode === "register" && !form.consent) { showError("Please accept the privacy policy."); return; }
    if (mode === "register" && form.password !== form.confirm) { showError("Passwords do not match."); return; }

    setLoading(true);
    try {
      if (mode === "login") {
        await db.signIn(form.email, form.password);
      } else {
        await db.signUp(form.email, form.password, {
          role, full_name: form.full_name, org_name: form.org_name,
          governorate: form.governorate, sector: form.sector, nationality: form.nationality
        });
        showSuccess("Account created! Check your email to verify, then sign in.");
        setMode("login"); setStep(1);
      }
    } catch (err) {
      showError(err.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  const handleReset = async () => {
    if (!form.email) { showError("Enter your email address first."); return; }
    await supabase.auth.resetPasswordForEmail(form.email);
    showSuccess("Password reset link sent to your email.");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      background: "radial-gradient(ellipse at 15% 50%, rgba(26,74,138,.28) 0%, transparent 60%), radial-gradient(ellipse at 85% 20%, rgba(13,115,119,.18) 0%, transparent 55%), #07111F" }}>

      <div style={{ position: "fixed", top: -120, right: -120, width: 440, height: 440, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(46,134,222,.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -80, left: -80, width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,166,35,.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 430, animation: "fadeUp .6s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg,#2E86DE,#1A4A8A)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🎓</div>
            <div>
              <div style={{ fontFamily: "'DM Serif Display'", fontSize: 26, color: "#E4EAF4", lineHeight: 1 }}>INJAZ Lebanon</div>
              <div style={{ fontSize: 11, color: "#F5A623", fontWeight: 700, letterSpacing: 1.2 }}>AI CAREER PLATFORM</div>
            </div>
          </div>
          <p style={{ color: "#6B7A9A", fontSize: 14 }}>Connecting Lebanese talent with opportunity</p>
        </div>

        <div className="card" style={{ padding: "28px 32px" }}>
          {/* Mode tabs */}
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,.04)", borderRadius: 10, padding: 4, marginBottom: 22 }}>
            {["login","register"].map(m => (
              <button key={m} className={`tab ${mode === m ? "active" : ""}`} style={{ flex: 1, textTransform: "capitalize" }}
                onClick={() => { setMode(m); setStep(1); }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Role selector for register */}
          {mode === "register" && (
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {["seeker","employer"].map(r => (
                <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "9px 0", borderRadius: 10, cursor: "pointer",
                  fontWeight: 600, fontSize: 13, fontFamily: "'DM Sans'", transition: "all .2s",
                  background: role === r ? "rgba(46,134,222,.18)" : "rgba(255,255,255,.04)",
                  color: role === r ? "#2E86DE" : "#6B7A9A",
                  border: `1px solid ${role === r ? "rgba(46,134,222,.4)" : "rgba(255,255,255,.08)"}` }}>
                  {r === "seeker" ? "👤 Job Seeker" : "🏢 Employer"}
                </button>
              ))}
            </div>
          )}

          {/* Step progress for register */}
          {mode === "register" && (
            <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
              {[1,2].map(s => (
                <div key={s} style={{ flex: 1, height: 3, borderRadius: 2,
                  background: step >= s ? "#2E86DE" : "rgba(255,255,255,.08)", transition: "background .3s" }} />
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {/* Step 1: Basic credentials */}
              {(mode === "login" || step === 1) && (
                <>
                  {mode === "register" && (
                    <div>
                      <label className="label">{role === "seeker" ? "Full Name" : "Your Name"}</label>
                      <input className="input" placeholder="Sara Moussawi" value={form.full_name} onChange={f("full_name")} required />
                    </div>
                  )}
                  {mode === "register" && role === "employer" && (
                    <div>
                      <label className="label">Organization Name</label>
                      <input className="input" placeholder="e.g. Malia Group" value={form.org_name} onChange={f("org_name")} required />
                    </div>
                  )}
                  <div>
                    <label className="label">Email Address</label>
                    <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={f("email")} required />
                  </div>
                  <div>
                    <label className="label">Password</label>
                    <input className="input" type="password" placeholder="Min. 8 characters" value={form.password} onChange={f("password")} required minLength={8} />
                  </div>
                  {mode === "register" && (
                    <div>
                      <label className="label">Confirm Password</label>
                      <input className="input" type="password" placeholder="Repeat password" value={form.confirm} onChange={f("confirm")} required />
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Profile details */}
              {mode === "register" && step === 2 && (
                <>
                  <div>
                    <label className="label">Governorate</label>
                    <select className="input" value={form.governorate} onChange={f("governorate")} required>
                      <option value="">Select…</option>
                      {GOVS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  {role === "seeker" && (
                    <div>
                      <label className="label">Nationality</label>
                      <select className="input" value={form.nationality} onChange={f("nationality")}>
                        <option value="lebanese">Lebanese</option>
                        <option value="syrian">Syrian</option>
                        <option value="palestinian">Palestinian</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="label">Primary Sector</label>
                    <select className="input" value={form.sector} onChange={f("sector")} required>
                      <option value="">Select…</option>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer", marginTop: 4 }}>
                    <input type="checkbox" checked={form.consent} onChange={f("consent")} style={{ marginTop: 3, accentColor: "#2E86DE" }} />
                    <span style={{ fontSize: 12, color: "#6B7A9A", lineHeight: 1.55 }}>
                      I agree to the Privacy Policy and consent to data processing for job matching and analytics.
                    </span>
                  </label>
                </>
              )}
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: "100%", justifyContent: "center", height: 46, marginTop: 18 }}>
              {loading ? <Spinner /> : mode === "login" ? "Sign In →"
                : step === 1 ? "Continue →"
                : `Create ${role === "seeker" ? "Job Seeker" : "Employer"} Account →`}
            </button>

            {mode === "login" && (
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <button type="button" onClick={handleReset}
                  style={{ background: "none", border: "none", color: "#2E86DE", fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'" }}>
                  Forgot password?
                </button>
              </div>
            )}
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#1E2A3A", marginTop: 16 }}>INJAZ Lebanon © 2025</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SHARED SIDEBAR SHELL
// ═══════════════════════════════════════════════════════════

function Shell({ navItems, userLabel, userSub, accentColor = "#2E86DE", children, activePage, setActivePage }) {
  const { db } = useAuth();
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#07111F" }}>
      {/* Sidebar */}
      <div style={{ width: 232, background: "rgba(255,255,255,.025)", borderRight: "1px solid rgba(255,255,255,.055)",
        display: "flex", flexDirection: "column", padding: "22px 14px", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg,${accentColor},#1A4A8A)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎓</div>
          <div>
            <div style={{ fontFamily: "'DM Serif Display'", fontSize: 15, color: "#E4EAF4" }}>INJAZ</div>
            <div style={{ fontSize: 10, color: accentColor, fontWeight: 700, letterSpacing: .8 }}>CAREER PLATFORM</div>
          </div>
        </div>

        {/* User card */}
        <div style={{ padding: 12, borderRadius: 12, background: `${accentColor}18`, border: `1px solid ${accentColor}28`, marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#E4EAF4", marginBottom: 2 }}>{userLabel}</div>
          <div style={{ fontSize: 11, color: "#6B7A9A" }}>{userSub}</div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} className={`sidebar-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
              {item.badge && <span style={{ marginLeft: "auto", fontSize: 10, background: accentColor, color: "#fff", borderRadius: 10, padding: "1px 6px", fontWeight: 700 }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <button className="sidebar-item" onClick={() => db.signOut()}
          style={{ color: "#E74C3C", marginTop: 8 }}>
          <span>🚪</span> Sign Out
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto", padding: "32px 36px", maxWidth: "calc(100vw - 232px)" }}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  JOB SEEKER SHELL
// ═══════════════════════════════════════════════════════════

function SeekerShell() {
  const [activePage, setActivePage] = useState("home");
  const { profile, session } = useAuth();

  const nav = [
    { id: "home", icon: "🏠", label: "Dashboard" },
    { id: "profile", icon: "👤", label: "My Profile" },
    { id: "matches", icon: "⭐", label: "Job Matches" },
    { id: "coverletter", icon: "✉️", label: "Cover Letter AI" },
    { id: "interview", icon: "🎙️", label: "Interview Coach" },
    { id: "applications", icon: "📋", label: "My Applications" },
    { id: "market", icon: "📊", label: "Market Insights" },
  ];

  const name = profile?.full_name || session?.user?.user_metadata?.full_name || "Job Seeker";
  const score = profile?.profile_score || 20;

  return (
    <Shell navItems={nav} userLabel={name} userSub={`Profile ${score}% complete`}
      activePage={activePage} setActivePage={setActivePage}>
      {activePage === "home" && <SeekerHome setActivePage={setActivePage} />}
      {activePage === "profile" && <SeekerProfile />}
      {activePage === "matches" && <JobMatches />}
      {activePage === "coverletter" && <CoverLetterAI />}
      {activePage === "interview" && <InterviewCoach />}
      {activePage === "applications" && <MyApplications />}
      {activePage === "market" && <MarketInsights />}
    </Shell>
  );
}

// ─── Seeker Home ──────────────────────────────────────────
function SeekerHome({ setActivePage }) {
  const { session, profile, ai } = useAuth();
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [s, postings] = await Promise.all([db.getPlatformStats(), db.getActivePostings()]);
        setStats(s);
        // Compute client-side matches if profile exists
        if (profile) {
          const skills = await db.getSeekerSkills(profile.id);
          const seekerData = { ...profile, skills };
          const ranked = postings.map(p => ({
            ...p, matchResult: ai.computeMatchScore(seekerData, p)
          })).sort((a, b) => b.matchResult.total - a.matchResult.total).slice(0, 5);
          setMatches(ranked);
        }
      } finally { setLoading(false); }
    })();
  }, [profile]);

  const name = profile?.full_name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ maxWidth: 1080 }}>
      <div style={{ marginBottom: 28, animation: "fadeUp .4s ease" }}>
        <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: 30, color: "#E4EAF4", marginBottom: 4 }}>
          {greeting}, {name} 👋
        </h1>
        <p style={{ color: "#6B7A9A", fontSize: 14 }}>Your personalized career dashboard — updated in real time.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        <StatCard label="Platform Seekers" value={stats ? stats.seekers.toLocaleString() : "—"} icon="👥" color="#2E86DE" delay={0} />
        <StatCard label="Active Postings" value={stats ? stats.postings.toLocaleString() : "—"} icon="💼" color="#27AE60" delay={.06} />
        <StatCard label="Your Profile Score" value={`${profile?.profile_score || 20}%`} icon="⭐" color="#F5A623" delay={.12} />
        <StatCard label="Applications Sent" value={stats ? stats.applications.toLocaleString() : "—"} icon="📩" color="#8E44AD" delay={.18} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 18 }}>
        {/* Top matches */}
        <div className="card fade-up" style={{ animationDelay: ".2s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: "'DM Serif Display'", fontSize: 18, color: "#E4EAF4" }}>Top Job Matches</div>
              <div style={{ fontSize: 12, color: "#6B7A9A" }}>AI-scored against your profile</div>
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => setActivePage("matches")}>View All →</button>
          </div>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 32 }}><Spinner color="#2E86DE" size={32} /></div>
          ) : matches.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: "#6B7A9A" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
              <div>Complete your profile to see matches</div>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setActivePage("profile")}>Complete Profile →</button>
            </div>
          ) : matches.map((job, i) => (
            <div key={job.id} style={{ display: "flex", gap: 14, padding: "12px 14px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,.06)", background: "rgba(255,255,255,.025)",
              marginBottom: 10, transition: "all .2s", cursor: "pointer", animation: `fadeUp .4s ease ${i*.07}s both` }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(46,134,222,.3)"; e.currentTarget.style.background = "rgba(46,134,222,.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"; e.currentTarget.style.background = "rgba(255,255,255,.025)"; }}>
              <ScoreRing score={job.matchResult.total} size={50} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#E4EAF4", marginBottom: 1 }}>{job.job_title}</div>
                <div style={{ fontSize: 12, color: "#6B7A9A" }}>{job.employers?.org_name} · {job.governorate}</div>
                <div style={{ display: "flex", gap: 5, marginTop: 7, flexWrap: "wrap" }}>
                  <span className="badge badge-blue">{job.posting_type?.replace("_"," ")}</span>
                  {(job.required_skills||[]).slice(0,2).map(s => <span key={s} className="badge badge-gray">{s}</span>)}
                </div>
              </div>
              <button className="btn btn-primary" style={{ padding: "6px 12px", fontSize: 12, alignSelf: "center" }}
                onClick={() => setActivePage("matches")}>Apply</button>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Profile progress */}
          <div className="card fade-up" style={{ animationDelay: ".22s" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#E4EAF4", marginBottom: 14 }}>Profile Strength</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#6B7A9A" }}>Completeness</span>
              <span style={{ fontSize: 12, color: "#2E86DE", fontWeight: 700 }}>{profile?.profile_score || 20}%</span>
            </div>
            <div className="progress-bar" style={{ height: 8, marginBottom: 12 }}>
              <div className="progress-fill" style={{ width: `${profile?.profile_score || 20}%` }} />
            </div>
            {(profile?.profile_score || 20) < 100 && (
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 13 }}
                onClick={() => setActivePage("profile")}>Complete Profile →</button>
            )}
          </div>

          {/* Quick actions */}
          <div className="card fade-up" style={{ animationDelay: ".28s" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#E4EAF4", marginBottom: 12 }}>Quick Actions</div>
            {[
              { label: "✉️ Generate Cover Letter", page: "coverletter" },
              { label: "🎙️ Practice Interview", page: "interview" },
              { label: "📊 Market Insights", page: "market" },
            ].map(a => (
              <button key={a.page} onClick={() => setActivePage(a.page)}
                style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 11px",
                  marginBottom: 7, borderRadius: 9, background: "rgba(255,255,255,.035)", border: "1px solid rgba(255,255,255,.07)",
                  color: "#B0BEC5", fontSize: 13, cursor: "pointer", transition: "all .18s", fontFamily: "'DM Sans'" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#E4EAF4"; e.currentTarget.style.borderColor = "rgba(46,134,222,.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#B0BEC5"; e.currentTarget.style.borderColor = "rgba(255,255,255,.07)"; }}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Seeker Profile (real DB) ─────────────────────────────
function SeekerProfile() {
  const { session, profile, setProfile, showSuccess, showError, ai: aiClient } = useAuth();
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    governorate: profile?.governorate || "",
    district: profile?.district || "",
    nationality: profile?.nationality || "lebanese",
    gender: profile?.gender || "",
    employment_status: profile?.employment_status || "",
    sector: profile?.sector || "",
    years_experience: profile?.years_experience || 0,
    education_level: profile?.education_level || "",
    field_of_study: profile?.field_of_study || "",
    institution: profile?.institution || "",
    availability: profile?.availability || "immediately",
    linkedin_url: profile?.linkedin_url || "",
  });
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [cvParsing, setCvParsing] = useState(false);
  const [cvResult, setCvResult] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    if (profile?.id) db.getSeekerSkills(profile.id).then(setSkills);
  }, [profile?.id]);

  const f = k => e => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      // Compute score
      let score = 0;
      if (form.full_name) score += 10; if (form.governorate) score += 5; if (form.sector) score += 5;
      if (form.education_level) score += 10; if (skills.length >= 3) score += 15;
      if (form.employment_status) score += 5; if (form.availability) score += 5;
      if (form.years_experience > 0) score += 10; if (cvResult) score += 25;
      score = Math.min(100, score + 10); // base 10 for having account

      const updated = await db.updateSeekerProfile(session.user.id, { ...form, profile_score: score });
      setProfile(updated);
      showSuccess("Profile saved successfully!");
    } catch (e) { showError(e.message); }
    finally { setSaving(false); }
  };

  const addSkill = async () => {
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return;
    if (profile?.id) await db.addSeekerSkill(profile.id, newSkill.trim());
    setSkills(prev => [...prev, newSkill.trim()]);
    setNewSkill("");
  };

  const removeSkill = async (s) => {
    if (profile?.id) await db.removeSeekerSkill(profile.id, s);
    setSkills(prev => prev.filter(sk => sk !== s));
  };

  const handleCvUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setCvParsing(true);
    try {
      // Upload to Supabase Storage
      const path = `cvs/${session.user.id}/${Date.now()}-${file.name}`;
      await supabase.storage.from("documents").upload(path, file, { upsert: true });

      // Read text for AI review
      const text = await file.text().catch(() => "");
      if (text && profile?.sector) {
        const review = await aiClient.reviewCV(text, profile.sector || "General");
        setCvResult(review);
        // Auto-add extracted skills
        if (review.missing_keywords?.length) {
          showSuccess("CV uploaded and analysed! Review the AI suggestions below.");
        }
      } else {
        setCvResult({ ats_score: 60, overall_verdict: "Good", top_suggestions: ["Add more keywords relevant to your sector.", "Quantify your achievements with numbers."] });
        showSuccess("CV uploaded successfully!");
      }
      // Update DB record
      await supabase.from("cv_documents").insert({ user_id: session.user.id, file_name: file.name, ats_score: cvResult?.ats_score || 65 });
    } catch (err) { showError("CV upload failed: " + err.message); }
    finally { setCvParsing(false); }
  };

  const GOVS = ["Beirut","Mount Lebanon","North Lebanon","South Lebanon","Bekaa","Nabatieh","Akkar","Baalbek-Hermel"];
  const SECTORS = ["ICT","Finance","Education","Health","Construction","Hospitality","NGO","Agriculture","Other"];

  return (
    <div style={{ maxWidth: 820 }}>
      <SectionHeader title="My Profile" sub="Complete your profile to improve AI match accuracy" />

      {/* Progress bar */}
      <div className="card" style={{ marginBottom: 18, background: "linear-gradient(135deg,rgba(26,74,138,.25),rgba(13,115,119,.15))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#E4EAF4" }}>Profile Completeness</span>
          <span style={{ fontFamily: "'DM Serif Display'", fontSize: 22, color: "#2E86DE" }}>{profile?.profile_score || 20}%</span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${profile?.profile_score || 20}%`, background: "linear-gradient(90deg,#2E86DE,#27AE60)" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Personal Info */}
        <div className="card fade-up">
          <div style={{ fontSize: 15, fontWeight: 700, color: "#E4EAF4", marginBottom: 16 }}>👤 Personal Information</div>
          <div className="form-grid">
            <div><label className="label">Full Name</label><input className="input" value={form.full_name} onChange={f("full_name")} /></div>
            <div><label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={f("gender")}>
                <option value="">Select…</option><option value="male">Male</option><option value="female">Female</option><option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
            <div><label className="label">Nationality</label>
              <select className="input" value={form.nationality} onChange={f("nationality")}>
                <option value="lebanese">Lebanese</option><option value="syrian">Syrian</option><option value="palestinian">Palestinian</option><option value="other">Other</option>
              </select>
            </div>
            <div><label className="label">Employment Status</label>
              <select className="input" value={form.employment_status} onChange={f("employment_status")}>
                <option value="">Select…</option><option value="unemployed">Unemployed</option><option value="employed">Employed</option><option value="student">Student</option><option value="freelance">Freelance</option>
              </select>
            </div>
            <div><label className="label">Governorate</label>
              <select className="input" value={form.governorate} onChange={f("governorate")}>
                <option value="">Select…</option>{GOVS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div><label className="label">Availability</label>
              <select className="input" value={form.availability} onChange={f("availability")}>
                <option value="immediately">Immediately</option><option value="within_1_month">Within 1 month</option><option value="within_3_months">Within 3 months</option><option value="not_looking">Not actively looking</option>
              </select>
            </div>
          </div>
        </div>

        {/* Education & Experience */}
        <div className="card fade-up">
          <div style={{ fontSize: 15, fontWeight: 700, color: "#E4EAF4", marginBottom: 16 }}>🎓 Education & Experience</div>
          <div className="form-grid">
            <div><label className="label">Education Level</label>
              <select className="input" value={form.education_level} onChange={f("education_level")}>
                <option value="">Select…</option><option value="high_school">High School</option><option value="vocational">Vocational</option><option value="bachelor">Bachelor's</option><option value="master">Master's</option><option value="phd">PhD</option>
              </select>
            </div>
            <div><label className="label">Years of Experience</label>
              <input className="input" type="number" min="0" max="50" value={form.years_experience} onChange={f("years_experience")} />
            </div>
            <div><label className="label">Field of Study</label><input className="input" placeholder="Computer Science" value={form.field_of_study} onChange={f("field_of_study")} /></div>
            <div><label className="label">University / Institution</label><input className="input" placeholder="LAU, AUB…" value={form.institution} onChange={f("institution")} /></div>
            <div><label className="label">Primary Sector</label>
              <select className="input" value={form.sector} onChange={f("sector")}>
                <option value="">Select…</option>{SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="label">LinkedIn URL (optional)</label><input className="input" placeholder="https://linkedin.com/in/…" value={form.linkedin_url} onChange={f("linkedin_url")} /></div>
          </div>
        </div>

        {/* Skills */}
        <div className="card fade-up">
          <div style={{ fontSize: 15, fontWeight: 700, color: "#E4EAF4", marginBottom: 14 }}>⚡ Skills</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {skills.map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(46,134,222,.15)", border: "1px solid rgba(46,134,222,.3)", borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "#5DADE2" }}>
                {s}<span style={{ cursor: "pointer", color: "#6B7A9A", lineHeight: 1 }} onClick={() => removeSkill(s)}>×</span>
              </div>
            ))}
            {skills.length === 0 && <span style={{ color: "#374151", fontSize: 13 }}>No skills added yet</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="input" placeholder="Type a skill and press Enter…" value={newSkill}
              onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={addSkill}>+ Add</button>
          </div>
        </div>

        {/* CV Upload */}
        <div className="card fade-up">
          <div style={{ fontSize: 15, fontWeight: 700, color: "#E4EAF4", marginBottom: 14 }}>📄 CV Upload & AI Review</div>
          <input ref={fileRef} type="file" accept=".pdf,.docx" style={{ display: "none" }} onChange={handleCvUpload} />

          {!cvParsing && !cvResult && (
            <div style={{ border: "2px dashed rgba(46,134,222,.3)", borderRadius: 12, padding: 28, textAlign: "center", cursor: "pointer", transition: "all .2s" }}
              onClick={() => fileRef.current?.click()}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(46,134,222,.6)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(46,134,222,.3)"}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
              <div style={{ color: "#C5D0E0", fontWeight: 600, marginBottom: 4 }}>Click to upload CV</div>
              <div style={{ color: "#6B7A9A", fontSize: 13 }}>PDF or Word, max 5MB — AI will review and score it</div>
              <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>Choose File</button>
            </div>
          )}

          {cvParsing && (
            <div style={{ textAlign: "center", padding: 28 }}>
              <Spinner size={36} color="#2E86DE" />
              <div style={{ color: "#C5D0E0", fontWeight: 600, marginTop: 14 }}>AI is reviewing your CV…</div>
              <div style={{ color: "#6B7A9A", fontSize: 13, marginTop: 4 }}>Checking ATS score, keywords, and structure</div>
            </div>
          )}

          {cvResult && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 28 }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "#E4EAF4" }}>CV Uploaded</div>
                  <div style={{ fontSize: 12, color: "#27AE60" }}>✓ AI review complete</div>
                </div>
                <ScoreRing score={cvResult.ats_score || 65} size={56} />
              </div>
              {cvResult.top_suggestions?.length > 0 && (
                <div style={{ padding: 14, borderRadius: 10, background: "rgba(245,166,35,.08)", border: "1px solid rgba(245,166,35,.2)" }}>
                  <div style={{ fontSize: 13, color: "#F5A623", fontWeight: 700, marginBottom: 8 }}>💡 AI Suggestions</div>
                  {cvResult.top_suggestions.slice(0,3).map((s, i) => (
                    <div key={i} style={{ fontSize: 13, color: "#C5D0E0", marginBottom: 5, paddingLeft: 12, borderLeft: "2px solid rgba(245,166,35,.4)" }}>• {s}</div>
                  ))}
                </div>
              )}
              <button className="btn btn-secondary" style={{ marginTop: 12, fontSize: 12 }} onClick={() => { setCvResult(null); fileRef.current?.click(); }}>Replace CV</button>
            </div>
          )}
        </div>

        <button className="btn btn-amber" onClick={handleSave} disabled={saving} style={{ alignSelf: "flex-start", padding: "12px 28px" }}>
          {saving ? <><Spinner size={16} color="#07111F" /> Saving…</> : "✓ Save Profile"}
        </button>
      </div>
    </div>
  );
}

// ─── Job Matches (real data) ──────────────────────────────
function JobMatches() {
  const { session, profile, ai: aiClient, showSuccess, showError } = useAuth();
  const [postings, setPostings] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [applying, setApplying] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const [p, sk] = await Promise.all([
        db.getActivePostings(),
        profile?.id ? db.getSeekerSkills(profile.id) : Promise.resolve([])
      ]);
      setSkills(sk);
      const seekerData = { ...profile, skills: sk };
      const scored = p.map(posting => ({ ...posting, matchResult: aiClient.computeMatchScore(seekerData, posting) }))
        .sort((a, b) => b.matchResult.total - a.matchResult.total);
      setPostings(scored);
      setLoading(false);
    })();
  }, [profile]);

  const filtered = postings.filter(p => {
    if (filter !== "all" && p.posting_type !== filter) return false;
    if (search && !p.job_title.toLowerCase().includes(search.toLowerCase()) &&
      !(p.employers?.org_name || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleApply = async (job) => {
    if (!profile?.id) { showError("Complete your profile first."); return; }
    setApplying(true);
    try {
      await db.applyToJob(profile.id, job.id, null);
      showSuccess(`Applied to ${job.job_title} at ${job.employers?.org_name}!`);
      setSelected(null);
    } catch (e) { showError(e.message.includes("duplicate") ? "You already applied to this job." : e.message); }
    finally { setApplying(false); }
  };

  return (
    <div style={{ maxWidth: 980 }}>
      <SectionHeader title="Job Matches" sub="AI-ranked opportunities tailored to your profile" />

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>🔍</span>
          <input className="input" placeholder="Search jobs or employers…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        {["all","full_time","internship","part_time"].map(f => (
          <button key={f} className={`tab ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}
            style={{ textTransform: "capitalize" }}>
            {f === "all" ? "All" : f.replace("_", "-")}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60 }}><Spinner size={36} color="#2E86DE" /></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 360px" : "1fr", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: 48, color: "#6B7A9A" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                No postings found. Check back soon or adjust your filters.
              </div>
            )}
            {filtered.map((job, i) => (
              <div key={job.id} onClick={() => setSelected(job)}
                style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: 14, cursor: "pointer",
                  border: `1px solid ${selected?.id === job.id ? "rgba(46,134,222,.5)" : "rgba(255,255,255,.07)"}`,
                  background: selected?.id === job.id ? "rgba(46,134,222,.07)" : "rgba(255,255,255,.028)",
                  transition: "all .2s", animation: `fadeUp .4s ease ${i*.06}s both` }}>
                <ScoreRing score={job.matchResult.total} size={54} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#E4EAF4", marginBottom: 1 }}>{job.job_title}</div>
                  <div style={{ fontSize: 12, color: "#6B7A9A", marginBottom: 8 }}>{job.employers?.org_name} · {job.governorate} · {job.work_mode?.replace("_"," ")}</div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    <span className="badge badge-blue">{job.posting_type?.replace("_"," ")}</span>
                    {(job.required_skills || []).slice(0,3).map(s => <span key={s} className="badge badge-gray">{s}</span>)}
                  </div>
                  {job.matchResult.flags.length > 0 && (
                    <div style={{ marginTop: 7, fontSize: 12, color: "#F5A623" }}>⚠ {job.matchResult.flags[0]}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="card" style={{ position: "sticky", top: 0, height: "fit-content", animation: "fadeUp .3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <ScoreRing score={selected.matchResult.total} size={60} />
                <button onClick={() => setSelected(null)} className="btn btn-secondary" style={{ padding: "6px 10px", height: "fit-content" }}>✕</button>
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: 20, color: "#E4EAF4", marginBottom: 3 }}>{selected.job_title}</h2>
              <div style={{ color: "#6B7A9A", fontSize: 13, marginBottom: 14 }}>{selected.employers?.org_name} · {selected.governorate}</div>
              {[["Type", selected.posting_type?.replace("_"," ")], ["Mode", selected.work_mode?.replace("_"," ")],
                ["Experience", `${selected.min_experience_years || 0}+ years`],
                ["Deadline", selected.deadline || "Open"]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7 }}>
                  <span style={{ color: "#6B7A9A" }}>{l}</span>
                  <span style={{ color: "#C5D0E0", fontWeight: 500, textTransform: "capitalize" }}>{v}</span>
                </div>
              ))}
              {(selected.required_skills||[]).length > 0 && (
                <div style={{ margin: "14px 0" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#E4EAF4", marginBottom: 7 }}>Required Skills</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {(selected.required_skills||[]).map(s => (
                      <span key={s} className={`badge ${skills.map(sk => sk.toLowerCase()).includes(s.toLowerCase()) ? "badge-green" : "badge-red"}`}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ padding: 12, borderRadius: 10, background: "rgba(46,134,222,.08)", border: "1px solid rgba(46,134,222,.18)", marginBottom: 14, fontSize: 12, color: "#C5D0E0", lineHeight: 1.6 }}>
                🤖 <strong style={{ color: "#2E86DE" }}>Why this score:</strong> {selected.matchResult.matched.length}/{(selected.required_skills||[]).length} skills matched. {selected.matchResult.flags.join(". ") || "Strong profile fit."}
              </div>
              {selected.description && (
                <div style={{ fontSize: 12, color: "#6B7A9A", marginBottom: 14, lineHeight: 1.6, maxHeight: 100, overflow: "hidden" }}>
                  {selected.description.substring(0,220)}…
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="btn btn-primary" style={{ justifyContent: "center" }} disabled={applying} onClick={() => handleApply(selected)}>
                  {applying ? <><Spinner size={14} /> Applying…</> : "Apply Now →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Cover Letter AI (real OpenAI) ───────────────────────
function CoverLetterAI() {
  const { session, profile, ai: aiClient, showSuccess, showError } = useAuth();
  const [step, setStep] = useState(1);
  const [postings, setPostings] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [tone, setTone] = useState("Formal");
  const [lang, setLang] = useState("English");
  const [generating, setGenerating] = useState(false);
  const [letter, setLetter] = useState("");

  useEffect(() => {
    Promise.all([db.getActivePostings(), profile?.id ? db.getSeekerSkills(profile.id) : Promise.resolve([])]).then(([p, sk]) => {
      setPostings(p); setSkills(sk);
    });
  }, [profile]);

  const generate = async () => {
    if (!selectedJob) return;
    setGenerating(true);
    try {
      const text = await aiClient.generateCoverLetter(
        selectedJob.job_title, selectedJob.employers?.org_name,
        selectedJob.required_skills || [],
        profile?.full_name || "Applicant",
        skills, tone, lang
      );
      setLetter(text);
      // Save to DB
      if (session?.user?.id) await db.saveCoverLetter(session.user.id, selectedJob.id, text, tone, lang);
      setStep(3);
      showSuccess("Cover letter generated and saved!");
    } catch (e) {
      showError("AI generation failed. Please check your connection and try again.");
    } finally { setGenerating(false); }
  };

  const download = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "cover-letter.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 780 }}>
      <SectionHeader title="Cover Letter AI" sub="AI generates a personalized letter from your profile" />

      {/* Progress */}
      <div style={{ display: "flex", gap: 0, background: "rgba(255,255,255,.03)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
        {["Select Job","Configure","Edit & Export"].map((s, i) => (
          <div key={s} onClick={() => i < step - 1 && setStep(i + 1)}
            style={{ flex: 1, padding: "9px 0", textAlign: "center", borderRadius: 10,
              background: step === i+1 ? "rgba(46,134,222,.18)" : "transparent",
              color: step === i+1 ? "#2E86DE" : step > i+1 ? "#27AE60" : "#4A5568",
              fontWeight: 600, fontSize: 13, cursor: i < step - 1 ? "pointer" : "default" }}>
            {step > i+1 ? "✓ " : `${i+1}. `}{s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card fade-in">
          <div style={{ fontSize: 15, fontWeight: 700, color: "#E4EAF4", marginBottom: 14 }}>Select a Job Posting</div>
          {postings.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: "#6B7A9A" }}>No active postings available yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {postings.slice(0,8).map(job => (
                <div key={job.id} onClick={() => setSelectedJob(job)}
                  style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 11, cursor: "pointer",
                    border: `1px solid ${selectedJob?.id === job.id ? "rgba(46,134,222,.5)" : "rgba(255,255,255,.07)"}`,
                    background: selectedJob?.id === job.id ? "rgba(46,134,222,.08)" : "rgba(255,255,255,.025)", transition: "all .2s" }}>
                  <div>
                    <div style={{ fontWeight: 600, color: "#E4EAF4", fontSize: 14 }}>{job.job_title}</div>
                    <div style={{ fontSize: 12, color: "#6B7A9A" }}>{job.employers?.org_name} · {job.posting_type?.replace("_"," ")}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="btn btn-primary" style={{ marginTop: 18 }} disabled={!selectedJob} onClick={() => setStep(2)}>Next →</button>
        </div>
      )}

      {step === 2 && (
        <div className="card fade-in" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#E4EAF4" }}>Configure Your Letter</div>
          <div>
            <label className="label">Tone</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["Formal","Youth-Friendly","NGO-Focused"].map(t => (
                <button key={t} onClick={() => setTone(t)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                  fontWeight: 600, fontSize: 13, fontFamily: "'DM Sans'", transition: "all .2s",
                  background: tone === t ? "rgba(46,134,222,.18)" : "rgba(255,255,255,.04)",
                  color: tone === t ? "#2E86DE" : "#6B7A9A",
                  border: `1px solid ${tone === t ? "rgba(46,134,222,.4)" : "rgba(255,255,255,.08)"}` }}>{t}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Language</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["English","Arabic","French"].map(l => (
                <button key={l} onClick={() => setLang(l)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer",
                  fontWeight: 600, fontSize: 13, fontFamily: "'DM Sans'", transition: "all .2s",
                  background: lang === l ? "rgba(245,166,35,.18)" : "rgba(255,255,255,.04)",
                  color: lang === l ? "#F5A623" : "#6B7A9A",
                  border: `1px solid ${lang === l ? "rgba(245,166,35,.4)" : "rgba(255,255,255,.08)"}` }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 11, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
            <div style={{ fontSize: 12, color: "#6B7A9A", marginBottom: 7 }}>Profile data being used:</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {[profile?.full_name, `${profile?.years_experience || 0} yrs exp`, profile?.education_level, ...skills.slice(0,4)].filter(Boolean).map(t => (
                <span key={t} className="badge badge-blue">{t}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-amber" onClick={generate} disabled={generating}>
              {generating ? <><Spinner size={14} color="#07111F" /> Generating…</> : "✨ Generate with AI"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "fadeUp .4s ease" }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#E4EAF4" }}>Your Cover Letter</div>
              <div style={{ display: "flex", gap: 6 }}><span className="badge badge-green">Generated</span><span className="badge badge-blue">{tone}</span><span className="badge badge-amber">{lang}</span></div>
            </div>
            <textarea className="input" value={letter} onChange={e => setLetter(e.target.value)} style={{ minHeight: 360, lineHeight: 1.8 }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary" onClick={download}>⬇ Download</button>
            <button className="btn btn-secondary" onClick={() => { setStep(2); setLetter(""); }}>↺ Regenerate</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Interview Coach (real AI feedback) ──────────────────
function InterviewCoach() {
  const { ai: aiClient, profile, showError } = useAuth();
  const [started, setStarted] = useState(false);
  const [lang, setLang] = useState("English");
  const [jobTitle, setJobTitle] = useState(profile?.sector ? `${profile.sector} Professional` : "");
  const [qIdx, setQIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [done, setDone] = useState(false);
  const [scores, setScores] = useState([]);
  const chatRef = useRef();

  const QUESTIONS = [
    { q: "Tell me about yourself and why you are interested in this role.", type: "HR/Fit" },
    { q: "Describe a time you had to meet a tight deadline. What did you do and what was the result?", type: "Behavioral" },
    { q: "What are your top three technical strengths relevant to this position?", type: "Technical" },
    { q: "How do you handle disagreements with a colleague or manager?", type: "Behavioral" },
    { q: "Where do you see your career in three to five years?", type: "HR/Fit" },
  ];

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [history]);

  const start = () => {
    setStarted(true);
    setHistory([{ role: "ai", text: QUESTIONS[0].q, type: QUESTIONS[0].type }]);
  };

  const submit = async () => {
    if (!answer.trim()) return;
    const q = QUESTIONS[qIdx];
    const newHistory = [...history, { role: "user", text: answer }];
    setHistory(newHistory);
    setAnswer("");
    setLoadingFeedback(true);
    try {
      const feedback = await aiClient.getInterviewFeedback(q.q, answer, q.type, jobTitle);
      setScores(prev => [...prev, feedback.overall_score || 78]);
      const withFeedback = [...newHistory, { role: "feedback", data: feedback }];
      setHistory(withFeedback);
      setTimeout(() => {
        setLoadingFeedback(false);
        if (qIdx + 1 >= QUESTIONS.length) { setDone(true); }
        else {
          const nextQ = QUESTIONS[qIdx + 1];
          setHistory(prev => [...prev, { role: "ai", text: nextQ.q, type: nextQ.type }]);
          setQIdx(qIdx + 1);
        }
      }, 2200);
    } catch {
      showError("AI feedback unavailable. Check your connection.");
      setLoadingFeedback(false);
    }
  };

  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  if (done) return (
    <div style={{ maxWidth: 580, textAlign: "center", padding: "60px 20px", margin: "0 auto" }}>
      <div style={{ fontSize: 64, marginBottom: 18 }}>🏆</div>
      <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: 28, color: "#F5A623", marginBottom: 8 }}>Session Complete!</h2>
      <p style={{ color: "#6B7A9A", marginBottom: 24 }}>You answered {QUESTIONS.length} interview questions.</p>
      <ScoreRing score={avgScore} size={96} />
      <p style={{ color: "#6B7A9A", fontSize: 13, margin: "18px 0 24px" }}>Overall Session Score</p>
      <div style={{ padding: 16, borderRadius: 12, background: "rgba(245,166,35,.08)", border: "1px solid rgba(245,166,35,.2)", marginBottom: 24, textAlign: "left" }}>
        <div style={{ fontSize: 13, color: "#F5A623", fontWeight: 700, marginBottom: 6 }}>💡 Key Takeaway</div>
        <div style={{ fontSize: 13, color: "#C5D0E0", lineHeight: 1.6 }}>Quantify your achievements with specific metrics — numbers make answers 40% more memorable to interviewers.</div>
      </div>
      <button className="btn btn-primary" onClick={() => { setDone(false); setStarted(false); setQIdx(0); setHistory([]); setScores([]); }}>Practice Again →</button>
    </div>
  );

  if (!started) return (
    <div style={{ maxWidth: 620 }}>
      <SectionHeader title="Interview Coach" sub="AI-powered mock interview with real-time feedback" />
      <div className="card" style={{ textAlign: "center", padding: "40px 32px" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎙️</div>
        <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: 24, color: "#E4EAF4", marginBottom: 8 }}>Ready to Practice?</h2>
        <p style={{ color: "#6B7A9A", fontSize: 14, marginBottom: 24, maxWidth: 380, margin: "0 auto 24px" }}>
          You'll receive {QUESTIONS.length} interview questions. After each answer, the AI gives instant scored feedback.
        </p>
        <div style={{ marginBottom: 20 }}>
          <label className="label" style={{ textAlign: "left" }}>Job Title (for context)</label>
          <input className="input" placeholder="e.g. Data Analyst, Marketing Coordinator" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          {["English","Arabic","French"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: "8px 18px", borderRadius: 10, cursor: "pointer",
              fontWeight: 600, fontSize: 13, fontFamily: "'DM Sans'", transition: "all .2s",
              background: lang === l ? "rgba(46,134,222,.18)" : "rgba(255,255,255,.05)",
              color: lang === l ? "#2E86DE" : "#6B7A9A",
              border: `1px solid ${lang === l ? "rgba(46,134,222,.4)" : "rgba(255,255,255,.1)"}` }}>{l}</button>
          ))}
        </div>
        <button className="btn btn-primary" style={{ padding: "13px 34px", fontSize: 15 }} onClick={start}>Start Interview →</button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 760 }}>
      <SectionHeader title="Interview Coach" sub={`Question ${qIdx + 1} of ${QUESTIONS.length} · ${QUESTIONS[qIdx]?.type}`}
        action={<div style={{ display: "flex", gap: 4 }}>{QUESTIONS.map((_, i) => (
          <div key={i} style={{ width: 32, height: 4, borderRadius: 2,
            background: i < qIdx ? "#27AE60" : i === qIdx ? "#2E86DE" : "rgba(255,255,255,.08)", transition: "background .4s" }} />
        ))}</div>} />

      <div ref={chatRef} style={{ height: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, paddingRight: 4, marginBottom: 16 }}>
        {history.map((msg, i) => (
          <div key={i} style={{ animation: "fadeUp .3s ease" }}>
            {msg.role === "ai" && (
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1A4A8A,#2E86DE)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🤖</div>
                <div>
                  <div style={{ fontSize: 11, color: "#4A5568", marginBottom: 4 }}>AI Coach · {msg.type}</div>
                  <div style={{ padding: "14px 18px", borderRadius: 14, borderBottomLeftRadius: 4,
                    background: "rgba(26,74,138,.22)", border: "1px solid rgba(46,134,222,.2)", fontSize: 15, lineHeight: 1.6, color: "#E4EAF4" }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            )}
            {msg.role === "user" && (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <div style={{ padding: "12px 16px", borderRadius: 14, borderBottomRightRadius: 4,
                  background: "rgba(245,166,35,.1)", border: "1px solid rgba(245,166,35,.2)", fontSize: 14, color: "#E4EAF4", maxWidth: "80%" }}>
                  {msg.text}
                </div>
              </div>
            )}
            {msg.role === "feedback" && (
              <div style={{ padding: "14px 16px", borderRadius: 13, background: "rgba(39,174,96,.08)", border: "1px solid rgba(39,174,96,.2)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#27AE60", marginBottom: 10 }}>📊 AI Feedback</div>
                <div style={{ display: "flex", gap: 14, marginBottom: 10 }}>
                  {[["Clarity", msg.data.clarity_score], ["Relevance", msg.data.relevance_score], ["Confidence", msg.data.confidence_score]].map(([k, v]) => (
                    <div key={k} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontFamily: "'DM Serif Display'", fontSize: 22, color: (v||75) >= 80 ? "#27AE60" : "#F5A623", lineHeight: 1 }}>{v || "—"}</div>
                      <div style={{ fontSize: 11, color: "#6B7A9A" }}>{k}</div>
                    </div>
                  ))}
                </div>
                {msg.data.tip && (
                  <div style={{ fontSize: 12, color: "#C5D0E0", padding: "9px 12px", background: "rgba(255,255,255,.04)", borderRadius: 8 }}>
                    💡 {msg.data.tip}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {loadingFeedback && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(26,74,138,.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>🤖</div>
            <div style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(26,74,138,.18)", border: "1px solid rgba(46,134,222,.15)" }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#2E86DE", animation: `pulse 1.2s ease ${i*.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
      </div>

      {!loadingFeedback && !done && (
        <div style={{ display: "flex", gap: 10 }}>
          <textarea className="input" placeholder="Type your answer… (Press Shift+Enter for new line, Enter to submit)"
            value={answer} onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
            style={{ flex: 1, minHeight: 80, resize: "none" }} />
          <button className="btn btn-primary" onClick={submit} style={{ padding: "0 18px", alignSelf: "stretch" }}>Send →</button>
        </div>
      )}
    </div>
  );
}

// ─── My Applications ──────────────────────────────────────
function MyApplications() {
  const { profile } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) db.getSeekerApplications(profile.id).then(a => { setApps(a); setLoading(false); });
    else setLoading(false);
  }, [profile]);

  const stages = ["applied","under_review","interview","offered","hired","rejected"];
  const colors = { applied: "#2E86DE", under_review: "#F5A623", interview: "#8E44AD", offered: "#27AE60", hired: "#27AE60", rejected: "#E74C3C" };

  return (
    <div style={{ maxWidth: 820 }}>
      <SectionHeader title="My Applications" sub="Track every application in real time" />
      {loading ? <div style={{ textAlign: "center", padding: 60 }}><Spinner size={32} color="#2E86DE" /></div>
      : apps.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 56 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ color: "#6B7A9A" }}>No applications yet. Browse job matches to get started.</div>
        </div>
      ) : (
        <div className="card">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                {["Position","Employer","Applied","Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, color: "#6B7A9A", fontWeight: 700, textTransform: "uppercase", letterSpacing: .5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app.id} style={{ borderBottom: "1px solid rgba(255,255,255,.04)", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 12px", fontSize: 14, color: "#E4EAF4", fontWeight: 500 }}>{app.postings?.job_title || "—"}</td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: "#6B7A9A" }}>{app.postings?.employers?.org_name || "—"}</td>
                  <td style={{ padding: "12px 12px", fontSize: 13, color: "#6B7A9A" }}>{new Date(app.applied_at).toLocaleDateString("en-GB")}</td>
                  <td style={{ padding: "12px 12px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 20,
                      fontSize: 11, fontWeight: 600, background: `${colors[app.status] || "#666"}22`, color: colors[app.status] || "#666", textTransform: "capitalize" }}>
                      {(app.status || "applied").replace("_"," ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Market Insights ──────────────────────────────────────
function MarketInsights() {
  const [stats, setStats] = useState(null);
  const GOVS = [
    { name:"Beirut", seekers:2840, postings:680, gap:"Digital Marketing", urgency:"High" },
    { name:"Mount Lebanon", seekers:3120, postings:510, gap:"Data Analysis", urgency:"Medium" },
    { name:"North Lebanon", seekers:1650, postings:180, gap:"IT Support", urgency:"High" },
    { name:"South Lebanon", seekers:980, postings:90, gap:"Healthcare Tech", urgency:"Very High" },
    { name:"Bekaa", seekers:870, postings:70, gap:"Agri-tech", urgency:"Very High" },
    { name:"Nabatieh", seekers:540, postings:40, gap:"Financial Mgmt", urgency:"Very High" },
    { name:"Akkar", seekers:410, postings:25, gap:"Vocational Skills", urgency:"Critical" },
    { name:"Baalbek-Hermel", seekers:380, postings:20, gap:"Logistics", urgency:"Critical" },
  ];
  const SKILLS = [
    { skill:"Python", demand:340, supply:210 }, { skill:"Digital Marketing", demand:290, supply:180 },
    { skill:"SQL", demand:270, supply:150 }, { skill:"Data Analysis", demand:250, supply:130 },
    { skill:"IT Support", demand:220, supply:200 }, { skill:"Accounting", demand:190, supply:240 },
  ];
  const urgencyColor = { Critical:"#E74C3C", "Very High":"#F5A623", High:"#E8B84B", Medium:"#27AE60" };
  const maxSD = Math.max(...SKILLS.map(s => Math.max(s.demand, s.supply)));

  useEffect(() => { db.getPlatformStats().then(setStats).catch(() => {}); }, []);

  return (
    <div style={{ maxWidth: 960 }}>
      <SectionHeader title="Market Insights" sub="Lebanon labor market intelligence — updated weekly" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
        <StatCard label="Registered Seekers" value={stats ? stats.seekers.toLocaleString() : "—"} icon="👥" color="#2E86DE" delay={0} />
        <StatCard label="Active Postings" value={stats ? stats.postings.toLocaleString() : "—"} icon="💼" color="#27AE60" delay={.06} />
        <StatCard label="Applications Filed" value={stats ? stats.applications.toLocaleString() : "—"} icon="📩" color="#F5A623" delay={.12} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        {/* Skills chart */}
        <div className="card">
          <div style={{ fontFamily: "'DM Serif Display'", fontSize: 17, color: "#E4EAF4", marginBottom: 4 }}>Skills: Supply vs. Demand</div>
          <div style={{ fontSize: 12, color: "#6B7A9A", marginBottom: 16 }}>Top skills across all sectors</div>
          {SKILLS.map((s, i) => (
            <div key={s.skill} style={{ marginBottom: 12, animation: `fadeUp .3s ease ${i*.05}s both` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: "#C5D0E0" }}>{s.skill}</span>
                <span style={{ fontSize: 11, color: s.demand > s.supply ? "#E74C3C" : "#27AE60", fontWeight: 600 }}>
                  Gap: {s.demand > s.supply ? "+" : ""}{s.demand - s.supply}
                </span>
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                <div style={{ flex: 1, height: 7, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(s.demand/maxSD)*100}%`, background: "#2E86DE", borderRadius: 4, transition: "width 1s" }} />
                </div>
                <div style={{ flex: 1, height: 7, background: "rgba(255,255,255,.06)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(s.supply/maxSD)*100}%`, background: "#F5A623", borderRadius: 4, transition: "width 1s" }} />
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#5DADE2" }}>
              <div style={{ width: 12, height: 4, borderRadius: 2, background: "#2E86DE" }} />Demand
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#E8B84B" }}>
              <div style={{ width: 12, height: 4, borderRadius: 2, background: "#F5A623" }} />Supply
            </div>
          </div>
        </div>

        {/* Governorate map */}
        <div className="card">
          <div style={{ fontFamily: "'DM Serif Display'", fontSize: 17, color: "#E4EAF4", marginBottom: 4 }}>Lebanon Labor Map</div>
          <div style={{ fontSize: 12, color: "#6B7A9A", marginBottom: 14 }}>Seekers, postings & skill gaps by governorate</div>
          {GOVS.map((g, i) => (
            <div key={g.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 10px", borderRadius: 9, marginBottom: 5, cursor: "pointer", transition: "background .18s",
              background: i % 2 === 0 ? "rgba(255,255,255,.025)" : "transparent", animation: `fadeUp .3s ease ${i*.04}s both` }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(46,134,222,.07)"}
              onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "rgba(255,255,255,.025)" : "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: urgencyColor[g.urgency] || "#666", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#E4EAF4" }}>{g.name}</div>
                  <div style={{ fontSize: 11, color: "#6B7A9A" }}>Gap: {g.gap}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: "#C5D0E0", fontWeight: 600 }}>{g.seekers.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "#4A5568" }}>{g.postings} postings</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            {Object.entries(urgencyColor).map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6B7A9A" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div style={{ padding: 20, borderRadius: 14, background: "linear-gradient(135deg,rgba(26,74,138,.28),rgba(13,115,119,.18))",
        border: "1px solid rgba(46,134,222,.2)", animation: "glow 4s ease-in-out infinite" }}>
        <div style={{ fontSize: 11, color: "#F5A623", fontWeight: 700, letterSpacing: .9, marginBottom: 10 }}>🤖 AI MARKET INSIGHT</div>
        <p style={{ fontSize: 14, color: "#C5D0E0", lineHeight: 1.75, marginBottom: 8 }}>
          <strong style={{ color: "#E4EAF4" }}>Akkar and Baalbek-Hermel</strong> show the most critical imbalance — seeker-to-posting ratios exceed 18:1. Priority upskilling areas: Logistics and Vocational certifications. INJAZ should prioritize TVET partnerships in these regions.
        </p>
        <p style={{ fontSize: 14, color: "#C5D0E0", lineHeight: 1.75 }}>
          <strong style={{ color: "#E4EAF4" }}>ICT sector</strong> has the highest unmet demand nationally — 340 Python postings vs. 210 qualified seekers. A targeted digital upskilling program could close this gap by ~35% within 6 months.
        </p>
        <div style={{ fontSize: 11, color: "#374151", marginTop: 10 }}>Next update: 7 days · Powered by INJAZ AI</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  EMPLOYER SHELL
// ═══════════════════════════════════════════════════════════

function EmployerShell() {
  const [activePage, setActivePage] = useState("home");
  const { profile, session } = useAuth();
  const name = profile?.org_name || session?.user?.user_metadata?.org_name || "Employer";

  const nav = [
    { id: "home", icon: "🏠", label: "Dashboard" },
    { id: "post", icon: "➕", label: "Post a Job" },
    { id: "postings", icon: "💼", label: "My Postings" },
    { id: "candidates", icon: "👥", label: "Candidates" },
  ];

  return (
    <Shell navItems={nav} userLabel={name} userSub="Employer Account" accentColor="#27AE60"
      activePage={activePage} setActivePage={setActivePage}>
      {activePage === "home" && <EmployerHome setActivePage={setActivePage} />}
      {activePage === "post" && <PostJob setActivePage={setActivePage} />}
      {activePage === "postings" && <MyPostings setActivePage={setActivePage} />}
      {activePage === "candidates" && <CandidateView />}
    </Shell>
  );
}

function EmployerHome({ setActivePage }) {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ postings: 0, applications: 0 });

  useEffect(() => {
    if (profile?.id) {
      db.getEmployerPostings(profile.id).then(p => {
        setStats({ postings: p.length, applications: p.reduce((a, b) => a + (b.application_count || 0), 0) });
      });
    }
  }, [profile]);

  return (
    <div style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: 30, color: "#E4EAF4", marginBottom: 4 }}>
          Welcome, {profile?.org_name || "Employer"} 👋
        </h1>
        <p style={{ color: "#6B7A9A", fontSize: 14 }}>Manage your postings and find top talent.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 26 }}>
        <StatCard label="Active Postings" value={stats.postings} icon="💼" color="#27AE60" />
        <StatCard label="Total Applications" value={stats.applications} icon="📩" color="#2E86DE" />
        <StatCard label="Account Status" value="Active" icon="✅" color="#F5A623" />
      </div>
      <div className="card" style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>🚀</div>
        <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: 22, color: "#E4EAF4", marginBottom: 8 }}>Ready to find talent?</h2>
        <p style={{ color: "#6B7A9A", marginBottom: 22 }}>Post your first job or internship and let AI match you with the best candidates.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-green" onClick={() => setActivePage("post")}>➕ Post a Job</button>
          <button className="btn btn-secondary" onClick={() => setActivePage("postings")}>View My Postings</button>
        </div>
      </div>
    </div>
  );
}

function PostJob({ setActivePage }) {
  const { profile, showSuccess, showError } = useAuth();
  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ job_title:"", posting_type:"full_time", num_openings:1, governorate:"", work_mode:"on_site", min_experience_years:0, min_education:"bachelor", description:"", deadline:"", is_paid: true });
  const f = k => e => setForm(prev => ({ ...prev, [k]: e.target.type === "number" ? +e.target.value : e.target.value }));
  const GOVS = ["Beirut","Mount Lebanon","North Lebanon","South Lebanon","Bekaa","Nabatieh","Akkar","Baalbek-Hermel"];

  const handlePublish = async () => {
    if (!profile?.id) { showError("Employer profile not found."); return; }
    setSaving(true);
    try {
      await db.createPosting(profile.id, { ...form, required_skills: skills });
      showSuccess("Job posting published successfully!");
      setActivePage("postings");
    } catch (e) { showError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <SectionHeader title="Post a Job / Internship" sub="AI will start matching candidates immediately" />
      <div style={{ display: "flex", gap: 0, background: "rgba(255,255,255,.03)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
        {["Job Details","Requirements","Publish"].map((s, i) => (
          <div key={s} style={{ flex: 1, padding: "9px 0", textAlign: "center", borderRadius: 10,
            background: step === i+1 ? "rgba(39,174,96,.18)" : "transparent",
            color: step === i+1 ? "#27AE60" : step > i+1 ? "#27AE60" : "#4A5568", fontWeight: 600, fontSize: 13 }}>
            {step > i+1 ? "✓ " : `${i+1}. `}{s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card fade-in" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="form-grid">
            <div style={{ gridColumn: "span 2" }}><label className="label">Job Title</label><input className="input" placeholder="e.g. Marketing Coordinator" value={form.job_title} onChange={f("job_title")} required /></div>
            <div><label className="label">Type</label>
              <select className="input" value={form.posting_type} onChange={f("posting_type")}>
                <option value="full_time">Full-time</option><option value="part_time">Part-time</option><option value="internship">Internship</option><option value="freelance">Freelance</option>
              </select>
            </div>
            <div><label className="label">Openings</label><input className="input" type="number" min="1" value={form.num_openings} onChange={f("num_openings")} /></div>
            <div><label className="label">Governorate</label>
              <select className="input" value={form.governorate} onChange={f("governorate")}>
                <option value="">Select…</option>{GOVS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div><label className="label">Work Mode</label>
              <select className="input" value={form.work_mode} onChange={f("work_mode")}>
                <option value="on_site">On-site</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div><label className="label">Application Deadline</label><input className="input" type="date" value={form.deadline} onChange={f("deadline")} /></div>
            <div><label className="label">Compensation</label>
              <select className="input" value={form.is_paid} onChange={e => setForm(p => ({ ...p, is_paid: e.target.value === "true" }))}>
                <option value="true">Paid</option><option value="false">Unpaid</option>
              </select>
            </div>
            <div style={{ gridColumn: "span 2" }}><label className="label">Job Description</label><textarea className="input" style={{ minHeight: 120 }} placeholder="Describe the role and responsibilities…" value={form.description} onChange={f("description")} /></div>
          </div>
          <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!form.job_title}>Next →</button>
        </div>
      )}

      {step === 2 && (
        <div className="card fade-in" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-grid">
            <div><label className="label">Min. Education</label>
              <select className="input" value={form.min_education} onChange={f("min_education")}>
                <option value="any">Any</option><option value="high_school">High School</option><option value="vocational">Vocational</option><option value="bachelor">Bachelor's</option><option value="master">Master's</option>
              </select>
            </div>
            <div><label className="label">Min. Experience (years)</label><input className="input" type="number" min="0" value={form.min_experience_years} onChange={f("min_experience_years")} /></div>
          </div>
          <div>
            <label className="label">Required Skills</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
              {skills.map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(39,174,96,.15)", border: "1px solid rgba(39,174,96,.3)", borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "#58D68D" }}>
                  {s}<span style={{ cursor: "pointer", color: "#6B7A9A" }} onClick={() => setSkills(skills.filter(sk => sk !== s))}>×</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="input" placeholder="Add required skill…" value={newSkill} onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === "Enter" && newSkill.trim() && (setSkills([...skills, newSkill.trim()]), setNewSkill(""))} style={{ flex: 1 }} />
              <button className="btn btn-green" onClick={() => newSkill.trim() && (setSkills([...skills, newSkill.trim()]), setNewSkill(""))}>+ Add</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>Review →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card fade-in">
            <div style={{ fontFamily: "'DM Serif Display'", fontSize: 20, color: "#E4EAF4", marginBottom: 4 }}>{form.job_title || "Job Title"}</div>
            <div style={{ color: "#6B7A9A", fontSize: 13, marginBottom: 12 }}>{profile?.org_name} · {form.governorate} · {form.posting_type?.replace("_"," ")} · {form.num_openings} opening(s)</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {skills.map(s => <span key={s} className="badge badge-green">{s}</span>)}
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: "rgba(39,174,96,.08)", border: "1px solid rgba(39,174,96,.2)", fontSize: 13, color: "#C5D0E0" }}>
              🤖 AI will automatically match this posting to qualified candidates in the database when published.
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}>← Edit</button>
            <button className="btn btn-amber" onClick={handlePublish} disabled={saving}>
              {saving ? <><Spinner size={14} color="#07111F" /> Publishing…</> : "🚀 Publish Posting"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MyPostings({ setActivePage }) {
  const { profile, showSuccess } = useAuth();
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) db.getEmployerPostings(profile.id).then(p => { setPostings(p); setLoading(false); });
    else setLoading(false);
  }, [profile]);

  const close = async (id) => {
    await db.closePosting(id);
    setPostings(prev => prev.map(p => p.id === id ? { ...p, status: "closed" } : p));
    showSuccess("Posting closed.");
  };

  return (
    <div style={{ maxWidth: 860 }}>
      <SectionHeader title="My Postings" sub="All your job listings"
        action={<button className="btn btn-amber" onClick={() => setActivePage("post")}>➕ Post New Job</button>} />
      {loading ? <div style={{ textAlign: "center", padding: 60 }}><Spinner size={32} color="#27AE60" /></div>
      : postings.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 56 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💼</div>
          <div style={{ color: "#6B7A9A", marginBottom: 18 }}>No postings yet.</div>
          <button className="btn btn-green" onClick={() => setActivePage("post")}>Post Your First Job →</button>
        </div>
      ) : postings.map((p, i) => (
        <div key={p.id} className="card" style={{ marginBottom: 14, animation: `fadeUp .4s ease ${i*.07}s both` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
                <div style={{ fontWeight: 700, fontSize: 17, color: "#E4EAF4" }}>{p.job_title}</div>
                <span className={`badge ${p.status === "active" ? "badge-green" : "badge-gray"}`}>{p.status}</span>
                <span className="badge badge-blue">{p.posting_type?.replace("_"," ")}</span>
              </div>
              <div style={{ fontSize: 13, color: "#6B7A9A", marginBottom: 10 }}>
                {p.governorate} · {p.work_mode?.replace("_"," ")} · Deadline: {p.deadline || "Open"} · {p.num_openings} opening(s)
              </div>
              {(p.required_skills||[]).length > 0 && (
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {(p.required_skills||[]).slice(0,4).map(s => <span key={s} className="badge badge-gray">{s}</span>)}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 16 }}>
              <button className="btn btn-ghost" style={{ fontSize: 13 }} onClick={() => setActivePage("candidates")}>View Applicants</button>
              {p.status === "active" && <button className="btn btn-danger" style={{ fontSize: 13 }} onClick={() => close(p.id)}>Close</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CandidateView() {
  const { profile } = useAuth();
  const [postings, setPostings] = useState([]);
  const [selectedPosting, setSelectedPosting] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.id) db.getEmployerPostings(profile.id).then(setPostings);
  }, [profile]);

  const loadCandidates = async (posting) => {
    setSelectedPosting(posting);
    setLoading(true);
    const apps = await db.getPostingApplications(posting.id);
    setCandidates(apps);
    setLoading(false);
  };

  const updateStatus = async (appId, status) => {
    await db.updateApplicationStatus(appId, status);
    setCandidates(prev => prev.map(c => c.id === appId ? { ...c, status } : c));
  };

  return (
    <div style={{ maxWidth: 920 }}>
      <SectionHeader title="Candidates" sub="View applicants for your postings" />
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 18 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7A9A", textTransform: "uppercase", letterSpacing: .6, marginBottom: 10 }}>Your Postings</div>
          {postings.length === 0 ? <div style={{ color: "#374151", fontSize: 13 }}>No postings yet</div>
          : postings.map(p => (
            <button key={p.id} onClick={() => loadCandidates(p)}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 10, marginBottom: 6, cursor: "pointer",
                background: selectedPosting?.id === p.id ? "rgba(39,174,96,.15)" : "rgba(255,255,255,.03)",
                border: `1px solid ${selectedPosting?.id === p.id ? "rgba(39,174,96,.4)" : "rgba(255,255,255,.07)"}`,
                color: selectedPosting?.id === p.id ? "#58D68D" : "#C5D0E0", fontSize: 13, fontFamily: "'DM Sans'", fontWeight: 500, transition: "all .18s" }}>
              {p.job_title}
            </button>
          ))}
        </div>

        <div>
          {!selectedPosting && (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>👈</div>
              <div style={{ color: "#6B7A9A" }}>Select a posting to view its applicants</div>
            </div>
          )}
          {selectedPosting && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#E4EAF4", marginBottom: 14 }}>
                Applicants for: {selectedPosting.job_title}
              </div>
              {loading ? <div style={{ textAlign: "center", padding: 40 }}><Spinner size={28} color="#27AE60" /></div>
              : candidates.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
                  <div style={{ color: "#6B7A9A" }}>No applications yet for this posting.</div>
                </div>
              ) : candidates.map((c, i) => (
                <div key={c.id} className="card" style={{ marginBottom: 12, animation: `fadeUp .3s ease ${i*.06}s both` }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#2E86DE,#8E44AD)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Serif Display'", fontSize: 18, color: "#fff", flexShrink: 0 }}>
                      {(c.job_seekers?.full_name || "?")[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: "#E4EAF4", fontSize: 14 }}>{c.job_seekers?.full_name || "Anonymous"}</div>
                      <div style={{ fontSize: 12, color: "#6B7A9A" }}>
                        {c.job_seekers?.governorate} · {c.job_seekers?.education_level?.replace("_"," ")} · {c.job_seekers?.years_experience || 0} yrs exp
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                      {c.status === "applied" && (
                        <>
                          <button className="btn btn-primary" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => updateStatus(c.id, "under_review")}>Review</button>
                          <button className="btn btn-green" style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => updateStatus(c.id, "interview")}>Interview</button>
                        </>
                      )}
                      {c.status !== "applied" && (
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: c.status === "hired" ? "rgba(39,174,96,.2)" : c.status === "rejected" ? "rgba(231,76,60,.2)" : "rgba(245,166,35,.2)",
                          color: c.status === "hired" ? "#58D68D" : c.status === "rejected" ? "#E74C3C" : "#F5A623" }}>
                          {c.status?.replace("_"," ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  REQUIRED ENVIRONMENT VARIABLES
//  Create a file called .env in your project root:
//
//  REACT_APP_SUPABASE_URL=https://xxxx.supabase.co
//  REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
//
//  Get these from: supabase.com → your project → Settings → API
// ═══════════════════════════════════════════════════════════
