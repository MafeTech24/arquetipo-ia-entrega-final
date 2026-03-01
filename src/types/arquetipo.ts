export interface ArquetipoData {
  // Paso 1 - Perfil básico
  nombre: string;
  edad: string;
  residencia: string;
  ocupacion: string;
  nivel_educativo: string;
  estado_civil: string;
  modalidad_laboral: string;
  nivel_socioeconomico: string;

  // Paso 2 - Preferencias y hábitos
  pasatiempos: string;
  costumbres: string;
  contenido_digital: string;
  temas_sociales: string;
  que_busca_en_marca: string;

  // Paso 3 - Hábitos sociales
  redes: string[];
  frecuencia: string;
  participacion: string;
  influencers: string;
  ecommerce: string;

  // Paso 4 - Factores psicológicos
  busca_en_servicio: string;
  sentimientos: string;
  evita: string;
  valores: string;
  miedos: string;
  deseos: string;
}

export const emptyArquetipo: ArquetipoData = {
  nombre: "",
  edad: "",
  residencia: "",
  ocupacion: "",
  nivel_educativo: "",
  estado_civil: "",
  modalidad_laboral: "",
  nivel_socioeconomico: "",
  pasatiempos: "",
  costumbres: "",
  contenido_digital: "",
  temas_sociales: "",
  que_busca_en_marca: "",
  redes: [],
  frecuencia: "",
  participacion: "",
  influencers: "",
  ecommerce: "",
  busca_en_servicio: "",
  sentimientos: "",
  evita: "",
  valores: "",
  miedos: "",
  deseos: "",
};

export const mockResultado: ArquetipoData = {
  nombre: "Laura Torres",
  edad: "35",
  residencia: "Córdoba Capital",
  ocupacion: "Dueña de salón de belleza",
  nivel_educativo: "Secundario completo",
  estado_civil: "Casada",
  modalidad_laboral: "Independiente",
  nivel_socioeconomico: "Medio",
  pasatiempos: "Ver reels de decoración, salir con amigas",
  costumbres: "Se levanta temprano, toma mate, busca inspiración en Pinterest",
  contenido_digital: "Videos cortos, tutoriales de belleza",
  temas_sociales: "Emprendimiento femenino, bienestar",
  que_busca_en_marca: "Confianza, cercanía, resultados reales",
  redes: ["Instagram", "Facebook"],
  frecuencia: "Varias veces al día",
  participacion: "Comenta, da likes y comparte contenido útil",
  influencers: "Emprendedoras locales, coaches de negocios",
  ecommerce: "Compra por Instagram y Mercado Libre",
  busca_en_servicio: "Simplicidad y resultados rápidos",
  sentimientos: "Seguridad, orgullo, pertenencia",
  evita: "Contenido muy técnico o agresivo",
  valores: "Familia, esfuerzo, autenticidad",
  miedos: "Perder dinero en algo que no funcione",
  deseos: "Que su negocio crezca sin depender de ella todo el tiempo",
};
