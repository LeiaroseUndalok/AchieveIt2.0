import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const colors = ['#FFFBEA'];

const CustomCheckBox = ({ title, isChecked, onChange }) => {
  return (
    <TouchableOpacity 
      style={styles.checkBox} 
      onPress={onChange}
    >
      <View style={[styles.checkboxContainer, isChecked && styles.checked]}>
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.label}>{title}</Text>
    </TouchableOpacity>
  );
};

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Add a new task
  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const taskColor = colors[tasks.length % colors.length];
      setTasks([...tasks, {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        category: selectedCategory,
        color: taskColor,
        dueDate: dueDate
      }]);
      setNewTask('');
      setDueDate('');
    }
  };

  // Toggle task completion
  const toggleCompleteTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Edit a task
  const handleEditTask = (task) => {
    setNewTask(task.text);
    setDueDate(task.dueDate);
    setIsEditing(true);
    setCurrentTask(task);
  };

  // Save the edited task
  const handleSaveTask = () => {
    setTasks(tasks.map(task => 
      task.id === currentTask.id ? { ...task, text: newTask, dueDate: dueDate } : task
    ));
    setIsEditing(false);
    setNewTask('');
    setDueDate('');
    setCurrentTask(null);
  };

  const filteredTasks = tasks.filter(task => 
    selectedCategory === 'All' || task.category === selectedCategory
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AchieveIt</Text>

      {/* Category Buttons */}
      <View style={styles.categoryContainer}>
        {['All', 'Work', 'School', 'Birthday', 'Personal'].map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.buttonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Input new task"
          placeholderTextColor="#888"
          value={newTask}
          onChangeText={setNewTask}
        />

        <TextInput
          style={styles.dueDateInput}
          placeholder="MM/DD/YYYY"
          placeholderTextColor="#888"
          value={dueDate}
          onChangeText={setDueDate}
        />

        <TouchableOpacity
          style={isEditing ? styles.saveButton : styles.addButton}
          onPress={isEditing ? handleSaveTask : handleAddTask}
        >
          <Text style={styles.buttonText}>
            {isEditing ? 'Save' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskContainer, { backgroundColor: item.color }]}>
            <View style={styles.taskInfo}>
              <CustomCheckBox
                title={item.text}
                isChecked={item.completed}
                onChange={() => toggleCompleteTask(item.id)}
              />
              <Text style={[styles.dueDateText, item.completed && styles.completedTask]}>
                Due: {item.dueDate}
              </Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditTask(item)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTask(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#C9D9F0',
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      textAlign: 'center',
      color: '#445E8C',
      marginBottom: 20,
      fontFamily: 'Poppins-Bold',
      backgroundColor: '#B1CDF6',
      padding: 20,
      borderRadius: 2,
      borderWidth: 2,
      borderColor: '#C9D9F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    categoryButton: {
      paddingVertical: 4,
      paddingHorizontal: 4,
      borderRadius: 10,
      backgroundColor: '#B1CDF6',
      marginHorizontal: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
      borderColor: '#6A88BE',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
    },
    selectedCategory: {
      backgroundColor: '#6A88BE',
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    input: {
      height: 50,
      width: '44%',
      borderColor: '#6A88BE',
      borderWidth: 1.5,
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#FFFFFF',
      marginRight: 10,
      fontSize: 14,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    dueDateInput: {
      height: 50,
      width: '30%',
      borderColor: '#6A88BE',
      borderWidth: 1.5,
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#FFFFFF',
      marginRight: 10,
      fontSize:10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    addButton: {
      backgroundColor: '#6A88BE',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    saveButton: {
      backgroundColor: '#6A88BE',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      textAlign: 'center',
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
    },
    taskContainer: {
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
    
    taskText: {
      flex: 1,
      fontSize: 18,
      color: '#34495E',
      fontFamily: 'Poppins-Regular',
      marginLeft: 10,
    },
    completedTask: {
      textDecorationLine: 'line-through',
      color: '#000000',
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: 10,
    },
   
   
    taskInfo: {
      flex: 1,
    },
  checkBox: {
      flexDirection: 'row', // Arrange checkbox and label in a row
      alignItems: 'center',
      marginVertical: 5,
    },
    checkboxContainer: {
      width: 24,
      height: 24,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: '#6A88BE', // Border color of the checkbox
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    checked: {
      backgroundColor: '#6A88BE', // Background color when checked
      borderColor: '#445E8C',
    },
    checkmark: {
      color: '#FFFFFF', // Color of the checkmark
      fontSize: 18,
    },
    label: {
      fontSize: 16,
      color: '#445E8C', // Color of the checkbox label
    },
  
    addButton: {
      backgroundColor: '#6A88BE',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    saveButton: {
      backgroundColor: '#6A88BE',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      textAlign: 'center',
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
    },
   
    checkbox: {
      marginRight: 10,
    },
    
    completedTask: {
      textDecorationLine: 'line-through',
      color: '#95A5A6',
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: 10,
    },
    editButton: {
      backgroundColor: '#6A88BE',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderColor: '#B1CDF6',
      borderWidth: 2,
    },
    deleteButton: {
      backgroundColor: '#445E8C', // Dark green for delete button
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      borderColor: '#B1CDF6',
      borderWidth: 2,
    },
  
    taskInfo: {
      flex: 1,
    },
    dueDateText: {
      fontSize: 14,
      color: '#95A5A6',
    },
  });
  

export default Task;
