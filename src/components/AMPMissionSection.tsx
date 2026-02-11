import { useLanguage } from "@/contexts/LanguageContext";

const AMPMissionSection = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-amp-blue">
            <h3 className="font-heading font-bold text-lg text-amp-navy mb-4 uppercase">
              {t("mission.title")}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {language === "es" 
                ? "Brindamos servicio de alta calidad a la industria marítima, garantizando la seguridad jurídica, libre empresa y mercado competitivo; a través del cumplimiento de normativas nacionales e internacionales, en un marco de transparencia y responsabilidad social ambiental."
                : "We provide high-quality service to the maritime industry, ensuring legal security, free enterprise and competitive market; through compliance with national and international regulations, in a framework of transparency and environmental social responsibility."
              }
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-panama-red">
            <h3 className="font-heading font-bold text-lg text-amp-navy mb-4 uppercase">
              {t("vision.title")}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {language === "es"
                ? "Ser líderes en la prestación de servicios marítimos, logísticos y portuarios, promoviendo inversiones y alianzas estratégicas que fortalecen el comercio, mediante procesos eficientes e innovadores, con el mejor talento humano; logrando un crecimiento económico sostenible para el país."
                : "Be leaders in the provision of maritime, logistics and port services, promoting investments and strategic alliances that strengthen trade, through efficient and innovative processes, with the best human talent; achieving sustainable economic growth for the country."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AMPMissionSection;
