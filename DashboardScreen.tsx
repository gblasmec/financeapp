import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import MonthNavigator from '../components/MonthNavigator';
import SummaryCards from '../components/SummaryCards';
import DailyBarChart from '../components/DailyBarChart';
import CategoryPieChart from '../components/CategoryPieChart';
import EntryCard from '../components/EntryCard';
import { getEntriesByMonth, buildMonthlySummary, deleteEntry } from '../storage/db';
import { Entry, MonthlySummary } from '../types';

export default function DashboardScreen() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [summary, setSummary] = useState<MonthlySummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    days: [],
  });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await getEntriesByMonth(year, month);
    setEntries(data);
    setSummary(buildMonthlySummary(data, year, month));
  }, [year, month]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handlePrev = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
    await load();
  };

  const recent = entries.slice(0, 5);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerGreeting}>Controle</Text>
            <Text style={styles.headerTitle}>Financeiro</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>💰</Text>
          </View>
        </View>

        <MonthNavigator
          year={year}
          month={month}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <SummaryCards
          income={summary.totalIncome}
          expense={summary.totalExpense}
          balance={summary.balance}
        />

        <DailyBarChart days={summary.days} />

        <CategoryPieChart entries={entries} />

        {recent.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Últimos Lançamentos</Text>
            <View style={styles.entryList}>
              {recent.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDelete}
                  showDate
                />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: { flex: 1 },
  content: {
    padding: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  headerGreeting: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 24 },
  section: { gap: 12 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  entryList: { gap: 8 },
});
