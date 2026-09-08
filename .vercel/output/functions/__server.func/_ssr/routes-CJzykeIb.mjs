import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
import { n as DEFAULT_URL, t as CHECK_META } from "./diagnose-CujAYX-7.mjs";
import { a as Check, i as Copy, n as TriangleAlert, o as ArrowRight, r as LoaderCircle, t as X } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CJzykeIb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Input = object({ url: string().trim().min(8).max(500) });
var diagnoseUrl = createServerFn({ method: "POST" }).validator((data) => Input.parse(data)).handler(createSsrRpc("e106d9075d3838b3113857169377541a2e3e57e2ffc3caf840a7f82dc4bec37a"));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Mark({ className = "size-7" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 64 64",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "64",
				height: "64",
				rx: "8",
				className: "fill-fg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M16 18 L32 32 L16 46",
				stroke: "currentColor",
				className: "text-accent",
				strokeWidth: "6",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M34 46 H50",
				stroke: "currentColor",
				className: "text-accent",
				strokeWidth: "6",
				strokeLinecap: "round"
			})
		]
	});
}
var STRIPE = "https://buy.stripe.com/3cI6oz64ybZJ2dP4ev3Nm0l";
var GITHUB = "https://github.com/GFB2026/mcp-oauth-connect";
var PRODUCT = "https://gfbytes.com/products/mcp-oauth-connect/";
function StatusGlyph({ ok, warn }) {
	if (ok && !warn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
		className: "size-4 text-ok",
		strokeWidth: 2.4,
		"aria-hidden": true
	});
	if (warn) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
		className: "size-4 text-challenge",
		strokeWidth: 2.2,
		"aria-hidden": true
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
		className: "size-4 text-fail",
		strokeWidth: 2.4,
		"aria-hidden": true
	});
}
function isSoftMiss(key, report) {
	return (key === "protected_resource_metadata_path" || key === "protected_resource_metadata") && Boolean(report.checks.protected_resource_metadata_any?.ok);
}
function Checker() {
	const [url, setUrl] = (0, import_react.useState)(DEFAULT_URL);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [report, setReport] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const seq = (0, import_react.useRef)(0);
	const run = async (target) => {
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
	(0, import_react.useEffect)(() => {
		run(DEFAULT_URL);
	}, []);
	const misses = report ? CHECK_META.filter((meta) => {
		const check = report.checks[meta.key];
		if (!check || check.ok) return false;
		return !isSoftMiss(meta.key, report);
	}).length : 0;
	const warns = report?.findings.filter((f) => f.severity === "warn") ?? [];
	const primary = report?.findings.find((f) => f.severity === "fail");
	const hasChecks = Boolean(report && CHECK_META.some((meta) => report.checks[meta.key]));
	const finalUrl = report?.checks.registered_url_is_final?.final || report?.mcp_url;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex min-h-16 max-w-3xl items-center justify-between gap-4 px-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "/",
						className: "flex min-w-0 items-center gap-2.5 no-underline",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { className: "size-7 shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-base font-semibold tracking-wide",
								children: "GFB"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kicker hidden text-faint sm:inline",
								children: "products"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex items-center gap-4 text-sm text-mute",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							className: "hidden hover:text-fg sm:inline",
							href: GITHUB,
							children: "GitHub"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							className: "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-xs bg-accent px-3.5 text-sm font-medium text-accent-ink hover:bg-accent-hover",
							href: STRIPE,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sm:hidden",
								children: "$149"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Attach trace — $149"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-5 pb-20 pt-12 sm:pt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "kicker mb-4 flex items-center gap-3 text-faint",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-accent" }), "MCP connection"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-display font-medium leading-[1.04]",
						children: "Why Connectors fail when curl works."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-xl text-lg leading-relaxed text-mute",
						children: "Paste the URL you put in Claude, Cursor, Desktop, or Grok. This checker reads the OAuth discovery path those UIs actually need — not whether curl got a 200."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-10 border-t border-line-strong pt-6",
						"aria-busy": busy,
						onSubmit: (e) => {
							e.preventDefault();
							run(url);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "server-url",
								className: "kicker text-faint",
								children: "Server URL"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "min-h-11 min-w-24 rounded-xs bg-accent px-4 text-sm font-medium text-accent-ink hover:bg-accent-hover disabled:opacity-60",
								children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Checking"]
								}) : "Check"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "server-url",
							value: url,
							onChange: (e) => setUrl(e.target.value),
							type: "url",
							spellCheck: false,
							autoComplete: "off",
							placeholder: "https://mcp.example.com/mcp",
							className: "mt-3 w-full border-0 border-b border-line-strong bg-transparent py-3 font-mono text-sm text-fg outline-none focus:border-accent focus-visible:outline-none"
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 border-t border-fail/30 pt-4 text-sm text-fail",
						children: error
					}) : null,
					!report && busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckingSkeleton, {}) : null,
					report ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: cn("mt-12", busy && "opacity-60"),
						"aria-live": "polite",
						"aria-busy": busy,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline justify-between gap-3 border-t border-line-strong pt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "kicker text-faint",
									children: "Verdict"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("mt-1 font-serif text-3xl font-medium tracking-[-0.02em]", report.ok ? "text-ok" : "text-fail"),
									children: report.ok ? "Metadata looks attachable" : "Connectors will fail"
								})] }), hasChecks ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-sm tabular-nums text-mute",
									children: [
										misses,
										" miss",
										misses === 1 ? "" : "es",
										warns.length ? ` · ${warns.length} warning${warns.length === 1 ? "" : "s"}` : ""
									]
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 break-all font-mono text-sm text-mute",
								children: report.registered_url
							}),
							primary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "mt-6 border-t border-fail/35 pt-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "kicker text-fail",
										children: "Why this URL dies"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-2 font-serif text-2xl font-medium leading-snug",
										children: primary.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 max-w-xl text-base leading-relaxed text-mute",
										children: primary.body
									}),
									!report.checks.registered_url_is_final?.ok && report.checks.registered_url_is_final && finalUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex flex-wrap items-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
												className: "max-w-full break-all font-mono text-sm text-fg",
												children: finalUrl
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => void copyFinal(),
												className: "inline-flex min-h-11 items-center gap-2 rounded-xs border border-line-strong px-3 text-sm hover:border-fg",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), copied ? "Copied" : "Copy final URL"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => {
													setUrl(finalUrl);
													run(finalUrl);
												},
												className: "inline-flex min-h-11 items-center gap-2 rounded-xs bg-fg px-3 text-sm text-bg hover:opacity-90",
												children: ["Recheck final", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
											})
										]
									}) : null
								]
							}) : null,
							hasChecks ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { report }) : null,
							hasChecks ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-10 divide-y divide-line-strong border-y border-line-strong",
								children: CHECK_META.map((meta) => {
									const check = report.checks[meta.key];
									if (!check) return null;
									const warnOnly = !check.ok && isSoftMiss(meta.key, report);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-0.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusGlyph, {
													ok: check.ok,
													warn: warnOnly
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-medium",
													children: meta.label
												}), !check.ok && check.hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-sm leading-relaxed text-mute",
													children: check.hint
												}) : null]
											})]
										})
									}, meta.key);
								})
							}) : null,
							warns.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "kicker text-challenge",
									children: "Warnings"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-4",
									children: warns.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: f.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm leading-relaxed text-mute",
										children: f.body
									})] }, f.title))
								})]
							}) : null
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pitch, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm text-mute",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© 2026 GFB · products" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-x-5 gap-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: PRODUCT,
							className: "hover:text-fg",
							children: "Product"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: GITHUB,
							className: "hover:text-fg",
							children: "GitHub"
						})]
					})]
				})
			})
		]
	});
}
function CheckingSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-12 border-t border-line-strong pt-6",
		"aria-busy": "true",
		"aria-label": "Checking",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-3 w-20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mt-3 h-8 w-3/4 max-w-sm" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mt-2 h-4 w-1/2 max-w-xs" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 flex items-center gap-2 text-sm text-mute",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "Checking discovery…"]
			})
		]
	});
}
function Pitch() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-14 border-t border-line pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl font-medium",
				children: "The checker never finishes a handshake"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-mute",
				children: "The checker reads metadata. It does not register a client, exchange a code, or call tools/list. That gap is the product. Failures and unknowns are who the $149 attach trace is for."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-0 sm:grid-cols-3",
				children: [
					{
						n: "1",
						t: "Check",
						s: "You paste a URL. Pass or fail, the $149 round still runs."
					},
					{
						n: "2",
						t: "Attempt",
						s: "We sign in from Claude, Cursor, Desktop, and Grok — our accounts, your server."
					},
					{
						n: "3",
						t: "Trace",
						s: "A written path per client. If it fails, that is the brief for a quoted fix round."
					}
				].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "border-t border-line-strong py-5 pr-6 sm:border-t-0 sm:border-t sm:pt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker text-faint",
							children: c.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 font-serif text-xl font-medium",
							children: c.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-mute",
							children: c.s
						})
					]
				}, c.n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: STRIPE,
				className: "mt-6 inline-flex min-h-11 items-center rounded-xs bg-accent px-4 text-sm font-medium text-accent-ink hover:bg-accent-hover",
				children: "Get the attach trace — $149"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm text-mute",
				children: "Refund if we cannot attach and cannot say why. Fix rounds after the trace are quoted separately."
			})
		]
	});
}
function Handshake({ report }) {
	const steps = report.checks.registered_url_is_final && !report.checks.registered_url_is_final.ok ? [
		{
			label: "Ask",
			kind: "try"
		},
		{
			label: "Redirect",
			kind: "fail"
		},
		{
			label: "Stopped",
			kind: "fail"
		}
	] : report.ok ? [
		{
			label: "Ask",
			kind: "try"
		},
		{
			label: "Sign in",
			kind: "challenge"
		},
		{
			label: "Ready",
			kind: "ok"
		}
	] : [
		{
			label: "Ask",
			kind: "try"
		},
		{
			label: "Challenge",
			kind: "challenge"
		},
		{
			label: "Needs work",
			kind: "fail"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "mt-8 border-t border-line-strong py-6",
		"aria-label": "Handshake path",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex flex-wrap items-center gap-2",
			children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-2",
				children: [i > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 text-faint" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("rounded-xs border bg-bg px-2.5 py-1.5 text-sm font-medium", s.kind === "ok" && "border-ok/40 text-ok", s.kind === "challenge" && "border-challenge/40 text-challenge", s.kind === "fail" && "border-fail/40 text-fail", s.kind === "try" && "border-line-strong text-fg"),
					children: s.label
				})]
			}, s.label))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "kicker mt-4 text-faint",
			children: "claude.ai · Desktop · Cursor · Grok → your server"
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checker, {});
}
//#endregion
export { Home as component };
