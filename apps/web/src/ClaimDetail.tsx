import React, { useEffect, useState } from "react";
import { ArrowLeft, CarFront, Clock3, ShieldCheck } from "lucide-react";
import {
  type Claim,
  type Principal,
  type StageEvent,
  label,
  request,
} from "./api";
import { Status } from "./ClaimQueue";
const next: Record<string, string> = {
  SUBMITTED: "TRIAGE",
  TRIAGE: "ASSESSMENT",
  ASSESSMENT: "REPAIR_PLANNING",
  REPAIR_PLANNING: "AUTHORIZATION_PENDING",
};
export function ClaimDetail({
  claim,
  token,
  identity,
  onBack,
  onUpdate,
}: {
  claim: Claim;
  token: string;
  identity: Principal;
  onBack: () => void;
  onUpdate: (c: Claim) => void;
}) {
  const [events, setEvents] = useState<StageEvent[]>([]),
    [error, setError] = useState(""),
    [reason, setReason] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    setEvents([]);
    request<StageEvent[]>(token, `/claims/${claim.id}/events`)
      .then((data) => {
        if (alive) setEvents(data);
      })
      .catch((e) => {
        if (alive) setError(e.message);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [claim.id, claim.version, token, retry]);
  async function refreshClaim() {
    setBusy(true);
    try {
      onUpdate(await request<Claim>(token, `/claims/${claim.id}`));
      setError("");
      setRetry((v) => v + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function advance(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const updated = await request<Claim>(
        token,
        `/claims/${claim.id}/transitions`,
        {
          method: "POST",
          body: JSON.stringify({
            target: next[claim.status],
            expected_version: claim.version,
            reason,
          }),
        },
      );
      setReason("");
      onUpdate(updated);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <button className="text-button" onClick={onBack}>
        <ArrowLeft size={16} /> Back to claims
      </button>
      <div className="page-heading">
        <div>
          <div className="eyebrow">CLAIM 360 · {claim.policy_reference}</div>
          <h1>{claim.member_name}</h1>
          <p className="claim-reference">{claim.id}</p>
        </div>
        <Status value={claim.status} />
      </div>
      {error && (
        <div className="error" role="alert">
          {error}{" "}
          <button disabled={busy} onClick={() => void refreshClaim()}>
            Refresh claim
          </button>
        </div>
      )}
      <div className="detail-layout">
        <div>
          <section className="panel detail-card">
            <h2>
              <CarFront size={20} /> Claim summary
            </h2>
            <dl className="review">
              <div>
                <dt>Vehicle</dt>
                <dd>{claim.vehicle}</dd>
              </div>
              <div>
                <dt>VIN</dt>
                <dd>{claim.vin}</dd>
              </div>
              <div>
                <dt>Incident date</dt>
                <dd>{claim.incident_date}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{claim.location}</dd>
              </div>
              <div>
                <dt>Damage description</dt>
                <dd>{claim.incident_summary}</dd>
              </div>
            </dl>
          </section>
          <section className="panel detail-card">
            <h2>
              <Clock3 size={20} /> Event timeline
            </h2>
            {loading ? (
              <p role="status">Loading event history…</p>
            ) : (
              <ol className="timeline">
                {events.map((e) => (
                  <li key={e.id}>
                    <span className="timeline-dot" />
                    <div>
                      <strong>{label(e.current)}</strong>
                      <p>{e.reason}</p>
                      <small>
                        {e.actor} · {new Date(e.occurred_at).toLocaleString()} ·
                        v{e.version}
                      </small>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
        <section className="panel detail-card next-action">
          <div className="icon-box">
            <ShieldCheck size={23} />
          </div>
          <h2>Next best action</h2>
          {identity.role === "adjuster" && next[claim.status] ? (
            <form onSubmit={advance}>
              <p>
                Complete your review before moving this claim to{" "}
                <strong>{label(next[claim.status]).toLowerCase()}</strong>.
              </p>
              <label>
                Review reason
                <textarea
                  required
                  minLength={3}
                  maxLength={1000}
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </label>
              <button className="primary" disabled={busy}>
                {busy
                  ? "Saving…"
                  : `Move to ${label(next[claim.status]).toLowerCase()}`}
              </button>
            </form>
          ) : (
            <p>
              {identity.role === "auditor"
                ? "Read-only audit access."
                : identity.role === "policyholder"
                  ? "Your claim is ready for an adjuster to review."
                  : "Human authorization workflows are unavailable in this milestone."}
            </p>
          )}
          <div className="boundary">
            Human control by design
            <br />
            <small>
              Coverage, liability and payments are never decided automatically.
            </small>
          </div>
        </section>
      </div>
    </div>
  );
}
