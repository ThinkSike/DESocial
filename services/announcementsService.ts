// Announcements service for DESocial admin announcements functionality
import {
    addDoc,
    collection,
    deleteDoc,
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
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../config/firebase';
import { Announcement, CreateAnnouncementForm } from '../types';

class AnnouncementsService {
  // Create a new announcement (admin only)
  async createAnnouncement(announcementData: CreateAnnouncementForm): Promise<string> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Get current user data to check admin status
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    
    if (!userData?.isAdmin) {
      throw new Error('Only administrators can create announcements');
    }

    // Upload attachments if any
    let attachmentUrls: string[] = [];
    if (announcementData.attachments && announcementData.attachments.length > 0) {
      attachmentUrls = await this.uploadAttachments(announcementData.attachments, currentUser.uid);
    }

    // Prepare target audience
    let targetAudience: 'all' | 'year1' | 'year2' | 'year3' | 'year4' | string[];
    if (typeof announcementData.targetAudience === 'string') {
      targetAudience = announcementData.targetAudience as 'all' | 'year1' | 'year2' | 'year3' | 'year4';
    } else {
      targetAudience = announcementData.targetAudience;
    }

    const announcement: Omit<Announcement, 'id'> = {
      authorId: currentUser.uid,
      authorName: userData.displayName || 'Admin',
      title: announcementData.title,
      content: announcementData.content,
      category: announcementData.category as 'general' | 'academic' | 'events' | 'clubs' | 'placement',
      priority: announcementData.priority as 'low' | 'medium' | 'high' | 'urgent',
      targetAudience,
      attachments: attachmentUrls,
      eventDate: announcementData.eventDate,
      eventLocation: announcementData.eventLocation,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'announcements'), {
      ...announcement,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return docRef.id;
  }

  // Get announcements with optional filtering
  async getAnnouncements(options?: {
    category?: string;
    priority?: string;
    targetAudience?: string;
    limitCount?: number;
  }): Promise<Announcement[]> {
    let q = query(
      collection(db, 'announcements'),
      where('isActive', '==', true),
      orderBy('priority', 'desc'), // Show urgent/high priority first
      orderBy('createdAt', 'desc'),
      limit(options?.limitCount || 20)
    );

    // Apply filters
    if (options?.category && options.category !== 'all') {
      q = query(
        collection(db, 'announcements'),
        where('isActive', '==', true),
        where('category', '==', options.category),
        orderBy('priority', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(options?.limitCount || 20)
      );
    }

    const querySnapshot = await getDocs(q);
    const announcements = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      eventDate: doc.data().eventDate?.toDate()
    } as Announcement));

    // Filter by target audience if specified
    if (options?.targetAudience && options.targetAudience !== 'all') {
      return announcements.filter(announcement => {
        if (announcement.targetAudience === 'all') return true;
        if (typeof announcement.targetAudience === 'string') {
          return announcement.targetAudience === options.targetAudience;
        }
        return announcement.targetAudience.includes(options.targetAudience!);
      });
    }

    return announcements;
  }

  // Get announcements for current user (based on their year and branch)
  async getUserAnnouncements(limitCount = 20): Promise<Announcement[]> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Get user data to determine target audience
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    
    if (!userData) throw new Error('User data not found');

    const userYear = `year${userData.year}` as 'year1' | 'year2' | 'year3' | 'year4';
    const userBranch = userData.branch;

    // Get all active announcements
    const q = query(
      collection(db, 'announcements'),
      where('isActive', '==', true),
      orderBy('priority', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const allAnnouncements = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      eventDate: doc.data().eventDate?.toDate()
    } as Announcement));

    // Filter announcements based on target audience
    return allAnnouncements.filter(announcement => {
      // If announcement is for all users
      if (announcement.targetAudience === 'all') return true;
      
      // If announcement is for specific year
      if (announcement.targetAudience === userYear) return true;
      
      // If announcement is for specific branches/groups
      if (Array.isArray(announcement.targetAudience)) {
        return announcement.targetAudience.includes(userBranch) || 
               announcement.targetAudience.includes(userYear);
      }
      
      return false;
    });
  }

  // Get announcement details
  async getAnnouncementDetails(announcementId: string): Promise<Announcement | null> {
    const announcementDoc = await getDoc(doc(db, 'announcements', announcementId));
    if (!announcementDoc.exists()) return null;

    return {
      id: announcementDoc.id,
      ...announcementDoc.data(),
      createdAt: announcementDoc.data().createdAt?.toDate() || new Date(),
      updatedAt: announcementDoc.data().updatedAt?.toDate() || new Date(),
      eventDate: announcementDoc.data().eventDate?.toDate()
    } as Announcement;
  }

  // Update announcement (admin only)
  async updateAnnouncement(
    announcementId: string, 
    updates: Partial<Omit<Announcement, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Check admin status
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    
    if (!userData?.isAdmin) {
      throw new Error('Only administrators can update announcements');
    }

    // Check if announcement exists and user is the author
    const announcementDoc = await getDoc(doc(db, 'announcements', announcementId));
    if (!announcementDoc.exists()) {
      throw new Error('Announcement not found');
    }

    const announcementData = announcementDoc.data() as Announcement;
    if (announcementData.authorId !== currentUser.uid && !userData.isAdmin) {
      throw new Error('Only the author or admin can update this announcement');
    }

    await updateDoc(doc(db, 'announcements', announcementId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  // Delete announcement (admin only)
  async deleteAnnouncement(announcementId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Check admin status
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    
    if (!userData?.isAdmin) {
      throw new Error('Only administrators can delete announcements');
    }

    // Get announcement data
    const announcementDoc = await getDoc(doc(db, 'announcements', announcementId));
    if (!announcementDoc.exists()) {
      throw new Error('Announcement not found');
    }

    const announcementData = announcementDoc.data() as Announcement;

    // Delete attachments from storage
    if (announcementData.attachments && announcementData.attachments.length > 0) {
      await this.deleteAttachments(announcementData.attachments);
    }

    // Delete the announcement document
    await deleteDoc(doc(db, 'announcements', announcementId));
  }

  // Deactivate announcement (soft delete)
  async deactivateAnnouncement(announcementId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Check admin status
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const userData = userDoc.data();
    
    if (!userData?.isAdmin) {
      throw new Error('Only administrators can deactivate announcements');
    }

    await updateDoc(doc(db, 'announcements', announcementId), {
      isActive: false,
      updatedAt: serverTimestamp()
    });
  }

  // Listen to real-time announcements updates
  subscribeToAnnouncements(
    callback: (announcements: Announcement[]) => void,
    options?: {
      category?: string;
      targetAudience?: string;
      limitCount?: number;
    }
  ): () => void {
    let q = query(
      collection(db, 'announcements'),
      where('isActive', '==', true),
      orderBy('priority', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(options?.limitCount || 20)
    );

    // Apply category filter
    if (options?.category && options.category !== 'all') {
      q = query(
        collection(db, 'announcements'),
        where('isActive', '==', true),
        where('category', '==', options.category),
        orderBy('priority', 'desc'),
        orderBy('createdAt', 'desc'),
        limit(options?.limitCount || 20)
      );
    }

    return onSnapshot(q, (querySnapshot) => {
      let announcements = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        eventDate: doc.data().eventDate?.toDate()
      } as Announcement));

      // Filter by target audience if specified
      if (options?.targetAudience && options.targetAudience !== 'all') {
        announcements = announcements.filter(announcement => {
          if (announcement.targetAudience === 'all') return true;
          if (typeof announcement.targetAudience === 'string') {
            return announcement.targetAudience === options.targetAudience;
          }
          return announcement.targetAudience.includes(options.targetAudience!);
        });
      }

      callback(announcements);
    });
  }

  // Get upcoming events from announcements
  async getUpcomingEvents(limitCount = 10): Promise<Announcement[]> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const now = new Date();
    
    const q = query(
      collection(db, 'announcements'),
      where('isActive', '==', true),
      where('category', '==', 'events'),
      orderBy('eventDate', 'asc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      eventDate: doc.data().eventDate?.toDate()
    } as Announcement));

    // Filter future events only
    return events.filter(event => 
      event.eventDate && event.eventDate > now
    );
  }

  // Search announcements
  async searchAnnouncements(searchTerm: string, category?: string): Promise<Announcement[]> {
    // Note: Firestore doesn't support full-text search natively
    // This is a basic implementation - for production, consider using Algolia or similar
    
    let q = query(
      collection(db, 'announcements'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    if (category && category !== 'all') {
      q = query(
        collection(db, 'announcements'),
        where('isActive', '==', true),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
    }

    const querySnapshot = await getDocs(q);
    const allAnnouncements = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      eventDate: doc.data().eventDate?.toDate()
    } as Announcement));

    // Filter by search term (title and content)
    const searchTermLower = searchTerm.toLowerCase();
    return allAnnouncements.filter(announcement => 
      announcement.title.toLowerCase().includes(searchTermLower) ||
      announcement.content.toLowerCase().includes(searchTermLower)
    );
  }

  // Upload attachments to Firebase Storage
  private async uploadAttachments(attachments: File[], userId: string): Promise<string[]> {
    const uploadPromises = attachments.map(async (file, index) => {
      const timestamp = Date.now();
      const filename = `announcements/${userId}/${timestamp}_${index}_${file.name}`;
      const storageRef = ref(storage, filename);

      await uploadBytes(storageRef, file);
      return getDownloadURL(storageRef);
    });

    return Promise.all(uploadPromises);
  }

  // Delete attachments from Firebase Storage
  private async deleteAttachments(attachmentUrls: string[]): Promise<void> {
    const deletePromises = attachmentUrls.map(async (url) => {
      try {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
      } catch (error) {
        console.error('Error deleting attachment:', error);
      }
    });

    await Promise.all(deletePromises);
  }
}

export const announcementsService = new AnnouncementsService();