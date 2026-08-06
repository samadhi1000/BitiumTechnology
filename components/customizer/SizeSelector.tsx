import React from 'react';
import { Shirt } from 'lucide-react';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onChange: (size: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({ sizes, selectedSize, onChange }) => {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card/40 space-y-4">
      <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
        <Shirt size={16} className="text-[#8DFF00]" />
        2. Choose Size
      </h3>
      <div className="flex gap-2">
        {sizes.map((sz) => (
          <button
            key={sz}
            type="button"
            onClick={() => onChange(sz)}
            className={`flex-1 py-2.5 rounded-lg font-bold text-xs border transition-all ${
              selectedSize === sz
                ? 'bg-[#8DFF00] border-[#8DFF00] text-[#0a0a0a] shadow-md'
                : 'bg-background border-border text-muted-foreground hover:text-[#0a0a0a] hover:border-zinc-700'
            }`}
          >
            {sz}
          </button>
        ))}
      </div>
    </div>
  );
};
