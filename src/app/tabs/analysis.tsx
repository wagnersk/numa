import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fontFamily } from "@/theme";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { numberToCurrency } from "@/utils/numberToCurrency";
import dayjs from "dayjs";
import ChartSection from "@/components/ChartSection";
import TransactionList from "@/components/TransactionList";

export type TargetProps = {
  id: number;
  value: number;
  color: string;
  text: string;
  pillName: string;
};

export type TransactionProps = {
  color: string;
  text: string;
  pillName: string;
  value: string;
  id: string;
  target_id: number;
  date: string;
  description?: string;
  type: TransactionTypes;
};

export default function Analysis() {
  const insets = useSafeAreaInsets();

  const targetDatabase = useTargetDatabase();
  const transactionsDatabase = useTransactionsDatabase();

  const [transactions, setTransactions] = useState<TransactionProps[]>([]);
  const [targets, setTargets] = useState<TargetProps[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedPill, setSelectedPill] = useState(0);

  async function fetchTargets(): Promise<TargetProps[]> {
    try {
      const response = await targetDatabase.showAll();
      return response.map((item) => ({
        id: item.id,
        value: item.current,
        color: item.color,
        text: String(item.current),
        pillName: item.name,
      }));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as metas.");
      return [];
    }
  }

  async function fetchTransactions() {
    try {
      const response = await transactionsDatabase.listAll();
      return response.map((item) => ({
        id: String(item.id),
        target_id: item.target_id,
        value: numberToCurrency(item.amount),
        date: dayjs(item.created_at).format("DD/MM/YYYY [às] HH:mm"),
        description: item.observation ?? null,
        type: item.amount < 0 ? TransactionTypes.Output : TransactionTypes.Input,
      }));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar as transações.");
      return [];
    }
  }

  async function fetchData() {
    const [targetData, transactionsData] = await Promise.all([
      fetchTargets(),
      fetchTransactions(),
    ]);

    setTargets(targetData);

    const formattedTransactions = transactionsData.map((t) => {
      const target = targetData.find((tg) => tg.id === t.target_id);
      return {
        ...t,
        color: target?.color || colors.black,
        text: target?.text || "",
        value: numberToCurrency(target?.value || 0),
        pillName:target.pillName
      };
    });

    setTransactions(formattedTransactions);
    setIsFetching(false);
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const total = numberToCurrency(
    targets.reduce((sum, t) => sum + t.value, 0)
  );

  const filteredTransactions = useMemo(() => {
    if (selectedPill === 0) return transactions;
    const id = targets[selectedPill - 1]?.id;
    return transactions.filter((t) => t.target_id === id);
  }, [selectedPill, transactions, targets]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Análise</Text>
      </View>
      <TouchableOpacity onPress={() => router.push("/drawer/legend")}>
      <Text style={{ color: "blue" }}>Ver lista completa</Text>
    </TouchableOpacity>

      <ChartSection
        targets={targets}
        total={total}
        selectedPill={selectedPill}
        setSelectedPill={setSelectedPill}
      />

      <TransactionList
        transactions={filteredTransactions}
        onViewAll={() => router.push(`stack/analysis/transactions`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
    paddingHorizontal: 24,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: fontFamily.regular,
    color: colors.black,

  },
});