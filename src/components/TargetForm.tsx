// components/TargetForm.tsx
import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import Feather from "@expo/vector-icons/Feather";

import { colors } from "../theme/colors";
import { fontFamily } from "../theme";
import { CurrencyInput } from "./CurrencyInput";
import { Button } from "./Button";
import { formatDate } from "../utils/formatDate";

import { useFocusEffect, useRouter } from "expo-router";
import { TargetFormData, useTargetStore } from "../store/useTargetStore";
import { useTargetDatabase } from "../database/useTargetDatabase";
import { useTransactionsDatabase } from "../database/useTransactionsDatabase";
import { usePhotosDatabase } from "../database/usePhotosDatabase";

import { SafeAreaView } from "react-native-safe-area-context"; 
import { addDays } from "../utils/addDays";
import { getLocalPhotoUri } from "../utils/getLocalPhotoUri";
import { currenciesArray } from "../utils/currencyList";
import { useTranslations } from "../libs/i18n";

interface TargetFormProps {
  editting:boolean
  onEditColor: () => void;
  onEditPhoto: () => void;
  paramsId?: string| undefined;
}

export function TargetForm({
  editting,
  onEditColor,
  onEditPhoto,
  paramsId,
}: TargetFormProps) {
  const currencyDetails = {
    BRL: { symbol: "R$", name: "Real" },
    USD: { symbol: "$", name: "Dólar" },
    EUR: { symbol: "€", name: "Euro" },
  };

  const router = useRouter();
  const t = useTranslations();
  const {
    isLoading,
    fetchTarget,
    handleSubmit,
    deleteTarget,
    initializeNewTarget,
    resetStore,
    setTempTarget: setTargetData,
    tempTarget: targetData,
  } = useTargetStore(); 

  const targetDatabase = useTargetDatabase();
  const transactionsDatabase = useTransactionsDatabase();
  const photosDatabase = usePhotosDatabase();

  const [ isStartPickerVisible, setStartPickerVisible ] = useState(false);
  const [ isEndPickerVisible, setEndPickerVisible ] = useState(false);

  // Limpa o formulário ao sair da tela
  useEffect(() => {
    return () => {
      resetStore();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const { isInitialized, tempTarget } = useTargetStore.getState();

        // Se já estamos editando e os dados no formulário são do mesmo item, não fazemos nada.
        // Isso evita recarregar os dados ao voltar da seleção de foto/cor.
        if (editting && paramsId && String(tempTarget.id) === paramsId) {
          return;
        }

        if (editting && paramsId) {
          const fetchedData = await fetchTarget(paramsId, targetDatabase);
          if (fetchedData) {
            setTargetData({ ...fetchedData, photo: null });
          }
        } else if (!editting && !isInitialized) {
          initializeNewTarget(targetDatabase);
        }
      }
      loadData();
    }, [editting, paramsId])
  );

  const handleFormSubmit = () => {
    handleSubmit({ targetDatabase, transactionsDatabase, photosDatabase }, editting);
  };

  const handleDelete = () => {
    deleteTarget({ targetDatabase, transactionsDatabase, photosDatabase });
  };

  const handleSetData = (data: Partial<TargetFormData>) => {
    setTargetData(data);
  };

  const handleSetDate = (key: 'start_date' | 'end_date', date: Date) => {
    setTargetData({ [key]: date.getTime() });
  };
 
  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[100] }}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : undefined}

      >
         <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        keyboardShouldPersistTaps="handled"
      >
        <View>

 
        {/* Header */}
        <View style={[styles.header, { justifyContent: editting ? "space-between":"center" }]}>
          {editting && 
            <TouchableOpacity onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={colors.black} />
            </TouchableOpacity>
          }
          <Text style={styles.title}>{editting ? t.targetForm.editTitle : t.targetForm.newTitle}</Text>
          {editting &&
          <View style={{ width: 24 }} /> 
          }
        </View>

        {/* Nome da meta */}
        <View style={styles.row}>
          <View style={styles.inputSearchWrapper}>
            <TextInput
              style={styles.input}
              placeholder={t.targetForm.goalName}
              placeholderTextColor={colors.gray[400]}
              value={targetData.name}
              onChangeText={(name) => handleSetData({ name })}
              maxLength={22}
              editable={!isLoading}
            />
            <View style={styles.inputSearchMaxCounterWrapper}>
              <Text style={styles.charCount}>{targetData.name.length}/22</Text>
            </View>
          </View>

          <View style={styles.editButtonWrapper}>
            <TouchableOpacity
              onPress={onEditColor}
              style={[styles.editButton, { backgroundColor: targetData.color || colors.gray[300] }]}
              disabled={isLoading}
            >
              <Feather name="edit-3" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner */}
        <TouchableOpacity
          onPress={onEditPhoto}
          style={[
            styles.bannerUpload,
            (targetData.photo || targetData.photo_file_name) && { borderWidth: 0 },
            editting && { flex: 1 },
          ]}
          disabled={isLoading}
        >
          <View style={styles.bannerTextWrapper}>
            {targetData.photo || targetData.photo_file_name ? (
              <Image source={{ uri: targetData.photo ? targetData.photo.urls.regular : getLocalPhotoUri(targetData.photo_file_name!) }} style={styles.imagePreview} resizeMode="cover" />
            ) : (
              <>
                <Feather name="image" size={24} color={colors.gray[500]} />
                <Text style={styles.bannerText}>{t.targetForm.addImage}</Text>
              </>
            )}
          </View>
        </TouchableOpacity>

        {/* Seleção de moeda */}
             {!editting &&
              <View style={styles.currencyRow}>
                {currenciesArray.map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    style={[
                      styles.currencyButton,
                      targetData.currency === curr && styles.currencyButtonSelected,
                    ]}
                    onPress={() => handleSetData({ currency: curr })}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.currencyText,
                        targetData.currency === curr && styles.currencyTextSelected,
                      ]}
                    >
                      {`${curr} (${currencyDetails[curr].symbol})`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              }
        {/* Valores e datas */}
        <View>
          {/* Valores */}
          <View style={styles.valuesRow}>
            {!editting &&
            <View style={{ flex: 1 }}>
              <CurrencyInput
                prefix={
                  targetData.currency === "BRL"
                  ? "R$"
                  : targetData.currency === "USD"
                  ? "$"
                  : "€"
                }
                label={t.targetForm.initialBalance}
                value={targetData.current}
                onChangeValue={(current) => handleSetData({ current })}
                editable={!isLoading}
                />
            </View> }
            <View style={{ flex: 1 }}>
              <CurrencyInput
                prefix={
                  targetData.currency === "BRL"
                    ? "R$"
                    : targetData.currency === "USD"
                    ? "$"
                    : "€"
                }
                label={t.targetForm.goal}
                value={targetData.target}
                onChangeValue={(target) => handleSetData({ target })}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Datas */}
          <View style={styles.dateRow}>
                 {!editting && 
                
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{t.targetForm.startDate}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setStartPickerVisible(true)}
                disabled={isLoading}
              >
                <Text
                  style={[
                    styles.dateText,
                    targetData.start_date ? styles.dateTextActive : styles.dateTextInactive,
                  ]}
                >
                  {targetData.start_date ? formatDate(new Date(targetData.start_date)) : t.targetForm.selectDate}
                </Text>
              </TouchableOpacity>
            </View>
 }

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{t.targetForm.endDate}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setEndPickerVisible(true)}
                disabled={isLoading || (!editting && !targetData.start_date)}
              >
                <Text
                  style={[
                    styles.dateText,
                    targetData.end_date ? styles.dateTextActive : styles.dateTextInactive,
                  ]}
                >
                  {targetData.end_date ? formatDate(new Date(targetData.end_date)) : t.targetForm.selectDate}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isStartPickerVisible}
            mode="date"
            locale="pt-BR"
            date={new Date()}
            onConfirm={(date) => {
              handleSetDate('start_date', date);
              setStartPickerVisible(false);
            }}
            onCancel={() => setStartPickerVisible(false)}
            minimumDate={new Date()}
            disabled={isLoading}
          />

          <DateTimePickerModal
            isVisible={isEndPickerVisible}
            mode="date"
            locale="pt-BR"
            date={ addDays(new Date(targetData.start_date), 1)}
            onConfirm={(date) => {
              handleSetDate('end_date', date);
              setEndPickerVisible(false);
            }}
            onCancel={() => setEndPickerVisible(false)}
           /*  minimumDate={new Date(targetData.start_date) || undefined} */
            minimumDate={
              targetData.start_date
                ? addDays(new Date(targetData.start_date), 1)
                : undefined
            }
            disabled={isLoading || (!editting && !targetData.start_date)}
          />
        </View>

        {/* Botão */}
        <Button title={editting ? t.common.update : t.common.register} onPress={handleFormSubmit} isProcessing={isLoading} />

        {editting &&
        <Button title={t.common.delete} onPress={handleDelete} isProcessing={isLoading} type={'delete'}/>
        }
               </View>
        </ScrollView>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  currencyButtonSelected: {
    backgroundColor: colors.black,
    borderColor: colors.black,
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
     color: colors.gray[600],
    fontSize: 16,
    fontFamily: fontFamily.regular,
    marginBottom: 10,
  },
  input: {
    borderRadius: 40,
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