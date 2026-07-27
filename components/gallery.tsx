export default function Gallery() {
  const items = [
    {
      title: "امتصاص فائق بلمسة واحدة",
      description: "تجفيف سقف وجوانب السيارة بدون ترك قطرة ماء واحدة",
      tag: "نتائج فورية",
    },
    {
      title: "نسيج المايكروفايبر المزدوج (1400 GSM)",
      description: "ألياف ناعمة وحماية 100% لطلاء السيراميك والـ PPF",
      tag: "حماية الطلاء",
    },
    {
      title: "بدون خيوط أو دوامات",
      description: "تنظيف وتجفيف نقي يعيد لمعان سيارتك كأنها جديدة",
      tag: "جودة احترافية",
    },
    {
      title: "مقاس كبير (50×70 سم)",
      description: "يكفي لتجفيف هيكل سيارة كاملة بمسحة واحدة دون عصر",
      tag: "سعة فائقة",
    },
  ];

  return (
    <section id="gallery" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            معاينة الأداء
          </span>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            شاهد نتائج تجفيف <span className="text-accent">ProDry</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            أداء عالي واحترافي يضمن حماية طلاء سيارتك من الخدوش
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
            >
              {/* Visual Placeholder Box */}
              <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border border-border/40 bg-slate-900/60">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground p-4 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent group-hover:scale-110 transition-transform">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-foreground/80">{item.title}</span>
                </div>
              </div>

              {/* Text content */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
