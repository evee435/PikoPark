import { useState, useEffect, useRef } from 'react';

export interface JugadorEstado {
  id:            string;
  nombre:        string;
  color:         string;
  x:             number;
  y:             number;
  cargandoLlave: boolean;
  conectado:     boolean;
}

export interface EstadoJuegoCliente {
  fase:          'lobby' | 'jugando' | 'nivel-completado' | 'cambiando-nivel';
  jugadores:     JugadorEstado[];
  llaveEnJuego:  boolean;
  llaveRecogida: boolean;
  cajas:         { x: number; y: number }[]; 
  nivelActual:   number;
}

export function useWebSocket(url: string) {
  const [estado, setEstado]       = useState<EstadoJuegoCliente | null>(null);
  const [conectado, setConectado] = useState(false);
  const socketRef                 = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen    = () => setConectado(true);
    ws.onclose   = () => setConectado(false);
    ws.onmessage = (evento) => {
      const mensaje = JSON.parse(evento.data);
      if (mensaje.tipo === 'estado') setEstado(mensaje);
    };

    return () => ws.close();
  }, [url]);

  return { estado, conectado };
}