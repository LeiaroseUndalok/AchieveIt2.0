import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarView = ({ tasks = [], navigation }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const getMarkedDates = () => {
    const dates = {};
    
    schedules.forEach(schedule => {
      if (schedule.dueDate) {
        dates[schedule.dueDate] = { marked: true, dotColor: '#445E8C' };
      }
    });

    return dates;
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setNewTaskDueDate(day.dateString);
    
    const schedulesForSelectedDate = schedules.filter(schedule => schedule.dueDate === day.dateString);
    if (schedulesForSelectedDate.length > 0) {
      setSelectedSchedule(schedulesForSelectedDate);
      setModalVisible(true);
    }
  };

  const handleAddSchedule = () => {
    if (newTaskTitle.trim() !== '') {
      const newSchedule = {
        id: Date.now().toString(),
        title: newTaskTitle,
        dueDate: newTaskDueDate,
      };
      setSchedules([...schedules, newSchedule]);
      setNewTaskTitle('');
      setMarkedDates(getMarkedDates());
    }
  };

  // Function to handle schedule deletion
  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    const updatedSelectedSchedule = selectedSchedule.filter(schedule => schedule.id !== id);
    setSelectedSchedule(updatedSelectedSchedule);
    setMarkedDates(getMarkedDates());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Schedule Calendar</Text>

      <Calendar 
        markedDates={getMarkedDates()} 
        onDayPress={handleDayPress}
      />

      <Text style={styles.selectedDate}>Selected Date: {selectedDate || 'None'}</Text>

      <TextInput
        style={styles.input}
        placeholder="New Schedule Title"
        value={newTaskTitle}
        onChangeText={setNewTaskTitle}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddSchedule}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Schedules for {selectedDate}</Text>
          {selectedSchedule && selectedSchedule.length > 0 ? (
            selectedSchedule.map((item) => (
              <View key={item.id} style={styles.scheduleItem}>
                <Text style={styles.modalScheduleItem}>{item.title}</Text>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => handleDeleteSchedule(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>No schedules for this date</Text>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C9D9F0',
    padding: 20,
  },
  header: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
    color: '#445E8C',
  },
  selectedDate: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    marginVertical: 10,
    color: '#6A88BE',
  },
  input: {
    borderColor: '#6A88BE',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#6A88BE',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#C9D9F0',
    padding: 20,
    justifyContent: 'center',
  },
  modalHeader: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#445E8C',
    marginBottom: 10,
  },
  modalScheduleItem: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    marginVertical: 5,
  },
  closeButton: {
    backgroundColor: '#6A88BE',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  scheduleItem: {

    justifyContent: 'space-between',
    flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FDF3E1',
      paddingVertical: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#E0D1B5',
      padding: 15,
      elevation: 3,
    
  },
  deleteButton: {
    backgroundColor: '#445E8C', // Dark green for delete button
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: '#B1CDF6',
    borderWidth: 2,
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
});

export default CalendarView;

