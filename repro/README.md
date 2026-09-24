# Affected behavior: ai@7.0.107

XBSTACK reproduced both historical-message failures on 2026-09-24.

State path:

```text
latest assistant approval
-> approval-responded

older assistant approval + later conversation
-> approve/reject called
-> owning tool part remains approval-requested
```

Stream path:

```text
older assistant tool call is already approval-responded
-> later conversation remains in history
-> tool-output-available(call-1)
-> No tool invocation found for tool call ID "call-1".
-> chat status = error
```

No provider or network call is involved.
