"use client";

import Link from "next/link";
import { useTeam } from "../lib/teamContext";

function PokeballMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10.5" fill="#ee1515" />
      <path
        d="M1.5 12 A10.5 10.5 0 0 1 22.5 12 L15.5 12 a3.5 3.5 0 0 0 -7 0 Z"
        fill="#18242b"
      />
      <circle cx="12" cy="12" r="3.5" fill="#ffffff" stroke="#18242b" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="1.4" fill="#18242b" />
    </svg>
  );
}

export function TopBar({ variant = "builder" }: { variant?: "builder" | "finalize" }) {
  const { clearTeam } = useTeam();

  if (variant === "finalize") {
    return (
      <div className="w-full flex items-center justify-between px-6 py-4 absolute top-0 left-0 right-0 z-10">
        <Link
          href="/"
          className="text-white/80 hover:text-white text-sm flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition"
        >
          <span aria-hidden>‹</span> Back to builder
        </Link>
        <span
          className="text-white/40 text-xs tracking-[0.2em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          FINALIZE
        </span>
        <a
          href="https://github.com/BagelSamurai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] transition hover:text-white/80"
          style={{
            color: "rgba(255,255,255,0.35)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Made by Rohan ↗
        </a>
      </div>
    );
  }

  return (
    <header
      className="sticky top-0 z-20 w-full bg-[var(--color-surface)]"
      style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.04)" }}
    >
      <div className="max-w-[1500px] mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <PokeballMark />
          <span
            className="font-semibold text-[var(--color-ink-1)] text-[17px] tracking-tight"
          >
            Trainer Cards
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 text-sm text-[var(--color-ink-1)] font-medium"
          >
            Builder
          </Link>
          <span className="px-3 py-1.5 text-sm text-[var(--color-ink-2)] cursor-default">
            My cards
          </span>
          <span className="px-3 py-1.5 text-sm text-[var(--color-ink-2)] cursor-default">
            Help
          </span>
          <button
            onClick={clearTeam}
            className="ml-2 px-3 py-1.5 text-sm rounded-full text-[var(--color-ink-2)] hover:bg-[var(--color-subtle)] transition"
          >
            Clear
          </button>
          <Link
            href="/finalize"
            className="ml-1 px-4 py-2 text-sm font-semibold text-white rounded-full transition hover:brightness-110"
            style={{ background: "var(--color-accent)" }}
          >
            Finalize ↗
          </Link>
          <a
            href="https://github.com/BagelSamurai"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 pl-3 text-[12px] transition"
            style={{
              color: "var(--color-ink-3)",
              borderLeft: "1px solid var(--color-hairline)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Made by Rohan ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
