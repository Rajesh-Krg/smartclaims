import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ClaimQueue } from "./ClaimQueue";
const claims = Array.from({ length: 13 }, (_, i) => ({
  id: `SC-${i}`,
  member_name: `Member ${i}`,
  vehicle: "2023 Toyota Camry",
  policy_reference: "SYN-100",
  vin: "1HGCM82633A004352",
  incident_date: "2026-10-01",
  location: "Fictional road",
  incident_summary: "Synthetic damage",
  status: i === 0 ? "TRIAGE" : "SUBMITTED",
  version: 1,
  created_at: "2026-10-01T12:00:00Z",
}));
describe("Claim queue", () => {
  it("filters by member and stage and paginates results", async () => {
    const user = userEvent.setup();
    render(<ClaimQueue claims={claims} onOpen={vi.fn()} />);
    expect(screen.getAllByRole("button", { name: /Open claim/ })).toHaveLength(
      8,
    );
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(screen.getAllByRole("button", { name: /Open claim/ })).toHaveLength(
      5,
    );
    await user.type(screen.getByRole("searchbox"), "Member 0");
    expect(screen.getAllByRole("button", { name: /Open claim/ })).toHaveLength(
      1,
    );
    await user.selectOptions(
      screen.getByLabelText("Lifecycle stage"),
      "SUBMITTED",
    );
    expect(
      screen.getByText("No claims match your filters."),
    ).toBeInTheDocument();
  });
});
