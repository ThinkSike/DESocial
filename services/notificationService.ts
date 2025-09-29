// Notification service for DESocial push notifications and in-app notifications
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
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
import { Notification } from '../types';

class NotificationService {
  // Create a notification
  async createNotification(notificationData: {
    userId: string;
    title: string;
    body: string;
    type: 'post_like' | 'comment' | 'forum_answer' | 'announcement' | 'tribe_invite' | 'meetup_reminder';
    data?: any;
  }): Promise<string> {
    const notification: Omit<Notification, 'id'> = {
      userId: notificationData.userId,
      title: notificationData.title,
      body: notificationData.body,
      type: notificationData.type,
      data: notificationData.data,
      isRead: false,
      createdAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notification,
      createdAt: serverTimestamp()
    });

    return docRef.id;
  }

  // Send like notification
  async sendLikeNotification(postId: string, postAuthorId: string, likerName: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid === postAuthorId) return; // Don't notify self

    await this.createNotification({
      userId: postAuthorId,
      title: 'New Like',
      body: `${likerName} liked your post`,
      type: 'post_like',
      data: { postId, likerId: currentUser.uid }
    });
  }

  // Send comment notification
  async sendCommentNotification(postId: string, postAuthorId: string, commenterName: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid === postAuthorId) return; // Don't notify self

    await this.createNotification({
      userId: postAuthorId,
      title: 'New Comment',
      body: `${commenterName} commented on your post`,
      type: 'comment',
      data: { postId, commenterId: currentUser.uid }
    });
  }

  // Send forum answer notification
  async sendForumAnswerNotification(questionId: string, questionAuthorId: string, answererName: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid === questionAuthorId) return; // Don't notify self

    await this.createNotification({
      userId: questionAuthorId,
      title: 'New Answer',
      body: `${answererName} answered your question`,
      type: 'forum_answer',
      data: { questionId, answererId: currentUser.uid }
    });
  }

  // Send announcement notification to multiple users
  async sendAnnouncementNotification(announcementId: string, title: string, userIds: string[]): Promise<void> {
    const notifications = userIds.map(userId => ({
      userId,
      title: 'New Announcement',
      body: title,
      type: 'announcement' as const,
      data: { announcementId }
    }));

    // Create notifications for all users
    const promises = notifications.map(notificationData => 
      this.createNotification(notificationData)
    );

    await Promise.all(promises);
  }

  // Send tribe invite notification
  async sendTribeInviteNotification(tribeId: string, tribeName: string, invitedUserId: string, inviterName: string): Promise<void> {
    await this.createNotification({
      userId: invitedUserId,
      title: 'Tribe Invitation',
      body: `${inviterName} invited you to join ${tribeName}`,
      type: 'tribe_invite',
      data: { tribeId, inviterId: auth.currentUser?.uid }
    });
  }

  // Send meetup reminder notification
  async sendMeetupReminderNotification(meetupId: string, meetupTitle: string, attendeeIds: string[]): Promise<void> {
    const notifications = attendeeIds.map(userId => ({
      userId,
      title: 'Meetup Reminder',
      body: `Don't forget about "${meetupTitle}" happening soon!`,
      type: 'meetup_reminder' as const,
      data: { meetupId }
    }));

    const promises = notifications.map(notificationData => 
      this.createNotification(notificationData)
    );

    await Promise.all(promises);
  }

  // Get user notifications
  async getUserNotifications(limitCount = 50): Promise<Notification[]> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    } as Notification));
  }

  // Get unread notifications count
  async getUnreadCount(): Promise<number> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      where('isRead', '==', false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await updateDoc(doc(db, 'notifications', notificationId), {
      isRead: true
    });
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      where('isRead', '==', false)
    );

    const querySnapshot = await getDocs(q);
    const updatePromises = querySnapshot.docs.map(notificationDoc => 
      updateDoc(notificationDoc.ref, { isRead: true })
    );

    await Promise.all(updatePromises);
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    // Verify the notification belongs to the current user
    const notificationDoc = await getDocs(
      query(
        collection(db, 'notifications'),
        where('userId', '==', currentUser.uid)
      )
    );

    const notification = notificationDoc.docs.find(doc => doc.id === notificationId);
    if (!notification) {
      throw new Error('Notification not found or unauthorized');
    }

    await deleteDoc(doc(db, 'notifications', notificationId));
  }

  // Delete all notifications for user
  async deleteAllNotifications(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(notificationDoc => 
      deleteDoc(notificationDoc.ref)
    );

    await Promise.all(deletePromises);
  }

  // Listen to real-time notifications
  subscribeToNotifications(callback: (notifications: Notification[]) => void, limitCount = 50): () => void {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as Notification));
      
      callback(notifications);
    });
  }

  // Listen to unread count changes
  subscribeToUnreadCount(callback: (count: number) => void): () => void {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      where('isRead', '==', false)
    );

    return onSnapshot(q, (querySnapshot) => {
      callback(querySnapshot.size);
    });
  }

  // Clean up old notifications (older than 30 days)
  async cleanupOldNotifications(): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('User not authenticated');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      where('createdAt', '<', thirtyDaysAgo)
    );

    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(notificationDoc => 
      deleteDoc(notificationDoc.ref)
    );

    await Promise.all(deletePromises);
  }

  // Helper method to get all user IDs for a specific target audience
  async getUserIdsForTargetAudience(targetAudience: 'all' | 'year1' | 'year2' | 'year3' | 'year4' | string[]): Promise<string[]> {
    if (targetAudience === 'all') {
      // Get all user IDs
      const usersSnapshot = await getDocs(collection(db, 'users'));
      return usersSnapshot.docs.map(doc => doc.id);
    }

    if (typeof targetAudience === 'string') {
      // Get users by year
      const year = parseInt(targetAudience.replace('year', ''));
      const q = query(collection(db, 'users'), where('year', '==', year));
      const usersSnapshot = await getDocs(q);
      return usersSnapshot.docs.map(doc => doc.id);
    }

    // For specific branches/groups - this would need more complex querying
    // For now, return empty array as this is a complex query
    return [];
  }
}

export const notificationService = new NotificationService();