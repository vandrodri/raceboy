import React from "react";
import { motion } from "motion/react";
import { Sparkles, Calendar, Zap, MessageSquare, Flame, Shield, Compass, ArrowRight, Play, Eye, Layers } from "lucide-react";
import { showToast } from "../utils/toast";
import { SiteConfig, formatYouTubeEmbedUrl } from "../types";

interface DestaquesViewProps {
  siteConfig?: SiteConfig;
}

export default function DestaquesView({ siteConfig }: DestaquesViewProps) {
  const raceenImg = siteConfig?.raceenImage || "https://i.postimg.cc/RhckBvw7/raceboy-raceen-2027.png";
  const raceenVideo = formatYouTubeEmbedUrl(siteConfig?.raceenVideoUrl);
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      "Olá! Vi o destaque da pista *Raceen* no site e gostaria de solicitar mais informações e um orçamento."
    );
    showToast("Solicitação enviada! Redirecionando para o WhatsApp...");
    window.open(`https://wa.me/5511994388829?text=${text}`, "_blank");
  };

  const handleMlcWhatsAppClick = () => {
    const text = encodeURIComponent(
      "Olá RaceBoy! Tenho interesse no projeto de estrutura em *Madeira Laminada Colada (MLC)* para minha pista. Gostaria de entender mais detalhes e valores!"
    );
    showToast("Solicitação enviada! Redirecionando para o WhatsApp...");
    window.open(`https://wa.me/5511994388829?text=${text}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-12 py-6"
    >
      {/* Page Header */}
      <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b border-zinc-800/80 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-full text-[10px] font-retro-mono text-neon-blue uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> NOVIDADES & LANÇAMENTOS
          </div>
          <h2 className="font-retro-title text-3xl sm:text-4xl text-zinc-100 tracking-tight leading-none uppercase">
            CENTRAL DE DESTAQUES
          </h2>
          <p className="text-xs font-retro-mono text-zinc-500 mt-2 uppercase tracking-wider">
            Acompanhe em primeira mão os novos projetos e inovações exclusivas da RaceBoy
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-retro-mono text-zinc-400 bg-zinc-950/60 border border-zinc-800 px-4 py-2 rounded-xl">
          <Calendar className="w-4 h-4 text-neon-pink" />
          <span>ÚLTIMA ATUALIZAÇÃO: JULHO 2026</span>
        </div>
      </div>

      {/* Primary Highlight - Raceen 2027 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Details & Specs */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 box-glow-blue relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-neon-pink/15 text-neon-pink text-[10px] font-retro-mono px-2.5 py-1 rounded border border-neon-pink/30 uppercase tracking-wider">
                LANÇAMENTO REVOLUCIONÁRIO
              </span>
              <span className="bg-zinc-900 text-zinc-400 text-[10px] font-retro-mono px-2.5 py-1 rounded border border-zinc-800 uppercase tracking-wider">
                PROJETADO PARA EVENTOS
              </span>
            </div>

            <h3 className="font-retro-title text-2xl sm:text-3xl text-zinc-100 uppercase tracking-wide leading-tight mb-4">
              Pista Modelo <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink text-glow-blue">Raceen 2027</span>
            </h3>

            <p className="text-zinc-400 font-sans text-sm sm:text-base leading-relaxed mb-6">
              Desenvolvida sob medida pela equipe RaceBoy, a <strong className="text-zinc-200">Raceen 2027</strong> é a melhor solução do mercado para locadores, buffets, salões de festas infantis e eventos corporativos. Com dimensões inteligentes e resistência extrema, ela cabe em qualquer lugar e garante diversão contínua.
            </p>

            {/* Main Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-zinc-900/60 border border-zinc-800/40 rounded-xl p-4 flex items-start gap-3">
                <div className="bg-neon-blue/10 p-2 rounded-lg text-neon-blue border border-neon-blue/20">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-retro-title text-[11px] text-zinc-300">ESTRUTURA REFORÇADA</h4>
                  <p className="text-[10px] text-zinc-500 font-sans mt-0.5 leading-snug">
                    Laterais em compensado naval espesso de alta durabilidade e cantoneiras robustas.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/40 rounded-xl p-4 flex items-start gap-3">
                <div className="bg-neon-pink/10 p-2 rounded-lg text-neon-pink border border-neon-pink/20">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-retro-title text-[11px] text-zinc-300">TAMANHO COMPACTO</h4>
                  <p className="text-[10px] text-zinc-500 font-sans mt-0.5 leading-snug">
                    Área otimizada de 1.400 x 650 mm, excelente para salas de brinquedos e montagem rápida.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/40 rounded-xl p-4 flex items-start gap-3">
                <div className="bg-neon-green/10 p-2 rounded-lg text-neon-green border border-neon-green/20">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-retro-title text-[11px] text-zinc-300">PÉS REMOVÍVEIS</h4>
                  <p className="text-[10px] text-zinc-500 font-sans mt-0.5 leading-snug">
                    Sistema simples de desencaixe rápido dos pés para transporte em carros comuns (SUV/Hatch).
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-800/40 rounded-xl p-4 flex items-start gap-3">
                <div className="bg-neon-yellow/10 p-2 rounded-lg text-neon-yellow border border-neon-yellow/20">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-retro-title text-[11px] text-zinc-300">BIVOLT AUTOMÁTICO</h4>
                  <p className="text-[10px] text-zinc-500 font-sans mt-0.5 leading-snug">
                    Fonte bivolt inteligente (110V/220V) protegida contra sobrecargas e curtos.
                  </p>
                </div>
              </div>
            </div>

            {/* Exclusive Car Highlight */}
            <div className="bg-gradient-to-r from-neon-pink/5 to-transparent border border-neon-pink/20 rounded-xl p-5 mb-8">
              <div className="flex items-center gap-2 mb-2 text-neon-pink font-retro-title text-[11px]">
                <Flame className="w-4 h-4 animate-bounce" /> REBELDIA INDUSTRIAL: CARROS DE ALUMÍNIO
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Esqueça bolhas de plástico frágeis que quebram no primeiro choque! O modelo acompanha carros com <strong className="text-zinc-200">carroceria de alumínio estrutural</strong> extremamente resistentes, projetados especificamente para aguentar as mãos cheias de energia das crianças sem danificar a mecânica.
              </p>
            </div>

            {/* Business value / differential */}
            <div className="bg-zinc-900/50 border border-zinc-800/60 p-5 rounded-xl border-l-4 border-l-neon-green">
              <h4 className="font-retro-title text-xs text-zinc-200 mb-1.5 uppercase">O Grande Diferencial de Vendas</h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Ideal para complementar pacotes de brinquedos para festas de meninos e encontros familiares. Oferece uma atração nostálgica e ultra competitiva que se destaca de infláveis e fliperamas tradicionais, permitindo um excelente retorno sobre o investimento inicial.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Media (Image & Video) & CTA Button */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Visual Presentation Card */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6 box-glow-pink">
            <h4 className="font-retro-title text-xs text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Eye className="w-4 h-4 text-neon-pink" /> Demonstrativos do Modelo
            </h4>

            {/* Dynamic Image */}
            <div className="relative group rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-900">
              <img
                src={raceenImg}
                alt="Raceen 2026"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                style={{ 
                  transform: "translate3d(0, 0, 0) rotate(0.01deg)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-black/80 border border-zinc-700/80 px-2 py-1 rounded text-[8px] font-retro-mono text-neon-pink uppercase">
                FOTO RACEEN 2027
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
                <span className="font-retro-mono text-[9px] text-zinc-400 uppercase block tracking-wider">
                  Pista Raceen 2027
                </span>
              </div>
            </div>

            {/* Dynamic Video */}
            <div className="flex flex-col gap-2">
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-900 shadow-inner">
                {/* Embedded YouTube video clip */}
                <iframe
                  className="w-full h-full"
                  src={raceenVideo}
                  title="RaceBoy Slot Car Showcase"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="absolute top-3 left-3 bg-black/80 border border-zinc-700/80 px-2 py-1 rounded text-[8px] font-retro-mono text-neon-blue uppercase pointer-events-none">
                  VÍDEO COMPOSIÇÃO
                </div>
              </div>
              <span className="text-[10px] font-retro-mono text-zinc-500 uppercase text-center mt-1">
                *Vídeo de apresentação oficial RaceBoy
              </span>
            </div>

            {/* Big Catchy CTA Button */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(57, 255, 20, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWhatsAppClick}
              className="w-full py-4 bg-neon-green hover:bg-[#46ff2e] text-black font-retro-title text-sm tracking-wider rounded-xl transition-all font-bold flex items-center justify-center gap-3 border border-white/20 shadow-[0_0_15px_rgba(57,255,20,0.2)] cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-black" />
              SOLICITAR ORÇAMENTO DA RACEEN
            </motion.button>
          </div>

          {/* Quick Specifications list */}
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 font-retro-mono text-[10px] text-zinc-500 flex flex-col gap-2.5">
            <span className="text-zinc-400 font-retro-title text-[10px] uppercase tracking-wider mb-1 block">
              FICHA TÉCNICA RESUMIDA:
            </span>
            <div className="flex justify-between border-b border-zinc-900 pb-1.5">
              <span>NOME DO PROJETO:</span>
              <span className="text-zinc-300">RACEEN 2027 (ED. LIMITADA)</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1.5">
              <span>CUMPRIMENTO X LARGURA:</span>
              <span className="text-neon-blue">1.400 x 650 MILÍMETROS</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1.5">
              <span>ALTURA OPERACIONAL:</span>
              <span className="text-zinc-300">800 mm (PÉS MONTADOS)</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1.5">
              <span>MATERIAL DO CHASSI:</span>
              <span className="text-zinc-300">COMPENSADO NAVAL + MDF USINADO</span>
            </div>
            <div className="flex justify-between border-b border-zinc-900 pb-1.5">
              <span>VEÍCULOS INCLUSOS:</span>
              <span className="text-neon-pink">02 UNIDADES EM ALUMÍNIO PREMIUM</span>
            </div>
            <div className="flex justify-between">
              <span>SISTEMA DE ENERGIA:</span>
              <span className="text-neon-green">FONTE ISOLADA BIVOLT AUTOMÁTICO</span>
            </div>
          </div>

        </div>

      </div>

      {/* Custom Option Feature Banner - Madeira Laminada Colada (MLC) */}
      <div className="bg-gradient-to-r from-amber-950/40 via-zinc-950 to-amber-950/20 border border-amber-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_25px_rgba(251,191,36,0.1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-[10px] font-retro-mono text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> SOLICITAÇÃO ESPECIAL DE CLIENTE
            </div>

            <h3 className="font-retro-title text-xl sm:text-2xl text-zinc-100 uppercase tracking-wide">
              ESTRUTURAS EM <span className="text-amber-400">MADEIRA LAMINADA COLADA (MLC)</span>
            </h3>

            <p className="text-zinc-300 font-sans text-xs sm:text-sm leading-relaxed max-w-3xl">
              Atendendo a pedidos de clientes e projetos de alto padrão arquitetônico, a RaceBoy produz a estrutura de sustentação, elevações e base das pistas em <strong className="text-amber-300">Madeira Laminada Colada (MLC / Glulam)</strong>. Essa tecnologia une lâminas selecionadas com resinas industriais de altíssima resistência sob pressão.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl">
                <span className="font-retro-title text-[10px] text-amber-400 block mb-1">IMUNIDADE A EMPENAMENTO</span>
                <p className="text-[10px] text-zinc-400 font-sans">
                  Zero torção ou empenamento por variações de umidade e temperatura ao longo dos anos.
                </p>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl">
                <span className="font-retro-title text-[10px] text-neon-blue block mb-1">GRANDES VÃOS LIVRES</span>
                <p className="text-[10px] text-zinc-400 font-sans">
                  Viadutos e pontes curvas suspensas com grande vão livre, sem pilares obstruindo a visão dos pilotos.
                </p>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-xl">
                <span className="font-retro-title text-[10px] text-neon-green block mb-1">ESTÉTICA ARQUITETÔNICA</span>
                <p className="text-[10px] text-zinc-400 font-sans">
                  Visual nobre em madeira maciça com curvas orgânicas para integrar a pista ao ambiente residencial ou comercial.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto flex-shrink-0">
            <button
              onClick={handleMlcWhatsAppClick}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-retro-title text-xs tracking-wider rounded-xl font-bold uppercase transition-all shadow-[0_0_20px_rgba(251,191,36,0.25)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <MessageSquare className="w-4 h-4 fill-black" />
              CONSULTAR PROJETO EM MLC
            </button>
            <span className="text-[9px] font-retro-mono text-zinc-500 text-center uppercase">
              Sob encomenda • Corte CNC industrial
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Other News / Coming Soon cards to enrich the news experience */}
      <div className="mt-8 border-t border-zinc-800/60 pt-10">
        <h3 className="font-retro-title text-base text-zinc-200 uppercase mb-6 tracking-wider">
          Mais Novidades da Oficina RaceBoy
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
            <span className="text-[9px] font-retro-mono text-neon-yellow">PREVISÃO: AGO 2026</span>
            <h4 className="font-retro-title text-xs text-zinc-200">SISTEMA DE TELEMETRIA BLUETOOTH</h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Novo aplicativo mobile para controle de voltas, recordes em tempo real e simulação de consumo de combustível direto no seu celular.
            </p>
          </div>

          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
            <span className="text-[9px] font-retro-mono text-neon-blue">EM DESENVOLVIMENTO</span>
            <h4 className="font-retro-title text-xs text-zinc-200 font-bold">PISTA ESPACIAL DE 8 FENDAS</h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Protótipo de pista gigante com curvas ultra compensadas e sistema de alimentação redundante, ideal para competições estaduais de alto nível.
            </p>
          </div>

          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 flex flex-col gap-3 relative overflow-hidden group">
            <span className="text-[9px] font-retro-mono text-neon-pink">LANÇAMENTO</span>
            <h4 className="font-retro-title text-xs text-zinc-200">KITS DE PEÇAS DE DESGASTE RÁPIDO</h4>
            <p className="text-xs text-zinc-500 font-sans leading-relaxed">
              Já disponíveis sob encomenda: cordoalhas reservas de alta condutividade e pneus de silicone de alta viscosidade para máxima performance.
            </p>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
