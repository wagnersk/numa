// app/drawer/legend.tsx  (se estiver usando expo-router)
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { colors, fontFamily } from "@/theme";
import { TargetProps } from "@/app/tabs/analysis";

interface Props {
  targets: TargetProps[];
  selectedPill: number;
  setSelectedPill: (index: number) => void;
}

export default function LegendScreen({ targets, selectedPill, setSelectedPill }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metas</Text>

      <FlatList
        data={[{ pillName: "Todos", color: colors.gray[500], id: 0 }, ...targets]}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item, index }) => {
          const selected = selectedPill === index;
          return (
            <TouchableOpacity
              style={[styles.item, selected && styles.itemSelected]}
              onPress={() => setSelectedPill(index)}
            >
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
              <Text
                style={[styles.itemText, selected && styles.itemTextSelected]}
              >
                {item.pillName}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
    marginBottom: 16,
    color: colors.black,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[300],
  },
  itemSelected: {
    backgroundColor: colors.gray[200],
    borderRadius: 8,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.gray[700],
  },
  itemText: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  itemTextSelected: {
    fontFamily: fontFamily.bold,
    textDecorationLine: "underline",
  },
});