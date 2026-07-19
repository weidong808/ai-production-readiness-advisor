import Link from "next/link";

export function SampleReportBanner() {
  return (
    <div
      role="status"
      className="no-print rounded-md border border-[color-mix(in_srgb,var(--accent)_40%,var(--border))] bg-[color-mix(in_srgb,var(--accent)_12%,var(--card))] px-4 py-3 text-sm leading-relaxed"
    >
      <p className="font-medium text-[var(--foreground)]">Sample assessment</p>
      <p className="mt-1 text-[var(--muted)]">
        This is a pre-generated example — start your own to get a report for
        your system.{" "}
        <Link
          href="/assess"
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
        >
          Start assessment
        </Link>
      </p>
    </div>
  );
}
