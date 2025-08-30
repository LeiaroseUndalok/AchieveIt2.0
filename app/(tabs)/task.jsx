import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Platform, Image, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, auth } from '../../firebase';
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

// Simple hamburger icon as a component
const MenuIcon = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuIcon}>
    <View style={styles.menuBar} />
    <View style={styles.menuBar} />
    <View style={styles.menuBar} />
  </TouchableOpacity>
);

const statusColors = {
  Completed: '#B1CDF6',
  Pending: '#FFFBEA',
  Cancelled: '#FBEAEA',
  Ongoing: '#E1FBEA'
};

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'tasks'), where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
    });
    return () => unsubscribe();
  }, []);

  const stats = {
    Completed: tasks.filter(t => t.completed).length,
    Pending: tasks.filter(t => !t.completed && new Date(t.dueDate) > new Date()).length,
    Cancelled: tasks.filter(t => t.cancelled).length,
    Ongoing: tasks.filter(t => !t.completed && new Date(t.dueDate) <= new Date()).length
  };

  const handleSave = async () => {
    if (!newTask.trim()) return;
    if (isEditing && currentTask) {
      await updateDoc(doc(db, 'tasks', currentTask.id), {
        text: newTask,
        dueDate: dueDate.toISOString().split('T')[0]
      });
    } else {
      await addDoc(collection(db, 'tasks'), {
        text: newTask,
        dueDate: dueDate.toISOString().split('T')[0],
        completed: false,
        cancelled: false,
        userId: auth.currentUser.uid
      });
    }
    setNewTask('');
    setDueDate(new Date());
    setIsEditing(false);
    setCurrentTask(null);
    setModalVisible(false);
  };

  const toggleComplete = async (task) => {
    await updateDoc(doc(db, 'tasks', task.id), { completed: !task.completed });
  };

  const cancelTask = async (task) => {
    await updateDoc(doc(db, 'tasks', task.id), { cancelled: true });
  };

  const editTask = (task) => {
    setNewTask(task.text);
    setDueDate(new Date(task.dueDate));
    setIsEditing(true);
    setCurrentTask(task);
    setModalVisible(true);
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  };

  const isEmpty = tasks.length === 0;

  return (
    <View style={styles.container}>
      {/* Navigation Menu Icon */}
      <MenuIcon onPress={() => setMenuVisible(true)} />

      {/* Example Menu Modal */}
      <Modal
        visible={menuVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuDropdown}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={styles.title}>AchieveIt</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        {Object.entries(stats).map(([key, value]) => (
          <View key={key} style={[styles.statCard, { backgroundColor: statusColors[key] }]}>
            <Text style={styles.statNumber}>{value}</Text>
            <Text style={styles.statLabel}>{key}</Text>
          </View>
        ))}
      </View>

      {/* Task List or Empty State */}
      {isEmpty ? (
        <View style={styles.emptyState}>
          <Image
            source={require('../../assets/project.png')}
            style={{ width: 120, height: 120, marginBottom: 16 }}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>You have no lists</Text>
          <Text style={styles.emptyDesc}>Press the + button to create one</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <TouchableOpacity onPress={() => toggleComplete(item)}>
                <Text style={[
                  styles.taskText,
                  item.completed && styles.completedTask,
                  item.cancelled && styles.cancelledTask
                ]}>
                  {item.text}
                </Text>
              </TouchableOpacity>
              <Text style={styles.taskMeta}>
                Due: {item.dueDate}
              </Text>
              <View style={styles.taskActions}>
                {!item.completed && !item.cancelled && (
                  <>
                    <TouchableOpacity onPress={() => editTask(item)} style={styles.actionBtn}>
                      <Text style={styles.actionBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => cancelTask(item)} style={styles.actionBtn}>
                      <Text style={styles.actionBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setIsEditing(false);
          setNewTask('');
          setDueDate(new Date());
          setModalVisible(true);
        }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal for Add/Edit Task */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isEditing ? 'Edit Task' : 'Add Task'}</Text>
            <TextInput
              style={styles.input}
              placeholder="Task name"
              value={newTask}
              onChangeText={setNewTask}
              autoFocus
            />
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
              <Text style={styles.dateText}>{dueDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowPicker(Platform.OS === 'ios');
                  if (selectedDate) setDueDate(selectedDate);
                }}
              />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#6A88BE' }]}
                onPress={handleSave}
              >
                <Text style={[styles.actionBtnText, { color: '#fff' }]}>{isEditing ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: '#E6EAF3' }]}
                onPress={() => {
                  setModalVisible(false);
                  setIsEditing(false);
                  setNewTask('');
                  setDueDate(new Date());
                }}
              >
                <Text style={styles.actionBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FB', padding: 16 },
  menuIcon: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBar: {
    width: 24,
    height: 3,
    backgroundColor: '#6A88BE',
    marginVertical: 2,
    borderRadius: 2,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuDropdown: {
    marginTop: 60,
    marginLeft: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    minWidth: 160,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  menuTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#6A88BE',
    marginBottom: 10,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuItemText: {
    fontSize: 15,
    color: '#445E8C',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6A88BE',
    textAlign: 'center',
    marginVertical: 16,
    letterSpacing: 1.2,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#445E8C' },
  statLabel: { fontSize: 13, color: '#445E8C', marginTop: 2 },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B1CDF6',
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: '#B1CDF6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  dateText: { color: '#445E8C', fontWeight: 'bold' },
  addBtn: {
    backgroundColor: '#6A88BE',
    borderRadius: 20,
    padding: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
  },
  addBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#445E8C', marginBottom: 6 },
  emptyDesc: { color: '#888', fontSize: 15 },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  taskText: { fontSize: 16, color: '#445E8C', fontWeight: '600' },
  completedTask: { textDecorationLine: 'line-through', color: '#A5B6D2' },
  cancelledTask: { textDecorationLine: 'line-through', color: '#E57373' },
  taskMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  taskActions: { flexDirection: 'row', marginTop: 8 },
  actionBtn: {
    backgroundColor: '#E6EAF3',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  actionBtnText: { color: '#445E8C', fontWeight: '600', fontSize: 13 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#6A88BE',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'stretch',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A88BE',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
});

export default Task;