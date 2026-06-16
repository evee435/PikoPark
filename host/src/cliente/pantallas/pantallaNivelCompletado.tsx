import React from 'react';

export function PantallaNivelCompletado() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 24 }}>
      <h1 style={{ fontSize: 64 }}>🎉</h1>
      <h2 style={{ fontSize: 36, fontWeight: 'bold' }}>¡Nivel Completado!</h2>
      <p style={{ color: '#aaa' }}>Todos llegaron a la salida</p>
    </div>
  );
}