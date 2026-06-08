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
import { getColors, NOTE_COLORS } from '../constants/theme';

export const NotesScreen: React.FC = () => {
  const { state, addNote, deleteNote } = useAppContext();
  const colors = getColors(state.dark);
  const noteColors = NOTE_COLORS[state.dark ? 'dark' : 'light'];
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [noteColor, setNoteColor] = useState<keyof typeof noteColors>('teal');

  const styles = createStyles(colors);

  const handleAdd = async () => {
    if (!title.trim()) {
      alert('أدخل عنوان الملاحظة');
      return;
    }

    await addNote({
      title: title.trim(),
      body: body.trim(),
      col: noteColor,
    });

    setTitle('');
    setBody('');
    setNoteColor('teal');
    setModalVisible(false);
  };

  const NoteCard = ({ note }: { note: any }) => {
    const c = noteColors[note.col];
    return (
      <View
        style={[
          styles.noteCard,
          { backgroundColor: c.bg, borderColor: c.txt + '30' },
        ]}
      >
        <View style={styles.noteHeader}>
          <Text style={[styles.noteTitle, { color: c.txt }]}>{note.title}</Text>
          <TouchableOpacity onPress={() => deleteNote(note.id)}>
            <Text style={{ fontSize: 14, color: c.txt, opacity: 0.6 }}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[styles.noteBody, { color: c.txt, opacity: 0.8 }]}
          numberOfLines={3}
        >
          {note.body}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>الملاحظات</Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.acc }]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: '#fff', fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Notes Grid */}
        {state.notes.length === 0 ? (
          <Text style={styles.emptyState}>لا توجد ملاحظات</Text>
        ) : (
          <View style={styles.notesGrid}>
            {state.notes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.bgCard }]}>
            <Text style={styles.modalTitle}>ملاحظة جديدة</Text>

            <Text style={styles.label}>العنوان</Text>
            <TextInput
              style={[styles.input, { color: colors.txt1, borderColor: colors.brd2 }]}
              placeholder="عنوان الملاحظة"
              placeholderTextColor={colors.txt3}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>المحتوى</Text>
            <TextInput
              style={[styles.input, { color: colors.txt1, borderColor: colors.brd2, height: 100 }]}
              placeholder="اكتب ملاحظتك"
              placeholderTextColor={colors.txt3}
              multiline
              value={body}
              onChangeText={setBody}
            />

            <Text style={styles.label}>اللون</Text>
            <View style={styles.colorPicker}>
              {(Object.keys(noteColors) as Array<keyof typeof noteColors>).map(col => (
                <TouchableOpacity
                  key={col}
                  style={[
                    styles.colorOption,
                    { backgroundColor: noteColors[col].bg },
                    noteColor === col && { borderWidth: 3, borderColor: colors.acc },
                  ]}
                  onPress={() => setNoteColor(col)}
                />
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
    notesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      paddingBottom: 20,
    },
    noteCard: {
      width: '48%',
      minHeight: 120,
      borderRadius: 12,
      padding: 13,
      borderWidth: 1,
    },
    noteHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 7,
    },
    noteTitle: {
      fontSize: 14,
      fontWeight: '600',
      flex: 1,
    },
    noteBody: {
      fontSize: 12,
      lineHeight: 18,
    },
    emptyState: {
      color: colors.txt3,
      fontSize: 13,
      textAlign: 'center',
      paddingVertical: 40,
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
      color: colors.txt1,
      marginBottom: 12,
    },
    colorPicker: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 16,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: 'transparent',
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
