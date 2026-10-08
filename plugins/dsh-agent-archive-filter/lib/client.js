window.__ModuleLoader__.load({id:"dsh-agent-archive-filter",factory:(require)=>{var module={exports:{}};var exports=module.exports;var ARCHIVE_LINEAGE_CSS="/* ../../../../../Program-Files-Portable/deepseek-harness/packages/client/ui-subagent/src/client/SubagentHeaderLineage.module.css */\n.SubagentHeaderLineage_root {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n.SubagentHeaderLineage_switcherRoot {\n  min-width: 0;\n  margin-left: 6px;\n}\n.SubagentHeaderLineage_trigger,\n.SubagentHeaderLineage_switcherTrigger {\n  display: inline-flex;\n  align-items: center;\n  min-height: 28px;\n  padding: 3px 2px;\n  border: 0;\n  border-radius: var(--dsw-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 12px;\n  line-height: 18px;\n  cursor: pointer;\n}\n.SubagentHeaderLineage_trigger {\n  gap: 4px;\n}\n.SubagentHeaderLineage_switcherTrigger {\n  gap: 4px;\n  min-width: 0;\n  max-width: 244px;\n  color: var(--dsw-alias-label-primary);\n  font-weight: 500;\n}\n.SubagentHeaderLineage_ancestorSwitcherTrigger {\n  color: var(--dsw-alias-label-tertiary);\n  font-weight: 400;\n}\n.SubagentHeaderLineage_switcherTitle {\n  flex: 1;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.SubagentHeaderLineage_switcherTrigger svg {\n  flex: none;\n}\n.SubagentHeaderLineage_activitySlot {\n  display: inline-flex;\n  flex: none;\n  align-items: center;\n  justify-content: center;\n  width: 14px;\n  height: 14px;\n}\n.SubagentHeaderLineage_trigger:hover,\n.SubagentHeaderLineage_trigger:focus-visible {\n  color: var(--dsw-alias-label-primary);\n}\n.SubagentHeaderLineage_switcherTrigger:hover,\n.SubagentHeaderLineage_switcherTrigger:focus-visible {\n  color: var(--dsw-alias-label-primary);\n}\n.SubagentHeaderLineage_ancestorSwitcherTrigger:hover,\n.SubagentHeaderLineage_ancestorSwitcherTrigger:focus-visible {\n  color: var(--dsw-alias-label-tertiary);\n}\n.SubagentHeaderLineage_trigger svg,\n.SubagentHeaderLineage_switcherTrigger svg {\n  transition: transform 120ms ease;\n}\n.SubagentHeaderLineage_triggerOpen {\n  transform: rotate(180deg);\n}\n.SubagentHeaderLineage_menu {\n  position: fixed;\n  z-index: 100;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  width: 336px;\n  max-width: min(400px, calc(100vw - 32px));\n  max-height: min(560px, calc(100vh - 140px));\n  padding: 3px;\n  overflow: hidden;\n  border-radius: var(--dsw-radius-lg);\n  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);\n  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);\n  --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);\n  box-shadow: var(--dsw-elevation-prominent);\n}\n.SubagentHeaderLineage_menu::before {\n  content: \"\";\n  position: absolute;\n  z-index: -1;\n  inset: 0;\n  border-radius: inherit;\n  background: var(--dsw-specific-menu);\n  backdrop-filter: var(--dsw-menu-backdrop-filter);\n}\n.SubagentHeaderLineage_menuBody {\n  display: flex;\n  flex-direction: column;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n}\n.SubagentHeaderLineage_node {\n  position: relative;\n  min-width: 0;\n}\n.SubagentHeaderLineage_menuBody > .SubagentHeaderLineage_node {\n  margin-left: -2px;\n}\n.SubagentHeaderLineage_row {\n  position: relative;\n  display: flex;\n  align-items: flex-start;\n  gap: 6px;\n  box-sizing: border-box;\n  width: 100%;\n  min-height: 44px;\n  padding: 6px 7px 6px 9px;\n  border: 0;\n  border-radius: var(--dsw-radius-lg);\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  font-size: 12px;\n  line-height: 17px;\n  text-align: left;\n  cursor: pointer;\n  outline: none;\n}\n.SubagentHeaderLineage_row:hover > .SubagentHeaderLineage_clickarea,\n.SubagentHeaderLineage_row:focus-visible > .SubagentHeaderLineage_clickarea {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n.SubagentHeaderLineage_clickarea {\n  box-sizing: border-box;\n  display: flex;\n  flex: 1;\n  align-self: stretch;\n  align-items: flex-start;\n  gap: 6px;\n  min-width: 0;\n  margin: -6px -7px -6px;\n  padding: 6px 7px;\n  border-radius: var(--dsw-radius-lg);\n}\n.SubagentHeaderLineage_rowActivitySlot {\n  display: inline-flex;\n  flex: none;\n  align-items: center;\n  justify-content: center;\n  width: 14px;\n  height: 17px;\n}\n.SubagentHeaderLineage_disclosure,\n.SubagentHeaderLineage_disclosureSpace {\n  flex: none;\n  width: 14px;\n  height: 17px;\n}\n.SubagentHeaderLineage_disclosure {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n  transition: transform 120ms ease;\n}\n.SubagentHeaderLineage_disclosure svg {\n  width: 12px;\n  height: 12px;\n}\n.SubagentHeaderLineage_disclosure:hover {\n  color: var(--dsw-alias-label-primary);\n}\n.SubagentHeaderLineage_disclosureOpen {\n  transform: rotate(90deg);\n}\n.SubagentHeaderLineage_content {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  min-width: 0;\n}\n.SubagentHeaderLineage_label,\n.SubagentHeaderLineage_summary {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.SubagentHeaderLineage_label {\n  color: inherit;\n  font-weight: 400;\n}\n.SubagentHeaderLineage_currentLabel {\n  font-weight: 600;\n}\n.SubagentHeaderLineage_summary,\n.SubagentHeaderLineage_metrics {\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 10px;\n  line-height: 15px;\n}\n.SubagentHeaderLineage_metrics {\n  display: grid;\n  grid-template-rows: 17px 15px;\n  flex: none;\n  font-variant-numeric: tabular-nums;\n  text-align: right;\n  white-space: nowrap;\n}\n.SubagentHeaderLineage_metricToken {\n  grid-row: 1;\n  line-height: 17px;\n}\n.SubagentHeaderLineage_metricDuration {\n  grid-row: 2;\n}\n.SubagentHeaderLineage_sidebarButton {\n  display: inline-flex;\n  flex: none;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  margin: 4px 0;\n  padding: 6px;\n  border: 0;\n  border-radius: var(--dsw-radius-sm);\n  background: transparent;\n  color: var(--dsw-alias-label-tertiary);\n  cursor: pointer;\n}\n.SubagentHeaderLineage_sidebarButton:hover,\n.SubagentHeaderLineage_sidebarButton:focus-visible {\n  background: var(--dsw-alias-interactive-bg-hover);\n  color: var(--dsw-alias-label-primary);\n}\n.SubagentHeaderLineage_children {\n  position: relative;\n  margin-left: 16px;\n  padding-left: 3px;\n}\n.SubagentHeaderLineage_children::before,\n.SubagentHeaderLineage_children > .SubagentHeaderLineage_node::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  border-left: 0.5px solid var(--dsw-alias-border-l2);\n}\n.SubagentHeaderLineage_children::before {\n  top: -23px;\n  height: 23px;\n}\n.SubagentHeaderLineage_children[aria-busy=true]::before {\n  content: none;\n}\n.SubagentHeaderLineage_children > .SubagentHeaderLineage_node::before {\n  top: 0;\n  bottom: 0;\n  left: -3px;\n}\n.SubagentHeaderLineage_children > .SubagentHeaderLineage_node:last-child::before {\n  bottom: auto;\n  height: 15px;\n}\n.SubagentHeaderLineage_children > .SubagentHeaderLineage_node > .SubagentHeaderLineage_row::before {\n  content: \"\";\n  position: absolute;\n  top: 14px;\n  left: -3px;\n  width: 12px;\n  border-top: 0.5px solid var(--dsw-alias-border-l2);\n}\n.SubagentHeaderLineage_notice,\n.SubagentHeaderLineage_error {\n  padding: 8px 10px;\n  color: var(--dsw-alias-label-tertiary);\n  font-size: 11px;\n  line-height: 16px;\n}\n.SubagentHeaderLineage_error {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  color: var(--dsw-alias-state-error-primary);\n}\n.SubagentHeaderLineage_refresh {\n  display: inline-flex;\n  flex: none;\n  align-items: center;\n  gap: 3px;\n  padding: 3px 5px;\n  border: 0;\n  border-radius: var(--dsw-radius-sm);\n  background: transparent;\n  color: inherit;\n  cursor: pointer;\n}\n.SubagentHeaderLineage_refresh svg {\n  width: 12px;\n  height: 12px;\n}\n.SubagentHeaderLineage_refresh:hover {\n  background: var(--dsw-alias-interactive-bg-hover);\n}\n";
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// plugins/dsh-agent-archive-filter/src/client.tsx
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(client_exports);
var import_react3 = require("react");

// ../../../../../Program-Files-Portable/deepseek-harness/packages/client/ui-subagent/src/client/SubagentHeaderLineage.tsx
var import_react = require("react");
var import_react_dom = require("react-dom");
var import_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");

// ../../../../../Program-Files-Portable/deepseek-harness/packages/client/ui-subagent/src/client/SubagentHeaderLineage.module.css
var SubagentHeaderLineage_default = {
  root: "SubagentHeaderLineage_root",
  switcherRoot: "SubagentHeaderLineage_switcherRoot",
  trigger: "SubagentHeaderLineage_trigger",
  switcherTrigger: "SubagentHeaderLineage_switcherTrigger",
  ancestorSwitcherTrigger: "SubagentHeaderLineage_ancestorSwitcherTrigger",
  switcherTitle: "SubagentHeaderLineage_switcherTitle",
  activitySlot: "SubagentHeaderLineage_activitySlot",
  triggerOpen: "SubagentHeaderLineage_triggerOpen",
  menu: "SubagentHeaderLineage_menu",
  menuBody: "SubagentHeaderLineage_menuBody",
  node: "SubagentHeaderLineage_node",
  row: "SubagentHeaderLineage_row",
  clickarea: "SubagentHeaderLineage_clickarea",
  rowActivitySlot: "SubagentHeaderLineage_rowActivitySlot",
  disclosure: "SubagentHeaderLineage_disclosure",
  disclosureSpace: "SubagentHeaderLineage_disclosureSpace",
  disclosureOpen: "SubagentHeaderLineage_disclosureOpen",
  content: "SubagentHeaderLineage_content",
  label: "SubagentHeaderLineage_label",
  summary: "SubagentHeaderLineage_summary",
  currentLabel: "SubagentHeaderLineage_currentLabel",
  metrics: "SubagentHeaderLineage_metrics",
  metricToken: "SubagentHeaderLineage_metricToken",
  metricDuration: "SubagentHeaderLineage_metricDuration",
  sidebarButton: "SubagentHeaderLineage_sidebarButton",
  children: "SubagentHeaderLineage_children",
  notice: "SubagentHeaderLineage_notice",
  error: "SubagentHeaderLineage_error",
  refresh: "SubagentHeaderLineage_refresh"
};

// ../../../../../Program-Files-Portable/deepseek-harness/packages/client/ui-subagent/src/client/SubagentHeaderLineage.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function treeItems(root) {
  return root === null ? [] : Array.from(root.querySelectorAll('[role="treeitem"]:not([aria-disabled="true"])'));
}
function formatTokens(value, t) {
  const scaled = (next) => next >= 100 ? String(Math.round(next)) : String(Math.round(next * 10) / 10);
  if (value < 1e3) return String(value);
  if (value < 1e6) return t("tokens.thousand", { value: scaled(value / 1e3) });
  return t("tokens.million", { value: scaled(value / 1e6) });
}
function tokenTotal(usage) {
  return usage === void 0 ? void 0 : usage.uncachedInputTokens + usage.outputTokens + usage.cacheReadTokens + usage.cacheWriteTokens;
}
function activityDuration(summary, activity, now) {
  if (summary === void 0) return void 0;
  const timing = summary.projectionValues?.subagentTiming;
  if (timing === void 0) return void 0;
  if (timing.active === void 0) return timing.settledMs;
  const end = activity === "running" ? now : timing.active.through;
  return timing.settledMs + Math.max(0, end - timing.active.since);
}
function splitDuration(ms) {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1e3);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  return {
    seconds: totalSeconds % 60,
    minutes: totalMinutes % 60,
    hours: totalHours % 24,
    days: Math.floor(totalHours / 24),
    totalMinutes,
    totalHours
  };
}
function formatDuration(ms, t) {
  const { seconds, minutes, hours, days, totalMinutes, totalHours } = splitDuration(ms);
  if (days >= 365) {
    const years = Math.floor(days / 365);
    const months = Math.floor(days % 365 / 30);
    return months === 0 ? t("duration.years", { years }) : t("duration.yearsMonths", { years, months });
  }
  if (days >= 30) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return remainingDays === 0 ? t("duration.months", { months }) : t("duration.monthsDays", { months, days: remainingDays });
  }
  if (days > 0) {
    return hours === 0 ? t("duration.days", { days }) : t("duration.daysHours", { days, hours });
  }
  if (totalHours > 0) {
    return t("duration.hours", {
      hours: totalHours,
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0")
    });
  }
  if (totalMinutes > 0) {
    return t("duration.minutes", {
      minutes: totalMinutes,
      seconds: String(seconds).padStart(2, "0")
    });
  }
  return t("duration.seconds", { seconds });
}
function formatExactDuration(ms, t) {
  const { seconds, minutes, hours, days } = splitDuration(ms);
  return days === 0 ? formatDuration(ms, t) : t("duration.exactDays", {
    days,
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0")
  });
}
function SubagentSwitcherIcon() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "svg",
    {
      width: "16",
      height: "16",
      viewBox: "0 0 20 20",
      fill: "none",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            d: "M5.99951 12.7L8.95546 14.9478C9.40011 15.2859 9.62244 15.455 9.87526 15.488C9.95774 15.4988 10.0413 15.4988 10.1238 15.488C10.3766 15.455 10.5989 15.2859 11.0436 14.9478L13.9995 12.7",
            stroke: "currentColor",
            strokeWidth: "1.5"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "path",
          {
            d: "M13.9995 7.7417L11.0436 5.49387C10.5989 5.15574 10.3766 4.98668 10.1238 4.95362C10.0413 4.94283 9.95775 4.94283 9.87527 4.95362C9.62245 4.98668 9.40012 5.15574 8.95547 5.49387L5.99952 7.7417",
            stroke: "currentColor",
            strokeWidth: "1.5"
          }
        )
      ]
    }
  );
}
function CatalogLoadingRows({ t }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: SubagentHeaderLineage_default.notice, children: t("loading.label") });
}
function isKnownLeaf(catalog) {
  return catalog?.state === "ready" && catalog.entries.length === 0;
}
function CatalogRows({
  parentSessionId,
  currentSessionId,
  catalog,
  catalogs,
  summaries,
  expanded,
  level,
  openChild,
  openChildAside,
  refreshProjection,
  toggleBranch,
  closeCatalog,
  t
}) {
  const [now, setNow] = (0, import_react.useState)(() => Date.now());
  const running = catalog.entries.some((entry) => entry.activity === "running");
  (0, import_react.useEffect)(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1e3);
    return () => {
      clearInterval(timer);
    };
  }, [running]);
  const emptyLoading = catalog.state === "loading" && catalog.entries.length === 0;
  const reserveDisclosure = catalog.entries.some((entry) => !isKnownLeaf(catalogs[entry.id]));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    emptyLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogLoadingRows, { t }),
    catalog.state === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: SubagentHeaderLineage_default.error, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: catalog.error?.message ?? t("load.error") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        "button",
        {
          type: "button",
          className: SubagentHeaderLineage_default.refresh,
          onClick: () => {
            refreshProjection(parentSessionId);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconRefreshOutlineRegular, { size: 14 }),
            t("retry")
          ]
        }
      )
    ] }),
    catalog.entries.map((entry) => {
      const childCatalog = catalogs[entry.id];
      const isCurrent = entry.id === currentSessionId;
      const isExpanded = expanded.has(entry.id);
      const knownLeaf = isKnownLeaf(childCatalog);
      const childLoading = childCatalog === void 0 || childCatalog.state === "loading" && childCatalog.entries.length === 0;
      const summary = summaries[entry.id];
      const label = entry.label ?? entry.id;
      const mode = entry.mode === "unknown" ? t("mode.unknown") : entry.mode === "one-shot" ? t("mode.oneShot") : t("mode.continuable");
      const completed = entry.activity === "inactive" && summary?.projectionValues?.subagentTiming?.lastTurnCompleted === true;
      const activity = entry.activity === "running" ? t("activity.running") : completed ? t("activity.completed") : t("activity.inactive");
      const secondary = [summary?.title, mode, activity].filter((value) => value !== void 0).join(" \xB7 ");
      const totalTokens = tokenTotal(summary?.projectionValues?.tokenUsage);
      const durationMs = activityDuration(
        summary,
        entry.activity,
        now
      );
      const tokenMetric = totalTokens === void 0 ? void 0 : t("tokens.total", { value: formatTokens(totalTokens, t) });
      const durationMetric = durationMs === void 0 ? void 0 : {
        compact: formatDuration(durationMs, t),
        exact: formatExactDuration(durationMs, t)
      };
      const metrics = [tokenMetric, durationMetric?.exact].filter((value) => value !== void 0).join(" \xB7 ");
      const open = () => {
        openChild({
          parentSessionId,
          childSessionId: entry.id,
          mode: entry.mode
        });
        closeCatalog();
      };
      const openAside = (event) => {
        event.preventDefault();
        event.stopPropagation();
        openChildAside({ parentSessionId, childSessionId: entry.id, mode: entry.mode });
        closeCatalog();
      };
      const handleKey = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          open();
        } else if (event.key === "ArrowRight" && !knownLeaf && !isExpanded || event.key === "ArrowLeft" && isExpanded) {
          event.preventDefault();
          event.stopPropagation();
          toggleBranch(entry.id);
        }
      };
      const toggle = (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleBranch(entry.id);
      };
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: SubagentHeaderLineage_default.node, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "div",
          {
            role: "treeitem",
            tabIndex: 0,
            "aria-level": level,
            "aria-current": isCurrent || void 0,
            "aria-label": [label, secondary, metrics].filter((value) => value !== "").join(" "),
            ...knownLeaf ? {} : { "aria-expanded": isExpanded },
            className: SubagentHeaderLineage_default.row,
            onClick: open,
            onKeyDown: handleKey,
            children: [
              knownLeaf ? reserveDisclosure && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: SubagentHeaderLineage_default.disclosureSpace }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "button",
                {
                  type: "button",
                  tabIndex: -1,
                  className: `${SubagentHeaderLineage_default.disclosure} ${isExpanded ? SubagentHeaderLineage_default.disclosureOpen : ""}`,
                  "aria-label": t(isExpanded ? "branch.collapse" : "branch.expand", { label }),
                  onClick: toggle,
                  children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconChevronRightOutlineRegular, {})
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: SubagentHeaderLineage_default.clickarea, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: SubagentHeaderLineage_default.rowActivitySlot, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.StateDot, { state: entry.activity === "running" ? "ongoing" : completed ? "done" : "idle" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: SubagentHeaderLineage_default.content, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `${SubagentHeaderLineage_default.label} ${isCurrent ? SubagentHeaderLineage_default.currentLabel : ""}`, children: label }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: SubagentHeaderLineage_default.summary, children: secondary })
                ] }),
                metrics !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: SubagentHeaderLineage_default.metrics, children: [
                  tokenMetric !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: SubagentHeaderLineage_default.metricToken, children: tokenMetric }),
                  durationMetric !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "span",
                    {
                      className: SubagentHeaderLineage_default.metricDuration,
                      title: t("duration.exactTitle", { duration: durationMetric.exact }),
                      children: durationMetric.compact
                    }
                  )
                ] }),
                !isCurrent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.Tooltip, { label: t("open.sidebar"), side: "bottom", align: "end", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "button",
                  {
                    type: "button",
                    className: SubagentHeaderLineage_default.sidebarButton,
                    "aria-label": t("open.sidebar.aria", { label }),
                    onClick: openAside,
                    onKeyDown: (event) => {
                      event.stopPropagation();
                    },
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconChevronRightOutlineRegular, {})
                  }
                ) })
              ] })
            ]
          }
        ),
        isExpanded && !knownLeaf && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            role: "group",
            className: SubagentHeaderLineage_default.children,
            "aria-busy": childLoading || void 0,
            children: childCatalog === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogLoadingRows, { t }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              CatalogRows,
              {
                parentSessionId: entry.id,
                currentSessionId,
                catalog: childCatalog,
                catalogs,
                summaries,
                expanded,
                level: level + 1,
                openChild,
                openChildAside,
                refreshProjection,
                toggleBranch,
                closeCatalog,
                t
              }
            )
          }
        )
      ] }, entry.id);
    })
  ] });
}
var MENU_VIEWPORT_MARGIN = 16;
function catalogMenuPosition(trigger) {
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(336, window.innerWidth - MENU_VIEWPORT_MARGIN * 2);
  return {
    top: rect.bottom + 5,
    left: Math.min(
      Math.max(MENU_VIEWPORT_MARGIN, rect.left),
      window.innerWidth - width - MENU_VIEWPORT_MARGIN
    )
  };
}
function CatalogDropdown({
  rootSessionId,
  currentSessionId,
  displayTitle,
  openTitle,
  variant,
  useSessions,
  useSessionStatus,
  openChild,
  openChildAside,
  refreshProjection,
  t
}) {
  const ancestorSwitcher = variant === "switcher" && openTitle !== void 0;
  const projections = useSessions((state) => state.projectionsBySession);
  const summaries = useSessions((state) => state.byId);
  const statuses = useSessionStatus((value) => value);
  const catalogs = (0, import_react.useMemo)(() => Object.fromEntries(Object.entries(projections).map(([id, snapshot]) => [id, {
    state: snapshot.state === "idle" ? snapshot.values.subagentCatalog === void 0 ? "loading" : "ready" : snapshot.state,
    error: snapshot.error,
    entries: (snapshot.values.subagentCatalog ?? []).map((entry) => ({
      ...entry,
      activity: (statuses.get(entry.id)?.running ?? summaries[entry.id]?.running) === true ? "running" : "inactive"
    }))
  }])), [projections, summaries, statuses]);
  const catalog = catalogs[rootSessionId];
  const [open, setOpen] = (0, import_react.useState)(false);
  const [menuPosition2, setMenuPosition] = (0, import_react.useState)();
  const [expanded, setExpanded] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
  const rootRef = (0, import_react.useRef)(null);
  const triggerRef = (0, import_react.useRef)(null);
  const menuRef = (0, import_react.useRef)(null);
  const hoverOpenTimer = (0, import_react.useRef)(void 0);
  const hoverCloseTimer = (0, import_react.useRef)(void 0);
  const pinnedRef = (0, import_react.useRef)(false);
  const currentEntry = currentSessionId === void 0 ? void 0 : catalog?.entries.find((entry) => entry.id === currentSessionId);
  const switcherDisplayTitle = currentEntry !== void 0 ? currentEntry.label ?? currentEntry.id : displayTitle;
  const directChildren = catalog?.entries ?? [];
  const directCount = directChildren.length;
  const runningCount = directChildren.filter((entry) => entry.activity === "running").length;
  const totalCountKey = directCount === 1 ? "count.total.one" : "count.total.other";
  const runningCountKey = runningCount === 1 ? "count.running.one" : "count.running.other";
  const presentedCatalog = catalog ?? (variant === "switcher" ? { entries: [], state: "loading", error: null } : void 0);
  const cancelHoverClose = () => {
    if (hoverCloseTimer.current === void 0) return;
    clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = void 0;
  };
  const cancelHoverOpen = () => {
    if (hoverOpenTimer.current === void 0) return;
    clearTimeout(hoverOpenTimer.current);
    hoverOpenTimer.current = void 0;
  };
  const changeOpen = (next, restoreFocus = false) => {
    cancelHoverOpen();
    cancelHoverClose();
    if (next) {
      const trigger = triggerRef.current;
      if (trigger === null) return;
      setOpen(true);
      setMenuPosition(catalogMenuPosition(trigger));
    } else {
      pinnedRef.current = false;
      setOpen(false);
      setMenuPosition(void 0);
      setExpanded(/* @__PURE__ */ new Set());
    }
    if (restoreFocus) queueMicrotask(() => {
      triggerRef.current?.focus();
    });
  };
  const scheduleHoverOpen = () => {
    cancelHoverOpen();
    cancelHoverClose();
    if (open) return;
    hoverOpenTimer.current = setTimeout(() => {
      hoverOpenTimer.current = void 0;
      changeOpen(true);
    }, 150);
  };
  const scheduleHoverClose = () => {
    cancelHoverOpen();
    cancelHoverClose();
    if (pinnedRef.current) return;
    hoverCloseTimer.current = setTimeout(() => {
      hoverCloseTimer.current = void 0;
      changeOpen(false);
    }, 120);
  };
  const closeBranch = (root) => {
    const closing = /* @__PURE__ */ new Set();
    const visit = (parentSessionId) => {
      if (closing.has(parentSessionId) || !expanded.has(parentSessionId)) return;
      closing.add(parentSessionId);
      const branch = catalogs[parentSessionId];
      for (const entry of branch?.entries ?? []) {
        visit(entry.id);
      }
    };
    visit(root);
    setExpanded((current) => new Set([...current].filter((id) => !closing.has(id))));
  };
  const toggleBranch = (childSessionId) => {
    if (expanded.has(childSessionId)) {
      closeBranch(childSessionId);
      return;
    }
    setExpanded((current) => new Set(current).add(childSessionId));
    refreshProjection(childSessionId);
  };
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) {
        changeOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);
  (0, import_react.useEffect)(() => {
    if (!open) return;
    const placeMenu = () => {
      const trigger = triggerRef.current;
      if (trigger === null) return;
      setMenuPosition(catalogMenuPosition(trigger));
    };
    window.addEventListener("resize", placeMenu);
    document.addEventListener("scroll", placeMenu, true);
    return () => {
      window.removeEventListener("resize", placeMenu);
      document.removeEventListener("scroll", placeMenu, true);
    };
  }, [open]);
  (0, import_react.useEffect)(() => () => {
    cancelHoverOpen();
    cancelHoverClose();
  }, []);
  const visible = presentedCatalog !== void 0 && (variant === "switcher" || presentedCatalog.state === "error" || presentedCatalog.entries.length > 0);
  (0, import_react.useEffect)(() => {
    if (visible) return;
    cancelHoverOpen();
    cancelHoverClose();
    if (!open) return;
    pinnedRef.current = false;
    setOpen(false);
    setExpanded(/* @__PURE__ */ new Set());
  }, [visible, open]);
  if (!visible) return null;
  const focusAt = (index) => {
    const items = treeItems(menuRef.current);
    if (items.length === 0) return;
    items[(index + items.length) % items.length]?.focus();
  };
  const navigate = (event) => {
    const items = treeItems(menuRef.current);
    const index = items.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      changeOpen(false, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAt(items.length - 1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusAt(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusAt(index < 0 ? items.length - 1 : index - 1);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: `${SubagentHeaderLineage_default.root} ${variant === "switcher" ? SubagentHeaderLineage_default.switcherRoot : ""}`,
      ref: rootRef,
      onKeyDown: navigate,
      onMouseLeave: scheduleHoverClose,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            ref: triggerRef,
            onMouseEnter: scheduleHoverOpen,
            type: "button",
            className: variant === "switcher" ? `${SubagentHeaderLineage_default.switcherTrigger} ${ancestorSwitcher ? SubagentHeaderLineage_default.ancestorSwitcherTrigger : ""}` : SubagentHeaderLineage_default.trigger,
            "aria-haspopup": "tree",
            "aria-expanded": open,
            "aria-label": variant === "switcher" ? t("switcher.aria", { title: switcherDisplayTitle }) : t(
              runningCount > 0 ? runningCountKey : totalCountKey,
              { count: runningCount > 0 ? runningCount : directCount }
            ),
            onClick: openTitle === void 0 ? () => {
              cancelHoverOpen();
              cancelHoverClose();
              pinnedRef.current = true;
              if (!open) changeOpen(true);
            } : () => {
              cancelHoverOpen();
              if (open) changeOpen(false);
              openTitle();
            },
            onKeyDown: (event) => {
              if (event.key !== "ArrowDown") return;
              event.preventDefault();
              if (!open) changeOpen(true);
              queueMicrotask(() => {
                focusAt(0);
              });
            },
            children: [
              variant === "switcher" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: SubagentHeaderLineage_default.switcherTitle, children: switcherDisplayTitle }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                runningCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: SubagentHeaderLineage_default.activitySlot, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.StateDot, { state: "ongoing" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: SubagentHeaderLineage_default.count, children: t(totalCountKey, { count: directCount }) })
              ] }),
              variant === "switcher" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubagentSwitcherIcon, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { className: open ? SubagentHeaderLineage_default.triggerOpen : void 0 })
            ]
          }
        ),
        open && (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            ref: menuRef,
            className: SubagentHeaderLineage_default.menu,
            style: menuPosition2,
            onMouseEnter: cancelHoverClose,
            onMouseLeave: scheduleHoverClose,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: SubagentHeaderLineage_default.menuBody, role: "tree", "aria-label": t("tree.aria"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              CatalogRows,
              {
                parentSessionId: rootSessionId,
                currentSessionId,
                catalog: presentedCatalog,
                catalogs,
                summaries,
                expanded,
                level: 1,
                openChild,
                openChildAside,
                refreshProjection,
                toggleBranch,
                closeCatalog: () => {
                  changeOpen(false);
                },
                t
              }
            ) })
          }
        ), document.body)
      ]
    }
  );
}
function SubagentHeaderLineage({
  lineageSessionId,
  displayTitle,
  openTitle,
  useSessions,
  useSession,
  useSessionStatus,
  openChild,
  openChildAside,
  refreshProjection,
  t
}) {
  const address = useSession((session) => session.subagent?.address);
  const parentId = useSessions((state) => {
    if (address?.childSessionId === lineageSessionId) return address.parentSessionId;
    for (const [parentId2, snapshot] of Object.entries(state.projectionsBySession)) {
      if (snapshot.values.subagentCatalog?.some((entry) => entry.id === lineageSessionId)) return parentId2;
    }
    return void 0;
  });
  const shared = { useSessions, useSessionStatus, openChild, openChildAside, refreshProjection, t };
  if (parentId === void 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      CatalogDropdown,
      {
        rootSessionId: parentId,
        currentSessionId: lineageSessionId,
        variant: "switcher",
        displayTitle,
        ...openTitle === void 0 ? {} : { openTitle },
        ...shared
      },
      lineageSessionId
    ),
    openTitle === void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      CatalogDropdown,
      {
        rootSessionId: lineageSessionId,
        variant: "count",
        ...shared
      },
      lineageSessionId
    )
  ] });
}

// src/client-effects.tsx
var import_dsh_client_ui_primitives2 = require("@deepseek-ai/dsh-client-ui-primitives");
var import_jsx_runtime2 = require("react/jsx-runtime");
function registerStyles(ctx, css, label) {
  ctx.effect(() => {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.append(style);
    return () => style.remove();
  }, label);
}

// plugins/dsh-agent-archive-filter/src/catalog.tsx
var import_react2 = require("react");
var import_react_dom2 = require("react-dom");
var import_dsh_client_ui_primitives3 = require("@deepseek-ai/dsh-client-ui-primitives");

// plugins/dsh-agent-archive-filter/src/metrics.ts
function formatTokens2(value, t) {
  const scaled = (next) => next >= 100 ? String(Math.round(next)) : String(Math.round(next * 10) / 10);
  if (value < 1e3) return String(value);
  if (value < 1e6) return t("tokenThousand", { value: scaled(value / 1e3) });
  return t("tokenMillion", { value: scaled(value / 1e6) });
}
function tokenTotal2(usage) {
  return usage === void 0 ? void 0 : usage.uncachedInputTokens + usage.outputTokens + usage.cacheReadTokens + usage.cacheWriteTokens;
}
function activityDuration2(summary, running, now) {
  const timing = summary?.projectionValues?.subagentTiming;
  if (timing === void 0) return void 0;
  if (timing.active === void 0) return timing.settledMs;
  const end = running ? now : timing.active.through;
  return timing.settledMs + Math.max(0, end - timing.active.since);
}
function splitDuration2(ms) {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1e3);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  return {
    seconds: totalSeconds % 60,
    minutes: totalMinutes % 60,
    hours: totalHours % 24,
    days: Math.floor(totalHours / 24),
    totalMinutes,
    totalHours
  };
}
function formatDuration2(ms, t) {
  const { seconds, minutes, hours, days, totalMinutes, totalHours } = splitDuration2(ms);
  if (days >= 365) {
    const years = Math.floor(days / 365);
    const months = Math.floor(days % 365 / 30);
    return months === 0 ? t("durationYears", { years }) : t("durationYearsMonths", { years, months });
  }
  if (days >= 30) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return remainingDays === 0 ? t("durationMonths", { months }) : t("durationMonthsDays", { months, days: remainingDays });
  }
  if (days > 0) return hours === 0 ? t("durationDays", { days }) : t("durationDaysHours", { days, hours });
  if (totalHours > 0) return t("durationHours", {
    hours: totalHours,
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0")
  });
  if (totalMinutes > 0) return t("durationMinutes", { minutes: totalMinutes, seconds: String(seconds).padStart(2, "0") });
  return t("durationSeconds", { seconds });
}
function formatExactDuration2(ms, t) {
  const { seconds, minutes, hours, days } = splitDuration2(ms);
  return days === 0 ? formatDuration2(ms, t) : t("durationExactDays", {
    days,
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0")
  });
}

// plugins/dsh-agent-archive-filter/src/catalog.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function CatalogRows2({
  parentSessionId,
  projections,
  summaries,
  statuses,
  archived,
  expanded,
  toggle,
  open,
  openAside,
  refresh,
  close,
  t,
  level
}) {
  const snapshot = projections[parentSessionId];
  const entries = (snapshot?.values.subagentCatalog ?? []).filter((entry) => !archived.has(entry.id));
  const running = entries.some((entry) => statuses.get(entry.id)?.running ?? summaries[entry.id]?.running ?? false);
  const [now, setNow] = (0, import_react2.useState)(() => Date.now());
  (0, import_react2.useEffect)(() => {
    if (!running) return;
    const timer = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(timer);
  }, [running]);
  const loading = snapshot === void 0 || snapshot.state === "loading" && entries.length === 0 || snapshot.state === "idle" && snapshot.values.subagentCatalog === void 0;
  const reserveDisclosure = entries.some((entry) => {
    const child = projections[entry.id];
    const childEntries = (child?.values.subagentCatalog ?? []).filter((candidate) => !archived.has(candidate.id));
    const childReady = child !== void 0 && child.state !== "loading" && child.state !== "error" && !(child.state === "idle" && child.values.subagentCatalog === void 0);
    return !childReady || childEntries.length > 0;
  });
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
    loading && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh-agent-archive-filter-notice", children: t("loading") }),
    snapshot?.state === "error" && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh-agent-archive-filter-error", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: snapshot.error?.message ?? t("loadError") }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("button", { type: "button", className: "dsh-agent-archive-filter-refresh", onClick: () => refresh(parentSessionId), children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives3.IconRefreshOutlineRegular, { size: 14 }),
        t("retry")
      ] })
    ] }),
    entries.map((entry) => {
      const childSnapshot = projections[entry.id];
      const childEntries = (childSnapshot?.values.subagentCatalog ?? []).filter((child) => !archived.has(child.id));
      const childLoading = childSnapshot === void 0 || childSnapshot.state === "loading" && childEntries.length === 0 || childSnapshot.state === "idle" && childSnapshot.values.subagentCatalog === void 0;
      const knownLeaf = childSnapshot !== void 0 && !childLoading && childSnapshot.state !== "error" && childEntries.length === 0;
      const isExpanded = expanded.has(entry.id);
      const summary = summaries[entry.id];
      const running2 = statuses.get(entry.id)?.running ?? summary?.running ?? false;
      const label = entry.label ?? String(entry.id);
      const activity = running2 ? t("running") : summary?.projectionValues?.subagentTiming?.lastTurnCompleted === true ? t("completed") : t("inactive");
      const mode = entry.mode === "one-shot" ? t("oneShot") : entry.mode === "continuable" ? t("continuable") : t("unknown");
      const secondary = [summary?.title, mode, activity].filter((value) => value !== void 0).join(" \xB7 ");
      const totalTokens = tokenTotal2(summary?.projectionValues?.tokenUsage);
      const durationMs = activityDuration2(summary, running2, now);
      const tokenMetric = totalTokens === void 0 ? void 0 : t("tokenTotal", { value: formatTokens2(totalTokens, t) });
      const durationMetric = durationMs === void 0 ? void 0 : {
        compact: formatDuration2(durationMs, t),
        exact: formatExactDuration2(durationMs, t)
      };
      const metrics = [tokenMetric, durationMetric?.exact].filter((value) => value !== void 0).join(" \xB7 ");
      const address = { parentSessionId, childSessionId: entry.id, mode: entry.mode };
      const activate = () => {
        open(address);
        close();
      };
      const activateAside = (event) => {
        event.preventDefault();
        event.stopPropagation();
        openAside(address);
        close();
      };
      const onKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          activate();
        } else if (event.key === "ArrowRight" && !knownLeaf && !isExpanded) {
          event.preventDefault();
          event.stopPropagation();
          toggle(entry.id);
        } else if (event.key === "ArrowLeft" && isExpanded) {
          event.preventDefault();
          event.stopPropagation();
          toggle(entry.id);
        }
      };
      const toggleDisclosure = (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(entry.id);
      };
      return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh-agent-archive-filter-node", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "div",
          {
            role: "treeitem",
            tabIndex: 0,
            "aria-level": level,
            "aria-label": [label, secondary, metrics].filter((value) => value !== "").join(" "),
            ...knownLeaf ? {} : { "aria-expanded": isExpanded },
            className: "dsh-agent-archive-filter-row",
            onClick: activate,
            onKeyDown,
            children: [
              knownLeaf ? reserveDisclosure && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh-agent-archive-filter-disclosure-space" }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "button",
                {
                  type: "button",
                  tabIndex: -1,
                  className: `dsh-agent-archive-filter-disclosure ${isExpanded ? "dsh-agent-archive-filter-disclosure-open" : ""}`,
                  "aria-label": t(isExpanded ? "collapse" : "expand", { label }),
                  onClick: toggleDisclosure,
                  children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives3.IconChevronRightOutlineRegular, {})
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "dsh-agent-archive-filter-clickarea", children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh-agent-archive-filter-activity", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives3.StateDot, { state: running2 ? "ongoing" : activity === t("completed") ? "done" : "idle" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "dsh-agent-archive-filter-content", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh-agent-archive-filter-label", children: label }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh-agent-archive-filter-summary", children: secondary })
                ] }),
                metrics !== "" && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: "dsh-agent-archive-filter-metrics", children: [
                  tokenMetric !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh-agent-archive-filter-metric-token", children: tokenMetric }),
                  durationMetric !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                    "span",
                    {
                      className: "dsh-agent-archive-filter-metric-duration",
                      title: t("durationExactTitle", { duration: durationMetric.exact }),
                      children: durationMetric.compact
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives3.Tooltip, { label: t("openSidebar"), side: "bottom", align: "end", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "button",
                  {
                    type: "button",
                    tabIndex: -1,
                    className: "dsh-agent-archive-filter-sidebar",
                    "aria-label": t("openSidebarAria", { label }),
                    onClick: activateAside,
                    onKeyDown: (event) => event.stopPropagation(),
                    children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives3.IconChevronRightOutlineRegular, {})
                  }
                ) })
              ] })
            ]
          }
        ),
        isExpanded && !knownLeaf && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            role: "group",
            className: "dsh-agent-archive-filter-children",
            "aria-busy": childLoading || void 0,
            children: childSnapshot === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh-agent-archive-filter-notice", children: t("loading") }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              CatalogRows2,
              {
                parentSessionId: entry.id,
                projections,
                summaries,
                statuses,
                archived,
                expanded,
                toggle,
                open,
                openAside,
                refresh,
                close,
                t,
                level: level + 1
              }
            )
          }
        )
      ] }, entry.id);
    })
  ] });
}
function menuPosition(trigger) {
  const rect = trigger.getBoundingClientRect();
  const width = Math.min(336, window.innerWidth - 32);
  return {
    top: rect.bottom + 5,
    left: Math.min(Math.max(16, rect.left), window.innerWidth - width - 16)
  };
}
function CatalogMenu({
  sessionId,
  entries,
  projections,
  summaries,
  statuses,
  archived,
  openChild,
  openChildAside,
  refreshProjection,
  t
}) {
  const [open, setOpen] = (0, import_react2.useState)(false);
  const [position, setPosition] = (0, import_react2.useState)();
  const [expanded, setExpanded] = (0, import_react2.useState)(() => /* @__PURE__ */ new Set());
  const rootRef = (0, import_react2.useRef)(null);
  const menuRef = (0, import_react2.useRef)(null);
  const triggerRef = (0, import_react2.useRef)(null);
  const hoverOpenTimer = (0, import_react2.useRef)(void 0);
  const hoverCloseTimer = (0, import_react2.useRef)(void 0);
  const pinnedRef = (0, import_react2.useRef)(false);
  const runningCount = entries.filter((entry) => statuses.get(entry.id)?.running ?? summaries[entry.id]?.running ?? false).length;
  const countKey = entries.length === 1 ? "countOne" : "count";
  const runningKey = runningCount === 1 ? "countRunningOne" : "countRunning";
  const cancelHoverClose = () => {
    if (hoverCloseTimer.current === void 0) return;
    clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = void 0;
  };
  const cancelHoverOpen = () => {
    if (hoverOpenTimer.current === void 0) return;
    clearTimeout(hoverOpenTimer.current);
    hoverOpenTimer.current = void 0;
  };
  const changeOpen = (next, restoreFocus = false) => {
    cancelHoverOpen();
    cancelHoverClose();
    const trigger = triggerRef.current;
    if (next) {
      if (trigger === null) return;
      setOpen(true);
      setPosition(menuPosition(trigger));
    } else {
      pinnedRef.current = false;
      setOpen(false);
      setPosition(void 0);
      setExpanded(/* @__PURE__ */ new Set());
    }
    if (restoreFocus) queueMicrotask(() => triggerRef.current?.focus());
  };
  const scheduleHoverOpen = () => {
    cancelHoverOpen();
    cancelHoverClose();
    if (open) return;
    hoverOpenTimer.current = setTimeout(() => {
      hoverOpenTimer.current = void 0;
      changeOpen(true);
    }, 150);
  };
  const scheduleHoverClose = () => {
    cancelHoverOpen();
    cancelHoverClose();
    if (pinnedRef.current) return;
    hoverCloseTimer.current = setTimeout(() => {
      hoverCloseTimer.current = void 0;
      changeOpen(false);
    }, 120);
  };
  const closeBranch = (root) => {
    const closing = /* @__PURE__ */ new Set();
    const visit = (parentSessionId) => {
      if (closing.has(parentSessionId) || !expanded.has(parentSessionId)) return;
      closing.add(parentSessionId);
      for (const entry of projections[parentSessionId]?.values.subagentCatalog ?? []) {
        if (!archived.has(entry.id)) visit(entry.id);
      }
    };
    visit(root);
    setExpanded((current) => new Set([...current].filter((id) => !closing.has(id))));
  };
  const toggle = (childId) => {
    if (expanded.has(childId)) closeBranch(childId);
    else {
      setExpanded((current) => new Set(current).add(childId));
      refreshProjection(childId);
    }
  };
  const focusAt = (index) => {
    const items = menuRef.current?.querySelectorAll('[role="treeitem"]:not([aria-disabled="true"])');
    if (items === void 0 || items.length === 0) return;
    items[(index + items.length) % items.length]?.focus();
  };
  const navigate = (event) => {
    const items = menuRef.current?.querySelectorAll('[role="treeitem"]:not([aria-disabled="true"])');
    const index = items === void 0 ? -1 : [...items].indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      changeOpen(false, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      if (items !== void 0) focusAt(items.length - 1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusAt(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusAt(index < 0 ? (items?.length ?? 0) - 1 : index - 1);
    }
  };
  (0, import_react2.useEffect)(() => {
    if (!open) return;
    const outside = (event) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) changeOpen(false);
    };
    const reposition = () => {
      const trigger = triggerRef.current;
      if (trigger !== null) setPosition(menuPosition(trigger));
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);
  (0, import_react2.useEffect)(() => () => {
    cancelHoverOpen();
    cancelHoverClose();
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { ref: rootRef, className: "dsh-agent-archive-filter", onKeyDown: navigate, onMouseLeave: scheduleHoverClose, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "button",
      {
        ref: triggerRef,
        onMouseEnter: scheduleHoverOpen,
        type: "button",
        className: "dsh-agent-archive-filter-trigger",
        "aria-haspopup": "tree",
        "aria-expanded": open,
        "aria-label": t(runningCount > 0 ? runningKey : countKey, { count: runningCount > 0 ? runningCount : entries.length }),
        onClick: () => {
          cancelHoverOpen();
          cancelHoverClose();
          pinnedRef.current = true;
          if (!open) changeOpen(true);
        },
        onKeyDown: (event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (!open) changeOpen(true);
            queueMicrotask(() => focusAt(0));
          }
        },
        children: [
          runningCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh-agent-archive-filter-trigger-activity", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives3.StateDot, { state: "ongoing" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "dsh-agent-archive-filter-trigger-count", children: t(countKey, { count: entries.length }) }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_dsh_client_ui_primitives3.IconChevronDownOutlineRegular, { className: open ? "dsh-agent-archive-filter-trigger-open" : void 0 })
        ]
      }
    ),
    open && position !== void 0 && (0, import_react_dom2.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        ref: menuRef,
        className: "dsh-agent-archive-filter-menu",
        style: position,
        onMouseEnter: cancelHoverClose,
        onMouseLeave: scheduleHoverClose,
        children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "dsh-agent-archive-filter-menu-body", role: "tree", "aria-label": t("tree"), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          CatalogRows2,
          {
            parentSessionId: sessionId,
            projections,
            summaries,
            statuses,
            archived,
            expanded,
            toggle,
            open: openChild,
            openAside: openChildAside,
            refresh: refreshProjection,
            close: () => changeOpen(false),
            t,
            level: 1
          }
        ) })
      }
    ), document.body)
  ] });
}

// plugins/dsh-agent-archive-filter/src/locales.ts
var NS = "agentArchiveFilter";
var zh = {
  tree: "\u5B50\u667A\u80FD\u4F53\u4F1A\u8BDD",
  loading: "\u6B63\u5728\u52A0\u8F7D\u5B50\u667A\u80FD\u4F53\u2026",
  loadError: "\u65E0\u6CD5\u52A0\u8F7D\u5B50\u667A\u80FD\u4F53",
  retry: "\u91CD\u8BD5",
  running: "\u6B63\u5728\u8FD0\u884C",
  inactive: "\u5F53\u524D\u672A\u8FD0\u884C",
  completed: "\u5DF2\u5B8C\u6210",
  oneShot: "\u4E00\u6B21\u6027",
  continuable: "\u53EF\u7EE7\u7EED",
  unknown: "\u6A21\u5F0F\u672A\u77E5",
  count: "{count} \u4E2A\u5B50\u667A\u80FD\u4F53",
  countOne: "{count} \u4E2A\u5B50\u667A\u80FD\u4F53",
  countRunning: "{count} \u4E2A\u5B50\u667A\u80FD\u4F53\uFF0C\u6B63\u5728\u8FD0\u884C",
  countRunningOne: "{count} \u4E2A\u5B50\u667A\u80FD\u4F53\uFF0C\u6B63\u5728\u8FD0\u884C",
  expand: "\u5C55\u5F00 {label} \u7684\u4E0B\u7EA7\u5B50\u667A\u80FD\u4F53",
  collapse: "\u6536\u8D77 {label} \u7684\u4E0B\u7EA7\u5B50\u667A\u80FD\u4F53",
  openSidebar: "\u5728\u4FA7\u8FB9\u680F\u6253\u5F00",
  openSidebarAria: "\u5728\u4FA7\u8FB9\u680F\u6253\u5F00 {label}",
  tokenThousand: "{value}K",
  tokenMillion: "{value}M",
  tokenTotal: "{value} tok",
  durationSeconds: "{seconds}\u79D2",
  durationMinutes: "{minutes}\u5206{seconds}\u79D2",
  durationHours: "{hours}\u5C0F\u65F6{minutes}\u5206{seconds}\u79D2",
  durationDays: "{days}\u5929",
  durationDaysHours: "{days}\u5929{hours}\u5C0F\u65F6",
  durationMonths: "\u7EA6{months}\u4E2A\u6708",
  durationMonthsDays: "\u7EA6{months}\u4E2A\u6708{days}\u5929",
  durationYears: "\u7EA6{years}\u5E74",
  durationYearsMonths: "\u7EA6{years}\u5E74{months}\u4E2A\u6708",
  durationExactDays: "{days}\u5929{hours}\u5C0F\u65F6{minutes}\u5206{seconds}\u79D2",
  durationExactTitle: "\u603B\u6D3B\u8DC3\u8017\u65F6\uFF1A{duration}"
};
var en = {
  tree: "Subagent sessions",
  loading: "Loading subagents\u2026",
  loadError: "Unable to load subagents",
  retry: "Retry",
  running: "running",
  inactive: "not running",
  completed: "completed",
  oneShot: "one-shot",
  continuable: "continuable",
  unknown: "unknown mode",
  count: "{count} subagents",
  countOne: "{count} subagent",
  countRunning: "{count} subagents running",
  countRunningOne: "{count} subagent running",
  expand: "Expand descendants of {label}",
  collapse: "Collapse descendants of {label}",
  openSidebar: "Open in sidebar",
  openSidebarAria: "Open {label} in sidebar",
  tokenThousand: "{value}K",
  tokenMillion: "{value}M",
  tokenTotal: "{value} tok",
  durationSeconds: "{seconds}s",
  durationMinutes: "{minutes}m {seconds}s",
  durationHours: "{hours}h {minutes}m {seconds}s",
  durationDays: "{days}d",
  durationDaysHours: "{days}d {hours}h",
  durationMonths: "~{months}mo",
  durationMonthsDays: "~{months}mo {days}d",
  durationYears: "~{years}y",
  durationYearsMonths: "~{years}y {months}mo",
  durationExactDays: "{days}d {hours}h {minutes}m {seconds}s",
  durationExactTitle: "Total active duration: {duration}"
};

// plugins/dsh-agent-archive-filter/src/styles.ts
var styles = `
.dsh-agent-archive-filter{position:relative;display:inline-flex;align-items:center;gap:10px;min-width:0}
.dsh-agent-archive-filter-trigger{display:inline-flex;align-items:center;gap:4px;min-height:28px;padding:3px 2px;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;cursor:pointer}
.dsh-agent-archive-filter-trigger:hover,.dsh-agent-archive-filter-trigger:focus-visible{color:var(--dsw-alias-label-primary)}
.dsh-agent-archive-filter-trigger svg{flex:none;transition:transform 120ms ease}
.dsh-agent-archive-filter-trigger-activity{display:inline-flex;flex:none;align-items:center;justify-content:center;width:14px;height:14px}
.dsh-agent-archive-filter-trigger-open{transform:rotate(180deg)}
.dsh-agent-archive-filter-trigger-count{color:inherit}
.dsh-agent-archive-filter-menu{position:fixed;z-index:100;box-sizing:border-box;display:flex;flex-direction:column;width:336px;max-width:min(400px,calc(100vw - 32px));max-height:min(560px,calc(100vh - 140px));padding:3px;overflow:hidden;border-radius:var(--dsw-radius-lg);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);--dsw-elevation-stroke-color:var(--dsw-alias-border-l1);box-shadow:var(--dsw-elevation-prominent)}
.dsh-agent-archive-filter-menu::before{content:'';position:absolute;z-index:-1;inset:0;border-radius:inherit;background:var(--dsw-specific-menu);backdrop-filter:var(--dsw-menu-backdrop-filter)}
.dsh-agent-archive-filter-menu-body{display:flex;flex:1 1 auto;flex-direction:column;min-height:0;overflow:auto}
.dsh-agent-archive-filter-node{position:relative;min-width:0}
.dsh-agent-archive-filter-menu-body>.dsh-agent-archive-filter-node{margin-left:-2px}
.dsh-agent-archive-filter-row{position:relative;display:flex;align-items:flex-start;gap:6px;box-sizing:border-box;width:100%;min-height:44px;padding:6px 7px 6px 9px;border:0;border-radius:var(--dsw-radius-lg);background:transparent;color:var(--dsw-alias-label-primary);font-size:12px;line-height:17px;text-align:left;cursor:pointer;outline:none}
.dsh-agent-archive-filter-row:hover>.dsh-agent-archive-filter-clickarea,.dsh-agent-archive-filter-row:focus-visible>.dsh-agent-archive-filter-clickarea{background:var(--dsw-alias-interactive-bg-hover)}
.dsh-agent-archive-filter-clickarea{box-sizing:border-box;display:flex;flex:1;align-self:stretch;align-items:flex-start;gap:6px;min-width:0;margin:-6px -7px -6px;padding:6px 7px;border-radius:var(--dsw-radius-lg)}
.dsh-agent-archive-filter-activity{display:inline-flex;flex:none;align-items:center;justify-content:center;width:14px;height:17px}
.dsh-agent-archive-filter-disclosure,.dsh-agent-archive-filter-disclosure-space{flex:none;width:14px;height:17px}
.dsh-agent-archive-filter-disclosure{display:inline-flex;align-items:center;justify-content:center;padding:0;border:0;background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer;transition:transform 120ms ease}
.dsh-agent-archive-filter-disclosure svg{width:12px;height:12px}
.dsh-agent-archive-filter-disclosure:hover{color:var(--dsw-alias-label-primary)}
.dsh-agent-archive-filter-disclosure-open{transform:rotate(90deg)}
.dsh-agent-archive-filter-content{display:flex;flex:1;flex-direction:column;min-width:0}
.dsh-agent-archive-filter-label,.dsh-agent-archive-filter-summary{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-agent-archive-filter-label{color:inherit;font-weight:400}
.dsh-agent-archive-filter-summary,.dsh-agent-archive-filter-metrics{color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:15px}
.dsh-agent-archive-filter-metrics{display:grid;grid-template-rows:17px 15px;flex:none;font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
.dsh-agent-archive-filter-metric-token{grid-row:1;line-height:17px}
.dsh-agent-archive-filter-metric-duration{grid-row:2}
.dsh-agent-archive-filter-sidebar{display:inline-flex;flex:none;align-items:center;justify-content:center;width:28px;height:28px;margin:4px 0;padding:6px;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:var(--dsw-alias-label-tertiary);cursor:pointer}
.dsh-agent-archive-filter-sidebar:hover,.dsh-agent-archive-filter-sidebar:focus-visible{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}
.dsh-agent-archive-filter-children{position:relative;margin-left:16px;padding-left:3px}
.dsh-agent-archive-filter-children::before,.dsh-agent-archive-filter-children>.dsh-agent-archive-filter-node::before{content:'';position:absolute;left:0;border-left:.5px solid var(--dsw-alias-border-l2)}
.dsh-agent-archive-filter-children::before{top:-23px;height:23px}
.dsh-agent-archive-filter-children[aria-busy=true]::before{content:none}
.dsh-agent-archive-filter-children>.dsh-agent-archive-filter-node::before{top:0;bottom:0;left:-3px}
.dsh-agent-archive-filter-children>.dsh-agent-archive-filter-node:last-child::before{bottom:auto;height:15px}
.dsh-agent-archive-filter-children>.dsh-agent-archive-filter-node>.dsh-agent-archive-filter-row::before{content:'';position:absolute;top:14px;left:-3px;width:12px;border-top:.5px solid var(--dsw-alias-border-l2)}
.dsh-agent-archive-filter-notice,.dsh-agent-archive-filter-error{padding:8px 10px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}
.dsh-agent-archive-filter-error{display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--dsw-alias-state-error-primary)}
.dsh-agent-archive-filter-refresh{display:inline-flex;flex:none;align-items:center;gap:3px;padding:3px 5px;border:0;border-radius:var(--dsw-radius-sm);background:transparent;color:inherit;cursor:pointer}
.dsh-agent-archive-filter-refresh svg{width:12px;height:12px}
.dsh-agent-archive-filter-refresh:hover{background:var(--dsw-alias-interactive-bg-hover)}
`;

// plugins/dsh-agent-archive-filter/src/client.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var SUBAGENT_CHAT_ADDRESS = "dsh-resource://subagentchat/session/";
var inject = ["slots", "locale", "uiWorkspace", "sessions", "sidebarRight"];
function subagentChatAddress(address) {
  const query = new URLSearchParams({ parent: address.parentSessionId, mode: address.mode });
  return `${SUBAGENT_CHAT_ADDRESS}${encodeURIComponent(address.childSessionId)}?${query}`;
}
function filterArchivedCatalogs(projections, archived) {
  let changed = false;
  const filtered = Object.fromEntries(Object.entries(projections).map(([id, snapshot]) => {
    const entries = snapshot.values.subagentCatalog;
    if (entries === void 0) return [id, snapshot];
    const visible = entries.filter((entry) => !archived.has(entry.id));
    if (visible.length === entries.length) return [id, snapshot];
    changed = true;
    return [id, { ...snapshot, values: { ...snapshot.values, subagentCatalog: visible } }];
  }));
  return changed ? filtered : projections;
}
function ArchivedSubagentLineage(props) {
  const archivePhase = props.useWorkspaces((state) => state.phase);
  const archivedIds = props.useWorkspaces((state) => state.archivedSessionIds);
  const archived = (0, import_react3.useMemo)(() => new Set(archivedIds), [archivedIds]);
  const sessionState = props.useSessions((state) => state);
  const filteredState = (0, import_react3.useMemo)(() => ({
    ...sessionState,
    projectionsBySession: filterArchivedCatalogs(sessionState.projectionsBySession, archived)
  }), [sessionState, archived]);
  const useSessions = (selector) => selector(filteredState);
  if (archivePhase !== "ready") return null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SubagentHeaderLineage, { ...props, useSessions });
}
function ArchivedCatalogAction(props) {
  const { sessionId, useSessions, useSessionStatus, useWorkspaces, openChild, openChildAside, refreshProjection } = props;
  const isChild = useSessions((state) => state.byId[sessionId]?.origin === "subagent");
  const projections = useSessions((state) => state.projectionsBySession);
  const summaries = useSessions((state) => state.byId);
  const statuses = useSessionStatus((state) => state);
  const archivePhase = useWorkspaces((state) => state.phase);
  const archivedIds = useWorkspaces((state) => state.archivedSessionIds);
  const archived = (0, import_react3.useMemo)(() => new Set(archivedIds), [archivedIds]);
  const catalog = projections[sessionId];
  const entries = (catalog?.values.subagentCatalog ?? []).filter((entry) => !archived.has(entry.id));
  if (isChild || archivePhase !== "ready" || entries.length === 0 && catalog?.state !== "error") return null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    CatalogMenu,
    {
      ...props,
      sessionId,
      entries,
      projections,
      summaries,
      statuses,
      archived,
      openChild,
      openChildAside,
      refreshProjection
    },
    sessionId
  );
}
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { en, zh }), "agent archive filter dictionaries");
  registerStyles(ctx, `${styles}
${ARCHIVE_LINEAGE_CSS}`, "agent archive filter styles");
  const catalogActions = () => ({
    openChild: (address) => ctx.uiWorkspace.openSession(address),
    openChildAside: (address) => ctx.sidebarRight.openResource(subagentChatAddress(address), { kind: "subagentchat", preferNewPane: true }),
    refreshProjection: (sessionId) => {
      void ctx.sessions.refreshProjections(sessionId);
    }
  });
  ctx.slots.inject("conversation.session.header.lineage", () => ctx.slots.register({
    name: "conversation.session.header.lineage",
    priority: -100,
    locale: "subagent",
    inject: catalogActions
  }, ArchivedSubagentLineage));
  ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
    name: "conversation.session.header.actions",
    id: "subagent-catalog",
    priority: -100,
    order: -30,
    locale: NS,
    inject: catalogActions
  }, ArchivedCatalogAction));
}

return module.exports;}});
