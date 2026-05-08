import { Pressable, Text } from "react-native";

interface Props {
  alPresionar: () => void;
  alSoltar: () => void;
}

export function BotonMoverIzquierda({ alPresionar, alSoltar }: Props) {
  return (
    <Pressable
      onPressIn={alPresionar}
      onPressOut={alSoltar}
      style={{
        backgroundColor: "#60A5FA",
        padding: 30,
        borderRadius: 20,
      }}
    >
      <Text>⬅️</Text>
    </Pressable>
  );
}