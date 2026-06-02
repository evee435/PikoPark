import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native"; // agregué Text
import { useKeepAwake } from "expo-keep-awake";
import { useConexionWebSocketJuego } from "../hooks/useConexionWebSocket";
import { IndicadorEstadoConexion } from "../componentes/conexiones/indicadorEstadoConexion";
import { BotonMoverIzquierda } from "../componentes/botones/botonMoverIzquierda";
import { BotonMoverDerecha } from "../componentes/botones/botonMoverDerecha";
import { BotonSaltar } from "../componentes/botones/botonSaltar";

interface Props {
  direccionServidorJuegoWebSocket: string;
}

export function PantallaGamepadPrincipal({ direccionServidorJuegoWebSocket }: Props) {
  useKeepAwake();

  const {
    servidorJuegoConectado,
    errorConexionServidor,
    enviarEventoMovimientoJugador,
  } = useConexionWebSocketJuego({
    direccionServidorWebSocket: direccionServidorJuegoWebSocket,
  });

  if (!servidorJuegoConectado) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "red" }} />
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "red" }}>DESCONECTADO</Text>
        {errorConexionServidor && (
          <Text style={{ fontSize: 13, color: "#888" }}>{errorConexionServidor}</Text>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "space-between", padding: 30 }}>
      <IndicadorEstadoConexion conexionActiva={servidorJuegoConectado} />
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", flex: 1 }}>
        <View style={{ flexDirection: "row", gap: 20 }}>
          <BotonMoverIzquierda
            alPresionar={() => enviarEventoMovimientoJugador("izquierda", "presionado")}
            alSoltar={() => enviarEventoMovimientoJugador("izquierda", "soltado")}
          />
          <BotonMoverDerecha
            alPresionar={() => enviarEventoMovimientoJugador("derecha", "presionado")}
            alSoltar={() => enviarEventoMovimientoJugador("derecha", "soltado")}
          />
        </View>
        <BotonSaltar
          alPresionar={() => enviarEventoMovimientoJugador("salto", "presionado")}
          alSoltar={() => enviarEventoMovimientoJugador("salto", "soltado")}
        />
      </View>
    </SafeAreaView>
  );
}