import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { AuthProvider } from '../contexts/AuthContext';
import '../global.css';

export default function RootLayout() {


  const screenOptions = {
    headerShown: false,
    animation: 'slide_from_right' as const,
    animationDuration: 300,
    gestureEnabled: true,
    gestureDirection: 'horizontal' as const,
    ...(Platform.OS === 'ios' && {
      // iPhone-like spring animations
      transitionSpec: {
        open: {
          animation: 'spring',
          config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          },
        },
        close: {
          animation: 'spring',
          config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          },
        },
      },
      cardStyleInterpolator: ({ current, next, layouts }: any) => {
        return {
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
              {
                scale: next
                  ? next.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.95],
                    })
                  : 1,
              },
            ],
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
          overlayStyle: {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
          },
        };
      },
    }),
  };

  return (
    <AuthProvider>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="home" 
          options={{
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen 
          name="settings"
          options={{
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
