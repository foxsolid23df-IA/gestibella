import React from 'react';
import { Scissors, Sparkles, Heart, ShieldCheck, Lock, Code, MessageCircle } from 'lucide-react';
import { useSalon, PublicNavSection } from '../../context/SalonContext';

const WHATSAPP_URL = 'https://wa.me/526148429914?text=Hola%2C%20quisiera%20solicitar%20informaci%C3%B3n%20sobre%20GestiBella%20SaaS.';

export const Footer: React.FC = () => {
  const { setPublicSection, setIsLoginModalOpen, setIsPortalOpen, setPortalModule } = useSalon();

  const handleNav = (section: PublicNavSection) => {
    setPublicSection(section);
    const element = document.getElementById(section.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1E1B18] text-[#D6CECA] pt-16 pb-12 border-t border-[#38332E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#38332E]">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#BE5A38] to-[#E07A5F] flex items-center justify-center text-white shadow-md">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-white">
                Gesti<span className="text-[#E07A5F]">Bella</span>
              </span>
            </div>
            <p className="text-xs text-[#A89F9A] leading-relaxed max-w-sm">
              Plataforma integral de administración para salones de belleza, barberías y spas. Operaciones con agenda inteligente, ticket en espera, fórmulas técnicas, inventario y comisiones automáticas.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E07A5F] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Aislamiento de datos y seguridad empresarial</span>
            </div>

            <div className="pt-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span>Informes por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Explorar
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('INICIO')} className="hover:text-white transition-colors">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('CARACTERISTICAS')} className="hover:text-white transition-colors">
                  Características & Módulos
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('TESTIMONIOS')} className="hover:text-white transition-colors">
                  Testimonios de Salones
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('PLANES')} className="hover:text-white transition-colors">
                  Planes & Precios
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('BLOG')} className="hover:text-white transition-colors">
                  Blog de Colorimetría & Gestión
                </button>
              </li>
            </ul>
          </div>

          {/* Technical & Architecture Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Arquitectura Técnica
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setIsPortalOpen(true);
                    setPortalModule('ARCHITECTURE_DOCS');
                  }}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-[#E07A5F]"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Blueprint SaaS Multi-Tenant</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsPortalOpen(true);
                    setPortalModule('ARCHITECTURE_DOCS');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Esquema de Base de Datos (ERD)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsPortalOpen(true);
                    setPortalModule('ARCHITECTURE_DOCS');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Backlog MVP (Epics & Stories)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setIsPortalOpen(true);
                    setPortalModule('ARCHITECTURE_DOCS');
                  }}
                  className="hover:text-white transition-colors"
                >
                  Endpoints REST API
                </button>
              </li>
            </ul>
          </div>

          {/* Portal Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Acceso Exclusivo
            </h4>
            <p className="text-xs text-[#A89F9A]">
              Acceso restringido únicamente para el personal y dueños del salón.
            </p>
            <button
              id="btn-footer-login"
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-2.5 px-3 bg-[#BE5A38] hover:bg-[#A84E30] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Ingreso al Software</span>
            </button>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#827873] gap-4">
          <p>© {new Date().getFullYear()} GestiBella Software. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho para la industria de la belleza y el bienestar <Heart className="w-3.5 h-3.5 text-[#BE5A38] fill-[#BE5A38]" />
          </p>
        </div>
      </div>
    </footer>
  );
};
