import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(232,238,244,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,238,244,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <p className="mb-4 text-sm tracking-[0.2em] text-[var(--accent)] uppercase">
          AI in Action · App #3
        </p>
        <h1
          className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          AI Production Readiness Advisor
        </h1>
        <p className="mt-5 max-w-xl text-lg text-[var(--ink-muted)]">
          A guided assessment that scores eight dimensions, applies hard gates,
          and tells you whether an AI feature is ready to ship — advisory, not
          certification.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/assess"
            className="inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#06120f] transition hover:bg-[var(--accent-strong)]"
          >
            Start assessment
          </Link>
          <p className="text-sm text-[var(--ink-muted)]">
            Deterministic scores · OpenAI advisory narrative
          </p>
        </div>
      </div>
    </main>
  );
}
