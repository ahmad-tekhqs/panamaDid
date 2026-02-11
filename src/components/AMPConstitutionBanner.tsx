import { useLanguage } from "@/contexts/LanguageContext";

const AMPConstitutionBanner = () => {
  const { language } = useLanguage();

  return (
    <section className="relative">
      {/* Navy wave background with curved top */}
      <div className="bg-amp-navy pt-16 pb-8">
        {/* Curved wave SVG at top */}
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="absolute -top-1 left-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H0Z"
            fill="#002856"
          />
        </svg>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block bg-amp-navy border-2 border-white/30 px-10 py-4 rounded-lg">
            <p className="font-heading font-bold text-white text-base lg:text-lg tracking-wide">
              {language === "es" 
                ? "2026: HACIA UNA NUEVA CONSTITUCIÓN"
                : "2026: TOWARDS A NEW CONSTITUTION"
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AMPConstitutionBanner;
