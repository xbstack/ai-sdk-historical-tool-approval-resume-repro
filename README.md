# AI SDK historical tool approval resume repro

Provider-free XBSTACK reproduction for Vercel AI SDK issue #21193.

The fixture isolates two failure shapes when a tool approval belongs to an earlier assistant message rather than the latest assistant turn:

1. `addToolApprovalResponse` leaves the historical tool part in `approval-requested`.
2. A resumed `tool-output-available` chunk fails with `No tool invocation found for tool call ID "call-1"`.

## Verified matrix

| AI SDK | Historical approve/reject | Historical tool output | Result |
| --- | --- | --- | --- |
| `7.0.107` | remains `approval-requested` | chat enters `error` with missing invocation | affected |
| `7.0.113` | becomes `approval-responded` | chat returns `ready`, owner becomes `output-available` | fixed in tested version |

The latest-message control passes in both versions.

This repository does **not** claim that 7.0.113 is the first patched npm release. It only records the two versions XBSTACK actually tested on 2026-09-24.

## Run

```bash
npm install
npm run typecheck
npm test
```

The test suite installs both SDK versions through npm aliases, so one run produces a deterministic before/after comparison without a real model, provider credentials, Cloudflare, or external API calls.

## Files

- `src/repro.ts`: approval-state regression and latest-message control
- `src/stream-repro.ts`: historical `tool-output-available` continuation
- `version-matrix.md`: tested-version boundary
- `logs/7.0.107.txt`: broken baseline
- `logs/7.0.113.txt`: fixed verification
- `repro/README.md`: affected behavior
- `fixed/README.md`: verified fixed behavior

## Upstream

- https://github.com/vercel/ai/issues/21193
- https://github.com/vercel/ai/pull/21203

## XBSTACK article

Chinese: https://www.xbstack.com/ai/vercel-ai-sdk-historical-tool-approval-resume-error/?utm_source=github&utm_medium=referral&utm_campaign=ai_sdk_historical_tool_approval&utm_content=repository_readme_zh

English: https://www.xbstack.com/en/ai/vercel-ai-sdk-historical-tool-approval-resume-error/?utm_source=github&utm_medium=referral&utm_campaign=ai_sdk_historical_tool_approval&utm_content=repository_readme
