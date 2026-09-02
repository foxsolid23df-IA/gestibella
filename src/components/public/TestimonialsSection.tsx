import React from 'react';
import { Star, Sparkles, Quote, CheckCircle2 } from 'lucide-react';
import { TESTIMONIALS } from '../../data/initialData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonios" className="py-20 bg-white border-b border-[#E8DFD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8DFD8] text-[#BE5A38] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Casos de Éxito Reales</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C1917]">
            Lo que Dicen Dueños y Estilistas
          </h2>
          <p className="text-[#78716C] text-base sm:text-lg">
            Salones de alta peluquería, barberías y centros de spa que transformaron su rentabilidad con GestiBella.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              id={`test-${test.id}`}
              className="bg-[#FAF7F2] rounded-3xl p-7 border border-[#E8DFD8] shadow-sm flex flex-col justify-between relative group hover:border-[#D8C3B5] hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                {/* Metric Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-xs font-extrabold text-[#BE5A38] border border-[#E8DFD8]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{test.metricHighlight}</span>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[...Array(test.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote text */}
                <p className="text-sm text-[#44403C] leading-relaxed italic">
                  "{test.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-[#E8DFD8] flex items-center gap-3.5">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#BE5A38]/30"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#1C1917]">{test.name}</h4>
                  <p className="text-xs font-semibold text-[#BE5A38]">{test.businessName}</p>
                  <p className="text-[11px] text-[#78716C]">{test.businessType} • {test.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
