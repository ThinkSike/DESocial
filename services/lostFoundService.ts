// Lost & Found service for DESocial
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
    updateDoc,
    where,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { LostFoundItem } from '../types';

class LostFoundService {
  private lostFoundCollection = collection(db, 'lostFound');

  // Create a new lost/found item
  async createItem(
    itemData: {
      title: string;
      description: string;
      category: string;
      type: 'lost' | 'found';
      images: File[] | string[];
      location: {
        latitude: number;
        longitude: number;
        address: string;
      };
    },
    authorId: string,
    authorName: string,
    authorContact: string
  ): Promise<string> {
    try {
      let imageUrls: string[] = [];

      // Upload images
      if (itemData.images && itemData.images.length > 0) {
        imageUrls = await this.uploadImages(itemData.images, authorId);
      }

      const item: Omit<LostFoundItem, 'id'> = {
        authorId,
        authorName,
        authorContact,
        title: itemData.title,
        description: itemData.description,
        category: itemData.category as any,
        type: itemData.type,
        images: imageUrls,
        location: itemData.location,
        isClaimed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.lostFoundCollection, item);
      return docRef.id;
    } catch (error) {
      console.error('Create lost/found item error:', error);
      throw error;
    }
  }

  // Get lost/found items with filters
  async getItems(
    type?: 'lost' | 'found',
    category?: string,
    isClaimed?: boolean,
    limitCount: number = 20
  ): Promise<LostFoundItem[]> {
    try {
      let q = query(
        this.lostFoundCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      // Add filters
      if (type) {
        q = query(q, where('type', '==', type));
      }

      if (category) {
        q = query(q, where('category', '==', category));
      }

      if (typeof isClaimed === 'boolean') {
        q = query(q, where('isClaimed', '==', isClaimed));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as LostFoundItem[];
    } catch (error) {
      console.error('Get lost/found items error:', error);
      throw error;
    }
  }

  // Get items by location (within a radius)
  async getItemsByLocation(
    centerLat: number,
    centerLng: number,
    radiusKm: number = 1
  ): Promise<LostFoundItem[]> {
    try {
      // Note: This is a simple implementation. For production, consider using
      // GeoHash or Firestore's geographical queries for better performance
      const allItems = await this.getItems();
      
      return allItems.filter(item => {
        const distance = this.calculateDistance(
          centerLat,
          centerLng,
          item.location.latitude,
          item.location.longitude
        );
        return distance <= radiusKm;
      });
    } catch (error) {
      console.error('Get items by location error:', error);
      throw error;
    }
  }

  // Mark item as claimed
  async claimItem(itemId: string, claimedBy: string): Promise<void> {
    try {
      const itemRef = doc(db, 'lostFound', itemId);
      const itemDoc = await getDoc(itemRef);

      if (!itemDoc.exists()) {
        throw new Error('Item not found');
      }

      const item = itemDoc.data() as LostFoundItem;
      
      if (item.isClaimed) {
        throw new Error('Item already claimed');
      }

      await updateDoc(itemRef, {
        isClaimed: true,
        claimedBy,
        claimedAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Claim item error:', error);
      throw error;
    }
  }

  // Unclaim item (if user made mistake)
  async unclaimItem(itemId: string, userId: string): Promise<void> {
    try {
      const itemRef = doc(db, 'lostFound', itemId);
      const itemDoc = await getDoc(itemRef);

      if (!itemDoc.exists()) {
        throw new Error('Item not found');
      }

      const item = itemDoc.data() as LostFoundItem;
      
      // Only allow unclaiming by the person who claimed it or the item owner
      if (item.claimedBy !== userId && item.authorId !== userId) {
        throw new Error('Unauthorized to unclaim this item');
      }

      await updateDoc(itemRef, {
        isClaimed: false,
        claimedBy: null,
        claimedAt: null,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Unclaim item error:', error);
      throw error;
    }
  }

  // Update item details
  async updateItem(
    itemId: string,
    updates: Partial<LostFoundItem>,
    authorId: string
  ): Promise<void> {
    try {
      const itemRef = doc(db, 'lostFound', itemId);
      const itemDoc = await getDoc(itemRef);

      if (!itemDoc.exists()) {
        throw new Error('Item not found');
      }

      const item = itemDoc.data() as LostFoundItem;
      
      // Only allow updates by the item author
      if (item.authorId !== authorId) {
        throw new Error('Unauthorized to update this item');
      }

      await updateDoc(itemRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Update item error:', error);
      throw error;
    }
  }

  // Delete item
  async deleteItem(itemId: string, authorId: string): Promise<void> {
    try {
      const itemRef = doc(db, 'lostFound', itemId);
      const itemDoc = await getDoc(itemRef);

      if (!itemDoc.exists()) {
        throw new Error('Item not found');
      }

      const item = itemDoc.data() as LostFoundItem;
      
      // Only allow deletion by the item author
      if (item.authorId !== authorId) {
        throw new Error('Unauthorized to delete this item');
      }

      // Delete images from storage
      if (item.images && item.images.length > 0) {
        await this.deleteImages(item.images);
      }

      // Delete the item
      await deleteDoc(itemRef);
    } catch (error) {
      console.error('Delete item error:', error);
      throw error;
    }
  }

  // Search items
  async searchItems(searchTerm: string): Promise<LostFoundItem[]> {
    try {
      // Note: This is a basic implementation. For production, consider using
      // Algolia or Elasticsearch for better search capabilities
      const allItems = await this.getItems();
      
      return allItems.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.location.address.toLowerCase().includes(searchLower)
        );
      });
    } catch (error) {
      console.error('Search items error:', error);
      throw error;
    }
  }

  // Get user's items
  async getUserItems(userId: string): Promise<LostFoundItem[]> {
    try {
      const q = query(
        this.lostFoundCollection,
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as LostFoundItem[];
    } catch (error) {
      console.error('Get user items error:', error);
      throw error;
    }
  }

  // Listen to real-time updates
  subscribeToItems(
    callback: (items: LostFoundItem[]) => void,
    filters?: {
      type?: 'lost' | 'found';
      category?: string;
      isClaimed?: boolean;
    }
  ) {
    let q = query(
      this.lostFoundCollection,
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    // Apply filters
    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (typeof filters?.isClaimed === 'boolean') {
      q = query(q, where('isClaimed', '==', filters.isClaimed));
    }

    return onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as LostFoundItem[];
      callback(items);
    });
  }

  // Upload images to Firebase Storage
  private async uploadImages(images: File[] | string[], userId: string): Promise<string[]> {
    const uploadPromises = images.map(async (image, index) => {
      const timestamp = Date.now();
      const filename = `lost-found/${userId}/${timestamp}_${index}`;
      const storageRef = ref(storage, filename);

      let blob: Blob;
      if (typeof image === 'string') {
        // Convert base64 to blob
        const response = await fetch(image);
        blob = await response.blob();
      } else {
        blob = image;
      }

      await uploadBytes(storageRef, blob);
      return getDownloadURL(storageRef);
    });

    return Promise.all(uploadPromises);
  }

  // Delete images from Firebase Storage
  private async deleteImages(imageUrls: string[]): Promise<void> {
    const deletePromises = imageUrls.map(async (url) => {
      try {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    });

    await Promise.all(deletePromises);
  }

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Report an item as inappropriate
  async reportItem(itemId: string, reporterId: string, reason: string): Promise<void> {
    try {
      const reportData = {
        itemId,
        reporterId,
        reason,
        type: 'lostFoundItem',
        status: 'pending',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'reports'), reportData);
    } catch (error) {
      console.error('Report item error:', error);
      throw error;
    }
  }
}

export const lostFoundService = new LostFoundService();