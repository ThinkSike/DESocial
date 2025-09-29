// Chat service for DESocial - Real-time Firebase Messaging
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Chat interface for Firebase data structure
export interface Chat {
  id: string;
  type: 'private' | 'group';
  participants: { [userId: string]: boolean };
  participantNames: { [userId: string]: string };
  participantAvatars: { [userId: string]: string };
  groupName?: string;
  groupAvatar?: string;
  lastMessage: string;
  lastMessageTime: number;
  lastMessageSender: string;
  unreadCount: { [userId: string]: number };
  createdAt: number;
  updatedAt: number;
}

// Message interface
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'file';
  timestamp: number;
  isRead: boolean;
  replyTo?: string;
}

class ChatService {
  subscribeToUserChats(callback: (chats: Chat[]) => void): () => void {
    const user = auth.currentUser;
    if (!user) {
      console.warn('No authenticated user for chat subscription');
      callback([]);
      return () => {};
    }

    try {
      // Use a simple query for better performance initially
      const chatsQuery = query(
        collection(db, 'chats'),
        where(`participants.${user.uid}`, '==', true)
      );

      return onSnapshot(chatsQuery, 
        {
          // Add includeMetadataChanges to reduce unnecessary calls
          includeMetadataChanges: false
        },
        (snapshot: QuerySnapshot<DocumentData>) => {
          // Early return if no changes to prevent unnecessary rendering
          if (snapshot.empty) {
            callback([]);
            return;
          }

          const chats: Chat[] = [];
          
          snapshot.forEach((doc) => {
            try {
              const data = doc.data();
              
              const lastMessageTime = data.lastMessageTime instanceof Timestamp 
                ? data.lastMessageTime.toMillis() 
                : data.lastMessageTime || Date.now();
              
              const createdAt = data.createdAt instanceof Timestamp 
                ? data.createdAt.toMillis() 
                : data.createdAt || Date.now();
              
              const updatedAt = data.updatedAt instanceof Timestamp 
                ? data.updatedAt.toMillis() 
                : data.updatedAt || Date.now();

              const chat: Chat = {
                id: doc.id,
                type: data.type || 'private',
                participants: data.participants || {},
                participantNames: data.participantNames || {},
                participantAvatars: data.participantAvatars || {},
                groupName: data.groupName,
                groupAvatar: data.groupAvatar,
                lastMessage: data.lastMessage || '',
                lastMessageTime,
                lastMessageSender: data.lastMessageSender || '',
                unreadCount: data.unreadCount || {},
                createdAt,
                updatedAt,
              };
              
              chats.push(chat);
            } catch (docError) {
              console.warn('Error processing chat document:', doc.id, docError);
            }
          });

          // Sort by last message time (most recent first)
          chats.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

          console.log(`Successfully loaded ${chats.length} chats for user ${user.uid}`);
          callback(chats);
        }, 
        (error) => {
          console.error('Error subscribing to chats:', error);
          
          // Check if it's a network/connection error
          if (error.code === 'unavailable' || error.code === 'deadline-exceeded' || 
              error.code === 'failed-precondition' ||
              error.message?.includes('network') || error.message?.includes('offline')) {
            console.warn('Firestore connection issue detected:', error.code || error.message);
          }
          
          // Still call callback with empty array to prevent hanging
          callback([]);
        }
      );

    } catch (error) {
      console.error('Failed to setup chat subscription:', error);
      callback([]);
      return () => {};
    }
  }

  // Subscribe to messages in a specific chat
  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void): () => void {
    try {
      const messagesQuery = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'asc')
      );

      return onSnapshot(messagesQuery, (snapshot: QuerySnapshot<DocumentData>) => {
        const messages: Message[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          const timestamp = data.timestamp instanceof Timestamp 
            ? data.timestamp.toMillis() 
            : data.timestamp || Date.now();

          const message: Message = {
            id: doc.id,
            chatId,
            senderId: data.senderId || '',
            senderName: data.senderName || 'Unknown User',
            content: data.content || '',
            type: data.type || 'text',
            timestamp,
            isRead: data.isRead || false,
            replyTo: data.replyTo,
          };
          
          messages.push(message);
        });

        callback(messages);
      }, (error) => {
        console.error('Error subscribing to messages:', error);
        callback([]);
      });

    } catch (error) {
      console.error('Failed to setup message subscription:', error);
      callback([]);
      return () => {};
    }
  }

  // Send a message to a chat
  async sendMessage(chatId: string, content: string, type: 'text' | 'image' | 'file' = 'text'): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to send messages');
    }

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: user.uid,
        senderName: user.displayName || 'Unknown User',
        content,
        type,
        timestamp: serverTimestamp(),
        isRead: false,
      });

      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: content,
        lastMessageTime: serverTimestamp(),
        lastMessageSender: user.uid,
        updatedAt: serverTimestamp(),
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  // Create a new private chat
  async createPrivateChat(otherUserId: string, otherUserName: string): Promise<string> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated to create chats');
    }

    try {
      // Check if chat already exists between these users
      const existingChatsQuery = query(
        collection(db, 'chats'),
        where(`participants.${user.uid}`, '==', true),
        where(`participants.${otherUserId}`, '==', true),
        where('type', '==', 'private')
      );

      const existingChats = await getDocs(existingChatsQuery);
      
      if (!existingChats.empty) {
        return existingChats.docs[0].id;
      }

      // Create new chat
      const chatData = {
        type: 'private',
        participants: {
          [user.uid]: true,
          [otherUserId]: true,
        },
        participantNames: {
          [user.uid]: user.displayName || 'User',
          [otherUserId]: otherUserName,
        },
        participantAvatars: {
          [user.uid]: user.displayName?.charAt(0) || 'U',
          [otherUserId]: otherUserName.charAt(0),
        },
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        lastMessageSender: '',
        unreadCount: {
          [user.uid]: 0,
          [otherUserId]: 0,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const chatRef = await addDoc(collection(db, 'chats'), chatData);
      return chatRef.id;

    } catch (error) {
      console.error('Failed to create private chat:', error);
      throw error;
    }
  }

  // Get chat details by ID
  async getChatById(chatId: string): Promise<Chat | null> {
    try {
      const chatDoc = await getDoc(doc(db, 'chats', chatId));
      
      if (!chatDoc.exists()) {
        return null;
      }

      const data = chatDoc.data();
      
      const lastMessageTime = data.lastMessageTime instanceof Timestamp 
        ? data.lastMessageTime.toMillis() 
        : data.lastMessageTime || Date.now();
      
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toMillis() 
        : data.createdAt || Date.now();
      
      const updatedAt = data.updatedAt instanceof Timestamp 
        ? data.updatedAt.toMillis() 
        : data.updatedAt || Date.now();

      return {
        id: chatDoc.id,
        type: data.type || 'private',
        participants: data.participants || {},
        participantNames: data.participantNames || {},
        participantAvatars: data.participantAvatars || {},
        groupName: data.groupName,
        groupAvatar: data.groupAvatar,
        lastMessage: data.lastMessage || '',
        lastMessageTime,
        lastMessageSender: data.lastMessageSender || '',
        unreadCount: data.unreadCount || {},
        createdAt,
        updatedAt,
      };

    } catch (error) {
      console.error('Failed to get chat by ID:', error);
      return null;
    }
  }
}

export const chatService = new ChatService();