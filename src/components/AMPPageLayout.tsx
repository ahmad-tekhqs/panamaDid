'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

const AMP_LOGO = 'https://www.amp.gob.pa/wp-content/uploads/2022/05/Logo-AMP-espanol.png';
const GOB_LOGO = 'https://www.amp.gob.pa/wp-content/uploads/2022/05/Gobierno-Nacional.png';

interface AMPPageLayoutProps {
  children: ReactNode;
  showBlockchainBadge?: boolean;
  formId?: string;
}

export default function AMPPageLayout({ children, showBlockchainBadge, formId }: AMPPageLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-[75px]">
            {/* Left: Logo + Back */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex-shrink-0"
              >
                <img
                  src={AMP_LOGO}
                  alt="Autoridad Marítima de Panamá"
                  className="h-[55px] w-auto"
                />
              </button>
            </div>

            {/* Center: Blockchain Badge + Form ID */}
            <div className="hidden sm:flex items-center gap-3">
              {showBlockchainBadge && (
                <div className="flex items-center gap-2 bg-[#052457]/5 border border-[#052457]/10 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[11px] font-semibold text-[#052457]">Seguridad Blockchain</span>
                </div>
              )}
              {formId && (
                <div className="bg-[#005EB8]/10 text-[#005EB8] px-3 py-1.5 rounded-full text-[11px] font-bold">
                  Formulario {formId}
                </div>
              )}
            </div>

            {/* Right: Language + Government Logo */}
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#005EB8] transition-colors"
                title="Switch to English"
              >
                <span className="text-sm">🇺🇸</span>
                <span className="text-[10px] font-bold text-[#052457]">EN</span>
              </button>
              <div className="hidden lg:block">
                <img
                  src={GOB_LOGO}
                  alt="Gobierno Nacional"
                  className="h-[45px] w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sub-header: Pase Portuario Digital */}
        <div className="bg-gradient-to-r from-[#052457] to-[#005EB8]">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2 flex items-center justify-between">
            <p className="text-white/90 text-xs font-medium tracking-wide">
              Pase Portuario Digital (DPP)
            </p>
            <button
              onClick={() => router.back()}
              className="text-white/70 hover:text-white text-xs flex items-center gap-1 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#031a3a] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded p-1.5">
                <img src={AMP_LOGO} alt="AMP" className="h-[30px] w-auto" />
              </div>
              <div>
                <p className="text-white/50 text-[10px]">© 2026 Autoridad Marítima de Panamá</p>
                <p className="text-white/40 text-[9px]">Todos los derechos reservados</p>
              </div>
            </div>
            <p className="text-white/50 text-[10px] flex items-center gap-1.5">
              Gobierno Nacional
              <span className="text-[#D8131B] font-semibold">Con Paso Firme</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
