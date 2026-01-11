import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function AdamAsmaca() {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={require("../assets/games/adam-asmaca.html")}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
