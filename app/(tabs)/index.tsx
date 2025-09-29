import Logo from "@/components/Logo";
import { useThemeColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={styles(colors).container}>
      <View style={styles(colors).header}>
        <Logo width={50} height={50} />
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
