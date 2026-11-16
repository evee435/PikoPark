import Matter from 'matter-js';
import type { ConfigNivel } from './niveles.ts';

const { Engine, Bodies, Body, World } = Matter;

const VELOCIDAD_MOVIMIENTO = 5;
const FUERZA_SALTO         = -0.020;
const MASA_JUGADOR         = 1;

export interface MotorFisico {
  motor:         Matter.Engine;
  mundo:         Matter.World;
  cuerpoLlave:   Matter.Body | null;
  cuerposPuerta: Matter.Body[];
  actualizar:    () => void;
  destruir:      () => void;
}

export function crearMotorFisico(nivel: ConfigNivel): MotorFisico {
  const motor = Engine.create({
    gravity: { x: 0, y: 1.5 }
  });

  const mundo = motor.world;

  const cuerposPlataformas = nivel.plataformas.map((p) =>
    Bodies.rectangle(p.x, p.y, p.ancho, p.alto, {
      isStatic: true,
      label: p.etiqueta ?? 'plataforma',
      friction: 0.8,
    })
  );

  World.add(mundo, cuerposPlataformas);

  const techo = Bodies.rectangle(
  1000, 
  -25,  
  2000, 
  50,   
  {
    isStatic: true,
    label: 'techo',
  }
);

World.add(mundo, techo);

  const cuerpoLlave = Bodies.circle(
    nivel.posicionLlave.x,
    nivel.posicionLlave.y,
    15,
    {
      label: 'llave',
      isStatic: true,
      collisionFilter: { mask: 0x0002 },
    }
  );

  World.add(mundo, cuerpoLlave);

  const cuerposPuerta = [
  Bodies.rectangle(
    nivel.posicionPuerta.x,
    nivel.posicionPuerta.y,
    60, 80,
    { 
      isStatic: true, 
      isSensor: true, 
      label: 'puerta',
      restitution: 0,
      collisionFilter: {
        mask: 0x0000, 
      }
    }
  ),
];

  World.add(mundo, cuerposPuerta);

  if (nivel.cajas) {
  nivel.cajas.forEach((c) => {
    const caja = Bodies.rectangle(c.x, c.y, 50, 50, {
      label: 'caja',
      friction: 0.8,
      restitution: 0,
      mass: 5, 
    });
    World.add(mundo, caja);
  });
}

  return {
    motor,
    mundo,
    cuerpoLlave,
    cuerposPuerta,

    actualizar: () => {
    },

    destruir: () => {
      Engine.clear(motor);
      World.clear(mundo, false);
    },
  };
}

export function crearCuerpoJugador(x: number, y: number, id: string): Matter.Body {
  return Bodies.rectangle(x, y, 40, 60, {
    label: `jugador-${id}`,
    friction: 0,
    frictionStatic: 0,
    frictionAir: 0.02,
    mass: MASA_JUGADOR,
    inertia: Infinity,
    restitution: 0,
    collisionFilter: {
      category: 0x0002,
      mask: 0x0001 | 0x0002,
    },
  });
}

export function aplicarMovimiento(
  cuerpo: Matter.Body,
  direccion: 'izquierda' | 'derecha' | 'salto' | 'ninguna',
  estaEnSuelo: boolean,
): void {
  switch (direccion) {
    case 'izquierda':
      Body.setVelocity(cuerpo, { x: -VELOCIDAD_MOVIMIENTO, y: cuerpo.velocity.y });
      break;
    case 'derecha':
      Body.setVelocity(cuerpo, { x: VELOCIDAD_MOVIMIENTO, y: cuerpo.velocity.y });
      break;
    case 'salto':
      if (estaEnSuelo) {
        Body.applyForce(cuerpo, cuerpo.position, { x: 0, y: FUERZA_SALTO });
      }
      break;
    case 'ninguna':
     Body.setVelocity(cuerpo, { x: 0, y: cuerpo.velocity.y });      break;
  }
}

export function estaEnSuelo(cuerpo: Matter.Body, motor: Matter.Engine): boolean {
  const cuerpos = Matter.Composite.allBodies(motor.world);
  const margen = 5; 
  const mitadAncho = 18;

  const puntosAbajo = [
    { x: cuerpo.position.x,              y: cuerpo.position.y + 31 + margen }, // centro
    { x: cuerpo.position.x - mitadAncho, y: cuerpo.position.y + 31 + margen }, // borde izquierdo
    { x: cuerpo.position.x + mitadAncho, y: cuerpo.position.y + 31 + margen }, // borde derecho
  ];

  return cuerpos.some((otro) => {
    if (otro === cuerpo) return false;
    return puntosAbajo.some(punto => Matter.Bounds.contains(otro.bounds, punto));

    const puntoAbajo = {
      x: cuerpo.position.x,
      y: cuerpo.position.y + 31 + margen,
    };
    return Matter.Bounds.contains(otro.bounds, puntoAbajo);
  });
}