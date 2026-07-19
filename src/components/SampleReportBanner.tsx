import Link from "next/link";

export function SampleReportBanner() {
  return (
    <div
      role="status"
      className="no-print rounded-md border border-[var(--accent)]/40 bg-[rgba(61,154,139,0.12)] px-4 py-3 text-sm leading-relaxed"
    >
      <p className="font-medium text-[var(--ink)]">Sample assessment</p>
      <p className="mt-1 text-[var(--ink-muted)]">
        This is a pre-generated example — start your own to get a report for
        your system.{" "}
        <Link
          href="/assess"
          className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
        >
          Start assessment
        </Link>
      </p>
    </div>
  );
}
