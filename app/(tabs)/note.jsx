import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Alert, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const STORAGE_KEY = '@notes';

const Note = () => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) setNotes(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addOrSave = () => {
    if (!newTitle.trim() || !newText.trim()) return;

    if (editingId) {
      setNotes(prev =>
        prev.map(n =>
          n.id === editingId
            ? { ...n, title: newTitle, text: newText, updated: Date.now() }
            : n
        )
      );
      setEditingId(null);
    } else {
      setNotes(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          title: newTitle,
          text: newText,
          updated: Date.now()
        }
      ]);
    }

    setNewTitle('');
    setNewText('');
  };

  const editNote = note => {
    setNewTitle(note.title);
    setNewText(note.text);
    setEditingId(note.id);
    setModalVisible(false);
  };

  const deleteNote = id => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: () => {
          setNotes(prev => prev.filter(n => n.id !== id));
          setModalVisible(false);
        }
      }
    ]);
  };

  const openModal = note => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('(auth)/sign-in'); // Navigate to your login screen
  };

  const handleCustomize = () => {
    setSettingsVisible(false);
    navigation.navigate('Customize'); // Customize screen route
  };

  const getRandomNoteColor = () => {
    const colors = ['#FFF9E6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Enter note title"
        value={newTitle}
        onChangeText={setNewTitle}
        style={styles.inputTitle}
      />
      <TextInput
        placeholder="Enter note description"
        value={newText}
        onChangeText={setNewText}
        multiline
        style={styles.inputText}
      />
      <TouchableOpacity style={styles.saveBtn} onPress={addOrSave}>
        <Text style={styles.btnText}>{editingId ? 'Save Note' : 'Add Note'}</Text>
      </TouchableOpacity>

      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteBox}>
            <View style={styles.noteHeader}>
              <TouchableOpacity onPress={() => openModal(item)}>
                <Text style={styles.noteTitle}>{item.title}</Text>
              </TouchableOpacity>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => editNote(item)} style={styles.iconBtn}>
                  <Text style={styles.iconText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteNote(item.id)} style={styles.iconBtn}>
                  <Text style={styles.iconText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Note Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: getRandomNoteColor() }]}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalCloseX}
            >
              <Text style={styles.modalCloseText}>✖</Text>
            </TouchableOpacity>

            {selectedNote && (
              <>
                <Text style={styles.modalTag}>📝 Note</Text>
                <Text style={styles.modalTitle}>{selectedNote.title}</Text>
                <Text style={styles.modalDate}>
                  🕒 {new Date(selectedNote.updated).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </Text>
                <View style={styles.divider} />
                <Text style={styles.modalContent}>{selectedNote.text}</Text>
                <Text style={styles.tip}>
                  ✨ Tip: Keep writing your thoughts — they matter!
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={settingsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.settingsModal}>
            <TouchableOpacity onPress={() => setSettingsVisible(false)} style={styles.modalCloseX}>
              <Text style={styles.modalCloseText}>✖</Text>
            </TouchableOpacity>
            <Text style={styles.settingsTitle}>⚙ Settings</Text>
            <TouchableOpacity onPress={handleCustomize} style={styles.settingsOption}>
              <Text style={styles.settingsText}>🎨 Customize</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.settingsOption}>
              <Text style={styles.settingsText}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#C9D9F0' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 28, fontWeight: 'bold',
    color: '#2f4145'
  },
  settingsBtn: { padding: 8 },
  settingsIcon: { fontSize: 22 },

  inputTitle: {
    borderWidth: 1, borderColor: '#445E8C', padding: 10,
    backgroundColor: '#FFF', marginBottom: 10, borderRadius: 8
  },
  inputText: {
    borderWidth: 1, borderColor: '#445E8C', padding: 10,
    backgroundColor: '#FFF', height: 100, borderRadius: 8
  },
  saveBtn: {
    backgroundColor: '#6A88BE', padding: 12,
    borderRadius: 8, alignItems: 'center', marginVertical: 15
  },
  btnText: { color: '#FFF', fontWeight: '600' },

  noteBox: {
    backgroundColor: '#FFFBEA', borderRadius: 8,
    marginBottom: 15, overflow: 'hidden', elevation: 2
  },
  noteHeader: {
    padding: 15, backgroundColor: '#B1CDF6',
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#2f4145',
    textDecorationLine: 'underline'
  },
  actions: { flexDirection: 'row' },
  iconBtn: { marginLeft: 10 },
  iconText: { fontSize: 18 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCard: {
    backgroundColor: '#fff',
    width: '88%',
    borderRadius: 18,
    padding: 25,
    alignItems: 'center',
    elevation: 8,
  },
  modalCloseX: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 6,
    zIndex: 10
  },
  modalCloseText: {
    fontSize: 20,
    color: '#6A88BE',
    fontWeight: 'bold'
  },
  modalTag: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#6A88BE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2f4145',
    marginBottom: 6,
    textAlign: 'center'
  },
  modalDate: {
    fontSize: 13,
    color: '#888',
    marginBottom: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    alignSelf: 'stretch',
    marginVertical: 12
  },
  modalContent: {
    fontSize: 16,
    color: '#2f4145',
    textAlign: 'left',
    marginBottom: 20,
    lineHeight: 22,
    alignSelf: 'stretch'
  },
  tip: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#777'
  },
  settingsModal: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 14,
    padding: 20,
    alignItems: 'flex-start',
    elevation: 10
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#445E8C',
  },
  settingsOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignSelf: 'stretch',
  },
  settingsText: {
    fontSize: 16,
    color: '#2f4145',
  }
});

export default Note;
