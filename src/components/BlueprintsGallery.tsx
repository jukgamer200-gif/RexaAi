import React from 'react';
import { Sparkles, ArrowRight, Layers, Cpu, ShieldCheck, Flame } from 'lucide-react';
import { BLUEPRINT_TEMPLATES } from '../data/templates';
import { BlueprintTemplate } from '../types';

interface BlueprintsGalleryProps {
  onSelectBlueprint: (blueprint: BlueprintTemplate) => void;
}

export const BlueprintsGallery: React.FC<BlueprintsGalleryProps> = ({
  onSelectBlueprint,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-[#06010c] via-[#090314] to-black min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#160627] to-indigo-950/40 border border-purple-500/30 shadow-purple-glow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Pre-Architected Best-Tier Blueprints
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Instant Plugin Inspiration Gallery
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
              Click any blueprint below to instantly load its prompt into Rexa AI Studio and generate the complete compiled plugin.
            </p>
          </div>
        </div>

        {/* Grid of Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BLUEPRINT_TEMPLATES.map((bp) => (
            <div
              key={bp.id}
              onClick={() => onSelectBlueprint(bp)}
              className="group p-5 rounded-2xl bg-[#0e041d]/80 hover:bg-[#16062d] border border-purple-500/20 hover:border-purple-500/50 shadow-dark-card hover:shadow-purple-glow transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300">
                    {bp.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {bp.category}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors mb-2">
                  {bp.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {bp.description}
                </p>
              </div>

              <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-purple-400">
                  {bp.platform.toUpperCase()} • {bp.version.split(' ')[0]}
                </span>
                <span className="text-purple-300 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Generate <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
