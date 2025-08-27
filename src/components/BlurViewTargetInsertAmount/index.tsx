import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { BlurView } from 'expo-blur';
import Feather from '@expo/vector-icons/Feather';
import { useState } from "react";
import { CurrencyInput } from "../CurrencyInput";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { colors, fontFamily } from "@/theme";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase"; 
import { router } from "expo-router";
import { useTargetStore, TargetsData } from "@/store/useTargetStore";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTranslations } from "@/libs/i18n";

export type Props = {
  id: string
  data: TargetsData
  contrastColor: 'black' | 'white',
}

export default function BlurViewTargetInsertAmount({
  id,
  data,
  contrastColor,
}: Props) {
  const maxChars = 50
  const transactionsDatabase = useTransactionsDatabase()
  const targetDatabase = useTargetDatabase()
  const { saveTransaction, isLoading } = useTargetStore()
  const t = useTranslations();

  const [form, setForm] = useState({
    type: TransactionTypes.Input,
    reason: "",
    value: 0
  })

  function handleEditTarget(type: TransactionTypes) {
    setForm(prev => ({ ...prev, type }))
    console.log("Edit target with ID:", id);
  }

  async function handleSave() {
    await saveTransaction(
      Number(id),
      form.value,
      form.type === TransactionTypes.Input ? 'deposit' : 'withdraw',
      form.reason || null,
      { targetDatabase, transactionsDatabase }
    );
    setForm({ type: TransactionTypes.Input, reason: "", value: 0 }); // reset form
  }

  function handleChangeValue(current: number) {
    setForm(prev => ({ ...prev, value: current }))
  }

  const actionLabel =
    form.type === TransactionTypes.Input
      ? t.insertAmount.saveQuestion
      : t.insertAmount.withdrawQuestion;

  return (
    <View style={styles.container}>
      <BlurView intensity={100} tint="light" style={styles.blurContent}>
        <View style={styles.header}>
          <Text style={styles.goal}>{data.name}</Text>
          <Text style={styles.motivation}>{t.insertAmount.motivation}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, form.type === TransactionTypes.Input && { backgroundColor: colors.green[400] }]}
            onPress={() => handleEditTarget(TransactionTypes.Input)}
          >
            <Feather name="arrow-up" size={22} color="black" />
            <Text style={styles.buttonText}>{t.insertAmount.saveAction}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, form.type === TransactionTypes.Output && { backgroundColor: colors.red[400] }]}
            onPress={() => handleEditTarget(TransactionTypes.Output)}
          >
            <Feather name="arrow-down" size={22} color="black" />
            <Text style={styles.buttonText}>{t.insertAmount.withdrawAction}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountWrapper}>
          <CurrencyInput
            prefix={ data.currencyType === "BRL"
                    ? "R$"
                    : data.currencyType === "USD"
                    ? "$"
                    : "€"}
            value={form.value}
            onChangeValue={handleChangeValue}
            fontSize={20}
            label={actionLabel}
            height={48}
            borderRadius={12}
            borderWidth={2}
          />
        </View>

        <View style={styles.textAreaWrapper}>
          <Text style={styles.amountLabel}>{t.insertAmount.reason}</Text>
          <TextInput
            style={styles.textArea}
            placeholder={
              form.type === TransactionTypes.Input 
                ? t.insertAmount.reasonSavePlaceholder
                : t.insertAmount.reasonWithdrawPlaceholder
            }            
            placeholderTextColor={colors.gray[900]}
            value={form.reason}
            onChangeText={(text) => setForm(prev => ({ ...prev, reason: text }))}
            multiline
            maxLength={maxChars}
          />
          <Text style={styles.charCount}>
            {form.reason.length}/{maxChars}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>{t.common.save}</Text>
          )}
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurContent: {
    flex: 1,
    width: '100%',
    padding: 24,
    gap: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 16,
  },
  goal: {
    fontSize: 28,
    color: colors.black,
    fontFamily: fontFamily.medium,
  },
  motivation: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.gray[900],
    fontFamily: fontFamily.lightItalic,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fontFamily.medium,
  },
  amountWrapper: {
    width: '100%',
    gap: 8,
  },
  amountLabel: {
    fontSize: 18,
    color: colors.black,
    fontFamily: fontFamily.medium,
  },
  textAreaWrapper: {
    width: '100%',
    gap: 6,
  },
  textArea: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    fontFamily: fontFamily.regular,
    color: colors.black,
    height: 80,
    width: '100%',
    backgroundColor: colors.white,
  },
  charCount: {
    fontSize: 14,
    color: colors.gray[600],
    fontFamily: fontFamily.lightItalic,
    textAlign: 'right',
  },
  saveButton: {
    backgroundColor: colors.black,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    color: colors.white,
    fontFamily: fontFamily.medium,
  },
})