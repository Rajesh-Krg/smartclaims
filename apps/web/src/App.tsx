import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDownLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Menu,
  RefreshCw,
  ShieldCheck,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { type Claim, type Principal, label, request } from "./api";
import { ClaimQueue } from "./ClaimQueue";
import { ClaimDetail } from "./ClaimDetail";
import { Fnol } from "./Fnol";
const sections = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Claims", icon: ClipboardList },
  { name: "Providers", icon: Wrench },
  { name: "Parts & dealers", icon: Truck },
  { name: "AI workforce", icon: Bot },
  { name: "Audit", icon: ShieldCheck },
];
export function App() {
  const activeToken = useRef("");
  const [token, setToken] = useState(""),
    [input, setInput] = useState(""),
    [identity, setIdentity] = useState<Principal | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(false),
    [claims, setClaims] = useState<Claim[]>([]),
    [section, setSection] = useState("Overview"),
    [selected, setSelected] = useState<Claim | null>(null),
    [fnol, setFnol] = useState(false),
    [notice, setNotice] = useState(""),
    [menu, setMenu] = useState(false);
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await request<Principal>(input, "/me");
      activeToken.current = input;
      setIdentity(user);
      setToken(input);
      setInput("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await request<Claim[]>(token, "/claims");
      if (activeToken.current === token) setClaims(data);
    } catch (e) {
      if (activeToken.current === token) setError((e as Error).message);
    } finally {
      if (activeToken.current === token) setLoading(false);
    }
  }
  useEffect(() => {
    if (token) void refresh();
  }, [token]);
  function navigate(name: string) {
    setSection(name);
    setSelected(null);
    setFnol(false);
    setMenu(false);
    setError("");
    setNotice("");
  }
  function update(claim: Claim) {
    if (activeToken.current !== token) return;
    setSelected(claim);
    setClaims((previous) => [
      claim,
      ...previous.filter((c) => c.id !== claim.id),
    ]);
  }
  function logout() {
    activeToken.current = "";
    setLoading(false);
    setToken("");
    setIdentity(null);
    setClaims([]);
    setSelected(null);
    setFnol(false);
    setNotice("");
    setError("");
  }
  if (!identity)
    return (
      <div className="login-page">
        <div className="login-story">
          <div className="brand">
            <span className="brand-icon">
              <Activity />
            </span>
            SmartClaims<span className="brand-dot">.</span>
          </div>
          <div>
            <span className="eyebrow">CONNECTED CLAIMS OPERATIONS</span>
            <h1>
              A clearer path.
              <br />
              From loss
              <br />
              to resolution.
            </h1>
            <p>One workspace for the people moving every claim forward.</p>
            <div className="story-line">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <small>Enterprise foundation · Synthetic development workspace</small>
        </div>
        <main className="login-main">
          <form className="login-card" onSubmit={login}>
            <div className="icon-box">
              <ShieldCheck size={26} />
            </div>
            <div className="eyebrow">YOUR OPERATIONS WORKSPACE</div>
            <h1>Welcome to SmartClaims</h1>
            <p>
              Enter your configured development session token to access
              fictional claims.
            </p>
            {error && (
              <div role="alert" className="error">
                {error}
              </div>
            )}
            <label>
              Synthetic session token
              <input
                autoFocus
                type="password"
                required
                autoComplete="off"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </label>
            <button className="primary" disabled={busy}>
              {busy ? "Opening…" : "Open workspace"}
              <ArrowRight size={17} />
            </button>
            <div className="login-note">
              <ShieldCheck size={16} />
              <span>
                Tenant and role are resolved by the server.
                <br />
                Your token stays in memory for this session.
              </span>
            </div>
            <p className="small-text">
              Run scripts/configure_demo.py for private synthetic credentials.
              OIDC sign-in is planned for Milestone 2.
            </p>
          </form>
        </main>
      </div>
    );
  const submitted = claims.filter((c) => c.status === "SUBMITTED").length;
  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className={menu ? "sidebar mobile-open" : "sidebar"}>
        <div className="brand">
          <span className="brand-icon">
            <Activity size={22} />
          </span>
          SmartClaims<span className="brand-dot">.</span>
        </div>
        <div className="workspace">
          <span className="workspace-mark">S</span>
          <div>
            <strong>Synthetic Insurance</strong>
            <small>{identity.tenant} workspace</small>
          </div>
          <ShieldCheck size={15} />
        </div>
        <div className="nav-caption">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {sections.map((s) => (
            <button
              key={s.name}
              className={section === s.name && !fnol ? "nav active" : "nav"}
              onClick={() => navigate(s.name)}
            >
              <s.icon size={18} />
              <span>{s.name}</span>
              {s.name === "Claims" && (
                <span className="nav-count">{claims.length}</span>
              )}
              {s.name === "AI workforce" && <span className="soon">LATER</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="guardrail">
            <ShieldCheck size={19} />
            <strong>People stay in control</strong>
            <p>Human review at every consequential decision.</p>
          </div>
          <div className="development">
            <i /> Development environment
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu icon-button"
              aria-label="Toggle navigation"
              onClick={() => setMenu(!menu)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>
              {fnol ? "New claim" : selected ? "Claim 360" : section}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="synthetic">● Synthetic data</span>
            <span className="top-divider" />
            <span className="avatar">
              {identity.subject.slice(0, 2).toUpperCase()}
            </span>
            <div className="user-label">
              <strong>{identity.subject}</strong>
              <small>{label(identity.role)}</small>
            </div>
            <button
              className="icon-button"
              aria-label="Sign out"
              title="Sign out"
              onClick={logout}
            >
              <LogOut size={17} />
            </button>
          </div>
        </header>
        <main id="main" className="main-content">
          {notice && (
            <div className="success" role="status">
              <CheckCircle2 size={19} />
              <span>{notice}</span>
              <button
                className="icon-button"
                aria-label="Dismiss confirmation"
                onClick={() => setNotice("")}
              >
                <X size={16} />
              </button>
            </div>
          )}
          {error && (
            <div className="error" role="alert">
              {error}
              <button onClick={() => void refresh()}>Retry</button>
            </div>
          )}
          {fnol ? (
            <Fnol
              token={token}
              onCancel={() => setFnol(false)}
              onCreated={(c) => {
                if (activeToken.current !== token) return;
                update(c);
                setFnol(false);
                setSection("Claims");
                setNotice(`Claim submitted successfully. Reference: ${c.id}`);
              }}
            />
          ) : selected ? (
            <ClaimDetail
              claim={selected}
              token={token}
              identity={identity}
              onBack={() => setSelected(null)}
              onUpdate={update}
            />
          ) : (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">CLAIMS OPERATIONS</div>
                  <h1>
                    {section === "Overview"
                      ? "Claims command center"
                      : section === "Claims"
                        ? "Your claims workspace"
                        : section}
                  </h1>
                  <p>
                    {section === "Overview"
                      ? "A complete view of your claims. A clear view of what’s next."
                      : "Connected information, with people in control."}
                  </p>
                </div>
                <div className="heading-actions">
                  <button
                    className="secondary"
                    onClick={() => void refresh()}
                    disabled={loading}
                  >
                    <RefreshCw size={15} className={loading ? "spin" : ""} />{" "}
                    Refresh
                  </button>
                  {identity.role !== "auditor" && (
                    <button
                      className="primary"
                      onClick={() => {
                        setFnol(true);
                        setNotice("");
                      }}
                    >
                      <FilePlus2 size={16} /> New claim
                    </button>
                  )}
                </div>
              </div>
              {loading ? (
                <section className="panel loading" role="status">
                  <RefreshCw className="spin" />
                  Loading your claims workspace…
                </section>
              ) : (
                <>
                  {section === "Overview" && (
                    <>
                      <div className="metrics">
                        {[
                          {
                            title: "Total claims",
                            value: claims.length,
                            icon: ClipboardList,
                            detail: `${claims.filter((c) => c.status !== "CLOSED").length} open across the lifecycle`,
                            tone: "blue",
                          },
                          {
                            title: "Awaiting triage",
                            value: submitted,
                            icon: ArrowDownLeft,
                            detail: "Submitted · ready for review",
                            tone: "amber",
                          },
                          {
                            title: "Repair in progress",
                            value: claims.filter(
                              (c) => c.status === "REPAIR_IN_PROGRESS",
                            ).length,
                            icon: Wrench,
                            detail: "Synthetic lifecycle records",
                            tone: "purple",
                          },
                          {
                            title: "Pending authorization",
                            value: claims.filter(
                              (c) => c.status === "AUTHORIZATION_PENDING",
                            ).length,
                            icon: ShieldCheck,
                            detail: "Human approval required",
                            tone: "green",
                          },
                        ].map((m) => (
                          <section className="panel metric" key={m.title}>
                            <div className="metric-label">
                              {m.title}
                              <span className={"metric-icon " + m.tone}>
                                <m.icon size={18} />
                              </span>
                            </div>
                            <strong>{m.value}</strong>
                            <small>{m.detail}</small>
                          </section>
                        ))}
                      </div>
                      <div className="overview-grid">
                        <section className="panel lifecycle">
                          <div className="panel-title">
                            <div>
                              <h2>Claims at a glance</h2>
                              <p>Your current lifecycle distribution</p>
                            </div>
                            <span className="subtle-badge">Live data</span>
                          </div>
                          <div className="stage-bars">
                            {[
                              {
                                status: "SUBMITTED",
                                name: "Submitted",
                                color: "blue",
                              },
                              {
                                status: "TRIAGE",
                                name: "Triage",
                                color: "cyan",
                              },
                              {
                                status: "ASSESSMENT",
                                name: "Assessment",
                                color: "purple",
                              },
                              {
                                status: "REPAIR_PLANNING",
                                name: "Repair planning",
                                color: "amber",
                              },
                              {
                                status: "AUTHORIZATION_PENDING",
                                name: "Authorization",
                                color: "green",
                              },
                            ].map((s) => {
                              const n = claims.filter(
                                (c) => c.status === s.status,
                              ).length;
                              return (
                                <div className="stage-row" key={s.status}>
                                  <span>{s.name}</span>
                                  <div>
                                    <i
                                      className={s.color}
                                      style={{
                                        width: `${claims.length ? (n / claims.length) * 100 : 0}%`,
                                      }}
                                    />
                                  </div>
                                  <strong>{n}</strong>
                                </div>
                              );
                            })}
                          </div>
                        </section>
                        <section className="action-panel">
                          <div className="action-top">
                            <span className="action-icon">
                              <Activity size={20} />
                            </span>
                            <span>FOCUS FOR TODAY</span>
                          </div>
                          <h2>
                            {submitted
                              ? "Ready for a first look."
                              : "Keep claims moving."}
                          </h2>
                          <p>
                            {submitted
                              ? `${submitted} submitted claim${submitted === 1 ? " is" : "s are"} waiting for triage. Review the details and document the next step.`
                              : "Create a synthetic FNOL to exercise the complete intake workflow."}
                          </p>
                          <button onClick={() => navigate("Claims")}>
                            Open claims queue <ArrowRight size={17} />
                          </button>
                          <div className="action-foot">
                            <ShieldCheck size={14} /> Human-led. Auditable.
                            Connected.
                          </div>
                        </section>
                      </div>
                    </>
                  )}
                  {(section === "Overview" || section === "Claims") && (
                    <ClaimQueue claims={claims} onOpen={setSelected} />
                  )}
                  {section === "Audit" && (
                    <section className="panel unavailable-page">
                      <ShieldCheck size={32} />
                      <h2>Follow the history of a claim</h2>
                      <p>
                        Every submission and lifecycle change records a
                        server-verified actor, timestamp, reason and version.
                        Select a claim to inspect its persistent event timeline.
                      </p>
                      <button
                        className="primary"
                        onClick={() => navigate("Claims")}
                      >
                        Browse claims <ArrowRight size={16} />
                      </button>
                      <small>
                        Tenant-wide audit export is unavailable in this
                        milestone.
                      </small>
                    </section>
                  )}
                  {["Providers", "Parts & dealers", "AI workforce"].includes(
                    section,
                  ) && (
                    <section className="panel unavailable-page">
                      <ShieldCheck size={32} />
                      <span className="subtle-badge">
                        Planned · unavailable
                      </span>
                      <h2>
                        {section === "Providers"
                          ? "Repair coordination"
                          : section === "Parts & dealers"
                            ? "Parts coordination"
                            : "An accountable AI workforce"}
                      </h2>
                      <p>
                        {section === "Providers"
                          ? "Provider assignments, estimates, scheduling and repair milestones are planned for Milestone 4."
                          : section === "Parts & dealers"
                            ? "Quotes, VIN fitment and shipment tracking are planned for Milestone 4. No live inventory or ordering is connected."
                            : "Bedrock recommendations, permissioned tools and human review gates are planned for Milestone 5. No agents are running."}
                      </p>
                      <button
                        className="secondary"
                        onClick={() => navigate("Overview")}
                      >
                        Return to overview
                      </button>
                    </section>
                  )}
                </>
              )}
            </>
          )}
          <footer className="page-footer">
            <span>
              <ShieldCheck size={14} /> SmartClaims · Synthetic development
              workspace
            </span>
            <span>Milestone 1 · All decisions remain under human control</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
