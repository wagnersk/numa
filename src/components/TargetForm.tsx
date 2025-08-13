// components/TargetForm.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  Image,
} from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import Feather from "@expo/vector-icons/Feather";

import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme";
import { CurrencyInput } from "@/components/CurrencyInput";
import { Button } from "@/components/Button";
import { formatDate } from "@/utils/formatDate";
import { UnsplashService } from "@/services/UnsplashService";

// app/target/index.tsx
import { useRouter } from "expo-router";
import { useTargetStore } from "@/store/useImageStore";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { usePhotosDatabase } from "@/database/usePhotosDatabase";
import { getRandomColor } from "@/app/utils/getRandomColor";

import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";




interface TargetData {
  targetName: string;
  currency: string;
  startValue: number;
  goalValue: number;
  startDate: Date | null;
  endDate: Date | null;
}

interface TargetFormProps {
  editting:boolean
  initialData?: Partial<TargetData>;
  onEditColor: () => void;
  onEditPhoto: () => void;
  paramsId?: string| undefined;
}

export function TargetForm({
  editting,
  initialData,
  onEditColor,
  onEditPhoto,
  paramsId,
}: TargetFormProps) {

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
  
  
  const [targetData, setTargetData] = useState<TargetData>({
    targetName: "",
    currency: "BRL",
    startValue: 0,
    goalValue: 0,
    startDate: null,
    endDate: null,
    ...initialData,
  });

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  function handleSetName(targetName: string) {
    setTargetData((prev) => ({ ...prev, targetName }));
  }

  function handleSelectCurrency(currency: string) {
    setTargetData((prev) => ({ ...prev, currency }));
  }

  function handleSelectStartValue(startValue: number) {
    setTargetData((prev) => ({ ...prev, startValue }));
  }

  function handleSetGoalValue(goalValue: number) {
    setTargetData((prev) => ({ ...prev, goalValue }));
  }

  function handleSetStartDate(startDate: Date) {
    setTargetData((prev) => ({ ...prev, startDate }));
    setStartPickerVisible(false);
  }

  function handleSetEndDate(endDate: Date) {
    setTargetData((prev) => ({ ...prev, endDate }));
    setEndPickerVisible(false);
  }

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

  async function handleSubmit() {
    if (!targetData.targetName.trim() || targetData.goalValue <= 0) {
      return Alert.alert("Atenção", "Preencha nome e valor da meta.");
    }
    await handleSave(targetData);
  }

  const currenciesArray = ["BRL", "USD", "EUR"];

  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[100] }}>

    
    <KeyboardAvoidingView
      style={styles.keyboardAvoiding}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}

          <View style={[styles.header, { justifyContent: editting ? "space-between":"center"   }]}>
            {editting && 
              <TouchableOpacity onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color={colors.black} />
              </TouchableOpacity>
            }
            <Text style={styles.title}>{initialData ? "Editar Meta" : "Nova Meta"}</Text>
            {editting &&
            <View style={{ width: 24 }} /> 
            }
          </View>

      {/* Nome da meta */}
      <View style={styles.row}>
        <View style={styles.inputSearchWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Nome da meta"
            placeholderTextColor={colors.gray[400]}
            value={targetData.targetName}
            onChangeText={handleSetName}
            maxLength={22}
            autoFocus={!initialData}
            editable={!isLoading}
          />
          <View style={styles.inputSearchMaxCounterWrapper}>
            <Text style={styles.charCount}>{targetData.targetName.length}/22</Text>
          </View>
        </View>

        <View style={styles.editButtonWrapper}>
          <TouchableOpacity
            onPress={onEditColor}
            style={[styles.editButton, { backgroundColor: color }]}
            disabled={isLoading}
          >
            <Feather name="edit-3" size={20} color={colors.black} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner */}
      <TouchableOpacity
        onPress={onEditPhoto}
        style={[styles.bannerUpload, photo && { borderWidth: 0 }]}
        disabled={isLoading}
      >
        <View style={styles.bannerTextWrapper}>
          {photo ? (
            <Image source={{ uri: photo.urls.regular }} style={styles.imagePreview} resizeMode="cover" />
          ) : (
            <>
              <Feather name="image" size={24} color={colors.gray[500]} />
              <Text style={styles.bannerText}>Adicionar Imagem ao Banner</Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Seleção de moeda */}
      <View style={styles.currencyRow}>
        {currenciesArray.map((curr) => (
          <TouchableOpacity
            key={curr}
            style={[
              styles.currencyButton,
              targetData.currency === curr && styles.currencyButtonSelected,
            ]}
            onPress={() => handleSelectCurrency(curr)}
            disabled={isLoading}
          >
            <Text
              style={[
                styles.currencyText,
                targetData.currency === curr && styles.currencyTextSelected,
              ]}
            >
              {curr}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Valores e datas */}
      <View>
        {/* Valores */}
        <View style={styles.valuesRow}>
          <View style={{ flex: 1 }}>
            <CurrencyInput
              prefix={
                targetData.currency === "BRL"
                  ? "R$"
                  : targetData.currency === "USD"
                  ? "$"
                  : "€"
              }
              label="Saldo Inicial"
              value={targetData.startValue}
              onChangeValue={handleSelectStartValue}
              editable={!isLoading}
            />
          </View>
          <View style={{ flex: 1 }}>
            <CurrencyInput
              prefix={
                targetData.currency === "BRL"
                  ? "R$"
                  : targetData.currency === "USD"
                  ? "$"
                  : "€"
              }
              label="Objetivo"
              value={targetData.goalValue}
              onChangeValue={handleSetGoalValue}
              editable={!isLoading}
            />
          </View>
        </View>

        {/* Datas */}
        <View style={styles.dateRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Início</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setStartPickerVisible(true)}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.dateText,
                  targetData.startDate ? styles.dateTextActive : styles.dateTextInactive,
                ]}
              >
                {targetData.startDate ? formatDate(targetData.startDate) : "Selecionar data"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Fim</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setEndPickerVisible(true)}
              disabled={isLoading || !targetData.startDate}
            >
              <Text
                style={[
                  styles.dateText,
                  targetData.endDate ? styles.dateTextActive : styles.dateTextInactive,
                ]}
              >
                {targetData.endDate ? formatDate(targetData.endDate) : "Selecionar data"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isStartPickerVisible}
          mode="date"
          locale="pt-BR"
          date={targetData.startDate || new Date()}
          onConfirm={handleSetStartDate}
          onCancel={() => setStartPickerVisible(false)}
          minimumDate={new Date()}
          disabled={isLoading}
        />

        <DateTimePickerModal
          isVisible={isEndPickerVisible}
          mode="date"
          locale="pt-BR"
          date={targetData.endDate || new Date()}
          onConfirm={handleSetEndDate}
          onCancel={() => setEndPickerVisible(false)}
          minimumDate={targetData.startDate || undefined}
          disabled={isLoading || !targetData.startDate}
        />
      </View>

      {/* Botão */}
      <Button title={initialData ? "Atualizar" : "Cadastrar"} onPress={handleSubmit} isProcessing={isLoading} />
    </KeyboardAvoidingView>
     </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 20,
    width: "100%",
  },
  inputSearchWrapper: {
    flexDirection: "column",
    justifyContent: "flex-end",
    flex: 1,
    position: "relative",
  },
  inputSearchMaxCounterWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  charCount: {
    fontSize: 12,
    color: colors.black,
    fontFamily: fontFamily.regular,
    marginTop: 4,
    marginBottom: 16,
  },
  editButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 24,
  },
  editButton: {
    backgroundColor: colors.gray[300],
    borderRadius: 50,
    width: 72,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerUpload: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.gray[400],
    borderRadius: 12,
    height: 140,
    marginBottom: 24,
  },
  bannerTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  bannerText: {
    color: colors.gray[500],
    fontFamily: fontFamily.regular,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  currencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  currencyButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  currencyButtonSelected: {
    backgroundColor: colors.black,
  },
  currencyText: {
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  currencyTextSelected: {
    color: colors.white,
  },
  valuesRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.gray[700],
    marginBottom: 6,
  },
  input: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: colors.white,
    height: 48,
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  dateButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  dateText: {
    fontSize: 16,
  },
  dateTextActive: {
    color: colors.gray[900],
  },
  dateTextInactive: {
    color: colors.gray[400],
  },
});