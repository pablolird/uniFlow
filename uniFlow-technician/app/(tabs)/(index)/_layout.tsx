
import { Stack } from 'expo-router'
import React, { Component } from 'react'

export class _layout extends Component {
  render() {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Welcome back, Carlos Gernhofer!',}} />
        <Stack.Screen name="activity/[id]" options={{ title: 'Activity' }} />
        <Stack.Screen name="activity/scan/QRScanner" options={{ title: 'Scanner' }} />
      </Stack>
    )
  }
}

export default _layout