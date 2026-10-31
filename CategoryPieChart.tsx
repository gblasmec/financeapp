import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors, categoryColors } from '../theme/colors';
import { Entry, EntryType } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  entries: Entry[];
}

const screenWidth = Dimensions.get('window').width;

export default function CategoryPieChart({ entries }: Props) {
  const [mode, setMode] = useState<EntryType>('expense');

  const filtered = entries.filter((e) => e.type === mode);
  const totals: Record<string, number> = {};
  for (const entry of filtered) {
    totals[entry.category] = (totals[entry.category] || 0) + entry.amount;
  }

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return (
      <View style={styles.container}>
        <TabBar mode={mode} onToggle={setMode} />
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Sem {mode === 'expense' ? 'gastos' : 'ganhos'} por categoria
          </Text>
        </View>
      </View>
    );
  }

  const chartData = sorted.map(([cat, amount], i) => ({
    name: cat,
    amount,
    color: categoryColors[i % categoryColors.length],
    legendFontColor: colors.textSecondary,
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      <TabBar mode={mode} onToggle={setMode} />
      <PieChart
        data={chartData}
        width={screenWidth - 64}
        height={180}
        chartConfig={{
          color: () => colors.accent,
          labelColor: () => colors.textSecondary,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="8"
        absolute={false}
      />
      <View style={styles.list}>
        {sorted.slice(0, 5).map(([cat, amount], i) => {
          const total = sorted.reduce((s, [, v]) => s + v, 0);
          const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
          return (
            <View key={cat} style={styles.listItem}>
              <View style={styles.listLeft}>
                <View
                  style={[
                    styles.listDot,
                    { backgroundColor: categoryColors[i % categoryColors.length] },
                  ]}
                />
                <Text style={styles.listCat}>{cat}</Text>
              </View>
              <View style={styles.listRight}>
                <Text style={styles.listPct}>{pct}%</Text>
                <Text style={styles.listAmount}>{formatCurrency(amount)}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function TabBar({
  mode,
  onToggle,
}: {
  mode: EntryType;
  onToggle: (m: EntryType) => void;
}) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Por Categoria</Text>
      <View style={styles.tabs}>
        {(['expense', 'income'] as EntryType[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => onToggle(t)}
            style={[styles.tab, mode === t && styles.tabActive]}
          >
            <Text
              style={[
                styles.tabText,
                mode === t && {
                  color: t === 'expense' ? colors.expense : colors.income,
                },
              ]}
            >
              {t === 'expense' ? 'Gastos' : 'Ganhos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 2,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.cardAlt,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  list: { gap: 8, marginTop: 4 },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  listDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  listCat: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listRight: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  listPct: {
    fontSize: 12,
    color: colors.textMuted,
  },
  listAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  empty: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
