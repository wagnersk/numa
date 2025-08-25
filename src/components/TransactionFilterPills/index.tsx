import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAnalysisStore, TransactionFilter } from '@/store/useAnalysisStore';
import { colors, fontFamily } from '@/theme';

const filters: { label: string; value: TransactionFilter }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Entradas', value: 'income' },
  { label: 'Saídas', value: 'expense' },
];

export default function TransactionFilterPills() {
  const { transactionFilter, setTransactionFilter } = useAnalysisStore();
  const translateX = useSharedValue(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const pillWidth = containerWidth > 0 ? (containerWidth - 8) / 3 : 0;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    width: pillWidth,
  }));

  useEffect(() => {
    if (pillWidth === 0) return;
    let position = 0;
    if (transactionFilter === 'income') {
      position = pillWidth;
    } else if (transactionFilter === 'expense') {
      position = pillWidth * 2;
    }
    translateX.value = withSpring(position, { damping: 15 });
  }, [transactionFilter, translateX, pillWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      {pillWidth > 0 && <Animated.View style={[styles.animatedPill, animatedStyle]} />}
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.value}
          style={styles.pill}
          onPress={() => setTransactionFilter(filter.value)}
        >
          <Text
            style={[
              styles.pillText,
              transactionFilter === filter.value && styles.pillTextSelected,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.gray[200],
        borderRadius: 20,
        padding: 4,
        marginVertical: 16,
        position: 'relative',
    },
    animatedPill: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 4,
        borderRadius: 16, 
        backgroundColor: colors.white,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    pill: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        zIndex: 1,  
    },
    pillText: {
        fontFamily: fontFamily.regular,
        fontSize: 14,
        color: colors.gray[700],
    },
    pillTextSelected: {
        fontFamily: fontFamily.bold,
        color: colors.black,
    },
});
