import assert from 'node:assert/strict';

type AnyMessage = {
  id: string;
  role: 'user' | 'assistant';
  parts: any[];
};

const packageName = process.env.AI_PACKAGE ?? 'ai-broken';
const { AbstractChat, createUIMessageStream } = await import(packageName);

function makeState(messages: AnyMessage[]) {
  return {
    messages: structuredClone(messages),
    status: 'ready',
    error: undefined as unknown,
    pushMessage(message: AnyMessage) {
      this.messages.push(message);
    },
    replaceMessage(index: number, message: AnyMessage) {
      this.messages[index] = message;
    },
    snapshot(message: AnyMessage) {
      return structuredClone(message);
    },
  };
}

const messages: AnyMessage[] = [
  { id: 'user-1', role: 'user', parts: [{ type: 'text', text: 'Run tool.' }] },
  {
    id: 'assistant-1',
    role: 'assistant',
    parts: [
      {
        type: 'tool-riskyAction',
        toolCallId: 'call-1',
        state: 'approval-responded',
        input: { value: 1 },
        approval: { id: 'approval-1', approved: true },
      },
    ],
  },
  { id: 'user-2', role: 'user', parts: [{ type: 'text', text: 'Later question.' }] },
  { id: 'assistant-2', role: 'assistant', parts: [{ type: 'text', text: 'Later reply.' }] },
];

const state = makeState(messages);
const errors: string[] = [];

const transport = {
  async sendMessages() {
    return createUIMessageStream({
      originalMessages: structuredClone(state.messages) as any,
      execute: async ({ writer }: any) => {
        writer.write({
          type: 'tool-output-available',
          toolCallId: 'call-1',
          output: { ok: true },
        });
      },
    });
  },
  async reconnectToStream() {
    return null;
  },
};

const chat = new (AbstractChat as any)({
  id: 'xbstack-stream-repro',
  state,
  transport,
  onError(error: Error) {
    errors.push(error.message);
  },
});

await chat.sendMessage();

const owner = state.messages.find((message: AnyMessage) => message.id === 'assistant-1');
assert.ok(owner, 'assistant-1 must remain present');
const ownerPart = owner.parts[0];

const result = {
  packageName,
  expectation: process.env.AI_EXPECTATION ?? 'broken',
  status: state.status,
  errors,
  ownerState: ownerPart.state,
  ownerOutput: ownerPart.output,
  messageIds: state.messages.map((message: AnyMessage) => message.id),
};

console.log(JSON.stringify(result, null, 2));

if ((process.env.AI_EXPECTATION ?? 'broken') === 'fixed') {
  assert.equal(state.status, 'ready');
  assert.equal(errors.length, 0);
  assert.deepEqual(ownerPart.output, { ok: true });
  console.log('STREAM_RESULT=fixed');
} else {
  assert.equal(state.status, 'error');
  assert.ok(errors.some(message => message.includes('No tool invocation found for tool call ID')));
  console.log('STREAM_RESULT=reproduced');
}
