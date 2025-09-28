// Register Screen for DESocial - Modern UI Design
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import '../global.css'; // NativeWind styles

const ENGINEERING_BRANCHES = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Chemical Engineering',
  'Automobile Engineering',
];

const ACADEMIC_YEARS = [1, 2, 3, 4];

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    year: 1,
    branch: 'Computer Engineering',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { email, password, confirmPassword, displayName } = formData;

    if (!email.trim() || !password.trim() || !displayName.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await register(formData);
      Alert.alert(
        'Registration Successful',
        'Please check your email for verification and wait for admin approval.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };



  const handleBackToLogin = () => {
    router.push('/login');
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
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={{ flex: 1, paddingHorizontal: 24, paddingVertical: 32 }}>
                {/* Header */}
                <View style={{ alignItems: 'center', marginBottom: 32, marginTop: 20 }}>
                  <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 8,
                  }}>
                    <Ionicons name="person-add" size={32} color="#ffffff" />
                  </View>
                  
                  <Text style={{
                    fontSize: 28,
                    fontWeight: '800',
                    color: '#ffffff',
                    marginBottom: 8,
                    textAlign: 'center',
                    letterSpacing: -0.5,
                  }}>
                    Join DESocial
                  </Text>
                  <Text style={{
                    fontSize: 16,
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    lineHeight: 22,
                    paddingHorizontal: 20,
                  }}>
                    Create your account to connect with DES community
                  </Text>
                </View>

                {/* Registration Card */}
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 24,
                  padding: 28,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 20 },
                  shadowOpacity: 0.15,
                  shadowRadius: 30,
                  elevation: 12,
                  marginBottom: 24,
                }}>


                  {/* Email Input */}
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: 8,
                    }}>
                      Email Address *
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
                        value={formData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                  </View>

                  {/* Display Name Input */}
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: 8,
                    }}>
                      Full Name *
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
                      <Ionicons name="person-outline" size={20} color="#6b7280" style={{ marginRight: 12 }} />
                      <TextInput
                        style={{
                          flex: 1,
                          fontSize: 16,
                          color: '#1f2937',
                          paddingVertical: 14,
                        }}
                        placeholder="Enter your full name"
                        placeholderTextColor="#9ca3af"
                        value={formData.displayName}
                        onChangeText={(value) => handleInputChange('displayName', value)}
                        autoCapitalize="words"
                        autoCorrect={false}
                      />
                    </View>
                  </View>

                  {/* Academic Year Picker */}
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: 8,
                    }}>
                      Academic Year *
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: '#e2e8f0',
                      paddingHorizontal: 16,
                    }}>
                      <Ionicons name="school-outline" size={20} color="#6b7280" style={{ marginRight: 12 }} />
                      <View style={{ flex: 1 }}>
                        <Picker
                          selectedValue={formData.year}
                          onValueChange={(value) => handleInputChange('year', value)}
                          style={{ height: 50, color: '#1f2937' }}
                        >
                          {ACADEMIC_YEARS.map(year => (
                            <Picker.Item key={year} label={`Year ${year}`} value={year} />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  </View>

                  {/* Branch Picker */}
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: 8,
                    }}>
                      Engineering Branch *
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: '#e2e8f0',
                      paddingHorizontal: 16,
                    }}>
                      <Ionicons name="build-outline" size={20} color="#6b7280" style={{ marginRight: 12 }} />
                      <View style={{ flex: 1 }}>
                        <Picker
                          selectedValue={formData.branch}
                          onValueChange={(value) => handleInputChange('branch', value)}
                          style={{ height: 50, color: '#1f2937' }}
                        >
                          {ENGINEERING_BRANCHES.map(branch => (
                            <Picker.Item key={branch} label={branch} value={branch} />
                          ))}
                        </Picker>
                      </View>
                    </View>
                  </View>

                  {/* Password Input */}
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: 8,
                    }}>
                      Password *
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
                        placeholder="Create a password (min 6 characters)"
                        placeholderTextColor="#9ca3af"
                        value={formData.password}
                        onChangeText={(value) => handleInputChange('password', value)}
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

                  {/* Confirm Password Input */}
                  <View style={{ marginBottom: 20 }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: 8,
                    }}>
                      Confirm Password *
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
                        placeholder="Confirm your password"
                        placeholderTextColor="#9ca3af"
                        value={formData.confirmPassword}
                        onChangeText={(value) => handleInputChange('confirmPassword', value)}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ padding: 4 }}
                      >
                        <Ionicons 
                          name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                          size={20} 
                          color="#6b7280" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>



                  {/* Register Button */}
                  <TouchableOpacity
                    onPress={handleRegister}
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
                    }}
                  >
                    <Text style={{
                      color: '#ffffff',
                      fontSize: 18,
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Back to Login */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 24,
                  marginBottom: 24,
                }}>
                  <Text style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 16,
                  }}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={handleBackToLogin}>
                    <Text style={{
                      color: '#ffffff',
                      fontSize: 16,
                      fontWeight: '700',
                    }}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Terms Note */}
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}>
                  <Text style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 12,
                    textAlign: 'center',
                    lineHeight: 18,
                  }}>
                    By creating an account, you agree to DESocial&apos;s Terms of Service and Privacy Policy. 
                    Your account will be reviewed by university administrators before activation.
                  </Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}