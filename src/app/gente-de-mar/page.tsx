'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AMPPageLayout from '@/components/AMPPageLayout';

// ============================================================================
// SERVICE CARDS DATA
// ============================================================================

const SERVICES = [
  {
    icon: (
      <svg className="w-10 h-10 text-[#005EB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Títulos de Competencia',
    description: 'Emisión de títulos para oficiales y tripulantes según normativa STCW',
    color: 'from-blue-50 to-blue-100/50',
    borderColor: 'border-[#005EB8]/20',
  },
  {
    icon: (
      <svg className="w-10 h-10 text-[#005EB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Refrendos',
    description: 'Refrendo de certificados extranjeros para servicio en buques panameños',
    color: 'from-emerald-50 to-emerald-100/50',
    borderColor: 'border-emerald-200',
  },
  {
    icon: (
      <svg className="w-10 h-10 text-[#005EB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: 'Formación Marítima',
    description: 'Aprobación y supervisión de centros de formación marítima',
    color: 'from-amber-50 to-amber-100/50',
    borderColor: 'border-amber-200',
  },
  {
    icon: (
      <svg className="w-10 h-10 text-[#005EB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
      </svg>
    ),
    title: 'Libreta de Mar',
    description: 'Documento de identidad oficial para la gente de mar panameña',
    color: 'from-rose-50 to-rose-100/50',
    borderColor: 'border-rose-200',
  },
];

const DOCUMENTS = [
  { name: 'Certificado de Competencia (CoC)', icon: '📜' },
  { name: 'Certificado de Suficiencia (CoP)', icon: '📋' },
  { name: 'Libreta de Embarque', icon: '📓' },
  { name: 'Certificados STCW', icon: '🎓' },
  { name: 'Refrendos Internacionales', icon: '🌍' },
  { name: 'Certificados Especiales', icon: '⭐' },
];

// ============================================================================
// GENTE DE MAR PAGE
// ============================================================================

export default function GenteDeMar() {
  const router = useRouter();

  return (
    <AMPPageLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#052457] via-[#0a3d7a] to-[#005EB8] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14 sm:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <div className="h-px flex-1 bg-white/20" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
              Gente de Mar
            </h1>
            <p className="text-lg sm:text-xl text-white/80 font-light leading-relaxed">
              Certificación y documentación para profesionales marítimos
            </p>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <svg viewBox="0 0 1440 80" fill="none" className="absolute bottom-0 left-0 w-full" preserveAspectRatio="none">
          <path d="M0 80L60 72C120 64 240 48 360 40C480 32 600 32 720 36C840 40 960 48 1080 52C1200 56 1320 56 1380 56L1440 56V80H0Z" fill="#f5f7fa" />
        </svg>
      </section>

      {/* Description Section */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#005EB8]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-[#005EB8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  La Dirección General de Gente de Mar se encarga de la formación, titulación, refrendo y certificación de las competencias de la gente de mar, conforme al <strong className="text-[#052457]">Convenio Internacional STCW</strong> (Standards of Training, Certification and Watchkeeping for Seafarers).
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {SERVICES.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className={`bg-gradient-to-br ${service.color} rounded-2xl p-6 border ${service.borderColor} hover:shadow-lg transition-all group`}
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="font-bold text-[#052457] text-base mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Available */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-bold text-xl sm:text-2xl text-[#052457] mb-6 text-center uppercase tracking-wide">
                Documentos Disponibles
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                {DOCUMENTS.map((doc, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 hover:border-[#005EB8]/30 hover:bg-blue-50/30 transition-all"
                  >
                    <span className="text-lg">{doc.icon}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700 font-medium">{doc.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blockchain CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-[#052457] to-[#005EB8] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="max-w-3xl mx-auto px-4 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                Sistema de Registro Digital
              </span>
            </div>

            <h2 className="font-bold text-2xl sm:text-3xl text-white mb-4">
              Sistema de Registro Digital
            </h2>
            <p className="text-white/70 mb-8 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Utilice nuestro nuevo sistema blockchain para solicitar y gestionar su documentación marítima de forma segura.
            </p>

            <button
              onClick={() => router.push('/registro')}
              className="inline-flex items-center gap-3 bg-[#D8131B] hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Solicitar Documentación
            </button>
          </motion.div>
        </div>
      </section>
    </AMPPageLayout>
  );
}
