import Matter from 'matter-js';
import type { ConfigNivel } from './niveles.ts';

const { Engine, Bodies, Body, World, Runner } = Matter;

const VELOCIDAD_MOVIMIENTO = 5;
const FUERZA_SALTO         = -0.015;
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
      60,
      80,
      {
        isStatic: true,
        isSensor: true,
        label: 'puerta',
      }
    ),
  ];

  World.add(mundo, cuerposPuerta);

  return {
    motor,
    mundo,
    cuerpoLlave,
    cuerposPuerta,

    actualizar: () => {
      Engine.update(motor, 1000 / 30);
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
    friction: 0.5,
    frictionAir: 0.1,
    mass: MASA_JUGADOR,
    inertia: Infinity,
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
      Body.setVelocity(cuerpo, { x: cuerpo.velocity.x * 0.8, y: cuerpo.velocity.y });
      break;
  }
}

export function estaEnSuelo(cuerpo: Matter.Body, motor: Matter.Engine): boolean {
  const cuerpos = Matter.Composite.allBodies(motor.world);
  const puntoAbajo = {
    x: cuerpo.position.x,
    y: cuerpo.position.y + 31,
  };

  return cuerpos.some((otro) => {
    if (otro === cuerpo || !otro.isStatic) return false;
    return Matter.Bounds.contains(otro.bounds, puntoAbajo);
  });
}