import { useColorScheme } from "react-native";

const Colors = {
  light: {
    primary: "#6B2B20",
    secondary: "#E38B2C",
    accent: "#F6A531",
    background: "#F5F5F5",
    surface: "#F9F6F2",
    cardBackground: "#FFFFFF",
    textPrimary: "#2D1B14",
    textSecondary: "#5C4336",
    text: "#2D1B14",
    border: "#D9C8B6",
  },
  dark: {
    primary: "#E3B9A6",
    secondary: "#F6A531",
    accent: "#E38B2C",
    background: "#0F0F0F",
    surface: "#1E1A17",
    cardBackground: "#1A1A1A",
    textPrimary: "#F2ECE7",
    textSecondary: "#C7B8AC",
    text: "#F2ECE7",
    border: "#3A2E28",
  },
};

export function useThemeColors() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? "light"];
}

export default Colors;
