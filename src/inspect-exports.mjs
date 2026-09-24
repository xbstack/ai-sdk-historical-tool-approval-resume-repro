import * as ai from 'ai';
import * as test from 'ai/test';

console.log('ai exports');
console.log(Object.keys(ai).filter(k => /Chat|Transport|UIMessage|Stream/.test(k)).sort().join('\n'));
console.log('\nai/test exports');
console.log(Object.keys(test).filter(k => /Chat|Transport|UIMessage|Stream/.test(k)).sort().join('\n'));
