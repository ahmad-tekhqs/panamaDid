import { Link } from "react-router-dom";
import ampLogo from "@/assets/logo-amp-espanol.png";
import { useLanguage } from "@/contexts/LanguageContext";

const AMPFooter = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-amp-navy text-white">
      {/* Contact Section */}
      <div className="bg-amp-blue/80 py-10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h3 className="font-heading font-bold text-xl mb-6 uppercase">{t("footer.contact_title")}</h3>
          <p className="text-white/80 text-sm mb-8">
            {t("footer.contact_text")}
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <p className="text-sm text-left">Diablo Heights, Edificio 5534<br />{language === "es" ? "Ciudad de Panamá" : "Panama City"}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <p className="text-sm">+507 501-5000</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">✉️</span>
              <p className="text-sm">info@amp.gob.pa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo Section */}
            <div>
              <div className="flex flex-col items-start mb-4">
                <img 
                  src={ampLogo} 
                  alt="Autoridad Marítima de Panamá" 
                  className="h-[80px] w-auto bg-white rounded-lg p-2 mb-2"
                />
              </div>
            </div>
            
            {/* Enlaces */}
            <div>
              <h4 className="font-heading font-bold mb-4 text-sm uppercase">{t("footer.links")}</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/marina-mercante" className="hover:text-white transition-colors">{t("nav.merchant")}</Link></li>
                <li><Link to="/gente-de-mar" className="hover:text-white transition-colors">{t("nav.seafarers")}</Link></li>
                <li><Link to="/registro-naves" className="hover:text-white transition-colors">{t("nav.registry")}</Link></li>
                <li><Link to="/estadisticas" className="hover:text-white transition-colors">{t("nav.statistics")}</Link></li>
              </ul>
            </div>
            
            {/* Servicios */}
            <div>
              <h4 className="font-heading font-bold mb-4 text-sm uppercase">{t("footer.services")}</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><Link to="/registro" className="hover:text-white transition-colors">{t("reg.digital")}</Link></li>
                <li><a href="https://www.amp.gob.pa/consultas/consulta-y-verificacion-de-documentos/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t("nav.verification")}</a></li>
                <li><a href="https://www.amp.gob.pa/consultas/consultas-en-linea/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{t("nav.online")}</a></li>
              </ul>
            </div>
            
            {/* Emergency */}
            <div>
              <h4 className="font-heading font-bold mb-4 text-sm uppercase">{t("footer.emergency")}</h4>
              <div className="bg-panama-red/20 border border-panama-red/40 rounded-xl p-4">
                <p className="text-xs text-white/70 mb-1">{t("footer.emergency_line")}</p>
                <p className="font-bold text-xl">+507 501-5050</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4">
        <div className="container mx-auto px-4 lg:px-8 flex flex-wrap justify-between items-center gap-4">
          <p className="text-white/50 text-xs">
            {t("footer.rights")}
          </p>
          <p className="text-white/70 text-xs flex items-center gap-2">
            {t("footer.government")}
            <span className="text-panama-red font-semibold flex items-center gap-1">
              ★ Con Paso Firme ★
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AMPFooter;
