// plugins/dsh-agent-control/src/index.ts
import z from "@deepseek-ai/schemastery";
import { defineTool as defineTool2 } from "@deepseek-ai/dsh-tools";
import { SessionId } from "@deepseek-ai/dsh-session";

// plugins/dsh-agent-control/src/wait.ts
import { defineTool } from "@deepseek-ai/dsh-tools";
function record(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function strings(value) {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) throw new Error("Invalid dsh-agent-control wait metadata");
  return value;
}
function foldConsumption(meta, state) {
  if (!record(meta) || meta.kind !== "dsh-agent-control/wait") return;
  if (meta.version !== 1) throw new Error("Unsupported dsh-agent-control wait metadata version");
  for (const id of strings(meta.message_ids)) state.messages.add(id);
  for (const key of strings(meta.run_keys)) state.runs.add(key);
}
function metadata(value) {
  if (!record(value) || !Array.isArray(value.targets)) throw new Error("Invalid wait result");
  const messageIds = [];
  const runKeys = [];
  for (const target of value.targets) {
    if (!record(target) || !Array.isArray(target.signals)) throw new Error("Invalid wait target result");
    for (const signal of target.signals) {
      if (!record(signal)) throw new Error("Invalid wait signal result");
      if (signal.type === "message") messageIds.push(...strings(signal.message_ids));
      if (signal.type === "settled" && typeof signal.run_key === "string") runKeys.push(signal.run_key);
    }
  }
  return { kind: "dsh-agent-control/wait", version: 1, message_ids: messageIds, run_keys: runKeys };
}
function createWaitTool(ctx, config, children) {
  const disposal = new AbortController();
  ctx.effect(() => () => disposal.abort(new Error("dsh-agent-control unloaded")));
  const runs = /* @__PURE__ */ new Map();
  const states = /* @__PURE__ */ new WeakMap();
  const wake = /* @__PURE__ */ new Set();
  const notify = (id) => {
    for (const listener of wake) listener(id);
  };
  ctx.on("subagent/start", (info) => {
    runs.set(info.id, { start: info });
    notify(info.id);
  });
  ctx.on("subagent/end", (info) => {
    const run = runs.get(info.id);
    if (run?.start.runId === info.runId) run.end = info;
    notify(info.id);
  });
  ctx.on("session/event", (session, event) => {
    if (event.type === "agent/inbox/spliced" || event.type === "turn/end") notify(session.id);
  });
  async function consumption(parent, signal) {
    let pending = states.get(parent);
    if (pending === void 0) {
      pending = (async () => {
        const state = { messages: /* @__PURE__ */ new Set(), runs: /* @__PURE__ */ new Set() };
        const observation = await ctx.sessionQuery.observeSession(parent.id, { signal, projectionMode: "none" });
        try {
          for (const event of observation.events) if (event.type === "tool/result" && !event.data.message.isError) foldConsumption(event.data.meta, state);
        } finally {
          observation[Symbol.dispose]();
        }
        return state;
      })();
      states.set(parent, pending);
      void pending.catch(() => {
        states.delete(parent);
      });
    }
    return pending;
  }
  async function terminal(id, state, signal) {
    const run = runs.get(id);
    if (run !== void 0 && run.end === void 0) return void 0;
    if (ctx.agents.get(id)?.status === "running") return void 0;
    const observation = await ctx.sessionQuery.observeSession(id, { signal, projectionMode: "all" });
    try {
      const inbox = observation.projections?.values.inbox;
      if (!record(inbox) || !Array.isArray(inbox["next-turn"]) || !Array.isArray(inbox["next-step"])) {
        throw new Error(`Inbox projection is unavailable for child ${id}`);
      }
      if (inbox["next-turn"].length > 0 || inbox["next-step"].length > 0) return void 0;
      const boundary = observation.events.findLast((event) => event.type === "turn/start" || event.type === "turn/end");
      if (boundary?.type !== "turn/end") return void 0;
      const key = `${id}:${boundary.seq}`;
      if (state.runs.has(key)) return void 0;
      if (runs.get(id) !== run || ctx.agents.get(id)?.status === "running") return void 0;
      return { type: "settled", run_key: key, stop_reason: run?.end?.stopReason ?? boundary.data.reason.kind };
    } finally {
      observation[Symbol.dispose]();
    }
  }
  const tool = defineTool({
    name: "wait_agent",
    description: "Wait for selected children to send new messages or settle their runs. OR returns when any target qualifies; AND records qualifying targets until all qualify. Waiting suspends your sampling while children continue. Timeout returns satisfied and pending targets. New messages are delivered to your next step.",
    parameters: {
      agent_ids: { type: "array", required: true, description: "One or more distinct direct child IDs.", items: { type: "string" } },
      mode: { type: "string", enum: ["or", "and"], description: "or (default): any target; and: every target." },
      wake_on: { type: "array", description: "Signals per target; defaults to both. Any selected signal qualifies that target.", items: { type: "string", enum: ["message", "settled"] } },
      timeout_minutes: { type: "number", description: `Timeout in minutes: ${config.minTimeoutMinutes}\u2013${config.maxTimeoutMinutes}, defaults to ${config.defaultTimeoutMinutes}. Signals return immediately.` }
    },
    output: { schema: { type: "json" }, render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }], presentationMeta: (_args, value) => metadata(value) },
    isConcurrencySafe: () => false,
    async execute(args, execution) {
      const parent = execution.agent;
      if (parent === void 0) throw new Error("wait_agent requires a parent Agent");
      const minutes = args.timeout_minutes ?? config.defaultTimeoutMinutes;
      if (!Number.isFinite(minutes) || minutes < config.minTimeoutMinutes || minutes > config.maxTimeoutMinutes) {
        throw new Error(`timeout_minutes must be between ${config.minTimeoutMinutes} and ${config.maxTimeoutMinutes}`);
      }
      const signal = AbortSignal.any([execution.signal, disposal.signal]);
      signal.throwIfAborted();
      const selected = await children(parent, args.agent_ids, signal);
      const state = await consumption(parent, signal);
      const wanted = new Set(args.wake_on ?? ["message", "settled"]);
      if (wanted.size === 0) throw new Error("wake_on must select a signal");
      const mode = args.mode ?? "or";
      const targets = new Map([...selected].map(([id, label]) => [id, { agent_id: id, label, satisfied: false, signals: [] }]));
      let dirty = true;
      let timedOut = false;
      let pulse;
      const notifyWait = (id) => {
        if (id !== parent.id && !selected.has(id)) return;
        dirty = true;
        pulse?.();
      };
      wake.add(notifyWait);
      const timer = setTimeout(() => {
        timedOut = true;
        pulse?.();
      }, minutes * 6e4);
      const abort = () => {
        pulse?.();
      };
      signal.addEventListener("abort", abort, { once: true });
      try {
        while (true) {
          signal.throwIfAborted();
          dirty = false;
          const pendingMessages = [...parent.inbox.nextTurn, ...parent.inbox.nextStep];
          await Promise.all([...targets].map(async ([id, target]) => {
            if (target.satisfied) return;
            if (wanted.has("message")) {
              const messages = pendingMessages.filter((message) => message.source.kind === "agent-message" && message.source.senderSessionId === id && !state.messages.has(message.id));
              if (messages.length > 0) target.signals.push({ type: "message", message_ids: messages.map((message) => message.id) });
            }
            if (wanted.has("settled") && target.signals.length === 0) {
              const settled = await terminal(id, state, signal);
              if (settled !== void 0) target.signals.push(settled);
            }
            target.satisfied = target.signals.length > 0;
          }));
          signal.throwIfAborted();
          const rows = [...targets.values()];
          const satisfied = mode === "and" ? rows.every((target) => target.satisfied) : rows.some((target) => target.satisfied);
          if (satisfied || timedOut) {
            const value = { reason: satisfied ? "signal" : "timeout", targets: rows, pending: rows.filter((target) => !target.satisfied).map((target) => target.agent_id) };
            foldConsumption(metadata(value), state);
            return value;
          }
          if (dirty) continue;
          await new Promise((resolve) => {
            pulse = resolve;
            if (dirty || timedOut || signal.aborted) resolve();
          });
          pulse = void 0;
        }
      } finally {
        clearTimeout(timer);
        signal.removeEventListener("abort", abort);
        wake.delete(notifyWait);
      }
    }
  });
  return { tool, forget: (id) => {
    runs.delete(id);
  } };
}

// plugins/dsh-agent-control/src/index.ts
var name = "agent-control";
var inject = ["tools", "subagents", "agents", "sessions", "sessionQuery", "workspaceRegistry"];
var Config = z.object({
  minTimeoutMinutes: z.number().min(0).default(10),
  defaultTimeoutMinutes: z.number().min(0).default(10),
  maxTimeoutMinutes: z.number().min(0).default(60),
  hideArchived: z.boolean().default(true)
});
function apply(ctx, config) {
  const limits = [config.minTimeoutMinutes, config.defaultTimeoutMinutes, config.maxTimeoutMinutes];
  if (limits.some((value) => !Number.isFinite(value) || value <= 0) || config.minTimeoutMinutes > config.defaultTimeoutMinutes || config.defaultTimeoutMinutes > config.maxTimeoutMinutes || config.maxTimeoutMinutes * 6e4 > 2147483647) throw new Error("Invalid agent-control wait duration configuration");
  const waiter = createWaitTool(ctx, config, children);
  ctx.tools.register(waiter.tool);
  async function children(parent, ids, signal, allowArchived = false) {
    if (ids.length === 0 || new Set(ids).size !== ids.length) throw new Error("Select one or more distinct child IDs");
    const catalog = await ctx.subagents.listChildren(parent.id, signal);
    const result = /* @__PURE__ */ new Map();
    for (const raw of ids) {
      const id = SessionId(raw);
      const child = catalog.find((entry) => entry.id === id);
      if (child === void 0 || "kind" in child && child.kind === "diagnostic" || child.mode !== "continuable") {
        throw new Error(`Not an available direct continuable child: ${raw}`);
      }
      if (!allowArchived && ctx.workspaceRegistry.archivedSessionIds.includes(id)) throw new Error(`Child is archived: ${raw}`);
      result.set(id, child.label);
    }
    return result;
  }
  ctx.tools.register(defineTool2({
    name: "archive_agent",
    description: "Stop and archive your child agent, releasing its live runtime while preserving its session history.",
    parameters: {
      agent_id: { type: "string", required: true, description: "A direct continuable child ID." },
      reason: { type: "string", description: "Optional short reason recorded with this call." }
    },
    output: { schema: { type: "json" }, render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }] },
    isConcurrencySafe: () => false,
    async execute(args, execution) {
      const parent = execution.agent;
      if (parent === void 0) throw new Error("archive_agent requires a parent Agent");
      const selected = await children(parent, [args.agent_id], execution.signal, true);
      const id = SessionId(args.agent_id);
      execution.signal.throwIfAborted();
      await ctx.workspaceRegistry.archiveSession(id, { stopActivity: true });
      await ctx.subagents.drainContinuableChildren(parent, [id]);
      waiter.forget(id);
      return { agent_id: id, label: selected.get(id), archived: true };
    }
  }));
  ctx.tools.register(defineTool2({
    name: "list_agents",
    description: "List your continuable children with their IDs, nicknames, and current activity. Inactive does not mean successful completion.",
    parameters: {
      scope: { type: "string", enum: ["children", "descendants"], description: "children (default): direct children; descendants: the full tree with parent and depth." }
    },
    output: { schema: { type: "json" }, render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }] },
    isConcurrencySafe: () => true,
    async execute(args, execution) {
      const parent = execution.agent;
      if (parent === void 0) throw new Error("list_agents requires an Agent");
      const descendants = args.scope === "descendants";
      const catalog = descendants ? await ctx.subagents.listDescendants(parent.id, execution.signal) : await ctx.subagents.listChildren(parent.id, execution.signal);
      const archived = new Set(ctx.workspaceRegistry.archivedSessionIds);
      const result = [];
      for (const entry of catalog) {
        if (config.hideArchived && archived.has(entry.id)) continue;
        const position = {};
        if ("parentId" in entry) {
          position.parent = entry.parentId;
          position.depth = entry.depth;
        }
        if ("kind" in entry && entry.kind === "diagnostic") {
          result.push({ kind: "diagnostic", id: entry.id, reason: entry.reason, ...position });
          continue;
        }
        if (entry.mode !== "continuable") continue;
        result.push({ kind: "child", id: entry.id, label: entry.label, status: ctx.agents.get(entry.id)?.status === "running" ? "running" : "inactive", ...position });
      }
      return result;
    }
  }));
}
export {
  Config,
  apply,
  inject,
  name
};
