for (const name of ['ai-old', 'ai-new']) {
  const mod = await import(name);
  console.log(name);
  console.log(Object.keys(mod).filter(k => /Chat|Transport|UIMessage/.test(k)).sort().join('\n'));
}
