"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { toPng, toBlob } from "html-to-image";
import TrainerCard from "../components/TrainerCard";
import { useTeam } from "../lib/teamContext";

export default function Finalize() {
  const { team, cardConfig } = useTeam();
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloadState, setDownloadState] = useState<"idle" | "working" | "done">("idle");
  const [copyState, setCopyState] = useState<"idle" | "working" | "done" | "error">("idle");

  const typesCovered = new Set(team.flatMap((p) => p.types)).size;
  const safeName =
    cardConfig.name.trim().replace(/\s+/g, "-").toLowerCase() || "team-card";

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloadState("working");
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${safeName}.png`;
      link.click();
      setDownloadState("done");
      setTimeout(() => setDownloadState("idle"), 1600);
    } catch (err) {
      console.error("Download failed", err);
      setDownloadState("idle");
    }
  }

  async function handleCopy() {
    if (!cardRef.current) return;
    setCopyState("working");
    try {
      const blob = await toBlob(cardRef.current, { pixelRatio: 2, cacheBust: true });
      if (!blob) throw new Error("no blob");
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopyState("done");
      setTimeout(() => setCopyState("idle"), 1600);
    } catch (err) {
      console.error("Copy failed", err);
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 1600);
    }
  }

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 25%, rgba(238,21,21,0.10) 0%, transparent 55%), radial-gradient(circle at 78% 78%, rgba(99,144,240,0.10) 0%, transparent 55%), #08090f",
      }}
    >
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-6 py-5 absolute top-0 left-0 right-0 z-10">
        <Link
          href="/"
          className="text-white/85 hover:text-white text-[13px] font-medium flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition"
        >
          <span aria-hidden>‹</span> Back to builder
        </Link>
        <span
          className="text-white/40 text-[11px] tracking-[0.25em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          FINALIZE
        </span>
      </div>

      <div className="min-h-screen w-full grid place-items-center px-8 py-24">
        <div
          className="grid items-center gap-16 w-full"
          style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", maxWidth: 1100 }}
        >
          {/* Card on the left, rotated -2deg, untilts on hover */}
          <div className="flex justify-end">
            <div className="tilt-card">
              <TrainerCard
                ref={cardRef}
                team={team}
                cardConfig={cardConfig}
                width={360}
              />
            </div>
          </div>

          {/* Right column */}
          <div className="text-white max-w-md">
            <h1
              className="leading-[1.05] tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 56,
                fontWeight: 700,
              }}
            >
              Your team is<br />ready.
            </h1>
            <p
              className="mt-4 text-white/65 text-[15px] leading-relaxed"
              style={{ maxWidth: 360 }}
            >
              Save it, share it, frame it. The card is yours.
            </p>

            <dl
              className="mt-8 divide-y divide-white/10 border-y border-white/10"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <Row k="Team name" v={cardConfig.name || "—"} />
              <Row k="Pokémon" v={`${team.length} / 6`} />
              <Row k="Types covered" v={`${typesCovered}`} />
              <Row k="Format" v="PNG · 2x" />
            </dl>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={handleDownload}
                disabled={team.length === 0 || downloadState === "working"}
                className="w-full px-5 py-3 rounded-full text-[14px] font-semibold text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "var(--color-accent)" }}
              >
                {downloadState === "working"
                  ? "Rendering…"
                  : downloadState === "done"
                    ? "Downloaded ✓"
                    : "↓ Download PNG"}
              </button>
              <button
                onClick={handleCopy}
                disabled={team.length === 0 || copyState === "working"}
                className="w-full px-5 py-3 rounded-full text-[14px] font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                {copyState === "working"
                  ? "Copying…"
                  : copyState === "done"
                    ? "Copied ✓"
                    : copyState === "error"
                      ? "Copy not supported"
                      : "⧉ Copy to clipboard"}
              </button>
            </div>

            {team.length === 0 && (
              <p className="mt-4 text-white/55 text-[12px]">
                Pick at least one Pokémon to enable export.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-3 text-[13px]">
      <dt className="text-white/55 uppercase tracking-[0.15em] text-[11px]">{k}</dt>
      <dd className="text-white font-semibold">{v}</dd>
    </div>
  );
}
