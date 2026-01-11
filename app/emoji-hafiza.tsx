import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function EmojiHafiza() {
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={require("../assets/games/emoji-hafiza.html")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
