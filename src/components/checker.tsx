import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  Loader2,
  X,
} from "lucide-react";
import { diagnoseUrl } from "@/lib/diagnose.functions";
import {
  CHECK_META,
  DEFAULT_URL,
  type DiagnoseReport,
} from "@/lib/diagnose";
import { cn } from "@/lib/utils";
import { Mark } from "./mark";

const SITE = "https://gfbytes.com/";

function StatusGlyph({ ok, warn }: { ok: boolean; warn?: boolean }) {
  if (ok && !warn) {
    return <Check className="size-4 text-ok" strokeWidth={2.4} aria-hidden />;
  }
  if (warn) {
    return <AlertTriangle className="size-4 text-challenge" strokeWidth={2.2} aria-hidden />;
  }
  return <X className="size-4 text-fail" strokeWidth={2.4} aria-hidden />;
}

function isSoftMiss(key: string, report: DiagnoseReport): boolean {
  return (
    (key === "protected_resource_metadata_path" ||
      key === "protected_resource_metadata") &&
    Boolean(report.checks.protected_resource_metadata_any?.ok)
  );
}

export function Checker() {
  const [url, setUrl] = useState<string>(DEFAULT_URL);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DiagnoseReport | null>(null);
  const [copied, setCopied] = useState(false);
  const seq = useRef(0);

  const run = async (target: string) => {
    const next = target.trim();
    if (!next) {
      setError("Paste an https URL.");
      return;
    }
    const id = ++seq.current;
    setBusy(true);
    setError(null);
    try {
      const result = await diagnoseUrl({ data: { url: next } });
      if (id !== seq.current) return;
      setReport(result);
    } catch (err) {
      if (id !== seq.current) return;
      setReport(null);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (id === seq.current) setBusy(false);
    }
  };

  useEffect(() => {
    void run(DEFAULT_URL);
  }, []);

  const misses = report
    ? CHECK_META.filter((meta) => {
        const check = report.checks[meta.key];
        if (!check || check.ok) return false;
        return !isSoftMiss(meta.key, report);
      }).length
    : 0;
  const warns = report?.findings.filter((f) => f.severity === "warn") ?? [];
  const primary = report?.findings.find((f) => f.severity === "fail");
  const hasChecks = Boolean(
    report && CHECK_META.some((meta) => report.checks[meta.key]),
  );
  const finalUrl =
    (report?.checks.registered_url_is_final?.final as string | undefined) ||
    report?.mcp_url;

  const copyFinal = async () => {
    if (!finalUrl) return;
    try {
      await navigator.clipboard.writeText(finalUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-dvh bg-bg">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex min-h-16 max-w-3xl items-center justify-between gap-4 px-5">
          <a href="/" className="flex min-w-0 items-center gap-2.5 no-underline">
            <Mark className="size-7 shrink-0" />
            <span className="truncate text-base font-semibold tracking-wide">GFB</span>
            <span className="kicker hidden text-faint sm:inline">products</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-20 pt-12 sm:pt-16">
        <p className="kicker mb-4 flex items-center gap-3 text-faint">
          <span className="size-1.5 rounded-full bg-accent" />
          MCP connection
        </p>
        <h1 className="font-serif text-display font-medium leading-[1.04]">
          Why Connectors fail when curl works.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-mute">
          Paste the URL you put in Claude, Cursor, Desktop, or Grok. This checker
          reads the OAuth discovery path those UIs actually need — not whether
          curl got a 200.
        </p>

        <form
          className="mt-10 border-t border-line-strong pt-6"
          aria-busy={busy}
          onSubmit={(e) => {
            e.preventDefault();
            void run(url);
          }}
        >
          <div className="flex items-end justify-between gap-3">
            <label
              htmlFor="server-url"
              className="kicker text-faint"
            >
              Server URL
            </label>
            <button
              type="submit"
              disabled={busy}
              className="min-h-11 min-w-24 rounded-xs bg-accent px-4 text-sm font-medium text-accent-ink hover:bg-accent-hover disabled:opacity-60"
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Checking
                </span>
              ) : (
                "Check"
              )}
            </button>
          </div>
          <input
            id="server-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="url"
            spellCheck={false}
            autoComplete="off"
            placeholder="https://mcp.example.com/mcp"
            className="mt-3 w-full border-0 border-b border-line-strong bg-transparent py-3 font-mono text-sm text-fg outline-none focus:border-accent focus-visible:outline-none"
          />
        </form>

        {error ? (
          <p className="mt-8 border-t border-fail/30 pt-4 text-sm text-fail">{error}</p>
        ) : null}

        {!report && busy ? <CheckingSkeleton /> : null}

        {report ? (
          <section
            className={cn("mt-12", busy && "opacity-60")}
            aria-live="polite"
            aria-busy={busy}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-line-strong pt-6">
              <div>
                <p className="kicker text-faint">Verdict</p>
                <p
                  className={cn(
                    "mt-1 font-serif text-3xl font-medium tracking-[-0.02em]",
                    report.ok ? "text-ok" : "text-fail",
                  )}
                >
                  {report.ok ? "Metadata looks attachable" : "Connectors will fail"}
                </p>
              </div>
              {hasChecks ? (
                <p className="font-mono text-sm tabular-nums text-mute">
                  {misses} miss{misses === 1 ? "" : "es"}
                  {warns.length
                    ? ` · ${warns.length} warning${warns.length === 1 ? "" : "s"}`
                    : ""}
                </p>
              ) : null}
            </div>

            <p className="mt-2 break-all font-mono text-sm text-mute">
              {report.registered_url}
            </p>

            {primary ? (
              <article className="mt-6 border-t border-fail/35 pt-5">
                <p className="kicker text-fail">Why this URL dies</p>
                <h2 className="mt-2 font-serif text-2xl font-medium leading-snug">
                  {primary.title}
                </h2>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-mute">
                  {primary.body}
                </p>
                {!report.checks.registered_url_is_final?.ok &&
                report.checks.registered_url_is_final &&
                finalUrl ? (
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <code className="max-w-full break-all font-mono text-sm text-fg">
                      {finalUrl}
                    </code>
                    <button
                      type="button"
                      onClick={() => void copyFinal()}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xs border border-line-strong px-3 text-sm hover:border-fg"
                    >
                      <Copy className="size-3.5" />
                      {copied ? "Copied" : "Copy final URL"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUrl(finalUrl);
                        void run(finalUrl);
                      }}
                      className="inline-flex min-h-11 items-center gap-2 rounded-xs bg-fg px-3 text-sm text-bg hover:opacity-90"
                    >
                      Recheck final
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                ) : null}
              </article>
            ) : null}

            {hasChecks ? <Handshake report={report} /> : null}

            {hasChecks ? (
              <ul className="mt-10 divide-y divide-line-strong border-y border-line-strong">
                {CHECK_META.map((meta) => {
                  const check = report.checks[meta.key];
                  if (!check) return null;
                  const warnOnly = !check.ok && isSoftMiss(meta.key, report);
                  return (
                    <li key={meta.key} className="py-3.5">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5">
                          <StatusGlyph ok={check.ok} warn={warnOnly} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{meta.label}</p>
                          {!check.ok && check.hint ? (
                            <p className="mt-1 text-sm leading-relaxed text-mute">
                              {check.hint}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {warns.length > 0 ? (
              <div className="mt-8">
                <p className="kicker text-challenge">Warnings</p>
                <ul className="mt-3 space-y-4">
                  {warns.map((f) => (
                    <li key={f.title}>
                      <p className="text-sm font-medium">{f.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-mute">{f.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        <Scope />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-mute">
          <span>© 2026 GFB · products</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={SITE} className="hover:text-fg">
              gfbytes.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckingSkeleton() {
  return (
    <div className="mt-12 border-t border-line-strong pt-6" aria-busy="true" aria-label="Checking">
      <div className="skeleton h-3 w-20" />
      <div className="skeleton mt-3 h-8 w-3/4 max-w-sm" />
      <div className="skeleton mt-2 h-4 w-1/2 max-w-xs" />
      <p className="mt-6 flex items-center gap-2 text-sm text-mute">
        <Loader2 className="size-4 animate-spin" />
        Checking discovery…
      </p>
    </div>
  );
}

function Scope() {
  return (
    <section className="mt-14 border-t border-line pt-8">
      <h2 className="font-serif text-2xl font-medium">The checker never finishes a handshake</h2>
      <p className="mt-3 max-w-xl text-mute">
        The checker reads metadata. It does not register a client, exchange a
        code, or call tools/list.
      </p>
    </section>
  );
}

function Handshake({ report }: { report: DiagnoseReport }) {
  const trap =
    report.checks.registered_url_is_final && !report.checks.registered_url_is_final.ok;
  const steps = trap
    ? [
        { label: "Ask", kind: "try" },
        { label: "Redirect", kind: "fail" },
        { label: "Stopped", kind: "fail" },
      ]
    : report.ok
      ? [
          { label: "Ask", kind: "try" },
          { label: "Sign in", kind: "challenge" },
          { label: "Ready", kind: "ok" },
        ]
      : [
          { label: "Ask", kind: "try" },
          { label: "Challenge", kind: "challenge" },
          { label: "Needs work", kind: "fail" },
        ];

  return (
    <figure className="mt-8 border-t border-line-strong py-6" aria-label="Handshake path">
      <ol className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2">
            {i > 0 ? <ArrowRight className="size-3.5 text-faint" /> : null}
            <span
              className={cn(
                "rounded-xs border bg-bg px-2.5 py-1.5 text-sm font-medium",
                s.kind === "ok" && "border-ok/40 text-ok",
                s.kind === "challenge" && "border-challenge/40 text-challenge",
                s.kind === "fail" && "border-fail/40 text-fail",
                s.kind === "try" && "border-line-strong text-fg",
              )}
            >
              {s.label}
            </span>
          </li>
        ))}
      </ol>
      <p className="kicker mt-4 text-faint">
        claude.ai · Desktop · Cursor · Grok → your server
      </p>
    </figure>
  );
}
