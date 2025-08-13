// /stack/target/select-color.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme";
import { useTargetStore } from "@/store/useImageStore";
import { colorsList } from "@/app/utils/colorList";

export default function SelectColorScreen() {
  const router = useRouter();
   const setSelectedPhoto = useTargetStore((state) => state.setTempTarget);
  


  const [color, setColor] = useState<string | null>(null)

  const handleOk = () => {
    if (color) {
      setSelectedPhoto({color})
      // Aqui você pode salvar no estado global, context ou router params
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.title}>Selecione uma cor</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Lista de cores */}
      <FlatList
        data={colorsList}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.colorBox,
              { backgroundColor: item },
              color === item && styles.selectedBox,
            ]}
            onPress={() => setColor(item)}
          />
        )}
      />

      {/* Botão Ok */}
      <TouchableOpacity
        style={[styles.okButton, !color && styles.okButtonDisabled]}
        disabled={!color}
        onPress={handleOk}
      >
        <Text style={styles.okText}>Ok</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    paddingHorizontal: 24,
    gap: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  grid: {
    paddingVertical: 10,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  colorBox: {
    width: "48%",
    height: 128,
    borderRadius: 10,
  },
  selectedBox: {
    borderWidth: 3,
    borderColor: colors.black,
  },
  okButton: {
    backgroundColor: colors.gray[700],
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  okButtonDisabled: {
    opacity: 0.5,
  },
  okText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "500",
  },
});