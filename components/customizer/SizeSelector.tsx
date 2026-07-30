import React from 'react';
import { Shirt } from 'lucide-react';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onChange: (size: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({ sizes, selectedSize, onChange }) => {
  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
      <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-2">
        <Shirt size={16} className="text-violet-400" />
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
                ? 'bg-violet-600 border-violet-500 text-white shadow-md'
                : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
          >
            {sz}
          </button>
        ))}
      </div>
    </div>
  );
};
