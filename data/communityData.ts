import { Community } from '@/types/community';

export const mockCommunities: Community[] = [
  // Joined Communities
  {
    id: '1',
    name: 'Computer Science Department',
    description: 'Official community for CS students and faculty',
    category: 'Academic',
    memberCount: 1247,
    isJoined: true,
    icon: 'laptop',
    isVerified: true,
    location: 'Mumbai, India',
    type: 'academic',
    tags: ['Programming', 'AI/ML', 'Web Development'],
    recentActivity: 'New placement opportunity posted',
    trending: false,
  },
  {
    id: '2',
    name: 'Photography Club',
    description: 'Capture moments, create memories',
    category: 'Hobby',
    memberCount: 523,
    isJoined: true,
    icon: 'camera',
    isVerified: false,
    location: 'College Campus',
    type: 'hobby',
    tags: ['Photography', 'Visual Arts', 'Creativity'],
    recentActivity: 'Weekly photo challenge started',
    trending: true,
  },
  {
    id: '3',
    name: 'Coding Club',
    description: 'Learn, practice, and excel in programming',
    category: 'Technical',
    memberCount: 891,
    isJoined: true,
    icon: 'code',
    isVerified: true,
    location: 'Lab 301',
    type: 'technical',
    tags: ['Competitive Programming', 'Hackathons', 'Open Source'],
    recentActivity: 'Hackathon registration open',
    trending: true,
  },

  // Suggested Communities
  {
    id: '4',
    name: 'Basketball Team',
    description: 'Join our college basketball team and tournaments',
    category: 'Sports',
    memberCount: 156,
    isJoined: false,
    icon: 'basketball',
    isVerified: true,
    location: 'Sports Complex',
    type: 'sports',
    tags: ['Basketball', 'Sports', 'Fitness'],
    recentActivity: 'Inter-college tournament next month',
    trending: false,
  },
  {
    id: '5',
    name: 'Drama Society',
    description: 'Express yourself through theatre and performing arts',
    category: 'Cultural',
    memberCount: 234,
    isJoined: false,
    icon: 'theater-masks',
    isVerified: false,
    location: 'Auditorium',
    type: 'cultural',
    tags: ['Theatre', 'Acting', 'Performance'],
    recentActivity: 'Annual drama competition announced',
    trending: true,
  },
  {
    id: '6',
    name: 'Robotics Lab',
    description: 'Build, program, and innovate with robotics',
    category: 'Technical',
    memberCount: 167,
    isJoined: false,
    icon: 'hardware-chip',
    isVerified: true,
    location: 'Robotics Lab',
    type: 'technical',
    tags: ['Robotics', 'IoT', 'Electronics'],
    recentActivity: 'New Arduino workshop scheduled',
    trending: false,
  },
  {
    id: '7',
    name: 'Music Band',
    description: 'Create melodies and perform at college events',
    category: 'Cultural',
    memberCount: 89,
    isJoined: false,
    icon: 'musical-notes',
    isVerified: false,
    location: 'Music Room',
    type: 'cultural',
    tags: ['Music', 'Performance', 'Instruments'],
    recentActivity: 'Auditions for new members',
    trending: false,
  },
  {
    id: '8',
    name: 'Entrepreneurship Cell',
    description: 'Foster innovation and startup culture',
    category: 'Business',
    memberCount: 445,
    isJoined: false,
    icon: 'bulb',
    isVerified: true,
    location: 'Innovation Hub',
    type: 'social',
    tags: ['Startups', 'Innovation', 'Business'],
    recentActivity: 'Pitch competition registration open',
    trending: true,
  },
  {
    id: '9',
    name: 'Literature Club',
    description: 'Explore the world of books and creative writing',
    category: 'Academic',
    memberCount: 312,
    isJoined: false,
    icon: 'book',
    isVerified: false,
    location: 'Library',
    type: 'academic',
    tags: ['Literature', 'Writing', 'Reading'],
    recentActivity: 'Poetry competition this week',
    trending: false,
  },
  {
    id: '10',
    name: 'Environmental Club',
    description: 'Protect our planet, one step at a time',
    category: 'Social',
    memberCount: 278,
    isJoined: false,
    icon: 'leaf',
    isVerified: false,
    location: 'Campus Garden',
    type: 'social',
    tags: ['Environment', 'Sustainability', 'Green Campus'],
    recentActivity: 'Tree plantation drive planned',
    trending: false,
  },
];

export const getJoinedCommunities = (): Community[] => {
  return mockCommunities.filter(community => community.isJoined);
};

export const getSuggestedCommunities = (): Community[] => {
  return mockCommunities.filter(community => !community.isJoined);
};

export const getTrendingCommunities = (): Community[] => {
  // Return communities with high activity (sorted by member count)
  return mockCommunities
    .filter(community => community.memberCount > 300)
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 3);
};

export const getCommunitiesByType = (type: Community['type']): Community[] => {
  return mockCommunities.filter(community => community.type === type);
};