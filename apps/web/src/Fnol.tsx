import React, { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileCheck2, Info } from "lucide-react";
import { type Claim, type ClaimInput, request } from "./api";
const empty: ClaimInput = {
  member_name: "",
  policy_reference: "",
  vehicle: "",
  vin: "",
  incident_date: "",
  location: "",
  incident_summary: "",
};
export function Fnol({
  token,
  onCancel,
  onCreated,
}: {
  token: string;
  onCancel: () => void;
  onCreated: (c: Claim) => void;
}) {
  const [step, setStep] = useState(0),
    [form, setForm] = useState(empty),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const key = useRef(crypto.randomUUID()),
    heading = useRef<HTMLHeadingElement>(null);
  function move(value: number) {
    setStep(value);
    setError("");
    setTimeout(() => heading.current?.focus(), 0);
  }
  function field(
    name: keyof ClaimInput,
    text: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) {
    return (
      <label>
        {text}
        <input
          required
          {...props}
          value={form[name]}
          onChange={(e) => {
            setForm({
              ...form,
              [name]:
                name === "vin" ? e.target.value.toUpperCase() : e.target.value,
            });
            key.current = crypto.randomUUID();
          }}
        />
      </label>
    );
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 2) {
      move(step + 1);
      return;
    }
    setBusy(true);
    setError("");
    try {
      onCreated(
        await request<Claim>(token, "/claims", {
          method: "POST",
          headers: { "Idempotency-Key": key.current },
          body: JSON.stringify(form),
        }),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="fnol">
      <button className="text-button" onClick={onCancel}>
        <ArrowLeft size={16} /> Back to workspace
      </button>
      <div className="page-heading">
        <div>
          <div className="eyebrow">FIRST NOTICE OF LOSS</div>
          <h1>Start a new claim</h1>
          <p>A few details today. A clearer path forward.</p>
        </div>
        <span className="synthetic">Synthetic data only</span>
      </div>
      <div className="fnol-layout">
        <aside className="steps">
          {["Member & vehicle", "Incident details", "Review & submit"].map(
            (s, i) => (
              <div key={s} className={i === step ? "step current" : "step"}>
                <span>{i < step ? <Check size={16} /> : i + 1}</span>
                <div>
                  <strong>{s}</strong>
                  <small>
                    {
                      [
                        "Who and what is covered",
                        "Tell us what happened",
                        "Confirm your information",
                      ][i]
                    }
                  </small>
                </div>
              </div>
            ),
          )}
          <div className="help-note">
            <Info size={20} />
            <p>
              Development workspace
              <br />
              <small>
                Use fictional information. This submission does not notify an
                insurer or initiate a real claim.
              </small>
            </p>
          </div>
        </aside>
        <div className="panel form-panel">
          <h2 tabIndex={-1} ref={heading}>
            {
              ["Member & vehicle", "Incident details", "Review your claim"][
                step
              ]
            }
          </h2>
          <p className="muted">
            {step === 2
              ? "Confirm the fictional details below before submitting."
              : "All fields are required."}
          </p>
          {error && (
            <div role="alert" className="error">
              {error}
            </div>
          )}
          <form onSubmit={submit}>
            {step === 0 && (
              <div className="form-grid">
                {field("member_name", "Policyholder name", {
                  maxLength: 100,
                  autoFocus: true,
                })}
                {field("policy_reference", "Policy reference", {
                  maxLength: 80,
                  placeholder: "SYN-10001",
                })}
                {field("vehicle", "Vehicle", {
                  maxLength: 120,
                  placeholder: "2023 Toyota Camry",
                })}
                {field("vin", "VIN", {
                  minLength: 17,
                  maxLength: 17,
                  pattern: "[A-HJ-NPR-Z0-9]{17}",
                  title: "17 letters and digits, excluding I, O and Q",
                })}
              </div>
            )}
            {step === 1 && (
              <div className="form-grid">
                {field("incident_date", "Incident date", {
                  type: "date",
                  max: new Date().toISOString().slice(0, 10),
                })}
                {field("location", "Incident location", { maxLength: 200 })}
                <label className="full">
                  Damage description
                  <textarea
                    required
                    minLength={3}
                    maxLength={2000}
                    rows={5}
                    value={form.incident_summary}
                    onChange={(e) => {
                      setForm({ ...form, incident_summary: e.target.value });
                      key.current = crypto.randomUUID();
                    }}
                  />
                </label>
                <div className="unavailable full">
                  <FileCheck2 size={19} />
                  <span>
                    Document uploads{" "}
                    <small>
                      Available in a later milestone. No files are uploaded
                      here.
                    </small>
                  </span>
                </div>
              </div>
            )}
            {step === 2 && (
              <dl className="review">
                {Object.entries(form).map(([k, v]) => (
                  <div key={k}>
                    <dt>
                      {
                        (
                          {
                            member_name: "Policyholder",
                            policy_reference: "Policy",
                            vehicle: "Vehicle",
                            vin: "VIN",
                            incident_date: "Incident date",
                            location: "Location",
                            incident_summary: "Damage description",
                          } as Record<string, string>
                        )[k]
                      }
                    </dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="form-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => (step ? move(step - 1) : onCancel())}
                disabled={busy}
              >
                {step ? "Previous" : "Cancel"}
              </button>
              <button type="submit" className="primary" disabled={busy}>
                {busy
                  ? "Submitting…"
                  : step === 2
                    ? "Submit synthetic FNOL"
                    : "Continue"}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
