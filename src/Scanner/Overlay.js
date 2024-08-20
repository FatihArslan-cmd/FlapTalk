import React from "react";
import { View, Dimensions, StyleSheet, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;

export const Overlay = () => {
  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.innerRectangle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  innerRectangle: {
    width: innerDimension,
    height: innerDimension,
    backgroundColor: "transparent",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.5)",
    backgroundColor: "#FFFFFF",
  },
});

export default Overlay;
