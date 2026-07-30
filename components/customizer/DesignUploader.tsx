import React from 'react';
import { Layers, UploadCloud, Trash2, RefreshCw } from 'lucide-react';

interface DesignUploaderProps {
  activeView: 'front' | 'back';
  onViewChange: (view: 'front' | 'back') => void;
  loading: boolean;
  frontLogo: string | null;
  backLogo: string | null;
  onUploadFront: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadBack: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFront: () => void;
  onRemoveBack: () => void;
}

export const DesignUploader: React.FC<DesignUploaderProps> = ({
  activeView,
  onViewChange,
  loading,
  frontLogo,
  backLogo,
  onUploadFront,
  onUploadBack,
  onRemoveFront,
  onRemoveBack
}) => {
  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 space-y-4">
      <h3 className="font-bold text-sm text-zinc-300 flex items-center gap-2">
        <Layers size={16} className="text-violet-400" />
        3. Print Graphic
      </h3>

      {/* Front / Back Tab */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
        {(['front', 'back'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onViewChange(v)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              activeView === v
                ? 'bg-violet-600 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {v} View
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {/* Front upload */}
        {activeView === 'front' && (
          <>
            <label className="w-full h-24 rounded-xl border border-dashed border-zinc-800 hover:border-violet-700/50 bg-zinc-950 hover:bg-zinc-950/60 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all">
              {loading ? (
                <RefreshCw className="animate-spin text-zinc-500" size={20} />
              ) : (
                <>
                  <UploadCloud size={20} className="text-zinc-500" />
                  <span className="text-xs font-semibold text-zinc-400">Upload Front Print</span>
                </>
              )}
              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={onUploadFront} />
            </label>
            {frontLogo && (
              <button 
                type="button"
                onClick={onRemoveFront} 
                className="w-full py-2.5 rounded-lg border border-red-500/30 bg-red-950/10 hover:bg-red-950/20 text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={13} /> Remove Front Design
              </button>
            )}
          </>
        )}

        {/* Back upload */}
        {activeView === 'back' && (
          <>
            <label className="w-full h-24 rounded-xl border border-dashed border-zinc-800 hover:border-violet-700/50 bg-zinc-950 hover:bg-zinc-950/60 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all">
              {loading ? (
                <RefreshCw className="animate-spin text-zinc-500" size={20} />
              ) : (
                <>
                  <UploadCloud size={20} className="text-zinc-500" />
                  <span className="text-xs font-semibold text-zinc-400">Upload Back Print</span>
                </>
              )}
              <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={onUploadBack} />
            </label>
            {backLogo && (
              <button 
                type="button"
                onClick={onRemoveBack} 
                className="w-full py-2.5 rounded-lg border border-red-500/30 bg-red-950/10 hover:bg-red-950/20 text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 size={13} /> Remove Back Design
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
