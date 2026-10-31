import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { getMonthName } from '../utils/format';

interface Props {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthNavigator({ year, month, onPrev, onNext }: Props) {
  const isCurrentMonth = () => {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() + 1 === month;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrev} style={styles.btn}>
        <Ionicons name="chevron-back" size={22} color={colors.accent} />
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.month}>{getMonthName(month)}</Text>
        <Text style={styles.year}>{year}</Text>
        {isCurrentMonth() && <View style={styles.dot} />}
      </View>
      <TouchableOpacity onPress={onNext} style={styles.btn}>
        <Ionicons name="chevron-forward" size={22} color={colors.accent} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  month: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.5,
  },
  year: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.income,
  },
});
