import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/diagnose.functions-BRgEpf4q.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var Input = object({ url: string().trim().min(8).max(500) });
var diagnoseUrl_createServerFn_handler = createServerRpc({
	id: "e106d9075d3838b3113857169377541a2e3e57e2ffc3caf840a7f82dc4bec37a",
	name: "diagnoseUrl",
	filename: "src/lib/diagnose.functions.ts"
}, (opts) => diagnoseUrl.__executeServer(opts));
var diagnoseUrl = createServerFn({ method: "POST" }).validator((data) => Input.parse(data)).handler(diagnoseUrl_createServerFn_handler, async ({ data }) => {
	const { diagnose } = await import("./diagnose.server-Td_zBfCZ.mjs");
	return diagnose(data.url);
});
//#endregion
export { diagnoseUrl_createServerFn_handler };
