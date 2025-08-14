import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, fontFamily } from "@/theme";
import { useTargetStore } from "@/store/useImageStore";
import { useEffect, useState } from "react";
import { UnsplashPhoto, UnsplashService } from "@/services/UnsplashService";
import { Blurhash } from "react-native-blurhash";

export default function PreviewImage() {
  const setSelectedPhoto = useTargetStore((state) => state.setTempTarget);
  const [getPhoto, setGetPhoto] = useState<UnsplashPhoto | null>(null);
  const params = useLocalSearchParams<{ id: string }>();

  function handleSelectPhoto(photo: UnsplashPhoto) {
    setSelectedPhoto({ photo });

    router.dismissAll();
  }

  async function getSelectedPhoto(id: string) {
    const photo = await UnsplashService.getPhotoById(id);
    setGetPhoto(photo);
  }

  useEffect(() => {
    if (params.id) {
      getSelectedPhoto(params.id);
    }
  }, []);

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
      {getPhoto && <>
          {/* Imagem real por cima */}
          <Blurhash
          blurhash={getPhoto.blur_hash}
          style={styles.image}
          decodeWidth={32}
          decodeHeight={32}
          decodeAsync
          />
        <Image
          source={{ uri: getPhoto.urls.regular }}
          style={[styles.image, StyleSheet.absoluteFill]}
          resizeMode="cover"
          />
        </>
      }
      </View>

      <TouchableOpacity
        onPress={() => handleSelectPhoto(getPhoto!)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>OK</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

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
    borderRadius: 20,
    overflow: "hidden",
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
});