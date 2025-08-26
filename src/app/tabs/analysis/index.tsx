import { useNavigation, router, useFocusEffect } from "expo-router";
import { DrawerActions } from '@react-navigation/native';
import React, { useState, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActionSheetIOS, Platform, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useTransactionsDatabase } from "@/database/useTransactionsDatabase";
import { TransactionTypes } from "@/utils/TransactionTypes";
import { numberToCurrency } from "@/utils/numberToCurrency";
import ChartSection from "@/components/ChartSection";
import TransactionList from "@/components/TransactionList";
import TransactionFilterPills from "@/components/TransactionFilterPills";
import TransactionItem from "@/components/TransactionItem";
import { TargetProps, TransactionProps, useAnalysisStore } from "@/store/useAnalysisStore";
import { colors, fontFamily } from "@/theme";
import { currenciesArray, CurrencyProps } from "@/utils/currencyList";

export default function Analysis() {
  const insets = useSafeAreaInsets();

  const targetDatabase = useTargetDatabase();
  const transactionsDatabase = useTransactionsDatabase();
  const navigation = useNavigation();

  const bottomBarHeight = 100;

  const { 
    selectedPill, 
    setSelectedPill, 
    fetchTargetsByCurrency,
    fetchTransactionsByTargetsAllData,
    transactionFilter,
    setCurrencyType,
    currencyType,
  } = useAnalysisStore();

  const [isFetching, setIsFetching] = useState(true);
  const [targets, setTargets] = useState<TargetProps[]>([]);
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);

  async function fetchData() {
    setIsFetching(true);
    const responseTargetData = await fetchTargetsByCurrency(targetDatabase,currencyType);
    
    const target_ids = responseTargetData.map((target) => target.id);
    const responseTransactionsData = await fetchTransactionsByTargetsAllData(transactionsDatabase, responseTargetData,target_ids,currencyType);
    console.log(responseTransactionsData)
    setTargets(responseTargetData);
    setTransactions(responseTransactionsData);

    setIsFetching(false);
  }

  const handleCurrencySelect = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...currenciesArray, "Cancelar"],
          cancelButtonIndex: currenciesArray.length,
        },
        (buttonIndex) => {
          if (buttonIndex < currenciesArray.length) {
            setCurrencyType(currenciesArray[buttonIndex] as CurrencyProps);
          }
        }
      );
    } else {
      Alert.alert(
        "Selecione a Moeda",
        "",
        currenciesArray.map((cur) => ({
          text: cur,
          onPress: () => setCurrencyType(cur),
        }))
      );
    }
  };

  const total = numberToCurrency(
    targets.reduce((sum, t) => sum + t.value, 0),
    currencyType
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

  useFocusEffect(
    useCallback(() => {
      if (targetDatabase && transactionsDatabase) {
        fetchData();
      }
    }, [currencyType])
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.headerButton}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>Análise</Text>
          <TouchableOpacity onPress={handleCurrencySelect} style={styles.currencyButton}>
            <Text style={styles.currencyText}>{currencyType}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerButton} />
      </View>

      {targets && targets.length > 0 &&
        <ChartSection
          targets={targets}
          total={total}
          selectedPill={selectedPill}
          setSelectedPill={setSelectedPill}
          showPills={false}
        /> }

      <TransactionFilterPills />

      <TransactionList
        transactions={filteredTransactions}
        onViewAll={() => router.push(`stack/analysis/transactions`)}
        tabBarHeight={insets.bottom + bottomBarHeight}
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
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  currencyButton: {
    backgroundColor: colors.gray[700],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  currencyText: {
    color: colors.gray[100],
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
  headerButton: {
    width: 40,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: colors.black,
  },
});