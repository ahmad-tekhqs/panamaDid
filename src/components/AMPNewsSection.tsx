import { useLanguage } from "@/contexts/LanguageContext";

const AMPNewsSection = () => {
  const { t, language } = useLanguage();

  const news = language === "es" ? [
    {
      title: "MAL TIEMPO AFECTA INFRAESTRUCTURAS Y OPERACIONES MARÍTIMAS EN COLÓN",
      date: "febrero 6, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/mal-tiempo-afecta-infraestructuras-y-operaciones-maritimas-en-colon/",
    },
    {
      title: "AMP Y AERONAVAL MONITOREAN NAVES ENCALLADAS EN COSTAS DE COLÓN",
      date: "febrero 4, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/amp-y-aeronaval-monitorean-naves-encalladas-en-costas-de-colon/",
    },
    {
      title: "PANAMÁ GARANTIZA CONTINUIDAD OPERATIVA EN PUERTOS ESTRATÉGICOS",
      date: "enero 30, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/panama-garantiza-continuidad-operativa-en-puertos-estrategicos/",
    },
    {
      title: "MÁS TRABAJADORES DEL MAR ACCEDEN A LA FORMALIDAD Y LA SEGURIDAD",
      date: "enero 27, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/mas-trabajadores-del-mar-acceden-a-la-formalidad-y-la-seguridad-licencias-maritimas-crecen-7-3-en-2025/",
    },
    {
      title: "PANAMÁ Y GUARDIA COSTERA DE EE.UU. INTERCAMBIAN EXPERIENCIAS",
      date: "enero 21, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/panama-y-guardia-costera-de-ee-uu-intercambian-experiencias-sobre-el-estado-rector-de-puerto/",
    },
    {
      title: "EMPRESARIOS DE COSTA RICA MANIFIESTAN INTERÉS EN PUERTO ARMUELLES",
      date: "enero 21, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/empresarios-de-costa-rica-manifiestan-interes-en-el-muelle-multiproposito-de-puerto-armuelles/",
    },
  ] : [
    {
      title: "BAD WEATHER AFFECTS MARITIME INFRASTRUCTURE AND OPERATIONS IN COLON",
      date: "February 6, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/mal-tiempo-afecta-infraestructuras-y-operaciones-maritimas-en-colon/",
    },
    {
      title: "AMP AND AERONAVAL MONITOR STRANDED VESSELS ON COLON COAST",
      date: "February 4, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/amp-y-aeronaval-monitorean-naves-encalladas-en-costas-de-colon/",
    },
    {
      title: "PANAMA GUARANTEES OPERATIONAL CONTINUITY AT STRATEGIC PORTS",
      date: "January 30, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/panama-garantiza-continuidad-operativa-en-puertos-estrategicos/",
    },
    {
      title: "MORE MARITIME WORKERS ACCESS FORMALITY AND SAFETY",
      date: "January 27, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/mas-trabajadores-del-mar-acceden-a-la-formalidad-y-la-seguridad-licencias-maritimas-crecen-7-3-en-2025/",
    },
    {
      title: "PANAMA AND U.S. COAST GUARD EXCHANGE EXPERIENCES",
      date: "January 21, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/panama-y-guardia-costera-de-ee-uu-intercambian-experiencias-sobre-el-estado-rector-de-puerto/",
    },
    {
      title: "COSTA RICA BUSINESSMEN EXPRESS INTEREST IN PUERTO ARMUELLES",
      date: "January 21, 2026",
      href: "https://www.amp.gob.pa/noticias/notas-de-prensa/empresarios-de-costa-rica-manifiestan-interes-en-el-muelle-multiproposito-de-puerto-armuelles/",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="font-heading font-bold text-2xl text-amp-navy mb-8 text-center uppercase">
          {t("news.title")}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all group hover:border-amp-blue"
            >
              <h3 className="font-heading font-semibold text-sm text-gray-800 group-hover:text-amp-blue transition-colors leading-tight mb-3">
                {item.title}
              </h3>
              <p className="text-gray-400 text-xs">{item.date}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AMPNewsSection;
