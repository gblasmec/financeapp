import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../theme/colors';
import { Entry, EntryType } from '../types';
import { saveEntry } from '../storage/db';
import { getTodayString, parseAmountInput } from '../utils/format';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

export default function AddEntryScreen() {
  const [type, setType] = useState<EntryType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [saving, setSaving] = useState(false);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const accentColor = type === 'income' ? colors.income : colors.expense;

  const handleSave = async () => {
    if (!amount || parseAmountInput(amount) <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor maior que zero.');
      return;
    }
    if (!category) {
      Alert.alert('Categoria', 'Selecione uma categoria.');
      return;
    }
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Data inválida', 'Use o formato YYYY-MM-DD.');
      return;
    }

    setSaving(true);
    const entry: Entry = {
      id: uuidv4(),
      type,
      amount: parseAmountInput(amount),
      category,
      description: description.trim(),
      date,
      createdAt: Date.now(),
    };

    try {
      await saveEntry(entry);
      setAmount('');
      setDescription('');
      setCategory('');
      setDate(getTodayString());
      Alert.alert('Salvo!', 'Lançamento adicionado com sucesso.', [
        { text: 'OK' },
      ]);
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Novo Lançamento</Text>

        {/* Toggle tipo */}
        <View style={styles.typeRow}>
          {(['expense', 'income'] as EntryType[]).map((t) => {
            const active = type === t;
            const color = t === 'income' ? colors.income : colors.expense;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => { setType(t); setCategory(''); }}
                style={[
                  styles.typeBtn,
                  active && { backgroundColor: color + '20', borderColor: color },
                ]}
              >
                <Ionicons
                  name={t === 'income' ? 'arrow-down-circle' : 'arrow-up-circle'}
                  size={20}
                  color={active ? color : colors.textMuted}
                />
                <Text
                  style={[
                    styles.typeBtnText,
                    { color: active ? color : colors.textMuted },
                  ]}
                >
                  {t === 'income' ? 'Ganho' : 'Gasto'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Valor */}
        <View style={styles.field}>
          <Text style={styles.label}>Valor (R$)</Text>
          <View style={[styles.amountBox, { borderColor: accentColor + '60' }]}>
            <Text style={[styles.amountPrefix, { color: accentColor }]}>R$</Text>
            <TextInput
              style={[styles.amountInput, { color: accentColor }]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0,00"
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Categoria */}
        <View style={styles.field}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.catGrid}>
            {categories.map((cat) => {
              const active = category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={[
                    styles.catBtn,
                    active && {
                      backgroundColor: accentColor + '20',
                      borderColor: accentColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.catText,
                      { color: active ? accentColor : colors.textSecondary },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.field}>
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={styles.textInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Almoço no trabalho"
            placeholderTextColor={colors.textMuted}
            maxLength={120}
          />
        </View>

        {/* Data */}
        <View style={styles.field}>
          <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
          <TextInput
            style={styles.textInput}
            value={date}
            onChangeText={setDate}
            placeholder="2025-01-15"
            placeholderTextColor={colors.textMuted}
            maxLength={10}
          />
        </View>

        {/* Botão salvar */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: accentColor }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={22} color="#fff" />
          <Text style={styles.saveBtnText}>
            {saving ? 'Salvando...' : 'Salvar Lançamento'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
    letterSpacing: -0.5,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  typeBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  field: { gap: 10 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    gap: 8,
  },
  amountPrefix: {
    fontSize: 22,
    fontWeight: '700',
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '800',
    paddingVertical: 14,
    letterSpacing: -1,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  catText: {
    fontSize: 13,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 8,
  },
  saveBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
