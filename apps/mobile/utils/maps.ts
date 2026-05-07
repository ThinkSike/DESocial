// Open the platform maps app with an optional query or coordinates
import { Linking, Platform } from 'react-native';

type OpenMapsOptions = {
  query?: string;     // e.g., "Colleges near me"
  lat?: number;       // optional latitude
  lng?: number;       // optional longitude
  label?: string;     // optional label
};

const openUrl = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) return Linking.openURL(url);
  // Fallback to web Google Maps
  return Linking.openURL(`https://www.google.com/maps`);
};

export async function openMaps(opts?: OpenMapsOptions) {
  const { query, lat, lng, label } = opts ?? {};
  const hasCoords = typeof lat === 'number' && typeof lng === 'number';
  const encQ = encodeURIComponent(label ? `${query ?? ''} (${label})` : (query ?? ''));

  try {
    if (Platform.OS === 'ios') {
      // Apple Maps
      let url = 'http://maps.apple.com/?';
      if (hasCoords) {
        url += `ll=${lat},${lng}`;
        if (query) url += `&q=${encQ}`;
      } else {
        url += `q=${encQ || 'Map'}`;
      }
      return openUrl(url);
    }

    if (Platform.OS === 'android') {
      // geo: scheme
      let url: string;
      if (hasCoords) {
        const q = encQ || `${lat},${lng}`;
        url = `geo:${lat},${lng}?q=${q}`;
      } else {
        url = `geo:0,0?q=${encQ || 'Map'}`;
      }
      return openUrl(url);
    }

    // Web fallback → Google Maps search
    const webQ = encQ || (hasCoords ? `${lat},${lng}` : 'Map');
    return openUrl(`https://www.google.com/maps/search/?api=1&query=${webQ}`);
  } catch {
    // Last-resort fallback
    return Linking.openURL('https://www.google.com/maps');
  }
}