import React from 'react';
import type { FanAddon } from '../../types';
import { FAN_ADDONS } from '../../data/stadiumConfig';
import { Shirt, Utensils, Car, Sparkles, Plus, Minus } from 'lucide-react';

interface FanAddonsSectionProps {
  selectedAddons: { addon: FanAddon; quantity: number }[];
  onUpdateAddonQuantity: (addon: FanAddon, delta: number) => void;
}

export const FanAddonsSection: React.FC<FanAddonsSectionProps> = ({
  selectedAddons,
  onUpdateAddonQuantity
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shirt': return <Shirt className="w-5 h-5 text-indigo-400" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-emerald-400" />;
      case 'Car': return <Car className="w-5 h-5 text-cyan-400" />;
      default: return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  const getQuantity = (addonId: string) => {
    const item = selectedAddons.find(a => a.addon.id === addonId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md p-5 shadow-xl mt-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Match Day Enhancements</span>
          <h3 className="text-lg font-bold text-white mt-0.5">Fan Experience Add-ons</h3>
        </div>
        <span className="text-xs text-slate-400">Optional · Add to Match Pass</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {FAN_ADDONS.map((addon) => {
          const qty = getQuantity(addon.id);
          const isAdded = qty > 0;

          return (
            <div
              key={addon.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                isAdded
                  ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md'
                  : 'bg-slate-950/50 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-white/10 mt-0.5">
                  {getIcon(addon.icon)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{addon.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{addon.description}</p>
                  <div className="text-sm font-bold text-amber-400 mt-2">
                    ₹{addon.price.toLocaleString()} {addon.currency}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 rounded-lg p-1 border border-white/10">
                <button
                  type="button"
                  disabled={qty === 0}
                  onClick={() => onUpdateAddonQuantity(addon, -1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-mono font-bold text-white">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateAddonQuantity(addon, 1)}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
