// CalendarView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, ScrollView, StyleSheet
} from 'react-native';
import { Calendar } from 'react-native-calendars';

// Format YYYY-MM-DD
const formatDate = d => d.toISOString().split('T')[0];

// Countdown helper
const getCountdown = dueDate => {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due - now;
  if (diff <= 0) return 'Due!';
  const d = Math.floor(diff / (1000*60*60*24));
  const h = Math.floor((diff / (1000*60*60)) % 24);
  const m = Math.floor((diff / (1000*60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
};

const CalendarView = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [newTask, setNewTask] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [remindersVisible, setRemindersVisible] = useState(false);
  const [now, setNow] = useState(new Date());

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter upcoming (<=3d)
  const reminders = useMemo(
    () => schedules
      .filter(s => {
        const diff = (new Date(s.dueDate) - now) / (1000*60*60*24);
        return diff >= 0 && diff <= 3;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
    [schedules, now]
  );

  // Marked dates with dots + highlight today's deadlines
  const markedDates = useMemo(() => {
    const md = {};
    schedules.forEach(s => {
      md[s.dueDate] = md[s.dueDate] || { dots: [] };
      md[s.dueDate].dots.push({ key: s.id, color: '#606F49' });
      md[s.dueDate].marked = true;
      if (new Date(s.dueDate) <= new Date(formatDate(now)))
        md[s.dueDate].dotColor = '#FF6347';
    });
    if (selectedDate && md[selectedDate]) {
      md[selectedDate].selected = true;
      md[selectedDate].selectedColor = '#6A88BE';
    }
    return md;
  }, [schedules, selectedDate, now]);

  const handleDayPress = day => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const addSchedule = () => {
    if (!newTask.trim() || !selectedDate) return;
    setSchedules(prev => [
      ...prev,
      { id: Date.now().toString(), title: newTask.trim(), dueDate: selectedDate }
    ]);
    setNewTask('');
  };

  const deleteSchedule = id =>
    setSchedules(prev => prev.filter(s => s.id !== id));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Schedule Calendar</Text>

      {reminders.length > 0 && (
        <TouchableOpacity
          style={styles.reminderBanner}
          onPress={() => setRemindersVisible(true)}
        >
          <Text style={styles.reminderTitle}>⏰ Reminders</Text>
          {reminders.slice(0, 2).map(r => (
            <Text key={r.id} style={styles.reminderText}>
              {r.title} – {r.dueDate} ({getCountdown(r.dueDate)})
            </Text>
          ))}
          {reminders.length > 2 && (
            <Text style={styles.reminderMore}>
              +{reminders.length - 2} more...
            </Text>
          )}
        </TouchableOpacity>
      )}

      <Calendar
        markingType="multi-dot"
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />

      <Text style={styles.selectedDate}>Selected: {selectedDate || 'None'}</Text>
      <TextInput
        style={styles.input}
        placeholder="New task title"
        value={newTask}
        onChangeText={setNewTask}
      />
      <TouchableOpacity style={styles.addBtn} onPress={addSchedule}>
        <Text style={styles.addBtnText}>Add</Text>
      </TouchableOpacity>

      {/* Schedules Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalHeader}>
            {selectedDate} – {schedules.filter(s => s.dueDate === selectedDate).length} task(s)
          </Text>
          <ScrollView>
            {schedules.filter(s => s.dueDate === selectedDate).map(item => (
              <View key={item.id} style={styles.scheduleItem}>
                <Text>{item.title}</Text>
                <TouchableOpacity onPress={() => deleteSchedule(item.id)}>
                  <Text style={styles.deleteTxt}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Reminders Modal */}
      <Modal visible={remindersVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalHeader}>Upcoming Deadlines</Text>
          <ScrollView>
            {reminders.map(r => (
              <View key={r.id} style={styles.scheduleItem}>
                <Text>{r.title} – {r.dueDate} ({getCountdown(r.dueDate)})</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setRemindersVisible(false)}
          >
            <Text style={styles.closeTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, padding:20, backgroundColor:'#C9D9F0' },
  header: { fontSize: 28, fontWeight: 'bold',
    textAlign: 'center', marginBottom: 20, marginTop:50,color: '#2f4145'},
  reminderBanner: {
    backgroundColor:'#FFF3CD', padding:10,
    borderRadius:8, marginBottom:10
  },
  reminderTitle: { fontWeight:'bold', marginBottom:5 },
  reminderText: { fontSize:14 },
  reminderMore: { fontSize:14, color:'#555' },

  selectedDate: { marginTop:10, fontSize:16, color:'#445E8C' },
  input: {
    marginTop:10, borderWidth:1, borderColor:'#445E8C',
    borderRadius:8, padding:10, backgroundColor:'#FFF'
  },
  addBtn: {
    backgroundColor:'#445E8C', padding:12,
    borderRadius:8, alignItems:'center', marginTop:10
  },
  addBtnText: { color:'#FFF', fontWeight:'bold' },

  modal: {
    flex:1, backgroundColor:'#FFF', marginTop:200,
    borderTopLeftRadius:20, borderTopRightRadius:20,
    padding:20
  },
  modalHeader: { fontSize:20, marginBottom:10, fontWeight:'bold' },
  scheduleItem: {
    flexDirection:'row', justifyContent:'space-between',
    padding:12, backgroundColor:'#F0F0F0', borderRadius:8,
    marginBottom:8
  },
  deleteTxt: { color:'red', fontSize:18 },
  closeBtn: {
    marginTop:10, padding:12, backgroundColor:'#445E8C',
    borderRadius:8, alignItems:'center'
  },
  closeTxt: { color:'#FFF', fontWeight:'bold' },
});

export default CalendarView;
