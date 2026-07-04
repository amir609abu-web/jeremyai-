export function AmbientGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(52,225,122,0.12), transparent 60%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(52,225,122,0.08), transparent 60%)",
        }}
      />
      <div className="absolute start-1/2 top-[-12%] h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px] rtl:translate-x-1/2" />
      <div className="absolute -start-32 bottom-[-15%] h-[440px] w-[440px] rounded-full bg-primary/[0.09] blur-[120px]" />
      <div className="absolute -end-32 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/[0.08] blur-[110px]" />
      <div className="bg-noise absolute inset-0 opacity-[0.12]" />
    </div>
  );
}
