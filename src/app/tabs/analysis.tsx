import { router } from "expo-router";
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { fontFamily } from "@/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PieChart } from "react-native-gifted-charts";

export default function Analysis() {
    const [selectedPill, setSelectedPill] = useState(0);

    const pills = ["Pílula", "Pílula", "Pílula"];

    const pieData = [
        { value: 500, color: "#FF007F" },
        { value: 400, color: "#0066FF" },
        { value: 350, color: "#4CAF50" },
        { value: 200, color: "#9C27B0" },
        { value: 150, color: "#FFEB3B" },
        { value: 300, color: "#FF5722" },
        { value: 250, color: "#8BC34A" }
    ];

    const transactions = [
        { id: "1", name: "Nome da meta", color: "#00C853", amount: "+ R$ 250,00" },
        { id: "2", name: "Nome da meta", color: "#E91E63", amount: "+ R$ 250,00" },
        { id: "3", name: "Nome da meta", color: "#2962FF", amount: "+ R$ 250,00" },
        { id: "4", name: "Nome da meta", color: "#2962FF", amount: "+ R$ 250,00" },
        { id: "5", name: "Nome da meta", color: "#00C853", amount: "+ R$ 250,00" },
        { id: "6", name: "Nome da meta", color: "#FF9800", amount: "+ R$ 250,00" }
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.gray[100] }}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Análise</Text>
                </View>

                {/* Gráfico */}
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                    <PieChart
                        data={pieData}
                        donut
                        showText
                        textColor={colors.black}
                        textSize={20}
                        radius={100}
                        innerRadius={70}
                        innerCircleColor={colors.gray[100]}
                        centerLabelComponent={() => (
                            <Text style={styles.chartValue}>R$ 2.500</Text>
                        )}
                        focusOnPress
                        animationDuration={800}
                    />
                </View>

                {/* Botões pílula */}
                <View style={styles.pillsRow}>
                    {pills.map((pill, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.pill,
                                selectedPill === index && styles.pillSelected
                            ]}
                            onPress={() => setSelectedPill(index)}
                        >
                            <Text
                                style={[
                                    styles.pillText,
                                    selectedPill === index && styles.pillTextSelected
                                ]}
                            >
                                {pill}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Transações */}
                <View style={styles.transactionsHeader}>
                    <Text style={styles.transactionsTitle}>Transações</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAll}>Ver tudo</Text>
                    </TouchableOpacity>
                </View>

                {transactions.map(item => (
                    <View key={item.id} style={styles.transactionRow}>
                        <Text style={[styles.transactionName, { color: item.color }]}>
                            {item.name}
                        </Text>
                        <Text style={styles.transactionAmount}>{item.amount}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingBottom: 40
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        marginBottom: 20,
        justifyContent:'center'
    },
    title: {
        fontSize: 22,
        fontFamily: fontFamily.regular,
        color: colors.black
    },
    chartValue: {
        fontSize: 20,
        fontFamily: fontFamily.regular,
        color: colors.black
    },
    pillsRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
        marginBottom: 20
    },
    pill: {
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 50,
        backgroundColor: colors.gray[200]
    },
    pillSelected: {
        backgroundColor: colors.black
    },
    pillText: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        color: colors.black
    },
    pillTextSelected: {
        color: colors.white
    },
    transactionsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },
    transactionsTitle: {
        fontFamily: fontFamily.bold,
        fontSize: 18,
        color: colors.black
    },
    viewAll: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        color: colors.black
    },
    transactionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray[300]
    },
    transactionName: {
        fontFamily: fontFamily.regular,
        fontSize: 14
    },
    transactionAmount: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        color: colors.gray[700]
    }
});