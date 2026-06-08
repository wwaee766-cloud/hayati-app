import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { getColors, ICONS } from '../constants/theme';

export const TransactionsScreen: React.FC = () => {
  const { state, addTransaction, deleteTransaction } = useAppContext();
  const colors = getColors(state.dark);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('طعام');

  const styles = createStyles(colors);

  const expenseCategories = ['طعام', 'تنقل', 'تسوق', 'صحة', 'تعليم', 'ترفيه', 'فواتير', 'أخرى'];
  const incomeCategories = ['راتب', 'مكافأة', 'عمل حر', 'أخرى'];
  const categories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleAdd = async () => {
    if (!amount || !description) {
      alert('أدخل المبلغ والوصف');
      return;
    }

    await addTransaction({
      type,
      cat: category,
      desc: description,
      amount: parseFloat(amount),
      date: new Date().toLocaleDateString('ar-SA'),
    });

    setAmount('');
    setDescription('');
    setModalVisible(false);
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/[0-9]/g, c => '٠١٢٣٤٥٦٧٨٩'[c as any]);
  };

  const totalIncome = state.tx
    .filter(t => t.type === 'income')
    .reduce((a, t) => a + t.amount, 0);
  const totalExpense = state.tx
    .filter(t => t.type === 'expense')
    .reduce((a, t) => a + t.amount, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>المعاملات</Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.acc }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: '#fff', fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, { backgroundColor: colors.accLt }]}>
            <Text style={[styles.summaryLabel, { color: colors.accTxt }]}>الدخل</Text>
            <Text style={[styles.summaryAmount, { color: colors.acc }]}>
              {formatNumber(totalIncome.toFixed(0))}
            </Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.redLt }]}>
            <Text style={[styles.summaryLabel, { color: colors.redTxt }]}>المصروف</Text>
            <Text style={[styles.summaryAmount, { color: colors.red }]}>
              {formatNumber(totalExpense.toFixed(0))}
            </Text>
          </View>
        </View>

        {/* Transactions List */}
        <Text style={styles.sectionTitle}>كل المعاملات</Text>
        {state.tx.length === 0 ? (
          <Text style={styles.emptyState}>لا توجد معاملات</Text>
        ) : (
          state.tx
            .slice()
            .reverse()
            .map(tx => (
              <View key={tx.id} style={styles.txCard}>
                <View style={styles.txLeft}>
                  <Text style={styles.txIcon}>
                    {ICONS[tx.cat as keyof typeof ICONS] || '📦'}
                  </Text>
                  <View style={styles.txInfo}>
                    <Text style={styles.txDesc}>{tx.desc}</Text>
                    <Text style={styles.txSub}>{tx.cat}</Text>
                  </View>
                </View>
                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      { color: tx.type === 'expense' ? colors.red : colors.acc },
                    ]}
                  >
                    {tx.type === 'expense' ? '−' : '+'}
                    {formatNumber(tx.amount.toFixed(0))}
                  </Text>
                  <TouchableOpacity
                    onPress={() => deleteTransaction(tx.id)}
                  >
                    <Text style={{ fontSize: 14, color: colors.txt3 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgCard }]}>
            <Text style={styles.modalTitle}>إضافة معاملة</Text>

            {/* Type Selector */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === 'expense' && { backgroundColor: colors.red },
                ]}
                onPress={() => setType('expense')}
              >
                <Text style={{ color: type === 'expense' ? '#fff' : colors.txt2 }}>
                  مصروف
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeBtn,
                  type === 'income' && { backgroundColor: colors.acc },
                ]}
                onPress={() => setType('income')}
              >
                <Text style={{ color: type === 'income' ? '#fff' : colors.txt2 }}>
                  دخل
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category */}
            <Text style={styles.label}>التصنيف</Text>
            <View style={styles.categoryGrid}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBtn,
                    category === cat && { backgroundColor: colors.acc },
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={{
                      color: category === cat ? '#fff' : colors.txt2,
                      fontSize: 12,
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Amount */}
            <Text style={styles.label}>المبلغ</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.brd2, color: colors.txt1 }]}
              placeholder="0.00"
              placeholderTextColor={colors.txt3}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            {/* Description */}
            <Text style={styles.label}>الوصف</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.brd2, color: colors.txt1 }]}
              placeholder="اكتب الوصف"
              placeholderTextColor={colors.txt3}
              value={description}
              onChangeText={setDescription}
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.bgSurf }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: colors.txt2 }}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.acc }]}
                onPress={handleAdd}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>حفظ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 4,
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.txt1,
    },
    addBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    summaryGrid: {
      flexDirection: 'row',
      gap: 8,
      marginVertical: 12,
    },
    summaryCard: {
      flex: 1,
      padding: 14,
      borderRadius: 12,
    },
    summaryLabel: {
      fontSize: 12,
      fontWeight: '600',
      marginBottom: 6,
    },
    summaryAmount: {
      fontSize: 18,
      fontWeight: '700',
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.txt3,
      textTransform: 'uppercase',
      marginVertical: 12,
    },
    txCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: colors.brd,
    },
    txLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    txIcon: {
      fontSize: 24,
      width: 38,
      height: 38,
      lineHeight: 38,
      textAlign: 'center',
      backgroundColor: colors.bgSurf,
      borderRadius: 10,
    },
    txInfo: {
      flex: 1,
    },
    txDesc: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.txt1,
    },
    txSub: {
      fontSize: 12,
      color: colors.txt3,
      marginTop: 2,
    },
    txRight: {
      alignItems: 'flex-end',
      gap: 6,
    },
    txAmount: {
      fontSize: 15,
      fontWeight: '600',
    },
    emptyState: {
      color: colors.txt3,
      fontSize: 13,
      textAlign: 'center',
      paddingVertical: 20,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      padding: 20,
      paddingBottom: 40,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.txt1,
      marginBottom: 14,
      textAlign: 'center',
    },
    typeSelector: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 16,
    },
    typeBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.bgSurf,
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.txt2,
      marginBottom: 8,
      marginTop: 12,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    categoryBtn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: colors.bgSurf,
      borderWidth: 1,
      borderColor: colors.brd,
    },
    input: {
      paddingVertical: 10,
      paddingHorizontal: 13,
      borderRadius: 10,
      borderWidth: 1,
      backgroundColor: colors.bgInp,
      color: colors.txt1,
      marginBottom: 12,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 16,
    },
    btn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
