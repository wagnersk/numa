import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { colors, fontFamily } from "@/theme";
import { TransactionProps } from "@/store/useAnalysisStore";

interface Props {
  transactions: TransactionProps[];
  onViewAll: () => void;
  tabBarHeight: number; // New prop
  renderItem: React.ComponentType<{ item: TransactionProps }>;
}

export default function TransactionList({ 
  transactions, 
  onViewAll, 
  tabBarHeight, 
  renderItem: RenderItem 
}: Props) {
  
  return (
    <View style={[styles.container, { paddingBottom: tabBarHeight }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Transações</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAll}>Ver tudo</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}// Use tabBarHeight
        renderItem={({ item }) => <RenderItem item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
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