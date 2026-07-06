export function CodeMentorMockup() {
  return (
    <div className="flex h-full min-h-[200px] bg-[#0d0d12] text-xs font-mono">
      <div className="w-1/2 border-r border-white/10 p-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-muted">Editor</p>
        <p className="text-cyan">function</p>{" "}
        <p className="inline text-foreground">review()</p> {"{"}
        <br />
        <span className="pl-4 text-muted">{"// your code here"}</span>
        <br />
        {"}"}
      </div>
      <div className="w-1/2 p-3">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-accent">AI Review</p>
        <p className="text-muted">✓ No bugs detected</p>
        <p className="text-muted">⚡ Performance: Good</p>
        <p className="text-accent">→ Suggestion: extract helper</p>
      </div>
    </div>
  );
}
