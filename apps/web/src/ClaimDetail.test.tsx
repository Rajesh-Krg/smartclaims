import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect, vi } from "vitest";
import { ClaimDetail } from "./ClaimDetail";
it("refreshes the current claim after a conflicting update", async () => {
  const claim = {
    id: "SC-123",
    member_name: "Demo",
    policy_reference: "SYN-1",
    vehicle: "Synthetic car",
    vin: "1HGCM82633A004352",
    incident_date: "2026-10-01",
    location: "Fictional road",
    incident_summary: "Demo damage",
    status: "SUBMITTED",
    version: 1,
    created_at: "2026-10-01",
  };
  const latest = { ...claim, status: "TRIAGE", version: 2 };
  const update = vi.fn();
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string, options?: RequestInit) =>
      Promise.resolve(
        options?.method === "POST"
          ? {
              ok: false,
              json: async () => ({
                detail: "Claim version conflict; refresh before retrying",
              }),
            }
          : {
              ok: true,
              json: async () => (url.endsWith("/events") ? [] : latest),
            },
      ),
    ),
  );
  const user = userEvent.setup();
  render(
    <ClaimDetail
      claim={claim}
      token="synthetic-session"
      identity={{ subject: "demo", tenant: "alpha", role: "adjuster" }}
      onBack={vi.fn()}
      onUpdate={update}
    />,
  );
  await user.type(
    screen.getByLabelText("Review reason"),
    "Reviewed synthetic details",
  );
  await user.click(screen.getByRole("button", { name: "Move to triage" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "version conflict",
  );
  await user.click(screen.getByRole("button", { name: "Refresh claim" }));
  expect(update).toHaveBeenCalledWith(latest);
  expect(screen.getByLabelText("Review reason")).toHaveValue(
    "Reviewed synthetic details",
  );
  vi.unstubAllGlobals();
});
