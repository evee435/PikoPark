import { View, Text, Pressable } from "react-native";

interface Props {
  alPresionar: () => void;
  alSoltar: () => void;
}

export function BotonSaltar({ alPresionar, alSoltar }: Props) {
  return (
    <Pressable
      onPressIn={alPresionar}
      onPressOut={alSoltar}
      style={{
        backgroundColor: "#808786ff",
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 30, fontWeight: "bold" }}>A</Text>
    </Pressable>
  );
}