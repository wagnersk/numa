import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { TouchableOpacity, ImageBackground, StyleSheet, Animated } from "react-native";
import { BlurView } from 'expo-blur';
import { Blurhash } from "react-native-blurhash";

import { colors } from "@/theme";
import AntDesign from '@expo/vector-icons/AntDesign';
import BlurViewTargetDetails from "@/components/BlurViewTargetDetails";
import { useCallback, useState, useRef } from "react";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { getLocalPhotoUri } from "@/utils/getLocalPhotoUri";
import { getContrastColor } from "@/utils/getContrastColor";
import { TargetByIdProps, useAnalysisStore } from "@/store/useAnalysisStore";

export default function TargetDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const [target, setTarget] = useState<TargetByIdProps | null>(null);
  const targetDatabase = useTargetDatabase();

    const { 
      fetchTargetById
    } = useAnalysisStore();

  // Animated opacity do Blurhash
  const blurOpacity = useRef(new Animated.Value(1)).current;


  async function fetchData() {
    setTarget(null);
    const targetData = await fetchTargetById(params.id, targetDatabase);
    if (targetData) setTarget(targetData);
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (!target) return null;

  const handleImageLoad = () => {
    Animated.timing(blurOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };


     const contrastColor = getContrastColor(target.photo_color);
      

  return (
    <ImageBackground
      style={styles.container}
      resizeMode="cover"
      source={{ uri: getLocalPhotoUri(target.photo_file_name) }}
      onLoadEnd={handleImageLoad}
    >
      {target.photo_blur_hash && (
        <Animated.View style={[styles.blurhashContainer, { opacity: blurOpacity }]}>
          <Blurhash
            blurhash={target.photo_blur_hash}
            style={styles.blurhash}
            decodeWidth={32}
            decodeHeight={32}
            decodeAsync
          />
        </Animated.View>
      )}

      <BlurView 
      tint="dark"
      intensity={100} style={styles.backButton}>
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color={colors.white} />
        </TouchableOpacity>
      </BlurView>

      <BlurViewTargetDetails 
      contrastColor={contrastColor}
      id={params.id}
       data={target}  
       />
    </ImageBackground>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 50,
    overflow: "hidden",
  },
  blurhashContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  blurhash: {
    width: "100%",
    height: "100%",
  },
});