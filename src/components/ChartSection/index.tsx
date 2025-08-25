import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { colors, fontFamily } from "@/theme";
import { TargetProps } from "@/store/useAnalysisStore";
  
interface Props {
  targets: TargetProps[];
  total: string;
  selectedPill: number;
  setSelectedPill: (index: number) => void;
  showPills?: boolean;
}

export default function ChartSection({ targets, total, selectedPill, setSelectedPill, showPills = true }: Props) {
  return (
    <View>
      <View style={styles.chartWrapper}>
        <PieChart
          data={targets}
          donut
          radius={100}
          innerRadius={60}
          innerCircleColor={colors.gray[300]}
          innerCircleBorderWidth={4}
          innerCircleBorderColor="white"
          strokeColor="white"
          strokeWidth={4}
          showText
          textSize={14}
          textColor={colors.black}
          showTextBackground
          textBackgroundColor={colors.gray[300]}
          textBackgroundRadius={12}
          font={fontFamily.light}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.chartValue}>{total}</Text>
              <Text style={styles.centerLabelText}>Total</Text>
            </View>
          )}
        />
      </View>

      {showPills && (
        <View style={styles.legendRow}>
          <TouchableOpacity
            onPress={() => setSelectedPill(0)}
            style={styles.legendButton}
          >
            <View style={[styles.legendColor, { backgroundColor: colors.gray[500] }]} />
            <Text
              style={[styles.legendText, selectedPill === 0 && styles.legendTextSelected]}
            >
              Todos
            </Text>
          </TouchableOpacity>

          {targets.map((item, index) => {
            const selected = selectedPill === index + 1;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedPill(index + 1)}
                style={styles.legendButton}
              >
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text
                  style={[styles.legendText, selected && styles.legendTextSelected]}
                >
                  {item.pillName || ""}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chartWrapper: { alignItems: "center", justifyContent: "center" },
  centerLabel: { alignItems: "center" },
  chartValue: {
    fontSize: 20,
    fontFamily: fontFamily.regular,
    color: colors.black,
  },
  centerLabelText: {
    color: colors.black,
    fontSize: 16,
  },
  legendRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
    flexWrap: "wrap",
    gap: 8,
  },
  legendButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  legendText: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.black,
  },
  legendTextSelected: {
    color: colors.black,
    textDecorationLine: "underline",
    fontFamily: fontFamily.bold,
  },
  legendColor: {
    height: 10,
    width: 10,
    marginRight: 4,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: colors.gray[700],
  },
});