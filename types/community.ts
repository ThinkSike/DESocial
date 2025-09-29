export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  isJoined: boolean;
  coverImage?: string;
  icon?: string;
  isVerified?: boolean;
  location?: string;
  type: 'academic' | 'sports' | 'cultural' | 'technical' | 'social' | 'hobby';
  tags?: string[];
  recentActivity?: string;
  trending?: boolean;
}

export interface CommunityJoinRequest {
  communityId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
}

export interface CommunityPost {
  id: string;
  communityId: string;
  authorId: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isAnnouncement?: boolean;
}