# AI SDK historical tool approval resume reproduction

This fixture reproduces Vercel AI SDK issue #21193 without a real model or provider credentials.

## What it tests

1. Latest-message approval control.
2. Historical-message approve.
3. Historical-message reject.
4. Historical approved tool result continuation.

## Verified matrix

| AI SDK | Historical approve/reject | Historical tool output |
| --- | --- | --- |
| 7.0.107 | Fails: owner remains `approval-requested` | Fails with `No tool invocation found for tool call ID "call-1".` |
| 7.0.113 | Passes: owner becomes `approval-responded` | Passes: owner becomes `output-available` |

The repository currently pins `ai@7.0.113`, the current npm version observed on 2026-09-24.

## Run

```bash
npm install
npm run typecheck
EXPECT_FIXED=1 npm test
EXPECT_FIXED=1 npx tsx src/stream-repro.ts
```

To reproduce the affected version:

```bash
npm install ai@7.0.107 --save-exact
npm test
npx tsx src/stream-repro.ts
```

Then restore the verified fixed version:

```bash
npm install ai@7.0.113 --save-exact
```

## Evidence boundary

The state-only fixture directly verifies the historical approval mutation bug. The stream fixture directly verifies the missing-invocation failure. It does not use a real provider, React, Cloudflare, or application code.

## Links

- Detailed analysis: https://www.xbstack.com/en/ai/tools-lab/ai-sdk-historical-tool-approval-resume-error/?utm_source=github&utm_medium=referral&utm_campaign=ai_sdk_historical_tool_approval&utm_content=repository_readme
- Chinese analysis: https://www.xbstack.com/ai/tools-lab/ai-sdk-historical-tool-approval-resume-error/?utm_source=github&utm_medium=referral&utm_campaign=ai_sdk_historical_tool_approval&utm_content=repository_readme
- Upstream issue: https://github.com/vercel/ai/issues/21193
- Upstream fix PR: https://github.com/vercel/ai/pull/21203
