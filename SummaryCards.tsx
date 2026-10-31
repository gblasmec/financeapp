import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { formatCurrency } from '../utils/format';

interface Props {
  income: number;
  expense: number;
  balance: number;
}

export default function SummaryCards({ income, expense, balance }: Props) {
  const balanceColor = balance >= 0 ? colors.income : colors.expense;

  return (
    <View style={styles.wrapper}>
      {/* Saldo principal */}
      <View style={[styles.balanceCard, { borderColor: balanceColor + '40' }]}>
        <Text style={styles.balanceLabel}>Saldo do Mês</Text>
        <Text style={[styles.balanceValue, { color: balanceColor }]}>
          {formatCurrency(balance)}
        </Text>
        <View style={[styles.balanceBar, { backgroundColor: balanceColor + '30' }]}>
          <Text style={[styles.balanceBarText, { color: balanceColor }]}>
            {balance >= 0 ? '▲ no positivo' : '▼ no negativo'}
          </Text>
        </View>
      </View>

      {/* Cards menores */}
      <View style={styles.row}>
        <View style={[styles.smallCard, { borderColor: colors.income + '40' }]}>
          <View style={[styles.iconBox, { backgroundColor: colors.incomeLight }]}>
            <Ionicons name="arrow-down-circle" size={20} color={colors.income} />
          </View>
          <Text style={styles.smallLabel}>Ganhos</Text>
          <Text style={[styles.smallValue, { color: colors.income }]}>
            {formatCurrency(income)}
          </Text>
        </View>

        <View style={[styles.smallCard, { borderColor: colors.expense + '40' }]}>
          <View style={[styles.iconBox, { backgroundColor: colors.expenseLight }]}>
            <Ionicons name="arrow-up-circle" size={20} color={colors.expense} />
          </View>
          <Text style={styles.smallLabel}>Gastos</Text>
          <Text style={[styles.smallValue, { color: colors.expense }]}>
            {formatCurrency(expense)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 12 },
  balanceCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  balanceLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
  },
  balanceBar: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  balanceBarText: {
    fontSize: 12,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  smallCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 6,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  smallLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  smallValue: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
