export function Mark({ className = "size-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="8" className="fill-fg" />
      <path
        d="M16 18 L32 32 L16 46"
        stroke="currentColor"
        className="text-accent"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 46 H50"
        stroke="currentColor"
        className="text-accent"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
