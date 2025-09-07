import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../lib/ThemeProvider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Toggle Theme</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => {
              setTheme("light");
              setModalVisible(false);
            }}
            style={styles.modalButton}
          >
            <Text>Light</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setTheme("dark");
              setModalVisible(false);
            }}
            style={styles.modalButton}
          >
            <Text>Dark</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setTheme("system");
              setModalVisible(false);
            }}
            style={styles.modalButton}
          >
            <Text>System</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.modalButton}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalButton: {
    backgroundColor: "white",
    padding: 15,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});
