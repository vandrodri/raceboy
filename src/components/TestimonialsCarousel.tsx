import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  CheckCircle2, 
  MessageSquare, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Pause, 
  Play,
  HeartHandshake
} from "lucide-react";
import { showToast } from "../utils/toast";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  projectType: string;
  stars: number;
  quote: string;
  badge: string;
  year: string;
  avatar: string;
  glowColor: string;
  badgeBg: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Dr. Roberto Silveira",
    location: "São Paulo, SP",
    projectType: "Pista Residencial 4 Fendas (16 metros)",
    stars: 5,
    quote: "A RaceBoy realizou um sonho de infância! Pedi uma pista de 4 fendas sob medida para a minha sala de jogos. A precisão do corte CNC no MDF e o grip da pintura texturizada são impressionantes! Os carros não desaceleram e o sistema de telemetria digital funciona com precisão absoluta.",
    badge: "Cliente Verificado • Residencial",
    year: "Cliente desde 2023",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    glowColor: "border-neon-pink/40 shadow-[0_0_20px_rgba(255,0,127,0.15)]",
    badgeBg: "bg-neon-pink/10 border-neon-pink/30 text-neon-pink"
  },
  {
    id: 2,
    name: "Marcos Vinícius",
    location: "Campinas, SP",
    projectType: "Pista Comercial 8 Fendas (24 metros)",
    stars: 5,
    quote: "Montamos a pista no nosso espaço de entretenimento e hobbymodelismo. A estrutura RaceBoy suporta campeonatos inteiros com dezenas de pilotos correndo sem esquentar a cordoalha nem falhar contato. O suporte e a atenção do projetista Vanderlei são nota mil!",
    badge: "Cliente Verificado • Comercial",
    year: "Cliente desde 2021",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    glowColor: "border-neon-blue/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]",
    badgeBg: "bg-neon-blue/10 border-neon-blue/30 text-neon-blue"
  },
  {
    id: 3,
    name: "Eduardo & Família",
    location: "Curitiba, PR",
    projectType: "Pista 4 Fendas Modular para Chácara",
    stars: 5,
    quote: "Comprei a pista para reunir os filhos e netos nos finais de semana. A facilidade de montagem dos módulos e a estabilidade das fontes reguladas independentes por fenda garantem corridas muito equilibradas. Diversão saudável de verdade para toda a família!",
    badge: "Cliente Verificado • Família",
    year: "Cliente desde 2024",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    glowColor: "border-neon-green/40 shadow-[0_0_20px_rgba(57,255,20,0.15)]",
    badgeBg: "bg-neon-green/10 border-neon-green/30 text-neon-green"
  },
  {
    id: 4,
    name: "Marcelo Rossi",
    location: "Belo Horizonte, MG",
    projectType: "Pista Particular 6 Fendas Vintage (20 metros)",
    stars: 5,
    quote: "Sou colecionador de slotcars clássicos há 30 anos. A suavidade das fendas esculpidas pela RaceBoy preserva meus carrinhos mais raros sem arranhar nem trancar a guia. É visível o cuidado artesanal combinado com usinagem moderna.",
    badge: "Colecionador • 30 anos de Hobby",
    year: "Cliente desde 2022",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    glowColor: "border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.15)]",
    badgeBg: "bg-amber-400/10 border-amber-400/30 text-amber-400"
  },
  {
    id: 5,
    name: "Clube de Automodelismo do Sul",
    location: "Porto Alegre, RS",
    projectType: "Circuito Oficial 8 Fendas de Competição",
    stars: 5,
    quote: "Já sediamos duas etapas do Campeonato de Autorama nesta pista. A fiação elétrica reforçada por fenda e o balanço ideal nas curvas com inclinação perfeita fizeram toda a diferença nos recordes de volta. Disparada a melhor fabricante do Brasil!",
    badge: "Clube Oficial • Torneios",
    year: "Cliente desde 2020",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    glowColor: "border-neon-pink/40 shadow-[0_0_20px_rgba(255,0,127,0.15)]",
    badgeBg: "bg-neon-pink/10 border-neon-pink/30 text-neon-pink"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleNext = () => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleSelect = (index: number) => {
    setDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(index);
  };

  // Autoplay logic
  useEffect(() => {
    if (isAutoplay) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext();
      }, 6000);
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isAutoplay, currentIndex]);

  const activeTestimonial = TESTIMONIALS[currentIndex];

  const handleContactWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá RaceBoy! Estava lendo os depoimentos de clientes no site e gostaria de solicitar um orçamento para uma pista personalizada para mim!`
    );
    showToast("Redirecionando para o WhatsApp do projetista RaceBoy...");
    window.open(`https://wa.me/5511994388829?text=${text}`, "_blank");
  };

  return (
    <section id="testimonials-root" className="mt-16 border-t border-zinc-800/60 pt-12 relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-[10px] font-retro-mono text-amber-400 uppercase tracking-widest mb-3">
          <HeartHandshake className="w-3.5 h-3.5" /> DEPOIMENTOS REALMENTE SATISFEITOS
        </div>
        <h3 className="font-retro-title text-xl sm:text-2xl text-zinc-100 tracking-wide uppercase">
          O QUE DIZEM NOSSOS PILOTOS E CLIENTES
        </h3>
        <p className="text-xs font-retro-mono text-zinc-500 mt-2 uppercase tracking-widest max-w-xl mx-auto">
          Histórias reais de quem transformou o espaço de casa, clube ou comércio com a engenharia de pistas RaceBoy
        </p>
      </div>

      {/* Trust Stats Counter Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8 px-2">
        <div className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-xl text-center">
          <span className="font-retro-title text-base text-amber-400 block">35 ANOS</span>
          <span className="text-[10px] font-retro-mono text-zinc-500 uppercase">Tradição & Fabricação</span>
        </div>
        <div className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-xl text-center">
          <span className="font-retro-title text-base text-neon-green block">100% CNC</span>
          <span className="text-[10px] font-retro-mono text-zinc-500 uppercase">Precisão Absoluta</span>
        </div>
        <div className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-xl text-center">
          <span className="font-retro-title text-base text-neon-blue block">+300 PISTAS</span>
          <span className="text-[10px] font-retro-mono text-zinc-500 uppercase">Entregues no Brasil</span>
        </div>
        <div className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-xl text-center">
          <span className="font-retro-title text-base text-neon-pink block">5.0 ★★★★★</span>
          <span className="text-[10px] font-retro-mono text-zinc-500 uppercase">Avaliação Média</span>
        </div>
      </div>

      {/* Carousel Container */}
      <div 
        className="max-w-4xl mx-auto relative px-2"
        onMouseEnter={() => setIsAutoplay(false)}
        onMouseLeave={() => setIsAutoplay(true)}
      >
        <div className="relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/90 p-6 sm:p-10 shadow-2xl">
          {/* Subtle top bar accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-neon-pink via-neon-blue to-amber-400 opacity-70" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, x: direction === "next" ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === "next" ? -40 : 40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start"
            >
              {/* Avatar & Info Badge Column */}
              <div className="flex flex-col items-center text-center flex-shrink-0 w-full md:w-52">
                <div className="relative mb-3 group">
                  <div className={`w-20 h-20 rounded-2xl overflow-hidden border-2 p-0.5 transition-all duration-300 ${activeTestimonial.glowColor}`}>
                    <img
                      src={activeTestimonial.avatar}
                      alt={activeTestimonial.name}
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-black p-1 rounded-full shadow-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-black text-amber-400" />
                  </div>
                </div>

                <h4 className="font-retro-title text-sm text-zinc-100 font-bold">
                  {activeTestimonial.name}
                </h4>
                <p className="text-[11px] font-retro-mono text-zinc-400 mt-0.5">
                  {activeTestimonial.location}
                </p>

                {/* Stars */}
                <div className="flex items-center gap-1 my-2">
                  {[...Array(activeTestimonial.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Badge Tag */}
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-retro-mono uppercase tracking-wider border ${activeTestimonial.badgeBg} mt-1`}>
                  {activeTestimonial.badge}
                </span>

                <span className="text-[9px] font-retro-mono text-zinc-600 mt-2">
                  {activeTestimonial.year}
                </span>
              </div>

              {/* Quote Content Column */}
              <div className="flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <Quote className="w-8 h-8 text-amber-400/30 -ml-1" />
                    <span className="text-[10px] font-retro-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md uppercase">
                      {activeTestimonial.projectType}
                    </span>
                  </div>

                  <p className="text-zinc-300 font-sans text-sm sm:text-base leading-relaxed italic pr-2">
                    "{activeTestimonial.quote}"
                  </p>
                </div>

                {/* Footer seal */}
                <div className="mt-6 pt-4 border-t border-zinc-900 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-retro-mono text-zinc-500">
                    <ShieldCheck className="w-4 h-4 text-neon-green" />
                    <span>Garantia de Satisfação e Engenharia RaceBoy</span>
                  </div>

                  <span className="text-[10px] font-retro-mono text-zinc-600">
                    Depoimento {currentIndex + 1} de {TESTIMONIALS.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-zinc-900/80 flex items-center justify-between gap-4">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {TESTIMONIALS.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? "w-7 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                      : "w-2 bg-zinc-800 hover:bg-zinc-700"
                  }`}
                  aria-label={`Ir para depoimento ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next & Autoplay Toggle Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoplay(!isAutoplay)}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                title={isAutoplay ? "Pausar troca automática" : "Ativar troca automática"}
              >
                {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
              </button>

              <button
                onClick={handlePrev}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-400 transition-all cursor-pointer"
                aria-label="Depoimento Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-amber-400 transition-all cursor-pointer"
                aria-label="Próximo Depoimento"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Call to action below testimonials */}
        <div className="mt-6 text-center">
          <button
            onClick={handleContactWhatsApp}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-retro-title text-xs tracking-wider uppercase font-bold shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] transition-all cursor-pointer active:scale-98"
          >
            <MessageSquare className="w-4 h-4 fill-black" />
            QUERO UMA PISTA EXCLUSIVA NO MEU ESPAÇO
          </button>
        </div>
      </div>
    </section>
  );
}
