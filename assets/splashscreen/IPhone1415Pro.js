import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

const IPhone1415Pro = () => {
  return (
    <View style={styles.iphone1415Pro3}>
      <Image
        style={styles.iphone1415Pro3Child}
        contentFit="cover"
        source={require("./group-2@3x.png")}
      />
      <Image
        style={styles.vectorIcon}
        contentFit="cover"
        source={require("./vector@3x.png")}
      />
      <Image
        style={styles.vectorIcon1}
        contentFit="cover"
        source={require("./vector1@3x.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iphone1415Pro3Child: {
    top: -1050,
    left: -1297,
    width: 2988,
    height: 2850,
    position: "absolute",
  },
  vectorIcon: {
    top: 352,
    left: 190,
    width: 14,
    height: 30,
    position: "absolute",
  },
  vectorIcon1: {
    top: 278,
    left: 101,
    width: 192,
    height: 192,
    position: "absolute",
  },
  iphone1415Pro3: {
    backgroundColor: "#64ea79",
    flex: 1,
    width: "100%",
    height: 852,
    overflow: "hidden",
  },
});

export default IPhone1415Pro;
