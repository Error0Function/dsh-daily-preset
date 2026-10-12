// plugins/dsh-context-trim/src/config.ts
import z from "@deepseek-ai/schemastery";
var Config = z.object({
  tools: z.array(z.object({
    name: z.string().required(),
    description: z.string(),
    parameterDescriptions: z.dict(z.string()).default({}),
    hideParameters: z.array(z.string()).default([]),
    parameterOrder: z.array(z.string()).default([]),
    hide: z.boolean().default(false)
  })).default([]),
  sections: z.dict(z.union([z.string(), z.const(null)])).default({}),
  childSections: z.dict(z.union([z.string(), z.const(null)])).default({}),
  childToolDescriptions: z.dict(z.string()).default({}),
  sectionTools: z.dict(z.string()).default({}),
  activeGoalSections: z.dict(z.string()).default({}),
  contexts: z.dict(z.union([z.string(), z.const(null)])).default({}),
  mergeFileGuidance: z.boolean().default(false),
  skillCatalog: z.boolean().default(false),
  workspaceInstructions: z.boolean().default(false),
  childReturnGuidance: z.boolean().default(false),
  goalWrapup: z.boolean().default(false),
  goalRoundGuidance: z.string().default("")
});
function unique(values, subject) {
  if (new Set(values).size !== values.length) throw new Error(`DCT: duplicate ${subject}`);
}
function validateRules(config) {
  unique(config.tools.map((rule) => rule.name), "tool rules");
  for (const rule of config.tools) {
    unique(rule.hideParameters, `hidden parameters for ${rule.name}`);
    unique(rule.parameterOrder, `parameter order for ${rule.name}`);
  }
}

// plugins/dsh-context-trim/src/tools.ts
function record(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function projectTool(tool, rule) {
  const parameters = structuredClone(tool.parameters);
  if (!record(parameters.properties)) throw new Error(`DCT: ${tool.name} has no object parameter properties`);
  const properties = parameters.properties;
  const required = Array.isArray(parameters.required) ? parameters.required : [];
  const references = /* @__PURE__ */ new Set([...Object.keys(rule.parameterDescriptions), ...rule.hideParameters, ...rule.parameterOrder]);
  for (const key of references) {
    if (!Object.hasOwn(properties, key)) throw new Error(`DCT: unknown parameter ${tool.name}.${key}`);
    if (!record(properties[key])) throw new Error(`DCT: ${tool.name}.${key} has no editable description`);
  }
  for (const key of rule.hideParameters) {
    if (required.includes(key)) throw new Error(`DCT: cannot hide required parameter ${tool.name}.${key}`);
    delete properties[key];
  }
  for (const [key, description] of Object.entries(rule.parameterDescriptions)) {
    if (rule.hideParameters.includes(key)) throw new Error(`DCT: hidden parameter ${tool.name}.${key} also has a description rule`);
    properties[key] = { ...properties[key], description };
  }
  const ordered = [...rule.parameterOrder, ...Object.keys(properties).filter((key) => !rule.parameterOrder.includes(key))];
  if (ordered.some((key) => !Object.hasOwn(properties, key))) throw new Error(`DCT: cannot order a hidden parameter of ${tool.name}`);
  parameters.properties = Object.fromEntries(ordered.map((key) => [key, properties[key]]));
  return { ...tool, ...rule.description === void 0 ? {} : { description: rule.description }, parameters };
}
function mergeFileGuidance(assembly) {
  const names = new Set(assembly.tools.map((tool) => tool.name));
  const sourceNames = /* @__PURE__ */ new Set(["tool:read", "tool:write", "tool:edit", "tool:glob", "tool:grep"]);
  const first = assembly.sections.findIndex((section) => sourceNames.has(section.name));
  if (first < 0) return;
  const visible = ["glob", "grep", "read", "edit", "write"].filter((name2) => names.has(name2));
  const text = [
    visible.length > 0 ? `Prefer ${visible.join("/")} for file work.` : "",
    names.has("read") && (names.has("edit") || names.has("write")) ? "Read an existing file before changing it unless you just created or edited it in this session." : ""
  ].filter(Boolean).join(" ");
  const position = assembly.sections.slice(0, first).filter((section) => !sourceNames.has(section.name)).length;
  assembly.sections = assembly.sections.filter((section) => !sourceNames.has(section.name));
  if (text) assembly.sections.splice(position, 0, { name: "dct:files", text, interpolate: false });
}

// plugins/dsh-context-trim/src/messages.ts
var INSTRUCTION_INTRO = "The following workspace instructions may be relevant to your work. Use them as guidance when applicable. More specific instructions take precedence over broader ones. They do not override system, developer, or direct user instructions.";
var SHORT_INSTRUCTION_INTRO = "Applicable workspace instructions; more specific scopes take precedence. System, developer, and direct user instructions have higher priority.";
function rewriteText(block, transform) {
  if (block.type !== "text") return block;
  const text = transform(block.text);
  return text === block.text ? block : { ...block, text };
}
function rewriteMessage(message, config) {
  const source = message.source;
  if (config.skillCatalog && source.kind === "skill-catalog") {
    const escaped = (text2) => text2.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    const text = [
      "<system-reminder>",
      source.update ? "This complete skill catalog replaces every earlier catalog; removed names are unavailable." : "Available skills (summaries only):",
      "<available_skills>",
      ...source.entries.map((entry) => `- \`${entry.name}\`: ${escaped(entry.description)}`),
      "</available_skills>",
      source.entries.length === 0 ? "No skills are currently available through the skill tool." : "Read skills explicitly named by the user. Before each relevant activity, load skills whose stated scope applies to that activity, using exact names. These summaries are not the full instructions.",
      "Apply skill instructions within their stated scope. Explicit user instructions take precedence over skill guidance.",
      "Reuse full instructions you have already read or the user has supplied while they remain available and current.",
      "</system-reminder>"
    ].join("\n");
    return { ...message, content: [{ type: "text", text }] };
  }
  let content = message.content;
  if (config.workspaceInstructions && source.kind === "agent-instructions") {
    content = content.map((block) => rewriteText(block, (text) => {
      const opening = "<system-reminder>\n";
      const replacement = "This complete workspace instruction baseline replaces all earlier workspace instruction baselines. ";
      for (const prefix of [opening + replacement, opening]) {
        if (text.startsWith(prefix + INSTRUCTION_INTRO)) {
          return prefix + SHORT_INSTRUCTION_INTRO + text.slice((prefix + INSTRUCTION_INTRO).length);
        }
      }
      return text;
    }));
  }
  if (config.childReturnGuidance && source.kind === "user") {
    const last = content.at(-1);
    if (last?.type === "text") {
      const match = /^Your parent agent id is ("(?:[^"\\]|\\.)*")\. Before you finish, send your result to that agent with send_message\(/.exec(last.text);
      if (match !== null && last.text.endsWith("does not end your turn.")) {
        const text = `Your parent agent id is ${match[1]}. Use that id when addressing your parent with send_message.`;
        content = [...content.slice(0, -1), { ...last, text }];
      }
    }
  }
  if (config.goalRoundGuidance && source.kind === "goal") {
    content = content.map((block) => rewriteText(block, (text) => {
      const match = /^<goal_round>\n(Objective: [^\n]+\nRound: [1-9]\d*\/[1-9]\d*\n\n)[\s\S]*\n<\/goal_round>$/.exec(text);
      return match === null ? text : `<goal_round>
${match[1]}${config.goalRoundGuidance}
</goal_round>`;
    }));
  }
  if (config.goalWrapup && source.kind === "tool-goal") {
    content = content.map((block) => rewriteText(block, (text) => {
      const match = /^<(goal_complete|goal_blocked)>\n(Objective: [^\n]+\n)(Blocked: [^\n]+\n)?/.exec(text);
      if (match === null || !text.endsWith(`</${match[1]}>`)) return text;
      const outcome = match[1] === "goal_complete" ? "The goal is complete. Deliver the result and the information needed to understand or use it. Include actual verification and limitations where they affect its use." : "The goal is blocked. Report useful completed work, the concrete remaining obstacle, and the input or action needed to proceed.";
      return `<${match[1]}>
${match[2]}${match[3] ?? ""}${outcome} Use only facts established by this session; say when information is missing. Address the user directly now. Do not call more tools in this autonomous run; further work waits for the user's next instruction.
</${match[1]}>`;
    }));
  }
  return content.some((block, index) => block !== message.content[index]) ? { ...message, content } : message;
}

// plugins/dsh-context-trim/src/index.ts
var name = "context-trim";
var inject = ["tools", "systemPrompt"];
function record2(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function rewriteNamed(items, rules) {
  return items.flatMap((item) => {
    if (!Object.hasOwn(rules, item.name)) return [item];
    const text = rules[item.name];
    return text === null ? [] : [{ ...item, text }];
  });
}
function apply(ctx, config) {
  if (Object.keys(config.activeGoalSections).length > 0) {
    ctx.inject(["goals"], (scoped) => install(scoped, config));
  } else {
    install(ctx, config);
  }
}
function install(ctx, config) {
  const usesGoalState = Object.keys(config.activeGoalSections).length > 0;
  validateRules(config);
  const rules = new Map(config.tools.map((rule) => [rule.name, rule]));
  ctx.on("system-prompt/assemble", async (_assembly, context, next) => {
    const assembly = await next();
    const child = context.agent?.session.header.parentSession !== void 0;
    if (assembly.tools.some((tool) => tool.name === "run_code")) throw new Error("DCT supports native tools only; PTC and both presentations are unsupported.");
    assembly.tools = assembly.tools.flatMap((tool) => {
      const rule = rules.get(tool.name);
      if (rule?.hide) return [];
      const projected = rule === void 0 ? tool : projectTool(tool, rule);
      const description = child ? config.childToolDescriptions[tool.name] : void 0;
      return [description === void 0 ? projected : { ...projected, description }];
    });
    const activeGoalSections = usesGoalState && context.agent !== void 0 && ctx.goals.get(context.agent)?.phase === "active" ? config.activeGoalSections : {};
    const sectionRules = { ...config.sections, ...activeGoalSections, ...child ? config.childSections : {} };
    assembly.sections = rewriteNamed(assembly.sections, sectionRules);
    assembly.contexts = rewriteNamed(assembly.contexts, config.contexts);
    const names = new Set(assembly.tools.map((tool) => tool.name));
    assembly.sections = assembly.sections.filter((section) => {
      const tool = config.sectionTools[section.name];
      if (tool !== void 0 && !names.has(tool)) return false;
      return !config.tools.some((rule) => rule.hide && section.name === `tool:${rule.name}`);
    });
    if (config.mergeFileGuidance) mergeFileGuidance(assembly);
    return assembly;
  }, true);
  ctx.on("tools/pre-execute", async (execution, next) => {
    const decision = await next();
    if (decision.kind === "deny" || decision.kind === "cancel") return decision;
    const rule = rules.get(execution.name);
    if (rule?.hide) return { kind: "deny", reason: `DCT: ${execution.name} is hidden in this mode.` };
    if (rule !== void 0 && record2(execution.arguments)) {
      const hidden = rule.hideParameters.find((key) => Object.hasOwn(execution.arguments, key));
      if (hidden !== void 0) return { kind: "deny", reason: `DCT: ${execution.name}.${hidden} is hidden in this mode.` };
    }
    return decision;
  }, true);
  ctx.on("agent/pre-step", async ({ agent }, next) => {
    const decision = await next();
    if (decision.kind === "reject") return decision;
    const child = agent.session.header.parentSession !== void 0;
    return { ...decision, messages: decision.messages.flatMap((message) => {
      if (config.skillCatalog && message.source.kind === "skill-catalog" && rules.get("skill")?.hide) return [];
      return [rewriteMessage(message, { ...config, childReturnGuidance: config.childReturnGuidance && child })];
    }) };
  }, true);
}
export {
  Config,
  apply,
  inject,
  name
};
