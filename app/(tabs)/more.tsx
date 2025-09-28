// More/Menu Screen for DESocial
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import { useAuth } from '../../contexts/AuthContext';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  color?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  onPress, 
  showArrow = true,
  color = '#6B7280'
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center py-4 px-4 bg-white mb-2 rounded-xl shadow-soft"
  >
    <View className="w-10 h-10 bg-gray-100 rounded-full justify-center items-center mr-4">
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View className="flex-1">
      <Text className="text-gray-900 text-base font-medium">{title}</Text>
      {subtitle && (
        <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
      )}
    </View>
    {showArrow && (
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    )}
  </TouchableOpacity>
);

export default function MoreScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

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
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-4">More</Text>
        
        {/* Profile Section */}
        {user && (
          <View className="flex-row items-center">
            <Image
              source={
                user.profilePicture
                  ? { uri: user.profilePicture }
                  : require('../../assets/images/icon.png')
              }
              className="w-16 h-16 rounded-full mr-4"
            />
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                {user.displayName}
              </Text>
              <Text className="text-gray-600 text-sm">
                PRN: {user.prn} • Year {user.year}
              </Text>
              <Text className="text-gray-500 text-sm">
                {user.branch}
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="create-outline" size={24} color="#0091F5" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Menu Items */}
      <ScrollView className="flex-1 px-4 py-4">
        {/* Academic Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3 px-2">
            Academic
          </Text>
          
          <MenuItem
            icon="map-outline"
            title="Around You Map"
            subtitle="See what's happening on campus"
            onPress={() => Alert.alert('Coming Soon', 'Campus map feature will be available soon!')}
          />
          
          <MenuItem
            icon="search-outline"
            title="Lost & Found"
            subtitle="Find or report lost items"
            onPress={() => Alert.alert('Coming Soon', 'Lost & Found feature will be available soon!')}
          />
          
          <MenuItem
            icon="calendar-outline"
            title="Academic Calendar"
            subtitle="View important dates and events"
            onPress={() => Alert.alert('Coming Soon', 'Academic calendar will be available soon!')}
          />
        </View>

        {/* Social Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3 px-2">
            Social
          </Text>
          
          <MenuItem
            icon="people-outline"
            title="My Tribes"
            subtitle="Manage your joined tribes"
            onPress={() => Alert.alert('Coming Soon', 'My Tribes section will be available soon!')}
          />
          
          <MenuItem
            icon="chatbubbles-outline"
            title="Messages"
            subtitle="Private conversations"
            onPress={() => Alert.alert('Coming Soon', 'Messaging feature will be available soon!')}
          />
          
          <MenuItem
            icon="heart-outline"
            title="Saved Posts"
            subtitle="View your bookmarked content"
            onPress={() => Alert.alert('Coming Soon', 'Saved posts feature will be available soon!')}
          />
        </View>

        {/* Settings Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3 px-2">
            Settings
          </Text>
          
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon!')}
          />
          
          <MenuItem
            icon="shield-outline"
            title="Privacy & Security"
            subtitle="Control your privacy settings"
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon!')}
          />
          
          <MenuItem
            icon="color-palette-outline"
            title="Appearance"
            subtitle="Customize app theme and display"
            onPress={() => Alert.alert('Coming Soon', 'Theme customization will be available soon!')}
          />
        </View>

        {/* Support Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3 px-2">
            Support
          </Text>
          
          <MenuItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help and contact support"
            onPress={() => Alert.alert('Help & Support', 'For support, please contact the DES IT department.')}
          />
          
          <MenuItem
            icon="information-circle-outline"
            title="About DESocial"
            subtitle="App version and information"
            onPress={() => Alert.alert('About DESocial', 'DESocial v1.0.0\n\nA campus-exclusive social media app for DES Pune University students.\n\nDeveloped for connecting students, sharing knowledge, and building community.')}
          />
          
          <MenuItem
            icon="document-text-outline"
            title="Terms & Privacy"
            subtitle="Legal information"
            onPress={() => Alert.alert('Coming Soon', 'Terms and Privacy Policy will be available soon!')}
          />
        </View>

        {/* Logout */}
        <View className="mb-8">
          <MenuItem
            icon="log-out-outline"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
            showArrow={false}
            color="#EF4444"
          />
        </View>

        {/* App Info */}
        <View className="items-center py-6">
          <Text className="text-gray-400 text-sm text-center">
            DESocial v1.0.0
          </Text>
          <Text className="text-gray-400 text-xs text-center mt-1">
            Made with ❤️ for DES Pune University
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}