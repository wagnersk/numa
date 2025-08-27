import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { colors, fontFamily } from "@/theme";

interface CardProps {
  imageUri: string;
  label: string;
  style?: any;
}

export function Card({ imageUri, style,label }: CardProps) {
  return (
    <ImageBackground
      source={{ uri: imageUri }}
      style={[styles.container, style]}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay}>
        <BlurView intensity={50} tint="dark" style={styles.blurContainer}>
          <Text style={styles.nameText}>{label}</Text>
        </BlurView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  imageStyle: {
    borderRadius: 12,
  },
  overlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  blurContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  nameText: {
    color: colors.white,
    fontFamily: fontFamily.bold,
    fontSize: 16,
  },
});
