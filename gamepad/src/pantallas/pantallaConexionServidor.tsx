import { useState, useEffect } from "react";
import { Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import { CampoTextoDireccionServidor } from "../componentes/conexiones/campoTextoDireccionServidor";
import { PantallaGamepadPrincipal } from "../pantallas/pantallaGamepadPrincipal";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

export function PantallaConexionServidor() {
  const [direccionServidorJuegoWebSocket, setDireccionServidorJuegoWebSocket] = useState("");
  const [conexionIniciada, setConexionIniciada] = useState(false);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  }, []);

  if (conexionIniciada) {
    return (
      <PantallaGamepadPrincipal
        direccionServidorJuegoWebSocket={direccionServidorJuegoWebSocket}
      />
    );
  }

return (
  <SafeAreaView style={{ flex: 1 }}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          gap: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>
          Pico Park Gamepad
        </Text>

        <Text>Ingresá la IP del servidor</Text>

        <CampoTextoDireccionServidor
          direccionServidor={direccionServidorJuegoWebSocket}
          alCambiarDireccionServidor={setDireccionServidorJuegoWebSocket}
        />

        <Pressable
          onPress={() => {
            setDireccionServidorJuegoWebSocket(
              `ws://${direccionServidorJuegoWebSocket}`
            );
            setConexionIniciada(true);
          }}
          style={{
            backgroundColor: "#4F46E5",
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Conectar
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}