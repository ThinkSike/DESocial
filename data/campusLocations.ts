export interface CampusLocation {
  id: string;
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  building: string;
  room?: string;
  category: 'academic' | 'sports' | 'event' | 'dining' | 'library' | 'admin';
  capacity?: number;
  facilities?: string[];
}

// Sample campus locations (using coordinates near Mumbai for example)
export const campusLocations: CampusLocation[] = [
  {
    id: 'eng-building',
    name: 'Engineering Building',
    description: 'Main engineering faculty building',
    coordinates: {
      latitude: 19.0760,
      longitude: 72.8777,
    },
    building: 'Engineering Building',
    category: 'academic',
    facilities: ['WiFi', 'Projector', 'AC', 'Whiteboard'],
  },
  {
    id: 'cs-lab',
    name: 'Computer Science Lab',
    description: 'Advanced computer science laboratory',
    coordinates: {
      latitude: 19.0765,
      longitude: 72.8780,
    },
    building: 'Engineering Building',
    room: 'Room 101',
    category: 'academic',
    capacity: 60,
    facilities: ['WiFi', 'Computers', 'Projector', 'AC'],
  },
  {
    id: 'basketball-court',
    name: 'Basketball Court',
    description: 'Outdoor basketball court',
    coordinates: {
      latitude: 19.0755,
      longitude: 72.8785,
    },
    building: 'Sports Complex',
    category: 'sports',
    capacity: 200,
    facilities: ['Floodlights', 'Seating', 'Scoreboard'],
  },
  {
    id: 'main-auditorium',
    name: 'Main Auditorium',
    description: 'Large auditorium for events and presentations',
    coordinates: {
      latitude: 19.0770,
      longitude: 72.8775,
    },
    building: 'Administrative Block',
    category: 'event',
    capacity: 500,
    facilities: ['Stage', 'Sound System', 'Projector', 'AC', 'Recording'],
  },
  {
    id: 'music-room',
    name: 'Music Practice Room',
    description: 'Soundproof room for music practice',
    coordinates: {
      latitude: 19.0762,
      longitude: 72.8772,
    },
    building: 'Arts Building',
    room: 'Room 203',
    category: 'event',
    capacity: 30,
    facilities: ['Piano', 'Sound System', 'Acoustic Treatment'],
  },
  {
    id: 'debate-hall',
    name: 'Debate Hall',
    description: 'Dedicated space for debates and discussions',
    coordinates: {
      latitude: 19.0768,
      longitude: 72.8782,
    },
    building: 'Student Center',
    room: 'Hall B',
    category: 'event',
    capacity: 100,
    facilities: ['Podium', 'Microphones', 'Recording', 'Seating'],
  },
  {
    id: 'photography-studio',
    name: 'Photography Studio',
    description: 'Professional photography studio',
    coordinates: {
      latitude: 19.0758,
      longitude: 72.8778,
    },
    building: 'Arts Building',
    room: 'Studio 1',
    category: 'event',
    capacity: 20,
    facilities: ['Lighting Equipment', 'Backdrops', 'Cameras'],
  },
  {
    id: 'eco-garden',
    name: 'Eco Garden',
    description: 'Sustainable garden for environmental activities',
    coordinates: {
      latitude: 19.0752,
      longitude: 72.8770,
    },
    building: 'Campus Grounds',
    category: 'event',
    capacity: 50,
    facilities: ['Outdoor Space', 'Garden Tools', 'Compost Area'],
  },
  {
    id: 'startup-hub',
    name: 'Startup Incubation Hub',
    description: 'Co-working space for student entrepreneurs',
    coordinates: {
      latitude: 19.0773,
      longitude: 72.8787,
    },
    building: 'Innovation Center',
    category: 'event',
    capacity: 80,
    facilities: ['WiFi', 'Meeting Rooms', 'Whiteboards', 'Coffee'],
  },
];

export const getCampusLocationById = (id: string): CampusLocation | undefined => {
  return campusLocations.find(location => location.id === id);
};

export const getCampusLocationsByCategory = (category: string): CampusLocation[] => {
  return campusLocations.filter(location => location.category === category);
};