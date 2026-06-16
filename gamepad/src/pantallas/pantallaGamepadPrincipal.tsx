import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, useWindowDimensions } from "react-native";
import { useKeepAwake } from "expo-keep-awake";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect } from "react";
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
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    };
  }, []);

  const {
  servidorJuegoConectado,
  conectando,
  errorConexionServidor,
  enviarEventoMovimientoJugador,
} = useConexionWebSocketJuego({
  direccionServidorWebSocket: direccionServidorJuegoWebSocket,
});

if (conectando) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Conectando...
      </Text>
    </SafeAreaView>
  );
}

if (!servidorJuegoConectado) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: "red",
        }}
      />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "red",
        }}
      >
        DESCONECTADO
      </Text>

      {errorConexionServidor && (
        <Text style={{ fontSize: 13, color: "#888" }}>
          {errorConexionServidor}
        </Text>
      )}
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffffff" }}>
      <View style={{
         flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 40,
    paddingBottom: 40,
      }}>

        <View style={{ position: "absolute", top: 16, left: 16 }}>
          <IndicadorEstadoConexion conexionActiva={servidorJuegoConectado} />
        </View>

        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
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