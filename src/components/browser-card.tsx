export function BrowserCard({
  title,
  rotate = "0deg",
  className = "",
}: {
  title: string;
  rotate?: string;
  className?: string;
}) {
  return (
    <div
      className={`glass-card-solid w-64 shrink-0 rounded-2xl p-4 ${className}`}
      style={{ transform: `rotate(${rotate})` }}
    >
      <div className="mb-3 flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>
      <p className="mb-4 text-sm font-semibold text-foreground">{title}</p>
      <div className="space-y-2">
        <div className="h-2 w-full rounded-full bg-white/10" />
        <div className="h-2 w-4/5 rounded-full bg-white/10" />
        <div className="h-2 w-2/3 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
