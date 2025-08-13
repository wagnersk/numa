// app/target/index.tsx
import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { TargetForm } from "@/components/TargetForm";
import { useTargetStore } from "@/store/useImageStore";
import { UnsplashService } from "@/services/UnsplashService";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { usePhotosDatabase } from "@/database/usePhotosDatabase";
import { getRandomColor } from "@/app/utils/getRandomColor";

export default function NewTargetScreen() {
  const router = useRouter();

  const color = useTargetStore((state) => state.target.color);
  const photo = useTargetStore((state) => state.target.photo);
  const setTempTarget = useTargetStore((state) => state.setTempTarget);
  const resetTempTarget = useTargetStore((state) => state.resetTempTarget);

  const targetDatabase = useTargetDatabase();
  const transactionsDatabase = useTransactionsDatabase();
  const photosDatabase = usePhotosDatabase();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!color) {
      setTempTarget({ color: getRandomColor() });
    }
  }, []);

  async function handleSave(data) {
    if (!photo) {
      Alert.alert("Atenção", "Adicione uma imagem para continuar.");
      return;
    }
    setIsLoading(true);
    try {
      const photoData = await UnsplashService.downloadPhoto(photo);

      const targetId = await targetDatabase.create({
        name: data.targetName,
        amount: data.goalValue,
        currency: data.currency,
        color: color,
        start_date: data.startDate,
        end_date: data.endDate,
      });

      await transactionsDatabase.create({
        amount: data.startValue,
        target_id: targetId,
        observation: "Saldo inicial",
      });

      await photosDatabase.create({
        target_id: targetId,
        color: photoData.color,
        blur_hash: photoData.blur_hash,
        local_uri: photoData.localUri,
        direct_url: photoData.directUrl,
      });

      Alert.alert("Nova Meta", "Meta criada com sucesso!", [
        {
          text: "Ok",
          onPress: () => {
            resetTempTarget();
            router.push("/tabs");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a meta.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <TargetForm
      isLoading={isLoading}
      color={color}
      photoUri={photo?.urls?.regular}
      onEditColor={() => router.push("/stack/target/select-color")}
      onEditPhoto={() => router.push("/stack/target/select-image")}
      onSave={handleSave}
    />
  );
}