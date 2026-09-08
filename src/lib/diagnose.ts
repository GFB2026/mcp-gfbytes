export const DIAGNOSE_VERSION = "0.4.0";

export const DEFAULT_URL = "https://mcp.gfbytes.com";

export type CheckResult = {
  ok: boolean;
  hint: string | null;
  status?: number | null;
  url?: string | null;
  location?: string | null;
  resource?: string | null;
  authorization_servers?: string[] | null;
  missing?: string[];
  issuer?: string | null;
  registration_endpoint?: string | null;
  code_challenge_methods_supported?: string[];
  registered?: string;
  final?: string;
  hops?: number;
  get_status?: number;
  get_location?: string | null;
  post_status?: number;
  post_location?: string | null;
  post_2026_07_28_status?: number;
  post_2026_07_28_location?: string | null;
  mode?: string;
  status_2026_07_28?: number;
  www_authenticate?: string;
  resource_metadata?: string | null;
  source?: string | null;
  mcp?: string | null;
  server_name?: string | null;
  protocolVersion?: string | null;
};

export type RedirectHop = {
  from: string;
  to: string;
  status: number;
  method: string;
};

export type Finding = {
  severity: "fail" | "warn" | "ok";
  title: string;
  body: string;
};

export type DiagnoseReport = {
  version: string;
  url: string;
  registered_url: string;
  mcp_url: string;
  as_url: string;
  ok: boolean;
  warnings: string[];
  findings: Finding[];
  hops: RedirectHop[];
  checks: Record<string, CheckResult>;
  error?: string;
};

export const CHECK_META: { key: string; label: string }[] = [
  { key: "authorization_server_metadata", label: "Authorization server" },
  { key: "code_challenge_s256", label: "PKCE S256" },
  { key: "protected_resource_metadata", label: "Resource metadata" },
  { key: "protected_resource_metadata_path", label: "Resource metadata for this path" },
  { key: "registered_url_is_final", label: "URL does not redirect" },
  { key: "mcp_no_cross_host_redirect", label: "Stays on the same host" },
  { key: "unauthenticated_mcp_get", label: "GET without a token" },
  { key: "unauthenticated_mcp_post", label: "POST without a token" },
  { key: "resource_metadata_absolute", label: "Metadata URL is https" },
  { key: "prm_resource_matches_mcp", label: "Resource matches this URL" },
];