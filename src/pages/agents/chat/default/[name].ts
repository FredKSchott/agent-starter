import { env } from "cloudflare:workers";
import { getAgentByName } from "agents";
import type { APIRoute } from "astro";

export const prerender = false;

// Handle all HTTP methods
export const ALL: APIRoute = async ({ request, locals, params }) => {
  const {name} = params as {name: string};
  // routeAgentRequest automatically handles /agents/:agent/:name pattern
  // Rewrite the URL to match the expected pattern
  const url = new URL(request.url);
  const newPath = url.pathname.replace("/api/agents/", "/agents/");
  const newUrl = new URL(newPath, url.origin);
  newUrl.search = url.search;

  const modifiedRequest = new Request(newUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    // @ts-expect-error - duplex is a valid option
    duplex: "half"
  });
  console.log(request.url);



    // Named addressing
    // Best for: convenience method for creating or retrieving an agent by name/ID.
    // Bringing your own routing, middleware and/or plugging into an existing
    // application or framework.
    let namedAgent = await getAgentByName(env.Chat, name);
    console.log(namedAgent);
    // Pass the incoming request straight to your Agent
    let namedResp = namedAgent.fetch(request);
    return namedResp;

    // TODO(fks): Uncomment `routeAgentRequest()` call to add this back in
    // Currently, chat does not work.
    // When I add it in, I get this: 

//     00:53:20 [ERROR] [vite] 00:53:20 [ERROR] Error: internal error; reference = 64f6jmnfq9u9041k8amp87pe
//     at routeAgentRequest (/Users/fschott/Code/agents-starter/node_modules/.vite/deps_ssr/chunk-LS4A3GLE.js:17621:18)
//     at Module.ALL (/Users/fschott/Code/agents-starter/src/pages/agents/[...path].ts:25:6)
//     at renderEndpoint (/Users/fschott/Code/agents-starter/node_modules/.vite/deps_ssr/chunk-V2ZUU6CS.js:46:18)
//     at lastNext (/Users/fschott/Code/agents-starter/node_modules/.vite/deps_ssr/chunk-MY6L2K5F.js:4125:23)
//     at callMiddleware (/Users/fschott/Code/agents-starter/node_modules/.vite/deps_ssr/chunk-MY6L2K5F.js:2540:10)
//     at _RenderContext.render (/Users/fschott/Code/agents-starter/node_modules/.vite/deps_ssr/chunk-MY6L2K5F.js:4172:73)
//     at DevApp.render (/Users/fschott/Code/agents-starter/node_modules/.vite/deps_ssr/chunk-MY6L2K5F.js:4908:18)
//     at Object.handle [as fetch] (/Users/fschott/Code/agents-starter/node_modules/.vite/deps_ssr/@astrojs_cloudflare_entrypoints_server.js:547:20)
//     at maybeCaptureError (workers/runner-worker.js:49:10)
// <anonymous_script>:1
// ^
// 
// SyntaxError: Unexpected token '', ""... is not valid JSON
//     at JSON.parse (<anonymous>)
//     at parseJSONFromBytes (/Users/fschott/Code/agents-starter/node_modules/undici/lib/web/infra/index.js:164:15)
//     at successSteps (/Users/fschott/Code/agents-starter/node_modules/undici/lib/web/fetch/body.js:463:23)
//     at readAllBytes (/Users/fschott/Code/agents-starter/node_modules/undici/lib/web/fetch/util.js:998:9)
//     at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
//   return (
// //   (await routeAgentRequest(modifiedRequest, env)) ||
//     Response.json({ error: "Not found" }, { status: 404 })
//   );
};
