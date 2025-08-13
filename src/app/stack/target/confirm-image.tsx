import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, fontFamily } from "@/theme";
import { useTargetStore } from "@/store/useImageStore";

export default function PreviewImage() {
  // Pega a foto direto do Zustand
  const photo = useTargetStore((state) => state.target.photo);
  const setSelectedPhoto = useTargetStore((state) => state.setTempTarget);

  function handleSelectPhoto(photo) {
    setSelectedPhoto({ photo }); // atualiza o Zustand (opcional aqui, pois já tem a foto)  
    router.dismissTo("/tabs/target");
  }

  if (!photo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Nenhuma imagem selecionada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Imagem selecionada</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.imageWrapper}>
        <Image source={{ uri: photo.urls.regular }} style={styles.image} resizeMode="cover" />
      </View>

      <TouchableOpacity onPress={() => handleSelectPhoto(photo)} style={styles.button}>
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Seu styles (sem alterações)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
    paddingHorizontal: 24,
    paddingTop: 16,
    justifyContent: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  imageWrapper: {
    flex: 1,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: colors.gray[700],
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  errorText: {
    fontSize: 16,
    color: colors.red[500],
  },
});