// Post service for DESocial home feed
import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    increment,
    limit,
    onSnapshot,
    orderBy,
    query,
    startAfter,
    updateDoc,
    where,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Comment, CreatePostForm, Post } from '../types';

class PostService {
  private postsCollection = collection(db, 'posts');
  private commentsCollection = collection(db, 'comments');

  // Create a new post
  async createPost(postData: CreatePostForm, authorId: string, authorName: string, authorProfilePicture?: string): Promise<string> {
    try {
      let imageUrls: string[] = [];

      // Upload images if any
      if (postData.images && postData.images.length > 0) {
        imageUrls = await this.uploadImages(postData.images, authorId);
      }

      const post: Omit<Post, 'id'> = {
        authorId,
        authorName,
        authorProfilePicture,
        content: postData.content,
        images: imageUrls,
        likes: [],
        commentsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.postsCollection, post);
      return docRef.id;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  }

  // Get posts with pagination
  async getPosts(limitCount: number = 20, lastPostDoc?: any): Promise<Post[]> {
    try {
      let q = query(
        this.postsCollection,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastPostDoc) {
        q = query(q, startAfter(lastPostDoc));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
    } catch (error) {
      console.error('Get posts error:', error);
      throw error;
    }
  }

  // Get posts by specific user
  async getUserPosts(userId: string, limitCount: number = 10): Promise<Post[]> {
    try {
      const q = query(
        this.postsCollection,
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
    } catch (error) {
      console.error('Get user posts error:', error);
      throw error;
    }
  }

  // Like/unlike a post
  async toggleLike(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) {
        throw new Error('Post not found');
      }

      const post = postDoc.data() as Post;
      const isLiked = post.likes.includes(userId);

      if (isLiked) {
        // Unlike the post
        await updateDoc(postRef, {
          likes: arrayRemove(userId),
        });
      } else {
        // Like the post
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
        });
      }
    } catch (error) {
      console.error('Toggle like error:', error);
      throw error;
    }
  }

  // Add comment to a post
  async addComment(postId: string, content: string, authorId: string, authorName: string, authorProfilePicture?: string, parentCommentId?: string): Promise<string> {
    try {
      const comment: Omit<Comment, 'id'> = {
        postId,
        authorId,
        authorName,
        authorProfilePicture,
        content,
        parentCommentId,
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await addDoc(this.commentsCollection, comment);

      // Increment comments count on the post
      await updateDoc(doc(db, 'posts', postId), {
        commentsCount: increment(1),
      });

      return docRef.id;
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  }

  // Get comments for a post
  async getComments(postId: string): Promise<Comment[]> {
    try {
      const q = query(
        this.commentsCollection,
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Comment[];
    } catch (error) {
      console.error('Get comments error:', error);
      throw error;
    }
  }

  // Delete a post
  async deletePost(postId: string, authorId: string): Promise<void> {
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) {
        throw new Error('Post not found');
      }

      const post = postDoc.data() as Post;
      
      // Check if user is the author
      if (post.authorId !== authorId) {
        throw new Error('Unauthorized to delete this post');
      }

      // Delete images from storage
      if (post.images && post.images.length > 0) {
        await this.deleteImages(post.images);
      }

      // Delete all comments for this post
      const commentsQuery = query(this.commentsCollection, where('postId', '==', postId));
      const commentsSnapshot = await getDocs(commentsQuery);
      
      const deletePromises = commentsSnapshot.docs.map(commentDoc => 
        deleteDoc(doc(db, 'comments', commentDoc.id))
      );
      await Promise.all(deletePromises);

      // Delete the post
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }

  // Upload images to Firebase Storage
  private async uploadImages(images: File[] | string[], userId: string): Promise<string[]> {
    const uploadPromises = images.map(async (image, index) => {
      const timestamp = Date.now();
      const filename = `posts/${userId}/${timestamp}_${index}`;
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

  // Listen to real-time posts updates
  subscribeToPosts(callback: (posts: Post[]) => void, limitCount: number = 20) {
    const q = query(
      this.postsCollection,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (querySnapshot) => {
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      callback(posts);
    });
  }

  // Report a post
  async reportPost(postId: string, reporterId: string, reason: string): Promise<void> {
    try {
      const reportData = {
        postId,
        reporterId,
        reason,
        type: 'post',
        status: 'pending',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'reports'), reportData);
    } catch (error) {
      console.error('Report post error:', error);
      throw error;
    }
  }
}

export const postService = new PostService();