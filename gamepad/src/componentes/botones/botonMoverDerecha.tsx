import { Pressable, Text } from "react-native";

interface Props {
  alPresionar: () => void;
  alSoltar: () => void;
}

export function BotonMoverDerecha({ alPresionar, alSoltar }: Props) {
  return (
    <Pressable
      onPressIn={alPresionar}
      onPressOut={alSoltar}
      style={{
        backgroundColor: "#F59E0B",
        padding: 30,
        borderRadius: 20,
      }}
    >
      <Text>➡️</Text>
    </Pressable>
  );
}