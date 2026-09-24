# Version matrix

Verified on 2026-09-24.

| Runtime | AI SDK | Latest-message approval | Historical approve/reject | Historical stream continuation | Result |
| --- | --- | --- | --- | --- | --- |
| Node.js 22.18.0 | 7.0.107 | `approval-responded` | remains `approval-requested` | `No tool invocation found for tool call ID "call-1".` | affected |
| Node.js 22.18.0 | 7.0.113 | `approval-responded` | becomes `approval-responded` | `output-available`, chat status `ready` | fixed in tested version |

Evidence logs:

- `logs/7.0.107.txt`
- `logs/7.0.113.txt`

Upstream:

- https://github.com/vercel/ai/issues/21193
- https://github.com/vercel/ai/pull/21203

Boundary: this matrix only claims the two versions actually tested. It does not infer the first patched npm release between them.
