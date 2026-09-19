import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Bot, Terminal, ShieldAlert, Cpu, Wrench } from 'lucide-react';

interface RexaGreetingProps {
  onSelectPrompt: (prompt: string) => void;
  targetVersion: string;
  targetPlatform: string;
}

export const RexaGreeting: React.FC<RexaGreetingProps> = ({
  onSelectPrompt,
  targetVersion,
  targetPlatform,
}) => {
  const quickPills = [
    {
      title: 'Paper 26.2 Custom Enchants',
      desc: 'Lightning, Lifesteal & PDC Storage',
      icon: Sparkles,
      prompt: `Create a super best tier Paper 26.2 plugin called "RexaEnchants" with 3 custom enchantments (ThunderStrike, Lifesteal, AutoSmelt). Use modern Adventure MiniMessage, PersistentDataContainer for custom items, and full config.yml customization.`
    },
    {
      title: 'Folia Region-Safe RTP',
      desc: 'Multi-threaded teleporter without lag',
      icon: Cpu,
      prompt: `Create an ultra-optimized Folia & Paper 26.2 Random Teleport (RTP) plugin using RegionScheduler, sound effects, particle circles, and customizable safe coordinates in config.yml.`
    },
    {
      title: 'Analyze & Fix Crashes',
      desc: 'Debug stack traces and patch code',
      icon: Wrench,
      prompt: `Can you inspect my server error log and tell me why my plugin is throwing a NullPointerException on PlayerJoinEvent, then fix the code for me?`
    },
    {
      title: 'Economy GUI Shop',
      desc: 'Chest GUI with Vault buy/sell',
      icon: Terminal,
      prompt: `Create a professional Paper 1.21/26.2 GUI Shop plugin called "RexaShop" with Vault economy support, categories, page navigation, and sound feedback.`
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-2 sm:my-4 p-4 sm:p-6 md:p-8 rounded-2xl bg-gradient-to-b from-[#170929]/80 via-[#0d0418]/90 to-[#05010a] border border-purple-500/20 shadow-purple-intense relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Bot Identity & Animated Greeting */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-5 sm:mb-6 relative z-10">
        {/* Animated Bot Avatar */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative shrink-0"
        >
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-700 to-purple-900 p-0.5 shadow-purple-glow">
            <div className="w-full h-full bg-[#0d031c] rounded-[14px] flex items-center justify-center relative overflow-hidden">
              <Bot className="w-8 h-8 sm:w-11 sm:h-11 text-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
              {/* Particle Sparkle */}
              <motion.div
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-300"
              />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-500 border-2 border-[#0d031c]"></span>
          </span>
        </motion.div>

        {/* The Exact Animated Greeting as Requested */}
        <div className="text-center sm:text-left flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="truncate">Architect • {targetPlatform.toUpperCase()} {targetVersion.split(' ')[0]}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
          >
            <span className="bg-gradient-to-r from-purple-200 via-purple-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(192,132,252,0.4)]">
              Hi Iam Rexa ai How can I help you :))
            </span>
          </motion.h1>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            Describe any Minecraft plugin idea in chat. I will architect professional, super best level Java code, diagnose and fix server errors, and package the final plugin directly into ready-to-run <span className="text-purple-300 font-semibold underline decoration-purple-500/50">.JAR</span> and <span className="text-purple-300 font-semibold underline decoration-purple-500/50">.ZIP</span> files for any version!
          </p>
        </div>
      </div>

      {/* Quick Launch Action Pills */}
      <div className="relative z-10 pt-2 border-t border-purple-500/15">
        <p className="text-xs uppercase font-semibold text-purple-400/80 tracking-wider mb-3">
          Popular Instant Blueprints:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickPills.map((pill, idx) => {
            const Icon = pill.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectPrompt(pill.prompt)}
                className="group flex items-start gap-3 p-3 rounded-xl bg-purple-950/20 hover:bg-purple-900/40 border border-purple-500/15 hover:border-purple-500/40 text-left transition-all duration-200 cursor-pointer hover:shadow-purple-glow"
              >
                <div className="p-2 rounded-lg bg-purple-900/40 text-purple-300 group-hover:bg-purple-600 group-hover:text-white transition-colors shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-purple-100 group-hover:text-purple-300 transition-colors">
                    {pill.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {pill.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
