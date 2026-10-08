// src/policy.ts
import z from "@deepseek-ai/schemastery";
import { ReasoningEffortId } from "@deepseek-ai/dsh-llm";
import { foldRequestHeader } from "@deepseek-ai/dsh-session";
var name = "daily-mode-policy";
var inject = ["permissionPresets", "tools", "systemPrompt", "dailyModeSettings", "agents", "sessionQuery"];
var Config = z.object({ permissionPreset: z.string().default("danger-full-access") });
function parentRoute(header, options) {
  const config = header?.config ?? options;
  if (config?.provider === void 0 || config.model === void 0) throw new Error("Daily mode cannot resolve the parent model for this child");
  const route = header === void 0 ? {
    provider: config.provider,
    model: config.model,
    ...config.reasoningEffort === void 0 ? {} : { reasoningEffort: config.reasoningEffort },
    ...config.maxTokens === void 0 ? {} : { maxTokens: config.maxTokens }
  } : { ...header.config };
  if (header?.adapterDefaults?.maxTokens === true) delete route.maxTokens;
  return route;
}
async function inheritParentRoute(ctx, parentId, signal) {
  const parent = ctx.agents.get(parentId);
  if (parent !== void 0) return parentRoute(parent.session.requestHeader(), parent.options);
  const observation = await ctx.sessionQuery.observeSession(parentId, { signal });
  try {
    return parentRoute(foldRequestHeader(observation.events));
  } finally {
    observation[Symbol.dispose]();
  }
}
function apply(ctx, config) {
  const preset = ctx.permissionPresets.resolve(config.permissionPreset);
  if (preset.sandbox !== "danger-full-access" || preset.approval !== "never") throw new Error("Daily mode requires danger-full-access and approval never");
  ctx.tools.presentAs("native");
  const selections = /* @__PURE__ */ new WeakMap();
  const routes = /* @__PURE__ */ new WeakMap();
  ctx.on("agent/created", async ({ agent }) => {
    ctx.permissionPresets.set(agent.session, config.permissionPreset);
  });
  ctx.on("agent/status", ({ agent, status }) => {
    if (status === "running") selections.set(agent, ctx.dailyModeSettings.current());
    else {
      selections.delete(agent);
      routes.delete(agent);
    }
  });
  ctx.on("system-prompt/assemble", async (_assembly, context, next) => {
    if (context.agent !== void 0) ctx.permissionPresets.set(context.agent.session, config.permissionPreset);
    return next();
  }, true);
  ctx.on("agent/request", async ({ agent, signal }, next) => {
    const proposed = await next();
    const parentId = agent.session.header.parentSession;
    if (parentId === void 0) return proposed;
    const frozen = routes.get(agent);
    if (frozen !== void 0) return frozen;
    const selection = selections.has(agent) ? selections.get(agent) : ctx.dailyModeSettings.current();
    let route;
    if (selection !== null) {
      route = {
        provider: selection.provider,
        model: selection.model,
        ...selection.effort === void 0 ? {} : { reasoningEffort: ReasoningEffortId(selection.effort) }
      };
    } else {
      route = await inheritParentRoute(ctx, parentId, signal);
    }
    routes.set(agent, route);
    return route;
  }, true);
}
export {
  Config,
  apply,
  inject,
  name
};
