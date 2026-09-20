import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, 
  Calendar, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  LogIn, 
  LogOut, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Compass, 
  Camera, 
  Eye, 
  Check, 
  Lock, 
  Layers,
  Search,
  X
} from "lucide-react";
import { collection, doc, onSnapshot, setDoc, deleteDoc, query } from "firebase/firestore";
import { db } from "../firebase";
import { showToast } from "../utils/toast";

interface HistoryPhoto {
  id: string;
  title: string;
  description: string;
  category: "eventos" | "particulares" | "comerciais" | "momentos";
  imageUrl: string;
  year?: string;
  location?: string;
}

// Initial pre-loaded curated gallery of RaceBoy's rich 35-year legacy
const DEFAULT_PHOTOS: HistoryPhoto[] = [
  {
    id: "h1",
    title: "Campeonato Paulista de Slot Car 1994",
    description: "Competidores concentrados durante as finais do torneio paulista. Pista Monza com telemetria analógica de primeira geração.",
    category: "eventos",
    imageUrl: "https://i.postimg.cc/05Z9Xb1T/campeonato-brasileiro-de-slotcar-1-993-raceboy.webp",
    year: "1994",
    location: "São Paulo, SP"
  },
  {
    id: "h2",
    title: "Circuito Particular de Alta Velocidade",
    description: "Pista residencial sob medida com acabamento emborrachado preto de altíssima tração montada na sala de jogos de colecionador.",
    category: "particulares",
    imageUrl: "https://i.postimg.cc/Kz6CqNKV/raceboy-rally-plus6-3.jpg",
    year: "2018",
    location: "Curitiba, PR"
  },
  {
    id: "h3",
    title: "Arena Speed Comercial",
    description: "Inauguração da pista gigante em shopping center paulistano. Sucesso absoluto de público e bilheteria.",
    category: "comerciais",
    imageUrl: "https://i.postimg.cc/13KP8LgW/raceboy-shopping-lapa-sp.png",
    year: "2011",
    location: "Shopping Ibirapuera, SP"
  },
  {
    id: "h4",
    title: "Fundação da Primeira Oficina",
    description: "O início de tudo em 1991. Engenhosidade e paixão que deram origem ao padrão de usinagem mais respeitado do Brasil.",
    category: "momentos",
    imageUrl: "https://i.postimg.cc/4x5hNXDx/raceboy-tunel.jpg",
    year: "1991",
    location: "São Caetano do Sul, SP"
  },
  {
    id: "h5",
    title: "Raceboy Ferrari Santender",
    description: "Teste supremo da qualidade e durabilidade para os motores, cordoalhas e fontes RaceBoy.",
    category: "eventos",
    imageUrl: "https://i.postimg.cc/7YpNT1Ys/santander-ferrari.jpg",
    year: "2005",
    location: "Interlagos, SP"
  },
  {
    id: "h6",
    title: "Pista Modular Compacta Residencial",
    description: "Modelo compacto de encaixe macho-fêmea para apartamentos. Diversão em escala sem ocupar espaço definitivo.",
    category: "particulares",
    imageUrl: "https://i.postimg.cc/PxYMyPVt/raceboy-home-set.webp",
    year: "2023",
    location: "Rio de Janeiro, RJ"
  }
];

export default function HistoriaView() {
  const [photos, setPhotos] = useState<HistoryPhoto[]>([]);
  const [activeCategory, setActiveCategory] = useState<"todos" | "eventos" | "particulares" | "comerciais" | "momentos">("todos");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Admin dashboard state
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Form state for new photo
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState<"eventos" | "particulares" | "comerciais" | "momentos">("eventos");
  const [newYear, setNewYear] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [imageUrlType, setImageUrlType] = useState<"url" | "file">("url");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(false);

  // Load photos in real-time from Firestore, seeding with defaults if empty
  useEffect(() => {
    // Check if user is already logged in as admin in this session
    const adminSession = sessionStorage.getItem("raceboy_admin_logged") === "true" || sessionStorage.getItem("raceboy_admin_auth") === "true";
    if (adminSession) {
      setIsAdmin(true);
    }

    const q = query(collection(db, "history_photos"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Seed database if empty
        try {
          for (const photo of DEFAULT_PHOTOS) {
            // Use the photo.id as the document ID so we don't duplicate
            await setDoc(doc(db, "history_photos", photo.id), {
              title: photo.title,
              description: photo.description,
              category: photo.category,
              imageUrl: photo.imageUrl,
              year: photo.year || "",
              location: photo.location || "",
              createdAt: Date.now()
            });
          }
        } catch (error) {
          console.error("Error seeding photos to Firestore:", error);
        }
      } else {
        const fetchedPhotos: HistoryPhoto[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedPhotos.push({
            id: docSnap.id,
            title: data.title || "",
            description: data.description || "",
            category: data.category || "eventos",
            imageUrl: data.imageUrl || "",
            year: data.year || undefined,
            location: data.location || undefined,
            createdAt: data.createdAt || 0
          } as any);
        });
        
        // Sort photos by year descending, or createdAt if year is same or missing
        fetchedPhotos.sort((a, b) => {
          const yearA = parseInt(a.year || "0", 10);
          const yearB = parseInt(b.year || "0", 10);
          if (yearB !== yearA) {
            return yearB - yearA; // Newest years first
          }
          return (b as any).createdAt - (a as any).createdAt;
        });

        setPhotos(fetchedPhotos);
      }
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      // Fallback to localStorage/defaults in case of error
      const saved = localStorage.getItem("raceboy_history_photos");
      if (saved) {
        try {
          setPhotos(JSON.parse(saved));
        } catch (e) {
          setPhotos(DEFAULT_PHOTOS);
        }
      } else {
        setPhotos(DEFAULT_PHOTOS);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle simple login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "raceboy35" || password === "1991") {
      setIsAdmin(true);
      sessionStorage.setItem("raceboy_admin_logged", "true");
      sessionStorage.setItem("raceboy_admin_auth", "true");
      setLoginError("");
      setPassword("");
      setShowLoginModal(false);
      showToast("Acesso Autorizado como Administrador!");
    } else {
      setLoginError("Senha incorreta. Tente 'raceboy35' ou '1991'!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("raceboy_admin_logged");
  };

  // Convert local file to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
        setUploadProgress(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new photo directly to Firestore
  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newImageUrl.trim()) {
      showToast("Preencha o Título, Descrição e insira uma Imagem.", "error");
      return;
    }

    try {
      const customId = "user-" + Date.now();
      await setDoc(doc(db, "history_photos", customId), {
        title: newTitle,
        description: newDescription,
        category: newCategory,
        imageUrl: newImageUrl,
        year: newYear || "",
        location: newLocation || "",
        createdAt: Date.now()
      });

      // Reset Form
      setNewTitle("");
      setNewDescription("");
      setNewYear("");
      setNewLocation("");
      setNewImageUrl("");
      showToast("Foto histórica cadastrada com sucesso!");
    } catch (error) {
      console.error("Error adding photo to Firestore:", error);
      showToast("Ocorreu um erro ao salvar na nuvem do Firebase.", "error");
    }
  };

  // Delete a photo from Firestore
  const handleDeletePhoto = async (id: string) => {
    if (confirm("Tem certeza que deseja apagar essa foto da história de 35 anos?")) {
      try {
        await deleteDoc(doc(db, "history_photos", id));
        showToast("Foto excluída com sucesso!");
      } catch (error) {
        console.error("Error deleting document from Firestore:", error);
        showToast("Erro ao excluir do Firebase.", "error");
      }
    }
  };

  // Open WhatsApp with direct pre-filled lead tracking
  const handleWhatsAppContact = (photo: HistoryPhoto) => {
    const text = encodeURIComponent(
      `Olá RaceBoy! Fiquei interessado na foto "${photo.title}" (Ano: ${photo.year || "Não informado"}) da seção "${photo.category.toUpperCase()}" na sua página de 35 anos de História. Gostaria de saber mais sobre esse projeto!`
    );
    showToast("Redirecionando para o WhatsApp do projetista...");
    window.open(`https://wa.me/5511994388829?text=${text}`, "_blank");
  };

  // Category formatting labels
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "eventos":
        return "Eventos & Torneios";
      case "particulares":
        return "Pistas Particulares";
      case "comerciais":
        return "Pistas Comerciais";
      case "momentos":
        return "Momentos Históricos";
      default:
        return category;
    }
  };

  // Calculate dynamic counts based on all stored photos
  const getCategoryCount = (category: "todos" | "eventos" | "particulares" | "comerciais" | "momentos") => {
    if (category === "todos") return photos.length;
    return photos.filter(p => p.category === category).length;
  };

  // Filter photos by category AND search terms (title, description, year, city)
  const filteredPhotos = photos.filter((p) => {
    const matchesCategory = activeCategory === "todos" || p.category === activeCategory;
    const matchesSearch = 
      searchTerm.trim() === "" ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.year && p.year.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-12 py-6">
      
      {/* Visual Header */}
      <div className="text-center md:text-left flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b border-zinc-800/80 pb-8 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 w-44 h-44 bg-neon-pink/5 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-[10px] font-retro-mono text-amber-400 uppercase tracking-widest mb-3">
            <Trophy className="w-3.5 h-3.5" /> 35 ANOS DE TRADIÇÃO (1991 - 2026)
          </div>
          <h2 className="font-retro-title text-3xl sm:text-4xl text-zinc-100 tracking-tight leading-none uppercase">
            RACEBOY 35 ANOS DE HISTÓRIA
          </h2>
          <p className="text-xs font-retro-mono text-zinc-500 mt-2 uppercase tracking-wider">
            Navegue pelo nosso túnel do tempo e veja os marcos, pistas e momentos que definem nossa história.
          </p>
        </div>

        {/* Administration quick trigger */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-retro-mono text-neon-green flex items-center gap-1.5 bg-neon-green/5 border border-neon-green/30 px-3 py-1.5 rounded-xl">
                <Check className="w-3.5 h-3.5" /> ADMIN CONECTADO
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-xl text-xs font-retro-mono cursor-pointer transition-all"
              >
                <LogOut className="w-3 h-3" /> SAIR
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white px-4 py-2 rounded-xl text-xs font-retro-mono cursor-pointer transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-neon-pink" /> ÁREA DO PROJETISTA
            </button>
          )}
        </div>
      </div>

      {/* Search & Category Filter Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-zinc-900 pb-6">
        {/* Category Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "todos", label: "VER TODAS" },
            { key: "eventos", label: "EVENTOS" },
            { key: "particulares", label: "PISTAS PARTICULARES" },
            { key: "comerciais", label: "PISTAS COMERCIAIS" },
            { key: "momentos", label: "MOMENTOS" }
          ].map((cat) => {
            const count = getCategoryCount(cat.key as any);
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key as any)}
                className={`group px-3 py-1.5 rounded-lg font-retro-title text-[9px] sm:text-[10px] tracking-wider transition-all cursor-pointer uppercase flex items-center gap-1.5 border ${
                  isActive
                    ? "bg-amber-400/15 border-amber-400/40 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.1)]"
                    : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40 hover:border-zinc-800"
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-retro-mono font-bold transition-all ${
                  isActive 
                    ? "bg-amber-400/20 text-amber-400 border border-amber-400/30" 
                    : "bg-zinc-900/80 text-zinc-600 group-hover:text-zinc-400 group-hover:bg-zinc-900 border border-zinc-900"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full lg:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-zinc-600" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar memórias, ano, cidade..."
            className="w-full bg-zinc-950 hover:bg-zinc-900/60 focus:bg-zinc-950 text-xs text-zinc-100 placeholder-zinc-600 pl-9 pr-8 py-2.5 rounded-xl border border-zinc-900 focus:border-amber-400/50 outline-none transition-all font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Admin Creator Dashboard Area */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-zinc-950 border-2 border-dashed border-neon-blue/40 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-neon-blue animate-pulse" />
            <h3 className="font-retro-title text-base text-zinc-100 uppercase tracking-wide">
              CADASTRAR NOVA FOTO HISTÓRICA
            </h3>
          </div>

          <form onSubmit={handleAddPhoto} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Input fields */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-retro-mono text-zinc-400 uppercase">Título da Imagem *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Inauguração da Pista em Santos"
                    className="bg-zinc-900 border border-zinc-800 focus:border-neon-blue rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-retro-mono text-zinc-400 uppercase">Categoria *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 focus:border-neon-blue rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none transition-all"
                  >
                    <option value="eventos">Eventos</option>
                    <option value="particulares">Pistas Particulares</option>
                    <option value="comerciais">Pistas Comerciais</option>
                    <option value="momentos">Momentos</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-retro-mono text-zinc-400 uppercase">Texto Descritivo *</label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Conte um pouco da história por trás dessa foto, quem estava lá ou detalhes da pista usinada..."
                  className="bg-zinc-900 border border-zinc-800 focus:border-neon-blue rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-retro-mono text-zinc-400 uppercase">Ano (Opcional)</label>
                  <input
                    type="text"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="Ex: 1998"
                    className="bg-zinc-900 border border-zinc-800 focus:border-neon-blue rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-retro-mono text-zinc-400 uppercase">Cidade/Estado (Opcional)</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Ex: Sorocaba, SP"
                    className="bg-zinc-900 border border-zinc-800 focus:border-neon-blue rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload / URL */}
            <div className="md:col-span-5 flex flex-col gap-4 border-l border-zinc-900 pl-0 md:pl-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-retro-mono text-zinc-400 uppercase">Método da Imagem *</span>
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => { setImageUrlType("url"); setNewImageUrl(""); }}
                    className={`flex-1 py-1 text-[9px] font-retro-title rounded transition-all cursor-pointer ${
                      imageUrlType === "url" ? "bg-neon-blue text-black font-bold" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    COLOQUE LINK (URL)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setImageUrlType("file"); setNewImageUrl(""); }}
                    className={`flex-1 py-1 text-[9px] font-retro-title rounded transition-all cursor-pointer ${
                      imageUrlType === "file" ? "bg-neon-blue text-black font-bold" : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    SUBIR DO COMPUTADOR
                  </button>
                </div>
              </div>

              {imageUrlType === "url" ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-retro-mono text-zinc-400 uppercase">Link de Imagem na Internet</label>
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="bg-zinc-900 border border-zinc-800 focus:border-neon-blue rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none transition-all"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-retro-mono text-zinc-400 uppercase">Arquivo de Foto</label>
                  <label className="flex flex-col items-center justify-center border border-zinc-800 hover:border-neon-blue bg-zinc-900/40 rounded-lg p-4 cursor-pointer transition-all h-24 text-center">
                    <Camera className="w-5 h-5 text-zinc-500 mb-1" />
                    <span className="text-[10px] font-retro-mono text-zinc-400">Escolha uma foto da galeria</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Preview Box */}
              {newImageUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-zinc-800 aspect-video bg-black flex items-center justify-center">
                  <img
                    src={newImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    type="button"
                    onClick={() => setNewImageUrl("")}
                    className="absolute top-1.5 right-1.5 bg-black/80 hover:bg-neon-red border border-zinc-800 text-white p-1 rounded-md text-[9px]"
                  >
                    Limpar
                  </button>
                </div>
              ) : (
                <div className="border border-dashed border-zinc-800 rounded-lg aspect-video bg-zinc-950 flex flex-col items-center justify-center text-zinc-600 font-retro-mono text-[9px] uppercase">
                  {uploadProgress ? "Processando imagem..." : "Sem prévia da imagem"}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-neon-blue hover:bg-[#3498ff] text-black font-retro-title text-xs tracking-wider rounded-lg transition-all font-bold cursor-pointer"
              >
                SALVAR FOTO HISTÓRICA
              </button>
            </div>

          </form>
        </motion.div>
      )}

      {/* Main Grid Gallery Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo) => (
            <motion.div
              layout
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-full group hover:border-zinc-800 transition-all duration-300"
            >
              
              {/* Card Image Area with info stickers */}
              <div className="relative aspect-video overflow-hidden bg-black flex-shrink-0">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                  style={{
                    transform: "translate3d(0,0,0) rotate(0.01deg)",
                    backfaceVisibility: "hidden",
                  }}
                />
                
                {/* Vintage sticker headers */}
                <div className="absolute top-3 inset-x-3 flex justify-between items-center z-10">
                  <span className="bg-black/80 backdrop-blur-md border border-zinc-800 text-[8px] font-retro-mono px-2 py-0.5 rounded text-amber-400 uppercase tracking-widest">
                    {getCategoryLabel(photo.category)}
                  </span>
                  {photo.year && (
                    <span className="bg-amber-400 text-black border border-amber-300 text-[8px] font-retro-title px-2 py-0.5 rounded font-bold">
                      {photo.year}
                    </span>
                  )}
                </div>

                {/* Location overlay footer */}
                {photo.location && (
                  <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[8px] font-retro-mono text-zinc-300">
                    <MapPin className="w-2.5 h-2.5 text-neon-pink" />
                    <span>{photo.location}</span>
                  </div>
                )}
                
                {/* Admin quick deletion tool */}
                {isAdmin && (
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute bottom-2 right-2 z-20 bg-neon-red/20 hover:bg-neon-red text-white p-2 rounded-lg border border-neon-red/40 hover:border-white transition-all cursor-pointer"
                    title="Excluir foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Card Metadata & Narrative */}
              <div className="p-5 flex flex-col flex-grow justify-between bg-zinc-950 border-t border-zinc-900">
                <div className="flex flex-col gap-2">
                  <h3 className="font-retro-title text-sm text-zinc-100 group-hover:text-amber-400 transition-colors uppercase leading-tight">
                    {photo.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                    {photo.description}
                  </p>
                </div>

                {/* Lead-approaching Ferrari Yellow Button */}
                <div className="mt-5 pt-4 border-t border-zinc-900">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWhatsAppContact(photo)}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-retro-title text-[9px] sm:text-[10px] tracking-wider rounded-lg font-bold transition-all flex items-center justify-center gap-2 border border-white/20 shadow-[0_0_15px_rgba(251,191,36,0.15)] cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-black" />
                    CONVERSAR SOBRE ESTE PROJETO
                  </motion.button>
                </div>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPhotos.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-900 rounded-2xl bg-zinc-950/20">
            <Search className="w-8 h-8 text-zinc-700 mx-auto mb-3 animate-pulse" />
            <h4 className="font-retro-title text-sm text-zinc-300 uppercase">Nenhuma memória encontrada</h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto mt-2 font-sans">
              Não encontramos nenhuma foto histórica correspondente à categoria <span className="text-amber-400 font-bold">"{getCategoryLabel(activeCategory)}"</span>{searchTerm && <> ou ao termo de busca <span className="text-amber-400 font-bold">"{searchTerm}"</span></>}.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg text-xs font-retro-mono transition-all cursor-pointer border border-zinc-800"
                >
                  LIMPAR BUSCA
                </button>
              )}
              {activeCategory !== "todos" && (
                <button
                  onClick={() => setActiveCategory("todos")}
                  className="px-4 py-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 rounded-lg text-xs font-retro-mono transition-all cursor-pointer border border-amber-400/30"
                >
                  VER TODAS AS MEMÓRIAS
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Retro background watermark badge */}
      <div className="mt-12 flex justify-center opacity-25">
        <div className="border border-zinc-800 px-6 py-3 rounded-xl flex items-center gap-2.5">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="font-retro-mono text-[8px] text-zinc-500 tracking-widest uppercase">
            RACEBOY - DESDE 1991 PRESERVANDO O AUTOMODELISMO BRASILEIRO
          </span>
        </div>
      </div>

      {/* Credentials Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-sm w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden relative p-6 cursor-default box-glow-pink"
            >
              <div className="flex items-center gap-2.5 mb-5 border-b border-zinc-900 pb-4">
                <Lock className="w-4 h-4 text-neon-pink" />
                <h4 className="font-retro-title text-xs text-zinc-100 uppercase tracking-wider">
                  AUTENTICAÇÃO DO PROJETISTA
                </h4>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-retro-mono text-zinc-400 uppercase">Insira a Senha Administrativa</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-zinc-900 border border-zinc-800 focus:border-neon-pink rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none transition-all text-center tracking-widest font-mono"
                  />
                </div>

                {loginError && (
                  <span className="text-[9px] font-retro-mono text-neon-red uppercase block">
                    ⚠ {loginError}
                  </span>
                )}

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-retro-mono rounded-lg transition-all cursor-pointer"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-neon-pink hover:bg-[#ff208c] text-white text-xs font-retro-title rounded-lg transition-all cursor-pointer"
                  >
                    ENTRAR
                  </button>
                </div>
              </form>

              <div className="mt-4 pt-3 border-t border-zinc-900 text-center">
                <span className="text-[8px] font-retro-mono text-zinc-600 block uppercase">
                  DICA DA SENHA DE AMBIENTE: raceboy35
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
