import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily } from '@/theme';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import TransactionDetailedItem from '@/components/TransactionIDetailedtem';
import { useTargetStore } from '@/store/useTargetStore';

export default function TransactionsScreen() {
  const { transactions, targets, selectedPill } = useAnalysisStore();
  const {  target } = useTargetStore();
  const insets = useSafeAreaInsets();
console.log(target)
  const filteredTransactions = useMemo(() => {
    if (selectedPill === 0) {
      return transactions;
    }
    const targetId = targets[selectedPill - 1]?.id;
    return transactions.filter((t) => t.target_id === targetId);
  }, [selectedPill, transactions, targets]);

  const selectedTargetName = selectedPill === 0 ? 'Todas as Metas' : targets[selectedPill - 1]?.pillName;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
                 <View >
                        <TouchableOpacity style={styles.backButton} onPress={router.back}>
                            <AntDesign name="arrowleft" size={24} color={colors.black} />
                        </TouchableOpacity>
                    </View>


        <Text style={styles.title}>Transações</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <Text style={styles.subtitle}>Exibindo transações para: {selectedTargetName}</Text>
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
