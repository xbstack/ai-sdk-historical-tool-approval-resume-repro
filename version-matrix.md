# Version matrix

| Date | Runtime | ai version | Test | Result |
| --- | --- | --- | --- | --- |
| 2026-09-24 | Node.js local | 7.0.107 | latest-message approval | PASS |
| 2026-09-24 | Node.js local | 7.0.107 | historical approve | FAIL: remains approval-requested |
| 2026-09-24 | Node.js local | 7.0.107 | historical reject | FAIL: remains approval-requested |
| 2026-09-24 | Node.js local | 7.0.107 | historical tool-output continuation | FAIL: No tool invocation found for tool call ID "call-1". |
| 2026-09-24 | Node.js local | 7.0.113 | latest-message approval | PASS |
| 2026-09-24 | Node.js local | 7.0.113 | historical approve | PASS |
| 2026-09-24 | Node.js local | 7.0.113 | historical reject | PASS |
| 2026-09-24 | Node.js local | 7.0.113 | historical tool-output continuation | PASS |

The matrix proves behavior for these two tested versions only. It does not identify the first patched npm release between them.
