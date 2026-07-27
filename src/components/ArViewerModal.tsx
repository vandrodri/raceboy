import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, 
  X, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Download, 
  MessageSquare, 
  RefreshCw, 
  Lightbulb, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle,
  Ruler,
  Compass,
  Layers,
  Box
} from "lucide-react";
import { showToast } from "../utils/toast";

interface GalleryItem {
  id: number;
  title: string;
  client: string;
  specs: string;
  image: string;
  glowClass: string;
}

interface ArViewerModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export default function ArViewerModal({ item, onClose }: ArViewerModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Camera States
  const [cameraState, setCameraState] = useState<"loading" | "active" | "denied" | "unsupported">("loading");
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // AR Controls State
  const [rotationY, setRotationY] = useState(25); // degrees
  const [tiltX, setTiltX] = useState(55); // degrees
  const [scale, setScale] = useState(1.0); // 0.4 to 2.5
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Customization & Animation
  const [showGrid, setShowGrid] = useState(true);
  const [showLeds, setShowLeds] = useState(true);
  const [animateCars, setAnimateCars] = useState(true);
  const [carSpeed, setCarSpeed] = useState(1.2);
  const [trackColor, setTrackColor] = useState<"neon-pink" | "neon-blue" | "amber" | "neon-green">("neon-pink");

  // Snapshot photo state
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  // Estimated Real-World dimensions based on scale
  const estWidth = (3.5 * scale).toFixed(1);
  const estLength = (6.0 * scale).toFixed(1);
  const estLanes = item?.specs.includes("8 FENDAS") ? 8 : item?.specs.includes("6 FENDAS") ? 6 : item?.specs.includes("2 FENDAS") ? 2 : 4;

  // Initialize Camera Stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function initCamera() {
      setCameraState("loading");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraState("unsupported");
        return;
      }

      try {
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });

        currentStream = stream;
        setMediaStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(console.error);
            setCameraState("active");
          };
        } else {
          setCameraState("active");
        }
      } catch (err) {
        console.warn("Camera access failed or denied:", err);
        setCameraState("denied");
      }
    }

    initCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Toggle Camera Facing Mode
  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  // 3D Canvas Rendering Loop
  useEffect(() => {
    let animFrameId: number;
    let progress = 0;

    const render3DTrack = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Adjust canvas resolution to display size
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2 + position.x;
      const centerY = canvas.height / 2 + position.y;

      if (animateCars) {
        progress += 0.01 * carSpeed;
      }

      // Projection parameters
      const radY = (rotationY * Math.PI) / 180;
      const radTilt = (tiltX * Math.PI) / 180;
      const baseScale = Math.min(canvas.width, canvas.height) * 0.35 * scale;

      // Helper function to project 3D point (x, y, z) to 2D screen coordinates
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const rx = x * Math.cos(radY) - z * Math.sin(radY);
        const rz = x * Math.sin(radY) + z * Math.cos(radY);

        // Rotate around X axis (tilt)
        const ry = y * Math.cos(radTilt) - rz * Math.sin(radTilt);
        const rz2 = y * Math.sin(radTilt) + rz * Math.cos(radTilt);

        // Perspective depth factor
        const perspective = 800 / (800 + rz2);

        return {
          x: centerX + rx * perspective * (baseScale / 100),
          y: centerY + ry * perspective * (baseScale / 100),
          scale: perspective
        };
      };

      // 1. Draw Ground Surface AR Grid / Target Plane
      if (showGrid) {
        ctx.strokeStyle = "rgba(0, 240, 255, 0.18)";
        ctx.lineWidth = 1;
        const gridSize = 120;
        const gridStep = 30;

        for (let gx = -gridSize; gx <= gridSize; gx += gridStep) {
          const p1 = project(gx, 0, -gridSize);
          const p2 = project(gx, 0, gridSize);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        for (let gz = -gridSize; gz <= gridSize; gz += gridStep) {
          const p1 = project(-gridSize, 0, gz);
          const p2 = project(gridSize, 0, gz);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Center AR Anchor Pulsing Target
        const origin = project(0, 0, 0);
        const pulseR = 15 + Math.sin(Date.now() * 0.005) * 4;
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 0, 127, 0.6)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 2. Track Base Geometry (Rounded Rectangle / Circuit Loop)
      const numPoints = 80;
      const innerPath: { x: number; y: number }[] = [];
      const outerPath: { x: number; y: number }[] = [];
      const slotPaths: { x: number; y: number }[][] = Array.from({ length: estLanes }, () => []);

      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2;
        // Figure-8 / Spa-style curved circuit shape formula
        const R = 80 + 25 * Math.sin(t * 2);
        const trackX = Math.cos(t) * R * 1.3;
        const trackZ = Math.sin(t) * R * 0.85;
        const elevationY = -12 * Math.sin(t * 2); // Banked curves / viaduct elevation

        // Outer & Inner boundaries
        const outer = project(trackX * 1.2, elevationY, trackZ * 1.2);
        const inner = project(trackX * 0.7, elevationY, trackZ * 0.7);

        outerPath.push(outer);
        innerPath.push(inner);

        // Intermediate slots for cars
        for (let l = 0; l < estLanes; l++) {
          const laneRatio = 0.75 + (l / (estLanes - 1 || 1)) * 0.4;
          const laneP = project(trackX * laneRatio, elevationY, trackZ * laneRatio);
          slotPaths[l].push(laneP);
        }
      }

      // Draw Track Base Surface (Dark MDF Texture)
      ctx.fillStyle = "rgba(18, 18, 22, 0.88)";
      ctx.beginPath();
      if (outerPath.length > 0) {
        ctx.moveTo(outerPath[0].x, outerPath[0].y);
        for (let i = 1; i < outerPath.length; i++) {
          ctx.lineTo(outerPath[i].x, outerPath[i].y);
        }
        ctx.closePath();
      }
      ctx.fill();

      // Cutout inner infield
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      if (innerPath.length > 0) {
        ctx.moveTo(innerPath[0].x, innerPath[0].y);
        for (let i = 1; i < innerPath.length; i++) {
          ctx.lineTo(innerPath[i].x, innerPath[i].y);
        }
        ctx.closePath();
      }
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // Draw Track Borders & Glowing LED Strip
      ctx.strokeStyle = showLeds ? "rgba(0, 240, 255, 0.9)" : "rgba(100, 100, 100, 0.5)";
      ctx.lineWidth = showLeds ? 3 : 1.5;
      if (showLeds) {
        ctx.shadowColor = "rgba(0, 240, 255, 0.8)";
        ctx.shadowBlur = 12;
      }

      ctx.beginPath();
      outerPath.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.closePath();
      ctx.stroke();

      ctx.strokeStyle = showLeds ? "rgba(255, 0, 127, 0.9)" : "rgba(100, 100, 100, 0.5)";
      if (showLeds) {
        ctx.shadowColor = "rgba(255, 0, 127, 0.8)";
      }
      ctx.beginPath();
      innerPath.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.closePath();
      ctx.stroke();

      ctx.shadowBlur = 0; // Reset shadow

      // Draw Metallic Slot Lanes (Copper Braids)
      slotPaths.forEach((lanePoints) => {
        ctx.strokeStyle = "rgba(234, 179, 8, 0.7)"; // Gold copper braid
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        lanePoints.forEach((pt, i) => (i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
        ctx.closePath();
        ctx.stroke();
      });

      // 3. Draw Animated Mini Slot Cars on the Track
      const carColors = [
        "#ff007f", // Neon Pink
        "#00f0ff", // Neon Cyan
        "#39ff14", // Neon Green
        "#eab308", // Amber
        "#a855f7", // Purple
        "#f97316", // Orange
        "#ef4444", // Red
        "#06b6d4"  // Light Blue
      ];

      for (let l = 0; l < estLanes; l++) {
        const lanePoints = slotPaths[l];
        if (lanePoints.length === 0) continue;

        // Offset start position per car
        const laneProgress = (progress + (l * 0.25)) % 1;
        const carIndexFloat = laneProgress * (lanePoints.length - 1);
        const carIndex = Math.floor(carIndexFloat);
        const nextIndex = (carIndex + 1) % lanePoints.length;

        const currentPt = lanePoints[carIndex];
        const nextPt = lanePoints[nextIndex];

        // Interpolate position
        const t = carIndexFloat - carIndex;
        const carX = currentPt.x + (nextPt.x - currentPt.x) * t;
        const carY = currentPt.y + (nextPt.y - currentPt.y) * t;

        // Calculate heading angle
        const angle = Math.atan2(nextPt.y - currentPt.y, nextPt.x - currentPt.x);

        ctx.save();
        ctx.translate(carX, carY);
        ctx.rotate(angle);

        // Car Body
        const cColor = carColors[l % carColors.length];
        ctx.fillStyle = cColor;
        ctx.shadowColor = cColor;
        ctx.shadowBlur = 10;

        ctx.fillRect(-8, -4, 16, 8); // Body

        // Headlights glow
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 8;
        ctx.fillRect(7, -3, 3, 2);
        ctx.fillRect(7, 1, 3, 2);

        ctx.restore();
      }

      // 4. Draw AR Dimension Blueprint Overlay Text
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "10px monospace";
      const boundsY = centerY + 100 * (scale * 0.8);
      ctx.fillText(`LARGURA: ${estWidth}m  ×  COMPRIMENTO: ${estLength}m  |  ${estLanes} FENDAS`, centerX - 120, boundsY);

      animFrameId = requestAnimationFrame(render3DTrack);
    };

    render3DTrack();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [rotationY, tiltX, scale, position, showGrid, showLeds, animateCars, carSpeed, estLanes, estWidth, estLength]);

  // Touch & Mouse Drag for Moving / Rotating the 3D Track
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    if (e.shiftKey) {
      // Shift drag moves position
      setPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    } else {
      // Normal drag rotates 3D view
      setRotationY((prev) => (prev + dx * 0.6) % 360);
      setTiltX((prev) => Math.max(15, Math.min(85, prev + dy * 0.4)));
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Capture Snapshot in AR Mode
  const takeArSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a composite canvas
    const snapCanvas = document.createElement("canvas");
    snapCanvas.width = canvas.width;
    snapCanvas.height = canvas.height;
    const sCtx = snapCanvas.getContext("2d");
    if (!sCtx) return;

    // Draw video background if active
    if (cameraState === "active" && videoRef.current) {
      sCtx.drawImage(videoRef.current, 0, 0, snapCanvas.width, snapCanvas.height);
    } else {
      // Dark room gradient background fallback
      const grad = sCtx.createRadialGradient(
        snapCanvas.width / 2,
        snapCanvas.height / 2,
        50,
        snapCanvas.width / 2,
        snapCanvas.height / 2,
        snapCanvas.width
      );
      grad.addColorStop(0, "#18181b");
      grad.addColorStop(1, "#09090b");
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, snapCanvas.width, snapCanvas.height);
    }

    // Draw the 3D track layer on top
    sCtx.drawImage(canvas, 0, 0);

    // Watermark
    sCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
    sCtx.font = "bold 14px sans-serif";
    sCtx.fillText(`PROJEÇÃO RA RACEBOY - ${item?.title || "PISTA CUSTOMIZADA"}`, 20, snapCanvas.height - 30);
    sCtx.font = "11px monospace";
    sCtx.fillStyle = "#fbbf24";
    sCtx.fillText(`Dimensões em Realidade Aumentada: ${estWidth}m x ${estLength}m (${estLanes} Fendas)`, 20, snapCanvas.height - 12);

    const dataUrl = snapCanvas.toDataURL("image/png");
    setSnapshotUrl(dataUrl);
    showToast("Foto da pista em RA capturada com sucesso!");
  };

  // Send AR Project to WhatsApp
  const handleSendWhatsAppAr = () => {
    const message = encodeURIComponent(
      `Olá RaceBoy! Testei a projeção em Realidade Aumentada da pista *${item?.title || "Personalizada"}* no meu ambiente!\n` +
      `- Dimensões no meu espaço: ${estWidth}m x ${estLength}m\n` +
      `- Número de fendas: ${estLanes}\n` +
      `- Especificações: ${item?.specs}\n` +
      `Gostaria de validar o espaço disponível na minha residência/comércio e solicitar um orçamento!`
    );
    showToast("Abrindo WhatsApp do projetista RaceBoy...");
    window.open(`https://wa.me/5511994388829?text=${message}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between overflow-hidden font-retro-mono select-none"
    >
      {/* Video Stream Element (Full Screen background) */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          cameraState === "active" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Fallback Ambient Room Background when camera is inactive/denied */}
      {cameraState !== "active" && (
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black flex flex-col items-center justify-center p-6 text-center z-0">
          <div className="w-20 h-20 rounded-full bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center mb-4 box-glow-blue animate-pulse">
            <Camera className="w-8 h-8 text-neon-blue" />
          </div>
          <h3 className="font-retro-title text-lg text-zinc-100 uppercase tracking-wider mb-2">
            MODO SIMULADOR DE REALIDADE AUMENTADA (RA)
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mb-4 font-sans">
            {cameraState === "denied"
              ? "A permissão de câmera não foi concedida. Você ainda pode interagir com o modelo 3D da pista no ambiente virtual abaixo."
              : cameraState === "unsupported"
              ? "A câmera do dispositivo não está disponível nesta janela. O protótipo 3D interativo está ativo no canvas."
              : "Iniciando feed da câmera..."}
          </p>

          <button
            onClick={() => setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-amber-400 hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> REINICIAR CÂMERA DO DISPOSITIVO
          </button>
        </div>
      )}

      {/* 3D Interactive Canvas Overlay Layer */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Top HUD Header Bar */}
      <div className="relative z-20 p-4 bg-gradient-to-b from-black/90 via-black/60 to-transparent flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neon-pink/10 border border-neon-pink/40 text-neon-pink text-glow-pink">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-retro-title text-amber-400 uppercase tracking-wider">
                PROJEÇÃO RA 3D
              </span>
              <span className="px-2 py-0.5 rounded text-[8px] bg-neon-green/10 border border-neon-green/30 text-neon-green uppercase">
                {cameraState === "active" ? "CÂMERA EM TEMPO REAL" : "ESTUDIO VIRTUAL"}
              </span>
            </div>
            <h3 className="font-retro-title text-sm sm:text-base text-zinc-100 font-bold uppercase">
              {item?.title || "PISTA CUSTOMIZADA"}
            </h3>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2">
          {cameraState === "active" && (
            <button
              onClick={toggleCameraFacing}
              className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              title="Inverter Câmera (Frontal / Traseira)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/80 text-zinc-300 hover:text-neon-pink hover:border-neon-pink/50 transition-all cursor-pointer"
            title="Fechar Visualizador RA"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center On-screen Touch Instructions (Fades out when dragging) */}
      <div className="relative z-20 pointer-events-none text-center self-center my-auto opacity-70 hover:opacity-100 transition-opacity">
        {!isDragging && (
          <div className="bg-black/60 backdrop-blur-md border border-zinc-800 px-4 py-2 rounded-full text-[10px] text-zinc-300 inline-flex items-center gap-2 uppercase tracking-wider">
            <Move className="w-3.5 h-3.5 text-neon-blue animate-bounce" />
            <span>Arraste com o dedo para girar 360° • Use os controles para dimensionar</span>
          </div>
        )}
      </div>

      {/* Bottom AR HUD Control Panel */}
      <div className="relative z-20 p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
        {/* Real Dimensions & Fit Badge */}
        <div className="max-w-3xl mx-auto mb-3 bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-400">
            <Ruler className="w-4 h-4 text-amber-400" />
            <span className="font-retro-title">ESPAÇO REAL EM RA:</span>
            <span className="font-bold text-zinc-100">{estWidth}m × {estLength}m</span>
            <span className="text-[10px] text-zinc-500">({estLanes} Fendas)</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-zinc-400">
            <Compass className="w-3.5 h-3.5 text-neon-blue" />
            <span>Ângulo: {Math.round(rotationY)}°</span>
            <span className="text-zinc-600">|</span>
            <span>Escala: {Math.round(scale * 100)}%</span>
          </div>
        </div>

        {/* Slider & Toggle Controls */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {/* Scale / Room Size Slider */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase mb-1">
              <span>Ajustar Tamanho no Espaço</span>
              <span className="text-amber-400 font-bold">{Math.round(scale * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <ZoomOut className="w-3.5 h-3.5 text-zinc-500" />
              <input
                type="range"
                min="0.4"
                max="2.2"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <ZoomIn className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          </div>

          {/* Car Speed / Motion */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase block">Animação dos Carrinhos</span>
              <span className="text-[10px] font-bold text-neon-green">
                {animateCars ? `${carSpeed.toFixed(1)}x Velocidade` : "Pausado"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setAnimateCars(!animateCars)}
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all cursor-pointer"
              >
                {animateCars ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-neon-green" />}
              </button>
              <button
                onClick={() => setCarSpeed((prev) => (prev >= 2.5 ? 0.5 : prev + 0.5))}
                className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-xs text-amber-400 transition-all cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Toggles (Grid & LEDs) */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-around">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                showGrid ? "bg-neon-blue/20 border border-neon-blue/50 text-neon-blue" : "bg-zinc-800 text-zinc-500"
              }`}
            >
              <Layers className="w-3 h-3" /> Grid Chão
            </button>

            <button
              onClick={() => setShowLeds(!showLeds)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                showLeds ? "bg-neon-pink/20 border border-neon-pink/50 text-neon-pink" : "bg-zinc-800 text-zinc-500"
              }`}
            >
              <Lightbulb className="w-3 h-3" /> Fita LED
            </button>
          </div>
        </div>

        {/* Action Button CTA Bar */}
        <div className="max-w-3xl mx-auto flex flex-wrap sm:flex-nowrap items-center gap-3">
          <button
            onClick={takeArSnapshot}
            className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 font-retro-title text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            <Camera className="w-4 h-4 text-neon-blue" />
            Tirar Foto em RA
          </button>

          <button
            onClick={handleSendWhatsAppAr}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-retro-title text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(251,191,36,0.25)] cursor-pointer active:scale-98"
          >
            <MessageSquare className="w-4 h-4 fill-black" />
            Orçamento com Dimensões RA
          </button>
        </div>
      </div>

      {/* Snapshot Preview Modal */}
      <AnimatePresence>
        {snapshotUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 bg-black/90 p-4 sm:p-8 flex flex-col items-center justify-center backdrop-blur-md"
          >
            <div className="max-w-xl w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative">
              <button
                onClick={() => setSnapshotUrl(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h4 className="font-retro-title text-base text-zinc-100 uppercase mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-neon-green" /> FOTO EM REALIDADE AUMENTADA
              </h4>

              <div className="rounded-xl overflow-hidden border border-zinc-800 mb-4 bg-black">
                <img src={snapshotUrl} alt="AR Snapshot" className="w-full h-auto object-contain" />
              </div>

              <div className="flex gap-3">
                <a
                  href={snapshotUrl}
                  download={`RaceBoy_AR_${item?.title.replace(/\s+/g, "_") || "Pista"}.png`}
                  className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl font-retro-title text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-neon-blue" /> Salvar Imagem
                </a>

                <button
                  onClick={handleSendWhatsAppAr}
                  className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-retro-title text-xs uppercase font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-black" /> Enviar ao Projetista
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
