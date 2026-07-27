const benefits = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
    title: "نسيج Twisted Loop مزدوج الوجه",
    description:
      "تقنية الألياف الملتوية تمتص الماء بسرعة فائقة وتمنع ترك أي خدوش أو خيوط على سطح السيارة.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
    title: "كثافة 1400 GSM — امتصاص فائق",
    description:
      "كثافة 1400 GSM تمنحك قدرة امتصاص فائقة لتجفيف هيكل سيارة كاملة بمسحة واحدة دون الحاجة لعصر المنشفة متكرراً.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "آمنة 100% على جميع أنواع الطلاء",
    description:
      "حماية فائقة لطلاء سيارتك من الخدوش والدوامات مقارنة بالمناشف العادية — مثالية للطلاء السيراميك، PPF، والعادي.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            لماذا <span className="text-accent">ProDry</span>؟
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ليست مجرد فوطة — إنها أداة احترافية للعناية بسيارتك
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              {/* Accent glow on hover */}
              <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  {benefit.icon}
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
