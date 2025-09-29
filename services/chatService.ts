// Chat service for DESocial messaging functionality
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
  readBy: string[]; // Array of user IDs who have read this message
}

export interface Chat {
  id: string;
  participants: string[]; // Array of user IDs
  participantNames: string[]; // Array of display names
  participantAvatars: string[]; // Array of avatar URLs
  lastMessage: string;
  lastMessageTime: Date;
  lastMessageSender: string;
  unreadCount: { [userId: string]: number };
  type: 'private' | 'group' | 'tribe';
  groupName?: string; // For group chats
  groupAvatar?: string;
  tribeId?: string; // For tribe chats
  createdAt: Date;
  updatedAt: Date;
}

class ChatService {
  // Create a new private chat between two users
  async createPrivateChat(otherUserId: string): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Check if chat already exists
    const existingChatId = await this.findPrivateChat(otherUserId);
    if (existingChatId) return existingChatId;

    // Get other user's info
    const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
    if (!otherUserDoc.exists()) throw new Error('User not found');
    
    const otherUser = otherUserDoc.data();
    const currentUserDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const currentUserData = currentUserDoc.data();

    // Create new chat
    const chatData: Omit<Chat, 'id'> = {
      participants: [currentUser.uid, otherUserId],
      participantNames: [currentUserData?.displayName || 'User', otherUser.displayName],
      participantAvatars: [currentUserData?.profilePicture || '', otherUser.profilePicture || ''],
      lastMessage: '',
      lastMessageTime: new Date(),
      lastMessageSender: '',
      unreadCount: { [currentUser.uid]: 0, [otherUserId]: 0 },
      type: 'private',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const chatRef = await addDoc(collection(db, 'chats'), chatData);
    return chatRef.id;
  }

  // Find existing private chat between current user and another user
  async findPrivateChat(otherUserId: string): Promise<string | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'chats'),
      where('type', '==', 'private'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    
    for (const doc of querySnapshot.docs) {
      const chat = doc.data();
      if (chat.participants.includes(otherUserId)) {
        return doc.id;
      }
    }

    return null;
  }

  // Create a group chat
  async createGroupChat(participantIds: string[], groupName: string): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Include current user in participants
    const allParticipants = [currentUser.uid, ...participantIds];
    
    // Get participant info
    const participantNames: string[] = [];
    const participantAvatars: string[] = [];
    
    for (const userId of allParticipants) {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      participantNames.push(userData?.displayName || 'User');
      participantAvatars.push(userData?.profilePicture || '');
    }

    // Create unread count object
    const unreadCount: { [userId: string]: number } = {};
    allParticipants.forEach(userId => {
      unreadCount[userId] = 0;
    });

    const chatData: Omit<Chat, 'id'> = {
      participants: allParticipants,
      participantNames,
      participantAvatars,
      lastMessage: '',
      lastMessageTime: new Date(),
      lastMessageSender: '',
      unreadCount,
      type: 'group',
      groupName,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const chatRef = await addDoc(collection(db, 'chats'), chatData);
    return chatRef.id;
  }

  // Create tribe chat (called when tribe is created)
  async createTribeChat(tribeId: string, tribeName: string, memberIds: string[]): Promise<string> {
    const unreadCount: { [userId: string]: number } = {};
    memberIds.forEach(userId => {
      unreadCount[userId] = 0;
    });

    // Get member info
    const participantNames: string[] = [];
    const participantAvatars: string[] = [];
    
    for (const userId of memberIds) {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      participantNames.push(userData?.displayName || 'User');
      participantAvatars.push(userData?.profilePicture || '');
    }

    const chatData: Omit<Chat, 'id'> = {
      participants: memberIds,
      participantNames,
      participantAvatars,
      lastMessage: '',
      lastMessageTime: new Date(),
      lastMessageSender: '',
      unreadCount,
      type: 'tribe',
      groupName: tribeName,
      tribeId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const chatRef = await addDoc(collection(db, 'chats'), chatData);
    return chatRef.id;
  }

  // Send a message
  async sendMessage(chatId: string, text: string, type: 'text' | 'image' | 'file' = 'text'): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Get current user data
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();

    // Create message
    const messageData: Omit<ChatMessage, 'id'> = {
      chatId,
      senderId: currentUser.uid,
      senderName: userData?.displayName || 'User',
      senderAvatar: userData?.profilePicture,
      text,
      timestamp: new Date(),
      type,
      isRead: false,
      readBy: [currentUser.uid] // Sender has read their own message
    };

    // Add message to messages subcollection
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      ...messageData,
      timestamp: serverTimestamp()
    });

    // Update chat's last message info
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    const chatData = chatDoc.data();

    if (chatData) {
      // Increment unread count for all participants except sender
      const newUnreadCount = { ...chatData.unreadCount };
      chatData.participants.forEach((participantId: string) => {
        if (participantId !== currentUser.uid) {
          newUnreadCount[participantId] = (newUnreadCount[participantId] || 0) + 1;
        }
      });

      await updateDoc(chatRef, {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        lastMessageSender: userData?.displayName || 'User',
        unreadCount: newUnreadCount,
        updatedAt: serverTimestamp()
      });
    }
  }

  // Get user's chats
  async getUserChats(): Promise<Chat[]> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Chat));
  }

  // Listen to real-time chat updates
  subscribeToUserChats(callback: (chats: Chat[]) => void): () => void {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const chats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastMessageTime: doc.data().lastMessageTime?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as Chat));
      
      callback(chats);
    });
  }

  // Listen to messages in a specific chat
  subscribeToMessages(chatId: string, callback: (messages: ChatMessage[]) => void): () => void {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      } as ChatMessage));
      
      callback(messages);
    });
  }

  // Mark messages as read
  async markMessagesAsRead(chatId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Update chat's unread count
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    const chatData = chatDoc.data();

    if (chatData) {
      const newUnreadCount = { ...chatData.unreadCount };
      newUnreadCount[currentUser.uid] = 0;

      await updateDoc(chatRef, {
        unreadCount: newUnreadCount
      });
    }

    // Mark individual messages as read
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, where('readBy', 'not-in', [[currentUser.uid]]));
    const querySnapshot = await getDocs(q);

    const updatePromises = querySnapshot.docs.map(messageDoc => 
      updateDoc(messageDoc.ref, {
        readBy: arrayUnion(currentUser.uid)
      })
    );

    await Promise.all(updatePromises);
  }

  // Add user to group chat
  async addUserToGroupChat(chatId: string, userId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Get user data
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) throw new Error('User not found');
    
    const userData = userDoc.data();

    // Update chat
    const chatRef = doc(db, 'chats', chatId);
    const chatDoc = await getDoc(chatRef);
    const chatData = chatDoc.data();

    if (chatData && !chatData.participants.includes(userId)) {
      await updateDoc(chatRef, {
        participants: arrayUnion(userId),
        participantNames: arrayUnion(userData.displayName),
        participantAvatars: arrayUnion(userData.profilePicture || ''),
        [`unreadCount.${userId}`]: 0,
        updatedAt: serverTimestamp()
      });
    }
  }

  // Get chat details
  async getChatDetails(chatId: string): Promise<Chat | null> {
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    if (!chatDoc.exists()) return null;

    return {
      id: chatDoc.id,
      ...chatDoc.data(),
      lastMessageTime: chatDoc.data().lastMessageTime?.toDate() || new Date(),
      createdAt: chatDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: chatDoc.data().updatedAt?.toDate() || new Date()
    } as Chat;
  }
}

export const chatService = new ChatService();