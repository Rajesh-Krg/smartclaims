export type ClaimInput = {
  member_name: string;
  policy_reference: string;
  vehicle: string;
  vin: string;
  incident_date: string;
  location: string;
  incident_summary: string;
};
export type Claim = ClaimInput & {
  id: string;
  status: string;
  version: number;
  created_at: string;
};
export type Principal = {
  subject: string;
  tenant: string;
  role: "adjuster" | "policyholder" | "auditor";
};
export type StageEvent = {
  id: string;
  current: string;
  previous: string | null;
  actor: string;
  reason: string;
  occurred_at: string;
  version: number;
};
export const label = (status: string) =>
  status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/^./, (s) => s.toUpperCase());
export async function request<T>(
  token: string,
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch("/api/v1" + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "Service unavailable. Please try again." }));
    throw new Error(
      typeof error.detail === "string"
        ? error.detail
        : "The request could not be completed.",
    );
  }
  return response.json() as Promise<T>;
}
