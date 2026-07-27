export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-16"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Trust badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            ⭐ ضمان الجودة — استرجاع مؤكد في حال عدم الرضا
          </span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-center text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
          منشفة التجفيف الاحترافية بتقنية المايكروفايبر{" "}
          <span className="text-accent">الممتصة لكل قطرة ماء</span>
          <br className="hidden sm:block" />
          <span className="mt-2 block text-xl font-medium text-muted-foreground sm:text-2xl md:text-3xl">
            جفاف تام من مسحة واحدة بدون خيوط أو خدوش.
          </span>
        </h1>

        {/* 9:16 Vertical Promo Video Container */}
        <div className="mx-auto mt-8 sm:mt-10">
          <div className="relative w-full max-w-[320px] sm:max-w-sm mx-auto aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border border-accent/30 bg-slate-900/80">
            <video
              src="/promo.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:text-sm">
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            الدفع عند الاستلام
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25V3.75a1.125 1.125 0 011.125-1.125h14.25a1.125 1.125 0 011.125 1.125v10.5m0 0L18 18.75m0-4.5h3.375" />
            </svg>
            توصيل لـ 58 ولاية
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
            جودة احترافية
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            🛡️ ضمان استرجاع المنتج
          </span>
        </div>
      </div>
    </section>
  );
}
