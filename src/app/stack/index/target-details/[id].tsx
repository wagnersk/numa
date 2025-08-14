import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { TouchableOpacity, ImageBackground, Alert, StyleSheet, Animated } from "react-native";
import { BlurView } from 'expo-blur';
import { Blurhash } from "react-native-blurhash";

import { colors } from "@/theme";
import AntDesign from '@expo/vector-icons/AntDesign';
import BlurViewTargetDetails from "@/components/BlurViewTargetDetails";
import { useCallback, useState, useRef } from "react";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { TartgetGridProps } from "@/components/TargetGrid";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { getLocalPhotoUri } from "@/utils/getLocalPhotoUri";

export default function TargetDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const [target, setTarget] = useState<TartgetGridProps | null>(null);
  const targetDatabase = useTargetDatabase();

  // Animated opacity do Blurhash
  const blurOpacity = useRef(new Animated.Value(1)).current;

  async function fetchTarget(): Promise<TartgetGridProps | undefined> {
    try {
      const response = await targetDatabase.show(params.id);

      return {
        id: Number(response.id),
        target: numberToCurrency(response.amount),
        currency: numberToCurrency(response.current),
        color: response.color,
        end_date: response.end_date,
        name: response.name,
        percentage: Number(response.percentage.toFixed(2)),
        current: response.current,
        start_date: response.start_date,
        photo_color: response.photo_color,
        photo_blur_hash: response.photo_blur_hash,
        photo_direct_url: response.photo_direct_url,
        photo_file_name: response.photo_file_name,
      };
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as metas.");
      console.log(error);
    }
  }

  async function fetchData() {
    setTarget(null);
    const targetData = await fetchTarget();
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

      <BlurView intensity={100} style={styles.backButton}>
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color={colors.white} />
        </TouchableOpacity>
      </BlurView>

      <BlurViewTargetDetails id={params.id} data={target} />
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