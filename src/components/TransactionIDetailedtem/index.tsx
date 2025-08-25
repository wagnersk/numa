import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors, fontFamily } from "@/theme";
import { TransactionProps } from "@/store/useAnalysisStore";

export default function TransactionIDetailedtem({ item }: { item: TransactionProps }) {
  return (
    <View style={styles.row}>

    <View style={[styles.colorBar, { backgroundColor: item.color }]} />

      <View style={styles.content}>
        <View style={styles.left}>
          <Text
            style={[
              styles.name,
              !item.description && styles.placeholder,
            ]}
            numberOfLines={1}
          >
            {item.pillName || "—"}
          </Text>
        </View>
        <View style={styles.right}>
        <Text style={styles.amount}>{item.value}</Text>
            {item.type === "input" ? (
              <AntDesign name="arrowup" size={16} color={colors.green[400]} />
            ) : (
              <AntDesign name="arrowdown" size={16} color={colors.red[400]} />
            )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    borderRadius: 6,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  colorBar: {
    width: 6, 
    height: "100%"
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  left: { flexDirection: "row", 
    alignItems: "center", 
    gap: 6, 
    flexShrink: 1 
  },
  right: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 6, 
    flexShrink: 1 
  },
  name: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.black,
    flexShrink: 1,
  },
  placeholder: { 
    color: colors.gray[500], 
    fontStyle: "italic" 
  },
  amount: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.black,
    minWidth: 80,
    textAlign: "right",
  },
});