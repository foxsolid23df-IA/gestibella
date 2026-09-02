import React, { useState } from 'react';
import { Sparkles, Scissors, Lock, Menu, X, ShieldCheck, ArrowRight, Code, MessageCircle } from 'lucide-react';
import { useSalon, PublicNavSection } from '../../context/SalonContext';

const WHATSAPP_URL = 'https://wa.me/526148429914?text=Hola%2C%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n%20sobre%20el%20SaaS%20GestiBella%20para%20mi%20sal%C3%B3n.';

export const Navbar: React.FC = () => {
  const {
    publicSection,
    setPublicSection,
    setIsLoginModalOpen,
    setIsPortalOpen,
    setPortalModule
  } = useSalon();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: PublicNavSection; label: string }[] = [
    { id: 'INICIO', label: 'Inicio' },
    { id: 'CARACTERISTICAS', label: 'Características' },
    { id: 'TESTIMONIOS', label: 'Testimonios' },
    { id: 'COMUNICACION', label: 'Comunicación' },
    { id: 'BLOG', label: 'Blog' },
    { id: 'PLANES', label: 'Planes & Precios' }
  ];

  const handleNavClick = (section: PublicNavSection) => {
    setPublicSection(section);
    setMobileMenuOpen(false);
    const element = document.getElementById(section.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenArchitecture = () => {
    setIsPortalOpen(true);
    setPortalModule('ARCHITECTURE_DOCS');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8DFD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => handleNavClick('INICIO')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#BE5A38] to-[#E07A5F] flex items-center justify-center text-white shadow-md shadow-[#BE5A38]/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-luxury text-2xl font-bold tracking-tight text-[#292524]">
                  Gesti<span className="text-[#BE5A38]">Bella</span>
                </span>
                <Sparkles className="w-4 h-4 text-[#E07A5F] fill-[#E07A5F]" />
              </div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#8D5B4C] -mt-1">
                Salon & Spa Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F4EFEA] px-3 py-1.5 rounded-full border border-[#E4D7CC]">
            {navLinks.map((link) => {
              const isActive = publicSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-${link.id.toLowerCase()}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#BE5A38] shadow-sm'
                      : 'text-[#57534E] hover:text-[#292524] hover:bg-white/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <a
              id="btn-nav-whatsapp"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-300 shadow-2xs transition-colors whitespace-nowrap"
              title="Solicitar informes por WhatsApp (+52 614 842 9914)"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
              <span>Informes</span>
            </a>

            <button
              id="btn-arch-blueprint"
              onClick={handleOpenArchitecture}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#8D5B4C] bg-[#F4EFEA] hover:bg-[#EAE0D6] rounded-xl border border-[#D8C3B5] transition-colors"
              title="Ver arquitectura técnica, ERD y endpoints REST"
            >
              <Code className="w-3.5 h-3.5 text-[#BE5A38]" />
              <span>Arquitectura SaaS</span>
            </button>

            <button
              id="btn-acceso-software"
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#BE5A38] to-[#D97706] hover:from-[#A84E30] hover:to-[#B45309] shadow-md shadow-[#BE5A38]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Acceso al Software</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-white bg-emerald-600 rounded-xl sm:hidden"
              title="WhatsApp +52 614 842 9914"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
            </a>
            <button
              id="btn-mobile-login"
              onClick={() => setIsLoginModalOpen(true)}
              className="p-2 text-white bg-[#BE5A38] rounded-xl sm:hidden"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#57534E] hover:text-[#292524] hover:bg-[#F4EFEA] rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E8DFD8] px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                publicSection === link.id
                  ? 'bg-[#BE5A38] text-white'
                  : 'text-[#57534E] hover:bg-[#F4EFEA]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#E8DFD8] space-y-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-xl border border-emerald-300"
            >
              <MessageCircle className="w-4 h-4 text-emerald-700 fill-emerald-700" />
              <span>Solicitar Informes por WhatsApp</span>
            </a>
            <button
              onClick={handleOpenArchitecture}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-[#8D5B4C] bg-[#F4EFEA] rounded-xl border border-[#D8C3B5]"
            >
              <Code className="w-4 h-4 text-[#BE5A38]" />
              <span>Ver Arquitectura Técnica (ERD & REST)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsLoginModalOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-[#BE5A38]"
            >
              <Lock className="w-4 h-4" />
              <span>Ingresar a GestiBella (Personal)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
