//#region node_modules/.nitro/vite/services/ssr/assets/diagnose-CujAYX-7.js
var DIAGNOSE_VERSION = "0.4.0";
var DEFAULT_URL = "https://mcp.gfbytes.com";
var CHECK_META = [
	{
		key: "authorization_server_metadata",
		label: "Authorization server"
	},
	{
		key: "code_challenge_s256",
		label: "PKCE S256"
	},
	{
		key: "protected_resource_metadata",
		label: "Resource metadata"
	},
	{
		key: "protected_resource_metadata_path",
		label: "Resource metadata for this path"
	},
	{
		key: "registered_url_is_final",
		label: "URL does not redirect"
	},
	{
		key: "mcp_no_cross_host_redirect",
		label: "Stays on the same host"
	},
	{
		key: "unauthenticated_mcp_get",
		label: "GET without a token"
	},
	{
		key: "unauthenticated_mcp_post",
		label: "POST without a token"
	},
	{
		key: "resource_metadata_absolute",
		label: "Metadata URL is https"
	},
	{
		key: "prm_resource_matches_mcp",
		label: "Resource matches this URL"
	}
];
//#endregion
export { DEFAULT_URL as n, DIAGNOSE_VERSION as r, CHECK_META as t };
