# Reproduction

Pin `ai@7.0.107` and run the two fixtures.

```bash
npm install ai@7.0.107 --save-exact
npm test
npx tsx src/stream-repro.ts
```

Expected broken behavior:
- historical approval owner remains `approval-requested`;
- resumed historical output ends in `error`;
- error contains `No tool invocation found for tool call ID "call-1".`.
