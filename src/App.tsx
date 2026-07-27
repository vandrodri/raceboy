import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Radio, ChevronRight, HelpCircle, Trophy, Sparkles, MapPin, Phone, Github, Award, Flame, Timer, Facebook, X, Sun, Moon, Camera, Box } from "lucide-react";
import SlotSimulator from "./components/SlotSimulator";
import TrackPlanner from "./components/TrackPlanner";
import DestaquesView from "./components/DestaquesView";
import HistoriaView from "./components/HistoriaView";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import QualityBadges from "./components/QualityBadges";
import ArViewerModal from "./components/ArViewerModal";
import { showToast } from "./utils/toast";

interface GalleryItem {
  id: number;
  title: string;
  client: string;
  specs: string;
  image: string;
  glowClass: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    title: "MÁXIMO DETALHE",
    client: "Carlos M. (PR)",
    specs: "PROJETO: CUSTOM SPA | 6 FENDAS",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-pink hover:shadow-[0_0_20px_rgba(255,0,127,0.4)]"
  },
  {
    id: 2,
    title: "SÉRIE NOTURNA",
    client: "Julio C. (SP)",
    specs: "SÉRIE ESPECIAL LEDS | 4 FENDAS",
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-blue hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
  },
  {
    id: 3,
    title: "TRAÇÃO ABSOLUTA",
    client: "Renato G. (RS)",
    specs: "REVESTIMENTO EMBORRACHADO | 2 FENDAS",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-red hover:shadow-[0_0_20px_rgba(255,30,39,0.4)]"
  },
  {
    id: 4,
    title: "CONTROLE INTEGRADO",
    client: "Marcelo A. (RJ)",
    specs: "PAINEL RACEBOY | TELEMETRIA",
    image: "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-green hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]"
  },
  {
    id: 5,
    title: "TRAÇADO ELETRÔNICO",
    client: "Fabricio S. (MG)",
    specs: "PROJETO COMPACTO RESIDENCIAL",
    image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-yellow hover:shadow-[0_0_20px_rgba(255,240,31,0.4)]"
  },
  {
    id: 6,
    title: "ESCALA DE PRECISÃO",
    client: "Bruno K. (SC)",
    specs: "PISTA DE RALLY | CURVAS COMPENSADAS",
    image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-pink hover:shadow-[0_0_20px_rgba(255,0,127,0.4)]"
  }
];

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Como funciona o processo de personalização de pistas?",
    answer: "Você pode desenhar o rascunho inicial do traçado no nosso simulador de projetos acima, selecionando fendas e tamanho de área. Ao clicar no link de consultoria, nosso mestre de pista recebe a planta digital em escala. Em seguida, desenhamos a modelagem técnica no CAD/CAM e preparamos a usinagem CNC perfeita com compensação dinâmica de traçado."
  },
  {
    question: "Como realizar a manutenção e limpeza corretas da pista?",
    answer: "Para manter o grip excelente e a condutividade elétrica pura, basta passar periodicamente um pano macio de microfibra umedecido em álcool isopropílico pelas cordoalhas metálicas de contato (evitando álcool comum). Na pista texturizada emborrachada, use espanador de pó ou aspirador de pó com bocal de cerdas suaves. Nunca use água ou produtos químicos abrasivos na superfície de MDF."
  },
  {
    question: "Quais fendas e carros são compatíveis com as pistas Raceboy?",
    answer: "Nossas pistas profissionais e residenciais de madeira aceitam todos os guias padrão de réplicas de autorama e slot car das principais marcas do mercado nacional e internacional (escalas 1:32, 1:24 e 1:43). Nossas fendas têm profundidade e largura perfeitas para garantir transições suaves em curvas fechadas."
  },
  {
    question: "Como é o processo de faturamento, prazo de entrega e frete?",
    answer: "Após o fechamento técnico do projeto 3D, fornecemos um orçamento completo com prazos detalhados (que costumam variar de 30 a 60 dias dependendo do tamanho). Despachamos para todo o território brasileiro utilizando transportadoras especializadas em engradados de madeira lacrados de alta resistência para proteger cada curva e módulo."
  },
  {
    question: "Posso escolher entre pistas modulares ou de peça única?",
    answer: "Sim! Pistas residenciais ou comerciais de médio/grande porte podem ser fabricadas em múltiplos módulos autoportantes de encaixe preciso por cavilhas e conectores de engate rápido. Isso facilita o armazenamento, transporte e montagem/desmontagem rápida sem perda de nivelamento de fenda ou continuidade de energia."
  },
  {
    question: "É possível fazer a estrutura da pista em Madeira Laminada Colada (MLC)?",
    answer: "Sim! A RaceBoy desenvolve e fabrica estruturas de sustentação, elevações, pontes e bases em Madeira Laminada Colada (MLC / Glulam) sob encomenda conforme a solicitação do cliente. O MLC utiliza lâminas de madeira nobre coladas com resinas de alta resistência sob pressão industrial, garantindo imunidade a empenamentos por umidade/temperatura, suporte a grandes vãos livres sem colunas intermediárias e um acabamento arquitetônico sofisticado."
  }
];

export default function App() {
  const [bootState, setBootState] = useState<"frozen" | "booting" | "active">("frozen");
  const [glitchText, setGlitchText] = useState("1.991");
  const [bootLogIndex, setBootLogIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [arItem, setArItem] = useState<GalleryItem | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<"home" | "destaques" | "historia">("home");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    try {
      return (localStorage.getItem("raceboy_theme") as "dark" | "light") || "dark";
    } catch (e) {
      return "dark";
    }
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("raceboy_theme", nextTheme);
    } catch (e) {}
    showToast(
      nextTheme === "light"
        ? "Modo Prototipagem (Dia) Ativo!"
        : "Modo Retro Cyberpunk (Noite) Ativo!"
    );
  };

  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "error" | "info" }[]>([]);

  // Listen for global custom toasts
  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { message, type, duration } = customEvent.detail || { message: "", type: "success", duration: 4000 };
      if (!message) return;
      const id = Math.random().toString(36).substring(2, 9);
      
      setToasts((prev) => [...prev, { id, message, type }]);

      // Retro high-tech synth audio feedback for toast popup
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now); // A5 note
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08); // E6 note
        
        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.12);
      } catch (err) {
        // Ignored if interaction blocked
      }

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration || 4000);
    };

    window.addEventListener("raceboy-toast", handleToast);
    return () => {
      window.removeEventListener("raceboy-toast", handleToast);
    };
  }, []);

  const navigateToSection = (id: string) => {
    setActiveView("home");
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const bootLogs = [
    "SISTEMA DE CORRENTE INDEPENDENTE: OK",
    "ALIMENTAÇÃO REGULADA 14.8V: OK",
    "FRESAGEM DE MADEIRA CNC MODEL: CARREGADO",
    "TELEMETRIA DS-RACING INTEGRADA... OK",
    "AUTO PISTA PROFISSIONAL... IGNITION!",
  ];

  // Disable scrolling during frozen/booting state or when lightbox/AR modal is open
  useEffect(() => {
    if (bootState !== "active" || selectedImage !== null || arItem !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [bootState, selectedImage, arItem]);

  // Handle the 3-second freeze and subsequent dramatic unfreeze
  useEffect(() => {
    // Stage 1: The 3 seconds frozen state
    const freezeTimeout = setTimeout(() => {
      setBootState("booting");

      // Play retro startup sound synthesized via Web Audio API
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        
        // Dynamic synth chime: ascending pitch representing starting electric motor
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.4);

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(240, now);
        osc2.frequency.exponentialRampToValueAtTime(760, now + 0.4);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 0.5);
        osc2.stop(now + 0.5);
      } catch (e) {
        console.warn("AudioContext startup bypassed until interaction.");
      }

      // Fast intervals to cycle boot logs and glitch text
      const logInterval = setInterval(() => {
        setBootLogIndex((prev) => (prev < bootLogs.length - 1 ? prev + 1 : prev));
      }, 100);

      const textGlitchInterval = setInterval(() => {
        const chars = "1991!@#$%-+";
        let temp = "";
        for (let i = 0; i < 5; i++) {
          temp += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setGlitchText(temp);
      }, 50);

      // Transition to active state after booting phase finishes
      const bootActiveTimeout = setTimeout(() => {
        clearInterval(logInterval);
        clearInterval(textGlitchInterval);
        setBootState("active");
      }, 700);

      return () => {
        clearTimeout(bootActiveTimeout);
        clearInterval(logInterval);
        clearInterval(textGlitchInterval);
      };
    }, 3000); // Exactly 3 seconds freeze

    return () => clearTimeout(freezeTimeout);
  }, []);

  return (
    <div className={`min-h-screen font-sans selection:bg-neon-pink selection:text-white transition-colors duration-300 ${theme === "light" ? "theme-light bg-slate-50 text-slate-900" : "bg-black text-zinc-100"}`}>
      <AnimatePresence mode="wait">
        {/* State A: The 3 Seconds FROZEN Stage */}
        {bootState === "frozen" && (
          <motion.div
            key="frozen-screen"
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center z-50 select-none cursor-default"
          >
            {/* Extremely subtle grid background (totally static) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />

            {/* Simulated frozen CRT scanline effect */}
            <div className="absolute inset-0 crt-scanlines opacity-50 pointer-events-none" />

            {/* Giant Frozen 1.991 Number - 80s retro font */}
            <div className="relative text-center flex flex-col items-center select-none">
              <h1 className="font-retro-neon text-7xl sm:text-[11rem] text-[#ff007f] text-shadow-[0_0_20px_rgba(255,0,127,0.8)] tracking-wider">
                1.991
              </h1>
              
              {/* Frozen cursor that looks like the system crashed or is waiting */}
              <div className="mt-4 font-retro-mono text-zinc-600 text-sm tracking-widest flex items-center gap-1.5">
                <span>SYSTEM INIT</span>
                <span className="w-2.5 h-4 bg-zinc-600 inline-block animate-none" />
              </div>
            </div>
          </motion.div>
        )}

        {/* State B: The 0.7s Glitching / Booting Stage */}
        {bootState === "booting" && (
          <motion.div
            key="booting-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 p-4 font-retro-mono overflow-hidden crt-flicker"
          >
            <div className="absolute inset-0 crt-scanlines opacity-80" />
            
            {/* Glitching numbers */}
            <h1 className="font-retro-neon text-8xl sm:text-[12rem] text-neon-blue text-glow-blue tracking-widest text-center">
              {glitchText}
            </h1>

            {/* Boot System log feed */}
            <div className="mt-8 max-w-lg w-full bg-zinc-950/90 border border-zinc-800 p-4 rounded-lg box-glow-blue text-left">
              <div className="text-[10px] text-neon-green text-glow-green uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-ping" />
                SISTEMA_REBOOT_PISTAS_RACEBOY
              </div>
              <div className="flex flex-col gap-1.5">
                {bootLogs.slice(0, bootLogIndex + 1).map((log, i) => (
                  <div key={i} className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2">
                    <span className="text-neon-blue">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* State C: The Fully Active, Gorgeous 80s Website Hero */}
        {bootState === "active" && (
          <motion.div
            key="active-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-screen flex flex-col overflow-x-hidden"
          >
            {/* Ambient Animated Cyber Background Grid & Stars */}
            <div className={`absolute inset-0 -z-20 transition-all duration-300 ${
              theme === "light"
                ? "bg-[radial-gradient(ellipse_at_bottom,rgba(186,230,253,0.3)_0%,rgba(248,250,252,1)_80%)]"
                : "bg-[radial-gradient(ellipse_at_bottom,rgba(25,12,48,0.7)_0%,rgba(0,0,0,1)_80%)]"
            }`} />
            <div className={`absolute inset-0 -z-20 transition-all duration-300 ${
              theme === "light"
                ? "bg-[radial-gradient(circle_at_top,rgba(2,132,199,0.06)_0%,transparent_50%)]"
                : "bg-[radial-gradient(circle_at_top,rgba(0,240,255,0.06)_0%,transparent_50%)]"
            }`} />
            
            {/* The infinite scrolling synthwave floor at the bottom of the hero */}
            <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden -z-10 opacity-30 pointer-events-none">
              <div className="synthwave-grid absolute inset-0 h-[200%] w-full" />
              <div className={`absolute inset-0 bg-gradient-to-t ${theme === "light" ? "from-slate-50" : "from-black"} via-transparent to-transparent`} />
            </div>

            {/* CRT overlay subtle */}
            <div className="absolute inset-0 crt-scanlines opacity-10 pointer-events-none -z-10" />

            {/* Top Navigation Header bar */}
            <header className="border-b border-zinc-800/80 bg-black/80 backdrop-blur-md sticky top-0 z-30">
              <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-zinc-950/60 border border-zinc-800/80 px-4 py-2 rounded-xl box-glow-pink">
                    <div className="flex items-center gap-3">
                      <img 
                        src="https://i.postimg.cc/FsVm3y64/raceboy-logo-transp-870px.png" 
                        alt="RaceBoy Logo" 
                        className="h-8 object-contain cursor-pointer"
                        onClick={() => setActiveView("home")}
                        style={{ 
                          filter: theme === "light" 
                            ? "drop-shadow(0 0 1px rgba(219,39,119,0.3))" 
                            : "drop-shadow(0 0 1px rgba(255,0,127,0.6)) drop-shadow(0 0 10px rgba(255,0,127,0.4))",
                          transform: "translate3d(0, 0, 0) rotate(0.01deg)",
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                        }}
                        referrerPolicy="no-referrer"
                      />
                      <span className="hidden lg:inline-block text-[9px] font-retro-mono text-zinc-500 tracking-widest border border-zinc-900 px-2 py-0.5 rounded uppercase">
                        Padrão Profissional Brasil
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary page navigation switcher */}
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView("home")}
                    className={`px-3 py-1.5 rounded-lg font-retro-title text-[10px] tracking-wider transition-all cursor-pointer ${
                      activeView === "home"
                        ? "bg-neon-pink/15 border border-neon-pink/40 text-neon-pink text-glow-pink"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent"
                    }`}
                  >
                    PRINCIPAL
                  </button>
                  <button
                    onClick={() => setActiveView("destaques")}
                    className={`px-3 py-1.5 rounded-lg font-retro-title text-[10px] tracking-wider transition-all cursor-pointer flex items-center gap-1.5 relative ${
                      activeView === "destaques"
                        ? "bg-neon-blue/15 border border-neon-blue/40 text-neon-blue text-glow-blue"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent"
                    }`}
                  >
                    DESTAQUES
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-pink opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-pink"></span>
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveView("historia")}
                    className={`px-3 py-1.5 rounded-lg font-retro-title text-[10px] tracking-wider transition-all cursor-pointer flex items-center gap-1.5 relative ${
                      activeView === "historia"
                        ? "bg-amber-400/15 border border-amber-400/40 text-amber-400"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent"
                    }`}
                  >
                    35 ANOS DE HISTÓRIA
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
                    </span>
                  </button>
                </nav>

                {/* Micro indicators */}
                <div className="flex items-center gap-6 text-[10px] font-retro-mono text-zinc-400">
                  <div className="hidden md:flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                    <span>CNC ROUTER OPERACIONAL</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-neon-yellow" />
                    <span>BI-CAMPEÃO BRASIL</span>
                  </div>

                  {/* Daylight/Prototyping Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-retro-tech text-[9px] tracking-wider transition-all cursor-pointer border ${
                      theme === "light"
                        ? "bg-amber-400/15 border-amber-500/50 text-amber-700 hover:bg-amber-400/25 shadow-sm"
                        : "bg-zinc-900 border-zinc-800 text-amber-400 hover:text-white hover:border-glow-yellow hover:bg-zinc-800/40"
                    }`}
                    title={theme === "light" ? "Mudar para Modo Noite (Cyberpunk)" : "Mudar para Modo Dia (Prototipagem)"}
                  >
                    {theme === "light" ? (
                      <>
                        <Sun className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                        <span className="hidden md:inline">MODO DIA</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        <span className="hidden md:inline">MODO NOITE</span>
                      </>
                    )}
                  </button>

                  <a
                    href="https://www.facebook.com/AUTOMODELISMORACEBOY/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-neon-pink hover:text-white hover:border-glow-pink hover:bg-zinc-800/40 transition-all font-retro-tech text-[9px] tracking-wider"
                  >
                    <Facebook className="w-3 h-3" /> FACEBOOK
                  </a>
                  <a
                    href="https://wa.me/5511994388829"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => showToast("Conectando com o suporte RaceBoy no WhatsApp!")}
                    className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-neon-blue hover:text-white hover:border-glow-blue hover:bg-zinc-800/40 transition-all font-retro-tech text-[9px] tracking-wider"
                  >
                    <Phone className="w-3 h-3" /> CONTATO WHATSAPP
                  </a>
                </div>
              </div>
            </header>

            {/* Main Interactive Hero Container */}
            <main className="flex-grow flex flex-col justify-center max-w-7xl mx-auto px-4 py-8 md:py-12 w-full gap-12 z-10">
              {activeView === "home" ? (
                <>
                  {/* Introduction Title and Badges */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
                <div className="lg:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 bg-neon-pink/10 border border-neon-pink/30 px-3 py-1 rounded-full text-[10px] font-retro-mono text-neon-pink tracking-widest uppercase">
                      <Award className="w-3 h-3" /> TRADIÇÃO DESDE 1991
                    </span>
                    <span className="inline-flex items-center gap-1 bg-neon-blue/10 border border-neon-blue/30 px-3 py-1 rounded-full text-[10px] font-retro-mono text-neon-blue tracking-widest uppercase">
                      <Flame className="w-3 h-3" /> FRESAGEM CNC e LASER
                    </span>
                  </div>

                  <h1 className="font-retro-title text-4xl sm:text-6xl text-zinc-100 tracking-tight leading-tight max-w-4xl">
                    As Pistas de SlotCar Mais <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red via-red-500 to-amber-500 text-glow-red">Lendárias do Brasil</span>
                  </h1>

                  <p className="text-zinc-400 font-sans text-sm sm:text-base max-w-2xl leading-relaxed">
                    Fabricamos pistas profissionais de corrida em miniatura esculpidas sob medida em CNC. Acabamento perfeito com piso emborrachado de alta tração, telemetria digital integrada de milissegundos (opcional) e fiação isolada para máxima velocidade e performance.
                  </p>
                </div>
                <div className="lg:col-span-4 flex justify-center items-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative group"
                  >
                    {/* Glowing background behind the mascot */}
                    <div className="absolute inset-0 bg-gradient-to-r from-neon-red/20 to-amber-500/10 rounded-full blur-2xl group-hover:from-neon-red/30 group-hover:to-amber-500/20 transition-all duration-500 scale-95 pointer-events-none" />
                    
                    <motion.img 
                      src="https://i.postimg.cc/Wb5P8pXb/raceboy-mascote-transp-webp868px.webp" 
                      alt="RaceBoy Mascot" 
                      className="w-44 sm:w-56 lg:w-64 object-contain"
                      style={{ 
                        filter: "drop-shadow(0 0 15px rgba(255, 30, 39, 0.45))",
                        transform: "translate3d(0, 0, 0) rotate(0.01deg)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Two Column Grid: 1. Live Simulator (Right side content but placed left for visual flow) vs 2. Track Customizer */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Column 1: Slot Simulator Applet (7/12) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="flex justify-between items-center px-1">
                    <div>
                      <h2 className="font-retro-title text-lg tracking-wide text-zinc-200">
                        TESTE DE CONDUÇÃO RACEBOY
                      </h2>
                      <p className="text-[11px] font-retro-mono text-zinc-500 mt-0.5">
                        Acelere na fenda profissional e sinta o grip da pista texturizada.
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-neon-pink font-retro-mono bg-neon-pink/5 border border-neon-pink/20 px-2.5 py-1 rounded-lg">
                      <Timer className="w-3.5 h-3.5" />
                      <span>RECORDE: 2.845s</span>
                    </div>
                  </div>

                  {/* Simulator component */}
                  <SlotSimulator />
                </div>

                {/* Column 2: Track Planner Configurator (5/12) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="px-1">
                    <h2 className="font-retro-title text-lg tracking-wide text-zinc-200">
                      MONTE SEU CIRCUITO
                    </h2>
                    <p className="text-[11px] font-retro-mono text-zinc-500 mt-0.5">
                      Configure o tamanho, número de fendas e adicionais tecnológicos.
                    </p>
                  </div>

                  {/* Planner component */}
                  <TrackPlanner />
                </div>

              </div>

              {/* Showcase Technical Specs Section (Craftsmanship highlights) */}
              <section className="mt-8 border-t border-zinc-800/60 pt-12">
                <div className="text-center mb-8">
                  <h3 className="font-retro-title text-xl text-zinc-200 tracking-wide uppercase">
                    ENGENHARIA E CONSTRUÇÃO INTEGRADA
                  </h3>
                  <p className="text-xs font-retro-mono text-zinc-500 mt-1">
                    Por que as pistas Raceboy alegram a família
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-xl hover:border-glow-pink transition-all">
                    <span className="font-retro-neon text-lg text-neon-pink block mb-1">01</span>
                    <h4 className="font-retro-title text-sm text-zinc-200">Usinagem CNC de Alta Precisão</h4>
                    <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                      Todas as fendas e curvas são esculpidas por fresas de altíssima precisão em computadores industriais, garantindo fluxo perfeito e zero travamento de guias.
                    </p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-xl hover:border-glow-blue transition-all">
                    <span className="font-retro-neon text-lg text-neon-blue block mb-1">02</span>
                    <h4 className="font-retro-title text-sm text-zinc-200">Pintura Especial Texturizada</h4>
                    <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                      Aplicação de tinta especial emborrachada, criando o grip ideal para pneus de borracha macia e silicone sem necessidade de colagem excessiva.
                    </p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-xl hover:border-glow-green transition-all">
                    <span className="font-retro-neon text-lg text-neon-green block mb-1">03</span>
                    <h4 className="font-retro-title text-sm text-zinc-200">Cordoalha Estanhada de Cobre</h4>
                    <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                      Contatos de alta amperagem, com soldas reforçadas e isolamento galvânico por trilho, entregando energia homogênea em cada metro da pista.
                    </p>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800/80 p-5 rounded-xl hover:border-glow-yellow transition-all">
                    <span className="font-retro-neon text-lg text-neon-yellow block mb-1">04</span>
                    <h4 className="font-retro-title text-sm text-zinc-200">Fontes Reguladas Ajustáveis</h4>
                    <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                      Cada fenda recebe uma linha de energia exclusiva com proteção contra curto-circuito e variação de voltagem (comutação livre de 12V a 20V).
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <section id="faq-root" className="mt-16 border-t border-zinc-800/60 pt-12 max-w-4xl mx-auto w-full">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-neon-pink/10 border border-neon-pink/30 rounded-full text-[10px] font-retro-mono text-neon-pink uppercase tracking-widest mb-3">
                    <HelpCircle className="w-3.5 h-3.5" /> SUPORTE E DÚVIDAS
                  </div>
                  <h3 className="font-retro-title text-xl sm:text-2xl text-zinc-100 tracking-wide uppercase">
                    PERGUNTAS FREQUENTES (FAQ)
                  </h3>
                  <p className="text-xs font-retro-mono text-zinc-500 mt-2 uppercase tracking-widest">
                    Esclareça suas dúvidas sobre personalização, suporte e engenharia das pistas
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {FAQ_ITEMS.map((item, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={index}
                        className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-zinc-700"
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          className="w-full text-left p-5 flex items-center justify-between gap-4 font-retro-title text-xs sm:text-sm text-zinc-200 hover:text-white transition-colors"
                        >
                          <span className="flex items-center gap-3">
                            <span className="font-retro-neon text-xs text-neon-pink">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            {item.question}
                          </span>
                          <motion.div
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-4 h-4 text-zinc-500" />
                          </motion.div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                              <div className="p-5 pt-0 border-t border-zinc-900 font-sans text-xs text-zinc-400 leading-relaxed">
                                <p className="bg-zinc-900/30 p-4 rounded-lg border border-zinc-800/40">
                                  {item.answer}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Responsive Photo Gallery "GALERIA DE PROJETOS" */}
              <section id="gallery-root" className="mt-16 border-t border-zinc-800/60 pt-12">
                <div className="text-center mb-10">
                  <h3 className="font-retro-title text-xl sm:text-2xl text-zinc-100 tracking-wide uppercase">
                    GALERIA DE PROJETOS
                  </h3>
                  <p className="text-xs font-retro-mono text-zinc-500 mt-2 uppercase tracking-widest">
                    Projetos reais de pistas montadas e entregues para apaixonados por velocidade
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {GALLERY_ITEMS.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedImage(item)}
                      className={`cursor-pointer bg-zinc-950 border rounded-xl overflow-hidden group transition-all duration-300 ${item.glowClass}`}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {/* Shimmer overlay or hover color */}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-300 z-10" />
                        
                        {/* Quick AR Tag on Image */}
                        <div className="absolute top-2.5 left-2.5 z-20">
                          <span className="inline-flex items-center gap-1 bg-black/80 backdrop-blur-md border border-amber-400/50 px-2 py-0.5 rounded text-[9px] font-retro-mono text-amber-400 uppercase tracking-widest shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                            <Box className="w-3 h-3 text-amber-400 animate-pulse" /> 3D AR
                          </span>
                        </div>

                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-4 border-t border-zinc-900 bg-zinc-950 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1.5">
                            <h4 className="font-retro-title text-sm text-zinc-100 group-hover:text-white transition-colors">
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-retro-mono text-zinc-500 uppercase">
                              #{String(item.id).padStart(3, "0")}
                            </span>
                          </div>
                          <p className="text-[11px] font-retro-mono text-zinc-400">
                            {item.client}
                          </p>
                          <p className="text-[10px] font-retro-mono text-zinc-500 uppercase mt-0.5 tracking-wider">
                            {item.specs}
                          </p>
                        </div>

                        {/* Visualizar em AR Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setArItem(item);
                          }}
                          className="mt-3.5 w-full py-2 px-3 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 hover:border-amber-400 text-amber-400 font-retro-title text-[10px] uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(251,191,36,0.15)] cursor-pointer active:scale-98"
                        >
                          <Box className="w-3.5 h-3.5" />
                          VISUALIZAR EM AR
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Customer Testimonials Carousel Section */}
              <TestimonialsCarousel />
                </>
              ) : activeView === "destaques" ? (
                <DestaquesView />
              ) : (
                <HistoriaView />
              )}
            </main>

            {/* Digital Quality & Trust Badges Section */}
            <QualityBadges />

            {/* Simple footer with signature of traditional manufacturing */}
            <footer className="mt-12 border-t border-zinc-900 bg-zinc-950 py-8 text-xs text-zinc-600 font-retro-mono">
              <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://i.postimg.cc/FsVm3y64/raceboy-logo-transp-870px.png" 
                    alt="RaceBoy Logo" 
                    className="h-7 object-contain opacity-80"
                    style={{ 
                      filter: "drop-shadow(0 0 1px rgba(255,0,127,0.3)) drop-shadow(0 0 5px rgba(255,0,127,0.2))",
                      transform: "translate3d(0, 0, 0) rotate(0.01deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                    referrerPolicy="no-referrer"
                  />
                  <p className="text-left text-[11px] leading-snug">
                    © {new Date().getFullYear()} RACEBOY.<br />
                    <span className="text-zinc-500 font-sans text-[10px]">A mais tradicional fabricante de pistas de slot car do Brasil.</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                  <button onClick={() => navigateToSection("slot-sim-container")} className="hover:text-neon-pink transition-all cursor-pointer">SIMULADOR</button>
                  <span>•</span>
                  <button onClick={() => navigateToSection("track-planner-root")} className="hover:text-neon-blue transition-all cursor-pointer">PROJETAR PISTA</button>
                  <span>•</span>
                  <button onClick={() => navigateToSection("gallery-root")} className="hover:text-neon-yellow transition-all cursor-pointer">GALERIA</button>
                  <span>•</span>
                  <button onClick={() => navigateToSection("testimonials-root")} className="hover:text-amber-400 transition-all cursor-pointer uppercase">DEPOIMENTOS</button>
                  <span>•</span>
                  <button onClick={() => navigateToSection("quality-badges-root")} className="hover:text-neon-green transition-all cursor-pointer uppercase">SELOS DE QUALIDADE</button>
                  <span>•</span>
                  <button onClick={() => navigateToSection("faq-root")} className="hover:text-neon-pink transition-all cursor-pointer">FAQ</button>
                  <span>•</span>
                  <button onClick={() => setActiveView("destaques")} className="hover:text-neon-blue font-bold transition-all cursor-pointer">NOVIDADES & DESTAQUES</button>
                  <span>•</span>
                  <button onClick={() => setActiveView("historia")} className="hover:text-amber-400 font-bold transition-all cursor-pointer uppercase">35 Anos de História</button>
                  <span>•</span>
                  <a href="https://www.facebook.com/AUTOMODELISMORACEBOY/" target="_blank" rel="noreferrer" className="hover:text-neon-pink transition-all">FACEBOOK</a>
                  <span>•</span>
                  <a href="https://wa.me/5511994388829" target="_blank" rel="noreferrer" onClick={() => showToast("Conectando com o mestre projetista no WhatsApp!")} className="hover:text-neon-green transition-all">FALE COM O PROJETISTA</a>
                </div>
              </div>
            </footer>

            {/* Gallery Lightbox Modal */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedImage(null)}
                  className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`max-w-4xl w-full bg-zinc-950 border-2 rounded-2xl overflow-hidden crt-scanlines relative flex flex-col cursor-default ${selectedImage.glowClass}`}
                  >
                    {/* Glowing Accent light in modal */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink via-neon-blue to-neon-green" />

                    {/* Image container */}
                    <div className="relative aspect-video w-full bg-black">
                      <img
                        src={selectedImage.image}
                        alt={selectedImage.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Close button */}
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 bg-black/80 hover:bg-neon-pink border border-zinc-800 hover:border-white text-white px-3 py-1.5 rounded-xl transition-all font-retro-mono text-xs z-30 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer"
                      >
                        ✕ FECHAR
                      </button>
                    </div>

                    {/* Metadata panel */}
                    <div className="p-6 bg-zinc-950 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-retro-mono text-neon-pink bg-neon-pink/5 border border-neon-pink/20 px-2.5 py-0.5 rounded-md">
                            PROJETO HOMOLOGADO
                          </span>
                          <span className="text-xs font-retro-mono text-zinc-500">
                            REGISTRO: RB-{String(selectedImage.id * 147).padStart(4, "0")}
                          </span>
                        </div>
                        <h4 className="font-retro-title text-2xl text-zinc-100 mt-2 tracking-wide uppercase">
                          {selectedImage.title}
                        </h4>
                        <p className="text-xs font-retro-mono text-zinc-400 mt-1 uppercase">
                          Proprietário: <span className="text-zinc-200">{selectedImage.client}</span>
                        </p>
                      </div>
                      <div className="md:text-right border-t md:border-t-0 border-zinc-800/60 pt-4 md:pt-0 w-full md:w-auto flex flex-col md:items-end gap-3">
                        <div>
                          <span className="text-[11px] font-retro-mono text-zinc-500 block">CONFIGURAÇÃO DO CIRCUITO:</span>
                          <span className="font-retro-mono text-sm text-neon-blue uppercase tracking-wider block mt-1">
                            {selectedImage.specs}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            const currentItem = selectedImage;
                            setSelectedImage(null);
                            setArItem(currentItem);
                          }}
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-retro-title text-xs uppercase tracking-wider rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all cursor-pointer"
                        >
                          <Box className="w-4 h-4 fill-black" />
                          PROJETO EM RA (3D)
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AR Viewer Modal */}
            <AnimatePresence>
              {arItem && (
                <ArViewerModal
                  item={arItem}
                  onClose={() => setArItem(null)}
                />
              )}
            </AnimatePresence>

            {/* Global Retro Toast System */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
              <AnimatePresence>
                {toasts.map((toast) => (
                  <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: 30, transition: { duration: 0.2 } }}
                    className="pointer-events-auto bg-zinc-950/95 backdrop-blur-md border border-neon-green/40 rounded-xl p-4 shadow-[0_0_20px_rgba(57,255,20,0.15)] flex gap-3 relative overflow-hidden group select-none"
                  >
                    {/* Retro glowing corner light */}
                    <div className="absolute top-0 right-0 w-8 h-8 bg-neon-green/10 rounded-full blur-xl pointer-events-none" />

                    {/* Check/Zap icon */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-neon-green">
                      <Zap className="w-4 h-4 animate-pulse" />
                    </div>

                    <div className="flex-grow flex flex-col">
                      <span className="font-retro-title text-[9px] text-neon-green tracking-widest uppercase">
                        SISTEMA_OK // NOTIFICAÇÃO
                      </span>
                      <p className="text-zinc-300 font-sans text-xs mt-1 leading-snug">
                        {toast.message}
                      </p>
                    </div>

                    <button
                      onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                      className="text-zinc-600 hover:text-zinc-400 transition-colors p-1 cursor-pointer flex-shrink-0 h-fit"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
