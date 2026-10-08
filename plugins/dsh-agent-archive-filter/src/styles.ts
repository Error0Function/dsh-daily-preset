/** Scoped styles for the archive-filtered native-style catalog. */
export const styles = `
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
`
