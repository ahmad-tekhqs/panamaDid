import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ampBuilding from "@/assets/amp-building.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const AMPHeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, language } = useLanguage();

  const stats = [
    { value: "8,728", labelKey: "stats.vessels" },
    { value: language === "es" ? "236.9 millones" : "236.9 million", labelKey: "stats.tonnage" },
    { value: "B/. 112 millones", labelKey: "stats.revenue" },
    { value: "467,682", labelKey: "stats.docs" },
  ];

  const slides = [
    { titleKey: "hero.slide1.title", subtitleKey: "hero.slide1.subtitle" },
    { titleKey: "hero.slide2.title", subtitleKey: "hero.slide2.subtitle" },
    { titleKey: "hero.slide3.title", subtitleKey: "hero.slide3.subtitle" },
    { titleKey: "hero.slide4.title", subtitleKey: "hero.slide4.subtitle" },
    { titleKey: "hero.slide5.title", subtitleKey: "hero.slide5.subtitle" },
    { titleKey: "hero.slide6.title", subtitleKey: "hero.slide6.subtitle" },
    { titleKey: "hero.slide7.title", subtitleKey: "hero.slide7.subtitle" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[600px] lg:h-[650px] mt-[95px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${ampBuilding})` }}
      >
        {/* Gradient overlay to match AMP site */}
        <div className="absolute inset-0 bg-gradient-to-r from-amp-navy/60 via-amp-navy/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-opacity duration-700 ${
                  index === currentSlide ? "block" : "hidden"
                }`}
              >
                <h1 className="font-heading font-black text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-none mb-4 uppercase">
                  {t(slide.titleKey)}
                </h1>
                {t(slide.subtitleKey) && (
                  <p className="text-white/90 text-2xl md:text-3xl italic font-light font-montserrat">
                    {t(slide.subtitleKey)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Circle style like AMP site */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Emergency Link - Top Right corner like original */}
      <Link
        to="#"
        className="absolute top-8 right-8 flex items-center gap-3 text-white z-20"
      >
        <div className="text-right text-sm">
          <p className="text-white/80">{t("emergency.lines")}</p>
          <p className="font-bold text-white">{t("emergency.title")}</p>
        </div>
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl">👆</span>
        </div>
      </Link>

      {/* Stats Bar - Bottom, matches exact AMP styling */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-20">
        <div className="bg-amp-blue rounded-t-xl overflow-hidden border-t border-l border-r border-white/20">
          <div className="grid grid-cols-4 divide-x divide-white/20">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 lg:p-6 text-center text-white">
                <p className="font-heading font-bold text-lg lg:text-xl">
                  {stat.value}
                </p>
                <p className="text-[9px] lg:text-[10px] mt-1 text-white/80 uppercase leading-tight tracking-wide">
                  {t(stat.labelKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Registration Button - Floating Red - positioned like AMP's action buttons */}
      <Link
        to="/registro"
        className="absolute bottom-32 right-8 z-30 bg-panama-red hover:bg-red-800 text-white px-5 py-3 rounded-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group"
      >
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-xl">📋</span>
        </div>
        <div className="text-left">
          <p className="text-[10px] opacity-80">{t("reg.new")}</p>
          <p className="font-bold text-sm">{t("reg.digital")}</p>
        </div>
      </Link>
    </section>
  );
};

export default AMPHeroSlider;
