import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft, Bell, Home, CheckCircle2, Users, MessageSquarePlus, User,
  MapPin, Lock, ShieldCheck, BadgeCheck, Briefcase, GraduationCap,
  HeartPulse, Construction, Shield, Trees, Sparkles, ChevronRight,
  Building2, Info, Clock, Share2, Ban, KeyRound, ArrowRight, Check,
  Send, Radio as RadioIcon, Footprints, CreditCard, ChevronDown, ChevronLeft, Landmark
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────
   BOOTH — interactive prototype (concept / mock data only)
   Design system
─────────────────────────────────────────────────────────────────────────── */
const G = {
  green: "#1c7a4d",
  greenDark: "#155e3b",
  greenDeep: "#0f4e30",
  greenSoft: "#e7f3ec",
  greenSofter: "#f1f8f4",
  greenText: "#1c7a4d",
  ink: "#111512",
  sub: "#7c8a82",
  line: "#e8ece9",
  bg: "#f7f9f7",
  card: "#ffffff",
  amber: "#b9770b",
  amberSoft: "#fdf3e2",
  red: "#c0392b",
  redSoft: "#fbeceb",
};

const FONT_DISPLAY = `"Bricolage Grotesque","Arial Black",system-ui,sans-serif`;
const FONT_BODY = `"Spline Sans","Helvetica Neue",system-ui,sans-serif`;

/* font loader */
function useFonts() {
  useEffect(() => {
    const id = "booth-fonts";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Spline+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
  }, []);
}

/* ── small shared UI ──────────────────────────────────────────────────── */
const Btn = ({ children, onClick, variant = "primary", disabled, style, icon }) => {
  const base = {
    width: "100%", border: "none", borderRadius: 14, padding: "16px 20px",
    fontFamily: FONT_BODY, fontWeight: 600, fontSize: 16, cursor: disabled ? "default" : "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "transform .12s ease, opacity .15s ease, background .2s",
    ...style,
  };
  const variants = {
    primary: { background: G.green, color: "#fff" },
    dark: { background: "#10110f", color: "#fff" },
    outline: { background: "transparent", color: G.green, border: `1.5px solid ${G.green}` },
    ghostDark: { background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.45)" },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...variants[variant], opacity: disabled ? 0.55 : 1 }}
      onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "scale(.985)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {icon}{children}
    </button>
  );
};

const TopBar = ({ onBack, right, title = "Booth", step }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 18px", borderBottom: `1px solid ${G.line}`, background: G.card,
    position: "sticky", top: 0, zIndex: 5,
  }}>
    <div style={{ width: 40 }}>
      {onBack && <ArrowLeft size={22} color={G.ink} style={{ cursor: "pointer" }} onClick={onBack} />}
    </div>
    <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, color: G.green, fontSize: 19, letterSpacing: -0.3 }}>{title}</div>
    <div style={{ width: 40, textAlign: "right", color: G.sub, fontSize: 13, fontWeight: 600 }}>
      {step ? step : right}
    </div>
  </div>
);

/* one canonical destination for every tab, used on every screen */
const TAB_DEST = {
  home: "readyhome",
  match: "ranked",
  community: "live",
  companion: "ai",
  profile: "voted",
};

const TabBar = ({ active = "home", go, onNav }) => {
  const tabs = [
    { id: "home", label: "HOME", icon: Home },
    { id: "match", label: "MATCH", icon: CheckCircle2 },
    { id: "community", label: "COMMUNITY", icon: Users },
    { id: "companion", label: "COMPANION", icon: MessageSquarePlus },
    { id: "profile", label: "PROFILE", icon: User },
  ];
  const handle = (id) => {
    if (go) return go(TAB_DEST[id]);   // preferred: route via shared map
    if (onNav) return onNav(id);        // legacy fallback
  };
  return (
    <div style={{ padding: "10px 14px 18px" }}>
      <div style={{
        background: G.green, borderRadius: 26, display: "flex", justifyContent: "space-around",
        padding: "12px 6px", boxShadow: "0 10px 28px rgba(28,122,77,.28)",
      }}>
        {tabs.map((t) => {
          const I = t.icon;
          const on = active === t.id;
          return (
            <div key={t.id} onClick={() => handle(t.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", opacity: on ? 1 : 0.7 }}>
              <I size={20} color="#fff" strokeWidth={on ? 2.4 : 1.9} />
              <span style={{ color: "#fff", fontSize: 8.5, fontWeight: 700, letterSpacing: 0.4 }}>{t.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Phone = ({ children, dark }) => (
  <div style={{
    width: "100%", maxWidth: 393, height: "100%", background: dark ? "#0c0e0c" : G.bg,
    display: "flex", flexDirection: "column", position: "relative", overflow: "hidden",
  }}>{children}</div>
);

const Scroll = ({ children, dark, pad = "0 18px 24px" }) => (
  <div style={{ flex: 1, overflowY: "auto", padding: pad, WebkitOverflowScrolling: "touch" }}>
    {children}
  </div>
);

const Logo = ({ size = 44 }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.28, background: G.green,
    display: "grid", placeItems: "center",
  }}>
    <Check size={size * 0.5} color="#fff" strokeWidth={3} />
  </div>
);

const fadeUp = `@keyframes bfade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;

/* avatar images (placeholder portraits) */
const AV = {
  vikram: "https://images.unsplash.com/photo-1559548331-f9cb98280344?w=200&h=200&fit=crop&crop=faces",
  priya: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces",
  amitabh: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=faces",
  somnath: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&h=200&fit=crop&crop=faces",
  ajay: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
  sarah: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces",
  anjali: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=faces",
};
const Avatar = ({ src, size = 56, ring }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
    border: ring ? `2.5px solid ${ring}` : "none", background: "#ddd",
  }}>
    <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
      onError={(e) => { e.currentTarget.style.display = "none"; }} />
  </div>
);

/* ════════════════════════════════════════════════════════════════════════
   SCREENS
═══════════════════════════════════════════════════════════════════════════ */

/* 1 — Welcome */
const Welcome = ({ go }) => (
  <Phone>
    <Scroll pad="0">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "70px 28px 0", animation: "bfade .5s ease" }}>
        <Logo size={56} />
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, marginTop: 14, color: G.ink }}>Booth</div>

        <div style={{ position: "relative", width: 250, height: 165, marginTop: 44 }}>
          <div style={{ position: "absolute", inset: 0, background: "#bfe3cd", borderRadius: 22, transform: "rotate(4deg) translate(10px,6px)" }} />
          <div style={{ position: "absolute", inset: 0, background: G.green, borderRadius: 22, display: "grid", placeItems: "center", boxShadow: "0 18px 40px rgba(28,122,77,.25)" }}>
            <div style={{ color: "#fff", fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22, textAlign: "center", lineHeight: 1.25 }}>
              Your<br />constituency.<br />Your vote.
            </div>
          </div>
        </div>

        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 38, lineHeight: 1.05, textAlign: "center", marginTop: 56, color: G.ink, letterSpacing: -1 }}>
          The booth comes to you.
        </div>
        <div style={{ color: G.sub, fontSize: 17, textAlign: "center", marginTop: 16, lineHeight: 1.4 }}>
          Vote smart. Vote informed.<br />Vote from anywhere.
        </div>
      </div>
      <div style={{ padding: "44px 22px 12px" }}>
        <Btn onClick={() => go("epic")}>Get Started</Btn>
        <div style={{ textAlign: "center", color: G.sub, fontSize: 11, marginTop: 18, lineHeight: 1.7 }}>
          Independent civic platform · Not affiliated with ECI.<br />
          <span style={{ color: "#aab5af", letterSpacing: 1 }}>PRIVACY  ·  TERMS</span>
        </div>
      </div>
    </Scroll>
  </Phone>
);

/* 2 — EPIC entry */
const Epic = ({ go }) => {
  const [v, setV] = useState("");
  return (
    <Phone>
      <TopBar onBack={() => go("welcome")} step="1 of 4" />
      <Scroll>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 38, lineHeight: 1.05, margin: "26px 0 12px", color: G.ink, letterSpacing: -1 }}>
          Enter your<br />voter ID.
        </h1>
        <p style={{ color: G.sub, fontSize: 16, lineHeight: 1.45, margin: 0 }}>
          We use this to find your constituency and verify your registration.
        </p>

        <div style={{ marginTop: 28, color: G.greenText, fontWeight: 700, fontSize: 14 }}>EPIC Number</div>
        <input value={v} onChange={(e) => setV(e.target.value.toUpperCase())} placeholder="ECI-XXXXXXXXX"
          style={{
            width: "100%", boxSizing: "border-box", marginTop: 8, padding: "16px 16px", borderRadius: 12,
            border: `1.5px solid ${G.line}`, fontFamily: FONT_BODY, fontSize: 16, letterSpacing: 1, color: G.ink, outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = G.green)}
          onBlur={(e) => (e.target.style.borderColor = G.line)} />

        <div style={{ background: G.green, borderRadius: 20, padding: 22, marginTop: 22, color: "#fff" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(255,255,255,.18)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <MapPin size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Karol Bagh, New Delhi</div>
              <div style={{ opacity: 0.85, fontSize: 13 }}>Central Delhi District</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
            {[["ASSEMBLY SEGMENT", "AC-23 Karol Bagh"], ["PART NUMBER", "142"]].map(([k, val]) => (
              <div key={k} style={{ flex: 1, background: "rgba(255,255,255,.12)", borderRadius: 14, padding: 14 }}>
                <div style={{ fontSize: 9.5, letterSpacing: 0.6, opacity: 0.8, fontWeight: 700 }}>{k}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 6 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </Scroll>
      <FooterBar note="Your voter ID is never stored on our servers" lock>
        <Btn onClick={() => go("aadhaar")}>Continue</Btn>
      </FooterBar>
    </Phone>
  );
};

const FooterBar = ({ children, note, lock }) => (
  <div style={{ borderTop: `1px solid ${G.line}`, background: G.card, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: "20px 18px 16px", boxShadow: "0 -8px 24px rgba(0,0,0,.04)" }}>
    {children}
    {note && (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, color: G.sub, fontSize: 12 }}>
        {lock && <Lock size={12} />}{note}
      </div>
    )}
  </div>
);

/* 3 — Aadhaar entry */
const Aadhaar = ({ go }) => {
  const [v, setV] = useState("");
  return (
    <Phone>
      <TopBar onBack={() => go("epic")} step="2 of 4" />
      <Scroll>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 38, lineHeight: 1.05, margin: "26px 0 12px", color: G.ink, letterSpacing: -1 }}>
          Your Aadhaar number
        </h1>
        <p style={{ color: G.sub, fontSize: 16, lineHeight: 1.45, margin: 0 }}>
          We use this to find your constituency and verify your registration.
        </p>

        <div style={{ marginTop: 26, color: G.greenText, fontWeight: 700, fontSize: 14 }}>Aadhaar Number</div>
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder="XXXX-XXXX-XXXX"
          style={{ width: "100%", boxSizing: "border-box", marginTop: 8, padding: "16px", borderRadius: 12, border: `1.5px solid ${G.line}`, fontFamily: FONT_BODY, fontSize: 16, letterSpacing: 1, color: G.ink, outline: "none" }}
          onFocus={(e) => (e.target.style.borderColor = G.green)} onBlur={(e) => (e.target.style.borderColor = G.line)} />

        <div style={{ background: G.greenSoft, borderRadius: 14, padding: 16, marginTop: 18, display: "flex", gap: 10 }}>
          <ShieldCheck size={20} color={G.green} style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ color: G.greenDark, fontSize: 14, lineHeight: 1.4, fontWeight: 500 }}>
            Your Aadhaar is used only to confirm your identity. It is never stored or linked to how you vote.
          </div>
        </div>

        <div style={{ background: G.greenSofter, borderRadius: 18, padding: "30px 16px", marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#fff", display: "grid", placeItems: "center", boxShadow: "0 4px 14px rgba(0,0,0,.06)" }}>
            <Lock size={22} color={G.green} />
          </div>
          <div style={{ color: G.greenDark, fontWeight: 700, fontSize: 15 }}>End-to-End Encrypted</div>
        </div>
      </Scroll>
      <FooterBar note="Your voter ID is never stored on our servers" lock>
        <Btn onClick={() => go("otp")}>Continue</Btn>
      </FooterBar>
    </Phone>
  );
};

/* OTP boxes shared */
const OtpBoxes = ({ dark, value, onChange }) => {
  const refs = useRef([]);
  const set = (i, val) => {
    const d = val.replace(/\D/g, "").slice(-1);
    const arr = value.split("");
    arr[i] = d; const next = arr.join("");
    onChange(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {Array.from({ length: 6 }).map((_, i) => {
        const filled = value[i];
        const focusFirstEmpty = value.length === i;
        return (
          <input key={i} ref={(el) => (refs.current[i] = el)} value={value[i] || ""} inputMode="numeric"
            onChange={(e) => set(i, e.target.value)}
            onKeyDown={(e) => { if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus(); }}
            style={{
              width: 50, height: 58, borderRadius: 14, textAlign: "center",
              fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 24, outline: "none",
              border: `2px solid ${filled || focusFirstEmpty ? G.green : (dark ? "#2a2d2a" : G.line)}`,
              background: dark ? "transparent" : "#fff", color: dark ? "#fff" : G.ink,
            }} />
        );
      })}
    </div>
  );
};

/* 4 — OTP verify (step 3 of 4) */
const Otp = ({ go }) => {
  const [code, setCode] = useState("41");
  return (
    <Phone>
      <TopBar onBack={() => go("aadhaar")} step="3 of 4" />
      <Scroll>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, margin: "26px 0 10px", color: G.ink, letterSpacing: -0.8 }}>
          Verify it's you.
        </h1>
        <p style={{ color: G.sub, fontSize: 15, lineHeight: 1.45, margin: "0 0 28px" }}>
          We've sent a one-time password to the mobile number linked to your Aadhaar.
        </p>
        <OtpBoxes value={code} onChange={setCode} />
        <div style={{ color: G.green, fontWeight: 700, fontSize: 13, marginTop: 16, letterSpacing: 0.3 }}>RESEND IN 0:42</div>
      </Scroll>
      <FooterBar>
        <Btn onClick={() => go("issues")} icon={<Lock size={17} />}>Verify</Btn>
      </FooterBar>
    </Phone>
  );
};

/* 5 — Issues (step 4 of 4) */
const ISSUES = [
  { id: "jobs", icon: Briefcase, t: "Jobs and employment", d: "Economic growth & l…" },
  { id: "roads", icon: Construction, t: "Roads and infrastructure", d: "Better transit & conn…" },
  { id: "edu", icon: GraduationCap, t: "Education", d: "Quality schools & lite…" },
  { id: "health", icon: HeartPulse, t: "Healthcare", d: "Affordable clinics & c…" },
  { id: "safety", icon: Shield, t: "Women's safety", d: "Protection & reporting" },
  { id: "env", icon: Trees, t: "Environment", d: "Pollution & …" },
];
const Issues = ({ go }) => {
  const [sel, setSel] = useState(["jobs", "edu"]);
  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 5 ? [...s, id] : s));
  return (
    <Phone>
      <TopBar onBack={() => go("otp")} step="4 of 4" />
      <Scroll>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 38, lineHeight: 1.05, margin: "24px 0 10px", color: G.ink, letterSpacing: -1 }}>
          What matters to you?
        </h1>
        <div style={{ color: G.green, fontWeight: 700, fontSize: 15 }}>{sel.length} of 5 selected</div>
        <p style={{ color: G.sub, fontSize: 15, lineHeight: 1.45, margin: "8px 0 22px" }}>
          Pick 3 to 5 issues. We'll use these to match you with candidates who share your priorities.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {ISSUES.map((it) => {
            const I = it.icon; const on = sel.includes(it.id);
            return (
              <div key={it.id} onClick={() => toggle(it.id)} style={{
                position: "relative", background: on ? G.greenSofter : G.card,
                border: `1.6px solid ${on ? G.green : G.line}`, borderRadius: 16, padding: 16, cursor: "pointer",
                minHeight: 118, transition: "all .15s",
              }}>
                {on && <div style={{ position: "absolute", top: 12, right: 12, width: 22, height: 22, borderRadius: "50%", background: G.green, display: "grid", placeItems: "center" }}><Check size={13} color="#fff" strokeWidth={3} /></div>}
                <I size={22} color={G.ink} strokeWidth={1.8} />
                <div style={{ fontWeight: 700, fontSize: 15, marginTop: 28, color: G.ink, lineHeight: 1.2 }}>{it.t}</div>
                <div style={{ color: G.sub, fontSize: 12.5, marginTop: 5 }}>{it.d}</div>
              </div>
            );
          })}
        </div>
      </Scroll>
      <FooterBar note="STEP 3 OF 3 · VOTER REGISTRATION ACTIVE">
        <Btn onClick={() => go("ranked")} disabled={sel.length < 2}>Continue</Btn>
      </FooterBar>
    </Phone>
  );
};

/* 6 — Candidates ranked */
const Ranked = ({ go }) => (
  <Phone>
    <TopBar right={<Bell size={20} color={G.green} />} />
    <Scroll>
      <div style={{ background: G.card, borderRadius: 22, padding: "18px 18px 22px", marginTop: 14, boxShadow: "0 2px 10px rgba(0,0,0,.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, color: G.ink, fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: G.green }} />Karol Bagh, New Delhi
          </span>
          <span style={{ color: G.sub }}>Lok Sabha 2024</span>
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 36, lineHeight: 1.05, margin: "14px 0 10px", color: G.ink, letterSpacing: -1 }}>
          Your candidates, ranked.
        </h1>
        <p style={{ color: G.sub, fontSize: 15, margin: 0 }}>Based on your priorities education, healthcare, governance.</p>

        {/* #1 */}
        <div onClick={() => go("candidate")} style={{ background: G.green, borderRadius: 20, padding: 20, marginTop: 18, color: "#fff", position: "relative", cursor: "pointer", boxShadow: "0 12px 30px rgba(28,122,77,.22)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ background: "#fff", color: G.green, borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <Sparkles size={13} />98% MATCH
            </span>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 26, opacity: 0.55 }}>#1</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}>
            <Avatar src={AV.vikram} size={56} ring="#fff" />
            <div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 22 }}>Dr. Vikram Sethi</div>
              <div style={{ opacity: 0.85, fontSize: 13 }}>Bharatiya Janata Party</div>
            </div>
          </div>
          <div style={{ fontSize: 15, marginTop: 14, lineHeight: 1.4, fontStyle: "italic", opacity: 0.95 }}>
            "Strongest alignment on education funding and anti-corruption record."
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            {["Clean record", "3 promises kept"].map((c) => (
              <span key={c} style={{ background: "rgba(255,255,255,.16)", borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 600 }}>{c}</span>
            ))}
          </div>
        </div>

        {[{ n: "Priya Sharma", p: "National Progress Alliance", m: 84, a: AV.priya }, { n: "Amitabh Varma", p: "People's Unity Block", m: 72, a: AV.amitabh }].map((c) => (
          <div key={c.n} onClick={() => go("candidate")} style={{ display: "flex", alignItems: "center", gap: 14, background: G.card, border: `1px solid ${G.line}`, borderRadius: 16, padding: 14, marginTop: 12, cursor: "pointer" }}>
            <div style={{ position: "relative" }}>
              <Avatar src={c.a} size={46} />
              <span style={{ position: "absolute", top: -4, left: -4, background: "#fff", color: G.green, fontSize: 10, fontWeight: 800, padding: "1px 5px", borderRadius: 10, border: `1px solid ${G.greenSoft}` }}>{c.m}%</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: G.ink }}>{c.n}</div>
              <div style={{ color: G.sub, fontSize: 13 }}>{c.p}</div>
            </div>
            <ChevronRight size={20} color={G.sub} />
          </div>
        ))}
      </div>

      <div style={{ background: G.greenSofter, borderRadius: 20, padding: 20, marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: G.greenSoft, display: "grid", placeItems: "center" }}><BadgeCheck size={18} color={G.green} /></div>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: G.greenDark }}>Detailed Analysis</span>
        </div>
        <p style={{ color: G.sub, fontSize: 14, lineHeight: 1.45, margin: "12px 0 16px" }}>
          We've cross-referenced 12 manifesto points and 4 years of parliamentary voting history to generate this match.
        </p>
        <Btn variant="primary" onClick={() => go("compare")}>Compare All Candidates</Btn>
      </div>
    </Scroll>
    <TabBar active="match" go={go} />
  </Phone>
);

/* 7 — Candidate detail */
const Candidate = ({ go }) => {
  const [tab, setTab] = useState("Promises");
  const promises = {
    Promises: [
      { t: "100% Electrification of Rural Primary Health Centers", s: "Source: ECI affidavit 2019", st: "KEPT", c: G.green, bg: G.greenSoft },
      { t: "Creation of 500-acre 'Eco-Tech' Corridor in East Ward", s: "Source: Manifesto 2019", st: "PENDING", c: G.amber, bg: G.amberSoft },
      { t: "Reduction of Municipal Property Tax by 15%", s: "Source: Public Rally, Aug 2019", st: "BROKEN", c: G.red, bg: G.redSoft },
    ],
    "Track record": [
      { t: "Attended 91% of parliamentary sessions", s: "Lok Sabha attendance 2019–24", st: "HIGH", c: G.green, bg: G.greenSoft },
      { t: "Sponsored 7 private member bills", s: "PRS Legislative record", st: "ACTIVE", c: G.green, bg: G.greenSoft },
    ],
    "Criminal record": [
      { t: "No criminal cases on file", s: "ECI affidavit 2024", st: "CLEAN", c: G.green, bg: G.greenSoft },
    ],
  };
  return (
    <Phone>
      <TopBar onBack={() => go("ranked")} right={<Bell size={20} color={G.green} />} />
      <Scroll>
        <div style={{ background: G.green, borderRadius: 22, padding: 22, marginTop: 14, color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Avatar src={AV.vikram} size={66} ring="rgba(255,255,255,.5)" />
            <span style={{ background: "#fff", color: G.green, borderRadius: 20, padding: "6px 12px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <Sparkles size={13} />98% MATCH
            </span>
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 28, marginTop: 16 }}>Dr. Vikram Sethi</div>
          <div style={{ opacity: 0.9, fontSize: 14, marginTop: 6, lineHeight: 1.4 }}>Bharatiya Janata Party<br />Bengaluru, Central</div>
        </div>

        <div style={{ background: G.greenSofter, borderRadius: 18, padding: 18, marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: G.green, fontWeight: 700, fontSize: 14 }}>
            <Sparkles size={15} />BOOTH AI SUMMARY
          </div>
          <p style={{ color: G.ink, fontSize: 15, lineHeight: 1.5, margin: "12px 0 0" }}>
            Based on your priorities in education and healthcare, this candidate has the strongest alignment. They have fulfilled 3 of 5 promises from their last term and have no criminal record on file.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          {Object.keys(promises).map((k) => (
            <button key={k} onClick={() => setTab(k)} style={{
              border: "none", borderRadius: 10, padding: "9px 14px", fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13.5, cursor: "pointer",
              background: tab === k ? G.green : "#eef1ee", color: tab === k ? "#fff" : G.sub,
            }}>{k}</button>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          {promises[tab].map((p) => (
            <div key={p.t} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, background: G.card, border: `1px solid ${G.line}`, borderRadius: 14, padding: 16, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: G.ink, lineHeight: 1.3 }}>{p.t}</div>
                <div style={{ color: G.sub, fontSize: 12.5, marginTop: 8 }}>{p.s}</div>
              </div>
              <span style={{ background: p.bg, color: p.c, borderRadius: 20, padding: "5px 11px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{p.st}</span>
            </div>
          ))}
        </div>

        <div style={{ background: G.greenSofter, borderRadius: 20, padding: 16, marginTop: 4 }}>
          <Btn onClick={() => go("electionday")}>Start Voting</Btn>
        </div>
      </Scroll>
      <TabBar active="match" go={go} />
    </Phone>
  );
};

/* 8 — Compare */
const Compare = ({ go }) => {
  const rows = [["Full Subsidy", "Healthcare", "Full Subsidy", "Tax Credits"],
  ["Single Payer", "Healthcare", "Healthcare", "Hybrid Model"],
  ["Decentralized", "Governance", "Governance", "Federalized"]];
  const Donut = ({ pct }) => (
    <div style={{ position: "relative", width: 80, height: 44, overflow: "hidden" }}>
      <svg width="80" height="80" style={{ position: "absolute", top: 0 }}>
        <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="6" strokeDasharray="100 200" strokeLinecap="round" transform="rotate(180 40 40)" />
        <circle cx="40" cy="40" r="32" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray={`${pct} 200`} strokeLinecap="round" transform="rotate(180 40 40)" />
      </svg>
      <div style={{ position: "absolute", bottom: 0, width: "100%", textAlign: "center", color: "#fff", fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16 }}>{pct} %</div>
    </div>
  );
  return (
    <Phone>
      <TopBar onBack={() => go("ranked")} right={<Bell size={20} color={G.green} />} />
      <Scroll>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, position: "relative" }}>
          <div style={{ textAlign: "center", flex: 1 }}>
            <Avatar src={AV.vikram} size={96} ring={G.greenSoft} />
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: G.greenDark, marginTop: 10 }}>Vikram Sethi</div>
          </div>
          <div style={{ width: 76, height: 76, borderRadius: "50%", background: G.greenDeep, display: "grid", placeItems: "center", color: "#fff", flexShrink: 0, boxShadow: "0 6px 18px rgba(0,0,0,.18)", border: "4px solid #fff" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 1, opacity: 0.85 }}>MATCH</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 19 }}>98%</div>
            </div>
          </div>
          <div style={{ textAlign: "center", flex: 1 }}>
            <Avatar src={AV.sarah} size={96} ring="#e8ece9" />
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: G.greenDark, marginTop: 10 }}>Sarah Chen</div>
          </div>
        </div>

        <div style={{ background: G.green, borderRadius: 22, padding: 22, marginTop: 24, color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontWeight: 700, fontSize: 14 }}>Vikram Sethi</div><div style={{ opacity: 0.7, fontSize: 10, letterSpacing: 0.5 }}>INCUMBENT</div></div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ background: "rgba(255,255,255,.15)", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>Profile</span>
              <span style={{ background: "rgba(255,255,255,.15)", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>Platform</span>
            </div>
            <div style={{ textAlign: "right" }}><div style={{ fontWeight: 700, fontSize: 14 }}>Sara Chen</div><div style={{ opacity: 0.7, fontSize: 10, letterSpacing: 0.5 }}>CHALLENGER</div></div>
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 }}>
              <span style={{ fontSize: 14, flex: 1 }}>{r[0]}</span>
              <span style={{ background: "#a9dcbd", color: G.greenDeep, fontWeight: 700, fontSize: 13.5, padding: "8px 16px", borderRadius: 10, flexShrink: 0 }}>{r[1]}</span>
              <span style={{ fontSize: 14, flex: 1, textAlign: "right" }}>{r[3]}</span>
            </div>
          ))}
          <div style={{ background: "#0c1f15", borderRadius: 12, padding: 16, marginTop: 22, fontStyle: "italic", fontSize: 14, lineHeight: 1.4, color: "#cfe8da" }}>
            "Booth recommends Candidate A due to stronger alignment on core issues."
          </div>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 22 }}>
            <Donut pct={98} /><Donut pct={89} />
          </div>
        </div>
      </Scroll>
      <TabBar active="companion" go={go} />
    </Phone>
  );
};

/* 9 — Election day home */
const ElectionDay = ({ go }) => (
  <Phone>
    <Scroll pad="0">
      <div style={{ background: G.green, padding: "20px 22px 30px", color: "#fff", borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <ArrowLeft size={20} color="#fff" style={{ cursor: "pointer", opacity: 0.9 }} onClick={() => go("ranked")} />
          <span style={{ background: "rgba(255,255,255,.18)", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700, letterSpacing: 0.6 }}>ELECTION DAY</span>
          <div style={{ width: 20 }} />
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 42, lineHeight: 1.02, margin: "26px 0 12px", letterSpacing: -1.5 }}>
          Today is election day.
        </h1>
        <div style={{ opacity: 0.9, fontSize: 16 }}>Karol Bagh, New Delhi · Lok Sabha 2024</div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.14)", borderRadius: 12, padding: "10px 16px", marginTop: 18, fontSize: 14, fontWeight: 600 }}>
          <Clock size={16} />Polling open: 8:00 AM — 5:00 PM
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", marginTop: 26, paddingTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex" }}>
            {[AV.priya, AV.vikram, AV.anjali].map((a, i) => (
              <div key={i} style={{ marginLeft: i ? -10 : 0, border: "2px solid #1c7a4d", borderRadius: "50%" }}><Avatar src={a} size={30} /></div>
            ))}
          </div>
          <div style={{ fontSize: 14, opacity: 0.92 }}>1,247 people in your constituency have voted so far</div>
        </div>
      </div>

      <div style={{ padding: "18px 18px 0" }}>
        <div style={{ background: G.card, border: `1.5px solid ${G.green}`, borderRadius: 18, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: G.green, fontWeight: 700, fontSize: 12, letterSpacing: 0.5 }}>YOUR BOOTH</span>
            <MapPin size={18} color={G.sub} />
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 19, marginTop: 10, color: G.ink }}>Government Primary School, Block 7.</div>
          <div style={{ color: G.sub, fontSize: 14, marginTop: 4 }}>12th Main Road, Sector 4, HSR Layout</div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: G.greenSoft, color: G.greenDark, borderRadius: 20, padding: "6px 12px", fontSize: 13, fontWeight: 600, marginTop: 12 }}>
            🚶 1.2 km · 14 min walk
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, background: G.card, border: `1px solid ${G.line}`, borderRadius: 16, padding: 12, marginTop: 14 }}>
          <Avatar src={AV.anjali} size={44} />
          <div style={{ flex: 1 }}>
            <div style={{ color: G.sub, fontSize: 12 }}>Your top match</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: G.ink }}>Anjali Sharma</div>
          </div>
          <span style={{ background: G.greenSoft, color: G.greenDark, fontWeight: 700, fontSize: 13, padding: "5px 12px", borderRadius: 20 }}>94%</span>
        </div>

        <div style={{ marginTop: 16 }}>
          <Btn onClick={() => go("constituency")} icon={null} style={{ borderRadius: 28 }}>
            GET DIRECTIONS TO BOOTH <ArrowRight size={18} style={{ marginLeft: 6 }} />
          </Btn>
        </div>
      </div>
    </Scroll>
    <TabBar active="home" go={go} />
  </Phone>
);

/* 10 — Constituency voting now */
const Constituency = ({ go }) => (
  <Phone>
    <TopBar right={<Bell size={20} color={G.green} />} onBack={() => go("electionday")} />
    <Scroll>
      <div style={{ background: G.green, borderRadius: 16, padding: 18, marginTop: 14, color: "#fff" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 22, lineHeight: 1.2 }}>Karol Bagh, New Delhi is voting today.</div>
        <div style={{ opacity: 0.9, fontSize: 14, marginTop: 6 }}>Polling is open until 5:00 PM.</div>
      </div>

      <div style={{ background: G.card, borderRadius: 22, padding: 22, marginTop: 16, border: `1px solid ${G.line}` }}>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, lineHeight: 1.05, margin: "0 0 12px", color: G.ink, letterSpacing: -1 }}>
          Your constituency is voting right now.
        </h1>
        <p style={{ color: G.sub, fontSize: 15, lineHeight: 1.45, margin: "0 0 18px" }}>
          You're registered in Karol Bagh but you're not there today. You can cast your vote securely from here.
        </p>

        <div style={{ border: `1.5px solid ${G.green}`, borderRadius: 18, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: G.ink }}>Karol Bagh, New Delhi</div>
              <div style={{ color: G.green, fontWeight: 700, fontSize: 12.5, letterSpacing: 0.4, marginTop: 4 }}>CONSTITUENCY ID: KB-DL-05</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "#eef1ee", display: "grid", placeItems: "center" }}><Building2 size={20} color={G.sub} /></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            {[["🔒", "End-to-end encrypted"], ["✓", "Aadhaar verified"], ["✓", "ECI registered"]].map(([e, t]) => (
              <span key={t} style={{ background: G.greenSofter, color: G.greenDark, borderRadius: 20, padding: "7px 12px", fontSize: 12.5, fontWeight: 600 }}>{e} {t}</span>
            ))}
          </div>
          <div style={{ background: "#f3f5f3", borderRadius: 12, padding: 14, marginTop: 14, display: "flex", gap: 10 }}>
            <Info size={18} color={G.sub} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ color: G.sub, fontSize: 13.5, lineHeight: 1.4 }}>Your vote carries the same legal weight as a physical vote.</span>
          </div>
          <div style={{ marginTop: 16 }}>
            <Btn onClick={() => go("secure1")} style={{ borderRadius: 14, letterSpacing: 0.5, fontWeight: 700 }}>
              CAST MY VOTE REMOTELY <ArrowRight size={18} style={{ marginLeft: 6 }} />
            </Btn>
          </div>
          <div style={{ textAlign: "center", color: G.sub, fontSize: 13, marginTop: 12 }}>You will need your Aadhaar OTP to proceed.</div>
          <div style={{ textAlign: "center", color: G.green, fontWeight: 700, fontSize: 14, marginTop: 12, cursor: "pointer" }} onClick={() => go("electionday")}>I'll vote in person instead</div>
        </div>
      </div>
    </Scroll>
    <TabBar active="home" go={go} />
  </Phone>
);

/* 11 — Secure session (animated) */
const Secure = ({ go }) => {
  const checks = [
    { t: "No active video calls", d: "Your camera and microphone are not being accessed." },
    { t: "Screen recording disabled", d: "No screen capture is active on this device." },
    { t: "Enabling full screen mode", d: "All notifications will be silenced during voting." },
    { t: "Session token generating", d: "Securing cryptographic unique identifiers." },
  ];
  const [done, setDone] = useState(2);
  useEffect(() => {
    if (done >= 4) return;
    const t = setTimeout(() => setDone((d) => d + 1), 1100);
    return () => clearTimeout(t);
  }, [done]);
  const complete = done >= 4;
  return (
    <Phone dark>
      <div style={{ textAlign: "center", padding: "16px", background: "#000", color: G.green, fontWeight: 700, fontSize: 13, letterSpacing: 1, display: "flex", justifyContent: "center", gap: 8 }}>
        <Lock size={15} />SECURE SESSION
      </div>
      <Scroll dark>
        <div style={{ textAlign: "center", marginTop: 30 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "#10110f", display: "inline-grid", placeItems: "center", border: "1px solid #2a2d2a" }}>
            <ShieldCheck size={26} color="#2ec27e" />
          </div>
          <div style={{ color: "#fff", fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 19, letterSpacing: 2, marginTop: 18 }}>SECURING YOUR ENVIRONMENT</div>
          <div style={{ color: "#8a948c", fontSize: 14, marginTop: 10, lineHeight: 1.4, padding: "0 20px" }}>These checks ensure your vote is private and unobserved.</div>
        </div>

        <div style={{ marginTop: 30 }}>
          {checks.map((c, i) => {
            const isDone = i < done;
            const active = i === done && !complete;
            return (
              <div key={c.t} style={{ display: "flex", gap: 14, background: "#161816", borderRadius: 16, padding: 16, marginBottom: 12, opacity: isDone || active ? 1 : 0.45, transition: "opacity .4s" }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  {isDone
                    ? <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#2ec27e", display: "grid", placeItems: "center" }}><Check size={14} color="#06150d" strokeWidth={3} /></div>
                    : <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${active ? "#2ec27e" : "#3a3d3a"}`, animation: active ? "spin 1s linear infinite" : "none", borderTopColor: active ? "transparent" : undefined }} />}
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{c.t}</div>
                  <div style={{ color: "#8a948c", fontSize: 13.5, marginTop: 4, lineHeight: 1.35 }}>{c.d}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ height: 5, borderRadius: 4, background: "#222", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(done / 4) * 100}%`, background: "#2ec27e", transition: "width .5s", borderRadius: 4 }} />
          </div>
          <div style={{ textAlign: "center", color: "#8a948c", fontSize: 13, marginTop: 12 }}>{Math.min(done, 4)} of 4 checks complete</div>
        </div>
      </Scroll>
      <div style={{ padding: "0 18px 24px" }}>
        <Btn onClick={() => complete && go("finalcheck")} disabled={!complete}
          style={{ background: complete ? "#2ec27e" : "rgba(255,255,255,.06)", color: complete ? "#06150d" : "rgba(255,255,255,.35)" }}>
          Continue
        </Btn>
      </div>
    </Phone>
  );
};

/* 12 — One more check (final identity / OTP) */
const FinalCheck = ({ go }) => {
  const [code, setCode] = useState("41");
  return (
    <Phone>
      <TopBar onBack={() => go("constituency")} right={<Bell size={20} color={G.green} />} />
      <Scroll>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 36, lineHeight: 1.04, margin: "20px 0 12px", color: G.ink, letterSpacing: -1 }}>
          One more check before you vote.
        </h1>
        <p style={{ color: G.sub, fontSize: 15, lineHeight: 1.45, margin: 0 }}>
          We verify your identity again to ensure only you can cast this vote. This session is unique and cannot be reused.
        </p>

        <div style={{ background: G.card, border: `1px solid ${G.line}`, borderRadius: 16, padding: 18, marginTop: 22 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: G.ink }}>One-time session</div>
          <p style={{ color: G.sub, fontSize: 14, lineHeight: 1.45, margin: "8px 0 14px" }}>
            This voting session is tied to your device and EPIC number. It expires when you close the app.
          </p>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: G.greenSoft, display: "grid", placeItems: "center" }}>
            <KeyRound size={18} color={G.green} />
          </div>
        </div>

        <div style={{ marginTop: 24 }}><OtpBoxes value={code} onChange={setCode} /></div>
        <div style={{ color: G.green, fontWeight: 700, fontSize: 13, marginTop: 14, letterSpacing: 0.3 }}>RESEND IN 0:42</div>
        <p style={{ textAlign: "center", color: G.sub, fontSize: 13, marginTop: 24, lineHeight: 1.4, padding: "0 20px" }}>
          This is your second and final identity check. After this, your voting session begins.
        </p>
      </Scroll>
      <FooterBar>
        <Btn onClick={() => go("ballot")} icon={<Lock size={17} />}>Confirm Identity</Btn>
      </FooterBar>
    </Phone>
  );
};

/* 13 — Ballot */
const Ballot = ({ go }) => {
  const [sel, setSel] = useState("vikram");
  const cands = [
    { id: "vikram", n: "Dr. Vikram Sethi", p: "Bharatiya Janata Party", pct: 94, tag: "EDUCATION", a: AV.vikram },
    { id: "somnath", n: "Somnath Bharti", p: "Aam Aadmi Party", pct: 82, tag: "HEALTH", a: AV.somnath },
    { id: "ajay", n: "Ajay Maken", p: "Indian National Congress", pct: 68, tag: "INFRASTRUCTURE", a: AV.ajay },
  ];
  return (
    <Phone>
      <TopBar onBack={() => go("finalcheck")} right={<Bell size={20} color={G.green} />} />
      <Scroll>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: G.ink }}>Karol Bagh, New Delhi</div>
          <div style={{ color: G.sub, fontSize: 14, marginTop: 6 }}>Select one candidate. Your choice is private.</div>
        </div>

        <div style={{ marginTop: 20 }}>
          {cands.map((c) => {
            const on = sel === c.id;
            return (
              <div key={c.id} onClick={() => setSel(c.id)} style={{
                display: "flex", alignItems: "center", gap: 14, background: on ? G.greenSofter : G.card,
                border: `1.6px solid ${on ? G.green : G.line}`, borderRadius: 16, padding: 16, marginBottom: 14, cursor: "pointer", transition: "all .15s",
              }}>
                <Avatar src={c.a} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: G.ink }}>{c.n}</div>
                  <div style={{ color: G.sub, fontSize: 13 }}>{c.p}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: G.green, fontWeight: 700, fontSize: 15 }}>⚡{c.pct}%</div>
                  <div style={{ color: G.sub, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4 }}>{c.tag}</div>
                </div>
                <Radio on={on} />
              </div>
            );
          })}
          <div onClick={() => setSel("nota")} style={{
            display: "flex", alignItems: "center", gap: 14, background: G.card,
            border: `1.6px solid ${sel === "nota" ? G.green : G.line}`, borderRadius: 16, padding: 16, cursor: "pointer",
          }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#eef1ee", display: "grid", placeItems: "center" }}><Ban size={22} color={G.sub} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: G.ink }}>None of the Above</div>
              <div style={{ color: G.sub, fontSize: 13 }}>Reject all candidates</div>
            </div>
            <Radio on={sel === "nota"} />
          </div>
        </div>
      </Scroll>
      <FooterBar>
        <Btn onClick={() => go("countdown")} style={{ borderRadius: 28 }}>Proceed To Confirm ›</Btn>
      </FooterBar>
    </Phone>
  );
};
const Radio = ({ on }) => (
  <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${on ? G.green : "#cdd5cf"}`, display: "grid", placeItems: "center", flexShrink: 0 }}>
    {on && <div style={{ width: 13, height: 13, borderRadius: "50%", background: G.green }} />}
  </div>
);

/* 14 — Countdown confirm */
const Countdown = ({ go }) => {
  const [n, setN] = useState(10);
  useEffect(() => {
    if (n <= 0) return;
    const t = setTimeout(() => setN((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [n]);
  const ready = n <= 0;
  return (
    <Phone>
      <div style={{ flex: 1, background: G.green, display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 28px 0", color: "#fff" }}>
        <Avatar src={AV.vikram} size={96} ring="#fff" />
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, marginTop: 18 }}>Dr. Vikram Sethi</div>
        <div style={{ fontSize: 17, opacity: 0.92, marginTop: 6 }}>Bharatiya Janata Party</div>
        <div style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>Karol Bagh, New Delhi</div>

        <div style={{ width: 150, height: 150, borderRadius: "50%", border: "5px solid rgba(255,255,255,.9)", display: "grid", placeItems: "center", marginTop: 56, transition: "transform .3s", transform: ready ? "scale(1.04)" : "scale(1)" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 56 }}>{Math.max(n, 0)}</div>
        </div>

        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 19, marginTop: 30 }}>You are about to cast your vote.</div>
        <div style={{ fontSize: 15, opacity: 0.78, marginTop: 8, textAlign: "center" }}>This action is final and cannot be undone.</div>
      </div>
      <div style={{ background: G.green, padding: "0 22px 18px" }}>
        <Btn onClick={() => ready && go("recorded")} disabled={!ready}
          style={{ background: ready ? "#10110f" : "rgba(0,0,0,.18)", color: ready ? "#fff" : "rgba(255,255,255,.55)" }}>
          Confirm Vote
        </Btn>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,.7)", fontSize: 13, marginTop: 14, cursor: "pointer" }} onClick={() => go("ballot")}>Changed your mind? Go back.</div>
      </div>
    </Phone>
  );
};

/* 15 — Vote recorded */
const Recorded = ({ go }) => (
  <Phone>
    <TopBar right={<Bell size={20} color={G.green} />} />
    <Scroll>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: G.green, display: "inline-grid", placeItems: "center", boxShadow: "0 12px 30px rgba(28,122,77,.3)" }}>
          <Check size={46} color="#fff" strokeWidth={3} />
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, lineHeight: 1.08, margin: "22px 0 12px", color: G.ink, letterSpacing: -1 }}>
          Your vote has been recorded.
        </h1>
        <p style={{ color: G.sub, fontSize: 15, lineHeight: 1.45, margin: 0, padding: "0 14px" }}>
          It has been encrypted and submitted securely. No one can see how you voted.
        </p>
      </div>

      <div style={{ border: `1px solid ${G.line}`, borderRadius: 18, padding: 20, marginTop: 24 }}>
        {[["REFERENCE NUMBER", "BOOTH-2024-KBN-48271"], ["TIMESTAMP", "26 Apr 2024 · 11:34 AM IST"], ["CONSTITUENCY", "Karol Bagh, New Delhi"]].map(([k, v]) => (
          <div key={k} style={{ marginBottom: 16 }}>
            <div style={{ color: G.green, fontWeight: 700, fontSize: 12, letterSpacing: 0.4 }}>{k}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: G.ink, marginTop: 4 }}>{v}</div>
          </div>
        ))}
        <div style={{ border: `1px solid ${G.line}`, borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: G.greenSoft, display: "grid", placeItems: "center" }}><BadgeCheck size={16} color={G.green} /></div>
          <span style={{ color: G.sub, fontSize: 13.5 }}>Submitted to Election Commission of India</span>
        </div>
      </div>

      <div style={{ background: G.greenSofter, borderRadius: 16, padding: 18, marginTop: 16, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => go("voted")}>
        <Sparkles size={20} color={G.green} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: G.greenDark }}>Verify your vote reached the system</div>
          <div style={{ color: G.sub, fontSize: 13, marginTop: 3 }}>Check within 30 minutes of voting</div>
        </div>
        <ChevronRight size={20} color={G.green} />
      </div>
    </Scroll>
    <FooterBar note="Changing your mind? Change my vote requires full re-verification">
      <Btn onClick={() => go("voted")}>Done</Btn>
    </FooterBar>
  </Phone>
);

/* 16 — You voted badge */
const Voted = ({ go }) => (
  <Phone>
    <Scroll>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 36, textAlign: "center", margin: "40px 0 28px", color: G.ink, letterSpacing: -1 }}>You voted.</h1>

      <div style={{ border: `2px solid ${G.green}`, borderRadius: 22, padding: 24, textAlign: "center", background: G.card }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: G.green, color: "#fff", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
          <BadgeCheck size={14} /> BOOTH
        </span>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, marginTop: 18, color: G.ink }}>Arjun Mehta</div>
        <div style={{ color: G.green, fontWeight: 700, fontSize: 16, marginTop: 6 }}>Karol Bagh, New Delhi</div>
        <div style={{ color: G.sub, fontSize: 14, marginTop: 4 }}>Lok Sabha General Election 2024</div>
        <div style={{ borderTop: `1px solid ${G.line}`, margin: "18px 0", paddingTop: 16, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {["VERIFIED", "26 APR 2024", "EPIC LINKED"].map((t) => (
            <span key={t} style={{ border: `1px solid ${G.line}`, borderRadius: 20, padding: "6px 12px", fontSize: 11.5, fontWeight: 600, color: G.ink }}>{t}</span>
          ))}
        </div>
        <div style={{ color: G.sub, fontSize: 12.5 }}>Reference: BOOTH-2024-KBN-48271</div>
      </div>

      <p style={{ textAlign: "center", color: G.sub, fontSize: 14, lineHeight: 1.5, margin: "22px 6px" }}>
        This badge is tied to your voter ID and cannot be replicated. It is your permanent record of participation.
      </p>

      <Btn onClick={() => go("share")} style={{ borderRadius: 28, letterSpacing: 0.5, fontWeight: 700 }} icon={<Share2 size={17} />}>SHARE YOUR BADGE</Btn>
      <div style={{ height: 12 }} />
      <Btn variant="outline" onClick={() => go("electionday")} style={{ borderRadius: 28, letterSpacing: 0.5, fontWeight: 700 }}>VIEW MY CIVIC PROFILE</Btn>
    </Scroll>
  </Phone>
);

/* 17 — Share */
const Share = ({ go }) => {
  const [tab, setTab] = useState("Instagram Story");
  return (
    <Phone>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: G.greenSofter }}>
        <ArrowLeft size={22} color={G.greenDark} style={{ cursor: "pointer" }} onClick={() => go("voted")} />
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18, color: G.greenDark }}>Share your vote</span>
      </div>
      <Scroll>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {["Instagram Story", "WhatsApp", "LinkedIn"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              border: `1.5px solid ${tab === t ? G.green : G.line}`, background: tab === t ? G.green : "#fff",
              color: tab === t ? "#fff" : G.ink, borderRadius: 22, padding: "9px 16px", fontFamily: FONT_BODY, fontWeight: 600, fontSize: 13.5, cursor: "pointer",
            }}>{t}</button>
          ))}
        </div>

        <div style={{ background: G.green, borderRadius: 20, padding: 24, marginTop: 18, color: "#fff", minHeight: 420, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, border: "2.5px solid #fff" }} />
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: 1, fontSize: 14 }}>BOOTH</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 56, letterSpacing: -2 }}>I voted.</div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8 }}>Karol Bagh, New Delhi</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.3)", margin: "18px 0", paddingTop: 16, display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: 0.5 }}>TURNOUT SO FAR</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 26 }}>67.3%</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, opacity: 0.8, letterSpacing: 0.5 }}>MY WARD</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 22 }}>Karol Bagh</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, opacity: 0.85, marginTop: 8 }}>
            <span>Lok Sabha 2024</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>Verified by Booth <BadgeCheck size={13} /></span>
          </div>
        </div>

        <p style={{ textAlign: "center", color: G.sub, fontSize: 13, margin: "16px 10px" }}>
          Your vote choice is never shown. Only your participation is shared.
        </p>
        <Btn icon={<Share2 size={17} />} style={{ borderRadius: 28, letterSpacing: 0.5, fontWeight: 700 }}>SHARE TO INSTAGRAM STORY</Btn>
        <div style={{ textAlign: "center", color: G.green, fontWeight: 700, fontSize: 14, marginTop: 16, cursor: "pointer" }}>Save to camera roll</div>
      </Scroll>
      <TabBar active="home" go={go} />
    </Phone>
  );
};

/* extra screens 18/19: dark-themed "ready" + complete secure */
const ReadyToCast = ({ go }) => (
  <Phone>
    <div style={{ flex: 1, background: G.green, display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 28px 0", color: "#fff" }}>
      <Avatar src={AV.vikram} size={96} ring="#fff" />
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, marginTop: 18 }}>Dr. Vikram Sethi</div>
      <div style={{ fontSize: 17, opacity: 0.92, marginTop: 6 }}>Bharatiya Janata Party</div>
      <div style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>Karol Bagh, New Delhi</div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 30 }}>Ready to cast Vote</div>
      <div style={{ fontSize: 15, opacity: 0.78, marginTop: 8, textAlign: "center" }}>This action is final and cannot be undone.</div>
      <div style={{ height: 40 }} />
    </div>
    <div style={{ background: G.green, padding: "0 22px 18px" }}>
      <Btn variant="dark" onClick={() => go("recorded")}>Confirm Vote</Btn>
      <div style={{ textAlign: "center", color: "rgba(255,255,255,.7)", fontSize: 13, marginTop: 14, cursor: "pointer" }} onClick={() => go("ballot")}>Changed your mind? Go back.</div>
    </div>
  </Phone>
);

/* 19 — Election Day "ready to vote" home (light variant) */
const ReadyHome = ({ go }) => (
  <Phone>
    <TopBar onBack={() => go("electionday")} title="Election Day" right={<Landmark size={20} color={G.green} />} />
    <Scroll>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, color: G.green, fontWeight: 600, fontSize: 14 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: G.green }} />Tomorrow · 26 April 2024
      </div>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 42, lineHeight: 1.02, margin: "10px 0 0", color: G.ink, letterSpacing: -1.5 }}>
        You're ready to vote<span style={{ color: G.green }}>.</span>
      </h1>

      {/* Your booth */}
      <div onClick={() => go("booth")} style={{ background: G.green, borderRadius: 18, padding: 18, marginTop: 22, color: "#fff", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
          <div>
            <div style={{ fontSize: 11.5, letterSpacing: 0.6, opacity: 0.85, fontWeight: 700 }}>YOUR BOOTH</div>
            <div style={{ fontWeight: 700, fontSize: 19, marginTop: 8, lineHeight: 1.2 }}>Government Primary School, Block 7</div>
            <div style={{ opacity: 0.85, fontSize: 13.5, marginTop: 8 }}>1.2 km · 14 min walk</div>
          </div>
          <div style={{ width: 76, height: 76, borderRadius: 14, background: "linear-gradient(135deg,#cfe3d6,#a9d3ba)", display: "grid", placeItems: "center", flexShrink: 0, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(45deg,rgba(255,255,255,.25) 0 2px,transparent 2px 10px)" }} />
            <MapPin size={26} color={G.greenDeep} fill={G.greenDeep} style={{ position: "relative" }} />
          </div>
        </div>
      </div>

      {/* Top match */}
      <div style={{ background: G.card, border: `1px solid ${G.line}`, borderRadius: 16, padding: 18, marginTop: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: G.sub, fontWeight: 700, fontSize: 11.5, letterSpacing: 0.5 }}>YOUR TOP MATCH</span>
          <span style={{ background: G.greenSoft, color: G.greenDark, fontWeight: 700, fontSize: 12.5, padding: "5px 11px", borderRadius: 20 }}>94% Match</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
          <Avatar src={AV.ajay} size={42} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: G.ink }}>Arjun Malhotra</div>
            <div style={{ color: G.sub, fontSize: 13 }}>Progressive Civic Party</div>
          </div>
        </div>
        <p style={{ color: G.ink, fontSize: 14.5, lineHeight: 1.45, margin: "12px 0 0" }}>Based on your priorities in education and healthcare.</p>
      </div>

      {/* What to expect */}
      <div style={{ background: G.card, border: `1px solid ${G.line}`, borderRadius: 16, padding: 18, marginTop: 14 }}>
        <div style={{ color: G.greenDark, fontWeight: 700, fontSize: 12.5, letterSpacing: 0.5 }}>WHAT TO EXPECT</div>
        {[[Clock, "Polling runs 8:00 AM to 5:00 PM."], [CreditCard, "Show your EPIC card at entry."], [BadgeCheck, "Press the button next to your candidate's name."]].map(([I, t], i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginTop: 14 }}>
            <I size={18} color={G.green} style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ color: G.ink, fontSize: 14.5, lineHeight: 1.4 }}>{t}</span>
          </div>
        ))}
      </div>

      <p style={{ color: G.sub, fontSize: 14.5, margin: "20px 4px 0" }}>Over 142 people in your ward are voting tomorrow.</p>

      <div style={{ marginTop: 18 }}>
        <Btn onClick={() => go("booth")} style={{ borderRadius: 28, letterSpacing: 0.5, fontWeight: 700 }}>GET DIRECTIONS TO BOOTH</Btn>
      </div>
      <div style={{ textAlign: "center", color: G.green, fontWeight: 700, fontSize: 14.5, marginTop: 16, cursor: "pointer" }} onClick={() => go("ai")}>Ask Booth AI a question.</div>
    </Scroll>
    <TabBar active="home" go={go} />
  </Phone>
);

/* 20 — Karol Bagh Votes (live community / turnout) */
const Live = ({ go }) => (
  <Phone>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", background: G.card, borderBottom: `1px solid ${G.line}`, position: "sticky", top: 0, zIndex: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <RadioIcon size={18} color={G.green} />
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, color: G.green, fontSize: 18 }}>Booth</span>
        <span style={{ color: G.ink, fontWeight: 700, fontSize: 15, marginLeft: 4 }}>Karol Bagh Votes</span>
      </div>
      <span style={{ display: "flex", alignItems: "center", gap: 6, background: G.greenSoft, color: G.greenDark, borderRadius: 20, padding: "5px 11px", fontSize: 11.5, fontWeight: 700 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: G.green }} />LIVE
      </span>
    </div>
    <Scroll>
      {/* turnout card */}
      <div style={{ background: G.green, borderRadius: 20, padding: 22, marginTop: 16, color: "#fff" }}>
        <div style={{ fontSize: 11.5, letterSpacing: 0.6, opacity: 0.85, fontWeight: 700 }}>YOUR WARD TURNOUT</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 56, lineHeight: 1, marginTop: 6, letterSpacing: -2 }}>67.3%</div>
        <div style={{ height: 8, borderRadius: 6, background: "rgba(255,255,255,.25)", overflow: "hidden", marginTop: 14 }}>
          <div style={{ height: "100%", width: "67.3%", background: "#fff", borderRadius: 6 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 13, opacity: 0.9 }}>
          <span>City avg: 58.1%</span><span>National avg: 61.2%</span>
        </div>
      </div>

      {/* you voted */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: G.greenSofter, border: `1.5px solid ${G.green}`, borderRadius: 16, padding: 16, marginTop: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: G.greenDeep, display: "grid", placeItems: "center" }}><Check size={18} color="#fff" strokeWidth={3} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: G.ink }}>You voted</div>
          <div style={{ color: G.sub, fontSize: 13 }}>Karol Bagh · 11:34 AM</div>
        </div>
        <BadgeCheck size={22} color={G.greenDeep} />
      </div>

      {/* community */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 20, color: G.ink }}>Your community</span>
        <span style={{ color: G.green, fontWeight: 700, fontSize: 14 }}>142 voted so far</span>
      </div>
      {[["P", "Priya", "2 min ago"], ["R", "Rahul", "15 min ago"], ["A", "Amit", "42 min ago"]].map(([i, n, t]) => (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, background: G.card, border: `1px solid ${G.line}`, borderRadius: 16, padding: 16, marginTop: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: G.greenSoft, display: "grid", placeItems: "center", color: G.greenDark, fontWeight: 700, fontSize: 15 }}>{i}</div>
          <div style={{ flex: 1, fontSize: 15, color: G.ink }}><b style={{ fontWeight: 700 }}>{n}</b> voted in Karol Bagh</div>
          <span style={{ color: G.sub, fontSize: 12.5 }}>{t}</span>
        </div>
      ))}
      <p style={{ textAlign: "center", color: G.sub, fontSize: 13.5, margin: "18px 0 0" }}>142 people in your community have voted today.</p>

      {/* hero banner */}
      <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", marginTop: 18, minHeight: 160 }}>
        <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=320&fit=crop" alt="" style={{ width: "100%", height: 170, objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(15,78,48,.1),rgba(15,78,48,.85))" }} />
        <div style={{ position: "absolute", bottom: 16, left: 18, right: 18, color: "#fff" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 22 }}>Power of one. Strength of many.</div>
          <div style={{ fontSize: 13.5, opacity: 0.9, marginTop: 4 }}>Every vote shapes our collective future.</div>
        </div>
      </div>
    </Scroll>
    <TabBar active="community" go={go} />
  </Phone>
);

/* 21 — Booth AI chat */
const BoothAI = ({ go }) => {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Hello Arjun. Election day in Karol Bagh is on 26 April. Your booth is 1.2 km away. What would you like to know?" },
    { role: "me", text: "Who should I vote for?" },
    { role: "ai", text: "I can't tell you who to vote for — that's your decision. But based on your priorities in education and healthcare, here's how the candidates compare.", compare: true },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = (text) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "me", text: t }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { role: "ai", text: "Good question. Your booth is Government Primary School, Block 7 — open 8 AM to 5 PM on 26 April. Bring your EPIC card." }]), 600);
  };
  const chips = ["Where is my booth?", "What is Lok Sabha?", "When do polls open?"];

  return (
    <Phone>
      <TopBar onBack={() => go("readyhome")} title="Booth AI" right={<Sparkles size={20} color={G.green} />} />
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px" }}>
        <p style={{ textAlign: "center", color: G.sub, fontSize: 13.5, lineHeight: 1.4, margin: "16px 24px" }}>
          Ask anything about voting, candidates, or your constituency.
        </p>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "me" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            <div style={{ maxWidth: "82%" }}>
              <div style={{
                background: m.role === "me" ? G.greenDeep : G.card,
                color: m.role === "me" ? "#fff" : G.ink,
                border: m.role === "me" ? "none" : `1px solid ${G.line}`,
                borderRadius: 16, padding: "13px 16px", fontSize: 15, lineHeight: 1.45,
                borderBottomRightRadius: m.role === "me" ? 4 : 16,
                borderBottomLeftRadius: m.role === "ai" ? 4 : 16,
              }}>{m.text}</div>
              {m.compare && (
                <div style={{ background: G.card, border: `1px solid ${G.line}`, borderRadius: 16, padding: 14, marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <Avatar src={AV.anjali} size={36} />
                    <div style={{ fontWeight: 700, fontSize: 13, color: G.ink, marginTop: 6 }}>Anjali Sharma</div>
                    <div style={{ background: G.greenSoft, color: G.greenDark, fontWeight: 700, fontSize: 11.5, padding: "4px 8px", borderRadius: 8, marginTop: 6 }}>94% MATCH</div>
                  </div>
                  <div style={{ color: G.sub, fontSize: 12, fontWeight: 700 }}>VS</div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <Avatar src={AV.vikram} size={36} />
                    <div style={{ fontWeight: 700, fontSize: 13, color: G.ink, marginTop: 6 }}>Dr. Vikram S…</div>
                    <div style={{ background: "#eef1ee", color: G.sub, fontWeight: 700, fontSize: 11.5, padding: "4px 8px", borderRadius: 8, marginTop: 6 }}>71% MATCH</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "8px 14px 16px", background: G.bg }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 10 }}>
          {chips.map((c) => (
            <button key={c} onClick={() => send(c)} style={{ whiteSpace: "nowrap", background: G.card, border: `1px solid ${G.line}`, color: G.green, fontWeight: 600, fontSize: 13, padding: "8px 14px", borderRadius: 20, cursor: "pointer" }}>{c}</button>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, background: G.card, border: `1px solid ${G.line}`, borderRadius: 14, padding: "4px 12px", fontSize: 13, color: G.sub }}>EN <ChevronDown size={13} /></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: G.card, border: `1px solid ${G.line}`, borderRadius: 26, padding: "6px 6px 6px 18px" }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything about voting…"
            style={{ flex: 1, border: "none", outline: "none", fontFamily: FONT_BODY, fontSize: 15, background: "transparent", color: G.ink }} />
          <button onClick={() => send()} style={{ width: 40, height: 40, borderRadius: "50%", background: G.green, border: "none", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
            <ArrowRight size={18} color="#fff" />
          </button>
        </div>
      </div>
    </Phone>
  );
};

/* 22 — Your booth (map + directions) */
const BoothMap = ({ go }) => (
  <Phone>
    <TopBar onBack={() => go("readyhome")} title="Your booth" right={<Share2 size={20} color={G.green} />} />
    <Scroll pad="0">
      {/* faux map */}
      <div style={{ position: "relative", height: 340, background: "#dfe6e0", overflow: "hidden" }}>
        <svg width="100%" height="340" style={{ position: "absolute", inset: 0 }}>
          {/* roads */}
          {[60, 130, 210, 290].map((y) => <line key={y} x1="-20" y1={y} x2="413" y2={y + 40} stroke="#fff" strokeWidth="14" />)}
          {[80, 180, 300].map((x) => <line key={x} x1={x} y1="-20" x2={x - 30} y2="360" stroke="#fff" strokeWidth="11" />)}
          {/* building blocks */}
          <rect x="150" y="120" width="120" height="80" rx="6" fill="#eef1ee" transform="rotate(-8 210 160)" />
          <rect x="60" y="200" width="70" height="50" rx="5" fill="#eef1ee" />
          {/* route */}
          <path d="M120,180 C160,210 210,250 250,300" fill="none" stroke={G.greenDeep} strokeWidth="3.5" strokeDasharray="3 8" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: 110, top: 168, width: 18, height: 18, borderRadius: "50%", background: "#3b82f6", border: "3px solid #fff", boxShadow: "0 2px 6px rgba(0,0,0,.3)" }} />
        <div style={{ position: "absolute", left: 232, top: 270, width: 40, height: 40, borderRadius: "50% 50% 50% 0", background: G.greenDeep, transform: "rotate(-45deg)", display: "grid", placeItems: "center", boxShadow: "0 4px 10px rgba(0,0,0,.25)" }}>
          <Landmark size={18} color="#fff" style={{ transform: "rotate(45deg)" }} />
        </div>
      </div>

      <div style={{ background: G.card, borderTopLeftRadius: 26, borderTopRightRadius: 26, marginTop: -22, padding: "22px 20px", position: "relative" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <Building2 size={22} color={G.green} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 20, color: G.ink, lineHeight: 1.2 }}>Government Primary School, Block 7</div>
            <div style={{ color: G.sub, fontSize: 14, marginTop: 8, lineHeight: 1.45 }}>12th Main Road, Sector 4, HSR Layout, Bengaluru, Karnataka 560102</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {[[Footprints, "1.2 km away"], [Clock, "14 min walk"], [BadgeCheck, "Open until 5:00 PM"]].map(([I, t], i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: G.greenSofter, color: G.greenDark, borderRadius: 20, padding: "7px 12px", fontSize: 13, fontWeight: 600 }}>
              <I size={14} />{t}
            </span>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${G.line}`, margin: "20px 0", paddingTop: 18 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 16, color: G.ink, letterSpacing: 0.3 }}>WHAT TO CARRY</div>
          {[["Voter ID card", "Your EPIC card issued by ECI."], ["This app", "For booth reference and post-vote flow."]].map(([t, d]) => (
            <div key={t} style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: G.green, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1 }}><Check size={13} color="#fff" strokeWidth={3} /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: G.ink }}>{t}</div>
                <div style={{ color: G.sub, fontSize: 13.5, marginTop: 2 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>

        <Btn onClick={() => go("live")} style={{ borderRadius: 28, letterSpacing: 0.5, fontWeight: 700 }}>GET DIRECTIONS</Btn>
        <div style={{ textAlign: "center", color: G.green, fontWeight: 700, fontSize: 14.5, marginTop: 16, cursor: "pointer" }}>Share booth location with someone</div>
      </div>
    </Scroll>
    <TabBar active="home" go={go} />
  </Phone>
);

/* ════════════════════════════════════════════════════════════════════════
   ROUTER + SCREEN PICKER
═══════════════════════════════════════════════════════════════════════════ */
const SCREENS = [
  { id: "welcome", label: "1 · Welcome", C: Welcome },
  { id: "epic", label: "2 · Voter ID", C: Epic },
  { id: "aadhaar", label: "3 · Aadhaar", C: Aadhaar },
  { id: "otp", label: "4 · OTP Verify", C: Otp },
  { id: "issues", label: "5 · Issues", C: Issues },
  { id: "ranked", label: "6 · Ranked", C: Ranked },
  { id: "candidate", label: "7 · Candidate", C: Candidate },
  { id: "compare", label: "8 · Compare", C: Compare },
  { id: "electionday", label: "9 · Election Day", C: ElectionDay },
  { id: "constituency", label: "10 · Vote Remotely", C: Constituency },
  { id: "secure1", label: "11 · Secure Session", C: Secure },
  { id: "finalcheck", label: "12 · Final Check", C: FinalCheck },
  { id: "ballot", label: "13 · Ballot", C: Ballot },
  { id: "countdown", label: "14 · Countdown", C: Countdown },
  { id: "ready", label: "15 · Ready to Cast", C: ReadyToCast },
  { id: "recorded", label: "16 · Recorded", C: Recorded },
  { id: "voted", label: "17 · Badge", C: Voted },
  { id: "share", label: "18 · Share", C: Share },
  { id: "readyhome", label: "19 · Ready Home", C: ReadyHome },
  { id: "live", label: "20 · Karol Bagh Votes", C: Live },
  { id: "ai", label: "21 · Booth AI", C: BoothAI },
  { id: "booth", label: "22 · Your Booth", C: BoothMap },
];

export default function App() {
  useFonts();
  const [screen, setScreen] = useState("welcome");
  const [showNav, setShowNav] = useState(false);          // hidden by default
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 560 : false
  );
  const go = useCallback((id) => { setScreen(id); }, []);
  const Current = SCREENS.find((s) => s.id === screen)?.C || Welcome;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 560);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── MOBILE: fill the whole viewport, behave like a native app ── */
  if (isMobile) {
    return (
      <div style={{ fontFamily: FONT_BODY, position: "fixed", inset: 0, background: G.bg, overflow: "hidden" }}>
        <style>{`${fadeUp} @keyframes spin{to{transform:rotate(360deg)}} *::-webkit-scrollbar{width:0} html,body,#root{height:100%;margin:0}`}</style>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          <Current go={go} />
        </div>

        {/* tiny dev jump-menu, off by default */}
        {showNav && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 50 }} onClick={() => setShowNav(false)}>
            <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 200, background: "#fff", padding: "16px 10px", overflowY: "auto" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 16, color: G.green, padding: "4px 8px 12px" }}>Screens</div>
              {SCREENS.map((s) => (
                <div key={s.id} onClick={() => { go(s.id); setShowNav(false); }} style={{
                  padding: "10px 10px", borderRadius: 9, fontSize: 13, cursor: "pointer",
                  background: screen === s.id ? G.greenSoft : "transparent",
                  color: screen === s.id ? G.greenDark : G.sub, fontWeight: screen === s.id ? 700 : 500,
                }}>{s.label}</div>
              ))}
            </div>
          </div>
        )}
        {/* tap target in the very corner — invisible unless you know it's there */}
        <div onClick={() => setShowNav(true)} style={{ position: "absolute", top: 0, right: 0, width: 36, height: 36, zIndex: 40 }} />
      </div>
    );
  }

  /* ── DESKTOP: centered phone frame, optional screen list ── */
  return (
    <div style={{ fontFamily: FONT_BODY, minHeight: "100vh", background: "#eef1ee", display: "flex", justifyContent: "center" }}>
      <style>{`${fadeUp} @keyframes spin{to{transform:rotate(360deg)}} *::-webkit-scrollbar{width:0} html,body,#root{margin:0}`}</style>

      <div style={{ display: "flex", gap: 0, width: "100%", maxWidth: showNav ? 700 : 460 }}>
        {showNav && (
          <div style={{ width: 168, background: "#fff", borderRight: `1px solid ${G.line}`, padding: "16px 10px", overflowY: "auto", maxHeight: "100vh" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 16, color: G.green, padding: "4px 8px 12px" }}>Booth · screens</div>
            {SCREENS.map((s) => (
              <div key={s.id} onClick={() => go(s.id)} style={{
                padding: "9px 10px", borderRadius: 9, fontSize: 12.5, cursor: "pointer", marginBottom: 2,
                background: screen === s.id ? G.greenSoft : "transparent",
                color: screen === s.id ? G.greenDark : G.sub, fontWeight: screen === s.id ? 700 : 500,
              }}>{s.label}</div>
            ))}
            <div onClick={() => setShowNav(false)} style={{ marginTop: 10, padding: "9px 10px", fontSize: 11.5, color: "#aab5af", cursor: "pointer" }}>‹ hide menu</div>
          </div>
        )}

        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "20px 16px" }}>
          <div style={{ position: "relative" }}>
            {!showNav && (
              <div onClick={() => setShowNav(true)} style={{ position: "absolute", left: -2, top: -14, fontSize: 12, color: "#c2ccc6", fontWeight: 600, cursor: "pointer" }}>☰ screens</div>
            )}
            <div style={{
              width: 393, height: 800, borderRadius: 44, overflow: "hidden", background: "#000",
              border: "10px solid #1a1a1a", boxShadow: "0 30px 70px rgba(0,0,0,.28)", position: "relative",
            }}>
              <Current go={go} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
