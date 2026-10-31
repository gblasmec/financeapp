import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Entry } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

interface Props {
  entry: Entry;
  onDelete: (id: string) => void;
  showDate?: boolean;
}

const CATEGORY_ICONS: Record<string, string> = {
  Salário: 'briefcase',
  Freelance: 'laptop',
  Investimentos: 'trending-up',
  Aluguel: 'home',
  Bônus: 'gift',
  Alimentação: 'restaurant',
  Transporte: 'car',
  Moradia: 'home',
  Saúde: 'medkit',
  Lazer: 'game-controller',
  Educação: 'school',
  Vestuário: 'shirt',
  Assinaturas: 'repeat',
  Outros: 'ellipsis-horizontal',
};

export default function EntryCard({ entry, onDelete, showDate = false }: Props) {
  const isIncome = entry.type === 'income';
  const accentColor = isIncome ? colors.income : colors.expense;
  const iconName =
    (CATEGORY_ICONS[entry.category] as any) || 'ellipsis-horizontal';

  const handleDelete = () => {
    Alert.alert(
      'Excluir lançamento',
      `Tem certeza que quer excluir "${entry.description || entry.category}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => onDelete(entry.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, { borderLeftColor: accentColor }]}>
      <View style={[styles.iconBox, { backgroundColor: accentColor + '20' }]}>
        <Ionicons name={iconName as any} size={18} color={accentColor} />
      </View>
      <View style={styles.info}>
        <Text style={styles.category}>{entry.category}</Text>
        {entry.description ? (
          <Text style={styles.desc} numberOfLines={1}>{entry.description}</Text>
        ) : null}
        {showDate && (
          <Text style={styles.date}>{formatDate(entry.date)}</Text>
        )}
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: accentColor }]}>
          {isIncome ? '+' : '-'} {formatCurrency(entry.amount)}
        </Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={15} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  desc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  date: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: {
    fontSize: 15,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 4,
  },
});
