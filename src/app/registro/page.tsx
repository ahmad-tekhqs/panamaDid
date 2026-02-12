'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AMPPageLayout from '@/components/AMPPageLayout';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type FormType = 'F-76' | 'F-77' | null;
type ApplicationType = 'titulo' | 'refrendo' | 'certificado' | 'duplicado' | null;

const STEPS = [
  { number: 1, label: 'Tipo de Solicitud' },
  { number: 2, label: 'Datos del Marino' },
  { number: 3, label: 'Documentación' },
  { number: 4, label: 'Endosos / Ascenso' },
  { number: 5, label: 'Envío Blockchain' },
];

const FORM_TYPES = [
  {
    id: 'F-76' as FormType,
    label: 'F-76',
    title: 'Documentación Técnica',
    description: 'Solicitud de documentación técnica para gente de mar',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 'F-77' as FormType,
    label: 'F-77',
    title: 'Ascenso de Gente de Mar',
    description: 'Solicitud de ascenso para profesionales marítimos',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

const APPLICATION_TYPES = [
  {
    id: 'titulo' as ApplicationType,
    label: 'TÍTULO DE COMPETENCIA',
    description: 'Certificate of Competency (CoC)',
    icon: '🎓',
  },
  {
    id: 'refrendo' as ApplicationType,
    label: 'REFRENDO',
    description: 'Endorsement of foreign certificates',
    icon: '✅',
  },
  {
    id: 'certificado' as ApplicationType,
    label: 'CERTIFICADO DE SUFICIENCIA',
    description: 'Certificate of Proficiency (CoP)',
    icon: '📜',
  },
  {
    id: 'duplicado' as ApplicationType,
    label: 'DUPLICADO',
    description: 'Duplicate of existing documents',
    icon: '📋',
  },
];

// ============================================================================
// STEPPER COMPONENT
// ============================================================================

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8 sm:mb-10">
      {STEPS.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step.number < currentStep
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : step.number === currentStep
                  ? 'bg-[#005EB8] text-white shadow-lg shadow-[#005EB8]/30 ring-4 ring-[#005EB8]/20'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {step.number < currentStep ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <span className={`mt-1.5 text-[9px] sm:text-[10px] font-medium text-center max-w-[70px] sm:max-w-[80px] leading-tight hidden sm:block ${
              step.number === currentStep ? 'text-[#005EB8]' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < STEPS.length - 1 && (
            <div className={`w-8 sm:w-14 lg:w-20 h-[2px] mx-1 sm:mx-2 transition-all duration-300 ${
              step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// REGISTRO PAGE
// ============================================================================

export default function RegistroPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formType, setFormType] = useState<FormType>(null);
  const [applicationType, setApplicationType] = useState<ApplicationType>(null);

  const canProceed = formType !== null && applicationType !== null;

  const handleNext = () => {
    if (canProceed) {
      // Store selections for the DID flow
      if (typeof window !== 'undefined') {
        localStorage.setItem('registroFormType', formType || '');
        localStorage.setItem('registroApplicationType', applicationType || '');
        localStorage.setItem('selectedCountry', 'panama');
      }
      router.push('/connect-wallet');
    }
  };

  const handleBack = () => {
    router.push('/gente-de-mar');
  };

  return (
    <AMPPageLayout showBlockchainBadge formId="F-76">
      {/* Main Content Area */}
      <div className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 lg:px-8">

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#052457] tracking-tight uppercase mb-3">
              Solicitud de Documentación Técnica de la Gente de Mar
            </h1>
            <div className="inline-flex items-center gap-2 bg-[#052457]/5 px-4 py-2 rounded-full">
              <svg className="w-4 h-4 text-[#005EB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-xs text-[#052457] font-medium">
                Sus credenciales serán aseguradas en IPFS/blockchain
              </span>
            </div>
          </motion.div>

          {/* Stepper */}
          <Stepper currentStep={currentStep} />

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Section Header */}
            <div className="bg-gradient-to-r from-[#052457] to-[#005EB8] px-6 sm:px-8 py-4">
              <h2 className="text-white font-bold text-sm sm:text-base uppercase tracking-wider">
                Tipo de Aplicación
              </h2>
            </div>

            <div className="p-6 sm:p-8">
              {/* Form Type Selection (F-76 / F-77) */}
              <div className="mb-8">
                <div className="grid sm:grid-cols-2 gap-4">
                  {FORM_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormType(type.id)}
                      className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 group ${
                        formType === type.id
                          ? 'border-[#005EB8] bg-[#005EB8]/5 shadow-lg shadow-[#005EB8]/10'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                      }`}
                    >
                      {/* Selected indicator */}
                      <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        formType === type.id
                          ? 'border-[#005EB8] bg-[#005EB8]'
                          : 'border-gray-300'
                      }`}>
                        {formType === type.id && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      <div className={`mb-3 transition-colors ${
                        formType === type.id ? 'text-[#005EB8]' : 'text-gray-400 group-hover:text-gray-500'
                      }`}>
                        {type.icon}
                      </div>

                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`text-lg font-black ${
                          formType === type.id ? 'text-[#005EB8]' : 'text-[#052457]'
                        }`}>
                          {type.label}
                        </span>
                      </div>
                      <p className={`text-sm font-semibold mb-1 ${
                        formType === type.id ? 'text-[#052457]' : 'text-gray-700'
                      }`}>
                        {type.title}
                      </p>
                      <p className="text-xs text-gray-400">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-6" />

              {/* Application Type Selection */}
              <AnimatePresence mode="wait">
                {formType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">
                      Seleccione el tipo de documento
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {APPLICATION_TYPES.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setApplicationType(type.id)}
                          className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                            applicationType === type.id
                              ? 'border-[#D8131B] bg-[#D8131B]/5 shadow-md shadow-[#D8131B]/10'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
                          }`}
                        >
                          <span className="text-2xl block mb-2">{type.icon}</span>
                          <p className={`text-[10px] sm:text-xs font-bold leading-tight ${
                            applicationType === type.id ? 'text-[#D8131B]' : 'text-[#052457]'
                          }`}>
                            {type.label}
                          </p>
                          <p className="text-[9px] text-gray-400 mt-1 hidden sm:block">{type.description}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selection Summary */}
              <AnimatePresence>
                {canProceed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Formulario {formType} — {APPLICATION_TYPES.find(t => t.id === applicationType)?.label}
                      </p>
                      <p className="text-xs text-green-600">Listo para continuar al registro digital</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="bg-gray-50 border-t border-gray-100 px-6 sm:px-8 py-4 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-500 hover:text-[#052457] text-sm font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  canProceed
                    ? 'bg-[#D8131B] hover:bg-red-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Siguiente
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Form Version Footer */}
          <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              F-76 (TIT) V.03 PANAMÁ — Autoridad Marítima de Panamá
            </p>
          </div>
        </div>
      </div>
    </AMPPageLayout>
  );
}
