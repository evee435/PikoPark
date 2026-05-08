import { useEffect, useRef, useState } from "react";
import { EstadoBotonControl, MensajeMovimientoJugador } from "../tipos/tiposMensajesWebSocket";
import { DireccionMovimientoJugador } from "../tipos/tiposDireccionMovimiento";

interface ParametrosConexionWebSocketJuego {
  direccionServidorWebSocket: string;
}

export function useConexionWebSocketJuego({
  direccionServidorWebSocket,
}: ParametrosConexionWebSocketJuego) {
  const referenciaConexionWebSocket = useRef<WebSocket | null>(null);
  const [servidorJuegoConectado, setServidorJuegoConectado] = useState(false);
  const [errorConexionServidor, setErrorConexionServidor] = useState<string | null>(null);

  useEffect(() => {
    if (!direccionServidorWebSocket) return;

    const conexionWebSocket = new WebSocket(direccionServidorWebSocket);
    referenciaConexionWebSocket.current = conexionWebSocket;

    conexionWebSocket.onopen = () => {
      setServidorJuegoConectado(true);
      setErrorConexionServidor(null);
    };

    conexionWebSocket.onclose = () => {
      setServidorJuegoConectado(false);
    };

    conexionWebSocket.onerror = () => {
      setErrorConexionServidor("No fue posible conectarse al servidor");
    };

    return () => {
      conexionWebSocket.close();
    };
  }, [direccionServidorWebSocket]);

  function enviarEventoMovimientoJugador(
    direccionMovimientoJugador: DireccionMovimientoJugador,
    estadoBotonControl: EstadoBotonControl
  ) {
    if (!referenciaConexionWebSocket.current) return;

    const mensajeMovimientoJugador: MensajeMovimientoJugador = {
      tipo: "input",
      direccion: direccionMovimientoJugador,
      estado: estadoBotonControl,
    };

    referenciaConexionWebSocket.current.send(JSON.stringify(mensajeMovimientoJugador));
  }

  return {
    servidorJuegoConectado,
    errorConexionServidor,
    enviarEventoMovimientoJugador,
  };
}