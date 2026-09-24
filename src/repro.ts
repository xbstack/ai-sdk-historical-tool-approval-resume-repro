import assert from 'node:assert/strict';

type AnyMessage = {
  id: string;
  role: 'user' | 'assistant';
  parts: any[];
};

const packageName = process.env.AI_PACKAGE ?? 'ai-broken';
const { AbstractChat } = await import(packageName);

class MemoryState {
  messages: AnyMessage[];
  status: 'ready' | 'submitted' | 'streaming' | 'error' = 'ready';
  error: unknown;

  constructor(messages: AnyMessage[]) {
    this.messages = structuredClone(messages);
  }

  pushMessage(message: AnyMessage) {
    this.messages.push(message);
  }

  replaceMessage(index: number, message: AnyMessage) {
    this.messages[index] = message;
  }

  snapshot(message: AnyMessage) {
    return structuredClone(message);
  }
}

function toolApprovalMessage(id = 'assistant-approval'): AnyMessage {
  return {
    id,
    role: 'assistant',
    parts: [
      {
        type: 'tool-chargeCard',
        toolCallId: 'call-1',
        state: 'approval-requested',
        input: { amount: 2500 },
        approval: { id: 'approval-1' },
      },
    ],
  };
}

function laterConversation(): AnyMessage[] {
  return [
    {
      id: 'user-later',
      role: 'user',
      parts: [{ type: 'text', text: 'What is the status?' }],
    },
    {
      id: 'assistant-later',
      role: 'assistant',
      parts: [{ type: 'text', text: 'Still waiting for approval.' }],
    },
  ];
}

function approvalState(messages: AnyMessage[]) {
  const owning = messages.find(message => message.id === 'assistant-approval');
  const part = owning?.parts.find(part => part.toolCallId === 'call-1');
  return part?.state;
}

async function runLatestControl() {
  const state = new MemoryState([toolApprovalMessage()]);
  const chat = new (AbstractChat as any)({ state });
  await chat.addToolApprovalResponse({ id: 'approval-1', approved: true });

  const observed = approvalState(state.messages);
  console.log('latest-message approve:', observed);
  assert.equal(observed, 'approval-responded');
}

async function runHistoricalApprove() {
  const state = new MemoryState([toolApprovalMessage(), ...laterConversation()]);
  const chat = new (AbstractChat as any)({ state });
  await chat.addToolApprovalResponse({ id: 'approval-1', approved: true });

  const observed = approvalState(state.messages);
  console.log('historical-message approve:', observed);
  return observed;
}

async function runHistoricalReject() {
  const state = new MemoryState([toolApprovalMessage(), ...laterConversation()]);
  const chat = new (AbstractChat as any)({ state });
  await chat.addToolApprovalResponse({
    id: 'approval-1',
    approved: false,
    reason: 'Not now',
  });

  const observed = approvalState(state.messages);
  console.log('historical-message reject:', observed);
  return observed;
}

await runLatestControl();

const approve = await runHistoricalApprove();
const reject = await runHistoricalReject();

console.log(
  JSON.stringify(
    {
      packageName,
      expectation: process.env.AI_EXPECTATION ?? 'broken',
      latestControl: 'approval-responded',
      historicalApprove: approve,
      historicalReject: reject,
    },
    null,
    2,
  ),
);

if ((process.env.AI_EXPECTATION ?? 'broken') === 'broken') {
  assert.equal(approve, 'approval-requested');
  assert.equal(reject, 'approval-requested');
} else {
  assert.equal(approve, 'approval-responded');
  assert.equal(reject, 'approval-responded');
}
