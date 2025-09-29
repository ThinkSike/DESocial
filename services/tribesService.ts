// Tribes service for DESocial group management functionality
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { MeetupDetails, PollOption, Tribe, TribePost } from '../types';
import { chatService } from './chatService';

class TribesService {
  // Create a new tribe
  async createTribe(tribeData: {
    name: string;
    description: string;
    category: string;
    isPrivate: boolean;
    maxMembers: number;
    rules?: string[];
  }): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Get current user data for chat creation
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    userDoc.data(); // Used for chat creation

    const tribe: Omit<Tribe, 'id'> = {
      name: tribeData.name,
      description: tribeData.description,
      category: tribeData.category,
      adminIds: [currentUser.uid],
      memberIds: [currentUser.uid], // Creator is automatically a member
      isPrivate: tribeData.isPrivate,
      maxMembers: tribeData.maxMembers,
      rules: tribeData.rules || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create tribe document
    const tribeRef = await addDoc(collection(db, 'tribes'), {
      ...tribe,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Add tribe ID to user's joinedTribes
    await updateDoc(doc(db, 'users', currentUser.uid), {
      joinedTribes: arrayUnion(tribeRef.id)
    });

    // Create tribe chat
    await chatService.createTribeChat(tribeRef.id, tribeData.name, [currentUser.uid]);

    return tribeRef.id;
  }

  // Join a tribe
  async joinTribe(tribeId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Get tribe data
    const tribeDoc = await getDoc(doc(db, 'tribes', tribeId));
    if (!tribeDoc.exists()) throw new Error('Tribe not found');

    const tribeData = tribeDoc.data() as Tribe;

    // Check if user is already a member
    if (tribeData.memberIds.includes(currentUser.uid)) {
      throw new Error('Already a member of this tribe');
    }

    // Check if tribe is full
    if (tribeData.maxMembers && tribeData.memberIds.length >= tribeData.maxMembers) {
      throw new Error('Tribe is full');
    }

    // Add user to tribe members
    await updateDoc(doc(db, 'tribes', tribeId), {
      memberIds: arrayUnion(currentUser.uid),
      updatedAt: serverTimestamp()
    });

    // Add tribe to user's joinedTribes
    await updateDoc(doc(db, 'users', currentUser.uid), {
      joinedTribes: arrayUnion(tribeId)
    });

    // Add user to tribe chat
    const tribeChats = await getDocs(
      query(collection(db, 'chats'), where('tribeId', '==', tribeId))
    );

    if (!tribeChats.empty) {
      const chatId = tribeChats.docs[0].id;
      await chatService.addUserToGroupChat(chatId, currentUser.uid);
    }
  }

  // Leave a tribe
  async leaveTribe(tribeId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Get tribe data
    const tribeDoc = await getDoc(doc(db, 'tribes', tribeId));
    if (!tribeDoc.exists()) throw new Error('Tribe not found');

    const tribeData = tribeDoc.data() as Tribe;

    // Check if user is an admin (can't leave if they're the only admin)
    if (tribeData.adminIds.includes(currentUser.uid) && tribeData.adminIds.length === 1) {
      throw new Error('Cannot leave tribe as the only admin. Transfer admin rights first.');
    }

    // Remove user from tribe members and admins
    await updateDoc(doc(db, 'tribes', tribeId), {
      memberIds: arrayRemove(currentUser.uid),
      adminIds: arrayRemove(currentUser.uid),
      updatedAt: serverTimestamp()
    });

    // Remove tribe from user's joinedTribes
    await updateDoc(doc(db, 'users', currentUser.uid), {
      joinedTribes: arrayRemove(tribeId)
    });
  }

  // Get all tribes (with optional category filter)
  async getTribes(category?: string, limit = 20): Promise<Tribe[]> {
    let q = query(
      collection(db, 'tribes'),
      orderBy('updatedAt', 'desc')
    );

    if (category && category !== 'all') {
      q = query(
        collection(db, 'tribes'),
        where('category', '==', category),
        orderBy('updatedAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    } as Tribe));
  }

  // Get user's tribes
  async getUserTribes(): Promise<Tribe[]> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    
    if (!userData?.joinedTribes || userData.joinedTribes.length === 0) {
      return [];
    }

    // Get tribes data
    const tribes: Tribe[] = [];
    for (const tribeId of userData.joinedTribes) {
      const tribeDoc = await getDoc(doc(db, 'tribes', tribeId));
      if (tribeDoc.exists()) {
        tribes.push({
          id: tribeDoc.id,
          ...tribeDoc.data(),
          createdAt: tribeDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: tribeDoc.data().updatedAt?.toDate() || new Date()
        } as Tribe);
      }
    }

    return tribes;
  }

  // Get tribe details
  async getTribeDetails(tribeId: string): Promise<Tribe | null> {
    const tribeDoc = await getDoc(doc(db, 'tribes', tribeId));
    if (!tribeDoc.exists()) return null;

    return {
      id: tribeDoc.id,
      ...tribeDoc.data(),
      createdAt: tribeDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: tribeDoc.data().updatedAt?.toDate() || new Date()
    } as Tribe;
  }

  // Create a post in a tribe
  async createTribePost(tribeId: string, postData: {
    content: string;
    type: 'text' | 'poll' | 'meetup';
    pollOptions?: string[];
    meetupDetails?: Omit<MeetupDetails, 'attendees'>;
  }): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Check if user is a member of the tribe
    const tribeDoc = await getDoc(doc(db, 'tribes', tribeId));
    if (!tribeDoc.exists()) throw new Error('Tribe not found');

    const tribeData = tribeDoc.data() as Tribe;
    if (!tribeData.memberIds.includes(currentUser.uid)) {
      throw new Error('Not a member of this tribe');
    }

    // Get user data
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();

    // Prepare poll options if it's a poll
    let pollOptions: PollOption[] | undefined;
    if (postData.type === 'poll' && postData.pollOptions) {
      pollOptions = postData.pollOptions.map((option, index) => ({
        id: `option_${index}`,
        text: option,
        votes: []
      }));
    }

    // Prepare meetup details if it's a meetup
    let meetupDetails: MeetupDetails | undefined;
    if (postData.type === 'meetup' && postData.meetupDetails) {
      meetupDetails = {
        ...postData.meetupDetails,
        attendees: []
      };
    }

    const post: Omit<TribePost, 'id'> = {
      tribeId,
      authorId: currentUser.uid,
      authorName: userData?.displayName || 'User',
      content: postData.content,
      type: postData.type,
      pollOptions,
      meetupDetails,
      likes: [],
      commentsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const postRef = await addDoc(collection(db, 'tribePosts'), {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return postRef.id;
  }

  // Get tribe posts
  async getTribePosts(tribeId: string, limitCount = 20): Promise<TribePost[]> {
    const q = query(
      collection(db, 'tribePosts'),
      where('tribeId', '==', tribeId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    } as TribePost));
  }

  // Vote on a poll
  async voteOnPoll(postId: string, optionId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const postDoc = await getDoc(doc(db, 'tribePosts', postId));
    if (!postDoc.exists()) throw new Error('Post not found');

    const postData = postDoc.data() as TribePost;
    if (postData.type !== 'poll' || !postData.pollOptions) {
      throw new Error('This post is not a poll');
    }

    // Remove user's previous vote if any
    const updatedOptions = postData.pollOptions.map(option => ({
      ...option,
      votes: option.votes.filter(userId => userId !== currentUser.uid)
    }));

    // Add user's vote to selected option
    const targetOptionIndex = updatedOptions.findIndex(option => option.id === optionId);
    if (targetOptionIndex === -1) throw new Error('Invalid poll option');

    updatedOptions[targetOptionIndex].votes.push(currentUser.uid);

    // Update post
    await updateDoc(doc(db, 'tribePosts', postId), {
      pollOptions: updatedOptions,
      updatedAt: serverTimestamp()
    });
  }

  // RSVP to a meetup
  async rsvpMeetup(postId: string, attending: boolean): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const postDoc = await getDoc(doc(db, 'tribePosts', postId));
    if (!postDoc.exists()) throw new Error('Post not found');

    const postData = postDoc.data() as TribePost;
    if (postData.type !== 'meetup' || !postData.meetupDetails) {
      throw new Error('This post is not a meetup');
    }

    const currentAttendees = postData.meetupDetails.attendees || [];
    let updatedAttendees: string[];

    if (attending) {
      // Check if meetup is full
      if (postData.meetupDetails.maxAttendees && 
          currentAttendees.length >= postData.meetupDetails.maxAttendees) {
        throw new Error('Meetup is full');
      }

      // Add user to attendees if not already attending
      updatedAttendees = currentAttendees.includes(currentUser.uid) 
        ? currentAttendees 
        : [...currentAttendees, currentUser.uid];
    } else {
      // Remove user from attendees
      updatedAttendees = currentAttendees.filter(userId => userId !== currentUser.uid);
    }

    // Update post
    await updateDoc(doc(db, 'tribePosts', postId), {
      'meetupDetails.attendees': updatedAttendees,
      updatedAt: serverTimestamp()
    });
  }

  // Like/unlike a tribe post
  async toggleLikeTribePost(postId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const postDoc = await getDoc(doc(db, 'tribePosts', postId));
    if (!postDoc.exists()) throw new Error('Post not found');

    const postData = postDoc.data() as TribePost;
    const isLiked = postData.likes.includes(currentUser.uid);

    if (isLiked) {
      // Unlike
      await updateDoc(doc(db, 'tribePosts', postId), {
        likes: arrayRemove(currentUser.uid),
        updatedAt: serverTimestamp()
      });
    } else {
      // Like
      await updateDoc(doc(db, 'tribePosts', postId), {
        likes: arrayUnion(currentUser.uid),
        updatedAt: serverTimestamp()
      });
    }
  }

  // Update tribe settings (admin only)
  async updateTribe(tribeId: string, updates: Partial<Omit<Tribe, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const tribeDoc = await getDoc(doc(db, 'tribes', tribeId));
    if (!tribeDoc.exists()) throw new Error('Tribe not found');

    const tribeData = tribeDoc.data() as Tribe;
    if (!tribeData.adminIds.includes(currentUser.uid)) {
      throw new Error('Only admins can update tribe settings');
    }

    await updateDoc(doc(db, 'tribes', tribeId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  // Listen to real-time tribe updates
  subscribeToTribes(callback: (tribes: Tribe[]) => void, category?: string): () => void {
    let q = query(
      collection(db, 'tribes'),
      orderBy('updatedAt', 'desc')
    );

    if (category && category !== 'all') {
      q = query(
        collection(db, 'tribes'),
        where('category', '==', category),
        orderBy('updatedAt', 'desc')
      );
    }

    return onSnapshot(q, (querySnapshot) => {
      const tribes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as Tribe));
      
      callback(tribes);
    });
  }

  // Listen to tribe posts
  subscribeToTribePosts(tribeId: string, callback: (posts: TribePost[]) => void): () => void {
    const q = query(
      collection(db, 'tribePosts'),
      where('tribeId', '==', tribeId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as TribePost));
      
      callback(posts);
    });
  }
}

export const tribesService = new TribesService();