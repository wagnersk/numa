import { useNavigation, router, useFocusEffect } from "expo-router";
import { DrawerActions } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { numberToCurrency } from "@/utils/numberToCurrency";
import ChartSection from "@/components/ChartSection";
import TransactionList from "@/components/TransactionList";
import TransactionFilterPills from "@/components/TransactionFilterPills";
import TransactionItem from "@/components/TransactionItem";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { colors, fontFamily } from "@/theme";

export default function Analysis() {
  const insets = useSafeAreaInsets();

  const targetDatabase = useTargetDatabase();
  const transactionsDatabase = useTransactionsDatabase();
	const navigation = useNavigation();

  const bottomBarHeight=100

  const { 
    targets, 
    transactions,
    selectedPill, 
    setSelectedPill, 
    fetchTargets,
    fetchTransactions,
    transactionFilter,
  } = useAnalysisStore();

  const [isFetching, setIsFetching] = useState(true);

  async function fetchData() {
    setIsFetching(true);
    const targetData = await fetchTargets(targetDatabase);
    await fetchTransactions(transactionsDatabase, targetData);
    setIsFetching(false);
  }

  useFocusEffect(
    useCallback(() => {
      if (targetDatabase && transactionsDatabase) {
        fetchData();
      }
    }, [])
  );

  const total = numberToCurrency(
    targets.reduce((sum, t) => sum + t.value, 0)
  );

  const filteredTransactions = useMemo(() => {
    const transactionsByTarget = selectedPill === 0
      ? transactions
      : transactions.filter(t => t.target_id === targets[selectedPill - 1]?.id);

    if (transactionFilter === 'all') {
      return transactionsByTarget;
    }
    const typeToFilter = transactionFilter === 'income' ? TransactionTypes.Input : TransactionTypes.Output;
    return transactionsByTarget.filter(t => t.type === typeToFilter);

  }, [selectedPill, transactionFilter, transactions, targets]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.headerButton}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Análise</Text>
        <View style={styles.headerButton} />
      </View>

      <ChartSection
        targets={targets}
        total={total}
        selectedPill={selectedPill}
        setSelectedPill={setSelectedPill}
        showPills={false}
      />

      <TransactionFilterPills />

      <TransactionList
        transactions={filteredTransactions}
        onViewAll={() => router.push(`stack/analysis/transactions`)}
        tabBarHeight={ insets.bottom + bottomBarHeight}
        renderItem={TransactionItem}
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
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  headerButton: {
    width: 40,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: colors.black,
  }
});