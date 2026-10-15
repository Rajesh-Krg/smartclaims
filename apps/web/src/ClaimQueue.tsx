import React, { useMemo, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { type Claim, label } from "./api";
export function Status({ value }: { value: string }) {
  return (
    <span className={"status status-" + value.toLowerCase()}>
      <span />
      {label(value)}
    </span>
  );
}
export function ClaimQueue({
  claims,
  onOpen,
}: {
  claims: Claim[];
  onOpen: (claim: Claim) => void;
}) {
  const [search, setSearch] = useState(""),
    [stage, setStage] = useState(""),
    [sort, setSort] = useState("newest"),
    [page, setPage] = useState(0);
  const filtered = useMemo(
    () =>
      claims
        .filter(
          (c) =>
            (!stage || c.status === stage) &&
            `${c.id} ${c.member_name} ${c.vehicle} ${c.policy_reference}`
              .toLowerCase()
              .includes(search.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "member"
            ? a.member_name.localeCompare(b.member_name)
            : sort === "oldest"
              ? a.created_at.localeCompare(b.created_at)
              : b.created_at.localeCompare(a.created_at),
        ),
    [claims, search, stage, sort],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 8)),
    current = Math.min(page, pages - 1);
  return (
    <section className="panel queue" aria-label="Claims queue">
      <div className="panel-title">
        <div>
          <h2>
            Claims work queue <span className="count">{claims.length}</span>
          </h2>
          <p>Every claim. A clear next step.</p>
        </div>
        <span className="live">
          <i /> Connected to API
        </span>
      </div>
      <div className="table-tools">
        <label className="search">
          <Search size={17} />
          <input
            type="search"
            aria-label="Search claims"
            placeholder="Search claims, members, vehicles…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </label>
        <select
          aria-label="Lifecycle stage"
          value={stage}
          onChange={(e) => {
            setStage(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All stages</option>
          {Array.from(new Set(claims.map((c) => c.status)))
            .sort()
            .map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
        </select>
        <select
          aria-label="Sort claims"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(0);
          }}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="member">Member A–Z</option>
        </select>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Claim / policy</th>
              <th>Policyholder</th>
              <th>Vehicle</th>
              <th>Lifecycle stage</th>
              <th>Reported</th>
              <th>
                <span className="sr-only">Open</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(current * 8, current * 8 + 8).map((c) => (
              <tr key={c.id}>
                <td>
                  <button
                    className="claim-id"
                    title={c.id}
                    aria-label={`Open claim ${c.id}`}
                    onClick={() => onOpen(c)}
                  >
                    {c.id.slice(0, 11)}
                    <ArrowUpRight size={13} />
                  </button>
                  <small>{c.policy_reference}</small>
                </td>
                <td>
                  <div className="member">
                    <span className="avatar small">
                      {c.member_name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    {c.member_name}
                  </div>
                </td>
                <td>{c.vehicle}</td>
                <td>
                  <Status value={c.status} />
                </td>
                <td className="date">
                  {new Date(c.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td>
                  <ArrowUpRight size={16} className="muted" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <div className="empty">
          <Search size={26} />
          <h3>No claims match your filters.</h3>
          <p>Try another search or submit a synthetic claim.</p>
        </div>
      )}
      <footer className="pagination">
        <span>
          {filtered.length ? current * 8 + 1 : 0}–
          {Math.min((current + 1) * 8, filtered.length)} of {filtered.length}{" "}
          claims
        </span>
        <div>
          <button
            aria-label="Previous page"
            disabled={!current}
            onClick={() => setPage(current - 1)}
          >
            <ChevronLeft size={16} />
          </button>
          <span>
            Page {current + 1} of {pages}
          </span>
          <button
            aria-label="Next page"
            disabled={current >= pages - 1}
            onClick={() => setPage(current + 1)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </footer>
    </section>
  );
}
