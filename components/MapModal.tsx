import { useThemeColors } from '@/constants/Colors';
import { CampusLocation } from '@/data/campusLocations';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  location: CampusLocation;
  eventTitle?: string;
}

export default function MapModal({ visible, onClose, location, eventTitle }: MapModalProps) {
  const colors = useThemeColors();
  const { width, height } = Dimensions.get('window');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic':
        return 'school';
      case 'sports':
        return 'fitness';
      case 'event':
        return 'calendar';
      case 'dining':
        return 'restaurant';
      case 'library':
        return 'library';
      case 'admin':
        return 'business';
      default:
        return 'location';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic':
        return '#3B82F6'; // Blue
      case 'sports':
        return '#10B981'; // Green
      case 'event':
        return '#F59E0B'; // Orange
      case 'dining':
        return '#EF4444'; // Red
      case 'library':
        return '#8B5CF6'; // Purple
      case 'admin':
        return '#6B7280'; // Gray
      default:
        return colors.primary;
    }
  };

  const mapRegion = {
    latitude: location.coordinates.latitude,
    longitude: location.coordinates.longitude,
    latitudeDelta: 0.005, // Zoom level for campus view
    longitudeDelta: 0.005,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {eventTitle || 'Event Location'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              {location.name}
            </Text>
          </View>
          <TouchableOpacity style={styles.directionsButton}>
            <Ionicons name="navigate" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
          >
            <Marker
              coordinate={location.coordinates}
              title={location.name}
              description={location.description}
              pinColor={getCategoryColor(location.category)}
            >
              <View style={[styles.markerContainer, { backgroundColor: getCategoryColor(location.category) }]}>
                <Ionicons 
                  name={getCategoryIcon(location.category) as any} 
                  size={20} 
                  color="white" 
                />
              </View>
            </Marker>
          </MapView>
        </View>

        {/* Location Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.infoHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(location.category) + '20' }]}>
              <Ionicons 
                name={getCategoryIcon(location.category) as any} 
                size={16} 
                color={getCategoryColor(location.category)} 
              />
              <Text style={[styles.categoryText, { color: getCategoryColor(location.category) }]}>
                {location.category.charAt(0).toUpperCase() + location.category.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={[styles.locationName, { color: colors.text }]}>{location.name}</Text>
          <Text style={[styles.locationDescription, { color: colors.textSecondary }]}>
            {location.description}
          </Text>

          <View style={styles.locationDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="business" size={16} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {location.building}
                {location.room && ` - ${location.room}`}
              </Text>
            </View>

            {location.capacity && (
              <View style={styles.detailRow}>
                <Ionicons name="people" size={16} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                  Capacity: {location.capacity} people
                </Text>
              </View>
            )}

            {location.facilities && location.facilities.length > 0 && (
              <View style={styles.detailRow}>
                <Ionicons name="checkmark-circle" size={16} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                  {location.facilities.join(', ')}
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                // Open in external maps app
                const url = Platform.select({
                  ios: `maps:${location.coordinates.latitude},${location.coordinates.longitude}`,
                  android: `geo:${location.coordinates.latitude},${location.coordinates.longitude}`,
                });
                // In a real app, you'd use Linking.openURL(url)
                console.log('Open external maps:', url);
              }}
            >
              <Ionicons name="map" size={18} color="white" />
              <Text style={styles.actionButtonText}>Open in Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.border }]}
              onPress={() => {
                // Share location
                console.log('Share location:', location.name);
              }}
            >
              <Ionicons name="share" size={18} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>Share Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  directionsButton: {
    padding: 8,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoCard: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  infoHeader: {
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  locationDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  locationDetails: {
    gap: 12,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});