import { useThemeColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Building {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  // Percentage-based position on the map (0-100)
  x: number;
  y: number;
  width: number;
  height: number;
}

const CAMPUS_BUILDINGS: Building[] = [
  {
    id: "main-block",
    name: "Main Academic Block",
    shortName: "MAB",
    description: "Houses CSE, IT, and ENTC departments. Classrooms, labs, and faculty offices on all floors.",
    color: "#6B2B20",
    x: 28,
    y: 18,
    width: 30,
    height: 22,
  },
  {
    id: "library",
    name: "Central Library",
    shortName: "LIB",
    description: "The campus library with 40,000+ books, digital resources, reading rooms, and study cubicles.",
    color: "#2196F3",
    x: 62,
    y: 18,
    width: 22,
    height: 16,
  },
  {
    id: "admin",
    name: "Administrative Block",
    shortName: "ADM",
    description: "Principal's office, examination cell, accounts, and student services.",
    color: "#9C27B0",
    x: 10,
    y: 18,
    width: 16,
    height: 16,
  },
  {
    id: "workshop",
    name: "Workshop & Labs",
    shortName: "WRK",
    description: "Mechanical, civil, and electrical workshop. Fabrication lab, IoT lab, and maker space.",
    color: "#FF5722",
    x: 28,
    y: 46,
    width: 30,
    height: 16,
  },
  {
    id: "canteen",
    name: "Canteen & Cafeteria",
    shortName: "EAT",
    description: "Main canteen serving breakfast, lunch, and snacks. Open 8 AM – 7 PM on weekdays.",
    color: "#4CAF50",
    x: 62,
    y: 40,
    width: 22,
    height: 14,
  },
  {
    id: "sports",
    name: "Sports Ground",
    shortName: "SPT",
    description: "Football field, cricket pitch, basketball court, and athletics track.",
    color: "#E38B2C",
    x: 10,
    y: 62,
    width: 74,
    height: 20,
  },
  {
    id: "hostel",
    name: "Hostel Block",
    shortName: "HST",
    description: "On-campus hostel accommodation for outstation students with 24/7 security and Wi-Fi.",
    color: "#607D8B",
    x: 62,
    y: 58,
    width: 22,
    height: 12,
  },
  {
    id: "parking",
    name: "Parking Area",
    shortName: "PRK",
    description: "Two-wheeler and four-wheeler parking. Student parking requires a college ID sticker.",
    color: "#795548",
    x: 10,
    y: 40,
    width: 16,
    height: 18,
  },
];

interface BMCCMapModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function BMCCMapModal({ visible, onClose }: BMCCMapModalProps) {
  const colors = useThemeColors();
  const s = styles(colors);
  const [selectedBuilding, setSelectedBuilding] = React.useState<Building | null>(null);
  const { width: screenWidth } = Dimensions.get("window");
  const MAP_WIDTH = Math.min(screenWidth - 32, 480);
  const MAP_HEIGHT = MAP_WIDTH * 0.75;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={s.container}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.headerTitle}>DES Pune Campus</Text>
            <Text style={s.headerSubtitle}>BMCC Campus Map</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={s.closeBtn}>
            <Ionicons name="close" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Map */}
          <View style={s.mapWrapper}>
            <View
              style={[
                s.mapContainer,
                { width: MAP_WIDTH, height: MAP_HEIGHT },
              ]}
            >
              {/* Road grid lines */}
              <View style={[s.roadH, { top: "50%", opacity: 0.3 }]} />
              <View style={[s.roadV, { left: "22%", opacity: 0.3 }]} />
              <View style={[s.roadV, { left: "60%", opacity: 0.3 }]} />

              {/* Buildings */}
              {CAMPUS_BUILDINGS.map((building) => (
                <TouchableOpacity
                  key={building.id}
                  onPress={() =>
                    setSelectedBuilding((prev) =>
                      prev?.id === building.id ? null : building
                    )
                  }
                  style={[
                    s.building,
                    {
                      left: `${building.x}%` as any,
                      top: `${building.y}%` as any,
                      width: `${building.width}%` as any,
                      height: `${building.height}%` as any,
                      backgroundColor: building.color + "CC",
                      borderColor:
                        selectedBuilding?.id === building.id
                          ? "#FFFFFF"
                          : building.color,
                      borderWidth:
                        selectedBuilding?.id === building.id ? 2.5 : 1.5,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={s.buildingLabel} numberOfLines={1}>
                    {building.shortName}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Compass */}
              <View style={s.compass}>
                <Text style={s.compassText}>N</Text>
                <Ionicons name="navigate" size={14} color="#FFFFFF" />
              </View>

              {/* Map label */}
              <View style={s.mapLabelBadge}>
                <Text style={s.mapLabelText}>DES Pune • BMCC</Text>
              </View>
            </View>
          </View>

          {/* Building info card */}
          {selectedBuilding ? (
            <View style={s.infoCard}>
              <View style={[s.infoAccent, { backgroundColor: selectedBuilding.color }]} />
              <View style={s.infoContent}>
                <Text style={s.infoName}>{selectedBuilding.name}</Text>
                <Text style={s.infoDesc}>{selectedBuilding.description}</Text>
              </View>
            </View>
          ) : (
            <Text style={s.tapHint}>Tap a building to see details</Text>
          )}

          {/* Legend */}
          <View style={s.legendSection}>
            <Text style={s.legendTitle}>Campus Directory</Text>
            {CAMPUS_BUILDINGS.map((building) => (
              <TouchableOpacity
                key={building.id}
                style={[
                  s.legendRow,
                  selectedBuilding?.id === building.id && {
                    backgroundColor: colors.primary + "12",
                    borderRadius: 10,
                  },
                ]}
                onPress={() =>
                  setSelectedBuilding((prev) =>
                    prev?.id === building.id ? null : building
                  )
                }
              >
                <View
                  style={[s.legendDot, { backgroundColor: building.color }]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={s.legendName}>{building.name}</Text>
                </View>
                <Text style={s.legendShort}>{building.shortName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
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
      paddingHorizontal: 20,
      paddingVertical: 14,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    mapWrapper: {
      alignItems: "center",
      paddingTop: 20,
      paddingHorizontal: 16,
    },
    mapContainer: {
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: "#2D5016",
      position: "relative",
      borderWidth: 2,
      borderColor: colors.border,
    },
    roadH: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 6,
      backgroundColor: "#8C7B6B",
    },
    roadV: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: 5,
      backgroundColor: "#8C7B6B",
    },
    building: {
      position: "absolute",
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    buildingLabel: {
      color: "#FFFFFF",
      fontSize: 8,
      fontWeight: "800",
      textAlign: "center",
      letterSpacing: 0.5,
    },
    compass: {
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: "rgba(0,0,0,0.55)",
      borderRadius: 18,
      width: 34,
      height: 34,
      alignItems: "center",
      justifyContent: "center",
    },
    compassText: {
      color: "#FFFFFF",
      fontSize: 8,
      fontWeight: "800",
      lineHeight: 9,
    },
    mapLabelBadge: {
      position: "absolute",
      bottom: 8,
      left: 8,
      backgroundColor: "rgba(0,0,0,0.55)",
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    mapLabelText: {
      color: "#FFFFFF",
      fontSize: 10,
      fontWeight: "700",
    },
    infoCard: {
      flexDirection: "row",
      marginHorizontal: 16,
      marginTop: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    infoAccent: {
      width: 5,
    },
    infoContent: {
      flex: 1,
      padding: 14,
    },
    infoName: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    infoDesc: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
    },
    tapHint: {
      textAlign: "center",
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 16,
      fontStyle: "italic",
    },
    legendSection: {
      marginHorizontal: 16,
      marginTop: 20,
      marginBottom: 8,
    },
    legendTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 10,
      letterSpacing: 0.3,
    },
    legendRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 6,
      gap: 10,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 3,
    },
    legendName: {
      fontSize: 13,
      color: colors.text,
      fontWeight: "500",
    },
    legendShort: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "600",
      letterSpacing: 0.5,
    },
  });
