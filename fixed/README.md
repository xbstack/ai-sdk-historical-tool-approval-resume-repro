# Verified fixed behavior: ai@7.0.113

XBSTACK reran the same fixtures on 2026-09-24.

```text
historical approve -> approval-responded
historical reject  -> approval-responded
historical tool output -> output-available
chat status -> ready
later conversation messages -> preserved
```

This verifies 7.0.113 as fixed for the tested paths. It does not claim that 7.0.113 is the first patched npm release.
