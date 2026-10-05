import React from 'react';
import { TrendingUp, Clock, Users, ShieldAlert } from 'lucide-react';

export const ProofBar: React.FC = () => {
  const metrics = [
    {
      icon: TrendingUp,
      value: '+520%',
      label: 'Más Contactos y Llamadas',
      sub: 'Comparado con renovaciones manuales',
    },
    {
      icon: Clock,
      value: '20 min',
      label: 'Cadencia Automática Exacta',
      sub: 'Tus anuncios siempre en primera página',
    },
    {
      icon: Users,
      value: '1,420+',
      label: 'Anunciantes y Agencias Activos',
      sub: 'En España y Latinoamérica',
    },
    {
      icon: ShieldAlert,
      value: '100% Cloud',
      label: 'Funciona con tu Móvil Apagado',
      sub: 'Nuestros servidores trabajan 24/7 por ti',
    },
  ];

  return (
    <section className="border-y border-neutral-800 bg-neutral-900/40 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex flex-col text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                    {item.value}
                  </span>
                </div>
                <span className="text-sm font-semibold text-neutral-200">{item.label}</span>
                <span className="text-xs text-neutral-400 mt-0.5">{item.sub}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
