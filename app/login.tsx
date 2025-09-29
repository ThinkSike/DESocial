// Login Screen for DESocial - Modern UI Design
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import '../global.css'; // NativeWind styles

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      console.log('Login screen: Starting login process');
      await login(email.trim(), password);
      console.log('Login screen: Login successful, navigating to tabs');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('Login screen: Login failed:', error.message);
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/register');
  };



  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
                {/* Animated Logo and Header */}
                <View style={{ alignItems: 'center', marginBottom: 48, marginTop: 40 }}>
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 5 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 8,
                  }}>
                    <Ionicons name="school" size={40} color="#ffffff" />
                  </View>
                  
                  <Text style={{
                    fontSize: 34,
                    fontWeight: '800',
                    color: '#ffffff',
                    marginBottom: 8,
                    textAlign: 'center',
                    letterSpacing: -0.5,
                  }}>
                    DESocial
                  </Text>
                  <Text style={{
                    fontSize: 18,
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    lineHeight: 24,
                    paddingHorizontal: 20,
                  }}>
                    Connect with your DES Pune University community
                  </Text>
                </View>

                {/* Login Card */}
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 24,
                  padding: 32,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 20 },
                  shadowOpacity: 0.15,
                  shadowRadius: 30,
                  elevation: 12,
                  marginBottom: 24,
                }}>
                  {/* Welcome Text */}
                  <View style={{ alignItems: 'center', marginBottom: 32 }}>
                    <Text style={{
                      fontSize: 24,
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: 8,
                    }}>
                      Welcome Back
                    </Text>
                    <Text style={{
                      fontSize: 16,
                      color: '#6b7280',
                      textAlign: 'center',
                    }}>
                      Sign in to continue your journey
                    </Text>
                  </View>

                  {/* Email Input */}
                  <View style={{ marginBottom: 24 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: 8,
                    }}>
                      Email Address
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: '#e2e8f0',
                      paddingHorizontal: 16,
                      paddingVertical: 4,
                    }}>
                      <Ionicons name="mail-outline" size={20} color="#6b7280" style={{ marginRight: 12 }} />
                      <TextInput
                        style={{
                          flex: 1,
                          fontSize: 16,
                          color: '#1f2937',
                          paddingVertical: 14,
                        }}
                        placeholder="Enter your email address"
                        placeholderTextColor="#9ca3af"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>

                  {/* Password Input */}
                  <View style={{ marginBottom: 16 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: 8,
                    }}>
                      Password
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: '#e2e8f0',
                      paddingHorizontal: 16,
                      paddingVertical: 4,
                    }}>
                      <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={{ marginRight: 12 }} />
                      <TextInput
                        style={{
                          flex: 1,
                          fontSize: 16,
                          color: '#1f2937',
                          paddingVertical: 14,
                        }}
                        placeholder="Enter your password"
                        placeholderTextColor="#9ca3af"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={{ padding: 4 }}
                      >
                        <Ionicons 
                          name={showPassword ? "eye-off-outline" : "eye-outline"} 
                          size={20} 
                          color="#6b7280" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Forgot Password */}
                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    style={{ alignSelf: 'flex-end', marginBottom: 32 }}
                  >
                    <Text style={{
                      color: '#667eea',
                      fontSize: 14,
                      fontWeight: '600',
                    }}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  {/* Login Button */}
                  <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading}
                    style={{
                      backgroundColor: loading ? '#9ca3af' : '#667eea',
                      borderRadius: 16,
                      paddingVertical: 18,
                      shadowColor: '#667eea',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.3,
                      shadowRadius: 16,
                      elevation: 8,
                      marginBottom: 12,
                    }}
                  >
                    <Text style={{
                      color: '#ffffff',
                      fontSize: 18,
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </TouchableOpacity>


                </View>

                {/* Sign Up Link */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 24,
                }}>
                  <Text style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 16,
                  }}>
                    Don&apos;t have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={handleSignUp}>
                    <Text style={{
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: '700',
                    }}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Campus Info Card */}
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                    <Ionicons name="school-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                    <Text style={{
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: '700',
                    }}>
                      DES Pune University Students Only
                    </Text>
                  </View>
                  <Text style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 14,
                    textAlign: 'center',
                    lineHeight: 20,
                  }}>
                    Login with your official PRN and password provided by the university
                  </Text>
                </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}