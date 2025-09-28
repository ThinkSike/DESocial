// Types for DESocial app

export interface User {
  uid: string;
  prn: string; // PRN (Permanent Registration Number)
  email: string;
  displayName: string;
  profilePicture?: string;
  year: number; // Academic year
  branch: string; // Engineering branch
  isAdmin: boolean;
  isVerified: boolean;
  joinedTribes: string[]; // Array of tribe IDs
  createdAt: Date;
  lastActive: Date;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorProfilePicture?: string;
  content: string;
  images?: string[]; // Array of image URLs
  likes: string[]; // Array of user IDs who liked
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorProfilePicture?: string;
  content: string;
  parentCommentId?: string; // For threaded comments
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  courseTags: string[];
  upvotes: string[]; // Array of user IDs
  downvotes: string[]; // Array of user IDs
  answersCount: number;
  isAnswered: boolean;
  bestAnswerId?: string;
  isModerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumAnswer {
  id: string;
  questionId: string;
  authorId: string;
  authorName: string;
  content: string;
  upvotes: string[];
  downvotes: string[];
  isBestAnswer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'events' | 'clubs' | 'placement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'year1' | 'year2' | 'year3' | 'year4' | string[]; // Can be specific branches
  attachments?: string[];
  eventDate?: Date;
  eventLocation?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tribe {
  id: string;
  name: string;
  description: string;
  category: string;
  coverImage?: string;
  adminIds: string[];
  memberIds: string[];
  isPrivate: boolean;
  maxMembers?: number;
  rules?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TribePost {
  id: string;
  tribeId: string;
  authorId: string;
  authorName: string;
  content: string;
  type: 'text' | 'poll' | 'meetup';
  pollOptions?: PollOption[];
  meetupDetails?: MeetupDetails;
  likes: string[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  votes: string[]; // Array of user IDs
}

export interface MeetupDetails {
  title: string;
  description: string;
  date: Date;
  location: string;
  maxAttendees?: number;
  attendees: string[]; // Array of user IDs
}

export interface LostFoundItem {
  id: string;
  authorId: string;
  authorName: string;
  authorContact: string;
  title: string;
  description: string;
  category: 'electronics' | 'accessories' | 'documents' | 'clothing' | 'books' | 'other';
  type: 'lost' | 'found';
  images: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isClaimed: boolean;
  claimedBy?: string;
  claimedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MapEvent {
  id: string;
  title: string;
  description: string;
  type: 'club' | 'class' | 'event' | 'lost_item' | 'social';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  startTime: Date;
  endTime?: Date;
  organizerId: string;
  attendees?: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'post_like' | 'comment' | 'forum_answer' | 'announcement' | 'tribe_invite' | 'meetup_reminder';
  data?: any; // Additional data based on notification type
  isRead: boolean;
  createdAt: Date;
}

// Form interfaces
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  prn: string;
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  year: number;
  branch: string;
  barcodeData: string; // For barcode verification
}

export interface CreatePostForm {
  content: string;
  images?: File[] | string[];
}

export interface CreateForumPostForm {
  title: string;
  content: string;
  courseTags: string[];
}

export interface CreateAnnouncementForm {
  title: string;
  content: string;
  category: string;
  priority: string;
  targetAudience: string | string[];
  eventDate?: Date;
  eventLocation?: string;
  attachments?: File[];
}