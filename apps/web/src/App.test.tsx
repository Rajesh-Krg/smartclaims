import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { App } from "./App";
it("shows authentication failures and allows retry without retaining the token", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ detail: "Invalid synthetic token" }),
      }),
  );
  const user = userEvent.setup();
  render(<App />);
  await user.type(
    screen.getByLabelText("Synthetic session token"),
    "invalid-test-token",
  );
  await user.click(screen.getByRole("button", { name: "Open workspace" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Invalid synthetic token",
  );
  expect(screen.getByRole("button", { name: "Open workspace" })).toBeEnabled();
  vi.unstubAllGlobals();
});

it("discards pending claims from a previous authenticated session", async () => {
  let finishFirst: (value: unknown) => void = () => {};
  const pending = new Promise((resolve) => {
    finishFirst = resolve;
  });
  let claimCalls = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string, options: RequestInit) => {
      const token = (options.headers as Record<string, string>).Authorization;
      if (url.endsWith("/me"))
        return Promise.resolve({
          ok: true,
          json: async () => ({
            subject: token.includes("alpha")
              ? "alpha-adjuster"
              : "beta-adjuster",
            tenant: token.includes("alpha") ? "alpha" : "beta",
            role: "adjuster",
          }),
        });
      claimCalls++;
      return claimCalls === 1
        ? pending
        : Promise.resolve({ ok: true, json: async () => [] });
    }),
  );
  const user = userEvent.setup();
  render(<App />);
  await user.type(
    screen.getByLabelText("Synthetic session token"),
    "alpha-session-token",
  );
  await user.click(screen.getByRole("button", { name: "Open workspace" }));
  await user.click(await screen.findByRole("button", { name: "Sign out" }));
  await user.type(
    screen.getByLabelText("Synthetic session token"),
    "beta-session-token",
  );
  await user.click(screen.getByRole("button", { name: "Open workspace" }));
  await screen.findByText("beta-adjuster");
  const { act } = await import("@testing-library/react");
  await act(async () =>
    finishFirst({
      ok: true,
      json: async () => [
        {
          id: "SC-ALPHA",
          member_name: "Private Alpha Member",
          vehicle: "Synthetic",
          policy_reference: "SYN-1",
          status: "SUBMITTED",
          created_at: "2026-10-01",
          version: 1,
        },
      ],
    }),
  );
  expect(screen.queryByText("Private Alpha Member")).not.toBeInTheDocument();
  vi.unstubAllGlobals();
});
