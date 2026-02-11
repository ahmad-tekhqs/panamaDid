import { Link } from "react-router-dom";
import { Shield, Link2, FileCheck, Fingerprint } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AMPBlockchainSection = () => {
  const { language } = useLanguage();
  const isEn = language === "en";

  const features = [
    {
      icon: Shield,
      title: isEn ? "Immutable Records" : "Registros Inmutables",
      description: isEn 
        ? "Seafarer credentials stored on blockchain cannot be altered or falsified"
        : "Las credenciales de la gente de mar almacenadas en blockchain no pueden ser alteradas o falsificadas",
    },
    {
      icon: Link2,
      title: isEn ? "Instant Verification" : "Verificación Instantánea",
      description: isEn
        ? "Employers worldwide can verify credentials in seconds"
        : "Los empleadores en todo el mundo pueden verificar credenciales en segundos",
    },
    {
      icon: FileCheck,
      title: isEn ? "Document Authenticity" : "Autenticidad de Documentos",
      description: isEn
        ? "Every document is hashed and timestamped on-chain"
        : "Cada documento es hasheado y sellado con marca de tiempo en la cadena",
    },
    {
      icon: Fingerprint,
      title: isEn ? "Digital Identity" : "Identidad Digital",
      description: isEn
        ? "Secure, portable maritime identity that you control"
        : "Identidad marítima segura y portátil que usted controla",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-amp-navy via-amp-navy to-amp-blue relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
              {isEn ? "Blockchain Powered" : "Impulsado por Blockchain"}
            </span>
          </div>
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-white mb-4">
            {isEn ? "SECURE DIGITAL IDENTITY" : "IDENTIDAD DIGITAL SEGURA"}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            {isEn 
              ? "Panama Maritime Authority leverages blockchain technology to provide tamper-proof credentials for seafarers worldwide."
              : "La Autoridad Marítima de Panamá utiliza tecnología blockchain para proporcionar credenciales a prueba de manipulación para la gente de mar en todo el mundo."
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors group"
            >
              <div className="w-12 h-12 bg-amp-blue/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amp-blue/50 transition-colors">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/registro"
            className="bg-panama-red hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
          >
            <Fingerprint className="w-5 h-5" />
            {isEn ? "Register Your Digital Identity" : "Registre su Identidad Digital"}
          </Link>
          <a
            href="#verify"
            className="border border-white/30 hover:border-white/50 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {isEn ? "Verify a Credential" : "Verificar una Credencial"}
          </a>
        </div>

        {/* Stats */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-heading font-bold text-2xl lg:text-3xl text-white">45,000+</p>
              <p className="text-white/60 text-xs uppercase tracking-wider mt-1">
                {isEn ? "Digital Credentials Issued" : "Credenciales Digitales Emitidas"}
              </p>
            </div>
            <div>
              <p className="font-heading font-bold text-2xl lg:text-3xl text-white">100%</p>
              <p className="text-white/60 text-xs uppercase tracking-wider mt-1">
                {isEn ? "Tamper-Proof Records" : "Registros a Prueba de Manipulación"}
              </p>
            </div>
            <div>
              <p className="font-heading font-bold text-2xl lg:text-3xl text-white">&lt;3s</p>
              <p className="text-white/60 text-xs uppercase tracking-wider mt-1">
                {isEn ? "Verification Time" : "Tiempo de Verificación"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AMPBlockchainSection;
