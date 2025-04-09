import { View, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { icons } from '../../constants'

const TabIcon = ({ icon, focused }) => {
  return (
    <View>
      <Image
        source={icon}
        resizeMode="contain"
        className="w-6 h-6"
        tintColor={focused ? '#445E8C' : '#B1CDF6'}
      />
    </View>
  )
}

const TabLayout = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="task"
          options={{
            title: 'Task',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={icons.task} focused={focused} />
            )
          }}
        />

        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={icons.calendar} focused={focused} />
            )
          }}
        />

        <Tabs.Screen
          name="note"
          options={{
            title: 'Note',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon icon={icons.note} focused={focused} />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default TabLayout
