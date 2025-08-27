import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { colors, fontFamily } from "@/theme";
import { getLocalPhotoUri } from "@/utils/getLocalPhotoUri";
import { TransactionAllDataProps } from "@/store/useAnalysisStore";
import { Blurhash } from "react-native-blurhash";

export default function TransactionDetailedItem({ item }: { item: TransactionAllDataProps }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={styles.row}>
      {/* Foto com borda da cor da foto */}
      <View style={styles.leftSection}>
        {item.photo?.fileName ? (
          <View style={[styles.photoWrapper, { borderColor: item.photo.color || colors.gray[300] }]}>
            {!loaded && item.photo?.blurHash && (
              <Blurhash style={styles.photo} blurhash={item.photo.blurHash} />
            )}
            <Image
              source={{ uri: getLocalPhotoUri(item.photo.fileName) }}
              style={styles.photo}
              onLoadEnd={() => setLoaded(true)}
            />
          </View>
        ) : (
          <View
            style={[
              styles.photoPlaceholder,
              { borderColor: item.photo?.color || colors.gray[300] },
            ]}
          />
        )}
      </View>

      {/* Conteúdo central */}
      <View style={styles.centerSection}>
        <Text style={[styles.targetName, { color: item.color }]} numberOfLines={1}>
          {item.pillName || "—"}
        </Text>

        {item.description ? (
          <Text style={styles.description} numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
      </View>

      {/* Valor + data + seta */}
      <View style={styles.rightSection}>
        <View style={styles.amountRow}>
          <Text style={styles.amount}>{item.value}</Text>
          {item.type === "input" ? (
            <AntDesign name="arrowup" size={16} color={colors.green[400]} />
          ) : (
            <AntDesign name="arrowdown" size={16} color={colors.red[400]} />
          )}
        </View>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  leftSection: {
    marginRight: 10,
  },
  photoWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
  },
  photoPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: colors.gray[200],
  },
  centerSection: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 8,
  },
  targetName: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },
  description: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.gray[600],
    marginTop: 2,
  },
  rightSection: {
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: 100,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  amount: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    color: colors.black,
    textAlign: "right",
  },
  date: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.gray[700],
    marginTop: 2,
  },
});