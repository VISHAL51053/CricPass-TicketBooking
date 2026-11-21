import React from 'react';
import { Eye, Compass, ShieldCheck, Cpu, Sparkles } from 'lucide-react';

export const StadiumSightlineTechShowcase: React.FC = () => {
  const techFeatures = [
    {
      step: '01',
      title: 'Centimeter-Precise 3D Sightlines',
      description: 'Every seat coordinate is mapped in Three.js with realistic spectator eye height (+1.20m), calculating distance to pitch and vertical elevation angle.',
      icon: Eye,
      metric: '±0.02m Accuracy'
    },
    {
      step: '02',
      title: '360° Pillarless Colosseum Engineering',
      description: 'Zero visual obstructions from all 132,000 seating positions using cantilevered structural steel trusses and panoramic safety glass balustrades.',
      icon: Compass,
      metric: '100% Unobstructed'
    },
    {
      step: '03',
      title: 'Atmospheric Sunlight & Floodlight Engine',
      description: 'Simulate natural lighting across 4 times of day: Afternoon clear daylight, Golden Hour amber sun, Sunset glow, and night matches with 4 high-mast towers.',
      icon: Sparkles,
      metric: '4 Atmospheric States'
    },
    {
      step: '04',
      title: 'Cryptographic Turnstile Access Tokens',
      description: 'Every reserved ticket generates a dynamic SHA-256 encrypted turnstile QR token with 0.05-second gate verification and anti-scalping identity locks.',
      icon: ShieldCheck,
      metric: '0.05s Turnstile Scan'
    }
  ];

  return (
    <section id="technology" className="py-20 lg:py-28 bg-[#F3EFE6] text-[#292929] select-none border-t border-[#292929]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-12 border-b border-[#292929]/15">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E78260]/15 text-[#E78260] font-bold text-xs uppercase tracking-wider mb-3 font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>NEXT-GENERATION SPORTS TICKETING TECH</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-[#292929]">
              HOW CRICPASS 3D WORKS
            </h2>
          </div>
          <p className="text-xs text-[#292929]/70 max-w-sm mt-3 md:mt-0 font-normal leading-relaxed">
            Eliminating blind ticketing forever. Never buy a ticket without knowing your exact line of sight to the 22-yard pitch wickets.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {techFeatures.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="rounded-2xl p-6 bg-white border border-[#292929]/12 hover:border-[#E78260] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono font-black text-[#E78260] px-2.5 py-1 rounded bg-[#E78260]/10">
                      STEP {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#292929]/5 group-hover:bg-[#E78260] group-hover:text-white flex items-center justify-center text-[#292929] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-black text-[#292929] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#292929]/70 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#292929]/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#292929]/50 font-bold uppercase text-[10px]">Benchmark:</span>
                  <span className="font-bold text-[#E78260]">{item.metric}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
