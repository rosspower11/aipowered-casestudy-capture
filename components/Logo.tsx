export function Logo({ className = '' }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="ai powered"
      className={`h-5 w-auto ${className}`}
    />
  );
}
