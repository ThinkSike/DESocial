import { useColorScheme } from "react-native";

const Colors = {
  light: {
    primary: "#6B2B20",
    secondary: "#E38B2C",
    accent: "#F6A531",
    background: "#FFFFFF",
    surface: "#F9F6F2",
    textPrimary: "#2D1B14",
    textSecondary: "#5C4336",
    border: "#D9C8B6",
  },
  dark: {
    primary: "#E3B9A6",
    secondary: "#F6A531",
    accent: "#E38B2C",
    background: "#12100E",
    surface: "#1E1A17",
    textPrimary: "#F2ECE7",
    textSecondary: "#C7B8AC",
    border: "#3A2E28",
  },
};

export function useThemeColors() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? "light"];
}

export default Colors;
