import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { colors, fontFamily } from "@/theme";
import { TargetProps, useAnalysisStore } from "@/store/useAnalysisStore";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useFocusEffect } from "expo-router";

export default function LegendScreen(props:any) {

    const targetDatabase = useTargetDatabase();
    const { 
      selectedPill, 
      setSelectedPill, 
      fetchTargetsByCurrency,
      currencyType
    } = useAnalysisStore();

    const [ targets, setTargets ] = useState<TargetProps[]>([])
    const [isFetching, setIsFetching] = useState(true);
     async function fetchData() {
       setIsFetching(true);
       const responseTargetData = await fetchTargetsByCurrency(targetDatabase,currencyType);
       
       setTargets(responseTargetData)
   
       setIsFetching(false);
     }
   
     useFocusEffect(
       useCallback(() => {
         if (targetDatabase) {
           fetchData();
         }
       }, [currencyType])
     );
   
  
  return (
          <DrawerContentScrollView
          {...props}>
            <View>
              <Text style={styles.title}>Metas</Text>

              {targets && targets.length > 0 &&
              [{ pillName: "Todos", color: colors.gray[500], id: 0, value: 0, text: "",target:'' }, ...targets].map(
                (item, index) => {
                  const selected = selectedPill === index;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.item, selected && styles.itemSelected]}
                      onPress={() => setSelectedPill(index)}
                    >
                      <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                      <View style={styles.boxWrapper}>
                        <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                          {item.pillName} 
                        </Text>
                        <Text style={[styles.itemTargetText]}>
                              {index >0 && `${Number(item.text).toFixed(2)} de ${item.target}`}                     
                       </Text>
                      </View>
 
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
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.gray[700],
  },
  boxWrapper: {
    flexDirection:'column'
  },
  itemText: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  itemTargetText: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
    color: colors.gray[700],
  },
  itemTextSelected: {
    fontFamily: fontFamily.bold,
    textDecorationLine: "underline",
  },
});
