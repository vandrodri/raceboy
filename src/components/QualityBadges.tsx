import React from "react";
import { motion } from "motion/react";
import { 
  Award, 
  ShieldCheck, 
  Flag, 
  BadgeCheck, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Heart,
  Lock
} from "lucide-react";
import { showToast } from "../utils/toast";

interface BadgeItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  tag: string;
  colorClass: string;
  badgeBg: string;
}

const QUALITY_BADGES: BadgeItem[] = [
  {
    id: "compra-segura",
    title: "Compra 100% Segura",
    subtitle: "Ambiente Criptografado & SSL",
    description: "Transações e orçamentos diretos com faturamento transparente, contrato formal e proteção integral aos dados.",
    icon: <Lock className="w-6 h-6 text-emerald-400" />,
    tag: "PAGAMENTO SEGURO",
    colorClass: "border-emerald-400/40 hover:border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]",
    badgeBg: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30"
  },
  {
    id: "iso-9001",
    title: "Certificado ISO 9001",
    subtitle: "Padrão Industrial de Qualidade",
    description: "Corte CNC computadorizado de altíssima precisão e acabamento impecável em MDF naval especial.",
    icon: <Award className="w-6 h-6 text-neon-pink" />,
    tag: "ISO QUALITY",
    colorClass: "border-neon-pink/40 hover:border-neon-pink shadow-[0_0_15px_rgba(255,0,127,0.15)]",
    badgeBg: "bg-neon-pink/10 text-neon-pink border-neon-pink/30"
  },
  {
    id: "garantia-5-anos",
    title: "Garantia de 5 Anos",
    subtitle: "Cobertura Total RaceBoy",
    description: "Garantia estendida de 5 anos cobrindo estrutura em MDF naval, alinhamento CNC, cordoalhas e encaixes modulares.",
    icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
    tag: "5 ANOS GARANTIA",
    colorClass: "border-amber-400/50 hover:border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.2)]",
    badgeBg: "bg-amber-400/15 text-amber-400 border-amber-400/40"
  },
  {
    id: "federacao-autorama",
    title: "Membro da Federação",
    subtitle: "Federação Brasileira de Autorama",
    description: "Geometria de curvas, espaçamento entre fendas e raio de inclinação aprovados para campeonatos oficiais.",
    icon: <BadgeCheck className="w-6 h-6 text-neon-blue" />,
    tag: "FEDERAÇÃO CBT",
    colorClass: "border-neon-blue/40 hover:border-neon-blue shadow-[0_0_15px_rgba(0,240,255,0.15)]",
    badgeBg: "bg-neon-blue/10 text-neon-blue border-neon-blue/30"
  },
  {
    id: "made-in-brazil",
    title: "Made in Brazil 🇧🇷",
    subtitle: "Engenharia 100% Nacional",
    description: "Fabricação brasileira com garantia de peças de reposição imediatas e suporte direto do projetista.",
    icon: <Flag className="w-6 h-6 text-neon-green" />,
    tag: "PRODUTO NACIONAL",
    colorClass: "border-neon-green/40 hover:border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.15)]",
    badgeBg: "bg-neon-green/10 text-neon-green border-neon-green/30"
  },
  {
    id: "eletrica-homologada",
    title: "Telemetria & Elétrica",
    subtitle: "Alimentação Segura & Regulada",
    description: "Fontes chaveadas independentes por fenda e sensores digitais antirruído para marcação exata de voltas.",
    icon: <Zap className="w-6 h-6 text-purple-400" />,
    tag: "SISTEMA SEGURO",
    colorClass: "border-purple-400/40 hover:border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.15)]",
    badgeBg: "bg-purple-400/10 text-purple-400 border-purple-400/30"
  },
  {
    id: "suporte-vitalicio",
    title: "Assistência Vitalícia",
    subtitle: "Suporte Direto com Projetista",
    description: "Atendimento pós-venda permanente para expansões de módulos, manutenção e upgrades do circuito.",
    icon: <Layers className="w-6 h-6 text-cyan-400" />,
    tag: "SUPORTE DIRETO",
    colorClass: "border-cyan-400/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]",
    badgeBg: "bg-cyan-400/10 text-cyan-400 border-cyan-400/30"
  }
];

export default function QualityBadges() {
  const handleBadgeClick = (badge: BadgeItem) => {
    showToast(`Selo ${badge.title}: ${badge.subtitle}`);
  };

  return (
    <section id="quality-badges-root" className="w-full border-t border-zinc-800/80 py-10 bg-zinc-950/60 relative overflow-hidden">
      {/* Background ambient glow line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-full text-[10px] font-retro-mono text-neon-blue uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" /> CERTIFICAÇÕES DE EXCELÊNCIA & CONFIANÇA
            </div>
            <h3 className="font-retro-title text-lg sm:text-xl text-zinc-100 tracking-wide uppercase">
              SELOS DE QUALIDADE RACEBOY
            </h3>
            <p className="text-xs font-retro-mono text-zinc-500 mt-1 uppercase tracking-wider">
              Qualidade industrial e compromisso técnico em cada centímetro de pista fabricada
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-retro-mono text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-lg w-fit">
            <CheckCircle2 className="w-4 h-4 text-neon-green" />
            <span>Pistas 100% Inspecionadas antes do Envio</span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {QUALITY_BADGES.map((badge, index) => (
            <motion.div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { type: "spring", stiffness: 400, damping: 20 }
              }}
              whileTap={{ scale: 0.98 }}
              className={`group bg-zinc-900/70 border rounded-xl p-4 cursor-pointer flex flex-col justify-between relative overflow-hidden backdrop-blur-sm transition-colors duration-300 ${badge.colorClass}`}
            >
              {/* Corner tech notch accent */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-zinc-800/40 rounded-bl-xl border-b border-l border-zinc-700/50 flex items-center justify-center pointer-events-none group-hover:bg-zinc-700/50 transition-colors">
                <span className="text-[8px] font-retro-tech text-zinc-400">OK</span>
              </div>

              <div>
                {/* Header Tag & Icon */}
                <div className="flex items-center justify-between mb-3 pr-6">
                  <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 group-hover:scale-110 group-hover:animate-pulse transition-transform duration-300">
                    {badge.icon}
                  </div>
                  <span className={`text-[8px] font-retro-mono tracking-widest uppercase px-2 py-0.5 rounded border transition-all duration-300 group-hover:shadow-sm ${badge.badgeBg}`}>
                    {badge.tag}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h4 className="font-retro-title text-xs text-zinc-100 font-bold uppercase tracking-wider mb-1 group-hover:text-amber-400 transition-colors">
                  {badge.title}
                </h4>
                <p className="text-[10px] font-retro-mono text-amber-400/90 mb-2 font-medium">
                  {badge.subtitle}
                </p>

                {/* Description */}
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  {badge.description}
                </p>
              </div>

              {/* Bottom verify link indicator */}
              <div className="mt-4 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[9px] font-retro-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green inline-block animate-ping" />
                  VERIFICADO
                </span>
                <span className="group-hover:translate-x-1.5 transition-transform duration-200">➔</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
