import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CampoTextoDireccionServidor } from "../componentes/conexiones/campoTextoDireccionServidor";
import { PantallaGamepadPrincipal } from "../pantallas/pantallaGamepadPrincipal";

export function PantallaConexionServidor() {
  const [direccionServidorJuegoWebSocket, setDireccionServidorJuegoWebSocket] = useState("");
  const [conexionIniciada, setConexionIniciada] = useState(false);

  if (conexionIniciada) {
    return (
      <PantallaGamepadPrincipal
        direccionServidorJuegoWebSocket={direccionServidorJuegoWebSocket}
      />
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        gap: 20,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Piko Park Gamepad</Text>
      <Text>Ingresá la IP del servidor</Text>
      <CampoTextoDireccionServidor
        direccionServidor={direccionServidorJuegoWebSocket}
        alCambiarDireccionServidor={setDireccionServidorJuegoWebSocket}
      />
      <Pressable
        onPress={() => { 
          setDireccionServidorJuegoWebSocket(`ws://${direccionServidorJuegoWebSocket}`);
          setConexionIniciada(true);
        }}
        style={{
          backgroundColor: "#4F46E5",
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Conectar</Text>
      </Pressable>
    </SafeAreaView>
  );
}