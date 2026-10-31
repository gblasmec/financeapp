import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import EntryCard from '../components/EntryCard';
import MonthNavigator from '../components/MonthNavigator';
import { getEntriesByMonth, deleteEntry } from '../storage/db';
import { Entry } from '../types';
import { formatDate } from '../utils/format';

type Filter = 'all' | 'income' | 'expense';

export default function HistoryScreen() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [filter, setFilter] = useState<Filter>('all');

  const load = useCallback(async () => {
    const data = await getEntriesByMonth(year, month);
    setEntries(data);
  }, [year, month]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
    await load();
  };

  const handlePrev = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const handleNext = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const filtered = entries.filter((e) =>
    filter === 'all' ? true : e.type === filter
  );

  // Agrupa por data
  const grouped: { date: string; items: Entry[] }[] = [];
  const seen = new Set<string>();
  for (const entry of filtered) {
    if (!seen.has(entry.date)) {
      seen.add(entry.date);
      grouped.push({
        date: entry.date,
        items: filtered.filter((e) => e.date === entry.date),
      });
    }
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'income', label: 'Ganhos' },
    { key: 'expense', label: 'Gastos' },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Histórico</Text>
        <MonthNavigator
          year={year}
          month={month}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const color =
              f.key === 'income'
                ? colors.income
                : f.key === 'expense'
                ? colors.expense
                : colors.accent;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[
                  styles.filterBtn,
                  active && { backgroundColor: color + '20', borderColor: color },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    { color: active ? color : colors.textMuted },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {grouped.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Nenhum lançamento encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.group}>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>{formatDate(item.date)}</Text>
                <View style={styles.dateLine} />
                <Text style={styles.dateCount}>{item.items.length} item{item.items.length > 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.entries}>
                {item.items.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onDelete={handleDelete}
                  />
                ))}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingBottom: 12,
    gap: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    padding: 20,
    paddingTop: 8,
    gap: 20,
  },
  group: { gap: 10 },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dateCount: {
    fontSize: 11,
    color: colors.textMuted,
  },
  entries: { gap: 8 },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
  },
});
