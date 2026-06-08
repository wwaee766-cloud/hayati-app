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
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { getColors } from '../constants/theme';

export const SavingsScreen: React.FC = () => {
  const { state, addGoal, deleteGoal, depositToGoal } = useAppContext();
  const colors = getColors(state.dark);
  const [modalVisible, setModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

  const styles = createStyles(colors);

  const formatNumber = (num: number) => {
    return num.toString().replace(/[0-9]/g, c => '٠١٢٣٤٥٦٧٨٩'[c as any]);
  };

  const handleAddGoal = async () => {
    if (!goalName.trim() || !goalTarget) {
      alert('أدخل البيانات بشكل صحيح');
      return;
    }

    await addGoal({
      name: goalName.trim(),
      target: parseFloat(goalTarget),
      current: parseFloat(goalCurrent || '0'),
      icon: '🎯',
    });

    setGoalName('');
    setGoalTarget('');
    setGoalCurrent('');
    setModalVisible(false);
  };

  const handleDeposit = async () => {
    if (!depositAmount || !selectedGoalId) return;
    await depositToGoal(selectedGoalId, parseFloat(depositAmount));
    setDepositAmount('');
    setDepositModalVisible(false);
    setSelectedGoalId(null);
  };

  const totalSavings = state.goals.reduce((a, g) => a + g.current, 0);
  const totalTarget = state.goals.reduce((a, g) => a + g.target, 0);
  const savingsPercent =
    totalTarget > 0 ? Math.min(100, Math.round((totalSavings / totalTarget) * 100)) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>الادخار والأهداف</Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.acc }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: '#fff', fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.acc }]}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>
            إجمالي المدخرات
          </Text>
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginVertical: 4 }}>
            {formatNumber(totalSavings.toFixed(0))} ر.س
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: savingsPercent + '%', backgroundColor: '#fff' },
              ]}
            />
          </View>
          <Text
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 11,
              marginTop: 6,
            }}
          >
            {formatNumber(savingsPercent)}٪ من الهدف السنوي ({formatNumber(totalTarget.toFixed(0))}
            ر.س)
          </Text>
        </View>

        {/* Goals List */}
        <Text style={styles.sectionTitle}>أهداف الادخار</Text>
        {state.goals.length === 0 ? (
          <Text style={styles.emptyState}>لا توجد أهداف ادخار</Text>
        ) : (
          state.goals.map(goal => {
            const percentage = Math.min(100, Math.round((goal.current / goal.target) * 100));
            const isComplete = goal.current >= goal.target;

            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalLeft}>
                    <Text style={{ fontSize: 24 }}>{goal.icon}</Text>
                    <View>
                      <Text style={styles.goalName}>{goal.name}</Text>
                      <Text style={styles.goalSub}>
                        {formatNumber(goal.current.toFixed(0))} /{' '}
                        {formatNumber(goal.target.toFixed(0))} ر.س
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => deleteGoal(goal.id)}>
                    <Text style={{ fontSize: 14, color: colors.txt3 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: percentage + '%',
                        backgroundColor: isComplete ? colors.grn : colors.acc,
                      },
                    ]}
                  />
                </View>

                <View style={styles.goalFooter}>
                  <Text
                    style={[
                      styles.percentageText,
                      { color: isComplete ? colors.grn : colors.acc },
                    ]}
                  >
                    {formatNumber(percentage)}٪
                  </Text>
                  <TouchableOpacity
                    style={[styles.depositBtn, { backgroundColor: colors.acc }]}
                    onPress={() => {
                      setSelectedGoalId(goal.id);
                      setDepositModalVisible(true);
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                      إضافة
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgCard }]}>
            <Text style={styles.modalTitle}>هدف ادخار جديد</Text>

            <Text style={styles.label}>اسم الهدف</Text>
            <TextInput
              style={[styles.input, { color: colors.txt1, borderColor: colors.brd2 }]}
              placeholder="مثال: سيارة جديدة"
              placeholderTextColor={colors.txt3}
              value={goalName}
              onChangeText={setGoalName}
            />

            <Text style={styles.label}>المبلغ المستهدف</Text>
            <TextInput
              style={[styles.input, { color: colors.txt1, borderColor: colors.brd2 }]}
              placeholder="0"
              placeholderTextColor={colors.txt3}
              keyboardType="decimal-pad"
              value={goalTarget}
              onChangeText={setGoalTarget}
            />

            <Text style={styles.label}>المبلغ الحالي</Text>
            <TextInput
              style={[styles.input, { color: colors.txt1, borderColor: colors.brd2 }]}
              placeholder="0"
              placeholderTextColor={colors.txt3}
              keyboardType="decimal-pad"
              value={goalCurrent}
              onChangeText={setGoalCurrent}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.bgSurf }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: colors.txt2 }}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.acc }]}
                onPress={handleAddGoal}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>حفظ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Deposit Modal */}
      <Modal visible={depositModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgCard }]}>
            <Text style={styles.modalTitle}>إضافة مبلغ</Text>

            <Text style={styles.label}>المبلغ</Text>
            <TextInput
              style={[styles.input, { color: colors.txt1, borderColor: colors.brd2 }]}
              placeholder="0.00"
              placeholderTextColor={colors.txt3}
              keyboardType="decimal-pad"
              value={depositAmount}
              onChangeText={setDepositAmount}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.bgSurf }]}
                onPress={() => setDepositModalVisible(false)}
              >
                <Text style={{ color: colors.txt2 }}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.acc }]}
                onPress={handleDeposit}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>إضافة</Text>
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
    summaryCard: {
      borderRadius: 16,
      padding: 16,
      marginVertical: 12,
    },
    progressBar: {
      height: 8,
      backgroundColor: 'rgba(0,0,0,0.15)',
      borderRadius: 4,
      overflow: 'hidden',
      marginVertical: 8,
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.txt3,
      textTransform: 'uppercase',
      marginVertical: 12,
    },
    goalCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.brd,
    },
    goalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    goalLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    goalName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.txt1,
    },
    goalSub: {
      fontSize: 12,
      color: colors.txt3,
      marginTop: 2,
    },
    goalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    percentageText: {
      fontSize: 14,
      fontWeight: '700',
    },
    depositBtn: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 8,
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
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.txt2,
      marginBottom: 8,
      marginTop: 12,
    },
    input: {
      paddingVertical: 10,
      paddingHorizontal: 13,
      borderRadius: 10,
      borderWidth: 1,
      backgroundColor: colors.bgInp,
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
