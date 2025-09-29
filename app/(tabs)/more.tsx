// Profile/More Screen for DESocial - Modern UI Design
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  color?: string;
  colors: any;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showArrow = true,
  color,
  colors
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.surface,
      marginBottom: 12,
      borderRadius: 16,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border,
    }}
  >
    <View style={{
      width: 44,
      height: 44,
      backgroundColor: color ? `${color}20` : `${colors.primary}20`,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    }}>
      <Ionicons name={icon} size={24} color={color || colors.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{  
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
      }}>{title}</Text>
      {subtitle && (
        <Text style={{
          color: colors.textSecondary,
          fontSize: 14,
        }}>{subtitle}</Text>
      )}
    </View>
    {showArrow && (
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    )}
  </TouchableOpacity>
);

export default function MoreScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const colors = useThemeColors();


  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Beautiful Header with Gradient */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{
            paddingHorizontal: 24,
            paddingBottom: 32,
            paddingTop: 16,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 12,
          }}
        >
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 20,
            textAlign: 'center',
          }}>Profile</Text>
          
          {/* Profile Section */}
          {user && (
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 20,
              padding: 20,
              backdropFilter: 'blur(10px)',
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}>
                  <Image
                    source={
                      user.profilePicture
                        ? { uri: user.profilePicture }
                        : require('../../assets/images/icon.png')
                    }
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      marginRight: 16,
                      borderWidth: 3,
                      borderColor: '#ffffff',
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#ffffff',
                    marginBottom: 4,
                  }}>
                    {user.displayName}
                  </Text>
                  <Text style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: 14,
                    marginBottom: 2,
                  }}>
                    PRN: {user.prn} • Year {user.year}
                  </Text>
                  <Text style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 14,
                  }}>
                    {user.branch}
                  </Text>
                </View>
                <TouchableOpacity style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: 20,
                  padding: 12,
                }}>
                  <Ionicons name="create-outline" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </LinearGradient>

        {/* Menu Items */}
        <ScrollView style={{ 
          flex: 1, 
          backgroundColor: colors.background,
          paddingHorizontal: 20,
          marginTop: -20,
        }} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Academic Section */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.textPrimary,
              marginBottom: 16,
              paddingHorizontal: 4,
            }}>
              Academic
            </Text>
            
            <MenuItem
              icon="map-outline"
              title="Around You Map"
              subtitle="See what's happening on campus"
              onPress={() => Alert.alert('Coming Soon', 'Campus map feature will be available soon!')}
              colors={colors}
            />
            
            <MenuItem
              icon="search-outline"
              title="Lost & Found"
              subtitle="Find or report lost items"
              onPress={() => Alert.alert('Coming Soon', 'Lost & Found feature will be available soon!')}
              colors={colors}
            />
            
            <MenuItem
              icon="calendar-outline"
              title="Academic Calendar"
              subtitle="View important dates and events"
              onPress={() => Alert.alert('Coming Soon', 'Academic calendar will be available soon!')}
              colors={colors}
            />
          </View>

          {/* Social Section */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.textPrimary,
              marginBottom: 16,
              paddingHorizontal: 4,
            }}>
              Social
            </Text>
            
            <MenuItem
              icon="people-outline"
              title="My Tribes"
              subtitle="Manage your joined tribes"
              onPress={() => Alert.alert('Coming Soon', 'My Tribes section will be available soon!')}
              colors={colors}
            />
            
            <MenuItem
              icon="chatbubbles-outline"
              title="Messages"
              subtitle="Private conversations"
              onPress={() => router.push('/home/chat')}
              colors={colors}
            />
            
            <MenuItem
              icon="heart-outline"
              title="Saved Posts"
              subtitle="View your bookmarked content"
              onPress={() => Alert.alert('Coming Soon', 'Saved posts feature will be available soon!')}
              colors={colors}
            />
          </View>

          {/* Settings Section */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.textPrimary,
              marginBottom: 16,
              paddingHorizontal: 4,
            }}>
              Settings
            </Text>
            
            <MenuItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Manage your notification preferences"
              onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon!')}
              colors={colors}
            />
            
            <MenuItem
              icon="shield-outline"
              title="Privacy & Security"
              subtitle="Control your privacy settings"
              onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon!')}
              colors={colors}
            />
            
            <MenuItem
              icon="color-palette-outline"
              title="Appearance"
              subtitle="Customize app theme and display"
              onPress={() => Alert.alert('Coming Soon', 'Theme customization will be available soon!')}
              colors={colors}
            />
          </View>

          {/* Support Section */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: colors.textPrimary,
              marginBottom: 16,
              paddingHorizontal: 4,
            }}>
              Support
            </Text>
            
            <MenuItem
              icon="help-circle-outline"
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={() => Alert.alert('Help & Support', 'For support, please contact the DES IT department.')}
              colors={colors}
            />
            
            <MenuItem
              icon="information-circle-outline"
              title="About DESocial"
              subtitle="App version and information"
              onPress={() => Alert.alert('About DESocial', 'DESocial v1.0.0\n\nA campus-exclusive social media app for DES Pune University students.\n\nDeveloped for connecting students, sharing knowledge, and building community.')}
              colors={colors}
            />
            
            <MenuItem
              icon="document-text-outline"
              title="Terms & Privacy"
              subtitle="Legal information"
              onPress={() => Alert.alert('Coming Soon', 'Terms and Privacy Policy will be available soon!')}
              colors={colors}
            />
          </View>

          {/* Logout */}
          <View style={{ marginBottom: 32 }}>
            <MenuItem
              icon="log-out-outline"
              title="Logout"
              subtitle="Sign out of your account"
              onPress={handleLogout}
              showArrow={false}
              color="#EF4444"
              colors={colors}
            />
          </View>

          {/* App Info */}
          <View style={{
            alignItems: 'center',
            paddingVertical: 24,
            marginBottom: 20,
          }}>
            <Text style={{
              color: colors.textSecondary,
              fontSize: 14,
              textAlign: 'center',
            }}>
              DESocial v1.0.0
            </Text>
            <Text style={{
              color: colors.textSecondary,
              fontSize: 12,
              textAlign: 'center',
              marginTop: 4,
            }}>
              Made with ❤️ for DES Pune University
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}