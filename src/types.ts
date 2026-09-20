export interface HistoryPhoto {
  id: string;
  title: string;
  description: string;
  category: "eventos" | "particulares" | "comerciais" | "momentos";
  imageUrl: string;
  year?: string;
  location?: string;
  createdAt?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  client: string;
  specs: string;
  image: string;
  glowClass?: string;
  order?: number;
}

export interface SiteConfig {
  raceenImage: string;
  raceenVideoUrl: string;
  mascotImage: string;
  logoImage: string;
  adminPin: string;
}

export const DEFAULT_HISTORY_PHOTOS: HistoryPhoto[] = [
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
    title: "Raceboy Ferrari Santander",
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

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "MÁXIMO DETALHE",
    client: "Carlos M. (PR)",
    specs: "PROJETO: CUSTOM SPA | 6 FENDAS",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-pink hover:shadow-[0_0_20px_rgba(255,0,127,0.4)]",
    order: 1
  },
  {
    id: "gal-2",
    title: "SÉRIE NOTURNA",
    client: "Julio C. (SP)",
    specs: "SÉRIE ESPECIAL LEDS | 4 FENDAS",
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-blue hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]",
    order: 2
  },
  {
    id: "gal-3",
    title: "TRAÇÃO ABSOLUTA",
    client: "Renato G. (RS)",
    specs: "REVESTIMENTO EMBORRACHADO | 2 FENDAS",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-red hover:shadow-[0_0_20px_rgba(255,30,39,0.4)]",
    order: 3
  },
  {
    id: "gal-4",
    title: "CONTROLE INTEGRADO",
    client: "Marcelo A. (RJ)",
    specs: "PAINEL RACEBOY | TELEMETRIA",
    image: "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-green hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]",
    order: 4
  },
  {
    id: "gal-5",
    title: "TRAÇADO ELETRÔNICO",
    client: "Fabricio S. (MG)",
    specs: "PROJETO COMPACTO RESIDENCIAL",
    image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-yellow hover:shadow-[0_0_20px_rgba(255,240,31,0.4)]",
    order: 5
  },
  {
    id: "gal-6",
    title: "ESCALA DE PRECISÃO",
    client: "Bruno K. (SC)",
    specs: "PISTA DE RALLY | CURVAS COMPENSADAS",
    image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80",
    glowClass: "border-glow-pink hover:shadow-[0_0_20px_rgba(255,0,127,0.4)]",
    order: 6
  }
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  raceenImage: "https://i.postimg.cc/yYk8N2GS/raceen-2jogadores-1200px.webp",
  raceenVideoUrl: "https://www.youtube.com/embed/dOQ-Gn30DrY?autoplay=0&mute=1&loop=1&playlist=dOQ-Gn30DrY",
  mascotImage: "https://i.postimg.cc/MGgBg9kP/raceboy-mascote-transp-web-252px.webp",
  logoImage: "https://i.postimg.cc/FsVm3y64/raceboy-logo-transp-870px.png",
  adminPin: "1991"
};

export function formatYouTubeEmbedUrl(url?: string): string {
  if (!url) return "https://www.youtube.com/embed/dOQ-Gn30DrY?autoplay=0&mute=1&loop=1&playlist=dOQ-Gn30DrY";
  if (url.includes("youtube.com/embed/")) {
    if (!url.includes("playlist=")) {
      const match = url.match(/embed\/([\w-]{11})/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=0&mute=1&loop=1&playlist=${match[1]}`;
      }
    }
    return url;
  }
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=0&mute=1&loop=1&playlist=${match[1]}`;
  }
  return url;
}

