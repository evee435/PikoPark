import { TextInput } from "react-native";

interface Props {
  direccionServidor: string;
  alCambiarDireccionServidor: (valor: string) => void;
}

export function CampoTextoDireccionServidor({ direccionServidor, alCambiarDireccionServidor }: Props) {
  return (
    <TextInput
      value={direccionServidor}
      onChangeText={alCambiarDireccionServidor}
      placeholder="ws://192.168.1.X:3000"
      autoCapitalize="none"
      keyboardType="url"
      style={{
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 12,
        width: "100%",
        fontSize: 16,
      }}
    />
  );
}