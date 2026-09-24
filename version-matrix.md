# Version matrix

Verified on 2026-09-24.

| Runtime | AI SDK | State-only approval | Stream continuation | Result |
| --- | --- | --- | --- | --- |
| Node.js >=22 | 7.0.107 | latest message passes; historical approve/reject stay `approval-requested` | `No tool invocation found for tool call ID "call-1".` | affected |
| Node.js >=22 | 7.0.113 | historical approve/reject become `approval-responded` | `output-available` with `{"ok":true}` | fixed in tested version |

Evidence logs:

- `logs/7.0.107.txt`
- `logs/7.0.113.txt`

Upstream:

- https://github.com/vercel/ai/issues/21193
- https://github.com/vercel/ai/pull/21203

This matrix only claims the two versions actually tested. It does not infer the first patched npm release between them.
