export function Logo({ className = '' }: { className?: string }) {
  // Lowercase wordmark to match the "ai powered" style.
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        aria-hidden
        className="inline-block h-2.5 w-2.5 rotate-45 bg-bone"
      />
      <span className="text-[15px] tracking-tight text-bone lowercase">
        ai powered
      </span>
    </div>
  );
}
