import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import ampLogo from "@/assets/logo-amp-espanol.png";
import gobiernoLogo from "@/assets/gobierno-nacional.png";
import { useLanguage } from "@/contexts/LanguageContext";

const AMPHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-[95px]">
          {/* Logo - Official AMP Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src={ampLogo} 
              alt="Autoridad Marítima de Panamá" 
              className="h-[80px] w-auto"
            />
          </Link>

          {/* Search Bar - Center */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder=""
                className="w-full h-11 pl-12 pr-4 bg-white border border-gray-300 rounded-full focus:border-amp-blue focus:outline-none text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Right Side - Language Toggle, Menu & Government Logo */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 hover:border-amp-blue transition-colors"
              title={language === "es" ? "Switch to English" : "Cambiar a Español"}
            >
              {language === "es" ? (
                <>
                  <span className="text-lg">🇺🇸</span>
                  <span className="text-xs font-semibold text-amp-navy hidden sm:inline">EN</span>
                </>
              ) : (
                <>
                  <span className="text-lg">🇵🇦</span>
                  <span className="text-xs font-semibold text-amp-navy hidden sm:inline">ES</span>
                </>
              )}
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 rounded-full border-2 border-amp-navy flex items-center justify-center hover:bg-amp-navy hover:text-white transition-colors group"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-amp-navy group-hover:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-amp-navy group-hover:text-white" />
              )}
            </button>

            {/* Government Logo - Gobierno Nacional Con Paso Firme */}
            <div className="hidden lg:block">
              <img 
                src={gobiernoLogo} 
                alt="Gobierno Nacional - Con Paso Firme" 
                className="h-[60px] w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-amp-navy shadow-xl">
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-heading font-bold text-white text-lg mb-4 pb-2 border-b border-white/20">{t("nav.about")}</h3>
                <ul className="space-y-2">
                  <li><Link to="/quienes-somos" onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-white text-sm">{t("nav.who")}</Link></li>
                  <li><Link to="/organigrama" onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-white text-sm">{t("nav.structure")}</Link></li>
                  <li><Link to="/funciones" onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-white text-sm">{t("nav.functions")}</Link></li>
                  <li><Link to="/marco-legal" onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-white text-sm">{t("nav.legal")}</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-lg mb-4 pb-2 border-b border-white/20">{t("nav.services")}</h3>
                <ul className="space-y-2">
                  <li><Link to="/marina-mercante" onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-white text-sm">{t("nav.merchant")}</Link></li>
                  <li><Link to="/gente-de-mar" onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-white text-sm">{t("nav.seafarers")}</Link></li>
                  <li><Link to="/registro-naves" onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-white text-sm">{t("nav.registry")}</Link></li>
                  <li><Link to="/puertos" onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-white text-sm">{t("nav.ports")}</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-lg mb-4 pb-2 border-b border-white/20">{t("nav.queries")}</h3>
                <ul className="space-y-2">
                  <li><Link to="/registro-naves" onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-white text-sm">{t("nav.ships")}</Link></li>
                  <li><a href="https://www.amp.gob.pa/consultas/consulta-y-verificacion-de-documentos/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm">{t("nav.verification")}</a></li>
                  <li><Link to="/estadisticas" onClick={() => setIsMenuOpen(false)} className="text-white/70 hover:text-white text-sm">{t("nav.statistics")}</Link></li>
                  <li><a href="https://www.amp.gob.pa/consultas/consultas-en-linea/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm">{t("nav.online")}</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-lg mb-4 pb-2 border-b border-white/20">{t("nav.contact")}</h3>
                <p className="text-white/70 text-sm mb-2">{t("nav.phone")}: +507 501-5000</p>
                <a 
                  href="https://www.amp.gob.pa/lineas-de-emergencia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-panama-red text-sm font-bold hover:underline"
                >
                  {language === "es" ? "Líneas de Emergencia" : "Emergency Lines"}
                </a>
                <Link 
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-block mt-4 bg-panama-red text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 transition-colors"
                >
                  {language === "es" ? "Iniciar Sesión" : "Login"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AMPHeader;
