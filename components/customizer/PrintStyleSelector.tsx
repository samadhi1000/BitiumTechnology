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
    <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4">
      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
        <Sparkles size={16} className="text-[#2CFF05]" />
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
                ? 'bg-[#2CFF05]/10 border-[#2CFF05]/60 shadow-lg'
                : 'bg-background border-border hover:bg-background/60 hover:border-border'
            }`}
          >
            <span className={`text-xs font-bold ${selectedStyle === style.id ? 'text-[#2CFF05]' : 'text-foreground'}`}>
              {style.label}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {style.desc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
