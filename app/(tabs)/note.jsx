import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, Alert, Modal, ScrollView
} from 'react-native';
import { db } from '../../firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { router } from 'expo-router';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase';

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Real-time fetch notes from Firestore
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'notes'), where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
    });
    return () => unsubscribe();
  }, []);

  // Add or save a note
  const addOrSave = async () => {
    if (!newTitle.trim() || !newText.trim()) {
      Alert.alert("Input Required", "Please enter both a title and description for your note.");
      return;
    }
    if (editingId) {
      // Edit existing note
      const noteRef = doc(db, 'notes', editingId);
      await updateDoc(noteRef, {
        title: newTitle,
        text: newText,
        updated: Date.now()
      });
      setEditingId(null);
    } else {
      // Add new note
      await addDoc(collection(db, 'notes'), {
          title: newTitle,
          text: newText,
        updated: Date.now(),
        userId: auth.currentUser.uid
      });
    }
    setNewTitle('');
    setNewText('');
  };

  // Set up a note for editing
  const editNote = note => {
    setNewTitle(note.title);
    setNewText(note.text);
    setEditingId(note.id);
    setModalVisible(false);
  };

  // Delete a note
  const deleteNote = id => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, 'notes', id));
          setModalVisible(false);
        }
      }
    ]);
  };

  // Open the note detail modal
  const openModal = note => {
    setSelectedNote(note);
    setModalVisible(true);
  };

  // Logout and settings logic remain unchanged
  const handleLogout = () => {
    Alert.alert(
      "Logout Confirmation",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/sign-in");
            } catch (error) {
              Alert.alert("Logout Error", error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleCustomize = () => {
    setSettingsVisible(false);
    router.push('/customize');
  };

  const getRandomNoteColor = () => {
    const colors = ['#FFF9E6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <TouchableOpacity onPress={() => setSettingsVisible(true)} style={styles.settingsBtn}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Note Input Fields */}
      <TextInput
        placeholder="Enter note title"
        value={newTitle}
        onChangeText={setNewTitle}
        style={styles.inputTitle}
        placeholderTextColor="#6B7280"
      />
      <TextInput
        placeholder="Enter note description"
        value={newText}
        onChangeText={setNewText}
        multiline
        style={styles.inputText}
        placeholderTextColor="#6B7280"
      />
      <TouchableOpacity style={styles.saveBtn} onPress={addOrSave}>
        <Text style={styles.btnText}>{editingId ? 'Save Note' : 'Add Note'}</Text>
      </TouchableOpacity>

      {/* List of Notes */}
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        style={styles.flatList}
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

      {/* Note Detail Modal */}
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
              <ScrollView style={styles.modalScrollView}>
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
              </ScrollView>
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
            <TouchableOpacity onPress={handleLogout} style={styles.settingsOption}>
              <Text style={styles.settingsText}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Stylesheet for the component
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
    backgroundColor: '#FFF', height: 100, borderRadius: 8,
    textAlignVertical: 'top', // Ensures text starts from the top for multiline
  },
  saveBtn: {
    backgroundColor: '#6A88BE', padding: 12,
    borderRadius: 8, alignItems: 'center', marginVertical: 15,
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
    elevation: 5, // Android shadow
  },

  btnText: { color: '#FFF', fontWeight: '600' },

  flatList: {
    flex: 1, // Ensure FlatList takes available space
  },
  noteBox: {
    backgroundColor: '#FFFBEA', borderRadius: 8,
    marginBottom: 15, overflow: 'hidden',
    boxShadow: '0px 1px 2.22px rgba(0, 0, 0, 0.22)',
    elevation: 3, // Android shadow
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
    boxShadow: '0px 4px 4.65px rgba(0, 0, 0, 0.30)',
    elevation: 8, // Android shadow
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
  modalScrollView: {
    width: '100%', // Ensure ScrollView takes full width of its parent
  },
  modalTag: {
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#6A88BE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    alignSelf: 'center', // Center the tag
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
    marginBottom: 10,
    textAlign: 'center', // Center the date
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
    color: '#777',
    textAlign: 'center', // Center the tip
  },
  settingsModal: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 14,
    padding: 20,
    alignItems: 'flex-start',
    boxShadow: '0px 4px 4.65px rgba(0, 0, 0, 0.30)',
    elevation: 10 // Android shadow
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
