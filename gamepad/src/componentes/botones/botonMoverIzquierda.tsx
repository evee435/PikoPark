import { Pressable, View } from "react-native";

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
        backgroundColor: "#808786ff",
        padding: 30,
        borderRadius: 20,
      }}
    >
    </Pressable>
  );
}