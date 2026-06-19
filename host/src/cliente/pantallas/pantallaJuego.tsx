import React, { useEffect, useRef } from 'react';
import { EstadoJuegoCliente } from '../hooks/useWebSocket';
import { NIVELES } from '../../niveles';

export function PantallaJuego({ estado }: { estado: EstadoJuegoCliente }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nivel = NIVELES[(estado.nivelActual ?? 1) - 1];
    const escalaX = canvas.width  / nivel.anchoMundo;
    const escalaY = canvas.height / nivel.altoMundo;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#4a4e69';
    nivel.plataformas.forEach(p => {
      ctx.fillRect(
        (p.x - p.ancho / 2) * escalaX,
        (p.y - p.alto  / 2) * escalaY,
        p.ancho * escalaX,
        p.alto  * escalaY,
      );
    });

    ctx.fillStyle = '#8B4513';
estado.cajas?.forEach(c => {
  ctx.fillRect(
    (c.x - 25) * escalaX,
    (c.y - 25) * escalaY,
    50 * escalaX,
    50 * escalaY,
  );
});

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(
      (nivel.posicionPuerta.x - 30) * escalaX,
      (nivel.posicionPuerta.y - 40) * escalaY,
      60 * escalaX,
      80 * escalaY,
    );
    ctx.fillStyle = 'white';
    ctx.font = `${16 * escalaX}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('🚪', nivel.posicionPuerta.x * escalaX, nivel.posicionPuerta.y * escalaY);

    if (estado.llaveEnJuego) {
      ctx.font = `${24 * escalaX}px sans-serif`;
      ctx.fillText('🗝️', nivel.posicionLlave.x * escalaX, nivel.posicionLlave.y * escalaY);
    }

    estado.jugadores.filter(j => j.conectado).forEach(j => {
      ctx.fillStyle = j.color;
      ctx.fillRect(
        (j.x - 20) * escalaX,
        (j.y - 30) * escalaY,
        40 * escalaX,
        60 * escalaY,
      );
      if (j.cargandoLlave) {
        ctx.font = `${16 * escalaX}px sans-serif`;
        ctx.fillText('🗝️', j.x * escalaX, (j.y - 35) * escalaY);
      }
      ctx.fillStyle = 'white';
      ctx.font = `bold ${10 * escalaX}px sans-serif`;
      ctx.fillText(j.nombre.split(' ')[1], j.x * escalaX, (j.y + 5) * escalaY);
    });

  }, [estado]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        style={{ border: '2px solid #4a4e69', borderRadius: 8 }}
      />
    </div>
  );
}