import { r as DIAGNOSE_VERSION } from "./diagnose-CujAYX-7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/diagnose.server-Td_zBfCZ.js
var REQUIRED_AS_KEYS = [
	"issuer",
	"authorization_endpoint",
	"token_endpoint",
	"registration_endpoint"
];
var RESOURCE_METADATA_RE = /resource_metadata\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s,;]+))/i;
var TIMEOUT_MS = 12e3;
var MAX_BODY = 65536;
var MAX_HOPS = 5;
var UA = `mcp-oauth-connect/${DIAGNOSE_VERSION}`;
function initBody(protocolVersion) {
	return JSON.stringify({
		jsonrpc: "2.0",
		id: 1,
		method: "initialize",
		params: {
			protocolVersion,
			capabilities: {},
			clientInfo: {
				name: "mcp-oauth-connect-diagnose",
				version: DIAGNOSE_VERSION
			},
			_meta: { "io.modelcontextprotocol/protocolVersion": protocolVersion }
		}
	});
}
var INIT_2025 = initBody("2025-03-26");
var INIT_2026 = initBody("2026-07-28");
function isPrivateIPv4(host) {
	const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
	if (!m) return false;
	const oct = m.slice(1).map(Number);
	if (oct.some((n) => n > 255)) return true;
	const [a, b] = oct;
	if (a === 10 || a === 127 || a === 0) return true;
	if (a === 169 && b === 254) return true;
	if (a === 192 && b === 168) return true;
	if (a === 172 && b >= 16 && b <= 31) return true;
	if (a === 100 && b >= 64 && b <= 127) return true;
	return false;
}
function blockedHost(hostname) {
	const h = hostname.toLowerCase().replace(/\.$/, "");
	if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal") || h === "::1" || h === "[::1]" || h === "0.0.0.0") return true;
	if (h.includes(":")) {
		const bare = h.replace(/^\[|\]$/g, "");
		if (bare === "::1" || bare.startsWith("fc") || bare.startsWith("fd") || bare.startsWith("fe80")) return true;
	}
	return isPrivateIPv4(h);
}
function assertPublicHttps(raw) {
	let parsed;
	try {
		parsed = new URL(raw.trim());
	} catch {
		throw new Error("URL is not valid");
	}
	if (parsed.protocol !== "https:") throw new Error("URL must be https (Connectors UI will not complete OAuth over http)");
	if (parsed.username || parsed.password) throw new Error("URL must not include credentials");
	if (blockedHost(parsed.hostname)) throw new Error("URL host is not a public address");
	return parsed;
}
function originOf(u) {
	return `${u.protocol}//${u.host}`;
}
function splitOriginMcp(base) {
	const parsed = new URL(base.trim());
	const origin = originOf(parsed);
	return {
		origin,
		mcpUrl: origin + ((parsed.pathname || "").replace(/\/$/, "") || "/mcp")
	};
}
function prmPathUrl(origin, mcpUrl) {
	const path = new URL(mcpUrl).pathname.replace(/^\//, "");
	if (!path) return `${origin}/.well-known/oauth-protected-resource`;
	return `${origin}/.well-known/oauth-protected-resource/${path}`;
}
function headerMap(headers) {
	const out = {};
	headers.forEach((v, k) => {
		out[k.toLowerCase()] = v;
	});
	return out;
}
function resourceMetadataUrl(www) {
	const m = RESOURCE_METADATA_RE.exec(www || "");
	if (!m) return null;
	return m[1] || m[2] || m[3] || null;
}
function isAbsoluteHttps(url) {
	try {
		const p = new URL(url);
		return p.protocol === "https:" && Boolean(p.host);
	} catch {
		return false;
	}
}
function hostsDiffer(a, b) {
	try {
		return new URL(a).host.toLowerCase() !== new URL(b).host.toLowerCase();
	} catch {
		return true;
	}
}
function decodeBody(body) {
	return new TextDecoder("utf-8", { fatal: false }).decode(body);
}
function loadJson(body) {
	try {
		const data = JSON.parse(decodeBody(body) || "{}");
		return data && typeof data === "object" && !Array.isArray(data) ? data : {};
	} catch {
		return {};
	}
}
function jsonrpcResult(body) {
	let parsed = loadJson(body);
	if (parsed.jsonrpc !== "2.0") {
		parsed = {};
		for (const line of decodeBody(body).split(/\r?\n/)) if (line.startsWith("data:")) {
			parsed = loadJson(new TextEncoder().encode(line.slice(5).trim()));
			if (parsed.jsonrpc === "2.0") break;
		}
	}
	if (parsed.jsonrpc !== "2.0") return null;
	const result = parsed.result;
	return result && typeof result === "object" && !Array.isArray(result) ? result : null;
}
function looksLikeMcpHello(result) {
	if (!result) return false;
	if (result.protocolVersion || result.serverInfo) return true;
	if (result.resultType === "complete" && result.supportedVersions) return true;
	return typeof result.capabilities === "object" && result.capabilities !== null;
}
async function request(method, url, opts) {
	const headers = { "User-Agent": UA };
	if (opts?.extra) Object.assign(headers, opts.extra);
	if (opts?.data) {
		headers["Content-Type"] = "application/json";
		headers.Accept = headers.Accept || "application/json, text/event-stream";
	}
	let res;
	try {
		res = await fetch(url, {
			method,
			headers,
			body: opts?.data,
			redirect: "manual",
			signal: AbortSignal.timeout(TIMEOUT_MS)
		});
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		throw new Error(`Could not reach ${url}: ${msg}`);
	}
	const buf = new Uint8Array(await res.arrayBuffer());
	const body = buf.byteLength > MAX_BODY ? buf.slice(0, MAX_BODY) : buf;
	const hdrs = headerMap(res.headers);
	return {
		status: res.status,
		headers: hdrs,
		body,
		location: hdrs.location || null,
		url
	};
}
async function followSameHost(method, startUrl, opts) {
	const hops = [];
	let current = startUrl;
	for (let i = 0; i < MAX_HOPS; i++) {
		const probe = await request(method, current, opts);
		if (!(probe.status >= 300 && probe.status < 400 && probe.location)) return {
			probe: {
				...probe,
				url: current
			},
			hops,
			crossed: false
		};
		let next;
		try {
			next = new URL(probe.location, current).toString();
		} catch {
			return {
				probe,
				hops,
				crossed: false
			};
		}
		hops.push({
			from: current,
			to: next,
			status: probe.status,
			method
		});
		if (hostsDiffer(current, next)) return {
			probe,
			hops,
			crossed: true
		};
		current = next;
	}
	const last = hops[hops.length - 1];
	return {
		probe: {
			status: last?.status ?? 0,
			headers: {},
			body: /* @__PURE__ */ new Uint8Array(),
			location: last?.to ?? null,
			url: current
		},
		hops,
		crossed: false
	};
}
function prmCheck(url, status, body, location) {
	const parsed = loadJson(body);
	const ok = status === 200 && Object.keys(parsed).length > 0;
	return {
		ok,
		url,
		status,
		location,
		resource: typeof parsed.resource === "string" ? parsed.resource : null,
		authorization_servers: Array.isArray(parsed.authorization_servers) ? parsed.authorization_servers.filter((s) => typeof s === "string") : null,
		hint: ok ? null : "Need HTTP 200 JSON at this well-known path."
	};
}
function buildFindings(report) {
	const findings = [];
	const checks = report.checks;
	const reg = checks.registered_url_is_final;
	if (reg && !reg.ok) findings.push({
		severity: "fail",
		title: "Connectors posted to a redirect, not a challenge",
		body: `The URL in the Connectors dialog (${report.registered_url}) redirects to ${report.mcp_url}. Claude, Cursor, and Grok send initialize as POST and often do not replay it. Paste the final URL.`
	});
	const cross = checks.mcp_no_cross_host_redirect;
	if (cross && !cross.ok) findings.push({
		severity: "fail",
		title: "Cross-host redirect drops Authorization",
		body: "The MCP path redirects to a different host. Bearer tokens do not follow that hop. Register the final URL."
	});
	const prmMatch = checks.prm_resource_matches_mcp;
	if (prmMatch && !prmMatch.ok) findings.push({
		severity: "fail",
		title: "Resource identifier does not match this URL",
		body: `Protected-resource metadata names ${prmMatch.resource || "(missing)"} while Connectors bound ${report.mcp_url}. The authorization server then issues a token for a different resource.`
	});
	const post = checks.unauthenticated_mcp_post;
	if (post && !post.ok) findings.push({
		severity: "fail",
		title: "First POST is not a login challenge",
		body: post.hint || "Need POST HTTP 401 + WWW-Authenticate Bearer resource_metadata, or HTTP 200 JSON-RPC initialize."
	});
	else if (post?.mode === "anonymous_discovery_2026-07-28") findings.push({
		severity: "warn",
		title: "This server answers before login",
		body: "Older Connectors only start OAuth on a first POST 401. A version gate covers both older and current clients."
	});
	const get = checks.unauthenticated_mcp_get;
	if (get && !get.ok) findings.push({
		severity: "fail",
		title: "GET without a token is the curl-pass / UI-fail pattern",
		body: get.hint || "GET should be 401 (challenge) or 405 (POST-only). HTTP 200 without auth is what curl celebrates and Connectors rejects."
	});
	const asMeta = checks.authorization_server_metadata;
	if (asMeta && !asMeta.ok) findings.push({
		severity: "fail",
		title: "No authorization-server metadata",
		body: "Need JSON at /.well-known/oauth-authorization-server (or OpenID discovery) with a registration endpoint."
	});
	else if (report.as_url.includes("openid-configuration")) findings.push({
		severity: "warn",
		title: "Authorization server uses OpenID discovery",
		body: "Some clients look for /.well-known/oauth-authorization-server first."
	});
	const s256 = checks.code_challenge_s256;
	if (s256 && !s256.ok) findings.push({
		severity: "fail",
		title: "PKCE S256 is not advertised",
		body: "Authorization server metadata must include \"code_challenge_methods_supported\": [\"S256\"]."
	});
	const prmAny = checks.protected_resource_metadata_any;
	if (prmAny && !prmAny.ok) findings.push({
		severity: "fail",
		title: "No protected-resource metadata",
		body: "Need JSON at /.well-known/oauth-protected-resource and/or the path-appended form."
	});
	else {
		const originPrm = checks.protected_resource_metadata;
		const pathPrm = checks.protected_resource_metadata_path;
		if (originPrm && !originPrm.ok && pathPrm?.ok) findings.push({
			severity: "warn",
			title: "Resource metadata is only on the path form",
			body: "Some clients also request /.well-known/oauth-protected-resource on the origin."
		});
		if (pathPrm && !pathPrm.ok && originPrm?.ok) findings.push({
			severity: "warn",
			title: "Path form of resource metadata is missing",
			body: "Some clients request /.well-known/oauth-protected-resource plus the MCP path."
		});
	}
	const abs = checks.resource_metadata_absolute;
	if (abs && !abs.ok) findings.push({
		severity: "fail",
		title: "Metadata URL is not absolute HTTPS",
		body: abs.hint || "Put an absolute HTTPS URL on the 401 WWW-Authenticate header."
	});
	if (findings.length === 0) findings.push({
		severity: "ok",
		title: "Metadata looks attachable",
		body: "A checker pass is not a handshake. The $149 attach trace still covers registration, the code exchange, and tools/list."
	});
	return findings;
}
async function diagnose(base) {
	let parsed;
	try {
		parsed = assertPublicHttps(base);
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		return {
			version: DIAGNOSE_VERSION,
			url: base.trim(),
			registered_url: base.trim(),
			mcp_url: base.trim(),
			as_url: "",
			ok: false,
			warnings: [],
			findings: [{
				severity: "fail",
				title: "Bad URL",
				body: msg
			}],
			hops: [],
			checks: {},
			error: msg
		};
	}
	const registered = parsed.toString().replace(/\/$/, "") || originOf(parsed);
	const { origin, mcpUrl: initialMcp } = splitOriginMcp(registered);
	const asUrl = `${origin}/.well-known/oauth-authorization-server`;
	const oidcUrl = `${origin}/.well-known/openid-configuration`;
	const prmOriginUrl = `${origin}/.well-known/oauth-protected-resource`;
	const prmPathInitial = prmPathUrl(origin, initialMcp);
	const report = {
		version: DIAGNOSE_VERSION,
		url: origin,
		registered_url: registered,
		mcp_url: initialMcp,
		as_url: asUrl,
		ok: true,
		warnings: [],
		findings: [],
		hops: [],
		checks: {}
	};
	const setCheck = (key, check, gates = true) => {
		report.checks[key] = check;
		if (gates && !check.ok) report.ok = false;
	};
	try {
		const [asProbe, oidcProbe, prmOriginProbe, prmPathProbe, getFollow, postFollow, post26Follow] = await Promise.all([
			request("GET", asUrl).catch(() => null),
			request("GET", oidcUrl).catch(() => null),
			request("GET", prmOriginUrl).catch(() => null),
			request("GET", prmPathInitial).catch(() => null),
			followSameHost("GET", initialMcp),
			followSameHost("POST", initialMcp, {
				data: INIT_2025,
				extra: { "MCP-Protocol-Version": "2025-03-26" }
			}),
			followSameHost("POST", initialMcp, {
				data: INIT_2026,
				extra: {
					"MCP-Protocol-Version": "2026-07-28",
					"Mcp-Method": "initialize"
				}
			})
		]);
		let asJson = {};
		let asStatus = asProbe?.status ?? 0;
		let asOk = false;
		if (asProbe) {
			asJson = loadJson(asProbe.body);
			const missing = REQUIRED_AS_KEYS.filter((k) => !asJson[k]);
			asOk = asProbe.status === 200 && missing.length === 0;
			if (!asOk && oidcProbe) {
				const oidcJson = loadJson(oidcProbe.body);
				const oidcMissing = REQUIRED_AS_KEYS.filter((k) => !oidcJson[k]);
				if (oidcProbe.status === 200 && oidcMissing.length === 0) {
					asOk = true;
					asJson = oidcJson;
					asStatus = oidcProbe.status;
					report.as_url = oidcUrl;
				}
			}
			const stillMissing = REQUIRED_AS_KEYS.filter((k) => !asJson[k]);
			setCheck("authorization_server_metadata", {
				ok: asOk,
				status: asStatus,
				missing: stillMissing,
				issuer: typeof asJson.issuer === "string" ? asJson.issuer : null,
				registration_endpoint: typeof asJson.registration_endpoint === "string" ? asJson.registration_endpoint : null,
				hint: asOk ? null : "Need JSON with issuer, authorization_endpoint, token_endpoint, and registration_endpoint."
			});
		} else setCheck("authorization_server_metadata", {
			ok: false,
			status: 0,
			missing: [...REQUIRED_AS_KEYS],
			hint: "Authorization-server metadata request failed."
		});
		const methods = Array.isArray(asJson.code_challenge_methods_supported) ? asJson.code_challenge_methods_supported.filter((m) => typeof m === "string") : [];
		const s256Ok = methods.includes("S256");
		setCheck("code_challenge_s256", {
			ok: s256Ok,
			code_challenge_methods_supported: methods,
			hint: s256Ok ? null : "Authorization server metadata must advertise \"code_challenge_methods_supported\": [\"S256\"]."
		});
		const prmOrigin = prmOriginProbe ? prmCheck(prmOriginUrl, prmOriginProbe.status, prmOriginProbe.body, prmOriginProbe.location) : {
			ok: false,
			url: prmOriginUrl,
			status: 0,
			hint: "Resource metadata request failed.",
			location: null
		};
		setCheck("protected_resource_metadata", prmOrigin, false);
		const prmPath = prmPathProbe ? prmCheck(prmPathInitial, prmPathProbe.status, prmPathProbe.body, prmPathProbe.location) : {
			ok: false,
			url: prmPathInitial,
			status: 0,
			hint: "Path form of resource metadata request failed.",
			location: null
		};
		setCheck("protected_resource_metadata_path", prmPath, false);
		const prmAny = Boolean(prmOrigin.ok || prmPath.ok);
		setCheck("protected_resource_metadata_any", {
			ok: prmAny,
			hint: prmAny ? null : "Need JSON at /.well-known/oauth-protected-resource and/or the path-appended form."
		});
		const hops = [
			...getFollow.hops,
			...postFollow.hops,
			...post26Follow.hops
		];
		report.hops = hops;
		const crossed = getFollow.crossed || postFollow.crossed || post26Follow.crossed;
		setCheck("mcp_no_cross_host_redirect", {
			ok: !crossed,
			get_status: getFollow.probe.status,
			get_location: getFollow.probe.location,
			post_status: postFollow.probe.status,
			post_location: postFollow.probe.location,
			post_2026_07_28_status: post26Follow.probe.status,
			post_2026_07_28_location: post26Follow.probe.location,
			hint: crossed ? "MCP URL redirects to a different host, which drops Authorization. Register the final URL." : null
		});
		const finalMcp = postFollow.hops.length > 0 ? postFollow.hops[postFollow.hops.length - 1].to : getFollow.hops.length > 0 ? getFollow.hops[getFollow.hops.length - 1].to : initialMcp;
		report.mcp_url = finalMcp;
		const registeredIsFinal = initialMcp.replace(/\/$/, "") === finalMcp.replace(/\/$/, "");
		setCheck("registered_url_is_final", {
			ok: registeredIsFinal,
			status: (postFollow.hops[0] || getFollow.hops[0])?.status ?? null,
			registered: initialMcp,
			final: finalMcp,
			hops: hops.length,
			hint: registeredIsFinal ? null : `Connectors posted to ${initialMcp} and followed a same-host redirect to ${finalMcp}. Paste the final URL.`
		});
		const getProbe = getFollow.probe;
		const getOk = getProbe.status === 401 || getProbe.status === 405;
		setCheck("unauthenticated_mcp_get", {
			ok: getOk,
			status: getProbe.status,
			hint: getOk ? null : "GET should be 401 (challenge) or 405 (POST-only). HTTP 200 without auth is the curl-pass / UI-fail pattern."
		});
		const postProbe = postFollow.probe;
		const post26Probe = post26Follow.probe;
		const www = postProbe.headers["www-authenticate"] || post26Probe.headers["www-authenticate"] || getProbe.headers["www-authenticate"] || "";
		let meta = resourceMetadataUrl(www);
		let challengeOk = postProbe.status === 401 && www.toLowerCase().includes("bearer") && Boolean(meta);
		if (!challengeOk && post26Probe.status === 401) {
			const www26 = post26Probe.headers["www-authenticate"] || "";
			const meta26 = resourceMetadataUrl(www26);
			if (www26.toLowerCase().includes("bearer") && meta26) {
				challengeOk = true;
				meta = meta26;
			}
		}
		const hello = jsonrpcResult(post26Probe.body) || jsonrpcResult(postProbe.body);
		const anonOk = (post26Probe.status === 200 || postProbe.status === 200) && looksLikeMcpHello(hello);
		let mode;
		if (challengeOk && anonOk) mode = "version_gate";
		else if (anonOk) mode = "anonymous_discovery_2026-07-28";
		else if (challengeOk) mode = "oauth_challenge";
		else mode = "miss";
		setCheck("unauthenticated_mcp_post", {
			ok: mode !== "miss",
			mode,
			status: postProbe.status,
			status_2026_07_28: post26Probe.status,
			www_authenticate: www.slice(0, 400),
			resource_metadata: meta,
			server_name: hello && typeof hello.serverInfo === "object" && hello.serverInfo && typeof hello.serverInfo.name === "string" ? hello.serverInfo.name : null,
			protocolVersion: typeof hello?.protocolVersion === "string" ? hello.protocolVersion : null,
			hint: mode !== "miss" ? null : "Need POST HTTP 401 plus WWW-Authenticate: Bearer with an absolute resource_metadata URL, or HTTP 200 JSON-RPC initialize."
		});
		let absOk = false;
		let absSource = null;
		if (meta) {
			absOk = isAbsoluteHttps(meta);
			absSource = "www-authenticate";
		} else if (anonOk && prmAny) {
			absOk = true;
			absSource = "well-known";
			meta = (prmOrigin.ok ? String(prmOrigin.url) : null) || (prmPath.ok ? String(prmPath.url) : null);
		}
		setCheck("resource_metadata_absolute", {
			ok: absOk,
			resource_metadata: meta,
			source: absSource,
			hint: absOk ? null : "resource_metadata must be an absolute HTTPS URL on the 401 WWW-Authenticate header, or JSON at origin /.well-known/oauth-protected-resource."
		});
		const prmResource = typeof prmOrigin.resource === "string" && prmOrigin.resource || typeof prmPath.resource === "string" && prmPath.resource || null;
		let matchOk = true;
		let matchHint = null;
		if (prmResource) try {
			const resHost = new URL(prmResource).host.toLowerCase();
			const mcpHost = new URL(finalMcp).host.toLowerCase();
			matchOk = resHost === mcpHost;
			if (!matchOk) matchHint = `Resource metadata names ${prmResource} but the MCP host is ${mcpHost}. Connectors bind the resource identifier to the URL you paste.`;
		} catch {
			matchOk = false;
			matchHint = "Resource identifier is not a valid URL.";
		}
		else if (prmAny) {
			matchOk = false;
			matchHint = "Protected-resource metadata is missing a resource identifier.";
		}
		setCheck("prm_resource_matches_mcp", {
			ok: matchOk,
			resource: prmResource,
			mcp: finalMcp,
			hint: matchHint
		});
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		report.ok = false;
		report.error = msg;
	}
	report.findings = buildFindings(report);
	report.warnings = report.findings.filter((f) => f.severity === "warn").map((f) => f.body);
	return report;
}
//#endregion
export { diagnose };
