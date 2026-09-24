# AI SDK historical tool approval resume reproduction

Provider-free XBSTACK reproduction for Vercel AI SDK issue #21193.

This fixture verifies the long-running chat case where a tool approval belongs to an earlier assistant message, later conversation messages already exist, and the user then approves or rejects the older tool call.

## Verified matrix

| AI SDK | Historical approve/reject | Historical tool output |
| --- | --- | --- |
| 7.0.107 | **Reproduced bug**: owning message stays `approval-requested` | **Reproduced bug**: `No tool invocation found for tool call ID "call-1".` |
| 7.0.113 | **Fixed in local regression**: owning message becomes `approval-responded` | **Fixed in local regression**: owning message becomes `output-available`, output is preserved |

Verified locally on 2026-09-24 with Node.js >=22. The fixture is provider-free: it uses in-memory messages and an in-memory UI message stream, with no model API, credentials, payment API, or production service.

## Run the current fixed comparison

```bash
npm install
npm run typecheck
EXPECT_FIXED=1 npm test
EXPECT_FIXED=1 npm run test:stream
```

## Reproduce the affected version

```bash
npm install ai@7.0.107 --save-exact
npm test
npm run test:stream
```

Restore the current verified fixed package:

```bash
npm install ai@7.0.113 --save-exact
```

## Evidence boundary

The state fixture proves that historical approval mutation failed on 7.0.107 and succeeds on 7.0.113. The stream fixture proves the historical `tool-output-available` lookup failure on 7.0.107 and successful continuation on 7.0.113.

It does not prove behavior for every version between those two pins, and it does not identify the first npm release containing the fix.

## Upstream

- Issue: https://github.com/vercel/ai/issues/21193
- Fix PR: https://github.com/vercel/ai/pull/21203

## XBSTACK

Focused troubleshooting article with the exact error, affected/fixed comparison, and regression checklist:

- Chinese: https://www.xbstack.com/ai/vercel-ai-sdk-historical-tool-approval-resume-error/?utm_source=github&utm_medium=referral&utm_campaign=ai_sdk_historical_tool_approval&utm_content=repository_readme_zh
- English: https://www.xbstack.com/en/ai/vercel-ai-sdk-historical-tool-approval-resume-error/?utm_source=github&utm_medium=referral&utm_campaign=ai_sdk_historical_tool_approval&utm_content=repository_readme

Broader AI SDK 7 migration context:

- Chinese: https://www.xbstack.com/ai/vercel-ai-sdk-7-migration-production/?utm_source=github&utm_medium=referral&utm_campaign=ai_sdk_historical_tool_approval&utm_content=repository_readme_context
- English: https://www.xbstack.com/en/ai/vercel-ai-sdk-7-migration-production/?utm_source=github&utm_medium=referral&utm_campaign=ai_sdk_historical_tool_approval&utm_content=repository_readme_context
