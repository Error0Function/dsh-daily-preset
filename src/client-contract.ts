/** Settings extensions owned by the daily-mode page. */
import type {} from '@deepseek-ai/dsh-client-ui-slots'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    /** Global maintenance controls displayed below child-model settings. */
    'settings.daily.item': { kind: 'list'; scope: 'root'; owner: { children?: never } }
  }
}
