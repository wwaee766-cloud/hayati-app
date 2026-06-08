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

export const TasksScreen: React.FC = () => {
  const { state, addTask, deleteTask, toggleTask } = useAppContext();
  const colors = getColors(state.dark);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'عالية' | 'متوسطة' | 'منخفضة'>('متوسطة');
  const [category, setCategory] = useState('شخصي');

  const styles = createStyles(colors);

  const handleAdd = async () => {
    if (!title.trim()) {
      alert('أدخل عنوان المهمة');
      return;
    }

    await addTask({
      title: title.trim(),
      priority,
      cat: category,
      done: false,
    });

    setTitle('');
    setModalVisible(false);
  };

  const pendingTasks = state.tasks.filter(t => !t.done);
  const doneTasks = state.tasks.filter(t => t.done);

  const getPriorityColor = (pri: string) => {
    if (pri === 'عالية') return colors.red;
    if (pri === 'متوسطة') return colors.amb;
    return colors.grn;
  };

  const TaskItem = ({ task }: { task: any }) => (
    <View style={styles.taskItem}>
      <TouchableOpacity
        style={[styles.checkbox, task.done && { backgroundColor: colors.acc }]}
        onPress={() => toggleTask(task.id)}
      >
        {task.done && <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>}
      </TouchableOpacity>
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, task.done && { textDecorationLine: 'line-through', color: colors.txt3 }]}>
          {task.title}
        </Text>
        <Text style={styles.taskSub}>{task.cat}</Text>
      </View>
      <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
        <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
          {task.priority}
        </Text>
      </View>
      <TouchableOpacity onPress={() => deleteTask(task.id)}>
        <Text style={{ fontSize: 14, color: colors.txt3 }}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>المهام</Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.acc }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: '#fff', fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Pending Tasks */}
        <Text style={styles.sectionTitle}>معلقة</Text>
        {pendingTasks.length === 0 ? (
          <Text style={styles.emptyState}>لا توجد مهام معلقة</Text>
        ) : (
          pendingTasks.map(task => <TaskItem key={task.id} task={task} />)
        )}

        {/* Completed Tasks */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>مكتملة</Text>
        {doneTasks.length === 0 ? (
          <Text style={styles.emptyState}>لا توجد مهام مكتملة</Text>
        ) : (
          doneTasks.map(task => <TaskItem key={task.id} task={task} />)
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgCard }]}>
            <Text style={styles.modalTitle}>إضافة مهمة جديدة</Text>

            <Text style={styles.label}>عنوان المهمة</Text>
            <TextInput
              style={[styles.input, { color: colors.txt1, borderColor: colors.brd2 }]}
              placeholder="ماذا تريد أن تفعل؟"
              placeholderTextColor={colors.txt3}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>الأولوية</Text>
            <View style={styles.prioritySelector}>
              {(['عالية', 'متوسطة', 'منخفضة'] as const).map(pri => (
                <TouchableOpacity
                  key={pri}
                  style={[styles.priBtn, priority === pri && { backgroundColor: colors.acc }]}
                  onPress={() => setPriority(pri)}
                >
                  <Text style={{ color: priority === pri ? '#fff' : colors.txt2 }}>
                    {pri}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>التصنيف</Text>
            <View style={styles.categorySelector}>
              {['شخصي', 'مالي', 'عمل', 'صحة', 'التزام'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catBtn, category === cat && { backgroundColor: colors.acc }]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={{ color: category === cat ? '#fff' : colors.txt2, fontSize: 12 }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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
    sectionTitle: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.txt3,
      textTransform: 'uppercase',
      marginVertical: 12,
    },
    taskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: colors.brd,
      gap: 10,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: colors.brd2,
      backgroundColor: colors.bgSurf,
      justifyContent: 'center',
      alignItems: 'center',
    },
    taskInfo: {
      flex: 1,
    },
    taskTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.txt1,
    },
    taskSub: {
      fontSize: 12,
      color: colors.txt3,
      marginTop: 2,
    },
    priorityBadge: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
    },
    priorityText: {
      fontSize: 11,
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
    prioritySelector: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    priBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: colors.bgSurf,
      justifyContent: 'center',
      alignItems: 'center',
    },
    categorySelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    catBtn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: colors.bgSurf,
      borderWidth: 1,
      borderColor: colors.brd,
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
