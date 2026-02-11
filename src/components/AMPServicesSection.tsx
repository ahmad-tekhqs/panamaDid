import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const AMPServicesSection = () => {
  const { t, language } = useLanguage();

  const services = [
    {
      icon: "🚢",
      titleKey: "services.merchant.title",
      href: "/marina-mercante",
    },
    {
      icon: "👥",
      titleKey: "services.seafarers.title",
      href: "/gente-de-mar",
      highlight: true,
    },
    {
      icon: "📋",
      titleKey: "services.registry.title",
      href: "/registro-naves",
    },
    {
      icon: "⚓",
      titleKey: "services.ports.title",
      href: "/puertos",
    },
  ];

  const quickLinks = [
    { icon: "📊", labelKey: "nav.statistics", href: "/estadisticas" },
    { icon: "✓", label: language === "es" ? "SISTEMA DE GESTIÓN DE CALIDAD" : "QUALITY MANAGEMENT SYSTEM", href: "/gestion-calidad" },
    { icon: "📁", label: language === "es" ? "GESTIÓN AMP" : "AMP MANAGEMENT", href: "/gestion-amp" },
    { icon: "🛒", label: language === "es" ? "AMP COMPRAS" : "AMP PROCUREMENT", href: "/compras" },
  ];

  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Services Grid - 4 columns like AMP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.href}
              className="relative bg-gradient-to-br from-amp-blue to-amp-navy p-6 rounded-xl text-center transition-all hover:shadow-xl group min-h-[180px] flex flex-col items-center justify-center"
            >
              <span className="text-4xl mb-4 block">{service.icon}</span>
              <h3 className="font-heading font-bold text-white text-sm lg:text-base leading-tight mb-3 uppercase">
                {t(service.titleKey)}
              </h3>
              <span className="text-white/80 text-xs inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                {language === "es" ? "Más Información" : "More Info"}
                <ArrowRight className="w-3 h-3" />
              </span>
              {service.highlight && (
                <div className="absolute top-2 right-2 bg-panama-red text-white text-[9px] font-bold px-2 py-1 rounded">
                  {language === "es" ? "GENTE DE MAR" : "SEAFARERS"}
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Quick Links - 4 columns like AMP site */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center hover:shadow-md transition-all hover:border-amp-blue"
            >
              <span className="text-3xl mb-2 block">{link.icon}</span>
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                {link.labelKey ? t(link.labelKey) : link.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AMPServicesSection;
