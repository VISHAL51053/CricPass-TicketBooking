import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const InteractiveFAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the 3D Seat POV simulation calculate my viewpoint?',
      a: 'CRICPASS calculates the precise Euclidean coordinate (X, Y, Z) of your chosen seat within the 132,000-capacity colosseum model, elevated by +1.20m to match seated spectator eye height. The camera is mathematically locked onto the 22-yard pitch center, calculating exact distance and vertical elevation angles.'
    },
    {
      q: 'Can I select different seats and compare their viewpoints?',
      a: 'Yes! Inside the full-screen 3D arena, you can click any seat in the 3D grid or matrix. The camera swoops along a smooth curved flight trajectory to that exact position, letting you compare perspective changes between rows and sectors in real time.'
    },
    {
      q: 'How do I scan my digital ticket at the stadium turnstile gates?',
      a: 'After completing checkout, your pass is cryptographically registered on the tournament ledger. You receive a digital smart pass with a high-contrast dynamic QR token. Simply tap or scan the token at your allocated turnstile gate for instant 0.05-second ingress.'
    },
    {
      q: 'What is the maximum number of tickets I can reserve per booking?',
      a: 'To guarantee fair access and prevent scalping, each verified fan passport can reserve up to 6 seats per transaction. All seats in your reservation will be grouped together with adjoining seat allocations.'
    },
    {
      q: 'What perks are included with VIP Presidential Pavilion passes?',
      a: 'Presidential Pavilion passes include complimentary five-star gourmet buffet dining, dedicated sommelier beverage service, player dugout walkway proximity, Gate 01 valet parking, and an official holographic souvenir match pass.'
    }
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#F3EFE6] text-[#292929] select-none border-t border-[#292929]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center pb-8 mb-10 border-b border-[#292929]/15">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E78260]/15 text-[#E78260] font-bold text-xs uppercase tracking-wider mb-3 font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>SPECTATOR GUIDELINES &amp; POLICIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase text-[#292929]">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-xs text-[#292929]/70 max-w-md mx-auto mt-2 font-normal">
            Everything you need to know about 3D seat previews, turnstile admission, and ticket settlement.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#292929]/15 bg-white overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#292929] cursor-pointer hover:bg-[#F3EFE6]/30 transition-colors"
                >
                  <span className="flex-1">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#E78260] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#292929]/75 leading-relaxed border-t border-[#292929]/10 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
