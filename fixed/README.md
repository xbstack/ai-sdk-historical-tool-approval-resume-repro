# Fixed verification

Pin `ai@7.0.113` and run:

```bash
npm install ai@7.0.113 --save-exact
EXPECT_FIXED=1 npm test
EXPECT_FIXED=1 npx tsx src/stream-repro.ts
npm run typecheck
```

Expected:
- historical approve/reject update the owning assistant message;
- later messages stay in place;
- historical tool output is written back to the owning tool part;
- chat finishes with status `ready`.
