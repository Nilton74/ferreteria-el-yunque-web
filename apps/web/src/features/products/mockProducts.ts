export interface Categoria {
  id: string
  nombre: string
  slug: string
  emoji: string
}

export interface Especificacion {
  clave: string
  valor: string
}

export interface Producto {
  id: string
  sku: string
  nombre: string
  slug: string
  descripcion: string
  descripcionLarga: string
  categoria: string
  marca: string
  precio: number
  precioPromo?: number
  stock: number
  stockMinimo: number
  imagenes: string[]
  especificaciones: Especificacion[]
  destacado?: boolean
  nuevo?: boolean
  rating: number
  reviews: number
}

export const CATEGORIAS: Categoria[] = [
  { id: '1', nombre: 'Herramientas',  slug: 'herramientas',  emoji: 'ðŸ”§' },
  { id: '2', nombre: 'Electricidad',  slug: 'electricidad',  emoji: 'âš¡' },
  { id: '3', nombre: 'PlomerÃ­a',      slug: 'plomeria',      emoji: 'ðŸš¿' },
  { id: '4', nombre: 'ConstrucciÃ³n',  slug: 'construccion',  emoji: 'ðŸ§±' },
  { id: '5', nombre: 'Pinturas',      slug: 'pinturas',      emoji: 'ðŸŽ¨' },
  { id: '6', nombre: 'TornillerÃ­a',   slug: 'tornilleria',   emoji: 'ðŸ”©' },
  { id: '7', nombre: 'Seguridad',     slug: 'seguridad',     emoji: 'ðŸ¦º' },
  { id: '8', nombre: 'JardinerÃ­a',    slug: 'jardineria',    emoji: 'ðŸŒ±' },
  { id: '9', nombre: 'Adhesivos',     slug: 'adhesivos',     emoji: 'ðŸ§´' },
  { id: '10', nombre: 'Equipos',      slug: 'equipos',       emoji: 'ðŸ› ï¸' },
]

export const MARCAS = [
  'Bosch', 'Makita', 'Stanley', 'DeWalt', 'Truper', 'Philips', '3M', 'Sika',
]

export const PRODUCTOS: Producto[] = [
  {
    id: 'p1',
    sku: 'BOS-TP-001',
    nombre: 'Taladro Percutor Bosch 800W',
    slug: 'taladro-percutor-bosch-800w',
    descripcion: 'Taladro percutor con velocidad variable y portabrocas de 13 mm.',
    descripcionLarga:
      'El Taladro Percutor Bosch 800W es la herramienta ideal para taladrar en mamposterÃ­a, madera y metal. Cuenta con motor de 800W de alta potencia, velocidad variable y funciÃ³n percusiÃ³n. Su diseÃ±o ergonÃ³mico con empuÃ±adura Softgrip reduce la fatiga en trabajos prolongados. Incluye maletÃ­n de transporte y empuÃ±adura auxiliar.',
    categoria: 'herramientas',
    marca: 'Bosch',
    precio: 129.9,
    precioPromo: 99.9,
    stock: 18,
    stockMinimo: 5,
    imagenes: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=800&fit=crop',
    ],
    especificaciones: [
      { clave: 'Potencia',     valor: '800 W' },
      { clave: 'Velocidad',    valor: '0 - 3.000 rpm' },
      { clave: 'Portabrocas',  valor: '13 mm' },
      { clave: 'PercusiÃ³n',    valor: '0 - 48.000 bpm' },
      { clave: 'Peso',         valor: '2,2 kg' },
      { clave: 'GarantÃ­a',     valor: '2 aÃ±os' },
      { clave: 'Voltaje',      valor: '230 V' },
      { clave: 'Incluye',      valor: 'MaletÃ­n + empuÃ±adura auxiliar' },
    ],
    destacado: true,
    rating: 4.8,
    reviews: 127,
  },
  {
    id: 'p2',
    sku: 'MAK-AM-002',
    nombre: 'Amoladora Angular Makita 720W',
    slug: 'amoladora-angular-makita-720w',
    descripcion: 'Amoladora compacta ideal para corte y desbaste en obra.',
    descripcionLarga:
      'Amoladora angular Makita de 720W con disco de 115 mm. Ideal para cortar metal, desbastar soldaduras y trabajar en espacios reducidos. Carcasa compacta y empuÃ±adura lateral para mayor control.',
    categoria: 'herramientas',
    marca: 'Makita',
    precio: 89.5,
    stock: 12,
    stockMinimo: 4,
    imagenes: [
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=800&h=800&fit=crop',
    ],
    especificaciones: [
      { clave: 'Potencia',   valor: '720 W' },
      { clave: 'Disco',      valor: '115 mm' },
      { clave: 'Velocidad',  valor: '11.000 rpm' },
      { clave: 'Peso',       valor: '1,8 kg' },
      { clave: 'GarantÃ­a',   valor: '2 aÃ±os' },
    ],
    destacado: true,
    rating: 4.6,
    reviews: 84,
  },
  {
    id: 'p3',
    sku: 'DEW-TAL-003',
    nombre: 'Taladro InalÃ¡mbrico DeWalt 20V',
    slug: 'taladro-inalambrico-dewalt-20v',
    descripcion: 'Taladro atornillador con baterÃ­a de litio y cargador rÃ¡pido.',
    descripcionLarga:
      'Taladro atornillador DeWalt 20V MAX con motor brushless de alto rendimiento. Incluye 2 baterÃ­as de litio, cargador rÃ¡pido y maletÃ­n resistente. Ideal para trabajos profesionales.',
    categoria: 'herramientas',
    marca: 'DeWalt',
    precio: 189.0,
    precioPromo: 159.0,
    stock: 7,
    stockMinimo: 3,
    imagenes: [
      'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=800&fit=crop',
    ],
    especificaciones: [
      { clave: 'Voltaje',       valor: '20 V' },
      { clave: 'Motor',         valor: 'Brushless' },
      { clave: 'Par mÃ¡ximo',    valor: '65 Nm' },
      { clave: 'Portabrocas',   valor: '13 mm' },
      { clave: 'BaterÃ­a',       valor: '2x 2.0 Ah Li-ion' },
      { clave: 'Peso',          valor: '1,5 kg' },
    ],
    destacado: true,
    nuevo: true,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 'p4',
    sku: 'STA-CAJ-004',
    nombre: 'Caja de Herramientas Stanley 19"',
    slug: 'caja-herramientas-stanley-19',
    descripcion: 'Caja metÃ¡lica con organizador interior y cierre reforzado.',
    descripcionLarga:
      'Caja de herramientas Stanley de 19 pulgadas fabricada en metal lacado. Incluye bandeja organizadora interior y cierre metÃ¡lico reforzado. Capacidad para herramientas de mano profesionales.',
    categoria: 'herramientas',
    marca: 'Stanley',
    precio: 45.9,
    stock: 25,
    stockMinimo: 6,
    imagenes: [
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=800&fit=crop',
    ],
    especificaciones: [
      { clave: 'Material',  valor: 'Acero lacado' },
      { clave: 'TamaÃ±o',    valor: '19 pulgadas' },
      { clave: 'Bandejas',  valor: '1 interior' },
      { clave: 'Peso',      valor: '2,4 kg' },
    ],
    destacado: true,
    rating: 4.4,
    reviews: 56,
  },
  {
    id: 'p5',
    sku: 'PHI-BOM-005',
    nombre: 'Bombilla LED Philips 9W E27',
    slug: 'bombilla-led-philips-9w',
    descripcion: 'Luz cÃ¡lida de bajo consumo, 15.000 horas de vida Ãºtil.',
    descripcionLarga:
      'Bombilla LED Philips de 9W con rosca E27. Emite luz cÃ¡lida de 2.700K. Bajo consumo, encendido instantÃ¡neo y 15.000 horas de vida Ãºtil. Ahorra hasta un 85% respecto a bombillas incandescentes.',
    categoria: 'electricidad',
    marca: 'Philips',
    precio: 4.9,
    stock: 120,
    stockMinimo: 20,
    imagenes: [
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
    ],
    especificaciones: [
      { clave: 'Potencia',       valor: '9 W' },
      { clave: 'Casquillo',      valor: 'E27' },
      { clave: 'Temperatura',    valor: '2.700 K (cÃ¡lida)' },
      { clave: 'Flujo luminoso', valor: '806 lm' },
      { clave: 'Vida Ãºtil',      valor: '15.000 h' },
    ],
    destacado: true,
    rating: 4.7,
    reviews: 312,
  },
  {
    id: 'p6',
    sku: 'TRU-CAB-006',
    nombre: 'Cable ElÃ©ctrico 2x2.5mm 100m',
    slug: 'cable-electrico-2x25mm-100m',
    descripcion: 'Rollo de cable flexible para instalaciones de 220V.',
    descripcionLarga:
      'Rollo de 100 metros de cable elÃ©ctrico flexible de 2x2,5 mmÂ². Apto para instalaciones interiores de 220V. Aislamiento de PVC de alta calidad y cobre electrolÃ­tico.',
    categoria: 'electricidad',
    marca: 'Truper',
    precio: 74.9,
    stock: 30,
    stockMinimo: 10,
    imagenes: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=800&fit=crop',
    ],
    especificaciones: [
      { clave: 'SecciÃ³n',      valor: '2x2,5 mmÂ²' },
      { clave: 'Longitud',     valor: '100 m' },
      { clave: 'TensiÃ³n',      valor: '220 V' },
      { clave: 'Aislamiento',  valor: 'PVC' },
    ],
    destacado: true,
    rating: 4.5,
    reviews: 42,
  },
  {
    id: 'p7',
    sku: 'SKA-ADH-007',
    nombre: 'SikaBond Adhesivo Universal 300ml',
    slug: 'sikabond-adhesivo-universal-300ml',
    descripcion: 'Adhesivo de montaje de alta resistencia para interior y exterior.',
    descripcionLarga:
      'Adhesivo de montaje SikaBond en cartucho de 300 ml. Alta resistencia inicial, apto para interior y exterior. Adhiere sobre madera, metal, cerÃ¡mica, hormigÃ³n y la mayorÃ­a de plÃ¡sticos.',
    categoria: 'adhesivos',
    marca: 'Sika',
    precio: 12.9,
    stock: 55,
    stockMinimo: 15,
    imagenes: [
      'https://images.unsplash.com/photo-1581093806997-124204d9fa9d?w=800&h=800&fit=crop',
    ],
    especificaciones: [
      { clave: 'Contenido',       valor: '300 ml' },
      { clave: 'Resistencia',     valor: 'Alta' },
      { clave: 'Uso',             valor: 'Interior / Exterior' },
      { clave: 'Tiempo secado',   valor: '24 h' },
    ],
    destacado: true,
    nuevo: true,
    rating: 4.6,
    reviews: 28,
  },
  {
    id: 'p8',
    sku: '3M-MAS-008',
    nombre: 'Mascarilla 3M FFP2 (pack 5)',
    slug: 'mascarilla-3m-ffp2-pack-5',
    descripcion: 'ProtecciÃ³n respiratoria contra polvo y partÃ­culas.',
    descripcionLarga:
      'Pack de 5 mascarillas 3M FFP2 con vÃ¡lvula de exhalaciÃ³n. FiltraciÃ³n del 94% de partÃ­culas. Ajuste ergonÃ³mico y banda elÃ¡stica reforzada.',
    categoria: 'seguridad',
    marca: '3M',
    precio: 9.9,
    stock: 80,
    stockMinimo: 20,
    imagenes: [
      'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&h=800&fit=crop',
    ],
    especificaciones: [
      { clave: 'Normativa',    valor: 'FFP2' },
      { clave: 'FiltraciÃ³n',   valor: '94%' },
      { clave: 'Unidades',     valor: '5 por pack' },
      { clave: 'VÃ¡lvula',      valor: 'SÃ­' },
    ],
    destacado: true,
    rating: 4.8,
    reviews: 174,
  },
]

export function getDestacados(): Producto[] {
  return PRODUCTOS.filter((p) => p.destacado)
}

export function getNuevos(): Producto[] {
  return PRODUCTOS.filter((p) => p.nuevo)
}

export function getConPromo(): Producto[] {
  return PRODUCTOS.filter((p) => p.precioPromo)
}

export function getBySlug(slug: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.slug === slug)
}

export function getByCategoria(categoria: string): Producto[] {
  return PRODUCTOS.filter((p) => p.categoria === categoria)
}

export function getRelacionados(producto: Producto, limite = 4): Producto[] {
  return PRODUCTOS.filter(
    (p) => p.id !== producto.id && p.categoria === producto.categoria,
  ).slice(0, limite)
}
