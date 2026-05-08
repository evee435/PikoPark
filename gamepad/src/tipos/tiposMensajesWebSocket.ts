import { DireccionMovimientoJugador } from "./tiposDireccionMovimiento";

export type EstadoBotonControl =
  | "presionado"
  | "soltado";

export interface MensajeMovimientoJugador {
  tipo: "input";
  direccion: DireccionMovimientoJugador;
  estado: EstadoBotonControl;
}