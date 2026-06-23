export interface Plataforma {
  x: number;
  y: number;
  ancho: number;
  alto: number;
  etiqueta?: string;
}

export interface ConfigNivel {
  numero: number;
  nombre: string;
  anchoMundo: number;
  altoMundo: number;
  plataformas: Plataforma[];
  posicionesIniciales: { x: number; y: number }[];
  posicionLlave: { x: number; y: number };
  posicionPuerta: { x: number; y: number };
  descripcion: string;
  cajas?: { x: number; y: number }[]; 

}

export const NIVEL_1: ConfigNivel = {
  numero: 1,
  nombre: 'El Puente',
  anchoMundo: 1200,
  altoMundo: 600,
  descripcion: 'Lleguen a la llave y lleven a todos a la salida.',
  plataformas: [
    { x: 200,  y: 580, ancho: 400, alto: 20, etiqueta: 'suelo-izquierdo' },
    { x: 950,  y: 580, ancho: 500, alto: 20, etiqueta: 'suelo-derecho' },
    { x: 500,  y: 480, ancho: 120, alto: 20, etiqueta: 'plataforma-salto-1' },
    { x: 650,  y: 400, ancho: 120, alto: 20, etiqueta: 'plataforma-salto-2' },
    { x: 900,  y: 290, ancho: 200, alto: 20, etiqueta: 'plataforma-llave' },
    { x: 0,    y: 300, ancho: 20,  alto: 600, etiqueta: 'pared-izquierda' },
    { x: 1200, y: 300, ancho: 20,  alto: 600, etiqueta: 'pared-derecha' },
  ],
  posicionesIniciales: [
    { x: 100, y: 500 },
    { x: 150, y: 500 },
    { x: 200, y: 500 },
    { x: 250, y: 500 },
  ],
  posicionLlave:  { x: 900,  y: 240 },
  posicionPuerta: { x: 1150, y: 520 },

};

export const NIVEL_2: ConfigNivel = {
  numero: 2,
  nombre: 'La Torre',
  anchoMundo: 800,
  altoMundo: 700,
  descripcion: 'Apílense para alcanzar la llave en las alturas.',
  plataformas: [
    { x: 400, y: 680, ancho: 800, alto: 20, etiqueta: 'suelo' },
    // plataforma intermedia nueva para subir más fácil
    { x: 300, y: 500, ancho: 160, alto: 20, etiqueta: 'plataforma-media' },
    // plataforma alta donde está la llave
    { x: 200, y: 300, ancho: 160, alto: 20, etiqueta: 'plataforma-alta' },
    // plataforma de salida
    { x: 650, y: 500, ancho: 200, alto: 20, etiqueta: 'plataforma-salida' },
    { x: 0,   y: 350, ancho: 20,  alto: 700, etiqueta: 'pared-izquierda' },
    { x: 800, y: 350, ancho: 20,  alto: 700, etiqueta: 'pared-derecha' },
  ],
  posicionesIniciales: [
    { x: 200, y: 600 },
    { x: 250, y: 600 },
    { x: 300, y: 600 },
    { x: 350, y: 600 },
  ],
  posicionLlave:  { x: 200, y: 260 },
  posicionPuerta: { x: 650, y: 450 },
  cajas: [
  { x: 600, y: 540 }, 
],
};

export const NIVELES: ConfigNivel[] = [NIVEL_1, NIVEL_2];