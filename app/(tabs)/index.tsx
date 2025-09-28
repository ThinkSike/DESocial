import { useRouter } from "expo-router";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useThemeColors } from "@/constants/Colors";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={styles(colors).container}>
      <View style={styles(colors).header}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles(colors).logo}
        />
        <TouchableOpacity
          onPress={() => router.push("/chats" as any)}
          style={styles(colors).chatButton}
        >
          <Ionicons
            name="chatbubble-outline"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: 20,
    },
    logo: {
      width: 50,
      height: 50,
    },
    chatButton: {},
  });
