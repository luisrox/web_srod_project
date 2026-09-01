import { z } from "zod";

import {
  kitItemSchema,
  pickItemSchema,
  projectSchema,
  siteSettingsSchema,
} from "@/domain/schemas";
import { CURRENT_SHOP_URL } from "@/lib/shop";

/**
 * Placeholders de lanzamiento. Srod sustituye copy, stills y videos en CMS.
 *
 * IDs de YouTube dummy (formato real de 11 caracteres; no son videos de @srodmode):
 * - lookbook-verano-casco  → srodLookbk1
 * - comercial-cafe-boquete → srodCafeCom
 * - spot-reloj-nocturno    → srodRelojNt
 * - campana-marca-ciudad   → srodCiudad1
 * - retrato-estudio-blanco → srodEstudio
 *
 * shopUrl apunta al sitio actual de presets (Squarespace), no a una ruta nueva.
 * Instagram: perfil profesional; se confirma en CMS si el handle cambia.
 * extraSocials: TikTok público de https://www.liinks.co/srodalmenara.
 * Retrato, fotos de kit y thumbs de /recomendados salen de ese mismo Liinks
 * (no son placeholders SVG).
 * shopUrl de cada pieza de kit: Amazon afiliado del Liinks, si existe.
 * Picks: URLs de afiliado que pidió Srod; las fotos son las del Liinks.
 * heroYoutubeVideoId dummy: srodHeroVid (reserva si el RSS del canal falla;
 * con feed ok, el hero usa el último video publicado).
 */

export const siteSettingsFixture = {
  heroTitle: "Un DP bien geek que hace videos en YouTube",
  heroSubtitle: "Cámaras, lentes y color para marcas y productoras.",
  heroYoutubeVideoId: "srodHeroVid",
  contactEmail: "srod@srodalmenara.com",
  youtubeUrl: "https://www.youtube.com/c/srodmode",
  /** Canal público @srodmode; el RSS de Home usa este UC, no un id en el componente. */
  youtubeChannelId: "UC0JZGMS9SBmv3fPVSqZh4zQ",
  instagramUrl: "https://www.instagram.com/srodalmenara/",
  extraSocials: [
    { label: "TikTok", url: "https://www.tiktok.com/@srodalmenara" },
  ],
  youtubeFeedCount: 6,
  whereaboutsText: "",
  availabilityNote:
    "Basado en Panamá, con disponibilidad remota e internacional.",
  shopUrl: CURRENT_SHOP_URL,
  featuredProjectSlugs: [
    "spot-reloj-nocturno",
    "lookbook-verano-casco",
    "comercial-cafe-boquete",
  ],
  kitTeaserIds: ["sony-fx3", "sony-50gm", "sony-70-200"],
  aboutExcerpt:
    "Director de fotografía y creador: el mismo ojo en el set y en el canal.",
  aboutBody: [
    "Srod Almenara es director de fotografía. Este laboratorio público muestra el oficio: cases con ficha, el kit con el porqué, y el canal como cuaderno de proceso —no una tarjeta de visita ni un recapitulador de specs.",
    "Trabaja desde Panamá, con disponibilidad remota e internacional. El set puede ser un estudio, una finca o una calle; el criterio de imagen no cambia.",
    "El geek es método: qué lente, qué luz y qué curva de color resuelven el brief. Quien entra por YouTube @srodmode reconoce el mismo ojo; quien contrata, un DP.",
    "El trabajo es para marcas, productoras y fotógrafos que quieren un par en cámara. No es un reel de drones ni un look de agencia.",
    "La música es parte de quién es —otro canal, otra disciplina— y se queda ahí: una mención, no una galería.",
  ].join("\n\n"),
  portrait: "/media/srod-portrait.jpg",
} satisfies z.input<typeof siteSettingsSchema>;

export const projectFixtures = [
  {
    title: "Lookbook verano en Casco",
    slug: "lookbook-verano-casco",
    client: "Casa Textil",
    role: "Director de fotografía",
    year: 2025,
    youtubeVideoId: "srodLookbk1",
    stills: [
      {
        src: "/placeholders/lookbook-verano-1.svg",
        alt: "Modelo recortada contra un muro de cal en Casco Viejo, tela en movimiento",
      },
      {
        src: "/placeholders/lookbook-verano-2.svg",
        alt: "Detalle de textura de cal y tejido a contraluz de tarde",
      },
    ],
    summary:
      "Un lookbook de día en Casco Viejo: calor, cal y tela en movimiento. El brief pedía piel creíble y un color que no se pelee con la arquitectura.",
    order: 1,
    featured: true,
    camera: "Sony FX3",
    lenses: "Sigma 35mm f/1.4 Art, Sony FE 50mm f/1.2 GM",
    lighting:
      "Negativo fill y bounce; el sol de las 16h como key, sin HMI.",
    look: "Negativo suave, piel por encima del muro. Cero teal-and-orange.",
    whyNotes:
      "El Casco ya es paleta. Si empujas el grade, la cal se vuelve plástico.",
    extraBlocks: [
      {
        title: "Por qué no hay dron",
        body: "El brief era escala humana: tela, cal, paso. Un dron convierte el lookbook en turismo.",
      },
    ],
  },
  {
    title: "Comercial café de altura",
    slug: "comercial-cafe-boquete",
    client: "Finca La Estrella",
    role: "DP y color",
    year: 2024,
    youtubeVideoId: "srodCafeCom",
    stills: [
      {
        src: "/placeholders/cafe-boquete-1.svg",
        alt: "Manos seleccionando grano de café en un cafetal de Boquete",
      },
      {
        src: "/placeholders/cafe-boquete-2.svg",
        alt: "Taza de café de altura sobre madera, vapor visible, luz de mañana",
      },
    ],
    summary:
      "Treinta segundos de cosecha y taza. El producto es el proceso: manos, vapor, grano; no un logo sobre un landscape.",
    order: 2,
    featured: true,
    camera: "Sony FX3",
    lenses: "Sony FE 24-70mm f/2.8 GM II, Sigma 65mm f/2 DG DN",
    lighting:
      "Aputure 600c a través de diffusion; fill con blanco sucio para no aplanar el verde del cafetal.",
    look: "Cálido contenido. El café tiene que verse tostado, no naranja de catálogo.",
    whyNotes:
      "Filmamos la taza a la misma hora que la cosecha para que el color de la luz coincida, no para el making-of.",
  },
  {
    title: "Spot reloj nocturno",
    slug: "spot-reloj-nocturno",
    client: "Taller Bruma",
    role: "Director de fotografía",
    year: 2025,
    youtubeVideoId: "srodRelojNt",
    stills: [
      {
        src: "/placeholders/reloj-nocturno-1.svg",
        alt: "Reloj sobre mesa oscura, bisel recortado por un grid de luz",
      },
      {
        src: "/placeholders/reloj-nocturno-2.svg",
        alt: "Ventana nocturna desenfocada detrás del producto, skyline apenas leído",
      },
    ],
    summary:
      "Un reloj en una mesa, una ciudad apagada detrás. El metal tiene que pesar; el night exterior, no tragarse el producto.",
    order: 3,
    featured: true,
    camera: "Sony FX3",
    lenses: "Sony FE 90mm f/2.8 Macro G OSS, Sigma 35mm f/1.4 Art",
    lighting:
      "Un 600c en grid para el bisel; spill controlado para no rellenar la ventana.",
    look: "Contraste alto, highlights del metal intactos. No hay haze de perfume.",
    whyNotes:
      "El reloj es el sujeto. Si el skyline compite, recorto, no subo ISO.",
    codec: "XAVC HS 4K",
    pipeline: "Proxy en set, grade en DaVinci con LUT de monitor de referencia.",
  },
  {
    title: "Campaña marca ciudad",
    slug: "campana-marca-ciudad",
    client: "Oficina de Turismo de Panamá",
    role: "Dirección de fotografía",
    year: 2023,
    youtubeVideoId: "srodCiudad1",
    stills: [
      {
        src: "/placeholders/marca-ciudad-1.svg",
        alt: "Peatón cruzando una calle de la ciudad a mediodía, recorte duro",
      },
      {
        src: "/placeholders/marca-ciudad-2.svg",
        alt: "Interior público con un tubo de luz apenas marcando los ojos",
      },
    ],
    summary:
      "Gente real, calles reales, sin stock de postcard. El encargo era que una productora viera oficio, no un reel de drones.",
    order: 4,
    camera: "Sony FX6 y Sony FX3",
    lenses: "Sony FE 24-70mm f/2.8 GM II, Sigma 35mm f/1.4 Art",
    lighting: "Disponible más un tubo para ojos en interiores públicos.",
    look: "Cine de mediodía: recorte, no filtro vintage.",
    whyNotes:
      "Turismo ya tiene el postcard. Aquí el DP aporta criterio de encuadre y de cuándo no mover la cámara.",
  },
  {
    title: "Retratos Estudio Blanco",
    slug: "retrato-estudio-blanco",
    client: "Estudio Blanco",
    role: "Director de fotografía",
    year: 2024,
    youtubeVideoId: "srodEstudio",
    stills: [
      {
        src: "/placeholders/estudio-blanco-1.svg",
        alt: "Retrato de estudio sobre fondo claro, piel sin drama",
      },
    ],
    summary:
      "Una serie de retratos para el book del estudio: fondo claro, piel sin drama, el mismo criterio de galería que el resto del laboratorio.",
    order: 5,
  },
] satisfies z.input<typeof projectSchema>[];

export const kitItemFixtures = [
  {
    id: "sony-fx3",
    name: "Sony FX3",
    photo: "/media/kit-sony-fx3.jpg",
    usageNote:
      "Mi cámara principal. Cuerpo chico, latitud de verdad: resuelve encargos y los videos del canal.",
    shopUrl: "https://amzn.to/3nfJT5O",
    order: 1,
  },
  {
    id: "sony-a7rv",
    name: "Sony α7R V",
    photo: "/media/kit-sony-a7rv.jpg",
    usageNote:
      "Mi cámara de fotos. Cuando el encargo pide stills con el mismo ojo que el video.",
    shopUrl: "https://amzn.to/3LTcmZc",
    order: 2,
  },
  {
    id: "dzofilm-vespid-40",
    name: "DZOFILM Vespid Prime 40mm T2.1",
    photo: "/media/kit-dzofilm-vespid-40.jpg",
    usageNote:
      "Lente de cine. El 40 para cuando el look tiene que leerse de cine, no de foto.",
    shopUrl: "https://amzn.to/3D8ty7x",
    order: 3,
  },
  {
    id: "sony-50gm",
    name: "Sony FE 50mm F1.2 GM",
    photo: "/media/kit-sony-50gm.jpg",
    usageNote:
      "Mi lente favorito. Conversación, retrato, producto a escala humana.",
    shopUrl: "https://amzn.to/3ZdD16d",
    order: 4,
  },
  {
    id: "sony-70-200",
    name: "Sony FE 70-200mm F2.8 GM OSS II",
    photo: "/media/kit-sony-70-200.jpg",
    usageNote:
      "El zoom que lo hace todo. Cuando el set no espera a que cambie el prime.",
    shopUrl: "https://amzn.to/44xWm5m",
    order: 5,
  },
  {
    id: "lg-dualup",
    name: "Monitor LG DualUP",
    photo: "/media/kit-lg-dualup.jpg",
    usageNote:
      "El raro monitor que recomiendo: más superficie para ver el grado, no el EVF.",
    shopUrl: "https://amzn.to/48qSN3r",
    order: 6,
  },
  {
    id: "zoom-f6",
    name: "Zoom F6",
    usageNote:
      "Audio limpio cuando no hay mixer. Si el diálogo no se entiende, la imagen no salva el spot.",
    order: 7,
  },
] satisfies z.input<typeof kitItemSchema>[];

export const pickItemFixtures = [
  {
    id: "freewell-brandon-li",
    name: "Brandon Li x Freewell VND/CPL",
    photo: "/media/pick-freewell.jpg",
    note: "Kit de filtros de la tienda oficial, con el enlace de afiliado de Srod.",
    url: "https://freewellgear.com/collections/brandonli-freewell-vnd-cpl-series?sca_ref=12155128.kl57JzqWrGyThgm",
    cta: "Ver en Freewell",
    order: 1,
  },
  {
    id: "money-shot-club",
    name: "Money Shot Club",
    photo: "/media/pick-moneyshot.jpg",
    note: "La comunidad de Srod Almenara y David Ruiz para vivir de la cámara.",
    url: "https://www.skool.com/moneyshotclub/about",
    cta: "Entrar al club",
    order: 2,
  },
  {
    id: "arc-pulse",
    name: "Arc Pulse",
    photo: "/media/pick-arc.png",
    note: "Fundas de aluminio; el enlace de Srod lleva el 10% de descuento.",
    url: "https://arc.cc/?sca_ref=11509078.FhE0FU5sEw",
    cta: "Ver en Arc",
    order: 3,
  },
  {
    id: "artlist",
    name: "Artlist",
    photo: "/media/pick-artlist.png",
    note: "Música y assets para video: dos meses extra gratis con este enlace.",
    url: "https://bit.ly/ArtlistSrodMode",
    cta: "Probar Artlist",
    order: 4,
  },
] satisfies z.input<typeof pickItemSchema>[];
