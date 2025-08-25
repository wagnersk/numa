import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { colors, fontFamily } from "@/theme";
import { useAnalysisStore } from "@/store/useAnalysisStore";
import { DrawerContentScrollView } from "@react-navigation/drawer";

export default function LegendScreen(props:any) {
  const { targets, selectedPill, setSelectedPill } = useAnalysisStore();
  return (
          <DrawerContentScrollView
          {...props}>
            <View>
              <Text style={styles.title}>Metas</Text>

              {[{ pillName: "Todos", color: colors.gray[500], id: 0, value: 0, text: "" }, ...targets].map(
                (item, index) => {
                  const selected = selectedPill === index;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.item, selected && styles.itemSelected]}
                      onPress={() => setSelectedPill(index)}
                    >
                      <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                      <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                        {item.pillName}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
          </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
    paddingHorizontal: 16,
    paddingBottom: 16,
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
    paddingHorizontal: 16,
    gap: 8,
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
