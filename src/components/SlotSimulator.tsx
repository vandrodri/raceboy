import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Play, RotateCcw, AlertTriangle, Radio, Volume2, VolumeX } from "lucide-react";

interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export default function SlotCarSimulator() {
  const [throttle, setThrottle] = useState(0); // 0 to 100
  const [carSpeed, setCarSpeed] = useState(0); // Simulated velocity
  const [isPressing, setIsPressing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [laps, setLaps] = useState(0);
  const [currentLapTime, setCurrentLapTime] = useState(0);
  const [bestLapTime, setBestLapTime] = useState(0);
  const [trackTemp, setTrackTemp] = useState(32.4);
  const [voltage, setVoltage] = useState(14.8); // Recommended slot car voltage
  const [isDesgarrado, setIsDesgarrado] = useState(false); // Car flew off track
  const [sparks, setSparks] = useState<Spark[]>([]);

  const pathRef = useRef<SVGPathElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const carProgressRef = useRef(0); // 0 to total length of path
  const lastTimeRef = useRef<number | null>(null);
  const lapStartTimeRef = useRef<number>(Date.now());
  const sparkIdRef = useRef(0);

  // Audio nodes for slot car engine synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);

  // Define the track path (Figure 8 layout, scaled nicely)
  // Viewport: 0 0 500 250
  const trackPathD = "M 80,125 C 80,40 210,40 250,125 C 290,210 420,210 420,125 C 420,40 290,40 250,125 C 210,210 80,210 80,125 Z";

  // Car coordinates & rotation for rendering
  const [carPos, setCarPos] = useState({ x: 80, y: 125 });
  const [carRotation, setCarRotation] = useState(0);

  // Initialize Web Audio Synth for Motor Sound
  const initAudio = () => {
    try {
      if (audioCtxRef.current) return;
      
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // 1. Motor Hum (Sawtooth for high speed electric motor)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(60, ctx.currentTime); // Base idle freq
      
      gain.gain.setValueAtTime(0, ctx.currentTime); // Silent initially
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      
      oscNodeRef.current = osc;
      gainNodeRef.current = gain;

      // 2. White noise for contact brushes friction
      if (ctx.createScriptProcessor) {
        // Deprecated but widely compatible fallback for quick dynamic noise
        const bufferSize = 4096;
        const scriptNode = ctx.createScriptProcessor(bufferSize, 1, 1);
        scriptNode.onaudioprocess = (e) => {
          const output = e.outputBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
        };
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0, ctx.currentTime);
        
        scriptNode.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        
        noiseNodeRef.current = scriptNode;
        noiseGainRef.current = noiseGain;
      }
    } catch (e) {
      console.warn("Failed to initialize audio", e);
    }
  };

  // Update audio frequency and volume based on throttle
  useEffect(() => {
    if (!soundEnabled || !audioCtxRef.current) {
      if (gainNodeRef.current) gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current?.currentTime || 0);
      if (noiseGainRef.current) noiseGainRef.current.gain.setValueAtTime(0, audioCtxRef.current?.currentTime || 0);
      return;
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const targetFreq = 50 + (throttle / 100) * 380; // Frequency range 50Hz to 430Hz
    const targetVol = (throttle / 100) * 0.15 + (throttle > 0 ? 0.03 : 0); // Engine volume
    const noiseVol = (throttle / 100) * 0.05; // Brush friction noise

    if (oscNodeRef.current) {
      oscNodeRef.current.frequency.setTargetAtTime(targetFreq, now, 0.08);
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(targetVol, now, 0.05);
    }
    if (noiseGainRef.current) {
      noiseGainRef.current.gain.setTargetAtTime(noiseVol, now, 0.05);
    }
  }, [throttle, soundEnabled]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (oscNodeRef.current) {
        try {
          oscNodeRef.current.stop();
        } catch (e) {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  // Keyboard controls for throttle (Spacebar or Up Arrow)
  useEffect(() => {
    const isTypingInInput = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return false;
      const tagName = target.tagName;
      return (
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        tagName === "SELECT" ||
        target.isContentEditable
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingInInput(e)) return;

      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        setIsPressing(true);
        initAudio();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isTypingInInput(e)) return;

      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        setIsPressing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Increase throttle when pressing trigger
  useEffect(() => {
    let interval: number;
    if (isPressing && !isDesgarrado) {
      interval = window.setInterval(() => {
        setThrottle((prev) => Math.min(prev + 8, 100));
      }, 30);
    } else {
      interval = window.setInterval(() => {
        setThrottle((prev) => Math.max(prev - 12, 0));
      }, 20);
    }
    return () => clearInterval(interval);
  }, [isPressing, isDesgarrado]);

  // Physics and Animation loop
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const dt = (timestamp - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = timestamp;

      if (!pathRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const totalLength = pathRef.current.getTotalLength();

      // Calculate car speed based on throttle
      // Slot car has magnetic grip, but too much speed on curves throws it off
      const maxSpeed = 380; // maximum speed units/sec
      const targetSpeed = (throttle / 100) * maxSpeed;
      
      // Accelerate/Decelerate speed smoothly
      let currentSpeed = carSpeed;
      if (isDesgarrado) {
        currentSpeed = Math.max(currentSpeed - 200 * dt, 0);
      } else {
        currentSpeed += (targetSpeed - currentSpeed) * 4 * dt;
      }
      setCarSpeed(currentSpeed);

      // Track Temperature increases with high speed
      if (currentSpeed > 50) {
        setTrackTemp((prev) => Math.min(prev + dt * (currentSpeed / 100) * 0.15, 45.2));
      } else {
        setTrackTemp((prev) => Math.max(prev - dt * 0.2, 28.5));
      }

      // Check for crash condition (Desgarrar!)
      // Curves are located where the radius is tight. In our Figure-8:
      // The loops are around the left/right parts (high curvature).
      // We can evaluate curves by checking the rotation rate of the car!
      if (!isDesgarrado && currentSpeed > 180) {
        // Calculate curvature by taking differences in rotation
        // If speed is extremely high when rotation is changing rapidly, throw the car off!
        const futureProgress = (carProgressRef.current + 5) % totalLength;
        const currentRot = carRotation;
        
        const pt1 = pathRef.current.getPointAtLength(futureProgress);
        const pt2 = pathRef.current.getPointAtLength((futureProgress + 1) % totalLength);
        const nextRot = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) * (180 / Math.PI);
        const rotDelta = Math.abs(currentRot - nextRot);

        // High speed + sharp turning angle = crash!
        if (rotDelta > 15 && currentSpeed > 260) {
          setIsDesgarrado(true);
          setThrottle(0);
          // Play sparks explosion
          const crashSparks: Spark[] = [];
          for (let i = 0; i < 20; i++) {
            crashSparks.push({
              id: sparkIdRef.current++,
              x: carPos.x,
              y: carPos.y,
              vx: (Math.random() - 0.5) * 350,
              vy: (Math.random() - 0.5) * 350,
              life: 1.2,
              color: Math.random() > 0.5 ? "#00f0ff" : "#ff007f"
            });
          }
          setSparks((prev) => [...prev, ...crashSparks]);
        }
      }

      // Update Car Position along the SVG path
      if (!isDesgarrado && currentSpeed > 0) {
        const prevProgress = carProgressRef.current;
        const nextProgress = (prevProgress + currentSpeed * dt) % totalLength;
        carProgressRef.current = nextProgress;

        // Check for lap completion (Finish line is at x=80, y=125, which is around 0 progress)
        if (prevProgress > totalLength - 15 && nextProgress < 50) {
          setLaps((prev) => prev + 1);
          const now = Date.now();
          const lapDuration = (now - lapStartTimeRef.current) / 1000;
          lapStartTimeRef.current = now;
          setCurrentLapTime(lapDuration);
          
          if (bestLapTime === 0 || lapDuration < bestLapTime) {
            setBestLapTime(lapDuration);
          }

          // Visual cue beep or mini flash
          const finishBeep = new AudioContext();
          const osc = finishBeep.createOscillator();
          const gain = finishBeep.createGain();
          osc.frequency.setValueAtTime(800, finishBeep.currentTime);
          gain.gain.setValueAtTime(0.05, finishBeep.currentTime);
          osc.connect(gain);
          gain.connect(finishBeep.destination);
          osc.start();
          osc.stop(finishBeep.currentTime + 0.1);
        }

        const point = pathRef.current.getPointAtLength(nextProgress);
        setCarPos({ x: point.x, y: point.y });

        // Calculate rotation based on tangent
        const tangentPoint = pathRef.current.getPointAtLength((nextProgress + 2) % totalLength);
        const angle = Math.atan2(tangentPoint.y - point.y, tangentPoint.x - point.x) * (180 / Math.PI);
        setCarRotation(angle);

        // Generate track contact sparks proportionally to throttle/speed
        if (throttle > 20 && Math.random() < 0.4) {
          const newSpark: Spark = {
            id: sparkIdRef.current++,
            x: point.x - Math.cos(angle * Math.PI / 180) * 8,
            y: point.y - Math.sin(angle * Math.PI / 180) * 8,
            vx: -Math.cos(angle * Math.PI / 180) * 80 + (Math.random() - 0.5) * 40,
            vy: -Math.sin(angle * Math.PI / 180) * 80 + (Math.random() - 0.5) * 40,
            life: 0.4 + Math.random() * 0.3,
            color: "#ff007f"
          };
          setSparks((prev) => [...prev, newSpark]);
        }
      }

      // Physics for sparks
      setSparks((prev) =>
        prev
          .map((spark) => ({
            ...spark,
            x: spark.x + spark.vx * dt,
            y: spark.y + spark.vy * dt,
            life: spark.life - dt,
          }))
          .filter((spark) => spark.life > 0)
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [throttle, carSpeed, isDesgarrado, carRotation, bestLapTime]);

  const handleReset = () => {
    setIsDesgarrado(false);
    setThrottle(0);
    setCarSpeed(0);
    carProgressRef.current = 0;
    setCarPos({ x: 80, y: 125 });
    setCarRotation(0);
    lapStartTimeRef.current = Date.now();
  };

  const handleToggleSound = () => {
    if (!soundEnabled) {
      initAudio();
    }
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div id="slot-sim-container" className="flex flex-col gap-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 box-glow-pink relative overflow-hidden">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-neon-pink/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-blue/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Panel */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-neon-pink animate-pulse" />
          <h3 className="font-retro-tech text-sm tracking-widest text-zinc-300">
            TELEMETRIA EM TEMPO REAL
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-neon-blue hover:border-glow-blue transition-all"
            title={soundEnabled ? "Mutar Som do Motor" : "Ativar Som do Motor"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-neon-blue" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <span className="text-[10px] font-retro-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
            ESTABILIZADOR: {voltage}V
          </span>
        </div>
      </div>

      {/* Racetrack Canvas */}
      <div className="relative bg-zinc-950 rounded-xl border border-zinc-800 h-56 flex items-center justify-center overflow-hidden">
        {/* CRT Scanline and Flicker layers */}
        <div className="absolute inset-0 crt-scanlines opacity-40 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,16,24,0)_40%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />

        {/* Warning Badge */}
        <AnimatePresence>
          {isDesgarrado && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute z-20 flex flex-col items-center justify-center bg-black/90 border-2 border-neon-pink rounded-xl p-4 text-center max-w-xs cursor-default"
            >
              <AlertTriangle className="w-8 h-8 text-neon-pink animate-bounce mb-1" />
              <h4 className="font-retro-title text-neon-pink text-base tracking-wide">
                DESGARRADO!
              </h4>
              <p className="text-zinc-400 text-xs mt-1 font-retro-mono">
                Você acelerou demais na curva e o carro decolou da fenda.
              </p>
              <button
                onClick={handleReset}
                className="mt-3 flex items-center gap-2 bg-neon-pink hover:bg-neon-pink/80 text-white font-retro-tech text-xs tracking-widest px-4 py-2 rounded-lg cursor-pointer transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" /> RECOLCAR CARRO
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Instruction */}
        {!isPressing && carSpeed === 0 && !isDesgarrado && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800">
            <span className="text-[10px] font-retro-mono text-neon-blue text-glow-blue animate-pulse">
              SEGURE O GATILHO OU A BARRA DE ESPAÇO PARA ACELERAR
            </span>
          </div>
        )}

        {/* Track SVG */}
        <svg
          viewBox="0 0 500 250"
          className="w-full h-full p-4"
        >
          <defs>
            {/* Custom filters for fluorescent slot-car neon track lines */}
            <filter id="neon-glow-pink-svg" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neon-glow-blue-svg" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background tracks borders - gives authentic wood track layout depth */}
          <path
            d={trackPathD}
            fill="none"
            stroke="#1d1d26"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            d={trackPathD}
            fill="none"
            stroke="#121217"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Copper tape braid lines (Left & Right contacts) */}
          <path
            d={trackPathD}
            fill="none"
            stroke="#b87333"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Main Slot/Fenda (glowing groove) */}
          <path
            ref={pathRef}
            d={trackPathD}
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Track neon side boundaries */}
          <path
            d={trackPathD}
            fill="none"
            stroke="rgba(0, 240, 255, 0.4)"
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray="4 8"
            opacity="0.3"
          />

          {/* Finish Line checkerboard */}
          <g transform="translate(80, 115) rotate(0)">
            <rect x="-4" y="0" width="8" height="2" fill="#fff" />
            <rect x="-4" y="2" width="4" height="2" fill="#000" />
            <rect x="0" y="2" width="4" height="2" fill="#fff" />
            <rect x="-4" y="4" width="8" height="2" fill="#fff" />
            <rect x="-4" y="4" width="4" height="2" fill="#000" />
            <rect x="0" y="6" width="4" height="2" fill="#fff" />
            <rect x="-4" y="8" width="8" height="2" fill="#000" />
          </g>

          {/* Sparks layer */}
          {sparks.map((spark) => (
            <line
              key={spark.id}
              x1={spark.x}
              y1={spark.y}
              x2={spark.x - spark.vx * 0.05}
              y2={spark.y - spark.vy * 0.05}
              stroke={spark.color}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity={spark.life}
            />
          ))}

          {/* The Slot Car (Retro 80s Cyber Wedge Car) */}
          {!isDesgarrado && (
            <g
              transform={`translate(${carPos.x}, ${carPos.y}) rotate(${carRotation})`}
              className="cursor-pointer"
            >
              {/* Car Body shadow */}
              <rect
                x="-14"
                y="-7"
                width="24"
                height="14"
                rx="2"
                fill="rgba(0,0,0,0.5)"
              />

              {/* Wedge style cyber chassis (Neon Pink) */}
              <path
                d="M -12,-5 L 8,-4 L 12,0 L 8,4 L -12,5 Z"
                fill="#ff007f"
                stroke="#ffffff"
                strokeWidth="1"
                filter="url(#neon-glow-pink-svg)"
              />

              {/* Windshield / Cockpit (Chrome/Cyan) */}
              <polygon
                points="-4,-3 2,-2 4,0 2,2 -4,3"
                fill="#00f0ff"
              />

              {/* Yellow Headlights glows */}
              {carSpeed > 10 && (
                <>
                  <circle cx="12" cy="-2" r="1.5" fill="#fff01f" filter="url(#neon-glow-blue-svg)" />
                  <circle cx="12" cy="2" r="1.5" fill="#fff01f" filter="url(#neon-glow-blue-svg)" />
                  {/* Headlight beams */}
                  <polygon
                    points="12,-2 35,-8 35,8 12,2"
                    fill="rgba(255, 240, 31, 0.15)"
                  />
                </>
              )}

              {/* Wheels */}
              <rect x="-10" y="-8" width="5" height="2" fill="#000" rx="0.5" />
              <rect x="-10" y="6" width="5" height="2" fill="#000" rx="0.5" />
              <rect x="4" y="-7" width="4" height="1.5" fill="#000" rx="0.5" />
              <rect x="4" y="5.5" width="4" height="1.5" fill="#000" rx="0.5" />
            </g>
          )}
        </svg>
      </div>

      {/* Telemetry Stats dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-col">
          <span className="text-[10px] font-retro-tech text-zinc-500 tracking-wider">SPEED</span>
          <span className="font-retro-mono text-xl text-neon-blue text-glow-blue">
            {Math.round(carSpeed * 0.83).toLocaleString()} <span className="text-xs text-zinc-500">RPM</span>
          </span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-col">
          <span className="text-[10px] font-retro-tech text-zinc-500 tracking-wider">LAP COUNT</span>
          <span className="font-retro-mono text-xl text-neon-pink text-glow-pink">
            {laps} <span className="text-xs text-zinc-500">voltas</span>
          </span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-col">
          <span className="text-[10px] font-retro-tech text-zinc-500 tracking-wider">CURRENT LAP</span>
          <span className="font-retro-mono text-xl text-neon-yellow text-glow-yellow">
            {currentLapTime > 0 ? `${currentLapTime.toFixed(3)}s` : "--.---s"}
          </span>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex flex-col">
          <span className="text-[10px] font-retro-tech text-zinc-500 tracking-wider">BEST RECORD</span>
          <span className="font-retro-mono text-xl text-neon-green text-glow-green animate-pulse">
            {bestLapTime > 0 ? `${bestLapTime.toFixed(3)}s` : "--.---s"}
          </span>
        </div>
      </div>

      {/* Interactive Controller & Track Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2 border-t border-zinc-800/60">
        {/* Track State Indicators */}
        <div className="md:col-span-5 flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-500 font-retro-tech">TEMPERATURA DOS TRILHOS</span>
            <span className={`font-retro-mono ${trackTemp > 40 ? "text-neon-pink" : "text-neon-blue"}`}>
              {trackTemp.toFixed(1)}°C
            </span>
          </div>
          <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
            <motion.div
              className={`h-full ${trackTemp > 40 ? "bg-neon-pink" : "bg-neon-blue"}`}
              style={{ width: `${Math.min(((trackTemp - 20) / 30) * 100, 100)}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[11px] font-retro-mono text-zinc-500 mt-1">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isDesgarrado ? "bg-neon-pink animate-ping" : "bg-neon-green"}`} />
              SINAL: ESTÁVEL
            </span>
            <span>VOLTAGEM REGULADA EM 14.8V</span>
          </div>
        </div>

        {/* The Trigger Controller */}
        <div className="md:col-span-7 flex items-center justify-end gap-4">
          <div className="text-right">
            <span className="block text-[10px] font-retro-tech text-zinc-500">ACELERADOR DE PISTOLA</span>
            <span className="font-retro-mono text-xs text-zinc-400">
              POTÊNCIA: <span className="text-neon-pink text-glow-pink font-bold">{throttle}%</span>
            </span>
          </div>

          {/* Real Animated Pistol Controller Handle trigger */}
          <div className="relative flex items-center">
            {/* The Pistol Body (Static part) */}
            <svg viewBox="0 0 100 80" className="w-20 h-16 text-zinc-700 select-none">
              {/* Pistol body and handle */}
              <path d="M 10,20 L 70,20 C 75,20 80,25 80,30 L 80,45 C 80,50 75,55 70,55 L 50,55 L 45,75 C 43,78 38,78 35,75 L 20,60 C 18,58 18,54 20,52 L 35,42 L 35,30 Z" fill="currentColor" />
              {/* Metal Barrel outline */}
              <rect x="5" y="10" width="65" height="10" fill="#27272a" rx="1" />
              {/* Glowing LED status on the controller */}
              <circle cx="65" cy="30" r="3" fill={isDesgarrado ? "#ff007f" : throttle > 0 ? "#39ff14" : "#00f0ff"} className="animate-pulse" />
              
              {/* Trigger (Moving part) - rotates around pivot based on throttle */}
              <g transform={`translate(32, 28) rotate(${throttle * 0.18})`}>
                {/* Finger Trigger Hook */}
                <path d="M 0,0 C 5,10 5,20 0,25 C -5,28 -10,24 -10,20 C -8,15 -8,5 0,0 Z" fill="#dc2626" />
                {/* Spring inside */}
                <path d="M 0,5 L -6,10 L 0,15" stroke="#a1a1aa" strokeWidth="1" fill="none" />
              </g>
            </svg>

            {/* Huge Touch Acceleration Button */}
            <button
              onMouseDown={() => {
                setIsPressing(true);
                initAudio();
              }}
              onMouseUp={() => setIsPressing(false)}
              onMouseLeave={() => setIsPressing(false)}
              onTouchStart={(e) => {
                e.preventDefault();
                setIsPressing(true);
                initAudio();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setIsPressing(false);
              }}
              className={`select-none cursor-pointer flex items-center justify-center gap-2 font-retro-title tracking-widest text-sm px-6 py-4 rounded-xl border transition-all active:scale-95 ${
                isPressing
                  ? "bg-neon-pink text-white border-neon-pink box-glow-pink"
                  : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-glow-pink hover:text-neon-pink"
              }`}
            >
              <Zap className={`w-4 h-4 ${isPressing ? "animate-bounce" : ""}`} />
              PRESSIONAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
