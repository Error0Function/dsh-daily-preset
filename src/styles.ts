/** Visual tokens for the existing settings layout. */
export const styles = `
.dsh-daily-settings{display:flex;flex-direction:column;gap:12px;width:100%;max-width:720px;font-size:13px;line-height:18px}
.dsh-daily-card{display:flex;flex-direction:column;gap:10px;padding:16px;border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-settings-card-fill)}
.dsh-daily-label{font-weight:500}
.dsh-daily-description{color:var(--dsw-alias-label-secondary)}
.dsh-daily-select{box-sizing:border-box;width:100%;min-height:32px;padding:6px 10px;border:.5px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);background:var(--dsw-alias-settings-card-fill);color:var(--dsw-alias-label-primary);font:inherit}
.dsh-daily-select:focus-visible{outline:2px solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));outline-offset:2px}
.dsh-daily-error{color:var(--dsw-alias-state-error-primary);overflow-wrap:anywhere}
.dsh-daily-loading{display:flex;align-items:center;justify-content:center;min-height:140px}
`
