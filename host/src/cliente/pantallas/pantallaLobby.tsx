import React from 'react';
import { EstadoJuegoCliente } from '../hooks/useWebSocket';

export function PantallaLobby({ estado }: { estado: EstadoJuegoCliente }) {
  const conectados = estado.jugadores.filter(j => j.conectado).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 24 }}>
      <h1 style={{ fontSize: 48, fontWeight: 'bold' }}>PicoPark</h1>
      <p style={{ fontSize: 24, color: '#aaa' }}>Esperando jugadores...</p>
      <div style={{ fontSize: 64, fontWeight: 'bold', color: '#4F46E5' }}>
        {conectados} / 4
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        {estado.jugadores.filter(j => j.conectado).map(j => (
          <div key={j.id} style={{ padding: '12px 20px', borderRadius: 12, backgroundColor: j.color, color: 'white', fontWeight: 'bold' }}>
            {j.nombre}
          </div>
        ))}
      </div>
      <p style={{ color: '#666', fontSize: 14 }}>El juego empieza cuando se conecten 4 jugadores</p>
    </div>
  );
}