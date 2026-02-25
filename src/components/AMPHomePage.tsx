'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// CONSTANTS
// ============================================================================

const AMP_LOGO = 'https://www.amp.gob.pa/wp-content/uploads/2022/05/Logo-AMP-espanol.png';
const GOB_LOGO = 'https://www.amp.gob.pa/wp-content/uploads/2022/05/Gobierno-Nacional.png';

const SLIDES = [
  { title: 'SOLIDEZ Y EXCELENCIA', subtitle: 'En el sector marítimo', bg: 'from-[#052457] via-[#0a3d7a] to-[#1565c0]' },
  { title: 'HUB LOGÍSTICO', subtitle: 'De excelencia global', bg: 'from-[#0d2137] via-[#052457] to-[#0a4a8a]' },
  { title: 'ESTADO DE BANDERA', subtitle: 'Ideal para tu embarcación', bg: 'from-[#001a3a] via-[#052457] to-[#005EB8]' },
  { title: 'EFICIENCIA OPERATIVA', subtitle: 'En el sector marítimo', bg: 'from-[#052457] via-[#003366] to-[#004488]' },
  { title: 'EL REGISTRO', subtitle: 'Más confiable del mundo', bg: 'from-[#0d2137] via-[#052457] to-[#1565c0]' },
  { title: 'NAVEGA CON PANAMÁ', subtitle: '', bg: 'from-[#001a3a] via-[#052457] to-[#0a4a8a]' },
  { title: 'MANO DE OBRA PANAMEÑA', subtitle: 'La garantía en cada travesía', bg: 'from-[#052457] via-[#0a3d7a] to-[#005EB8]' },
];

const STATS = [
  { value: '8,722', label: 'Buques Abandonados' },
  { value: '236.8 millones', label: 'Toneladas de Registro Bruto' },
  { value: 'B/.112 millones', label: 'Ingreso anual al Tesoro Nacional' },
  { value: '467,682', label: 'Documentación Técnica emitida a Gente de Mar' },
];

const NEWS_ITEMS = [
  {
    title: 'OFICIALIZAN EN CHIRIQUÍ CONSULTORÍA DEL BID AL MUELLE MULTIPROPÓSITO DE PUERTO ARMUELLES',
    date: 'enero 5, 2026',
    href: 'https://www.amp.gob.pa/noticias/notas-de-prensa/oficializan-en-chiriqui-consultoria-del-bid-al-muelle-multiproposito-de-puerto-armuelles/',
  },
  {
    title: 'AMP SE SUMA AL OPERATIVO GUARDIANES 2026 PARA FORTALECER LA SEGURIDAD MARÍTIMA EN CARNAVALES',
    date: 'diciembre 30, 2025',
    href: 'https://www.amp.gob.pa/noticias/notas-de-prensa/amp-se-suma-al-operativo-guardianes-2026-para-fortalecer-la-seguridad-maritima-en-carnavales/',
  },
  {
    title: 'LA AUTORIDAD MARÍTIMA DE PANAMÁ AUTORIZA EL COBRO POR USO DE ÁREAS MARÍTIMAS',
    date: 'diciembre 18, 2025',
    href: 'https://www.amp.gob.pa/noticias/notas-de-prensa/la-autoridad-maritima-de-panama-autoriza-el-cobro-por-uso-de-areas-maritimas/',
  },
  {
    title: 'JICA Y AMP REVISAN PROYECTOS ESTRATÉGICOS PARA IMPULSAR EL SECTOR MARÍTIMO PANAMEÑO',
    date: 'diciembre 15, 2025',
    href: 'https://www.amp.gob.pa/noticias/notas-de-prensa/jica-y-amp-revisan-proyectos-estrategicos-para-impulsar-el-sector-maritimo-panameno/',
  },
  {
    title: 'AMP DIGITALIZA LICENCIAS CON CÓDIGOS QR PARA BLINDAR LA TRANSPARENCIA EN EL SECTOR MARÍTIMO',
    date: 'diciembre 9, 2025',
    href: 'https://www.amp.gob.pa/sin-categorizar/amp-digitaliza-licencias-con-codigos-qr-para-blindar-la-transparencia-en-el-sector-maritimo-2/',
  },
  {
    title: 'PANAMÁ ES REELECTO EN LA CATEGORÍA A DEL CONSEJO DE LA OMI DURANTE LA 34ª ASAMBLEA',
    date: 'noviembre 28, 2025',
    href: 'https://www.amp.gob.pa/noticias/notas-de-prensa/panama-es-reelecto-en-la-categoria-a-del-consejo-de-la-omi-durante-la-34a-asamblea/',
  },
];

const SERVICES = [
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
        <path d="M8 48h48M12 48V28l20-16 20 16v20M20 48V36h8v12M36 48V36h8v12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32 12l-4-4M32 12l4-4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="32" cy="26" r="3" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    title: 'MARINA MERCANTE',
    href: 'https://www.amp.gob.pa/servicios/marina-mercante/',
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
        <circle cx="32" cy="18" r="8" stroke="white" strokeWidth="2.5"/>
        <path d="M16 48c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="18" cy="22" r="5" stroke="white" strokeWidth="2"/>
        <circle cx="46" cy="22" r="5" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    title: 'GENTE DE MAR',
    href: 'https://www.amp.gob.pa/servicios/gente-mar/',
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
        <rect x="12" y="8" width="40" height="48" rx="3" stroke="white" strokeWidth="2.5"/>
        <path d="M20 20h24M20 28h24M20 36h16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M36 44l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'REGISTRO PÚBLICO',
    href: 'https://www.amp.gob.pa/servicios/registro-publico-de-naves/tipos-de-inscripcion/',
  },
  {
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12">
        <path d="M32 56c0-8-16-12-16-24a16 16 0 0132 0c0 12-16 16-16 24z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
        <circle cx="32" cy="28" r="6" stroke="white" strokeWidth="2"/>
        <path d="M8 52h48" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"/>
      </svg>
    ),
    title: 'PUERTOS E INDUSTRIAS MARÍTIMAS AUXILIARES',
    href: 'https://www.amp.gob.pa/servicios/puertos-e-industrias-maritimas-auxiliares/',
  },
];

const QUICK_LINKS = [
  { icon: '📊', label: 'ESTADÍSTICAS', href: 'https://www.amp.gob.pa/estadistica/' },
  { icon: '✓', label: 'SISTEMA DE GESTIÓN DE CALIDAD', href: 'https://www.amp.gob.pa/sistema-de-gestion-de-calidad/' },
  { icon: '🛒', label: 'AMP COMPRAS', href: 'https://www.amp.gob.pa/amp-compras/' },
];

// ============================================================================
// HEADER COMPONENT
// ============================================================================

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-[90px]">
          {/* AMP Logo */}
          <a href="https://www.amp.gob.pa/" className="flex-shrink-0" target="_blank" rel="noopener noreferrer">
            <img
              src={AMP_LOGO}
              alt="Autoridad Marítima de Panamá"
              className="h-[70px] w-auto"
            />
          </a>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full h-10 pl-10 pr-4 bg-white border border-gray-300 rounded-full focus:border-[#005EB8] focus:outline-none focus:ring-1 focus:ring-[#005EB8] text-sm text-gray-700"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* DID Button */}
            <button
              onClick={() => router.push('/gente-de-mar')}
              className="hidden sm:flex items-center gap-2 bg-[#D8131B] hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
              Pase Portuario Digital
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full border-2 border-[#052457] flex items-center justify-center hover:bg-[#052457] hover:text-white transition-colors group"
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5 text-[#052457] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-[#052457] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Government Logo */}
            <div className="hidden lg:block">
              <img
                src={GOB_LOGO}
                alt="Gobierno Nacional - Con Paso Firme"
                className="h-[55px] w-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-[#052457] shadow-2xl z-50"
          >
            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <h3 className="font-bold text-white text-lg mb-4 pb-2 border-b border-white/20">La AMP</h3>
                  <ul className="space-y-2">
                    <li><a href="https://www.amp.gob.pa/quienes-somos/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Quiénes Somos</a></li>
                    <li><a href="https://www.amp.gob.pa/organigrama/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Organigrama</a></li>
                    <li><a href="https://www.amp.gob.pa/funciones/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Funciones</a></li>
                    <li><a href="https://www.amp.gob.pa/marco-legal/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Marco Legal</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-4 pb-2 border-b border-white/20">Servicios</h3>
                  <ul className="space-y-2">
                    <li><a href="https://www.amp.gob.pa/servicios/marina-mercante/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Marina Mercante</a></li>
                    <li><a href="https://www.amp.gob.pa/servicios/gente-mar/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Gente de Mar</a></li>
                    <li><a href="https://www.amp.gob.pa/servicios/registro-publico-de-naves/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Registro de Naves</a></li>
                    <li><a href="https://www.amp.gob.pa/servicios/puertos-e-industrias-maritimas-auxiliares/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Puertos e Industrias</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-4 pb-2 border-b border-white/20">Consultas</h3>
                  <ul className="space-y-2">
                    <li><a href="https://www.amp.gob.pa/consultas/registro-de-naves/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Registro de Naves</a></li>
                    <li><a href="https://www.amp.gob.pa/consultas/consulta-y-verificacion-de-documentos/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Verificación de Documentos</a></li>
                    <li><a href="https://www.amp.gob.pa/estadistica/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Estadísticas</a></li>
                    <li><a href="https://www.amp.gob.pa/consultas/consultas-en-linea/" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white text-sm transition-colors">Consultas en Línea</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-4 pb-2 border-b border-white/20">Contacto</h3>
                  <p className="text-white/70 text-sm mb-2">Teléfono: +507 501-5000</p>
                  <a
                    href="https://www.amp.gob.pa/lineas-de-emergencia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-[#D8131B] text-sm font-bold hover:underline"
                  >
                    Líneas de Emergencia
                  </a>
                  <button
                    onClick={() => { setIsMenuOpen(false); router.push('/gente-de-mar'); }}
                    className="block mt-4 bg-[#D8131B] text-white px-4 py-2 rounded text-sm font-bold hover:bg-red-700 transition-colors"
                  >
                    Pase Portuario Digital (DPP)
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ============================================================================
// HERO SLIDER COMPONENT
// ============================================================================

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  return (
    <section className="relative h-[500px] sm:h-[550px] lg:h-[650px] mt-[90px] overflow-hidden">
      {/* Animated Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${SLIDES[currentSlide].bg}`}
        >
          {/* Maritime pattern overlay */}
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />

          {/* Wave effect at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Radial light effect */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)',
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white tracking-tight leading-none mb-4 uppercase">
                  {SLIDES[currentSlide].title}
                </h1>
                {SLIDES[currentSlide].subtitle && (
                  <p className="text-white/90 text-xl sm:text-2xl md:text-3xl italic font-light">
                    {SLIDES[currentSlide].subtitle}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors z-20"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Emergency Lines Link */}
      <a
        href="https://www.amp.gob.pa/lineas-de-emergencia/"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-3 text-white z-20 hover:opacity-80 transition-opacity"
      >
        <div className="text-right text-xs sm:text-sm hidden sm:block">
          <p className="text-white/70">Líneas de</p>
          <p className="font-bold text-white">emergencia</p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <img
            src="https://www.amp.gob.pa/wp-content/uploads/2018/06/hand.png"
            alt="Emergency"
            className="w-6 h-6 sm:w-7 sm:h-7"
          />
        </div>
      </a>

      {/* DID Registration Button - Floating */}
      <button
        onClick={() => router.push('/gente-de-mar')}
        className="absolute bottom-28 sm:bottom-32 right-4 sm:right-8 z-30 bg-[#D8131B] hover:bg-red-800 text-white px-4 sm:px-5 py-3 rounded-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        </div>
        <div className="text-left">
          <p className="text-[9px] sm:text-[10px] opacity-80">Registro</p>
          <p className="font-bold text-xs sm:text-sm">Pase Portuario Digital</p>
        </div>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white w-6' : 'bg-white/40'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-20">
        <div className="bg-[#005EB8] rounded-t-xl overflow-hidden border-t border-l border-r border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/20">
            {STATS.map((stat, index) => (
              <div key={index} className="p-3 sm:p-4 lg:p-5 text-center text-white">
                <p className="font-bold text-sm sm:text-base lg:text-lg leading-tight">
                  {stat.value}
                </p>
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] mt-1 text-white/80 uppercase leading-tight tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// QUOTE BANNER COMPONENT
// ============================================================================

function QuoteBanner() {
  return (
    <section className="bg-[#052457] py-8 sm:py-10 relative overflow-hidden">
      {/* Decorative wave at top */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0 60L60 52C120 44 240 28 360 22C480 16 600 20 720 26C840 32 960 40 1080 42C1200 44 1320 40 1380 38L1440 36V0H0Z" fill="#005EB8" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <div className="inline-block border-2 border-white/30 px-6 sm:px-10 py-4 rounded-lg">
          <p className="font-bold text-white text-sm sm:text-base lg:text-lg tracking-wide uppercase">
            2026: Hacia una nueva constitución
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// NEWS SECTION COMPONENT
// ============================================================================

function NewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 400);
    }
  }, [checkScroll]);

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, [checkScroll]);

  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-bold text-xl sm:text-2xl text-[#052457] uppercase">
            Noticias
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors ${
                canScrollLeft ? 'border-[#052457] text-[#052457] hover:bg-[#052457] hover:text-white' : 'border-gray-300 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Scroll news left"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-colors ${
                canScrollRight ? 'border-[#052457] text-[#052457] hover:bg-[#052457] hover:text-white' : 'border-gray-300 text-gray-300 cursor-not-allowed'
              }`}
              aria-label="Scroll news right"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable News Cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {NEWS_ITEMS.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-[300px] sm:w-[320px] snap-start bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all group hover:border-[#005EB8]"
            >
              {/* Image placeholder with maritime gradient */}
              <div className="h-40 bg-gradient-to-br from-[#052457] to-[#005EB8] relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 100'%3E%3Cpath d='M0 50 Q25 30 50 50 T100 50 T150 50 T200 50 V100 H0Z' fill='%23ffffff' opacity='0.3'/%3E%3C/svg%3E")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'bottom',
                }} />
                <div className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  Nota de Prensa
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-sm text-gray-800 group-hover:text-[#005EB8] transition-colors leading-snug mb-3 line-clamp-3">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-xs">{item.date}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SERVICES SECTION COMPONENT
// ============================================================================

function ServicesSection() {
  return (
    <section className="py-10 sm:py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Service Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {SERVICES.map((service, index) => (
            <a
              key={index}
              href={service.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative bg-gradient-to-br from-[#005EB8] to-[#052457] p-5 sm:p-6 rounded-xl text-center transition-all hover:shadow-2xl hover:scale-[1.02] group min-h-[160px] sm:min-h-[190px] flex flex-col items-center justify-center"
            >
              <div className="mb-3 sm:mb-4 opacity-90 group-hover:opacity-100 transition-opacity">
                {service.icon}
              </div>
              <h3 className="font-bold text-white text-xs sm:text-sm leading-tight mb-3 uppercase tracking-wide">
                {service.title}
              </h3>
              <span className="text-white/70 text-[10px] sm:text-xs inline-flex items-center gap-1 group-hover:text-white transition-colors">
                Más Información
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4">
          {QUICK_LINKS.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 text-center hover:shadow-lg transition-all hover:border-[#005EB8] group"
            >
              <span className="text-2xl sm:text-3xl mb-2 block">{link.icon}</span>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wide group-hover:text-[#005EB8] transition-colors">
                {link.label}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MISSION & VISION SECTION COMPONENT
// ============================================================================

function MissionVisionSection() {
  return (
    <section className="py-10 sm:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 border-l-4 border-l-[#005EB8]"
          >
            <h3 className="font-bold text-lg text-[#052457] mb-4 uppercase tracking-wide">
              Misión
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Brindamos servicio de alta calidad a la industria marítima, garantizando la seguridad jurídica, libre empresa y mercado competitivo; a través del cumplimiento de normativas nacionales e internacionales, en un marco de transparencia y responsabilidad social ambiental.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 border-l-4 border-l-[#D8131B]"
          >
            <h3 className="font-bold text-lg text-[#052457] mb-4 uppercase tracking-wide">
              Visión
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ser líderes en la prestación de servicios marítimos, logísticos y portuarios, promoviendo inversiones y alianzas estratégicas que fortalecen el comercio, mediante procesos eficientes e innovadores, con el mejor talento humano; logrando un crecimiento económico sostenible para el país.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// VIDEOS SECTION COMPONENT
// ============================================================================

function VideosSection() {
  return (
    <section className="py-10 sm:py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Bitácora AMP */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl text-[#052457] mb-4 uppercase text-center">
              Bitácora AMP
            </h2>
            <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-black">
              <iframe
                src="https://www.youtube.com/embed/gORTeFCBfUg"
                title="Bitácora AMP"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Nuestra Historia */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl text-[#052457] mb-4 uppercase text-center">
              Nuestra Historia
            </h2>
            <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-black">
              <iframe
                src="https://www.youtube.com/embed/mA7mlirqaUo"
                title="Nuestra Historia"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CONTACT SECTION COMPONENT
// ============================================================================

function ContactSection() {
  return (
    <section className="bg-gradient-to-br from-[#005EB8] to-[#052457] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
        <h3 className="font-bold text-white text-xl sm:text-2xl mb-4 uppercase tracking-wide">
          Contáctanos
        </h3>
        <p className="text-white/80 text-sm mb-8 max-w-lg mx-auto">
          Te invitamos a contactarnos. ¿Necesitas ayuda con alguna inquietud?
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://www.amp.gob.pa/contactos/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#052457] px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contactos
          </a>
          <a
            href="https://www.amp.gob.pa/lineas-de-emergencia/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-white/10 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Líneas de Emergencia
          </a>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

function Footer() {
  return (
    <footer className="bg-[#031a3a] text-white">
      {/* Main Footer Content */}
      <div className="py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div>
              <div className="bg-white rounded-lg p-3 inline-block mb-4">
                <img
                  src={AMP_LOGO}
                  alt="Autoridad Marítima de Panamá"
                  className="h-[60px] w-auto"
                />
              </div>
              <p className="text-white/60 text-xs leading-relaxed">
                Autoridad Marítima de Panamá - Ente rector del sector marítimo panameño.
              </p>
            </div>

            {/* Enlaces */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Enlaces</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="https://www.amp.gob.pa/servicios/marina-mercante/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Marina Mercante</a></li>
                <li><a href="https://www.amp.gob.pa/servicios/gente-mar/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Gente de Mar</a></li>
                <li><a href="https://www.amp.gob.pa/servicios/registro-publico-de-naves/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Registro de Naves</a></li>
                <li><a href="https://www.amp.gob.pa/estadistica/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Estadísticas</a></li>
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Servicios</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="https://www.amp.gob.pa/consultas/consulta-y-verificacion-de-documentos/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Verificación de Documentos</a></li>
                <li><a href="https://www.amp.gob.pa/consultas/consultas-en-linea/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Consultas en Línea</a></li>
                <li><a href="https://www.amp.gob.pa/sistema-de-gestion-de-calidad/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Gestión de Calidad</a></li>
              </ul>
            </div>

            {/* Emergencia */}
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Emergencia</h4>
              <div className="bg-[#D8131B]/20 border border-[#D8131B]/40 rounded-xl p-4">
                <p className="text-xs text-white/60 mb-1">Línea de Emergencia 24/7</p>
                <p className="font-bold text-xl">+507 501-5050</p>
              </div>
              <div className="mt-4 flex gap-3">
                <a href="https://www.facebook.com/autoridadmaritimadepanama" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href="https://twitter.com/amp_panama" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </a>
                <a href="https://www.instagram.com/amp_panama/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 11a3 3 0 110-6 3 3 0 010 6zm4.5-7.5a1 1 0 110-2 1 1 0 010 2z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-wrap justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © 2026 Autoridad Marítima de Panamá. Todos los derechos reservados.
          </p>
          <p className="text-white/60 text-xs flex items-center gap-2">
            Gobierno Nacional
            <span className="text-[#D8131B] font-semibold">
              Con Paso Firme
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================================
// BLOCKCHAIN DID SECTION (Unique to this project)
// ============================================================================

function BlockchainDIDSection() {
  const router = useRouter();

  const features = [
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Registros Inmutables',
      desc: 'Credenciales almacenadas en blockchain que no pueden ser alteradas.',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      title: 'Verificación Instantánea',
      desc: 'Empleadores verifican credenciales en segundos.',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Autenticidad de Documentos',
      desc: 'Cada documento es sellado con marca de tiempo on-chain.',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
      ),
      title: 'Pase Portuario Digital',
      desc: 'Credencial marítima segura y portátil que usted controla.',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-br from-[#052457] via-[#052457] to-[#005EB8] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
              Impulsado por Blockchain
            </span>
          </div>
          <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-white mb-4 uppercase">
            Pase Portuario Digital Seguro
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
            La Autoridad Marítima de Panamá utiliza tecnología blockchain para proporcionar credenciales a prueba de manipulación para la gente de mar en todo el mundo.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10 sm:mb-14">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 sm:p-6 hover:bg-white/10 transition-colors group"
            >
              <div className="w-12 h-12 bg-[#005EB8]/40 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#005EB8]/60 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-bold text-white mb-2 text-sm sm:text-base">{feature.title}</h3>
              <p className="text-white/50 text-xs sm:text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => router.push('/gente-de-mar')}
            className="bg-[#D8131B] hover:bg-red-700 text-white px-7 py-3 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            Registre su Pase Portuario Digital
          </button>
        </div>

        {/* Stats */}
        <div className="mt-10 sm:mt-14 pt-8 border-t border-white/10">
          <div className="grid grid-cols-3 gap-6 sm:gap-8 text-center">
            <div>
              <p className="font-bold text-2xl sm:text-3xl text-white">45,000+</p>
              <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mt-1">Credenciales Digitales Emitidas</p>
            </div>
            <div>
              <p className="font-bold text-2xl sm:text-3xl text-white">100%</p>
              <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mt-1">Registros a Prueba de Manipulación</p>
            </div>
            <div>
              <p className="font-bold text-2xl sm:text-3xl text-white">&lt;3s</p>
              <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-wider mt-1">Tiempo de Verificación</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN AMP HOMEPAGE COMPONENT
// ============================================================================

export default function AMPHomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSlider />
      <QuoteBanner />
      <NewsSection />
      <ServicesSection />
      <BlockchainDIDSection />
      <MissionVisionSection />
      <VideosSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
