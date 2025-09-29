import { UserProfile } from '@/types/profile';
import { mockPosts } from './mockData';

// Mock current user profile
export const mockCurrentUser: UserProfile = {
  id: 'current-user',
  prn: 'PRN2023001', // College Primary Registration Number
  username: 'PRN2023001', // Initially same as PRN, can be changed later
  displayName: 'John Doe',
  avatar: 'https://i.pravatar.cc/150?img=20',
  verified: false,
  bio: '"Code is poetry written in logic"',
  location: 'Mumbai, India',
  website: 'https://johndoe.dev',
  department: 'Computer Science',
  year: '3rd Year',
  batch: '2023-2027',
  joinedDate: new Date('2023-08-15'),
  isPrivate: false,
  stats: {
    postsCount: 47,
    followersCount: 1284,
    followingCount: 892,
  },
};

// Mock other user profiles for testing
export const mockOtherUsers: UserProfile[] = [
  {
    id: 'user1',
    prn: 'PRN2023002',
    username: 'alex_tech',
    displayName: 'Alex Chen',
    avatar: 'https://i.pravatar.cc/150?img=1',
    verified: true,
    bio: '🚀 Tech enthusiast | Building the future one line at a time',
    location: 'Delhi, India',
    department: 'Information Technology',
    year: '4th Year',
    batch: '2022-2026',
    joinedDate: new Date('2023-07-20'),
    isPrivate: false,
    stats: {
      postsCount: 89,
      followersCount: 2456,
      followingCount: 743,
    },
  },
  {
    id: 'user2',
    prn: 'PRN2024001',
    username: 'sarah_design',
    displayName: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    verified: false,
    bio: '🎨 UI/UX Designer | Making digital experiences beautiful',
    location: 'Bangalore, India',
    department: 'Design',
    year: '2nd Year',
    batch: '2024-2028',
    joinedDate: new Date('2024-08-01'),
    isPrivate: false,
    stats: {
      postsCount: 23,
      followersCount: 567,
      followingCount: 445,
    },
  },
];

// Get user posts (filtered by user ID)
export const getUserPosts = (userId: string) => {
  return mockPosts.filter(post => post.user.id === userId);
};

// Get current user posts
export const getCurrentUserPosts = () => {
  // For demo, return a few posts as if they belong to current user
  return mockPosts.slice(0, 6).map(post => ({
    ...post,
    user: {
      ...mockCurrentUser,
      id: mockCurrentUser.id,
      username: mockCurrentUser.username,
      displayName: mockCurrentUser.displayName,
      avatar: mockCurrentUser.avatar,
    }
  }));
};