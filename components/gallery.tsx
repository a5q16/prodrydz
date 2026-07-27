import Image from "next/image";

export default function Gallery() {
  const items = [
    {
      title: "نسيج المايكروفايبر المزدوج (1400 GSM)",
      description: "ألياف ناعمة وحماية 100% لطلاء السيراميك والـ PPF",
      image: "/proof-4.jpg",
      tag: "حماية الطلاء",
    },
    {
      title: "امتصاص فائق بلمسة واحدة",
      description: "تجفيف 80% من الماء بسحبة واحدة بمساعدة الهواء او اشعة الشمس",
      image: "/proof-2.jpg",
      tag: "نتائج فورية",
    },
    {
      title: "مقاس مناسب يُسهل عملية التجفيف",
      description: "اختصار مجهود التجفيف وتفادي العصر المتكرر",
      image: "/proof-3.jpg",
      tag: "سعة فائقة",
    },
    {
      title: "بدون حواف حادة، بدون خيوط",
      description: "تفادي جرح او تخبيش هيكل سيارتك",
      image: "/proof-1.jpg",
      tag: "جودة احترافية",
    },
  ];

  return (
    <section id="gallery" className="py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            معاينة الأداء الواقعي
          </span>
          <h2 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            شاهد نتائج تجفيف <span className="text-accent">ProDry</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            صور واقعية تظهر أداء جفاف من مسحة واحدة وحماية كاملة للهيكل
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 transition-all duration-300 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
            >
              {/* Card Image */}
              <div className="relative h-48 w-full overflow-hidden sm:h-56">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index < 2}
                />
                <div className="absolute top-3 right-3 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-accent border border-accent/20">
                  {item.tag}
                </div>
              </div>

              {/* Text content */}
              <div className="p-5 text-right">
                <h3 className="text-base font-bold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
