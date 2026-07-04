export function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(52,225,122,0.07), rgba(52,225,122,0.025) 15%, rgba(52,225,122,0.05) 35%, rgba(52,225,122,0.025) 55%, rgba(52,225,122,0.06) 75%, rgba(52,225,122,0.03) 90%, rgba(52,225,122,0.06))",
        }}
      />
      <div className="absolute start-1/2 top-[6%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px] rtl:translate-x-1/2" />
      <div className="absolute -start-40 top-[24%] h-[440px] w-[440px] rounded-full bg-primary/[0.09] blur-[110px]" />
      <div className="absolute -end-40 top-[42%] h-[460px] w-[460px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute start-1/4 top-[60%] h-[420px] w-[420px] rounded-full bg-primary/[0.09] blur-[110px]" />
      <div className="absolute -end-32 top-[77%] h-[460px] w-[460px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute start-1/3 top-[93%] h-[400px] w-[400px] rounded-full bg-primary/[0.08] blur-[110px]" />
      <div className="bg-noise absolute inset-0 opacity-[0.15]" />
    </div>
  );
}
