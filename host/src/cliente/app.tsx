import React, { useEffect, useState } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { PantallaLobby } from './pantallas/pantallaLobby';
import { PantallaJuego } from './pantallas/pantallaJuego';
import { PantallaNivelCompletado } from './pantallas/pantallaNivelCompletado';
import { PantallaPresentacionNivel } from './pantallas/pantallaPresentacionNivel';

export function App() {
  const { estado, conectado } = useWebSocket('ws://localhost:3000');
  const [mostrandoPresentacion, setMostrandoPresentacion] = useState(false);
  const [nivelPresentado, setNivelPresentado] = useState(0);

  useEffect(() => {
    if (!estado) return;
    if (estado.fase === 'jugando' && estado.nivelActual !== nivelPresentado) {
      setNivelPresentado(estado.nivelActual);
      setMostrandoPresentacion(true);
      setTimeout(() => setMostrandoPresentacion(false), 3000);
    }
  }, [estado?.fase, estado?.nivelActual]);

  if (!conectado || !estado) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Conectando al servidor...</p>
      </div>
    );
  }

  if (mostrandoPresentacion) return <PantallaPresentacionNivel nivel={nivelPresentado} />;
  if (estado.fase === 'lobby') return <PantallaLobby estado={estado} />;
  if (estado.fase === 'jugando') return <PantallaJuego estado={estado} />;
  if (estado.fase === 'nivel-completado' || estado.fase === 'cambiando-nivel')
   return <PantallaNivelCompletado />;


  return null;
}