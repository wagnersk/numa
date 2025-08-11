import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
import { colors } from "@/theme/colors";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontFamily } from "@/theme";
import { CurrencyInput } from "@/components/CurrencyInput";
import { useTargetStore } from "@/store/useImageStore";

export default function NewTarget() {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState<"BRL" | "USD" | "EUR">("BRL");
  const [startValue, setStartValue] = useState(0);
  const [goalValue, setGoalValue] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const color = useTargetStore((state) => state.target.color);
  const photo = useTargetStore((state) => state.target.photo);

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const currencies = ["BRL", "USD", "EUR"];

  function handleSave() {
    console.log({
      name,
      currency,
      startValue,
      goalValue,
      startDate,
      endDate,
      photo,
      color,
    });
    Alert.alert("Meta salva!", "Sua meta foi cadastrada com sucesso.");
  }

  function formatDate(date: Date | null) {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nova Meta</Text>
        </View>

        {/* Nome da meta */}
        <View style={styles.row}>
          <View style={styles.inputSearchWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Nome da meta"
              placeholderTextColor={colors.gray[400]}
              value={name}
              onChangeText={setName}
              maxLength={22}
            />
            <View style={styles.inputSearchMaxCounterWrapper}>
              <Text style={styles.charCount}>{name.length}/22</Text>
            </View>
          </View>

          <View style={styles.editButtonWrapper}>
            <TouchableOpacity
              onPress={() => router.navigate("/stack/target/select-color")}
              style={[styles.editButton, { backgroundColor: color }]}
            >
              <Feather name="edit-3" size={20} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner */}
        <TouchableOpacity
          onPress={() => router.navigate("/stack/target/select-image")}
          style={[styles.bannerUpload, photo && { borderWidth:0 }]}
        >
          <View style={styles.bannerTextWrapper}>
            {photo ? (
                <Image
                source={{ uri: photo.urls.regular }}
                style={styles.imagePreview}
                resizeMode="cover"
                />
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
          {currencies.map((curr) => (
            <TouchableOpacity
              key={curr}
              style={[
                styles.currencyButton,
                currency === curr && styles.currencyButtonSelected,
              ]}
              onPress={() => setCurrency(curr as any)}
            >
              <Text
                style={[
                  styles.currencyText,
                  currency === curr && styles.currencyTextSelected,
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
                  currency === "BRL" ? "R$" : currency === "USD" ? "$" : "€"
                }
                label="Saldo Inicial"
                value={startValue}
                onChangeValue={setStartValue}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CurrencyInput
                prefix={
                  currency === "BRL" ? "R$" : currency === "USD" ? "$" : "€"
                }
                label="Objetivo"
                value={goalValue}
                onChangeValue={setGoalValue}
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
              >
                <Text
                  style={[
                    styles.dateText,
                    startDate ? styles.dateTextActive : styles.dateTextInactive,
                  ]}
                >
                  {startDate ? formatDate(startDate) : "Selecionar data"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Fim</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setEndPickerVisible(true)}
                disabled={!startDate}
              >
                <Text
                  style={[
                    styles.dateText,
                    endDate ? styles.dateTextActive : styles.dateTextInactive,
                  ]}
                >
                  {endDate ? formatDate(endDate) : "Selecionar data"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <DateTimePickerModal
            isVisible={isStartPickerVisible}
            mode="date"
            locale="pt-BR"
            date={startDate || new Date()}
            onConfirm={(date) => {
              setStartDate(date);
              setStartPickerVisible(false);
            }}
            onCancel={() => setStartPickerVisible(false)}
            minimumDate={new Date()}
          />

          <DateTimePickerModal
            isVisible={isEndPickerVisible}
            mode="date"
            locale="pt-BR"
            date={endDate || new Date()}
            onConfirm={(date) => {
              setEndDate(date);
              setEndPickerVisible(false);
            }}
            onCancel={() => setEndPickerVisible(false)}
            minimumDate={startDate || undefined}
            disabled={!startDate}
          />
        </View>

        {/* Botão */}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.7}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },

  keyboardAvoiding: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
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
    paddingBottom:24
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

  saveButton: {
    backgroundColor: colors.gray[700],
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 20,
  },

  saveButtonText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: fontFamily.regular,
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



// Reutilize seu styles do componente original, não mudei nada aqui
 