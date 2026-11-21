import React from 'react';
import { Volume2, Eye, Compass, ShieldCheck } from 'lucide-react';

export const StadiumExperienceShowcase: React.FC = () => {
  const architecturalMetrics = [
    {
      stat: '132,000',
      title: 'Acoustic Colosseum',
      description: 'Dual-tiered reinforced structure engineered to amplify crowd reverberation up to 126dB along the pitch boundary.',
      icon: Volume2
    },
    {
      stat: '360°',
      title: 'Pillarless Sightlines',
      description: 'Zero visual obstruction from every coordinate using cantilevered structural steel girders and glass partitions.',
      icon: Eye
    },
    {
      stat: '22 Yards',
      title: 'Pitch Axis Alignment',
      description: 'Geographically oriented North-South to eliminate blinding sunlight during high-stakes afternoon & evening sessions.',
      icon: Compass
    },
    {
      stat: '0.05s',
      title: 'Turnstile Pass Ingress',
      description: 'High-throughput automated turnstiles with cryptographic digital pass validation and anti-scalping token lock.',
      icon: ShieldCheck
    }
  ];

  return (
    <section id="architecture" className="py-20 lg:py-28 bg-[#292929] text-[#F3EFE6] select-none border-t border-[#F3EFE6]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-[#F3EFE6]/10">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#E78260] font-bold block mb-2">
              WORLD-CLASS ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-[#F3EFE6]">
              STADIUM SPECIFICATIONS
            </h2>
          </div>
          <p className="text-xs text-[#F3EFE6]/70 max-w-sm mt-4 md:mt-0 leading-relaxed">
            Rigorous architectural and sightline engineering from the 22-yard center turf to the upper cantilevered roof canopy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {architecturalMetrics.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl p-6 bg-[#F3EFE6]/5 border border-[#F3EFE6]/10 hover:border-[#E78260]/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E78260]/15 flex items-center justify-center text-[#E78260] mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl lg:text-4xl font-black text-[#E78260] mb-2 tracking-tight">
                  {item.stat}
                </div>
                <div className="text-sm font-bold uppercase text-[#F3EFE6] mb-2 tracking-wide">
                  {item.title}
                </div>
                <p className="text-xs text-[#F3EFE6]/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
