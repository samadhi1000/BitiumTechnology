import React from 'react';
import { Sparkles } from 'lucide-react';

export type PrintFinish = 'flat' | 'embossed' | 'vintage';

interface PrintStyleSelectorProps {
  selectedStyle: PrintFinish;
  onChange: (style: PrintFinish) => void;
}

export const PrintStyleSelector: React.FC<PrintStyleSelectorProps> = ({ selectedStyle, onChange }) => {
  const styles = [
    { id: 'flat', label: 'Vibrant Flat Print', desc: 'Sleek, direct flat ink transfer.' },
    { id: 'embossed', label: '3D Embossed Print', desc: 'Embossed edges with detailed shadow.' },
    { id: 'vintage', label: 'Vintage Faded Print', desc: 'A subtle faded look with low opacity.' },
  ];

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
      <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-2">
        <Sparkles size={16} className="text-violet-400" />
        4. Print Style & Emboss
      </h3>
      <div className="flex flex-col gap-2">
        {styles.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id as PrintFinish)}
            className={`w-full p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
              selectedStyle === style.id
                ? 'bg-violet-950/20 border-violet-500/60 shadow-lg'
                : 'bg-zinc-950 border-zinc-850 hover:bg-zinc-950/60 hover:border-zinc-800'
            }`}
          >
            <span className={`text-xs font-bold ${selectedStyle === style.id ? 'text-violet-400' : 'text-zinc-300'}`}>
              {style.label}
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">
              {style.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
