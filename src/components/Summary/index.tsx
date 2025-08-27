import { View, Text, TouchableOpacity, Platform, ActionSheetIOS, Alert } from "react-native";
import { styles } from "./styles";
import { useTargetDatabase } from "@/database/useTargetDatabase";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { numberToCurrency } from "@/utils/numberToCurrency";
import { TargetProps, useAnalysisStore } from "@/store/useAnalysisStore"; 
import { colors, fontFamily } from "@/theme";
import { useTranslations } from "@/libs/i18n";
import { currenciesArray, CurrencyProps } from "@/utils/currencyList";

export function Summary() {
  const targetDatabase = useTargetDatabase();
  const t = useTranslations();

  const { 
    fetchTargetsByCurrency,
    setCurrencyType,
    currencyType,
  } = useAnalysisStore();

  const [targets, setTargets] = useState<TargetProps[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  async function fetchData() {
    const responseTargetData = await fetchTargetsByCurrency(targetDatabase, currencyType);
    setTargets(responseTargetData);
    setIsFetching(false);
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [currencyType]),
  );

  const handleCurrencySelect = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...currenciesArray, t.common.cancel],
          cancelButtonIndex: currenciesArray.length,
        },
        (buttonIndex) => {
          if (buttonIndex < currenciesArray.length) {
            setCurrencyType(currenciesArray[buttonIndex] as CurrencyProps);
          }
        }
      );
    } else {
      Alert.alert(
        t.summary.selectCurrency,
        "",
        currenciesArray.map((cur) => ({
          text: cur,
          onPress: () => setCurrencyType(cur),
        }))
      );
    }
  };

  const total = numberToCurrency(
    targets.reduce((sum, t) => sum + t.value, 0),
    currencyType
  );

  return (
    <View style={styles.container}>
      <View style={styles.infoWrapper}>
        <View style={[styles.valueWrapper, { alignItems: "flex-start" }]}>
          <TouchableOpacity onPress={handleCurrencySelect} style={{
            backgroundColor: colors.gray[700],
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 6,
            marginBottom: 6
          }}>
            <Text style={{
              color: colors.gray[100],
              fontSize: 14,
              fontFamily: fontFamily.medium
            }}>
              {currencyType}
            </Text>
          </TouchableOpacity>

          <Text style={styles.value}>{total}</Text>
          <Text style={styles.caption}>{t.summary.totalSaved}</Text>
        </View>

        <View style={styles.valueWrapper}>
          <Text style={styles.value}>{targets.length}</Text>
          <Text style={styles.caption}>{t.summary.activeGoals}</Text>
        </View>
      </View>
    </View>
  );
}