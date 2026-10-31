import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors } from '../theme/colors';
import { DailySummary } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  days: DailySummary[];
}

const screenWidth = Dimensions.get('window').width;

export default function DailyBarChart({ days }: Props) {
  // Filtra apenas dias com movimento
  const activeDays = days.filter((d) => d.income > 0 || d.expense > 0);

  if (activeDays.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📊</Text>
        <Text style={styles.emptyText}>Nenhum lançamento ainda</Text>
        <Text style={styles.emptySubtext}>Adicione ganhos e gastos na aba +</Text>
      </View>
    );
  }

  const chartData = {
    labels: activeDays.map((d) => d.label),
    datasets: [
      {
        data: activeDays.map((d) => Math.abs(d.balance)),
        colors: activeDays.map((d) =>
          d.balance >= 0
            ? (opacity = 1) => `rgba(0, 214, 143, ${opacity})`
            : (opacity = 1) => `rgba(255, 71, 87, ${opacity})`
        ),
      },
    ],
  };

  const barWidth = Math.max(screenWidth - 32, activeDays.length * 36);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Balanço Diário</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.income }]} />
            <Text style={styles.legendText}>Positivo</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
            <Text style={styles.legendText}>Negativo</Text>
          </View>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={chartData}
          width={Math.max(barWidth, 300)}
          height={180}
          withCustomBarColorFromData
          flatColor
          showBarTops={false}
          fromZero
          chartConfig={{
            backgroundColor: 'transparent',
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(75, 123, 236, ${opacity})`,
            labelColor: () => colors.textSecondary,
            style: { borderRadius: 16 },
            propsForLabels: { fontSize: 10 },
            barPercentage: 0.7,
          }}
          style={styles.chart}
          yAxisLabel="R$"
          yAxisSuffix=""
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.3,
  },
  legend: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  chart: {
    borderRadius: 12,
    marginTop: 4,
  },
  empty: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  emptyIcon: { fontSize: 40 },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
