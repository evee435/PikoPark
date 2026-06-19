import { useWebSocket } from './hooks/useWebSocket';
import { PantallaLobby } from './pantallas/pantallaLobby';
import { PantallaJuego } from './pantallas/pantallaJuego';
import { PantallaNivelCompletado } from './pantallas/pantallaNivelCompletado';

export function App() {
  const { estado, conectado } = useWebSocket('ws://localhost:3000');

  if (!conectado || !estado) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Conectando al servidor...</p>
      </div>
    );
  }

  if (estado.fase === 'lobby') return <PantallaLobby estado={estado} />;
  if (estado.fase === 'jugando') return <PantallaJuego estado={estado} />;
  if (estado.fase === 'nivel-completado' || estado.fase === 'cambiando-nivel')
   return <PantallaNivelCompletado />;


  return null;
}