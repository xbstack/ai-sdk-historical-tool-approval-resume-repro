import assert from 'node:assert/strict';
import { AbstractChat } from 'ai';

type AnyMessage = {
  id: string;
  role: 'user' | 'assistant';
  parts: any[];
};

function makeState(messages: AnyMessage[]) {
  return {
    messages: structuredClone(messages),
    status: 'ready',
    error: undefined,
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

function makeChat(messages: AnyMessage[]) {
  const state = makeState(messages);
  const chat = new (AbstractChat as any)({
    id: 'xbstack-historical-approval-repro',
    state,
    transport: {
      async sendMessages() {
        throw new Error('transport should not be called in this state-only reproduction');
      },
      async reconnectToStream() {
        return null;
      },
    },
  });
  return { chat, state };
}

const historicalMessages: AnyMessage[] = [
  {
    id: 'user-1',
    role: 'user',
    parts: [{ type: 'text', text: 'Run the risky tool.' }],
  },
  {
    id: 'assistant-1',
    role: 'assistant',
    parts: [
      {
        type: 'tool-riskyAction',
        toolCallId: 'call-1',
        state: 'approval-requested',
        input: { value: 1 },
        approval: { id: 'approval-1' },
      },
    ],
  },
  {
    id: 'user-2',
    role: 'user',
    parts: [{ type: 'text', text: 'Before deciding, tell me something else.' }],
  },
  {
    id: 'assistant-2',
    role: 'assistant',
    parts: [{ type: 'text', text: 'Later assistant turn.' }],
  },
];

const latestMessages: AnyMessage[] = historicalMessages.slice(0, 2);

async function runCase(name: string, messages: AnyMessage[], approved: boolean) {
  const { chat, state } = makeChat(messages);
  await chat.addToolApprovalResponse({
    id: 'approval-1',
    approved,
    reason: approved ? 'approved in test' : 'rejected in test',
  });

  const owner = state.messages.find((message: AnyMessage) => message.id === 'assistant-1');
  assert.ok(owner, 'assistant-1 must exist in the fixture');
  const part = owner.parts[0];

  const result = {
    case: name,
    approved,
    ownerState: part.state,
    ownerApproval: part.approval,
    lastMessageId: state.messages[state.messages.length - 1].id,
    laterMessagePreserved:
      state.messages.length === messages.length &&
      state.messages[state.messages.length - 1].id === messages[messages.length - 1].id,
  };

  console.log(JSON.stringify(result));
  return result;
}

const latestApprove = await runCase('latest-message-approve-control', latestMessages, true);
assert.equal(latestApprove.ownerState, 'approval-responded');

const historicalApprove = await runCase('historical-message-approve', historicalMessages, true);
const historicalReject = await runCase('historical-message-reject', historicalMessages, false);

const expectedFixed = process.env.EXPECT_FIXED === '1';

if (expectedFixed) {
  assert.equal(historicalApprove.ownerState, 'approval-responded');
  assert.equal(historicalReject.ownerState, 'approval-responded');
  assert.equal(historicalApprove.laterMessagePreserved, true);
  assert.equal(historicalReject.laterMessagePreserved, true);
  console.log('RESULT=fixed');
} else {
  assert.equal(historicalApprove.ownerState, 'approval-requested');
  assert.equal(historicalReject.ownerState, 'approval-requested');
  console.log('RESULT=reproduced');
}
