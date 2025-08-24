import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";
import TransactionItem from "../TransactionItem";
import { TransactionProps } from "@/app/tabs/analysis";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  transactions: TransactionProps[];
  onViewAll: () => void;
}

export default function TransactionList({ transactions, onViewAll }: Props) {
  const insets = useSafeAreaInsets();
  
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Transações</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>Ver tudo</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, {paddingBottom: insets.bottom + 96}]}
        renderItem={({ item }) => <TransactionItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.black,
  },
  viewAll: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.black,
  },
  listContent: {
    paddingVertical: 8,
    borderRadius: 8,
    width: "100%",

  },
});