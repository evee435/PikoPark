import React from 'react';
import { NIVELES } from '../../niveles';

export function PantallaPresentacionNivel({ nivel }: { nivel: number }) {
  const config = NIVELES[nivel - 1];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      height: '100vh', gap: 24, background: '#1a1a2e',
    }}>
      <p style={{ fontSize: 24, color: '#aaa', letterSpacing: 4 }}>NIVEL {nivel}</p>
      <h1 style={{ fontSize: 52, fontWeight: 'bold', color: 'white' }}>{config.nombre.toUpperCase()}</h1>
      <p style={{ fontSize: 22, color: '#4F46E5' }}>{config.descripcion.toUpperCase()}</p>
    </div>
  );
}