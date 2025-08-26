import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { TouchableOpacity, ImageBackground, Alert, StyleSheet, Animated } from "react-native";
import { BlurView } from 'expo-blur';
import { Blurhash } from "react-native-blurhash";

import { colors } from "@/theme";
import AntDesign from '@expo/vector-icons/AntDesign';
import BlurViewTargetInsertAmount from "@/components/BlurViewTargetInsertAmount";
import { useCallback, useState, useRef } from "react";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { TartgetGridProps } from "@/components/TargetGrid";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { getLocalPhotoUri } from "@/utils/getLocalPhotoUri";
import { getContrastColor } from "@/utils/getContrastColor";
import { useTargetStore } from "@/store/useTargetStore";

export default function TargetInsertAmount() {
  const params = useLocalSearchParams<{ id: string }>();
  const [target, setTarget] = useState<TartgetGridProps | null>(null);
  const targetDatabase = useTargetDatabase();
  const { fetchFormattedTarget  } = useTargetStore();

  // Animated opacity do Blurhash
  const blurOpacity = useRef(new Animated.Value(1)).current;
 

  async function fetchData() {
    setTarget(null);
    const targetData = await fetchFormattedTarget(params.id, targetDatabase);
    //const targetData = await fetchTarget();
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


      <BlurViewTargetInsertAmount
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
    zIndex:2
  },
  blurhashContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  blurhash: {
    width: "100%",
    height: "100%",
  },
});