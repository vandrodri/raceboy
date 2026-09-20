import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Lock,
  Key,
  Plus,
  Trash2,
  Edit2,
  Check,
  Image as ImageIcon,
  Link,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  LogOut,
  UploadCloud,
  Eye,
  Settings,
  Grid,
  Tv,
  History,
  Clock,
  MapPin
} from "lucide-react";
import { GalleryItem, SiteConfig, HistoryPhoto, DEFAULT_GALLERY_ITEMS, formatYouTubeEmbedUrl } from "../types";
import {
  saveGalleryItem,
  deleteGalleryItem,
  saveSiteConfig,
  seedInitialData,
  subscribeHistoryPhotos,
  saveHistoryPhoto,
  deleteHistoryPhoto
} from "../firebase";
import { showToast } from "../utils/toast";

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  galleryItems: GalleryItem[];
  siteConfig: SiteConfig;
}

const GLOW_OPTIONS = [
  { label: "Rosa Neon", value: "border-glow-pink hover:shadow-[0_0_20px_rgba(255,0,127,0.4)]", color: "#ff007f" },
  { label: "Azul Cyber", value: "border-glow-blue hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]", color: "#00f0ff" },
  { label: "Vermelho Racing", value: "border-glow-red hover:shadow-[0_0_20px_rgba(255,30,39,0.4)]", color: "#ff1e27" },
  { label: "Verde Telemetria", value: "border-glow-green hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]", color: "#39ff14" },
  { label: "Amarelo Ouro", value: "border-glow-yellow hover:shadow-[0_0_20px_rgba(255,240,31,0.4)]", color: "#fff01f" }
];

export default function AdminDashboardModal({
  isOpen,
  onClose,
  galleryItems,
  siteConfig
}: AdminDashboardModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      sessionStorage.getItem("raceboy_admin_auth") === "true" ||
      sessionStorage.getItem("raceboy_admin_logged") === "true"
    );
  });
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<"gallery" | "history" | "featured" | "settings">("gallery");

  // Gallery item form state
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formSpecs, setFormSpecs] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formGlow, setFormGlow] = useState(GLOW_OPTIONS[0].value);
  const [isSaving, setIsSaving] = useState(false);

  // History photos state
  const [historyPhotos, setHistoryPhotos] = useState<HistoryPhoto[]>([]);
  const [editingHistoryItem, setEditingHistoryItem] = useState<HistoryPhoto | null>(null);
  const [isAddingHistory, setIsAddingHistory] = useState(false);
  const [histTitle, setHistTitle] = useState("");
  const [histDesc, setHistDesc] = useState("");
  const [histCategory, setHistCategory] = useState<"eventos" | "particulares" | "comerciais" | "momentos">("eventos");
  const [histYear, setHistYear] = useState("");
  const [histLocation, setHistLocation] = useState("");
  const [histImage, setHistImage] = useState("");
  const [histFilterCategory, setHistFilterCategory] = useState<"todos" | "eventos" | "particulares" | "comerciais" | "momentos">("todos");

  // Featured Config form state
  const [raceenImage, setRaceenImage] = useState(siteConfig.raceenImage);
  const [raceenVideoUrl, setRaceenVideoUrl] = useState(siteConfig.raceenVideoUrl);
  const [mascotImage, setMascotImage] = useState(siteConfig.mascotImage);
  const [newPin, setNewPin] = useState(siteConfig.adminPin);

  useEffect(() => {
    setRaceenImage(siteConfig.raceenImage);
    setRaceenVideoUrl(siteConfig.raceenVideoUrl);
    setMascotImage(siteConfig.mascotImage);
    setNewPin(siteConfig.adminPin);

    const unsubscribeHistory = subscribeHistoryPhotos((photos) => {
      setHistoryPhotos(photos);
    });

    return () => {
      unsubscribeHistory();
    };
  }, [siteConfig]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = siteConfig.adminPin || "1991";
    if (pinInput.trim() === correctPin || pinInput.trim() === "raceboy35") {
      setIsAuthenticated(true);
      sessionStorage.setItem("raceboy_admin_auth", "true");
      sessionStorage.setItem("raceboy_admin_logged", "true");
      setPinError(false);
      setPinInput("");
      showToast("Acesso Autorizado! Bem-vindo ao Painel Admin RaceBoy.");
    } else {
      setPinError(true);
      showToast("PIN Incorreto! Tente novamente.", "error");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("raceboy_admin_auth");
    sessionStorage.removeItem("raceboy_admin_logged");
    showToast("Sessão encerrada com segurança.");
  };

  // Gallery handlers
  const openAddModal = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormClient("");
    setFormSpecs("");
    setFormImage("");
    setFormGlow(GLOW_OPTIONS[0].value);
    setIsAddingNew(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormClient(item.client);
    setFormSpecs(item.specs);
    setFormImage(item.image);
    setFormGlow(item.glowClass || GLOW_OPTIONS[0].value);
    setIsAddingNew(true);
  };

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formImage) {
      showToast("Preencha ao menos o Título e a URL da Imagem!", "error");
      return;
    }

    setIsSaving(true);
    try {
      await saveGalleryItem({
        id: editingItem ? editingItem.id : undefined,
        title: formTitle,
        client: formClient || "Cliente RaceBoy",
        specs: formSpecs || "PROJETO SOB MEDIDA",
        image: formImage,
        glowClass: formGlow
      });

      showToast(
        editingItem
          ? "Foto da galeria atualizada com sucesso!"
          : "Nova foto adicionada à galeria!"
      );
      setIsAddingNew(false);
      setEditingItem(null);
    } catch (err) {
      showToast("Erro ao salvar foto no banco. Verifique a conexão.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`Deseja realmente excluir a foto "${title}" da galeria?`)) return;

    try {
      await deleteGalleryItem(id);
      showToast(`Foto "${title}" removida com sucesso!`);
    } catch (err) {
      showToast("Erro ao excluir foto.", "error");
    }
  };

  // History Photo Handlers
  const openAddHistoryModal = () => {
    setEditingHistoryItem(null);
    setHistTitle("");
    setHistDesc("");
    setHistCategory("eventos");
    setHistYear(new Date().getFullYear().toString());
    setHistLocation("");
    setHistImage("");
    setIsAddingHistory(true);
  };

  const openEditHistoryModal = (photo: HistoryPhoto) => {
    setEditingHistoryItem(photo);
    setHistTitle(photo.title);
    setHistDesc(photo.description || "");
    setHistCategory(photo.category || "eventos");
    setHistYear(photo.year || "");
    setHistLocation(photo.location || "");
    setHistImage(photo.imageUrl);
    setIsAddingHistory(true);
  };

  const handleSaveHistoryPhotoItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!histTitle || !histImage) {
      showToast("Preencha ao menos o Título e a URL da Imagem!", "error");
      return;
    }

    setIsSaving(true);
    try {
      await saveHistoryPhoto({
        id: editingHistoryItem ? editingHistoryItem.id : undefined,
        title: histTitle,
        description: histDesc,
        category: histCategory,
        year: histYear,
        location: histLocation,
        imageUrl: histImage
      });

      showToast(
        editingHistoryItem
          ? "Foto de 35 Anos de História atualizada!"
          : "Nova foto adicionada a 35 Anos de História!"
      );
      setIsAddingHistory(false);
      setEditingHistoryItem(null);
    } catch (err) {
      showToast("Erro ao salvar foto histórica.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHistoryPhoto = async (id: string, title: string) => {
    if (!confirm(`Deseja realmente excluir a foto histórica "${title}"?`)) return;

    try {
      await deleteHistoryPhoto(id);
      showToast(`Foto "${title}" removida do acervo de 35 Anos de História!`);
    } catch (err) {
      showToast("Erro ao excluir foto histórica.", "error");
    }
  };

  const handleSaveSiteConfig = async () => {
    setIsSaving(true);
    try {
      const formattedVideo = formatYouTubeEmbedUrl(raceenVideoUrl);
      await saveSiteConfig({
        raceenImage,
        raceenVideoUrl: formattedVideo,
        mascotImage,
        adminPin: newPin || "1991"
      });
      setRaceenVideoUrl(formattedVideo);
      showToast("Configurações e fotos de destaques atualizadas!");
    } catch (err) {
      showToast("Erro ao salvar configurações do site.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (
      !confirm(
        "Tem certeza que deseja restaurar as fotos e mídias para os valores padrão de fábrica?"
      )
    )
      return;

    setIsSaving(true);
    try {
      await seedInitialData();
      showToast("Banco restaurado para o conteúdo inicial padrão!");
    } catch (err) {
      showToast("Erro ao restaurar dados padrão.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-5xl shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col max-h-[90vh] overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-neon-pink/10 border border-neon-pink/30 p-2 rounded-xl text-neon-pink">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-retro-title text-base sm:text-lg text-zinc-100 uppercase tracking-wide flex items-center gap-2">
                PAINEL ADMINISTRATIVO <span className="text-neon-pink text-xs font-retro-mono">RACEBOY</span>
              </h2>
              <p className="text-[11px] font-retro-mono text-zinc-400">
                Gerencie as fotos da galeria, acervo de 35 anos, mídias de destaque e senha
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white rounded-lg text-xs font-retro-mono transition-all cursor-pointer"
                title="Encerrar Sessão"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">SAIR</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {!isAuthenticated ? (
          /* LOGIN SCREEN */
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto gap-6">
            <div className="w-16 h-16 rounded-full bg-neon-pink/10 border border-neon-pink/40 flex items-center justify-center text-neon-pink box-glow-pink">
              <Key className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <h3 className="font-retro-title text-xl text-zinc-100 uppercase">
                ÁREA RESTRITA
              </h3>
              <p className="text-xs font-retro-mono text-zinc-400 mt-1">
                Digite a senha / PIN de administrador para acessar o gerenciador de fotos do site.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="PIN OU SENHA (Ex: 1991 ou raceboy35)"
                  className={`w-full bg-zinc-900/90 border ${
                    pinError ? "border-red-500 bg-red-950/20" : "border-zinc-700 focus:border-neon-pink"
                  } rounded-xl px-4 py-3 text-center text-zinc-100 font-retro-title text-base sm:text-lg tracking-widest outline-none transition-colors`}
                  autoFocus
                />
              </div>

              {pinError && (
                <span className="text-xs font-retro-mono text-red-400 flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> PIN incorreto. Dica: 1991 ou raceboy35
                </span>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-neon-pink hover:bg-[#ff1a8c] text-white font-retro-title text-xs tracking-wider uppercase rounded-xl transition-all box-glow-pink font-bold cursor-pointer"
              >
                ACESSAR PAINEL ADMIN
              </button>
            </form>

            <span className="text-[10px] font-retro-mono text-zinc-500">
              *Acesso exclusivo para administradores da RaceBoy.
            </span>
          </div>
        ) : (
          /* ADMIN DASHBOARD MAIN VIEW */
          <div className="flex flex-col flex-grow overflow-hidden">
            {/* Admin Tabs */}
            <div className="flex border-b border-zinc-800 bg-zinc-950 px-4 pt-2 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab("gallery")}
                className={`px-4 py-3 font-retro-title text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "gallery"
                    ? "border-neon-pink text-neon-pink bg-neon-pink/5 font-bold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Grid className="w-4 h-4" /> GALERIA DE FOTOS ({galleryItems.length})
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-3 font-retro-title text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "history"
                    ? "border-amber-400 text-amber-400 bg-amber-400/5 font-bold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <History className="w-4 h-4" /> 35 ANOS DE HISTÓRIA ({historyPhotos.length})
              </button>

              <button
                onClick={() => setActiveTab("featured")}
                className={`px-4 py-3 font-retro-title text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "featured"
                    ? "border-neon-blue text-neon-blue bg-neon-blue/5 font-bold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Tv className="w-4 h-4" /> MÍDIAS DE DESTAQUE & SLIDER
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-3 font-retro-title text-xs uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeTab === "settings"
                    ? "border-zinc-300 text-zinc-300 bg-zinc-800/20 font-bold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Settings className="w-4 h-4" /> CONFIGURAÇÕES & SENHA
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow space-y-6">
              {/* TAB 1: GALERIA DE FOTOS */}
              {activeTab === "gallery" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <div>
                      <h3 className="font-retro-title text-sm text-zinc-200 uppercase">
                        GERENCIAR FOTOS DA GALERIA DE PROJETOS
                      </h3>
                      <p className="text-xs font-retro-mono text-zinc-400 mt-0.5">
                        Adicione, edite ou remova os projetos exibidos no carrossel e na galeria principal do site.
                      </p>
                    </div>

                    <button
                      onClick={openAddModal}
                      className="px-4 py-2.5 bg-neon-pink hover:bg-[#ff1a8c] text-white font-retro-title text-xs tracking-wider rounded-xl uppercase transition-all box-glow-pink flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <Plus className="w-4 h-4" /> NOVA FOTO DA GALERIA
                    </button>
                  </div>

                  {/* Upload Image Helper Box */}
                  <div className="bg-zinc-900/30 border border-zinc-800/80 p-4 rounded-xl text-xs font-sans text-zinc-400 flex items-start gap-3">
                    <UploadCloud className="w-5 h-5 text-neon-blue flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-zinc-200 block font-retro-title text-xs mb-1">
                        COMO ADICIONAR NOVAS FOTOS DO SEU COMPUTADOR OU CELULAR:
                      </strong>
                      <span>
                        Você pode subir suas fotos para sites gratuitos como{" "}
                        <a
                          href="https://postimages.org/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-neon-blue underline font-bold"
                        >
                          PostImages.org
                        </a>{" "}
                        ou{" "}
                        <a
                          href="https://imgur.com/upload"
                          target="_blank"
                          rel="noreferrer"
                          className="text-neon-blue underline font-bold"
                        >
                          Imgur.com
                        </a>
                        , copiar o <strong>Link Direto da Imagem (.jpg, .png ou .webp)</strong> e colar no campo de URL. A foto aparecerá instantaneamente no site!
                      </span>
                    </div>
                  </div>

                  {/* List / Grid of Gallery Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition-all"
                      >
                        <div className="relative aspect-video overflow-hidden bg-black">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                          <div className="absolute top-2 right-2 flex gap-1.5 bg-black/80 backdrop-blur-md p-1 rounded-lg border border-zinc-800">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 bg-zinc-800 hover:bg-neon-blue text-zinc-300 hover:text-black rounded transition-colors cursor-pointer"
                              title="Editar Foto"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id, item.title)}
                              className="p-1.5 bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white rounded transition-colors cursor-pointer"
                              title="Excluir Foto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="p-3.5 flex flex-col gap-1">
                          <h4 className="font-retro-title text-xs text-zinc-100 truncate">
                            {item.title}
                          </h4>
                          <p className="text-[10px] font-retro-mono text-zinc-400 truncate">
                            {item.client}
                          </p>
                          <p className="text-[9px] font-retro-mono text-zinc-500 uppercase truncate">
                            {item.specs}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: RACEBOY 35 ANOS DE HISTÓRIA */}
              {activeTab === "history" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <div>
                      <h3 className="font-retro-title text-sm text-zinc-200 uppercase flex items-center gap-2">
                        <History className="w-4 h-4 text-amber-400" /> GERENCIAR FOTOS: 35 ANOS DE HISTÓRIA
                      </h3>
                      <p className="text-xs font-retro-mono text-zinc-400 mt-0.5">
                        Adicione, edite ou remova fotos do acervo histórico da Raceboy (1991 - 2026).
                      </p>
                    </div>

                    <button
                      onClick={openAddHistoryModal}
                      className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-retro-title text-xs tracking-wider rounded-xl uppercase transition-all shadow-[0_0_15px_rgba(255,191,0,0.3)] flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <Plus className="w-4 h-4" /> NOVA FOTO HISTÓRICA
                    </button>
                  </div>

                  {/* Upload Image Helper Box */}
                  <div className="bg-zinc-900/30 border border-zinc-800/80 p-4 rounded-xl text-xs font-sans text-zinc-400 flex items-start gap-3">
                    <UploadCloud className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-zinc-200 block font-retro-title text-xs mb-1">
                        COMO ENVIAR FOTOS HISTÓRICAS DO SEU COMPUTADOR OU CELULAR:
                      </strong>
                      <span>
                        Envie suas fotos para um serviço de hospedagem como{" "}
                        <a
                          href="https://postimages.org/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 underline font-bold"
                        >
                          PostImages.org
                        </a>{" "}
                        ou{" "}
                        <a
                          href="https://imgur.com/upload"
                          target="_blank"
                          rel="noreferrer"
                          className="text-amber-400 underline font-bold"
                        >
                          Imgur.com
                        </a>
                        , copie o <strong>Link Direto da Imagem (.jpg, .png ou .webp)</strong> e cole no formulário.
                      </span>
                    </div>
                  </div>

                  {/* Filter Categories */}
                  <div className="flex flex-wrap gap-2 items-center bg-zinc-900/30 p-2 rounded-xl border border-zinc-800">
                    <span className="text-[11px] font-retro-mono text-zinc-400 uppercase px-2">Filtro:</span>
                    {[
                      { id: "todos", label: "Todas as Fotos" },
                      { id: "eventos", label: "Eventos & Campeonatos" },
                      { id: "particulares", label: "Pistas Particulares" },
                      { id: "comerciais", label: "Pistas Comerciais" },
                      { id: "momentos", label: "Momentos Históricos" }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setHistFilterCategory(cat.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-retro-mono transition-all cursor-pointer ${
                          histFilterCategory === cat.id
                            ? "bg-amber-400 text-black font-bold"
                            : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* History Photos Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {historyPhotos
                      .filter(
                        (p) => histFilterCategory === "todos" || p.category === histFilterCategory
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition-all"
                        >
                          <div className="relative aspect-video overflow-hidden bg-black">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80";
                              }}
                            />
                            {item.year && (
                              <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-retro-title text-amber-400 border border-amber-400/30">
                                {item.year}
                              </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-1.5 bg-black/80 backdrop-blur-md p-1 rounded-lg border border-zinc-800">
                              <button
                                onClick={() => openEditHistoryModal(item)}
                                className="p-1.5 bg-zinc-800 hover:bg-amber-400 text-zinc-300 hover:text-black rounded transition-colors cursor-pointer"
                                title="Editar Foto Histórica"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteHistoryPhoto(item.id, item.title)}
                                className="p-1.5 bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white rounded transition-colors cursor-pointer"
                                title="Excluir Foto Histórica"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="p-3.5 flex flex-col gap-1.5">
                            <h4 className="font-retro-title text-xs text-zinc-100 truncate">
                              {item.title}
                            </h4>
                            {item.location && (
                              <p className="text-[10px] font-retro-mono text-zinc-400 truncate flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" /> {item.location}
                              </p>
                            )}
                            <p className="text-[11px] font-sans text-zinc-400 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 3: MÍDIAS DE DESTAQUE */}
              {activeTab === "featured" && (
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <h3 className="font-retro-title text-sm text-zinc-200 uppercase">
                      ALTERAR FOTOS E MÍDIAS DOS DESTAQUES DO SITE
                    </h3>
                    <p className="text-xs font-retro-mono text-zinc-400 mt-0.5">
                      Atualize a foto da Pista Raceen Locação, o vídeo demonstrativo ou o mascote.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Raceen Image Card */}
                    <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-4">
                      <h4 className="font-retro-title text-xs text-neon-blue uppercase flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Foto da Pista Raceen Locação
                      </h4>

                      <div className="aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800">
                        <img
                          src={raceenImage}
                          alt="Preview Raceen"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1.5 uppercase">
                          URL da Foto Principal da Raceen:
                        </label>
                        <input
                          type="text"
                          value={raceenImage}
                          onChange={(e) => setRaceenImage(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-neon-blue"
                        />
                      </div>
                    </div>

                    {/* Raceen Video Card */}
                    <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-4">
                      <h4 className="font-retro-title text-xs text-neon-pink uppercase flex items-center gap-2">
                        <Tv className="w-4 h-4" /> Link do Vídeo de Apresentação
                      </h4>

                      <div className="aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center p-2 text-center text-xs font-retro-mono text-zinc-500">
                        {raceenVideoUrl ? (
                          <iframe
                            className="w-full h-full rounded"
                            src={formatYouTubeEmbedUrl(raceenVideoUrl)}
                            title="Preview Video"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          "Cole o link embed do YouTube"
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1.5 uppercase">
                          URL Embed do YouTube:
                        </label>
                        <input
                          type="text"
                          value={raceenVideoUrl}
                          onChange={(e) => setRaceenVideoUrl(e.target.value)}
                          placeholder="https://www.youtube.com/embed/..."
                          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none focus:border-neon-pink"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveSiteConfig}
                      disabled={isSaving}
                      className="px-6 py-3 bg-neon-green hover:bg-[#46ff2e] text-black font-retro-title text-xs tracking-wider rounded-xl font-bold uppercase transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] cursor-pointer"
                    >
                      {isSaving ? "SALVANDO..." : "SALVAR ALTERAÇÕES DE MÍDIA"}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: CONFIGURAÇÕES & RESTAURAR */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <h3 className="font-retro-title text-sm text-zinc-200 uppercase">
                      CONFIGURAÇÕES DE SEGURANÇA E BANCO DE DADOS
                    </h3>
                    <p className="text-xs font-retro-mono text-zinc-400 mt-0.5">
                      Altere sua senha de acesso ou restaure as fotos originais do site.
                    </p>
                  </div>

                  {/* Change PIN Box */}
                  <div className="bg-zinc-900/70 border border-zinc-800 p-5 rounded-2xl space-y-4 max-w-md">
                    <h4 className="font-retro-title text-xs text-amber-400 uppercase flex items-center gap-2">
                      <Key className="w-4 h-4" /> Alterar Senha / PIN do Admin
                    </h4>

                    <div>
                      <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1.5 uppercase">
                        Nova Senha / PIN de Acesso:
                      </label>
                      <input
                        type="text"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 font-retro-title tracking-wider outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      onClick={handleSaveSiteConfig}
                      disabled={isSaving}
                      className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-retro-title text-xs tracking-wider rounded-lg font-bold uppercase transition-all cursor-pointer"
                    >
                      {isSaving ? "SALVANDO..." : "ATUALIZAR SENHA"}
                    </button>
                  </div>

                  {/* Reset Database Box */}
                  <div className="bg-red-950/20 border border-red-900/40 p-5 rounded-2xl space-y-3">
                    <h4 className="font-retro-title text-xs text-red-400 uppercase flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" /> Restaurar Conteúdo Padrão do Site
                    </h4>
                    <p className="text-xs font-sans text-zinc-400">
                      Caso queira resetar as fotos da galeria e do acervo histórico para o catálogo inicial da fábrica, clique no botão abaixo.
                    </p>

                    <button
                      onClick={handleResetToDefaults}
                      disabled={isSaving}
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-retro-title text-xs tracking-wider rounded-lg uppercase transition-all cursor-pointer"
                    >
                      RESTAURAR FOTOS PADRÃO
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* SUB-MODAL: ADD / EDIT GALLERY ITEM */}
      <AnimatePresence>
        {isAddingNew && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h3 className="font-retro-title text-sm text-zinc-100 uppercase">
                  {editingItem ? "EDITAR FOTO DA GALERIA" : "ADICIONAR NOVA FOTO DA GALERIA"}
                </h3>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveGalleryItem} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1 uppercase">
                    Título da Foto / Projeto:
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ex: MÁXIMO DETALHE OU PISTA COPA"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-neon-pink"
                    required
                  />
                </div>

                {/* Client / City */}
                <div>
                  <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1 uppercase">
                    Cliente / Cidade:
                  </label>
                  <input
                    type="text"
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="Ex: Carlos M. (PR) ou São Paulo - SP"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-neon-pink"
                  />
                </div>

                {/* Specifications */}
                <div>
                  <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1 uppercase">
                    Especificações Técnicas:
                  </label>
                  <input
                    type="text"
                    value={formSpecs}
                    onChange={(e) => setFormSpecs(e.target.value)}
                    placeholder="Ex: PROJETO: CUSTOM SPA | 6 FENDAS"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-neon-pink"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1 uppercase">
                    URL da Imagem (.jpg / .png / .webp):
                  </label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://i.postimg.cc/.../foto.jpg"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-neon-pink"
                    required
                  />
                </div>

                {/* Live Image Preview */}
                {formImage && (
                  <div className="bg-black border border-zinc-800 rounded-lg p-2 text-center">
                    <span className="text-[10px] font-retro-mono text-zinc-500 block mb-1">
                      PRÉ-VISUALIZAÇÃO DA FOTO:
                    </span>
                    <img
                      src={formImage}
                      alt="Preview"
                      className="max-h-36 mx-auto rounded object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                )}

                {/* Glow Style Selection */}
                <div>
                  <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1.5 uppercase">
                    Cor da Borda Neon:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {GLOW_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormGlow(opt.value)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-retro-mono flex items-center gap-1.5 cursor-pointer transition-all ${
                          formGlow === opt.value
                            ? "bg-zinc-800 border-white text-white font-bold"
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: opt.color }}
                        />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingNew(false)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-retro-title text-xs rounded-lg uppercase cursor-pointer"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-neon-pink hover:bg-[#ff1a8c] text-white font-retro-title text-xs tracking-wider rounded-lg uppercase font-bold transition-all box-glow-pink cursor-pointer"
                  >
                    {isSaving ? "SALVANDO..." : "SALVAR FOTO"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUB-MODAL: ADD / EDIT HISTORY PHOTO */}
      <AnimatePresence>
        {isAddingHistory && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                <h3 className="font-retro-title text-sm text-amber-400 uppercase flex items-center gap-2">
                  <History className="w-4 h-4" />
                  {editingHistoryItem ? "EDITAR FOTO HISTÓRICA" : "ADICIONAR FOTO HISTÓRICA"}
                </h3>
                <button
                  onClick={() => setIsAddingHistory(false)}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveHistoryPhotoItem} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1 uppercase">
                    Título da Foto / Evento:
                  </label>
                  <input
                    type="text"
                    value={histTitle}
                    onChange={(e) => setHistTitle(e.target.value)}
                    placeholder="Ex: Campeonato Paulista de Slot Car 1994"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Year */}
                  <div>
                    <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1 uppercase">
                      Ano:
                    </label>
                    <input
                      type="text"
                      value={histYear}
                      onChange={(e) => setHistYear(e.target.value)}
                      placeholder="Ex: 1994"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1 uppercase">
                      Cidade / Local:
                    </label>
                    <input
                      type="text"
                      value={histLocation}
                      onChange={(e) => setHistLocation(e.target.value)}
                      placeholder="Ex: São Paulo, SP"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1 uppercase">
                    Categoria:
                  </label>
                  <select
                    value={histCategory}
                    onChange={(e) => setHistCategory(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="eventos">Eventos & Campeonatos</option>
                    <option value="particulares">Circuitos Particulares</option>
                    <option value="comerciais">Pistas Comerciais</option>
                    <option value="momentos">Momentos Históricos</option>
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1 uppercase">
                    URL da Imagem (.jpg / .png / .webp):
                  </label>
                  <input
                    type="url"
                    value={histImage}
                    onChange={(e) => setHistImage(e.target.value)}
                    placeholder="https://i.postimg.cc/.../foto.jpg"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-400"
                    required
                  />
                </div>

                {/* Live Image Preview */}
                {histImage && (
                  <div className="bg-black border border-zinc-800 rounded-lg p-2 text-center">
                    <span className="text-[10px] font-retro-mono text-zinc-500 block mb-1">
                      PRÉ-VISUALIZAÇÃO DA FOTO HISTÓRICA:
                    </span>
                    <img
                      src={histImage}
                      alt="Preview"
                      className="max-h-36 mx-auto rounded object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-retro-mono text-zinc-400 mb-1 uppercase">
                    Descrição Detalhada:
                  </label>
                  <textarea
                    rows={3}
                    value={histDesc}
                    onChange={(e) => setHistDesc(e.target.value)}
                    placeholder="Conte a história por trás desta imagem..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingHistory(false)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-retro-title text-xs rounded-lg uppercase cursor-pointer"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-black font-retro-title text-xs tracking-wider rounded-lg uppercase font-bold transition-all shadow-[0_0_15px_rgba(255,191,0,0.3)] cursor-pointer"
                  >
                    {isSaving ? "SALVANDO..." : "SALVAR FOTO"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
