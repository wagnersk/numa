import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { TargetAllDataProps, TargetProps, TransactionAllDataProps, TransactionProps, useAnalysisStore } from '@/store/useAnalysisStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily } from '@/theme';
import { router, useFocusEffect } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import TransactionDetailedItem from '@/components/TransactionIDetailedtem';
import { useTargetDatabase } from '@/database/useTargetDatabase';
import { useTransactionsDatabase } from '@/database/useTransactionsDatabase';
import TransactionFilterPills from '@/components/TransactionFilterPills';
import { TransactionTypes } from '@/utils/TransactionTypes';

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
    const targetDatabase = useTargetDatabase();
    const transactionsDatabase = useTransactionsDatabase();
    
    const { 
      selectedPill, 
      fetchTargetsByCurrency,
      currencyType,
      fetchTransactionsByTargetsAllData,
      transactionFilter
    } = useAnalysisStore();
    const [ targets, setTargets ] = useState<TargetProps[]>([])
    const [ transactions, setTransactions ] = useState<TransactionAllDataProps[]>([])
    const [ isFetching, setIsFetching] = useState(true);
      
    const selectedTargetName = selectedPill === 0 ? 'Todas as Metas' : targets[selectedPill - 1]?.pillName;


    async function fetchData() {
      setIsFetching(true);
      const responseTargetData = await fetchTargetsByCurrency(targetDatabase,currencyType);
      const target_ids = responseTargetData.map((target) => target.id);
      const responseTransactionsData =await fetchTransactionsByTargetsAllData(transactionsDatabase, responseTargetData,target_ids,currencyType);
  
      setTargets(responseTargetData)
      
      setTransactions(responseTransactionsData)
  
      setIsFetching(false);
    }
  

    
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
      }, [])
    );
  

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
          <View>


            <TouchableOpacity style={styles.backButton} onPress={router.back}>
                <AntDesign name="arrowleft" size={24} color={colors.black} />
            </TouchableOpacity>
            
        </View>

        
      <Text style={ styles.title }>Transações {currencyType}</Text>
        <View style={{ width: 50 }} />
      </View>
      <Text style={styles.subtitle}>Exibindo transações para: {selectedTargetName}</Text>
      <View  style={{ paddingHorizontal: 24 }}>
        <TransactionFilterPills />
      </View>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionDetailedItem item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
  },
  title: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    color: colors.black,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.gray[700],
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: colors.gray[200],
  },
  backButton: {
    position: 'absolute',
        top: -12,
        left: 0,
        zIndex: 10,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 48,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.gray[500],
  }
});
