import React from 'react';
import { Paintbrush } from 'lucide-react';

export interface ColorOption {
  name: string;
  hex: string;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: ColorOption;
  onChange: (color: ColorOption) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, selectedColor, onChange }) => {
  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
      <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-2">
        <Paintbrush size={16} className="text-violet-400" />
        1. Apparel Color
      </h3>
      <div className="flex flex-wrap gap-3">
        {colors.map((col) => (
          <button
            key={col.name}
            type="button"
            onClick={() => onChange(col)}
            style={{ backgroundColor: col.hex }}
            className={`w-10 h-10 rounded-full border-2 transition-all ${
              selectedColor.name === col.name
                ? 'border-violet-500 scale-110 shadow-lg shadow-violet-600/30'
                : 'border-zinc-800 hover:border-zinc-500 hover:scale-105'
            }`}
            title={col.name}
          />
        ))}
      </div>
      <p className="text-xs text-zinc-500 font-medium">Selected Color: {selectedColor.name}</p>
    </div>
  );
};
