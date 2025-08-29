import { Text, useColorScheme, View, Image } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>DESocial</Text>
      <Link href="/profile">
        <Text>Go to Profile</Text>
      </Link>
    </View>
  );
}
