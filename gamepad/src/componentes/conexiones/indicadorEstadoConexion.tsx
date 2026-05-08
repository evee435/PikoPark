import { View, Text } from "react-native";

interface Props {
  conexionActiva: boolean;
}

export function IndicadorEstadoConexion({ conexionActiva }: Props) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <View
        style={{
          width: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: conexionActiva ? "green" : "red",
        }}
      />
      <Text>{conexionActiva ? "Conectado" : "Desconectado"}</Text>
    </View>
  );
}