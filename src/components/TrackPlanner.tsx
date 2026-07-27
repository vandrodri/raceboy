import React, { useState } from "react";
import { motion } from "motion/react";
import { Hammer, Ruler, Gauge, Settings, ShieldCheck, HelpCircle } from "lucide-react";
import { showToast } from "../utils/toast";

export default function TrackPlanner() {
  const [lanes, setLanes] = useState(4); // 2, 4, 6, 8
  const [shape, setShape] = useState("sebring"); // oval, figure8, sebring, interlagos
  const [finish, setFinish] = useState("naval-pu"); // standard, naval-pu, premium
  const [addons, setAddons] = useState({
    telemetry: true,
    leds: false,
    power: true,
  });

  // Dynamic calculations based on configurations
  const calculateSpecs = () => {
    let sizeText = "";
    let baseLength = 0;
    let powerReq = 0;
    let buildDays = 15;
    
    // Shape multipliers
    switch (shape) {
      case "oval":
        sizeText = "3.20m x 1.60m";
        baseLength = 12.4;
        powerReq = lanes * 3;
        buildDays = 10;
        break;
      case "figure8":
        sizeText = "4.00m x 2.00m";
        baseLength = 16.8;
        powerReq = lanes * 3.5;
        buildDays = 14;
        break;
      case "sebring":
        sizeText = "5.10m x 2.40m";
        baseLength = 24.5;
        powerReq = lanes * 4;
        buildDays = 22;
        break;
      case "interlagos":
        sizeText = "6.50m x 3.00m";
        baseLength = 32.2;
        powerReq = lanes * 4.5;
        buildDays = 30;
        break;
    }

    // Lane adjust
    const actualLength = baseLength + (lanes - 2) * 0.8;
    
    // Finish adjust
    if (finish === "premium") buildDays += 5;

    return {
      spaceRequired: sizeText,
      laneLength: actualLength.toFixed(1),
      powerRequired: powerReq.toFixed(0),
      productionTime: buildDays,
    };
  };

  const specs = calculateSpecs();

  return (
    <div id="track-planner-root" className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 box-glow-blue relative overflow-hidden flex flex-col gap-6">
      <div className="absolute top-0 left-0 w-32 h-32 bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
        <Settings className="w-5 h-5 text-neon-blue animate-spin-[spin_3s_linear_infinite]" />
        <h3 className="font-retro-tech text-sm tracking-widest text-zinc-300">
          PROJETAR PISTA PERSONALIZADA
        </h3>
      </div>

      {/* Options Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Options Form */}
        <div className="flex flex-col gap-5">
          {/* 1. Lanes Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-retro-tech text-zinc-400 tracking-wider">
              NÚMERO DE FENDAS (PISTAS / LANES)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 4, 6, 8].map((n) => (
                <button
                  key={n}
                  onClick={() => setLanes(n)}
                  className={`py-2 px-1 rounded-xl font-retro-mono text-sm border cursor-pointer transition-all ${
                    lanes === n
                      ? "bg-neon-blue text-black border-neon-blue font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                      : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {n} F
                </button>
              ))}
            </div>
          </div>

          {/* 2. Shape Layout */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-retro-tech text-zinc-400 tracking-wider">
              ESTILO DE TRAÇADO E COMPLEXIDADE
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "oval", label: "Oval Veloz" },
                { id: "figure8", label: "Oito com Viaduto" },
                { id: "sebring", label: "Sebring Hairpin" },
                { id: "interlagos", label: "Interlagos Replic" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShape(s.id)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-retro-title tracking-wide border cursor-pointer transition-all ${
                    shape === s.id
                      ? "bg-neon-pink text-white border-neon-pink shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                      : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Materials and Finishes */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-retro-tech text-zinc-400 tracking-wider">
              MATERIAL E TIPO DE ACABAMENTO
            </label>
            <div className="flex flex-col gap-2">
              {[
                {
                  id: "standard",
                  label: "MDF Standard + Cobre de Rolo",
                  desc: "Ideal para residências e hobby inicial.",
                },
                {
                  id: "naval-pu",
                  label: "MDF Naval + PU Grip Control",
                  desc: "Material impermeável de alta tração com cordoalha estanhada.",
                },
                {
                  id: "premium",
                  label: "Madeira Nobre CNC + Cordoalha Magnética Premium",
                  desc: "Padrão de campeonatos nacionais e clubes profissionais.",
                },
                {
                  id: "mlc-structural",
                  label: "Estrutura em Madeira Laminada Colada (MLC)",
                  desc: "Alta resistência mecânica, imune a empenamento e acabamento arquitetônico em curvas.",
                },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFinish(f.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                    finish === f.id
                      ? "bg-zinc-800/80 border-neon-blue text-zinc-100 shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]"
                      : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  <span className={`text-xs font-retro-title ${finish === f.id ? "text-neon-blue" : ""}`}>
                    {f.label}
                  </span>
                  <span className="text-[10px] font-retro-mono opacity-80 leading-relaxed">
                    {f.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Telemetry and Extras */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-retro-tech text-zinc-400 tracking-wider">
              ADICIONAIS TECNOLÓGICOS (TELEMETRIA v4.0)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "telemetry", label: "Telemetria" },
                { id: "leds", label: "Faróis LED" },
                { id: "power", label: "Fontes Indiv." },
              ].map((a) => (
                <button
                  key={a.id}
                  onClick={() =>
                    setAddons((prev: any) => ({
                      ...prev,
                      [a.id]: !prev[a.id],
                    }))
                  }
                  className={`py-2 px-1 rounded-xl text-[10px] font-retro-tech tracking-wider border cursor-pointer transition-all ${
                    (addons as any)[a.id]
                      ? "bg-zinc-800 border-neon-green text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.2)]"
                      : "bg-zinc-950 text-zinc-500 border-zinc-800"
                  }`}
                >
                  {(addons as any)[a.id] ? "● " : "○ "} {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Dashboard */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between relative">
          <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />

          <div className="flex flex-col gap-5">
            <div className="border-b border-zinc-800/80 pb-3">
              <span className="text-[10px] font-retro-mono text-zinc-500 block tracking-widest uppercase">
                ESPECIFICAÇÕES DA PISTA PROJETADA
              </span>
              <h4 className="font-retro-title text-base text-zinc-200 mt-1">
                Fórmula 1991 Custom Track
              </h4>
            </div>

            {/* Spec Items */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-neon-blue">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-retro-mono text-zinc-500 block">ÁREA MÍNIMA NECESSÁRIA</span>
                  <span className="font-retro-tech text-sm text-zinc-200 tracking-wide">{specs.spaceRequired}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-neon-pink">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-retro-mono text-zinc-500 block">COMPRIMENTO DA FENDA</span>
                  <span className="font-retro-tech text-sm text-zinc-200 tracking-wide">{specs.laneLength} metros de traçado</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-neon-yellow">
                  <Hammer className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-retro-mono text-zinc-500 block">PRODUÇÃO E INSTALAÇÃO</span>
                  <span className="font-retro-tech text-sm text-zinc-200 tracking-wide">{specs.productionTime} dias úteis</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-neon-green">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-retro-mono text-zinc-500 block">POTÊNCIA DE ALIMENTAÇÃO</span>
                  <span className="font-retro-tech text-sm text-zinc-200 tracking-wide">Mínimo {specs.powerRequired}A em 15V</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quote CTA */}
          <div className="mt-6 pt-4 border-t border-zinc-800/80">
            <a
              href={`https://wa.me/5511994388829?text=${encodeURIComponent(`Olá RaceBoy! Fiz um projeto de pista customizada no configurador com as especificações:\n- Fendas: ${lanes}\n- Traçado: ${shape.toUpperCase()}\n- Acabamento: ${finish.toUpperCase()}\n- Telemetria v4.0: ${addons.telemetry ? "Sim" : "Não"}\n- Faróis LED: ${addons.leds ? "Sim" : "Não"}\n- Fontes Individuais: ${addons.power ? "Sim" : "Não"}\n\nÁrea necessária estimada: ${specs.spaceRequired}. Gostaria de solicitar um orçamento!`)}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => showToast(`Solicitação enviada! Configuração: ${lanes} Fendas | ${shape.toUpperCase()}`)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-neon-blue to-neon-pink hover:from-neon-blue/90 hover:to-neon-pink/90 text-white font-retro-title tracking-widest text-xs py-3.5 rounded-xl cursor-pointer transition-all text-center uppercase shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] active:scale-98"
            >
              SOLICITAR ORÇAMENTO DA PISTA
            </a>
            <div className="flex justify-center items-center gap-1 text-[9px] font-retro-mono text-zinc-500 mt-2 text-center">
              <span>PRODUZIDO MANUALMENTE NO BRASIL POR ENGENHEIROS DE SLOT CAR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
