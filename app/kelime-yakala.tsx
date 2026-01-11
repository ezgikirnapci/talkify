import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function KelimeYakala() {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={require("../assets/games/kelime-yakala.html")}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
