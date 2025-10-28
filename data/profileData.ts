import type { Post } from '@/types/post';
import type { UserProfile } from '@/types/profile';

export const mockCurrentUser: UserProfile = {
  id: 'current-user',
  username: 'guest',
  displayName: 'Guest',
  avatar: 'https://i.pravatar.cc/120?img=5',
  prn: 'PRN12345678',
  department: 'Computer Science',
};

export const getCurrentUserPosts = (): Post[] => {
  // TODO: fetch from Firestore for the current user
  return [];
};